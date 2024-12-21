// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Canvas boyutları
canvas.width = 320;
canvas.height = 480;

// Game variables
let birdY = canvas.height / 2;
let birdVelocity = 0;
let birdFlapStrength = -6;
let gravity = 0.25;
let birdWidth = 50;
let birdHeight = 50;
let birdX = 50;
let isGameOver = false;
let pipes = [];
let pipeWidth = 50;
let pipeGap = 170;
let pipeSpeed = 2;
let score = 0;

// Load the bird image
let birdImage = new Image();
birdImage.src = 'görsel/bird.png'; // Kuş görseli (bird.png)

// Event listeners for click and touch events
canvas.addEventListener('click', flap); // Masaüstü için click
canvas.addEventListener('touchstart', flap); // Mobil cihazlar için touchstart

// Flap function (kuşu zıplatma)
function flap(event) {
    if (isGameOver) return;
    birdVelocity = birdFlapStrength;

    // Eğer mobil cihazda dokunma olayı varsa, touchstart event'i geçerli olacak.
    if (event.type === 'touchstart') {
        event.preventDefault(); // Mobil tarayıcıda sayfa kaymasını engellemek için
    }
}

// Game loop
function gameLoop() {
    if (isGameOver) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update bird position
    birdVelocity += gravity;
    birdY += birdVelocity;

    // Draw bird (use the image instead of the rectangle)
    ctx.drawImage(birdImage, birdX, birdY, birdWidth, birdHeight);

    // Check for bird collision with ground
    if (birdY + birdHeight > canvas.height) {
        birdY = canvas.height - birdHeight;
        birdVelocity = 0;
        isGameOver = true;
        gameOver();
    }

    // Update and draw pipes
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        createPipe();
    }

    for (let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];
        pipe.x -= pipeSpeed;

        // Draw top and bottom pipes
        ctx.fillStyle = "#008000";
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
        ctx.fillRect(pipe.x, pipe.topHeight + pipeGap, pipeWidth, canvas.height - pipe.topHeight - pipeGap);

        // Check for collisions
        if (birdX + birdWidth > pipe.x && birdX < pipe.x + pipeWidth &&
            (birdY < pipe.topHeight || birdY + birdHeight > pipe.topHeight + pipeGap)) {
            isGameOver = true;
            gameOver();
        }

        // Remove passed pipes
        if (pipe.x + pipeWidth < 0) {
            pipes.splice(i, 1);
            i--;
            score++;  // Increase score immediately after passing pipe
        }
    }

    // Draw score
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.fillText("Skor: " + score, 10, 30);

    // Call the next frame
    requestAnimationFrame(gameLoop);
}

// Create a new pipe
function createPipe() {
    const topHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
    pipes.push({ x: canvas.width, topHeight: topHeight });
}

// Game Over
function gameOver() {
    ctx.fillStyle = "#000";
    ctx.font = "30px Arial";
    ctx.fillText("OYUN BİTTİ", canvas.width / 2 - 90, canvas.height / 2);
    ctx.fillText("Skor: " + score, canvas.width / 2 - 50, canvas.height / 2 + 40);
    document.getElementById('restartButton').style.display = 'block'; // Restart button visible
    gameMusic.pause();  // Müziği durdur
    gameMusic.currentTime = 0;  // Müziği başa al
}

// Ses dosyasını alıyoruz
const gameMusic = document.getElementById('gameMusic');

// Oyunun başlangıcında müziği başlat
function startGame() {
    document.getElementById('game-container').style.display = 'block';
    gameMusic.play();  // Müziği başlat
    gameMusic.loop = true;  // Müzik döngüde çalsın
    gameLoop();  // Oyun döngüsünü başlat
}

// Restart the game
function restartGame() {
    birdY = canvas.height / 2;
    birdVelocity = 0;
    score = 0;
    pipes = [];
    isGameOver = false;
    document.getElementById('restartButton').style.display = 'none'; // Hide restart button
    gameMusic.play();  // Müziği tekrar başlat
    gameLoop();  // Oyun döngüsünü tekrar başlat
}

// Sayfa yüklendiğinde oyun başlasın
window.onload = startGame;

// Home butonuna tıklandığında sayfayı yönlendirme
document.getElementById('homeButton').addEventListener('click', function() {
    window.location.href = 'https://ufak1.github.io/home/'; // Burada 'index.html' yerine yönlendirmek istediğiniz sayfanın URL'sini yazabilirsiniz
});