let currentIdx = 0;
const track = document.getElementById('track');
const cards = document.querySelectorAll('.game-card');
const startBtn = document.getElementById('start-game-btn');
const tapModal = document.getElementById('tap-modal');

const sndClick = document.getElementById('snd-click');
const sndSlide = document.getElementById('snd-slide');

// AI System Voice
function speak(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 0.9;
    speech.pitch = 0.8;
    window.speechSynthesis.speak(speech);
}

function updateCarousel() {
    cards.forEach((card, i) => {
        const video = card.querySelector('.card-video');
        if (i === currentIdx) {
            card.classList.add('active');
            const accent = card.style.getPropertyValue('--accent');
            document.documentElement.style.setProperty('--accent', accent);
            if (video) {
                video.currentTime = 0;
                video.play();
            }
        } else {
            card.classList.remove('active');
            if (video) video.pause();
        }
    });

    const containerWidth = document.querySelector('.carousel-container').offsetWidth;
    const cardWidth = 550;
    const moveAmount = (containerWidth / 2) - (cardWidth / 2) - (currentIdx * (cardWidth + 80));
    
    track.style.transform = `translateX(${moveAmount}px)`;
}

function move(direction) {
    if(sndSlide) { sndSlide.currentTime = 0; sndSlide.play().catch(()=>{}); }
    
    currentIdx = (currentIdx + direction + cards.length) % cards.length;
    tapModal.classList.remove('active');
    updateCarousel();
}

startBtn.addEventListener('click', () => {
    if(sndClick) sndClick.play().catch(()=>{});
    
    tapModal.classList.add('active');
    
    // Trigger System Voice
    speak("Tap the card to begin");

    // Click active card to "Scan"
    const activeCard = document.querySelector('.game-card.active');
    activeCard.onclick = () => {
        speak("Access granted. Enjoy your session.");
        tapModal.querySelector('h2').innerText = "AUTHORIZED";
        setTimeout(() => {
            alert("STARTING: " + activeCard.querySelector('h2').innerText);
        }, 800);
    };
});

window.addEventListener('load', updateCarousel);
window.addEventListener('resize', updateCarousel);

document.addEventListener('keydown', (e) => {
    if (e.key === "ArrowLeft") move(-1);
    if (e.key === "ArrowRight") move(1);
    if (e.key === "Enter") startBtn.click();
});