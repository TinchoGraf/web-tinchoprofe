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
    // momento_clave sigue definiendo el ply al que salta "Ir al momento clave". Acá coincide
    // a propósito con la última entrada de annotations (ply 33): cuando eso pasa, el contenido
    // de la annotation gana y se muestra en vez de este comentario — así no hay que duplicar texto.
    momento_clave: {
      ply: 33,
      comentario:
        "Acá se ve el concepto: en vez de recuperar material o consolidar, se sigue entregando piezas (torre, alfil, dama) porque el rey negro está atrapado en el centro. El sacrificio se cobra en forma de jaque mate forzado, no de material devuelto."
    },
    // annotations: secuencia de momentos anotados con flecha(s) + casilla(s) resaltada(s) propias.
    // Útil cuando la enseñanza es una serie de jugadas encadenadas, no un solo momento.
    annotations: [
      {
        ply: 19,
        titulo: "Primer sacrificio",
        texto: "Nxb5 solo parece ganar un peón, pero es la primera pieza que se entrega para destapar al rey negro, que todavía no enrocó.",
        arrows: [{ from: "c3", to: "b5", color: "accent" }],
        highlights: [{ square: "b5", color: "warning" }]
      },
      {
        ply: 25,
        titulo: "Se acelera la entrega",
        texto: "Rxd7 tira otra pieza al ataque: la idea es que las negras nunca terminen de coordinar mientras el rey sigue en el centro.",
        arrows: [{ from: "d1", to: "d7", color: "accent" }],
        highlights: [
          { square: "d7", color: "warning" },
          { square: "e8", color: "muted" }
        ]
      },
      {
        ply: 33,
        titulo: "Jaque mate",
        texto: "Rd8 es la jugada final: con la dama y el alfil ya entregados, la torre entra por la columna abierta y el rey en e8 no tiene defensa.",
        arrows: [{ from: "d1", to: "d8", color: "accent" }],
        highlights: [
          { square: "d8", color: "warning" },
          { square: "e8", color: "muted" }
        ]
      }
    ],
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
  //   color_tincho: "blancas",                     // "blancas" | "negras" — tu color siempre se ve abajo
  //   oponente: "NombreOponente (elo)",
  //   fecha: "2026-09-04",                         // ISO, opcional
  //   control: "Blitz 3+0",                        // opcional
  //   narracion: "Texto de 2 a 4 oraciones explicando qué concepto ilustra la partida y por qué vale la pena mirarla.",
  //
  //   // momento_clave: un único ply al que salta el botón "Ir al momento clave". Si la partida
  //   // tiene annotations, por convención usá acá el ply de la primera annotation (o dejalo
  //   // apuntando al momento más importante si preferís que el botón salte directo ahí).
  //   momento_clave: {
  //     ply: 33,                                   // half-move number (jugada 17 de blancas = ply 33)
  //     comentario: "Acá se ve el concepto: [explicación específica del momento]."
  //   },
  //
  //   // annotations (opcional): para partidas donde la enseñanza es una SECUENCIA de jugadas,
  //   // no un solo momento. Una entrada por ply anotado — al llegar a ese ply se dibujan sus
  //   // flechas/highlights sobre el tablero y su texto reemplaza el del box de comentario.
  //   // Si el ply de una annotation coincide con momento_clave.ply, la annotation gana (no
  //   // hace falta duplicar el texto). Partidas sin este campo funcionan exactamente igual
  //   // que antes, mostrando solo momento_clave.
  //   annotations: [
  //     {
  //       ply: 27,                                 // ply de esta anotación (obligatorio)
  //       titulo: "La táctica doble",               // opcional — encabezado corto del box
  //       texto: "El blanco captura el peón, pero el negro tiene una secuencia forzada de dos tácticas encadenadas.",
  //       arrows: [                                 // opcional — líneas con punta de flecha
  //         { from: "e5", to: "f3", color: "accent" },  // colores válidos: "accent" (bordó, default), "muted" (gris), "warning" (ocre)
  //         { from: "d8", to: "d5", color: "muted" }
  //       ],
  //       highlights: [                             // opcional — casillas resaltadas
  //         { square: "d5", color: "accent" },
  //         { square: "f3", color: "warning" }
  //       ]
  //     },
  //     {
  //       ply: 29,                                 // segunda annotation: la secuencia sigue en el siguiente ply anotado
  //       titulo: "Y ahora la segunda",
  //       texto: "Con la primera táctica resuelta, aparece la segunda idea sobre la misma debilidad.",
  //       arrows: [{ from: "d5", to: "g2", color: "accent" }],
  //       highlights: [{ square: "g2", color: "warning" }]
  //     }
  //   ],
  //
  //   pgn: `[Event "Live Chess"]\n[White "TinchoGraf"]\n[Black "Oponente"]\n\n1. e4 c5 2. Nf3 ... 1-0`,
  //   link_chesscom: "https://www.chess.com/game/live/173963902190",
  //   link_lichess: null                           // null si no aplica
  // }
];
