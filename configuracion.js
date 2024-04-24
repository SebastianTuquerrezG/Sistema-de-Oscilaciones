/*window.onload = function() {
  // Cambiar el zoom de la página al cargar
     document.body.style.zoom = "75%";
};*/
let consta = window.innerWidth,
  ResY = window.innerHeight,
  ResX = window.innerWidth,
  Xmin = 0,
  Xmax = ResX,
  Ymin = 0,
  Ymax = ResY,
  XminSlider = 0;
YminSlider = 0;

(MuroW = 100),
  (MuroH = 70),
  (PisoW = ResX),
  (PisoH = 75),
  (PosSuelo = Ymax - PisoH),
  (PisoX = Xmin),
  (PisoY = PosSuelo),
  (Cuadrado = 50),
  (ResorW = (ResX - MuroW * 2) / 2 - Cuadrado / 2),
  (ResorH = 40),
  (z = 0);

bordTxtX = Xmax - 640;
bordTxtY = Ymin + 160;

multiplicador = (ResX - MuroW - MuroW) / 5;

LiquiW = ResX - MuroW - MuroW;
LiquiH = 70;
