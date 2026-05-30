let desfase = 0;
let progreso = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 360, 100, 100, 1);
}

function draw() {
    background(0);

    let velocidad = dist(mouseX, mouseY, pmouseX, pmouseY);
    // que vaya mas rapido si moves rapido el mouse
    progreso += 0.003 + velocidad * 0.004;

    let t = progreso % 1.0;

    let tono = (map(mouseX, 0, width, 0, 360, true) + desfase) % 360;
    let sat = map(mouseY, 0, height, 40, 100, true);

    // calcular punto de fuga y perspectiva
    let fugaX = width * 0.24;
    let fugaY = height * 0.41;

    let anchoFin = width * 4 / 9;
    let altoFin = height * 0.001875;

    let paso = 0.065;

    let grosorSup = paso * (fugaY - altoFin / 2) * 0.35;
    let grosorInf = paso * (height - fugaY - altoFin / 2) * 0.85;
    let grosorDer = paso * (width - fugaX - anchoFin / 2) * 0.6;

    let relacionSup = fugaX / fugaY;
    let relacionInf = fugaX / (height - fugaY);

    noStroke();

    let i = -1;
    while (true) {
        let u = i + t;
        let s = u * paso;

        if (s >= 0.95) break;

        let yExt1 = lerp(0, fugaY - altoFin / 2, s);
        let xExt1 = yExt1 * relacionSup;

        let yExt2 = lerp(height, fugaY + altoFin / 2, s);
        let xExt2 = (height - yExt2) * relacionInf;

        let xExt = lerp(width, fugaX + anchoFin / 2, s);

        let factorSup = map(s, 0.0, 0.80, 1.5, 0.15, true);
        let factorInf = map(s, 0.0, 0.80, 0.90, 0.75, true);
        let factorOtro = map(s, 0.0, 0.80, 1.5, 0.40, true);

        let espSup = grosorSup * factorSup;
        let espInf = grosorInf * factorInf;
        let espDer = grosorDer * factorOtro;

        if ((yExt2 - yExt1) <= (espSup + espInf) || (xExt - xExt1) <= espDer) {
            break;
        }

        let yInt1 = yExt1 + espSup;
        let xInt1 = yInt1 * relacionSup;

        let yInt2 = yExt2 - espInf;
        let xInt2 = (height - yInt2) * relacionInf;

        let xInt = xExt - espDer;

        let opacidad = 1.0;
        if (s > 0.80) {
            opacidad = min(opacidad, map(s, 0.80, 0.95, 1, 0, true));
        }

        fill((tono + u * 6 + 360) % 360, sat, 100, opacidad);

        // dibuja el tunel
        beginShape();
        vertex(xExt1, yExt1);
        vertex(xExt, yExt1);
        vertex(xExt, yExt2);
        vertex(xExt2, yExt2);
        vertex(xInt2, yInt2);
        vertex(xInt, yInt2);
        vertex(xInt, yInt1);
        vertex(xInt1, yInt1);
        endShape(CLOSE);

        i++;
    }
}

// cambia de color al hacer click
function mousePressed() {
    desfase = random(0, 360);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}