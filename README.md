# Tinchograf — Cómo correr la página

## 🟢 Con servidor local (recomendado para desarrollo)

1. Abrí PowerShell (o la terminal de VS Code) en la carpeta del proyecto:
   ```
   cd "C:\Users\Martin\Downloads\proyecto pagina web tinchoprofe"
   ```

2. Levantá el servidor:
   ```
   python -m http.server 8000
   ```

3. En el navegador, abrí:
   **http://localhost:8000**

   ⚠️ NO abras `index.html` con doble click — siempre usá `localhost:8000`.

Para cerrar el servidor: `Ctrl + C` en la terminal.

---

## 🌐 Cuando publiques online

Cuando subas la página a un hosting (GitHub Pages, Netlify, Vercel, etc.),
funciona sin más: el CDN de chess.js va a cargar bien porque ya no estás
en `file://`.

---

## Estructura de archivos

```
tu-carpeta/
├── index.html
├── styles.css
└── script.js
```

`chess.js` (el motor de ajedrez) se carga desde un CDN público
(jsdelivr), no hace falta tenerlo localmente.

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
