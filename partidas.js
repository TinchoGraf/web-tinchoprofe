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
    id: "jugada-intermedia-descubierto-smadilogica-2026",
    concepto: "Jugada intermedia + descubierto ganador",
    titulo: "La importancia de las jugadas intermedias en el cálculo del mediojuego",
    resultado: "0-1",
    color_tincho: "negras",
    oponente: "SmadiLogica (1896)",
    fecha: "2026-09-10",
    control: "Blitz 3+0",
    narracion:
      "El blanco captura un peón central sin ver que el negro tiene una secuencia forzada de dos tácticas encadenadas. Primero una jugada intermedia con jaque que quita al defensor de la pieza que quedó colgada, y después un ataque al descubierto que gana una pieza más. La partida se resuelve en tres jugadas de cálculo y el resto es convertir la ventaja material.",
    momento_clave: {
      ply: 27,
      comentario:
        "El blanco acaba de jugar 14. Cxd5, capturando el peón central. El caballo de d5 sólo lo defiende el alfil de f3. Ahí arranca la secuencia."
    },
    annotations: [
      {
        ply: 27,
        titulo: "La posición del cálculo",
        texto: "Blanco acaba de jugar 14. Cxd5. El caballo central sólo lo defiende el alfil de f3. Las negras tienen que ver dos ideas: sacar al defensor con jaque, y que la torre de d8 ya está enfilada contra d5.",
        arrows: [
          { from: "f3", to: "d5", color: "muted" },
          { from: "d8", to: "d5", color: "warning" }
        ],
        highlights: [
          { square: "d5", color: "accent" },
          { square: "f3", color: "muted" }
        ]
      },
      {
        ply: 28,
        titulo: "Jugada intermedia",
        texto: "14... Cxf3+! En vez de tomar el caballo central, el negro elimina al defensor con jaque. La clave: los jaques de caballo se responden únicamente capturando el caballo o moviendo el rey, así que la recaptura con la dama es forzada.",
        arrows: [{ from: "e5", to: "f3", color: "accent" }],
        highlights: [{ square: "f3", color: "accent" }]
      },
      {
        ply: 30,
        titulo: "Ahora sí, el caballo central",
        texto: "15... Cxd5. Con el defensor fuera del tablero, el otro caballo negro captura el caballo de d5. Ganamos una pieza, pero todavía falta el segundo golpe.",
        arrows: [{ from: "f6", to: "d5", color: "accent" }],
        highlights: [{ square: "d5", color: "accent" }]
      },
      {
        ply: 31,
        titulo: "Trampa preparada",
        texto: "16. Dxd5 recaptura. La dama blanca queda en d5 — la misma columna que la torre negra de d8. Todo listo para el descubierto.",
        arrows: [{ from: "d8", to: "d5", color: "warning" }],
        highlights: [
          { square: "d5", color: "warning" },
          { square: "d8", color: "muted" }
        ]
      },
      {
        ply: 32,
        titulo: "Ataque al descubierto",
        texto: "16... Axg3! El alfil captura otro alfil y al moverse deja a la torre de d8 atacando a la dama. La dama tiene que salvarse y perdemos un alfil más. Balance final: dos piezas menores por caballo y peón.",
        arrows: [
          { from: "d6", to: "g3", color: "accent" },
          { from: "d8", to: "d5", color: "accent" }
        ],
        highlights: [
          { square: "g3", color: "accent" },
          { square: "d5", color: "warning" }
        ]
      }
    ],
    pgn: `[Event "Live Chess"]
[Site "Chess.com"]
[Date "2026.09.10"]
[White "SmadiLogica"]
[Black "TinchoGraf"]
[Result "0-1"]
[WhiteElo "1896"]
[BlackElo "1904"]
[ECO "D00"]
[TimeControl "180"]
[Termination "TinchoGraf won by checkmate"]

1. d4 d5 2. Nc3 Nf6 3. Nf3 Bg4 4. Bf4 e6 5. e3 Bd6 6. Bg3 O-O 7. Bd3 Nbd7 8. O-O Qe7 9. Be2 Bxf3 10. Bxf3 Rfe8 11. Re1 Rad8 12. Qe2 e5 13. dxe5 Nxe5 14. Nxd5 Nxf3+ 15. Qxf3 Nxd5 16. Qxd5 Bxg3 17. Qf3 Bd6 18. Qxb7 Qh4 19. g3 Qg4 20. b4 Rb8 21. Qxa7 Rxb4 22. Qa5 h5 23. h4 Bxg3 24. Qg5 Bxh4+ 25. Qxg4 Rxg4+ 26. Kf1 Rc4 27. Re2 Rb8 28. f4 Rb2 29. Rd1 Rbxc2 30. Rd8+ Kh7 31. Rd7 Bf6 32. Rxf7 h4 33. Rxc2 Rxc2 34. a4 h3 35. Kg1 Kg6 36. Rd7 Kf5 37. Rd5+ Ke4 38. Rh5 h2+ 39. Kh1 Kxe3 40. f5 Kf3 41. Rxh2 Rxh2+ 42. Kxh2 Bd4 43. a5 Kf4 44. a6 Kxf5 45. Kg3 g5 46. a7 Bxa7 47. Kf3 Bd4 48. Kg3 g4 49. Kg2 Kf4 50. Kf1 c5 51. Ke2 c4 52. Kf1 Kg3 53. Ke2 Kh2 54. Kd2 g3 55. Kc2 g2 56. Kd2 g1=Q 57. Ke2 Qe3+ 58. Kd1 Qf2 59. Kc1 c3 60. Kd1 Qd2# 0-1`,
    link_chesscom: "https://www.chess.com/analysis/collection/jugada-intermedia-descubierto-ganador-wrK1EX4a/2rx5UhLr4e/analysis?move=26",
    link_lichess: null
  },
  {
    id: "mates-forzados-kimple1-2025",
    concepto: "Atacar al rey sin defensores",
    titulo: "La importancia de conocer las distintas figuras de mate",
    resultado: "1-0",
    color_tincho: "blancas",
    oponente: "Kimple1 (1770)",
    fecha: "2025-02-23",
    control: "Blitz 3+0",
    narracion:
      "Un error posicional del negro deja al rey sin defensores — todas sus piezas fueron al ataque. A partir de ahí las blancas encuentran una secuencia forzada de jaques y capturas que termina en mate. La lección: cuando calculás jugadas forzadas un poco más adelante, muchas veces aparece una figura de mate escondida que no se ve a primera vista.",
    momento_clave: {
      ply: 34,
      comentario:
        "El negro acaba de jugar 17... f5, debilitando su posición sin defender al rey. Todas las piezas negras están del lado opuesto del tablero — ninguna vuelve a tiempo."
    },
    annotations: [
      {
        ply: 34,
        titulo: "El error: rey sin defensores",
        texto: "17... f5? El negro sigue atacando pero se olvida de defender. La dama negra está en h5, la torre en d8, el caballo en c6, el rey en c8. Ninguna pieza puede volver a defender la casilla c7 ni el flanco de dama a tiempo. Ahora las blancas calculan jugadas forzadas y aparece el mate.",
        arrows: [
          { from: "h5", to: "c8", color: "muted" },
          { from: "d8", to: "c8", color: "muted" }
        ],
        highlights: [
          { square: "c8", color: "warning" },
          { square: "c7", color: "accent" }
        ]
      },
      {
        ply: 35,
        titulo: "Sacrificio con jaque forzado",
        texto: "18. Txc6+! Sacrificio de torre por caballo, con jaque. Las respuestas son forzadas: si 18... bxc6 sigue 19. Dxc6# — la dama entra por la diagonal y da mate con la torre negra clavada. Si el rey se mueve, entra otra idea que ya veremos.",
        arrows: [{ from: "c1", to: "c6", color: "accent" }],
        highlights: [
          { square: "c6", color: "accent" },
          { square: "c8", color: "warning" }
        ],
        variantes: [
          {
            titulo: "Si el negro captura la torre",
            texto: "18... bxc6 19. Dxc6# — la dama entra por la diagonal a4-c6 y da mate: cubre b7, c7 y d7; el alfil de f4 cubre b8 por la diagonal larga; y d8 lo ocupa la propia torre negra. El rey en c8 no tiene a dónde ir.",
            moves: ["bxc6", "Qxc6#"]
          }
        ]
      },
      {
        ply: 36,
        titulo: "El rey escapa (pero no se salva)",
        texto: "18... Kd7. El rey evita la captura, pero la torre en c6 sigue clavando y ahora hay una segunda figura de mate: un descubierto usando el alfil de f4 como pieza protectora, y la dama controlando la diagonal blanca.",
        arrows: [
          { from: "f4", to: "c7", color: "muted" },
          { from: "a4", to: "d7", color: "muted" }
        ],
        highlights: [
          { square: "d7", color: "warning" },
          { square: "c7", color: "accent" }
        ]
      },
      {
        ply: 37,
        titulo: "Mate al descubierto",
        texto: "19. Tc7#. Jaque mate. La torre se mueve a c7 dando jaque, protegida por el alfil de f4. El rey no puede capturar (alfil defiende), no puede escapar a d6 ni e8 (dama y alfil cubren), no puede bloquear. Mate.",
        arrows: [
          { from: "c6", to: "c7", color: "accent" },
          { from: "f4", to: "c7", color: "muted" }
        ],
        highlights: [
          { square: "c7", color: "accent" },
          { square: "d7", color: "warning" }
        ]
      }
    ],
    pgn: `[Event "Live Chess"]
[Site "Chess.com"]
[Date "2025.02.23"]
[White "TinchoGraf"]
[Black "Kimple1"]
[Result "1-0"]
[WhiteElo "1809"]
[BlackElo "1770"]
[ECO "B13"]
[TimeControl "180"]
[Termination "TinchoGraf won by checkmate"]

1. e4 c6 2. Nf3 d5 3. exd5 cxd5 4. d4 Bf5 5. c4 Nf6 6. Nc3 e6 7. Bd3 Bg6 8. cxd5 Nxd5 9. O-O Nc6 10. a3 Be7 11. Nxd5 Qxd5 12. Bxg6 hxg6 13. Be3 Bd6 14. Qa4 Bxh2+ 15. Nxh2 Qh5 16. Bf4 O-O-O 17. Rac1 f5 18. Rxc6+ Kd7 19. Rc7# 1-0`,
    link_chesscom: "https://www.chess.com/analysis/collection/mates-del-pasillo-2TJahP88n/RZV2FMqd8/analysis?move=33",
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
  //         { from: "e5", to: "f3", color: "accent" },  // colores válidos: "accent" (bordó, default), "muted" (azul pizarra), "warning" (ocre)
  //         { from: "d8", to: "d5", color: "muted" }
  //       ],
  //       highlights: [                             // opcional — casillas resaltadas
  //         { square: "d5", color: "accent" },
  //         { square: "f3", color: "warning" }
  //       ],
  //       // variantes (opcional): líneas alternativas que NO se jugaron, para mostrar una
  //       // respuesta forzada distinta (típico en mates con varias defensas posibles).
  //       // Aparece un botón "Ver variante" por cada una debajo del texto de la annotation;
  //       // al clickearlo el tablero pasa a mostrar la línea y un botón para volver.
  //       // "moves" son jugadas en SAN aplicadas en orden desde la posición de este ply —
  //       // si alguna es ilegal o está mal escrita, esa variante no se muestra (se loguea
  //       // un warning en consola con el id de la partida y el índice de la variante).
  //       variantes: [
  //         {
  //           titulo: "Si captura con el peón",
  //           texto: "En vez de la jugada real, si el negro captura con el peón sigue una dama entrando con jaque mate.",
  //           moves: ["bxc6", "Qxc6#"]
  //         }
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
