/* MUSIC PLAYER */
const tracks = [
  "musique/Olivia Dean - So Easy.mp3",
  "musique/FIFTY FIFTY - Cupid.mp3",
  "musique/John Michael Howell - Disney Movie.mp3",
  "musique/disiz, Theodora - melodrama.mp3",
  "musique/Marshmello & Anne-Marie - FRIENDS.mp3",
  "musique/Fredz - Extraordinaire.mp3",
  "musique/Carbonne - Imagine.mp3",
  "musique/Kyo - Le Graal.mp3",
  "musique/Renan Luce - La Lettre.mp3",
  "musique/Vanessa Paradis & -M- La seine.mp3",
  "musique/Mickey 3d - Respire.mp3",
  "musique/MIKA - Lollipop.mp3",
  "musique/Maroon 5 - Maps.mp3",
  "musique/the ronettes - be my baby.mp3",
  "musique/Clair Obscur Expedition 33 - Lumière.mp3",
  "musique/Bigflo & Oli - Dommage.mp3",
  "musique/Ridan - Ulysse.mp3",
  "musique/Fréro Delavega - Le Chant Des Sirènes.mp3",
  "musique/Louise Attaque - Jtemmène au vent.mp3",
  "musique/Catherine Feeny - Mr. Blue.mp3"
];

let current = 0;
let playing = false;

const audio = document.getElementById("audio");
const screen = document.getElementById("trackName");
const playBtn = document.getElementById("playBtn");
const volumeSlider = document.getElementById("volume-slider");

audio.volume = 0.5;

function loadTrack() {
  if(tracks.length > 0 && tracks[current]) {
    audio.src = tracks[current];
    let trackName = tracks[current].split("/").pop().replace(".mp3", "");
    screen.innerText = trackName;
  }
}

// Nouveau système de lecture avec "Fade-in" (fondu sonore)
function playWithFade() {
    audio.volume = 0;
    audio.play();
    let targetVolume = parseFloat(volumeSlider.value) || 0.5;
    let currentVol = 0;
    
    let fadeInterval = setInterval(() => {
        currentVol += 0.05;
        if (currentVol >= targetVolume) {
            currentVol = targetVolume;
            clearInterval(fadeInterval);
        }
        audio.volume = currentVol;
    }, 50);
}

function togglePlay() {
  if (playing) {
    audio.pause();
    playBtn.innerText = "▶";
  } else {
    playWithFade(); // Utilise le fondu au lieu de péter les oreilles
    playBtn.innerText = "⏸";
  }
  playing = !playing;
}

function nextTrack() {
  current = (current + 1) % tracks.length;
  loadTrack();
  playWithFade(); // Fade-in
  playing = true;
  playBtn.innerText = "⏸";
}

function prevTrack() {
  current = (current - 1 + tracks.length) % tracks.length;
  loadTrack();
  playWithFade(); // Fade-in
  playing = true;
  playBtn.innerText = "⏸";
}

volumeSlider.addEventListener('input', (e) => {
  audio.volume = e.target.value;
});

audio.addEventListener('ended', nextTrack);

loadTrack(); 

/* SWIPE */
let startX = 0;
document.addEventListener("touchstart", e => startX = e.changedTouches[0].screenX);
document.addEventListener("touchend", e => {
  let endX = e.changedTouches[0].screenX;
  if (endX - startX > 60) prevTrack();
  if (startX - endX > 60) nextTrack();
});

/* GESTION DU MENU PLAYLIST */
const menuView = document.getElementById("menu-view");
const nowPlayingView = document.getElementById("now-playing-view");
const playlistEl = document.getElementById("playlist");

tracks.forEach((trackUrl, index) => {
  let trackName = trackUrl.split("/").pop().replace(".mp3", "");
  let li = document.createElement("li");
  li.innerText = trackName;
  
  li.onclick = () => {
    current = index;
    loadTrack();
    playWithFade(); // Fade-in
    playing = true;
    playBtn.innerText = "⏸";
    toggleMenu();
  };
  playlistEl.appendChild(li);
});

function toggleMenu() {
  if (menuView.style.display === "none") {
    menuView.style.display = "block";
    nowPlayingView.style.display = "none";
    highlightCurrentTrackInMenu();
  } else {
    menuView.style.display = "none";
    nowPlayingView.style.display = "flex";
  }
}

function highlightCurrentTrackInMenu() {
  const listItems = playlistEl.querySelectorAll("li");
  listItems.forEach((li, idx) => {
    if (idx === current) li.classList.add("active-track");
    else li.classList.remove("active-track");
  });
}

/* SCROLL ANIMATION */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("show");
  });
}, { threshold: 0.1 }); 

document.querySelectorAll("section").forEach(sec => observer.observe(sec));

/* DRAG & DROP IPOD */
const ipodPlayer = document.querySelector(".music-player");

let isDraggingIpod = false;
let offsetX = 0;
let offsetY = 0;

function startDrag(e) {
  // Désactive le drag sur mobile pour éviter de tout casser
  if (window.innerWidth <= 800) return; 
  if (e.target.closest('button, input, li, .ipod-screen')) return;

  isDraggingIpod = true;
  
  let clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
  let clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

  const rect = ipodPlayer.getBoundingClientRect();
  offsetX = clientX - rect.left;
  offsetY = clientY - rect.top;
}

function drag(e) {
  if (!isDraggingIpod) return;
  
  let clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
  let clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

  ipodPlayer.style.left = `${clientX - offsetX}px`;
  ipodPlayer.style.top = `${clientY - offsetY}px`;
}

function stopDrag() {
  isDraggingIpod = false;
}

ipodPlayer.addEventListener("mousedown", startDrag);
document.addEventListener("mousemove", drag);
document.addEventListener("mouseup", stopDrag);

ipodPlayer.addEventListener("touchstart", startDrag, { passive: true });
document.addEventListener("touchmove", drag, { passive: true });
document.addEventListener("touchend", stopDrag);

window.addEventListener('resize', () => {
  if (window.innerWidth > 800) {
      const rect = ipodPlayer.getBoundingClientRect();
      if (rect.right > window.innerWidth) ipodPlayer.style.left = `${window.innerWidth - rect.width - 20}px`;
      if (rect.bottom > window.innerHeight) ipodPlayer.style.top = `${window.innerHeight - rect.height - 20}px`;
      if (rect.left < 0) ipodPlayer.style.left = "20px";
  }
});

/* DARK MODE */
const themeToggle = document.getElementById("theme-toggle");
const themeText = document.getElementById("theme-text");

if (localStorage.getItem("theme") === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    if(themeText) themeText.innerText = "☀️ Mode Clair";
}

if(themeToggle) {
    themeToggle.addEventListener("click", () => {
        let currentTheme = document.documentElement.getAttribute("data-theme");
        if (currentTheme === "dark") {
            document.documentElement.setAttribute("data-theme", "light");
            localStorage.setItem("theme", "light"); 
            if(themeText) themeText.innerText = "🌙 Mode Sombre";
        } else {
            document.documentElement.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark"); 
            if(themeText) themeText.innerText = "☀️ Mode Clair";
        }
    });
}

/* EASTER EGG : KONAMI CODE */
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiPosition = 0;

document.addEventListener('keydown', function(e) {
    let key = e.key;
    if (key === 'B' || key === 'A') key = key.toLowerCase();

    if (key === konamiCode[konamiPosition]) {
        konamiPosition++; 
        if (konamiPosition === konamiCode.length) {
            window.location.href = 'Snake/snake.html';
            konamiPosition = 0; 
        }
    } else {
        konamiPosition = 0;
    }
});

/* EFFET MACHINE À ÉCRIRE */
const textToType = "Développeur créatif • Étudiant";
const typewriterElement = document.getElementById("typewriter");
let typeIndex = 0;

function typeWriterEffect() {
    if (typewriterElement && typeIndex < textToType.length) {
        typewriterElement.innerHTML += textToType.charAt(typeIndex);
        typeIndex++;
        setTimeout(typeWriterEffect, 80); 
    }
}
setTimeout(typeWriterEffect, 2500);

/* --- LE VRAI ECRAN DE CHARGEMENT --- */
const loaderWrapper = document.getElementById('loader-wrapper');
const progressBar = document.getElementById('progress-bar');
const loaderText = document.getElementById('loader-text');

let progress = 0;

// Simulation de chargement (jusqu'à 90% maximum)
const loadingInterval = setInterval(() => {
    if (progress < 90) {
        progress += Math.floor(Math.random() * 10) + 2; 
        if (progress > 90) progress = 90; // Bloque à 90%
        progressBar.style.width = progress + '%';
        loaderText.innerText = `Chargement... ${progress}%`;
    }
}, 150);

// Quand la page a VRAIMENT fini de tout charger (images, Spline, CSS)
window.addEventListener('load', () => {
    clearInterval(loadingInterval); // Stoppe le faux chargement
    progress = 100;
    progressBar.style.width = '100%';
    loaderText.innerText = "Prêt !";
    
    // On cache le loader après une demi-seconde
    setTimeout(() => {
        loaderWrapper.classList.add('loader-hidden');
    }, 500); 
});

/* --- EFFET 3D CARTES POKEMON (TILT) --- */
const pokemonCards = document.querySelectorAll('.pokemon-card');

// Sécurité Tactile : L'effet ne s'active que si l'appareil a une vraie souris
if (window.matchMedia("(hover: hover)").matches) {
  pokemonCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -15;
      const rotateY = ((x - centerX) / centerX) * 15;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
    });
  });
}