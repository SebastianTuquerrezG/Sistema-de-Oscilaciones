let button,
  entradaM,
  entradaK1,
  entradaK2,
  entradaVel,
  entradaX0,
  entradaV0,
  entradaB,
  masa,
  k,
  simular = false,
  timer = 0.01667,
  t = 0;
var valorK2 = 1,
  Gamma = 0,
  valorK1 = 1,
  valorM = 1,
  valorB = 1,
  valorA = 0,
  valorFo = 0,
  valorWf,
  W0 = 0,
  tipoAmortiguamiento,
  Fase = 0;
let resorteIzquierdo;
let resorteDerecho;
let cubo;
let paredIzq;
let paredDer;
let suelo;
let liquid;

let ejey = [];
let ejeyV = [];
let ejeyA = [];
let ejex = [];

let toggleButton;
let paused = false;
// Supongamos que tienes tus datos ya llenos en ejey, ejeyV, ejeyA y ejex

// Crear trazas para Plotly
let tracePosicion = {
  x: ejex,
  y: ejey,
  mode: 'lines',
  name: 'Posición',
  line: {
    color: 'rgb(199,21,133)'
  }
};

let traceVelocidad = {
  x: ejex,
  y: ejeyV,
  mode: 'lines',
  name: 'Velocidad',
  line: {
    color: 'rgb(6, 224, 173)'
  }
};

let traceAceleracion = {
  x: ejex,
  y: ejeyA,
  mode: 'lines',
  name: 'Aceleracion',
  line: {
    color: 'rgb(241, 10, 10)'
  }
};

// Definir datos
let data = [tracePosicion, traceVelocidad, traceAceleracion];

// Definir diseño del gráfico
let layout = {
  title: 'Gráficas en función del tiempo',
  xaxis: {
    title: 'Tiempo'
  },
  yaxis: {
    title: 'Valor'
  }
};

// Crear el gráfico con Plotly
var chart =Plotly.newPlot('Migrafica', data, layout, { displayModeBar: false });


function preload() {
  resorteIzquierdo = loadImage("Imagenes/resorte izquierdo.png"); // Ruta de tu imagen
  resorteDerecho = loadImage("Imagenes/resorte derecho.png"); // Ruta de tu imagen
  paredIzq = loadImage("Imagenes/paredIzq.png");
  paredDer = loadImage("Imagenes/paredDer.png");
  suelo = loadImage("Imagenes/suelo.png");
  cubo = loadImage("Imagenes/masa.png");
  liquid = loadImage("Imagenes/aire.gif");
}

function setup() {
  createCanvas(ResX, ResY);
  botonesControl();
  sliderEntrada();
}
//----------------------------------------------
function botonesControl() {
  button = createButton("Simular");
  button.position(Xmax - 400, 70);
  button.mousePressed(() => {
    if (((valorX0 !== 0 || ValorV0 !== 0) && valorFo === 0) || valorFo > 0) {
      simular = true;
    }
  });
  stop = createButton("Reiniciar");
  stop.position(Xmax - 490, 70);
  stop.mousePressed(() => window.location.reload());

  toggleButton = document.getElementById('toggleButton');
  toggleButton.addEventListener('click', toggleSimulation)
}

function toggleSimulation(){
  paused = !paused; // Toggle the paused state
  // Change the button text based on the paused state
  let toggleButton = document.getElementById("toggleButton");
  if (paused) {
    toggleButton.textContent = "Reanudar";    
    inhabilitarControles();
  } else {
    toggleButton.textContent = "Pausar";
    habilitarControles();
  }
}

function inhabilitarControles() {
  entradaM.attribute("disabled", true);
  entradaK1.attribute("disabled", true);
  entradaK2.attribute("disabled", true);
  entradaVel.attribute("disabled", true);
  entradaX0.attribute("disabled", true);
  entradaV0.attribute("disabled", true);
  entradaB.attribute("disabled", true);
  entradaWf.attribute("disabled", true);
  entradaFo.attribute("disabled", true);
}

function habilitarControles() {
  entradaM.removeAttribute("disabled");
  entradaK1.removeAttribute("disabled");
  entradaK2.removeAttribute("disabled");
  entradaVel.removeAttribute("disabled");
  entradaX0.removeAttribute("disabled");
  entradaV0.removeAttribute("disabled");
  entradaB.removeAttribute("disabled");
  entradaWf.removeAttribute("disabled");
  entradaFo.removeAttribute("disabled");
}

function sliderEntrada() {
  // Slider frencuencia del torque
  entradaWf = select("#entradaWf");
  entradaWf.input(reiniciarSimulacion);
  //----------------------------------------------
  //Slider de la fuerza externa
  entradaFo = select("#entradaFo");
  entradaFo.input(reiniciarSimulacion);
  // Creacion de slider de masa
  entradaM = select("#entradaM");
  entradaM.input(reiniciarSimulacion);
  //----------------------------------------------
  // Creacion de slider de constante k1
  entradaK1 = select("#entradaK1");
  entradaK1.input(reiniciarSimulacion);
  // Creacion de slider de constante k2
  entradaK2 = select("#entradaK2");
  entradaK2.input(reiniciarSimulacion);
  //----------------------------------------------
  // Creacion de slider de velocidad
  entradaV0 = select("#entradaV0");
  entradaV0.input(reiniciarSimulacion);
  //----------------------------------------------
  // Creacion de slider de posicion inicial
  entradaX0 = select("#entradaX0");
  entradaX0.input(reiniciarSimulacion);
  // Creacion de slider de constante de amortiguamiento
  entradaB = select("#entradaB");
  entradaB.input(reiniciarSimulacion);
  // Creacion de slider de velocidad
  entradaVel = select("#entradaVel");
}
function reiniciarSimulacion() {
  simular = false;
  t = 0;
  reiniciarGrafico();
}

// Función para reiniciar el gráfico
function reiniciarGrafico() {
  // Vaciar los arrays de datos
  ejex = [];
  ejey = [];
  ejeyV = [];
  ejeyA = [];

  // Actualizar las trazas en Plotly con ejes vacíos
  Plotly.restyle('Migrafica', 'x', [[]]);
  Plotly.restyle('Migrafica', 'y', [[], [], []]);
}


function obtener() {
  //toma el valor ingresado por el slider y lo almacena en una variable
  valorM = entradaM.value();
  valorK1 = entradaK1.value();
  valorK2 = entradaK2.value();
  valorX0 = entradaX0.value();
  ValorV0 = entradaV0.value();
  valorB = entradaB.value();
  valorFo = entradaFo.value();
  valorWf = entradaWf.value();
  timer = entradaVel.value();
  W0 = sqrt((valorK1 + valorK2) / valorM);
  Gamma = valorB / (2 * valorM);
  tipoAmortiguamiento = pow(Gamma, 2) - pow(W0, 2);
  if (valorFo > 0) {
    // Si Fo es mayor que 0, establece X0 y V0 en 0
    valorX0 = 0;
    ValorV0 = 0;
    entradaX0.attribute("disabled", true);
    entradaV0.attribute("disabled", true);
    entradaWf.removeAttribute("disabled");
  } else {
    entradaWf.attribute("disabled", true);
    entradaX0.removeAttribute("disabled");
    entradaV0.removeAttribute("disabled");
  }
  document.getElementById("masaValue").innerText = "Masa(Kg): " + valorM;
  document.getElementById("k1Value").innerText =
    "Constante K\u2081(N/m): " + valorK1;
  document.getElementById("k2Value").innerText =
    "Constante K\u2082(N/m): " + valorK2;
  document.getElementById("velocidadValue").innerText =
    "Velocidad de reproduccion: " + timer;
  document.getElementById("frecuenciaTorque").innerText =
    "Wf(rad/seg): " + valorWf;
  document.getElementById("fuerzaExterna").innerText = "F\u2080(N): " + valorFo;
  document.getElementById("amortiguamiento").innerText = "b(N*s/m): " + valorB;
  document.getElementById("X0Value").innerText = "X\u2080: " + valorX0;
  document.getElementById("V0Value").innerText = "V\u2080: " + ValorV0;
}
//----------------------------------------------

function draw() {
  if(!paused){    
    obtener();
    entorno();

    // condicional que controla cuando se ejecutara el programa
    if (simular) {
      movimiento();
    } else {
      simular = false;
      acomodarPosicionInicial();
    }
  }
}

function entorno() {
  // diseño de todo el entorno del programa
  background(255);
  image(suelo, Xmin, PosSuelo, PisoW, PisoH);
  image(paredIzq, Xmin, PosSuelo - MuroH, MuroW, MuroH);
  image(paredDer, Xmax - MuroW, PosSuelo - MuroH, MuroW, MuroH);
  line(MuroW + ResorW + 25, Ymax - 50, MuroW + ResorW + 25, Ymax - 100);
  fill(0); // Establece el color de relleno del texto a negro
  stroke(0); // Establece el color del contorno del texto a negro
  textSize(20);
  text("Simulación dos resortes", Xmax / 2 - 100, 30);
  textSize(14);
  text(" \u03B3 =" + Gamma.toFixed(2) + " s⁻¹", bordTxtX, bordTxtY - 30);
  text("ω\u2080 =" + W0.toFixed(2) + " rad/seg", bordTxtX, bordTxtY - 60);
}
//----------------------------------------------
function acomodarPosicionInicial() {
  image(
    cubo,
    valorX0 * multiplicador + (Xmin + MuroW + ResorW),
    PosSuelo - Cuadrado,
    Cuadrado,
    Cuadrado
  );
  image(
    resorteIzquierdo,
    Xmin + MuroW,
    PosSuelo - ResorH - 5,
    ResorW + valorX0 * multiplicador,
    ResorH
  );
  image(
    resorteDerecho,
    Xmin + MuroW + ResorW + valorX0 * multiplicador + Cuadrado,
    PosSuelo - ResorH - 5,
    ResorW - valorX0 * multiplicador,
    ResorH
  );
  if (valorB !== 0) {
    tint(255, 80);
    image(liquid, Xmin + MuroW, PosSuelo - LiquiH, LiquiW, LiquiH);
    noTint();
  }
}
function movimiento() {
  if (valorFo > 0) {
    forzado();
  } else if (valorB === 0) {
    armonico();
  } else if (valorB > 0) {
    amortiguado();
  }
}

function forzado() {
  if (valorB === 0) {
    //simple
    fSimple();
  } else {
    fAmortiguado();
  }
}

function fSimple() {
  //dibuja la masa o cuadrado , y controla su movimiento
  // solucion estacionaria
  let Xt;
  let Vt;
  let At;
  if (valorWf.toFixed(2) === W0.toFixed(2)) {
    //hay resonancia
    let d = valorFo / (2 * W0 * valorM);
    Xt = d * t * Math.sin(W0 * t);
    Vt = d * t * W0 * Math.cos(W0 * t) + d * Math.sin(W0 * t);
    At =
      -d * t * pow(W0, 2) * Math.sin(W0 * t) +
      d * W0 * Math.cos(W0 * t) +
      d * Math.cos(W0 * t);
    text(
      "Funcion estacionaria: xe(t)= " +
        d.toFixed(2) +
        "tsen(" +
        W0.toFixed(2) +
        "t)",
      bordTxtX,
      300
    );
  } else if (valorWf.toFixed(2) > W0.toFixed(2)) {
    let c = valorFo / (valorM * (pow(valorWf, 2) - pow(W0, 2)));
    Xt = c * Math.cos(valorWf * t - Math.PI);
    Vt = -c * valorWf * Math.sin(valorWf * t - Math.PI);
    At = -c * pow(valorWf, 2) * Math.cos(valorWf * t - Math.PI);
    text(
      "Funcion estacionaria: xe(t)= " +
        c.toFixed(2) +
        "cos(" +
        valorWf.toFixed(2) +
        "t - Pi)",
      bordTxtX,
      300
    );
  } else if (valorWf.toFixed(2) < W0.toFixed(2)) {
    let c = valorFo / (valorM * (pow(W0, 2) - pow(valorWf, 2)));
    Xt = c * Math.cos(valorWf * t);
    Vt = -c * valorWf * Math.sin(valorWf * t);
    At = -c * pow(valorWf, 2) * Math.cos(valorWf * t);

    text(
      "Funcion estacionaria: xe(t)= " +
        c.toFixed(2) +
        "cos(" +
        valorWf.toFixed(2) +
        "t)",
      bordTxtX,
      300
    );
  }

  let multiplicadorSobre = multiplicador;
  if (Math.abs(Xt) > 2.5) {
    multiplicadorSobre =
      ((ResX - MuroW - MuroW) / 2 - multiplicador * 0.2) / Math.abs(Xt);
  }
  text("X(t) = " + Xt.toFixed(2) + " m", bordTxtX, bordTxtY);
  agregarDatos(t, Xt, Vt, At);
  t += timer;
  image(
    cubo,
    Xt * multiplicadorSobre + (Xmin + MuroW + ResorW),
    PosSuelo - Cuadrado,
    Cuadrado,
    Cuadrado
  );
  image(
    resorteIzquierdo,
    Xmin + MuroW,
    PosSuelo - ResorH - 5,
    ResorW + Xt * multiplicadorSobre,
    ResorH
  );
  image(
    resorteDerecho,
    Xmin + MuroW + ResorW + Xt * multiplicadorSobre + Cuadrado,
    PosSuelo - ResorH - 5,
    ResorW - Xt * multiplicadorSobre,
    ResorH
  );
}

function fAmortiguado() {
  let d =
    valorFo /
    valorM /
    Math.sqrt(
      pow(pow(W0, 2) - pow(valorWf, 2), 2) + pow(2 * Gamma * valorWf, 2)
    );
  let s;
  if (valorWf.toFixed(2) === W0.toFixed(2)) {
    s = Math.PI / 2;
  } else if (valorWf.toFixed(2) > W0.toFixed(2)) {
    s =
      Math.PI -
      Math.abs(atan((2 * Gamma * valorWf) / (pow(W0, 2) - pow(valorWf, 2))));
  } else if (valorWf.toFixed(2) < W0.toFixed(2)) {
    s = Math.abs(atan((2 * Gamma * valorWf) / (pow(W0, 2) - pow(valorWf, 2))));
  }
  const Xt = d * cos(valorWf * t - s);
  const Vt = -d * valorWf * sin(valorWf * t - s);
  const At = -d * pow(valorWf, 2) * cos(valorWf * t - s);
  agregarDatos(t, Xt, Vt, At);

  t += timer;
  text("X(t) = " + Xt.toFixed(2) + " m", bordTxtX, bordTxtY);
  text(
    "Funcion del movimiento: x(t)= " +
      d.toFixed(2) +
      "cos(" +
      valorWf.toFixed(2) +
      "t - " +
      s.toFixed(2) +
      ")",
    bordTxtX,
    300
  );
  let multiplicadorSobre = multiplicador;
  if (Math.abs(Xt) > 2.5) {
    multiplicadorSobre =
      ((ResX - MuroW - MuroW) / 2 - multiplicador * 0.2) / Math.abs(Xt);
  }
  image(
    cubo,
    Xt * multiplicadorSobre + (Xmin + MuroW + ResorW),
    PosSuelo - Cuadrado,
    Cuadrado,
    Cuadrado
  );
  image(
    resorteIzquierdo,
    Xmin + MuroW,
    PosSuelo - ResorH - 5,
    ResorW + Xt * multiplicadorSobre,
    ResorH
  );
  image(
    resorteDerecho,
    Xmin + MuroW + ResorW + Xt * multiplicadorSobre + Cuadrado,
    PosSuelo - ResorH - 5,
    ResorW - Xt * multiplicadorSobre,
    ResorH
  );
  tint(255, 80);
  image(liquid, Xmin + MuroW, PosSuelo - LiquiH, LiquiW, LiquiH);
  noTint();
}

function armonico() {
  //dibuja la masa o cuadrado , y controla su movimiento
  //calculo de variables
  W0 = sqrt((valorK1 + valorK2) / valorM);
  valorA = sqrt(pow(valorX0, 2) + pow(ValorV0, 2) / pow(W0, 2));
  if (valorX0 > 0 && ValorV0 < 0) {
    Fase = atan(ValorV0 / (-1 * valorX0 * W0));
  } else if (valorX0 < 0 && ValorV0 < 0) {
    Fase = Math.PI - Math.abs(atan(ValorV0 / (-1 * valorX0 * W0)));
  } else if (valorX0 < 0 && ValorV0 > 0) {
    Fase = Math.PI + Math.abs(atan(ValorV0 / (-1 * valorX0 * W0)));
  } else if (valorX0 > 0 && ValorV0 > 0) {
    Fase = 2 * Math.PI - Math.abs(atan(ValorV0 / (-1 * valorX0 * W0)));
  } else if (valorX0 > 0 && ValorV0 === 0) {
    Fase = 0;
  } else if (valorX0 < 0 && ValorV0 === 0) {
    Fase = Math.PI;
  } else if (valorX0 === 0 && ValorV0 > 0) {
    Fase = (3 * Math.PI) / 2;
  } else if (valorX0 === 0 && ValorV0 < 0) {
    Fase = Math.PI / 2;
  } else {
    acomodarPosicionInicial();
    return;
  }
  const Xt = valorA * cos(W0 * t + Fase);
  const Vt = -valorA * W0 * sin(W0 * t + Fase);
  const At = -valorA * pow(W0, 2) * cos(W0 * t + Fase);
  let multiplicadorSobre = multiplicador;
  if (Math.abs(Xt) > 2.5) {
    multiplicadorSobre =
      ((ResX - MuroW - MuroW) / 2 - multiplicador * 0.2) / Math.abs(Xt);
  }
  image(
    cubo,
    Xt * multiplicadorSobre + (Xmin + MuroW + ResorW),
    PosSuelo - Cuadrado,
    Cuadrado,
    Cuadrado
  );
  image(
    resorteIzquierdo,
    Xmin + MuroW,
    PosSuelo - ResorH - 5,
    ResorW + Xt * multiplicadorSobre,
    ResorH
  );
  image(
    resorteDerecho,
    Xmin + MuroW + ResorW + Xt * multiplicadorSobre + Cuadrado,
    PosSuelo - ResorH - 5,
    ResorW - Xt * multiplicadorSobre,
    ResorH
  );
  text(
    "Funcion del movimiento: x(t)=" +
      valorA.toFixed(2) +
      "cos(" +
      W0.toFixed(2) +
      "t+" +
      Fase.toFixed(2) +
      ")",
    bordTxtX,
    300
  );

  let T = (2 * PI) / W0;

  agregarDatos(t, Xt, Vt, At)
  t += timer;
  text("T =   " + T.toFixed(2) + "seg", bordTxtX + 300, bordTxtY + 30);
  text("A = " + valorA + " m", bordTxtX + 300, bordTxtY + 60);
  text("X(t) = " + Xt.toFixed(2) + " m", bordTxtX, bordTxtY);
  text("V(t) = " + Vt.toFixed(2) + " m/seg", bordTxtX, bordTxtY + 30);
  text("A(t) = " + At.toFixed(2) + " m/seg²", bordTxtX, bordTxtY + 60);
}

function amortiguado() {
  // Elevar al cuadrado los valores de Gamma y W0
  var squaredGamma = Math.pow(Gamma, 2);
  var squaredW0 = Math.pow(W0, 2);

  // Redondear los valores al segundo decimal
  var roundedSquaredGamma = parseFloat(squaredGamma.toFixed(2));
  var roundedSquaredW0 = parseFloat(squaredW0.toFixed(2));

  if (roundedSquaredGamma < roundedSquaredW0) {
      // Subamortiguado
      subamortiguado();
  } else if (roundedSquaredGamma === roundedSquaredW0) {
      // Críticamente amortiguado
      criticamenteamortiguado();
  } else if (roundedSquaredGamma > roundedSquaredW0) {
      // Sobreamortiguado
      sobreamortiguado();
  }

}

function subamortiguado() {
  let W = Math.sqrt(pow(W0, 2) - pow(Gamma, 2));
  if (valorX0 > 0 && ValorV0 > 0) {
    fasePhi =
      2 * Math.PI - Math.abs(atan((-1 * (ValorV0 / valorX0) - Gamma) / W));
  } else if (valorX0 < 0 && ValorV0 < 0) {
    fasePhi = Math.PI - Math.abs(atan((-1 * (ValorV0 / valorX0) - Gamma) / W));
  } else if (valorX0 > 0 && ValorV0 < 0) {
    if (Math.abs(ValorV0).toFixed(2) > Math.abs(Gamma * valorX0).toFixed(2)) {
      fasePhi = Math.abs(atan((-1 * (ValorV0 / valorX0) - Gamma) / W));
    } else if (
      Math.abs(ValorV0).toFixed(2) < Math.abs(Gamma * valorX0).toFixed(2)
    ) {
      fasePhi =
        2 * Math.PI - Math.abs(atan((-1 * (ValorV0 / valorX0) - Gamma) / W));
    } else if (
      Math.abs(ValorV0).toFixed(2) === Math.abs(Gamma * valorX0).toFixed(2)
    ) {
      fasePhi = 0;
    }
  } else if (valorX0 < 0 && ValorV0 > 0) {
    if (Math.abs(ValorV0).toFixed(2) > Math.abs(Gamma * valorX0).toFixed(2)) {
      fasePhi =
        Math.PI + Math.abs(atan((-1 * (ValorV0 / valorX0) - Gamma) / W));
    } else if (
      Math.abs(ValorV0).toFixed(2) < Math.abs(Gamma * valorX0).toFixed(2)
    ) {
      fasePhi =
        Math.PI - Math.abs(atan((-1 * (ValorV0 / valorX0) - Gamma) / W));
    } else if (
      Math.abs(ValorV0).toFixed(2) === Math.abs(Gamma * valorX0).toFixed(2)
    ) {
      fasePhi = Math.PI;
    }
  } else if (valorX0 > 0 && ValorV0 === 0) {
    fasePhi = 2 * Math.PI - Math.abs(atan((-1 * Gamma) / W));
  } else if (valorX0 < 0 && ValorV0 === 0) {
    fasePhi = Math.PI - Math.abs(atan((-1 * Gamma) / W));
  } else if (valorX0 === 0 && ValorV0 > 0) {
    fasePhi = (3 * Math.PI) / 2;
  } else if (valorX0 === 0 && ValorV0 < 0) {
    fasePhi = Math.PI / 2;
  } else {
    acomodarPosicionInicial();
    return;
  }
  let constante;
  if (valorX0 === 0) {
    constante = ValorV0 / W;
  } else {
    constante = valorX0 / cos(Math.abs(fasePhi));
  }

  const Xt = constante * pow(Math.E, -Gamma * t) * cos(W * t + fasePhi);
  const Vt =
    -1 *
    (Gamma * constante * pow(Math.E, -Gamma * t) * cos(W * t + fasePhi) +
      W * constante * pow(Math.E, -Gamma * t) * sin(W * t + fasePhi));
  let T = (2 * Math.PI) / W;
  const At =
    pow(Gamma, 2) * constante * pow(Math.E, -Gamma * t) +
    Gamma * constante * W * pow(Math.E, -Gamma * t) * sin(W * t + fasePhi) +
    Gamma * W * constante * pow(Math.E, -Gamma * t) * sin(W * t + fasePhi) +
    -pow(W, 2) * constante * pow(Math.E, -Gamma * t) * cos(W * t + fasePhi);
  
  agregarDatos(t, Xt, Vt, At);
  t += timer;

  text("X(t) = " + Xt.toFixed(2) + " m", bordTxtX, bordTxtY);
  text("τ =   " + T.toFixed(2) + "seg", bordTxtX, bordTxtY + 30);
  text(
    "Funcion del movimiento: x(t)=" +
      constante.toFixed(2) +
      "e^(-" +
      Gamma.toFixed(2) +
      "t)" +
      "cos(" +
      W.toFixed(2) +
      "t+" +
      fasePhi.toFixed(2) +
      ")",
    bordTxtX,
    300
  );
  text("C(Amplitud) = " + constante.toFixed(2) + " m", bordTxtX, bordTxtY + 60);
  text("\u03C6(Fase inicial) = " + fasePhi.toFixed(2), bordTxtX, bordTxtY + 90);
  let multiplicadorSobre = multiplicador;
  if (Math.abs(Xt) > 2.5) {
    multiplicadorSobre =
      ((ResX - MuroW - MuroW) / 2 - multiplicador * 0.2) / Math.abs(Xt);
  }
  image(
    cubo,
    Xt * multiplicadorSobre + (Xmin + MuroW + ResorW),
    PosSuelo - Cuadrado,
    Cuadrado,
    Cuadrado
  );
  image(
    resorteIzquierdo,
    Xmin + MuroW,
    PosSuelo - ResorH - 5,
    ResorW + Xt * multiplicadorSobre,
    ResorH
  );
  image(
    resorteDerecho,
    Xmin + MuroW + ResorW + Xt * multiplicadorSobre + Cuadrado,
    PosSuelo - ResorH - 5,
    ResorW - Xt * multiplicadorSobre,
    ResorH
  );
  tint(255, 80);
  image(liquid, Xmin + MuroW, PosSuelo - LiquiH, LiquiW, LiquiH);
  noTint();
}

function criticamenteamortiguado() {
  let Constante1 = valorX0;
  let Constante2 = ValorV0 + Constante1 * Gamma;

  const Xt = (Constante1 + Constante2 * t) * pow(Math.E, -Gamma * t);
  const Vt =
    -Constante1 * Gamma * pow(Math.E, -Gamma * t) +
    Constante2 * pow(Math.E, -Gamma * t) -
    Constante2 * t * Gamma * pow(Math.E, -Gamma * t);
  const At =
    Constante1 * pow(Gamma, 2) * pow(Math.E, -Gamma * t) +
    -Constante2 * Gamma * pow(Math.E, -Gamma * t) +
    Constante2 * pow(Gamma, 2) * t * pow(Math.E, -Gamma * t) +
    -Constante2 * Gamma * pow(Math.E, -Gamma * t);
  agregarDatos(t, Xt, Vt, At);
  t += timer;
  text("X(t) = " + Xt.toFixed(2) + " m", bordTxtX, bordTxtY);
  text(
    "Funcion del movimiento: x(t)= (" +
      Constante1.toFixed(2) +
      formatearNumero(Constante2) +
      "t)" +
      "e^(-" +
      Gamma.toFixed(2) +
      "t)",
    bordTxtX,
    300
  );
  text("C\u2081 = " + Constante1.toFixed(2) + " m", bordTxtX, bordTxtY + 30);
  text("C\u2082 = " + Constante2.toFixed(2) + " m", bordTxtX, bordTxtY + 60);
  let multiplicadorSobre = multiplicador;
  if (Math.abs(Xt) > 2.5) {
    multiplicadorSobre =
      ((ResX - MuroW - MuroW) / 2 - multiplicador * 0.2) / Math.abs(Xt);
  }
  image(
    cubo,
    Xt * multiplicadorSobre + (Xmin + MuroW + ResorW),
    PosSuelo - Cuadrado,
    Cuadrado,
    Cuadrado
  );
  image(
    resorteIzquierdo,
    Xmin + MuroW,
    PosSuelo - ResorH - 5,
    ResorW + Xt * multiplicadorSobre,
    ResorH
  );
  image(
    resorteDerecho,
    Xmin + MuroW + ResorW + Xt * multiplicadorSobre + Cuadrado,
    PosSuelo - ResorH - 5,
    ResorW - Xt * multiplicadorSobre,
    ResorH
  );
  tint(255, 80);
  image(liquid, Xmin + MuroW, PosSuelo - LiquiH, LiquiW, LiquiH);
  noTint();
}


function sobreamortiguado() {
  let resta = pow(Gamma, 2) - pow(W0, 2);
  let M1 = -Gamma + Math.sqrt(resta);
  let M2 = -Gamma - Math.sqrt(resta);
  text("m\u2081 = " + M1.toFixed(2), bordTxtX, bordTxtY + 30);
  text("m\u2082 = " + M2.toFixed(2), bordTxtX, bordTxtY + 60);
  let Constante2 = (ValorV0 - M1 * valorX0) / (M2 - M1);
  let Constante1 = valorX0 - Constante2;
  text(
    "Funcion del movimiento: x(t)= " +
      Constante1.toFixed(2) +
      "e^(" +
      M1.toFixed(2) +
      "t) " +
      formatearNumero(Constante2) +
      "e^(" +
      M2.toFixed(2) +
      "t)",
    bordTxtX,
    300
  );
  let Xt = Constante1 * pow(Math.E, M1 * t) + Constante2 * pow(Math.E, M2 * t);
  let Vt =
    Constante1 * M1 * pow(Math.E, M1 * t) +
    Constante2 * M2 * pow(Math.E, M2 * t);
  let At =
    Constante1 * pow(M1, 2) * pow(Math.E, M1 * t) +
    Constante2 * pow(M2, 2) * pow(Math.E, M2 * t);
  text("x(t) = " + Xt.toFixed(2) + " m", bordTxtX, bordTxtY);
  agregarDatos(t, Xt, Vt, At);
  t += timer;
  let multiplicadorSobre = multiplicador;
  if (Math.abs(Xt) > 2.0) {
    multiplicadorSobre =
      ((ResX - MuroW - MuroW) / 2 - multiplicador * 0.2) / Math.abs(Xt);
  }
  image(
    cubo,
    Xt * multiplicadorSobre + (Xmin + MuroW + ResorW),
    PosSuelo - Cuadrado,
    Cuadrado,
    Cuadrado
  );
  image(
    resorteIzquierdo,
    Xmin + MuroW,
    PosSuelo - ResorH - 5,
    ResorW + Xt * multiplicadorSobre,
    ResorH
  );
  image(
    resorteDerecho,
    Xmin + MuroW + ResorW + Xt * multiplicadorSobre + Cuadrado,
    PosSuelo - ResorH - 5,
    ResorW - Xt * multiplicadorSobre,
    ResorH
  );
  tint(255, 80);
  image(liquid, Xmin + MuroW, PosSuelo - LiquiH, LiquiW, LiquiH);
  noTint();
}
function formatearNumero(numero) {
  if (numero >= 0) {
      return "+" + numero.toFixed(2);
  } else {
      return numero.toFixed(2);
  }
}
// Función para agregar datos a las gráficas en Plotly
function agregarDatos(xTiempo, yPosicion, yVelocidad, yAceleracion) {
  
  if(xTiempo>5){
    // Eliminar el primer valor de cada arreglo de datos
    ejex.shift();
    ejey.shift(); 
    ejeyV.shift();
    ejeyA.shift();
    // Actualizar el gráfico en Plotly con los datos actualizados
    Plotly.restyle('Migrafica', 'x', [ejex]);
    Plotly.restyle('Migrafica', 'y', [ejey, ejeyV, ejeyA]);
  }
  // Agregar nuevos datos a los arrays
  ejex.push(xTiempo);
  ejey.push(yPosicion);
  ejeyV.push(yVelocidad);
  ejeyA.push(yAceleracion);
  
  // Actualizar las trazas en Plotly
  Plotly.extendTraces('Migrafica', {
      x: [[xTiempo]],
      y: [[yPosicion]]
  }, [0]); // Actualizar traza de posición
  
  Plotly.extendTraces('Migrafica', {
      x: [[xTiempo]],
      y: [[yVelocidad]]
  }, [1]); // Actualizar traza de velocidad
  
  Plotly.extendTraces('Migrafica', {
      x: [[xTiempo]],
      y: [[yAceleracion]]
  }, [2]); // Actualizar traza de aceleración
}