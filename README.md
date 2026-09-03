# Tinchograf — Cómo correr la página

## 🟢 Con servidor local (para desarrollo)

1. Abrí la terminal de VS Code (o PowerShell) en la carpeta del proyecto.

2. Levantá el servidor:
   ```
   python -m http.server 8000
   ```

3. En el navegador, abrí:
   **http://localhost:8000**

   ⚠️ NO abras `index.html` con doble click — siempre usá `localhost:8000`.

Para cerrar el servidor: `Ctrl + C` en la terminal.

---

## Estructura de archivos

```
tu-carpeta/
├── index.html
├── styles.css
├── script.js
├── chess.min.js    ← motor de ajedrez (local, no depende de internet)
└── README.md
```

`chess.min.js` está incluido en el repo. La página funciona sin internet
salvo por las fuentes de Google (Cormorant Garamond, Inter Tight), que
si no cargan, el navegador usa fuentes de fallback pero se ve casi igual.

---

## 🌐 Cuando publiques online

Cuando subas la página a un hosting (GitHub Pages, Netlify, Vercel, etc.),
funciona sin más — no hace falta configurar nada extra.

---

## Para verificar que todo funciona

Con el servidor andando, abriendo `http://localhost:8000`, en la pestaña
**Tablero** deberías:

- Ver el tablero con todas las piezas en posición inicial
- Arrastrar piezas para moverlas (validadas por las reglas)
- Ver puntos grises que marcan las jugadas legales al levantar una pieza
- Navegar el historial con ← → del teclado o los botones ⏮ ◀ ▶ ⏭
- Girar el tablero con ⇅
- Copiar el PGN de la línea con el botón "Copiar PGN"
