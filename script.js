document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('matrixCanvas');
    const ctx = canvas.getContext('2d');
    const overlayText = document.getElementById('overlay-text');
    const heartContainer = document.getElementById('heart-container');

    // Control elements
    const changeTextBtn = document.getElementById('changeTextBtn');
    const changeColorBtn = document.getElementById('changeColorBtn');
    const speedRange = document.getElementById('speedRange');
    const setCustomTextBtn = document.getElementById('setCustomTextBtn');
    const customMessageInput = document.getElementById('customMessageInput');

    // เพิ่มขนาดตัวอักษร
    const fontSize = 28;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Matrix effect variables
    let matrixWord = 'Love You'; // ✅ เปลี่ยนเป็น let เพื่อให้เปลี่ยนค่าได้
    let columns = canvas.width / fontSize;
    const drops = [];

    let matrixInterval;
    let matrixColor = '#FF1493'; // สีเริ่มต้น
    const textColors = ['#ff00ff', '#00ffff', '#ffff00', '#ff0000'];
    let currentColorIndex = 0;

    function initializeDrops() {
        drops.length = 0;
        columns = canvas.width / fontSize;
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.floor(Math.random() * canvas.height / fontSize);
        }
    }
    initializeDrops();

    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = matrixColor;
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
            const x = i * fontSize;
            const y = drops[i] * fontSize;

            ctx.fillText(matrixWord, x, y);

            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            drops[i]++;
        }
    }

    function startMatrixAnimation(speed) {
        if (matrixInterval) clearInterval(matrixInterval);
        matrixInterval = setInterval(drawMatrix, speed);
    }

    startMatrixAnimation(speedRange.value);

    // Messages and overlay text
    const messages = ['My Love', 'Pam'];
    let messageIndex = 0;
    let textInterval;

    function updateOverlayText() {
        overlayText.textContent = messages[messageIndex];
        overlayText.style.color = textColors[currentColorIndex];
        overlayText.style.textShadow = `0 0 10px ${textColors[currentColorIndex]}, 0 0 20px ${textColors[currentColorIndex]}, 0 0 30px ${textColors[currentColorIndex]}`;
        messageIndex = (messageIndex + 1) % messages.length;
    }

    function startTextAnimation() {
        if (textInterval) clearInterval(textInterval);
        textInterval = setInterval(updateOverlayText, 3000);
    }

    startTextAnimation();

    // ✅ เพิ่มข้อความใหม่ทั้ง overlay และพื้นหลัง
    setCustomTextBtn.addEventListener('click', () => {
        const newMessage = customMessageInput.value.trim();
        if (newMessage) {
            messages.unshift(newMessage); // เปลี่ยนข้อความ overlay
            matrixWord = newMessage;      // เปลี่ยนข้อความในพื้นหลัง
            messageIndex = 0;
            updateOverlayText();
            triggerFloatingHeartEffect('ข้อความใหม่');
            customMessageInput.value = '';
        }
    });

    customMessageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            setCustomTextBtn.click();
        }
    });

    // Falling hearts
    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('falling-heart');
        heart.style.left = `${Math.random() * 100}vw`;
        heart.style.animationDuration = `${Math.random() * 3 + 2}s`;
        heart.style.animationDelay = `${Math.random() * 0.5}s`;
        heart.innerText = '💖';
        heartContainer.appendChild(heart);

        heart.addEventListener('animationend', () => {
            heart.remove();
        });
    }

    setInterval(createHeart, 300);

    // Floating heart effect
    function triggerFloatingHeartEffect(message = 'Love') {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerText = `💖 ${message}`;
        heart.style.position = 'absolute';
        heart.style.left = `${50 + (Math.random() * 20 - 10)}%`;
        heart.style.top = `60%`;
        heart.style.fontSize = '24px';
        heart.style.animation = 'floatUp 1s ease-out forwards';
        heart.style.zIndex = 9999;
        heart.style.pointerEvents = 'none';

        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1000);
    }

    // ปุ่มควบคุม
    changeTextBtn.addEventListener('click', () => {
        updateOverlayText();
        startTextAnimation();
        triggerFloatingHeartEffect('Text');
    });

    changeColorBtn.addEventListener('click', () => {
        currentColorIndex = (currentColorIndex + 1) % textColors.length;
        matrixColor = textColors[currentColorIndex];
        updateOverlayText();
        triggerFloatingHeartEffect('Color');
    });

    speedRange.addEventListener('input', (event) => {
        const newSpeed = event.target.value;
        startMatrixAnimation(newSpeed);
        triggerFloatingHeartEffect('Speed');
    });

    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initializeDrops();
    });

    // CSS for floating heart
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes floatUp {
            0% { opacity: 1; transform: translateY(0) scale(1); }
            100% { opacity: 0; transform: translateY(-100px) scale(1.5); }
        }
    `;
    document.head.appendChild(style);
});
