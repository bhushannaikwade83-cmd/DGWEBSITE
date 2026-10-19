# Digitrix Media website (React + Vite)

```bash
npm install        # first time only
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run preview    # test the production build
```

## Where things are
- `src/site.config.js`: **edit here**: email, phone, address, social links and all section text
- `src/components/Film.jsx`: the scroll film (canvas) + its captions
- `src/sections/Sections.jsx`, `Nav.jsx`, `Contact.jsx`, `Footer.jsx`: page parts
- `src/styles.css`: all styling (gold `#f7d251` on `#09090b`)
- `public/assets/`: logo files · `public/frames/`: scroll-film frames (generated)
- `clips/`: your 6 source videos (`ch1-ignite.mp4` … `ch6-finale.mp4`)
- `VIDEO_PROMPTS.md`: prompts for the videos
- `legacy/`: the earlier plain-HTML version (backup)

## Rebuild the film after changing a clip
```bash
./tools/build_frames.sh     # clips/ → public/frames/
```
(`tools/make_finale.py` builds the logo finale clip; run it with `.venv/bin/python`.)
