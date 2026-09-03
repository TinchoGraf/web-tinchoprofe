/* ============================================
   TINCHOGRAF — Scripts
   Tablero propio (Unicode + divs) + chess.js
   ============================================ */

const PIECE_UNICODE = {
  wK: "♔", wQ: "♕", wR: "♖", wB: "♗", wN: "♘", wP: "♙",
  bK: "♚", bQ: "♛", bR: "♜", bB: "♝", bN: "♞", bP: "♟"
};
const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];

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
    this.flipped = false;
    this.draggable = options.draggable || false;
    this.onMove = options.onMove || null;
    this.canDragPiece = options.canDragPiece || null;
    this.legalMovesFor = null;
    this.squares = {};
    this.fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
    this.draggedFrom = null;
    this.selectedSquare = null;
    this.arrows = [];
    this.arrowDrawing = null;
    this.arrowLayer = null;
    this.arrowMarkerId = "cb-arrowhead-" + containerId;
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
    this.squares = {};

    for (let visualRow = 0; visualRow < 8; visualRow++) {
      for (let visualCol = 0; visualCol < 8; visualCol++) {
        const file = this.flipped ? FILES[7 - visualCol] : FILES[visualCol];
        const rank = this.flipped ? (visualRow + 1) : (8 - visualRow);
        const sqName = file + rank;

        const sq = document.createElement("div");
        const lightSquare = (visualRow + visualCol) % 2 === 0;
        sq.className = "cb__sq " + (lightSquare ? "cb__sq--light" : "cb__sq--dark");
        sq.dataset.square = sqName;

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
      }
    }
    this.container.appendChild(grid);
    this.setPosition(this.fen);
    if (this.draggable) {
      this.buildArrowLayer();
      this.renderArrows();
    }
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
    sq.addEventListener("click", () => {
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
    });
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
    svg.innerHTML = `<defs>
      <marker id="${this.arrowMarkerId}" markerWidth="2.6" markerHeight="2.6"
              refX="1.3" refY="1.3" orient="auto-start-reverse" markerUnits="strokeWidth">
        <path d="M0,0 L2.6,1.3 L0,2.6 Z" fill="rgba(21, 120, 27, 0.85)" />
      </marker>
    </defs>`;
    this.container.appendChild(svg);
    this.arrowLayer = svg;
  }

  squareCenter(sqName) {
    const fileIdx = FILES.indexOf(sqName[0]);
    const rank = parseInt(sqName.slice(1), 10);
    if (fileIdx < 0 || !rank) return null;
    const visualCol = this.flipped ? 7 - fileIdx : fileIdx;
    const visualRow = this.flipped ? rank - 1 : 8 - rank;
    return { x: visualCol + 0.5, y: visualRow + 0.5 };
  }

  toggleArrow(from, to) {
    const idx = this.arrows.findIndex((a) => a.from === from && a.to === to);
    if (idx >= 0) this.arrows.splice(idx, 1);
    else this.arrows.push({ from, to });
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
    this.arrows.forEach(({ from, to }) => {
      const a = this.squareCenter(from);
      const b = this.squareCenter(to);
      if (!a || !b) return;
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
      line.setAttribute("marker-end", `url(#${this.arrowMarkerId})`);
      this.arrowLayer.appendChild(line);
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
    Object.values(this.squares).forEach((sq) => {
      sq.querySelectorAll(".cb__piece").forEach((p) => p.remove());
    });
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = matrix[r][c];
        if (!piece) continue;
        const sqName = FILES[c] + (8 - r);
        const target = this.squares[sqName];
        if (!target) continue;
        const pieceEl = document.createElement("span");
        pieceEl.className = "cb__piece cb__piece--" + piece[0];
        pieceEl.dataset.piece = piece;
        pieceEl.textContent = PIECE_UNICODE[piece];
        if (this.draggable) pieceEl.draggable = true;
        target.appendChild(pieceEl);
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
  toggle?.addEventListener("click", () => links.classList.toggle("nav__links--open"));
  links?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => links.classList.remove("nav__links--open"));
  });

  if (!ensureChessLoaded()) return;

  // PGNs de ejemplo (reemplazar por partidas reales)
  const PGNS = {
    "ejemplo-1": `[Event "Ejemplo 1"]
[White "Tinchograf"]
[Black "Oponente"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Nb8 10. d4 Nbd7 *`,
    "ejemplo-2": `[Event "Ejemplo 2"]
[White "Tinchograf"]
[Black "Oponente"]

1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. Nf3 O-O 6. Be2 e5 7. O-O Nc6 8. d5 Ne7 9. Ne1 Nd7 10. Nd3 f5 *`,
    "mejor-1": `[Event "Mejor 1"]
[White "Tinchograf"]
[Black "Oponente"]

1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3 e5 7. Nb3 Be6 8. f3 Be7 9. Qd2 O-O 10. O-O-O Nbd7 *`,
    "mejor-2": `[Event "Mejor 2"]
[White "Oponente"]
[Black "Tinchograf"]

1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 a6 5. Bd3 Nf6 6. O-O Qc7 7. Qe2 d6 8. c4 g6 9. Nc3 Bg7 10. Rd1 O-O *`
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

  function refreshGameBoard(id) {
    const state = boards[id];
    if (!state) return;
    const pos = state.positions[state.ply];
    state.renderer.setPosition(pos.fen);
    state.renderer.highlightLastMove(pos.from, pos.to);

    const label = document.getElementById(`move-${id}`);
    if (!label) return;
    if (state.ply === 0) {
      label.textContent = "Posición inicial";
    } else {
      const moveNum = Math.ceil(state.ply / 2);
      const san = state.sanMoves[state.ply - 1];
      const isWhite = state.ply % 2 === 1;
      label.textContent = `${moveNum}${isWhite ? "." : "..."} ${san}`;
    }
  }

  ["ejemplo-1", "ejemplo-2", "mejor-1", "mejor-2"].forEach(setupGameBoard);

  document.querySelectorAll(".ctrl[data-target]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.target;
      const action = btn.dataset.action;
      const state = boards[id];
      if (!state) return;
      if (action === "start") state.ply = 0;
      else if (action === "end") state.ply = state.positions.length - 1;
      else if (action === "prev" && state.ply > 0) state.ply--;
      else if (action === "next" && state.ply < state.positions.length - 1) state.ply++;
      refreshGameBoard(id);
    });
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
    if (!name || !email || !message) {
      status.textContent = "Faltan datos. Completá nombre, email y mensaje.";
      status.style.color = "#ff8a8a";
      return;
    }
    const subject = encodeURIComponent(`Consulta de clases — ${name}`);
    const body = encodeURIComponent(
      `Nombre: ${name}\nEmail: ${email}\nNivel: ${level}\n\nMensaje:\n${message}`
    );
    window.location.href = `mailto:[email protected]?subject=${subject}&body=${body}`;
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
