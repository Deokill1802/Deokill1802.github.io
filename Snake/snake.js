const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Paramètres du jeu
const tailleCase = 15; // Pixels un peu plus gros
const nombreCases = canvas.width / tailleCase;

// Couleurs JS
const COLOR_BG = '#9bbc0f';
const COLOR_INK = '#0f380f';

let vx = 0;
let vy = 0;
let pommeX = 5;
let pommeY = 5;
let score = 0;

let teteX = 10;
let teteY = 10;
let corps = [];
let tailleQueue = 2;

let jeuInterval;

// Démarrage
jeuInterval = setInterval(jeu, 150);

function jeu() {
    // 1. Déplacement
    teteX += vx;
    teteY += vy;

    // 2. MORT CONTRE LES MURS
    if(teteX < 0 || teteX > nombreCases - 1 || teteY < 0 || teteY > nombreCases - 1) {
        gameOver();
        return;
    }

    // 3. Fond Écran (Vert clair)
    ctx.fillStyle = COLOR_BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Effet de grille subtile (pour faire LCD)
    ctx.strokeStyle = '#8bac0f';
    ctx.lineWidth = 0.5;
    // (Optionnel, je le laisse commenté pour garder le code simple, décommente pour voir)
    // for(let i=0; i<nombreCases; i++) { ctx.strokeRect(i*tailleCase, 0, 1, canvas.height); ctx.strokeRect(0, i*tailleCase, canvas.width, 1); }

    // 4. Serpent (Vert Foncé)
    ctx.fillStyle = COLOR_INK;
    for(let i = 0; i < corps.length; i++) {
        // On dessine le carré avec un petit espace pour l'effet "pixel séparé"
        ctx.fillRect(corps[i].x * tailleCase + 1, corps[i].y * tailleCase + 1, tailleCase - 2, tailleCase - 2);
        
        // Mort queue
        if(corps[i].x === teteX && corps[i].y === teteY && tailleQueue > 2) {
            gameOver();
            return;
        }
    }

    corps.push({x: teteX, y: teteY});
    while(corps.length > tailleQueue) {
        corps.shift();
    }

    // 5. Pomme (Carré plein ou motif)
    ctx.fillStyle = COLOR_INK;
    // On dessine une forme un peu différente pour la pomme
    ctx.fillRect(pommeX * tailleCase + 3, pommeY * tailleCase + 3, tailleCase - 6, tailleCase - 6);
    ctx.strokeRect(pommeX * tailleCase + 1, pommeY * tailleCase + 1, tailleCase - 2, tailleCase - 2);

    // 6. Manger
    if(teteX === pommeX && teteY === pommeY) {
        tailleQueue++;
        score += 10;
        document.getElementById('score').innerText = score;
        pommeX = Math.floor(Math.random() * nombreCases);
        pommeY = Math.floor(Math.random() * nombreCases);
    }
}

function gameOver() {
    clearInterval(jeuInterval);
    
    // Affichage GAME OVER style rétro
    ctx.fillStyle = COLOR_INK;
    ctx.font = "bold 30px Courier New";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2);
    ctx.font = "15px Courier New";
    ctx.fillText("SCORE: " + score, canvas.width/2, canvas.height/2 + 30);

    document.getElementById('btnRejouer').style.display = 'inline-block';
}

function rejouer() {
    teteX = 10; teteY = 10;
    vx = 0; vy = 0;
    corps = [];
    tailleQueue = 2;
    score = 0;
    document.getElementById('score').innerText = 0;
    document.getElementById('btnRejouer').style.display = 'none';
    
    jeuInterval = setInterval(jeu, 150);
}

document.addEventListener('keydown', function(evt) {
    switch(evt.keyCode) {
        case 37: if(vx !== 1) { vx = -1; vy = 0; } break;
        case 38: if(vy !== 1) { vx = 0; vy = -1; } break;
        case 39: if(vx !== -1) { vx = 1; vy = 0; } break;
        case 40: if(vy !== -1) { vx = 0; vy = 1; } break;
    }
});