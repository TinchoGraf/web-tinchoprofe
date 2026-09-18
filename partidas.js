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
  },
  {
    id: "pieza-sobrecargada-oneounze-2025",
    concepto: "Pieza sobrecargada",
    titulo: "La importancia de detectar defensores sobrecargados",
    resultado: "1-0",
    color_tincho: "blancas",
    oponente: "oneounze (1868)",
    fecha: "2025-02-05",
    control: "Blitz 3+0",
    narracion:
      "El negro juega Cf4: hasta ese momento el caballo tapaba el ataque por rayos X del alfil c4 sobre su propio alfil de e6, pero al moverse ese ataque queda al descubierto — y de paso el caballo cae en una casilla atacada por la torre. El problema real: su dama defiende tanto al caballo como al alfil — está sobrecargada. Con un sacrificio de calidad las blancas la desvían y cobran una pieza. Más adelante, en el mediojuego, aparece una segunda táctica de desviación aún más brillante: sacrificio de dama por peón para atraer al rey a un doble ataque de caballo que gana la dama enemiga. Dos combinaciones basadas en el mismo principio — atacar piezas cuyos defensores no pueden defender todo.",
    momento_clave: {
      ply: 28,
      comentario:
        "El negro acaba de jugar 14... Cf4. Todo parece defendido, pero la dama en f7 tiene dos trabajos: defender el caballo y el alfil. Cuando una pieza defiende dos cosas a la vez, algo se puede caer."
    },
    annotations: [
      {
        ply: 28,
        titulo: "La sobrecarga",
        texto: "14... Cf4. La dama negra defiende dos piezas — el caballo en f4 (atacado por la torre) y el alfil en e6 (atacado por rayos X del alfil c4). No puede defender ambas si una desaparece bajo un jaque o un cambio forzado. Esa es la sobrecarga.",
        arrows: [
          { from: "f7", to: "f4", color: "muted" },
          { from: "f7", to: "e6", color: "muted" }
        ],
        highlights: [
          { square: "f7", color: "accent" },
          { square: "f4", color: "warning" },
          { square: "e6", color: "warning" }
        ]
      },
      {
        ply: 29,
        titulo: "Desviación con sacrificio de calidad",
        texto: "15. Txf4! Torre por caballo. Parece un cambio desfavorable, pero fuerza a la dama a recapturar — y al hacerlo, deja de defender al alfil de e6.",
        arrows: [{ from: "e4", to: "f4", color: "accent" }],
        highlights: [
          { square: "f4", color: "accent" },
          { square: "f7", color: "muted" }
        ]
      },
      {
        ply: 31,
        titulo: "Cae el alfil con jaque",
        texto: "16. Axe6+. Con la dama fuera de f7, el alfil de c4 se cobra el de e6 y de yapa da jaque. Balance del combo: pieza limpia ganada. La calidad sacrificada no importa cuando ganás material neto y actividad.",
        arrows: [{ from: "c4", to: "e6", color: "accent" }],
        highlights: [
          { square: "e6", color: "accent" },
          { square: "g8", color: "warning" }
        ]
      },
      {
        ply: 47,
        titulo: "Segundo combo: sacrificio brillante",
        texto: "24. Dxg7+! Ahora en el mediojuego aparece la segunda táctica, del mismo espíritu que la primera. El peón g7 sólo lo defiende el rey. Al capturar con jaque, el rey queda obligado a tomar. Pero la idea real es lo que viene después.",
        arrows: [{ from: "c3", to: "g7", color: "accent" }],
        highlights: [
          { square: "g7", color: "accent" },
          { square: "g8", color: "warning" }
        ]
      },
      {
        ply: 49,
        titulo: "El doble ataque del caballo",
        texto: "25. Ch5+! El caballo da jaque desde h5 y, al mismo tiempo, ataca a la dama en f4. Un doble ataque clásico: el rey tiene que moverse sí o sí, y la dama cae en la siguiente jugada.",
        arrows: [
          { from: "g3", to: "h5", color: "accent" },
          { from: "h5", to: "g7", color: "muted" },
          { from: "h5", to: "f4", color: "muted" }
        ],
        highlights: [
          { square: "h5", color: "accent" },
          { square: "g7", color: "warning" },
          { square: "f4", color: "warning" }
        ],
        variantes: [
          {
            titulo: "Cualquier escape del rey pierde la dama",
            texto: "25... Rh8 26. Cxf4 — la dama cae igual. El caballo en h5 controla f4 desde una casilla donde no puede ser capturado. Ningún movimiento del rey defiende f4.",
            moves: ["Kh8", "Nxf4"]
          }
        ]
      },
      {
        ply: 51,
        titulo: "Cobro y balance",
        texto: "26. Cxf4. La dama cae. Balance neto del sacrificio: se dio dama por dama + peón — o sea perdimos apenas un peón por el combo. Pero ya teníamos ventaja material del primer combo, y ahora simplificamos hacia una posición ganadora limpia. El rival abandonó pocas jugadas después.",
        arrows: [{ from: "h5", to: "f4", color: "accent" }],
        highlights: [{ square: "f4", color: "accent" }]
      }
    ],
    pgn: `[Event "Live Chess"]
[Site "Chess.com"]
[Date "2025.02.05"]
[White "TinchoGraf"]
[Black "oneounze"]
[Result "1-0"]
[WhiteElo "1863"]
[BlackElo "1868"]
[ECO "C42"]
[TimeControl "180"]
[Termination "TinchoGraf won by resignation"]

1. e4 e5 2. Nf3 Nf6 3. d3 Nc6 4. Be2 Be7 5. Bg5 O-O 6. Nbd2 d5 7. exd5 Nxd5 8. Bxe7 Qxe7 9. O-O f5 10. Re1 e4 11. dxe4 fxe4 12. Bc4 Be6 13. Rxe4 Qf7 14. Nf1 Nf4 15. Rxf4 Qxf4 16. Bxe6+ Kh8 17. Bb3 Rad8 18. Qe1 Rfe8 19. Qc3 Nd4 20. Nxd4 Rxd4 21. Ng3 Rd2 22. Rf1 Red8 23. h3 b6 24. Qxg7+ Kxg7 25. Nh5+ Kf8 26. Nxf4 a5 27. Ne6+ Ke7 28. Nxd8 Rxd8 29. Re1+ Kd6 30. Rd1+ Ke7 31. Rxd8 1-0`,
    link_chesscom: "https://www.chess.com/analysis/collection/pieza-sobrecargada-apB9tzjG/34gmZe4RgJ/analysis?move=27",
    link_lichess: null
  },
  {
    id: "casillas-debiles-shugde-2026",
    concepto: "Casillas débiles del rival",
    titulo: "La importancia de instalarse en casillas débiles y atacar ganando tempo",
    resultado: "1-0",
    color_tincho: "blancas",
    oponente: "Shugde (1954)",
    fecha: "2026-09-18",
    control: "Blitz 3+0",
    narracion:
      "Las blancas identifican que d5 es una casilla débil del negro — no hay peones que puedan disputarla. Instalan un caballo ahí y desde esa base lanzan un combo de saltos que gana la calidad. Después, en la fase posterior, todas las jugadas blancas atacan piezas del rival ganando tempos: la dama negra pasa la partida escapando, sin poder coordinar defensa. El principio: cuando tenés una casilla fuerte y ganás tempo con cada jugada, la posición se juega sola.",
    momento_clave: {
      ply: 35,
      comentario:
        "18. Cc7 — el caballo salta desde d5 atacando la torre en a8. Ataca con tempo (el negro tiene que responder a la amenaza) y está defendido por el otro caballo. A partir de acá se despliega la ganancia de calidad."
    },
    annotations: [
      {
        ply: 29,
        titulo: "La casilla débil: d5",
        texto: "15. Cd5. El caballo se instala en la casilla débil del negro. Ningún peón negro puede echarlo — c6 y e6 ya avanzaron o no están. Desde acá el caballo apunta a c7, e7, f6, b6 — todas casillas cercanas al rey y a piezas negras.",
        arrows: [{ from: "c3", to: "d5", color: "accent" }],
        highlights: [{ square: "d5", color: "accent" }]
      },
      {
        ply: 35,
        titulo: "Salto con tempo",
        texto: "18. Cc7 — el caballo ataca la torre de a8 y está defendido por el otro caballo. El negro no puede simplemente capturarlo (queda entregado un caballo por nada) y tiene que responder a la amenaza sobre la torre. Tempo ganado.",
        arrows: [
          { from: "d5", to: "c7", color: "accent" },
          { from: "c7", to: "a8", color: "warning" }
        ],
        highlights: [
          { square: "c7", color: "accent" },
          { square: "a8", color: "warning" }
        ]
      },
      {
        ply: 39,
        titulo: "Cae el alfil",
        texto: "20. Cxe6 — el caballo captura el alfil en e6. Los cambios forzados que hizo el negro para deshacerse de los caballos le dejaron el alfil expuesto. Ahora la torre de f8 está en la mira.",
        arrows: [{ from: "c7", to: "e6", color: "muted" }],
        highlights: [
          { square: "e6", color: "accent" },
          { square: "f8", color: "warning" }
        ]
      },
      {
        ply: 41,
        titulo: "Cae la calidad",
        texto: "21. Cxf8. Torre por caballo — ganamos la calidad. Balance del combo: dos piezas menores por torre + alfil. Ventaja clara y activa.",
        arrows: [{ from: "e6", to: "f8", color: "accent" }],
        highlights: [{ square: "f8", color: "accent" }]
      },
      {
        ply: 51,
        titulo: "Tempo tras tempo",
        texto: "26. Tc6 — arranca la segunda fase. Cada jugada blanca ataca la dama negra o una amenaza que hay que atender. La dama negra pasa el resto de la partida corriendo, sin poder coordinar defensa. Cuando ganás muchos tempos seguidos, el rival termina cayendo por presión acumulada — que fue exactamente lo que pasó acá.",
        arrows: [
          { from: "c1", to: "c6", color: "accent" },
          { from: "c6", to: "b6", color: "warning" }
        ],
        highlights: [
          { square: "c6", color: "accent" },
          { square: "b6", color: "warning" }
        ]
      }
    ],
    pgn: `[Event "Live Chess"]
[Site "Chess.com"]
[Date "2026.09.18"]
[White "TinchoGraf"]
[Black "Shugde"]
[Result "1-0"]
[WhiteElo "1973"]
[BlackElo "1954"]
[ECO "B31"]
[TimeControl "180"]
[Termination "TinchoGraf won on time"]

1. e4 c5 2. Nf3 Nc6 3. Bb5 g6 4. O-O Bg7 5. Re1 d6 6. c3 e5 7. d4 cxd4 8. cxd4 exd4 9. Nxd4 Ne7 10. Bg5 f6 11. Bh4 O-O 12. Nc3 Ne5 13. Ba4 a6 14. Bb3+ Kh8 15. Nd5 g5 16. Bg3 b5 17. Rc1 Bb7 18. Nc7 Bc8 19. Nce6 Bxe6 20. Nxe6 Qb6 21. Nxf8 Rxf8 22. Bxe5 fxe5 23. Qe2 Ng6 24. g3 g4 25. Bd5 h5 26. Rc6 Qd4 27. Rd1 Qb4 28. a3 Qa5 29. Rdc1 Bh6 30. R1c2 Ne7 31. Rxd6 Bg5 32. Be6 b4 33. Rxa6 Qd8 34. Ra7 b3 35. Rcc7 Qd6 36. h4 Bf6 37. Qe3 Kg7 38. Rd7 1-0`,
    link_chesscom: "https://www.chess.com/analysis/collection/posicionales-tempo-3ATNub8bp/54wa6rsCN2/analysis?move=33",
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
  //   oponente_titulo: "CM",                       // opcional — título ajedrecístico del oponente:
  //                                                 // CM, FM, IM, GM, NM, WGM, WIM, WFM, WCM.
  //                                                 // Si se omite (o va vacío/null), no se muestra badge.
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
