/* ============================================
   TINCHOGRAF — Partidas modelo
   Datos de las partidas que ilustran conceptos en la sección
   "Partidas que ilustran los conceptos" (#ejemplos).

   Para agregar una partida nueva: copiá el objeto de ejemplo comentado
   al final de este archivo, pegalo dentro del array PARTIDAS_MODELO,
   completá los datos y listo — se renderiza sola.
   ============================================ */

window.PARTIDAS_MODELO = [
  {
    id: "sacrificio-desarrollo-ejemplo",
    concepto: "Sacrificio",
    titulo: "Entregar material para no perder tiempo",
    resultado: "1-0",
    color_tincho: "blancas",
    oponente: "Rival de ejemplo",
    fecha: "2026-01-15",
    control: "Clásica (ejemplo)",
    narracion:
      "Partida de ejemplo para mostrar cómo funciona el sistema. Ilustra la idea de sacrificar material a cambio de desarrollo y ataque directo contra un rey que se quedó en el centro. Reemplazá esto por una partida tuya real.",
    momento_clave: {
      ply: 33,
      comentario:
        "Acá se ve el concepto: en vez de recuperar material o consolidar, se sigue entregando piezas (torre, alfil, dama) porque el rey negro está atrapado en el centro. El sacrificio se cobra en forma de jaque mate forzado, no de material devuelto."
    },
    pgn: `[Event "Partida de ejemplo"]
[White "TinchoGraf"]
[Black "Rival de ejemplo"]
[Result "1-0"]

1. e4 e5 2. Nf3 d6 3. d4 Bg4 4. dxe5 Bxf3 5. Qxf3 dxe5 6. Bc4 Nf6 7. Qb3 Qe7
8. Nc3 c6 9. Bg5 b5 10. Nxb5 cxb5 11. Bxb5+ Nbd7 12. O-O-O Rd8 13. Rxd7 Rxd7
14. Rd1 Qe6 15. Bxd7+ Nxd7 16. Qb8+ Nxb8 17. Rd8# 1-0`,
    link_chesscom: null,
    link_lichess: null
  }

  // ------------------------------------------------------------------
  // PLANTILLA — copiá este objeto, pegalo arriba (antes de este comentario,
  // como un elemento más del array) y completá los datos de tu partida real.
  // ------------------------------------------------------------------
  // ,{
  //   id: "kebab-case-slug-unico",
  //   concepto: "Sacrificio posicional",          // agrupador — string libre
  //   titulo: "Título breve y evocador de la partida",
  //   resultado: "1-0",                            // "1-0" | "0-1" | "½-½"
  //   color_tincho: "blancas",                     // "blancas" | "negras"
  //   oponente: "NombreOponente (elo)",
  //   fecha: "2026-09-04",                         // ISO, opcional
  //   control: "Blitz 3+0",                        // opcional
  //   narracion: "Texto de 2 a 4 oraciones explicando qué concepto ilustra la partida y por qué vale la pena mirarla.",
  //   momento_clave: {
  //     ply: 33,                                   // half-move number (jugada 17 de blancas = ply 33)
  //     comentario: "Acá se ve el concepto: [explicación específica del momento]."
  //   },
  //   pgn: `[Event "Live Chess"]\n[White "TinchoGraf"]\n[Black "Oponente"]\n\n1. e4 c5 2. Nf3 ... 1-0`,
  //   link_chesscom: "https://www.chess.com/game/live/173963902190",
  //   link_lichess: null                           // null si no aplica
  // }
];
