/* ============================================
   TINCHOGRAF — Scripts
   Tablero propio (Unicode + divs) + chess.js
   ============================================ */

// Mismos glifos rellenos para ambos colores — el color/contorno lo da el CSS
// (.cb__piece--white / .cb__piece--black), así las blancas se leen bien sobre
// casillas claras y highlights en vez de perderse con el glifo de contorno.
const PIECE_UNICODE = {
  wK: "♚", wQ: "♛", wR: "♜", wB: "♝", wN: "♞", wP: "♟",
  bK: "♚", bQ: "♛", bR: "♜", bB: "♝", bN: "♞", bP: "♟"
};
const PIECE_NAMES = {
  wK: "rey blanco", wQ: "dama blanca", wR: "torre blanca", wB: "alfil blanco", wN: "caballo blanco", wP: "peón blanco",
  bK: "rey negro", bQ: "dama negra", bR: "torre negra", bB: "alfil negro", bN: "caballo negro", bP: "peón negro"
};
const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];

const ARROW_COLORS = {
  green: "rgba(21, 120, 27, 0.85)",
  yellow: "rgba(214, 158, 20, 0.9)",
  red: "rgba(178, 34, 34, 0.85)",
  blue: "rgba(30, 100, 200, 0.85)"
};

// Colores para anotaciones de partidas modelo (flechas + casillas resaltadas).
// Ligados a las variables CSS --arrow-*/--hl-* para mantener una sola fuente de verdad.
const ANNOTATION_ARROW_COLORS = {
  accent: "var(--arrow-accent)",
  muted: "var(--arrow-muted)",
  warning: "var(--arrow-warning)"
};
const ANNOTATION_HIGHLIGHT_COLORS = {
  accent: "var(--hl-accent)",
  muted: "var(--hl-muted)",
  warning: "var(--hl-warning)"
};

function fenToBoard(fen) {
  const rows = fen.split(" ")[0].split("/");
  const board = [];
  for (const row of rows) {
    const cells = [];
    for (const ch of row) {
      if (/\d/.test(ch)) {
        for (let i = 0; i < parseInt(ch); i++) cells.push(null);
      } else {
        const color = ch === ch.toUpperCase() ? "w" : "b";
        cells.push(color + ch.toUpperCase());
      }
    }
    board.push(cells);
  }
  return board;
}

/* ============================================
   ChessRenderer: tablero con divs + Unicode
   ============================================ */
class ChessRenderer {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.container.classList.add("cb");
    this.flipped = options.flipped || false;
    this.draggable = options.draggable || false;
    this.onMove = options.onMove || null;
    this.canDragPiece = options.canDragPiece || null;
    this.legalMovesFor = null;
    this.squares = {};
    this.squarePositions = {};
    this.fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
    this.draggedFrom = null;
    this.selectedSquare = null;
    this.arrows = [];
    this.arrowDrawing = null;
    this.arrowLayer = null;
    this.arrowMarkerId = "cb-arrowhead-" + containerId;
    this.overlay = null;
    this.overlayMarkerId = "cb-overlay-arrowhead-" + containerId;
    this.annotationArrows = [];
    this.annotationHighlights = [];
    this.focusedSquare = this.draggable ? "e1" : null;
    if (this.draggable) {
      this.container.addEventListener("contextmenu", (e) => e.preventDefault());
      document.addEventListener("mouseup", (e) => {
        if (e.button === 2) this.arrowDrawing = null;
      });
    }
    this.build();
  }

  build() {
    this.container.innerHTML = "";
    const grid = document.createElement("div");
    grid.className = "cb__grid";
    if (this.draggable) {
      grid.setAttribute("role", "grid");
      grid.setAttribute("aria-label", "Tablero de ajedrez, usá las flechas para moverte y Enter para seleccionar o mover");
    }
    this.squares = {};
    this.squarePositions = {};

    for (let visualRow = 0; visualRow < 8; visualRow++) {
      for (let visualCol = 0; visualCol < 8; visualCol++) {
        const file = this.flipped ? FILES[7 - visualCol] : FILES[visualCol];
        const rank = this.flipped ? (visualRow + 1) : (8 - visualRow);
        const sqName = file + rank;

        const sq = document.createElement("div");
        const lightSquare = (visualRow + visualCol) % 2 === 0;
        sq.className = "cb__sq " + (lightSquare ? "cb__sq--light" : "cb__sq--dark");
        sq.dataset.square = sqName;

        if (this.draggable) {
          sq.setAttribute("role", "gridcell");
          sq.tabIndex = sqName === this.focusedSquare ? 0 : -1;
        }

        if (visualCol === 0) {
          const r = document.createElement("span");
          r.className = "cb__coord cb__coord--rank";
          r.textContent = rank;
          sq.appendChild(r);
        }
        if (visualRow === 7) {
          const f = document.createElement("span");
          f.className = "cb__coord cb__coord--file";
          f.textContent = file;
          sq.appendChild(f);
        }

        if (this.draggable) {
          this.attachDragHandlers(sq, sqName);
          this.attachArrowHandlers(sq, sqName);
        }
        grid.appendChild(sq);
        this.squares[sqName] = sq;
        this.squarePositions[sqName] = { row: visualRow, col: visualCol };
      }
    }
    this.container.appendChild(grid);
    this.setPosition(this.fen);
    this.buildArrowLayer();
    this.renderArrows();
    this.buildOverlay();
    this.renderAnnotation();
  }

  attachDragHandlers(sq, sqName) {
    sq.addEventListener("dragstart", (e) => {
      const pieceEl = sq.querySelector(".cb__piece");
      if (!pieceEl) { e.preventDefault(); return; }
      if (this.canDragPiece && !this.canDragPiece(pieceEl.dataset.piece, sqName)) {
        e.preventDefault();
        return;
      }
      this.draggedFrom = sqName;
      try { e.dataTransfer.setData("text/plain", sqName); } catch (_) {}
      e.dataTransfer.effectAllowed = "move";
      pieceEl.classList.add("cb__piece--dragging");
      this.highlightLegalMoves(sqName);
    });

    sq.addEventListener("dragend", () => {
      this.container.querySelectorAll(".cb__piece--dragging")
        .forEach((p) => p.classList.remove("cb__piece--dragging"));
      this.clearHighlights();
      this.draggedFrom = null;
    });

    sq.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    });

    sq.addEventListener("drop", (e) => {
      e.preventDefault();
      const from = this.draggedFrom;
      const to = sqName;
      this.draggedFrom = null;
      this.clearHighlights();
      this.clearArrows();
      if (!from || from === to) return;
      if (this.onMove) this.onMove(from, to);
    });

    // Click-to-move
    sq.addEventListener("click", () => this.activateSquare(sqName));

    // Navegación por teclado (flechas para mover el foco, Enter/Espacio para seleccionar o mover)
    sq.addEventListener("keydown", (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        this.moveFocus(sqName, e.key);
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.activateSquare(sqName);
      }
    });
  }

  activateSquare(sqName) {
    const sq = this.squares[sqName];
    this.clearArrows();
    if (this.selectedSquare && this.selectedSquare !== sqName) {
      const from = this.selectedSquare;
      this.clearSelection();
      if (this.onMove) this.onMove(from, sqName);
      return;
    }
    const pieceEl = sq.querySelector(".cb__piece");
    if (pieceEl) {
      if (this.canDragPiece && !this.canDragPiece(pieceEl.dataset.piece, sqName)) return;
      this.selectedSquare = sqName;
      sq.classList.add("cb__sq--selected");
      this.highlightLegalMoves(sqName);
    } else {
      this.clearSelection();
    }
  }

  moveFocus(fromSquare, key) {
    const pos = this.squarePositions[fromSquare];
    if (!pos) return;
    let { row, col } = pos;
    if (key === "ArrowUp") row = Math.max(0, row - 1);
    else if (key === "ArrowDown") row = Math.min(7, row + 1);
    else if (key === "ArrowLeft") col = Math.max(0, col - 1);
    else if (key === "ArrowRight") col = Math.min(7, col + 1);
    const target = Object.entries(this.squarePositions)
      .find(([, p]) => p.row === row && p.col === col);
    if (target) this.focusSquare(target[0]);
  }

  focusSquare(sqName) {
    if (this.focusedSquare && this.squares[this.focusedSquare]) {
      this.squares[this.focusedSquare].tabIndex = -1;
    }
    this.focusedSquare = sqName;
    const el = this.squares[sqName];
    if (el) {
      el.tabIndex = 0;
      el.focus();
    }
  }

  setLegalMovesProvider(fn) { this.legalMovesFor = fn; }

  // Click derecho + arrastre: dibuja flechas de análisis (no afecta la partida)
  attachArrowHandlers(sq, sqName) {
    sq.addEventListener("mousedown", (e) => {
      if (e.button !== 2) return;
      e.preventDefault();
      this.arrowDrawing = sqName;
    });
    sq.addEventListener("mouseup", (e) => {
      if (e.button !== 2 || !this.arrowDrawing) return;
      const from = this.arrowDrawing;
      this.arrowDrawing = null;
      if (from === sqName) return;
      this.toggleArrow(from, sqName);
    });
  }

  buildArrowLayer() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "cb__arrows");
    svg.setAttribute("viewBox", "0 0 8 8");
    svg.setAttribute("preserveAspectRatio", "none");
    const markers = Object.entries(ARROW_COLORS).map(([name, value]) => `
      <marker id="${this.arrowMarkerId}-${name}" markerWidth="2.6" markerHeight="2.6"
              refX="1.3" refY="1.3" orient="auto-start-reverse" markerUnits="strokeWidth">
        <path d="M0,0 L2.6,1.3 L0,2.6 Z" fill="${value}" />
      </marker>`).join("");
    svg.innerHTML = `<defs>${markers}</defs>`;
    this.container.appendChild(svg);
    this.arrowLayer = svg;
  }

  // "e4" -> { x, y } esquina superior-izquierda de la casilla en el espacio del viewBox (0-8),
  // respetando this.flipped.
  squareToXY(sqName) {
    const fileIdx = FILES.indexOf(sqName[0]);
    const rank = parseInt(sqName.slice(1), 10);
    if (fileIdx < 0 || !rank) return null;
    const col = this.flipped ? 7 - fileIdx : fileIdx;
    const row = this.flipped ? rank - 1 : 8 - rank;
    return { x: col, y: row };
  }

  squareCenter(sqName) {
    const xy = this.squareToXY(sqName);
    if (!xy) return null;
    return { x: xy.x + 0.5, y: xy.y + 0.5 };
  }

  toggleArrow(from, to) {
    const idx = this.arrows.findIndex((a) => a.from === from && a.to === to);
    if (idx >= 0) this.arrows.splice(idx, 1);
    else this.arrows.push({ from, to, color: "green" });
    this.renderArrows();
  }

  // Flechas fijas (no interactivas), p.ej. para anotar ideas en una partida cargada
  setArrows(list) {
    this.arrows = Array.isArray(list) ? list.slice() : [];
    this.renderArrows();
  }

  clearArrows() {
    if (this.arrows.length === 0) return;
    this.arrows = [];
    this.renderArrows();
  }

  renderArrows() {
    if (!this.arrowLayer) return;
    this.arrowLayer.querySelectorAll(".cb__arrow-line").forEach((l) => l.remove());
    const ns = "http://www.w3.org/2000/svg";
    this.arrows.forEach(({ from, to, color }) => {
      const a = this.squareCenter(from);
      const b = this.squareCenter(to);
      if (!a || !b) return;
      const colorName = ARROW_COLORS[color] ? color : "green";
      const dx = b.x - a.x, dy = b.y - a.y;
      const dist = Math.hypot(dx, dy) || 1;
      const pullback = 0.34;
      const endX = b.x - (dx / dist) * pullback;
      const endY = b.y - (dy / dist) * pullback;
      const line = document.createElementNS(ns, "line");
      line.setAttribute("x1", a.x);
      line.setAttribute("y1", a.y);
      line.setAttribute("x2", endX);
      line.setAttribute("y2", endY);
      line.setAttribute("class", "cb__arrow-line");
      line.setAttribute("stroke", ARROW_COLORS[colorName]);
      line.setAttribute("marker-end", `url(#${this.arrowMarkerId}-${colorName})`);
      this.arrowLayer.appendChild(line);
    });
  }

  // Overlay de anotaciones de partidas modelo: flechas + casillas resaltadas
  // para ilustrar una secuencia táctica (independiente de las flechas libres de análisis).
  buildOverlay() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "cb__overlay");
    svg.setAttribute("viewBox", "0 0 8 8");
    svg.setAttribute("preserveAspectRatio", "none");
    const markers = Object.entries(ANNOTATION_ARROW_COLORS).map(([name, value]) => `
      <marker id="${this.overlayMarkerId}-${name}" markerWidth="2.6" markerHeight="2.6"
              refX="1.3" refY="1.3" orient="auto-start-reverse" markerUnits="strokeWidth">
        <path d="M0,0 L2.6,1.3 L0,2.6 Z" fill="${value}" />
      </marker>`).join("");
    svg.innerHTML = `<defs>${markers}</defs>`;
    this.container.appendChild(svg);
    this.overlay = svg;
  }

  showAnnotation({ arrows = [], highlights = [] } = {}) {
    this.annotationArrows = Array.isArray(arrows) ? arrows : [];
    this.annotationHighlights = Array.isArray(highlights) ? highlights : [];
    this.renderAnnotation();
  }

  clearAnnotation() {
    if (this.annotationArrows.length === 0 && this.annotationHighlights.length === 0) return;
    this.annotationArrows = [];
    this.annotationHighlights = [];
    this.renderAnnotation();
  }

  renderAnnotation() {
    if (!this.overlay) return;
    this.overlay.querySelectorAll(".cb__overlay-shape").forEach((el) => el.remove());
    const ns = "http://www.w3.org/2000/svg";

    // Casillas resaltadas primero, para que las flechas queden por encima.
    this.annotationHighlights.forEach(({ square, color }) => {
      const xy = this.squareToXY(square);
      if (!xy) return;
      const colorName = ANNOTATION_HIGHLIGHT_COLORS[color] ? color : "accent";
      const rect = document.createElementNS(ns, "rect");
      rect.setAttribute("x", xy.x + 0.04);
      rect.setAttribute("y", xy.y + 0.04);
      rect.setAttribute("width", 0.92);
      rect.setAttribute("height", 0.92);
      rect.setAttribute("class", "cb__overlay-shape cb__overlay-highlight");
      rect.setAttribute("fill", ANNOTATION_HIGHLIGHT_COLORS[colorName]);
      rect.setAttribute("stroke", ANNOTATION_ARROW_COLORS[colorName]);
      this.overlay.appendChild(rect);
    });

    this.annotationArrows.forEach(({ from, to, color }) => {
      const a = this.squareCenter(from);
      const b = this.squareCenter(to);
      if (!a || !b) return;
      const colorName = ANNOTATION_ARROW_COLORS[color] ? color : "accent";
      const dx = b.x - a.x, dy = b.y - a.y;
      const dist = Math.hypot(dx, dy) || 1;
      const pullback = 0.34;
      const endX = b.x - (dx / dist) * pullback;
      const endY = b.y - (dy / dist) * pullback;
      const line = document.createElementNS(ns, "line");
      line.setAttribute("x1", a.x);
      line.setAttribute("y1", a.y);
      line.setAttribute("x2", endX);
      line.setAttribute("y2", endY);
      line.setAttribute("class", "cb__overlay-shape cb__overlay-arrow");
      line.setAttribute("stroke", ANNOTATION_ARROW_COLORS[colorName]);
      line.setAttribute("marker-end", `url(#${this.overlayMarkerId}-${colorName})`);
      this.overlay.appendChild(line);
    });
  }

  highlightLegalMoves(from) {
    this.clearHighlights();
    if (!this.legalMovesFor) return;
    const moves = this.legalMovesFor(from);
    moves.forEach((to) => {
      const sq = this.squares[to];
      if (!sq) return;
      const hasPiece = sq.querySelector(".cb__piece");
      const dot = document.createElement("div");
      dot.className = hasPiece ? "cb__hint cb__hint--capture" : "cb__hint";
      sq.appendChild(dot);
    });
  }

  clearHighlights() {
    this.container.querySelectorAll(".cb__hint").forEach((d) => d.remove());
  }

  clearSelection() {
    this.container.querySelectorAll(".cb__sq--selected")
      .forEach((s) => s.classList.remove("cb__sq--selected"));
    this.selectedSquare = null;
    this.clearHighlights();
  }

  setPosition(fen) {
    this.fen = fen;
    const matrix = fenToBoard(fen);
    Object.entries(this.squares).forEach(([sqName, sq]) => {
      sq.querySelectorAll(".cb__piece").forEach((p) => p.remove());
      sq.setAttribute("aria-label", `${sqName}, vacío`);
    });
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = matrix[r][c];
        if (!piece) continue;
        const sqName = FILES[c] + (8 - r);
        const target = this.squares[sqName];
        if (!target) continue;
        const pieceEl = document.createElement("span");
        const colorClass = piece[0] === "w" ? "cb__piece--white" : "cb__piece--black";
        pieceEl.className = "cb__piece " + colorClass;
        pieceEl.dataset.piece = piece;
        pieceEl.textContent = PIECE_UNICODE[piece];
        if (this.draggable) pieceEl.draggable = true;
        target.appendChild(pieceEl);
        target.setAttribute("aria-label", `${sqName}, ${PIECE_NAMES[piece]}`);
      }
    }
  }

  flip() { this.flipped = !this.flipped; this.build(); }

  highlightLastMove(from, to) {
    this.container.querySelectorAll(".cb__sq--last")
      .forEach((s) => s.classList.remove("cb__sq--last"));
    if (from && this.squares[from]) this.squares[from].classList.add("cb__sq--last");
    if (to && this.squares[to]) this.squares[to].classList.add("cb__sq--last");
  }
}

/* ============================================
   Verificar que chess.js esté cargado
   ============================================ */
function ensureChessLoaded() {
  if (typeof Chess === "undefined") {
    // Mostrar mensaje claro en todos los contenedores de tablero
    const containers = document.querySelectorAll("#analysis-board, [id^='board-']");
    containers.forEach((el) => {
      el.innerHTML = `
        <div style="padding:2rem;border:1px solid var(--accent);background:#fff8f8;color:#8b1a1a;font-family:var(--serif);text-align:center;">
          <p style="font-size:1.1rem;margin-bottom:0.5rem;"><strong>chess.js no se pudo cargar.</strong></p>
          <p style="font-size:0.9rem;font-style:italic;">
            Para que los tableros funcionen necesitás servir la página con un servidor local
            (no abrirla con doble click). Ver instrucciones en el README.
          </p>
        </div>`;
    });
    return false;
  }
  return true;
}

/* ============================================
   MAIN
   ============================================ */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();

  const toggle = document.querySelector(".nav__toggle");
  const links = document.querySelector(".nav__links");
  const setMenuOpen = (open) => {
    links.classList.toggle("nav__links--open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  };
  toggle?.addEventListener("click", () => setMenuOpen(!links.classList.contains("nav__links--open")));
  links?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => setMenuOpen(false));
  });

  if (!ensureChessLoaded()) return;

  // PGNs de ejemplo (reemplazar por partidas reales)
  const PGNS = {
    "mejor-1": `[Event "Mejor 1"]
[White "Tinchograf"]
[Black "Oponente"]

1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3 e5 7. Nb3 Be6 8. f3 Be7 9. Qd2 O-O 10. O-O-O Nbd7 *`,
    "mejor-2": `[Event "Mejor 2"]
[White "Oponente"]
[Black "Tinchograf"]

1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 a6 5. Bd3 Nf6 6. O-O Qc7 7. Qe2 d6 8. c4 g6 9. Nc3 Bg7 10. Rd1 O-O *`
  };

  // Anotaciones por partida: flechas de colores + leyenda, ancladas a una jugada (ply) puntual.
  // Se editan a mano al subir cada partida real. "ply" es el número de medio-movimiento
  // (0 = posición inicial, 1 = después de la primera jugada de blancas, etc.)
  const GAME_ANNOTATIONS = {
    "mejor-1": {
      20: {
        arrows: [
          { from: "g2", to: "g4", color: "green" },
          { from: "h2", to: "h4", color: "green" },
          { from: "f3", to: "f4", color: "yellow" },
          { from: "b7", to: "b5", color: "red" },
          { from: "d7", to: "c5", color: "red" }
        ],
        legend: [
          { color: "green", label: "Blancas: ataque en el flanco rey (g4-h4-g5)" },
          { color: "yellow", label: "Plan alternativo: expansión central con f4-f5" },
          { color: "red", label: "Ojo con el contrajuego de negras en el flanco dama (b5-b4, Nc5)" }
        ]
      }
    }
  };

  const boards = {};

  function setupGameBoard(id) {
    const pgn = PGNS[id];
    if (!pgn) return;
    const replay = new Chess();
    if (!replay.load_pgn(pgn)) return;
    const history = replay.history({ verbose: true });

    const tmp = new Chess();
    const positions = [{ fen: tmp.fen(), from: null, to: null }];
    const sanMoves = [];
    history.forEach((mv) => {
      tmp.move(mv);
      positions.push({ fen: tmp.fen(), from: mv.from, to: mv.to });
      sanMoves.push(mv.san);
    });

    const renderer = new ChessRenderer(`board-${id}`, { draggable: false });
    boards[id] = { renderer, positions, sanMoves, ply: 0 };
    refreshGameBoard(id);
  }

  function renderLegend(id, legend) {
    const el = document.getElementById(`legend-${id}`);
    if (!el) return;
    el.innerHTML = "";
    (legend || []).forEach(({ color, label }) => {
      const item = document.createElement("div");
      item.className = "game__legend-item";
      const dot = document.createElement("span");
      dot.className = "game__legend-dot";
      dot.style.background = ARROW_COLORS[color] || ARROW_COLORS.green;
      const text = document.createElement("span");
      text.textContent = label;
      item.appendChild(dot);
      item.appendChild(text);
      el.appendChild(item);
    });
  }

  function refreshGameBoard(id) {
    const state = boards[id];
    if (!state) return;
    const pos = state.positions[state.ply];
    state.renderer.setPosition(pos.fen);
    state.renderer.highlightLastMove(pos.from, pos.to);

    const annotation = GAME_ANNOTATIONS[id] && GAME_ANNOTATIONS[id][state.ply];
    state.renderer.setArrows(annotation ? annotation.arrows : []);
    renderLegend(id, annotation ? annotation.legend : []);

    const label = document.getElementById(`move-${id}`);
    if (label) {
      if (state.ply === 0) {
        label.textContent = "Posición inicial";
      } else {
        const moveNum = Math.ceil(state.ply / 2);
        const san = state.sanMoves[state.ply - 1];
        const isWhite = state.ply % 2 === 1;
        label.textContent = `${moveNum}${isWhite ? "." : "..."} ${san}`;
      }
    }

    updateKeyMoment(id, state);
  }

  // Actualiza el slot de comentario (narración general <-> box de momento clave) + las
  // flechas/highlights sobre el tablero según el ply actual. Prioridad: si hay una annotation
  // para este ply, su contenido gana. Si no, y la partida NO tiene annotations, se usa el
  // momento_clave "clásico" cuando el ply coincide. Si no hay match, se muestra la narración.
  function updateKeyMoment(id, state) {
    const slot = document.getElementById(`comment-${id}`);
    if (!slot) return;

    const annotations = state.annotations || [];
    const annotation = annotations.find((a) => a.ply === state.ply);

    if (annotation) {
      state.renderer.showAnnotation({
        arrows: annotation.arrows || [],
        highlights: annotation.highlights || []
      });
      renderCommentSlot(slot, "keymoment", annotation.titulo, annotation.texto);
      return;
    }

    state.renderer.clearAnnotation();

    const momentoClave = state.momentoClave;
    if (momentoClave && annotations.length === 0 && state.ply === momentoClave.ply) {
      renderCommentSlot(slot, "keymoment", null, momentoClave.comentario);
      return;
    }

    renderCommentSlot(slot, "narrative", null, state.narracion);
  }

  function renderCommentSlot(slot, kind, titulo, texto) {
    if (kind === "keymoment") {
      slot.innerHTML = `
        <div class="game__key-moment game__key-moment--visible">
          <p class="game__key-moment-title">${escapeHtml(titulo || "")}</p>
          <p>${escapeHtml(texto || "")}</p>
        </div>`;
      return;
    }
    slot.innerHTML = texto ? `<p class="game__narrative">${escapeHtml(texto)}</p>` : "";
  }

  ["mejor-1", "mejor-2"].forEach(setupGameBoard);

  /* ============================================
     PARTIDAS MODELO: tabs por concepto + cards dinámicas
     Fuente de datos: window.PARTIDAS_MODELO (partidas.js)
     ============================================ */
  function escapeHtml(str) {
    return String(str ?? "").replace(/[&<>"']/g, (ch) => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]
    ));
  }

  function formatFechaEs(iso) {
    if (!iso) return "";
    const [y, m, d] = iso.split("-").map(Number);
    if (!y || !m || !d) return iso;
    const date = new Date(Date.UTC(y, m - 1, d));
    return date.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  }

  function createPartidaCard(partida) {
    const article = document.createElement("article");
    article.className = "game";
    article.dataset.pgn = partida.id;

    const colorLabel = partida.color_tincho === "negras" ? "Negras" : "Blancas";
    const metaParts = [`vs. ${partida.oponente || "Oponente"}`];
    if (partida.control) metaParts.push(partida.control);
    const fechaTxt = formatFechaEs(partida.fecha);
    if (fechaTxt) metaParts.push(fechaTxt);

    // El box de "momento clave" existe si hay momento_clave clásico y/o annotations por ply.
    const hasKeyBox = !!(partida.momento_clave || (Array.isArray(partida.annotations) && partida.annotations.length));

    const links = [];
    if (partida.link_chesscom) links.push(`<a href="${partida.link_chesscom}" target="_blank" rel="noopener">chess.com ↗</a>`);
    if (partida.link_lichess) links.push(`<a href="${partida.link_lichess}" target="_blank" rel="noopener">lichess ↗</a>`);

    article.innerHTML = `
      <div class="game__board" id="board-${partida.id}"></div>
      <div class="game__panel">
        <span class="game__tag">${escapeHtml(partida.concepto)} · ${colorLabel}</span>
        <h3 class="game__title">${escapeHtml(partida.titulo)}</h3>
        <p class="game__meta">${escapeHtml(metaParts.join(" · "))}</p>
        <div class="game__comment-slot" id="comment-${partida.id}"></div>
        <div class="game__controls">
          <button class="ctrl" data-action="start" data-target="${partida.id}" aria-label="Ir al inicio">⏮</button>
          <button class="ctrl" data-action="prev" data-target="${partida.id}" aria-label="Jugada anterior">◀</button>
          <button class="ctrl" data-action="next" data-target="${partida.id}" aria-label="Jugada siguiente">▶</button>
          <button class="ctrl" data-action="end" data-target="${partida.id}" aria-label="Ir al final">⏭</button>
        </div>
        ${hasKeyBox ? `
        <div class="game__keymoment-row">
          <button class="btn btn--ghost-sm game__keymoment-btn" data-target="${partida.id}">Ir al momento clave</button>
        </div>` : ""}
        <p class="game__move" id="move-${partida.id}">Posición inicial</p>
        <div class="game__legend" id="legend-${partida.id}"></div>
        <div class="game__links">${links.join("")}</div>
      </div>
    `;
    return article;
  }

  function setupPartidaBoard(partida) {
    const replay = new Chess();
    if (!replay.load_pgn(partida.pgn)) return;
    const history = replay.history({ verbose: true });

    const tmp = new Chess();
    const positions = [{ fen: tmp.fen(), from: null, to: null }];
    const sanMoves = [];
    history.forEach((mv) => {
      tmp.move(mv);
      positions.push({ fen: tmp.fen(), from: mv.from, to: mv.to });
      sanMoves.push(mv.san);
    });

    // El tablero se ve desde el ángulo de Tincho: su color siempre queda abajo.
    const flipped = partida.color_tincho === "negras";
    const renderer = new ChessRenderer(`board-${partida.id}`, { draggable: false, flipped });
    const annotations = Array.isArray(partida.annotations) ? partida.annotations : [];
    const momentoClave = partida.momento_clave || null;
    // El botón "Ir al momento clave" salta al momento_clave clásico o, si no hay,
    // a la primera annotation por convención.
    const keyMomentPly = momentoClave ? momentoClave.ply : (annotations[0] ? annotations[0].ply : undefined);
    boards[partida.id] = {
      renderer,
      positions,
      sanMoves,
      ply: 0,
      momentoClave,
      annotations,
      keyMomentPly,
      narracion: partida.narracion || ""
    };
    refreshGameBoard(partida.id);
  }

  function initPartidasModelo() {
    const tabsContainer = document.getElementById("concept-tabs");
    const gamesContainer = document.getElementById("games-container");
    if (!tabsContainer || !gamesContainer) return;

    const partidas = Array.isArray(window.PARTIDAS_MODELO) ? window.PARTIDAS_MODELO : [];
    if (partidas.length === 0) {
      tabsContainer.innerHTML = "";
      gamesContainer.innerHTML = `<p class="section__intro" style="margin:0;">Todavía no hay partidas cargadas.</p>`;
      return;
    }

    const conceptos = [];
    partidas.forEach((p) => {
      if (!conceptos.includes(p.concepto)) conceptos.push(p.concepto);
    });

    let currentIds = [];

    function renderConcepto(concepto) {
      currentIds.forEach((id) => delete boards[id]);
      currentIds = [];
      gamesContainer.innerHTML = "";
      partidas
        .filter((p) => p.concepto === concepto)
        .forEach((partida) => {
          gamesContainer.appendChild(createPartidaCard(partida));
          setupPartidaBoard(partida);
          currentIds.push(partida.id);
        });
    }

    tabsContainer.innerHTML = "";
    conceptos.forEach((concepto, idx) => {
      const tab = document.createElement("button");
      tab.type = "button";
      tab.className = "concept-tab" + (idx === 0 ? " concept-tab--active" : "");
      tab.textContent = concepto;
      tab.dataset.concepto = concepto;
      tab.addEventListener("click", () => {
        tabsContainer.querySelectorAll(".concept-tab").forEach((t) => t.classList.remove("concept-tab--active"));
        tab.classList.add("concept-tab--active");
        renderConcepto(concepto);
      });
      tabsContainer.appendChild(tab);
    });

    renderConcepto(conceptos[0]);
  }

  initPartidasModelo();

  document.addEventListener("click", (e) => {
    const ctrlBtn = e.target.closest(".ctrl[data-target]");
    if (ctrlBtn) {
      const id = ctrlBtn.dataset.target;
      const action = ctrlBtn.dataset.action;
      const state = boards[id];
      if (!state) return;
      if (action === "start") state.ply = 0;
      else if (action === "end") state.ply = state.positions.length - 1;
      else if (action === "prev" && state.ply > 0) state.ply--;
      else if (action === "next" && state.ply < state.positions.length - 1) state.ply++;
      refreshGameBoard(id);
      return;
    }

    const keyBtn = e.target.closest(".game__keymoment-btn[data-target]");
    if (keyBtn) {
      const id = keyBtn.dataset.target;
      const state = boards[id];
      if (!state || state.keyMomentPly === undefined) return;
      state.ply = state.keyMomentPly;
      refreshGameBoard(id);
    }
  });

  // =========================================================
  // HERRAMIENTA DE TABLERO (análisis libre)
  // =========================================================
  const analyzer = {
    game: new Chess(),
    renderer: null,
    history: [],
    ply: 0,
    initialFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",

    init() {
      this.renderer = new ChessRenderer("analysis-board", {
        draggable: true,
        canDragPiece: (piece) => {
          if (this.ply !== this.history.length) return false;
          if (this.game.game_over()) return false;
          return piece[0] === this.game.turn();
        },
        onMove: (from, to) => this.tryMove(from, to)
      });
      this.renderer.setLegalMovesProvider((sq) => {
        if (this.ply !== this.history.length) return [];
        const moves = this.game.moves({ square: sq, verbose: true });
        return moves.map((m) => m.to);
      });
      this.render();

      document.getElementById("an-prev").addEventListener("click", () => this.goto(this.ply - 1));
      document.getElementById("an-next").addEventListener("click", () => this.goto(this.ply + 1));
      document.getElementById("an-start").addEventListener("click", () => this.goto(0));
      document.getElementById("an-end").addEventListener("click", () => this.goto(this.history.length));
      document.getElementById("an-flip").addEventListener("click", () => {
        this.renderer.flip();
        this.render();
      });
      document.getElementById("an-reset").addEventListener("click", () => this.reset());
      document.getElementById("an-copy").addEventListener("click", () => this.copyPgn());
    },

    tryMove(from, to) {
      const move = this.game.move({ from, to, promotion: "q" });
      if (!move) return;
      this.history.push({
        fen: this.game.fen(),
        san: move.san,
        from: move.from,
        to: move.to
      });
      this.ply = this.history.length;
      this.render();
    },

    goto(ply) {
      if (ply < 0 || ply > this.history.length) return;
      this.ply = ply;
      const tempGame = new Chess();
      for (let i = 0; i < ply; i++) tempGame.move(this.history[i].san);
      this.game = tempGame;
      this.render();
    },

    reset() {
      this.game = new Chess();
      this.history = [];
      this.ply = 0;
      this.render();
    },

    render() {
      const fen = this.ply === 0 ? this.initialFen : this.history[this.ply - 1].fen;
      this.renderer.setPosition(fen);
      if (this.ply === 0) this.renderer.highlightLastMove(null, null);
      else {
        const h = this.history[this.ply - 1];
        this.renderer.highlightLastMove(h.from, h.to);
      }

      const status = document.getElementById("an-status");
      const turn = this.game.turn() === "w" ? "blancas" : "negras";
      let txt = `Turno: ${turn}`;
      status.classList.remove("analysis__status--check");
      if (this.game.in_checkmate()) {
        txt = `Jaque mate. Ganan las ${this.game.turn() === "w" ? "negras" : "blancas"}.`;
        status.classList.add("analysis__status--check");
      } else if (this.game.in_stalemate()) {
        txt = "Tablas por ahogado.";
      } else if (this.game.in_draw()) {
        txt = "Tablas.";
      } else if (this.game.in_check()) {
        txt = `Jaque. Mueven las ${turn}.`;
        status.classList.add("analysis__status--check");
      }
      status.textContent = txt;

      const notation = document.getElementById("an-notation");
      if (this.history.length === 0) {
        notation.innerHTML = `<p class="analysis__empty">Mové una pieza para empezar.</p>`;
      } else {
        let html = "";
        for (let i = 0; i < this.history.length; i += 2) {
          const moveNum = Math.floor(i / 2) + 1;
          const white = this.history[i];
          const black = this.history[i + 1];
          html += `<span class="move-pair">`;
          html += `<span class="move-num">${moveNum}.</span>`;
          html += `<span class="move ${this.ply === i + 1 ? "move--active" : ""}" data-ply="${i + 1}">${white.san}</span>`;
          if (black) {
            html += ` <span class="move ${this.ply === i + 2 ? "move--active" : ""}" data-ply="${i + 2}">${black.san}</span>`;
          }
          html += `</span> `;
        }
        notation.innerHTML = html;
        notation.querySelectorAll(".move").forEach((el) => {
          el.addEventListener("click", () => this.goto(parseInt(el.dataset.ply)));
        });
        if (this.ply === this.history.length) {
          notation.scrollTop = notation.scrollHeight;
        }
      }

      document.getElementById("an-fen").textContent =
        this.ply === 0 ? this.initialFen : this.history[this.ply - 1].fen;
    },

    async copyPgn() {
      const tempGame = new Chess();
      this.history.forEach((h) => tempGame.move(h.san));
      const pgn = tempGame.pgn() || "(sin jugadas todavía)";
      const btn = document.getElementById("an-copy");
      try {
        await navigator.clipboard.writeText(pgn);
        const original = btn.textContent;
        btn.textContent = "¡Copiado!";
        btn.classList.add("analysis__copy--ok");
        setTimeout(() => {
          btn.textContent = original;
          btn.classList.remove("analysis__copy--ok");
        }, 1500);
      } catch {
        alert("PGN:\n\n" + pgn);
      }
    }
  };

  if (document.getElementById("analysis-board")) analyzer.init();

  // Flechas: navegar tablero más visible
  document.addEventListener("keydown", (e) => {
    if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
    const tag = document.activeElement?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    if (document.activeElement?.classList.contains("cb__sq")) return;

    const candidates = [];
    Object.entries(boards).forEach(([id]) => {
      const el = document.getElementById(`board-${id}`);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const visibleArea = Math.max(0, Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 0));
      candidates.push({ kind: "game", id, visibleArea });
    });
    const anEl = document.getElementById("analysis-board");
    if (anEl) {
      const rect = anEl.getBoundingClientRect();
      const visibleArea = Math.max(0, Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 0));
      candidates.push({ kind: "analysis", visibleArea });
    }
    const visible = candidates.sort((a, b) => b.visibleArea - a.visibleArea)[0];
    if (!visible || visible.visibleArea < 100) return;

    e.preventDefault();
    if (visible.kind === "analysis") {
      if (e.key === "ArrowLeft") analyzer.goto(analyzer.ply - 1);
      else analyzer.goto(analyzer.ply + 1);
    } else {
      const action = e.key === "ArrowLeft" ? "prev" : "next";
      document.querySelector(`.ctrl[data-target="${visible.id}"][data-action="${action}"]`)?.click();
    }
  });

  // Form contacto
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = fd.get("name")?.toString().trim();
    const email = fd.get("email")?.toString().trim();
    const level = fd.get("level")?.toString();
    const message = fd.get("message")?.toString().trim();
    if (!name || !email || !level || !message) {
      status.textContent = "Faltan datos. Completá nombre, email, nivel y mensaje.";
      status.style.color = "#ff8a8a";
      return;
    }
    const contactLink = document.querySelector('.contact__channels a[href^="mailto:"]');
    const contactEmail = contactLink ? contactLink.getAttribute("href").replace("mailto:", "").split("?")[0] : "";
    const subject = encodeURIComponent(`Consulta de clases — ${name}`);
    const body = encodeURIComponent(
      `Nombre: ${name}\nEmail: ${email}\nNivel: ${level}\n\nMensaje:\n${message}`
    );
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
    status.textContent = "Abriendo tu cliente de mail...";
    status.style.color = "#9ad19a";
  });

  // Scroll suave
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      const navHeight = document.querySelector(".nav").offsetHeight;
      window.scrollTo({ top: target.offsetTop - navHeight, behavior: "smooth" });
    });
  });
});
