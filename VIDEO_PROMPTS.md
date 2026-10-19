# Digitrix Media: video prompts (6 clips)

Make each clip in your video tool (Kling / Runway / Veo / Luma / etc.), then save them as MP4 in `clips/` with EXACTLY these names:

| File | Chapter |
|---|---|
| ch1-ignite.mp4   | Golden core ignites |
| ch2-assemble.mp4 | Core becomes the Digitrix gold "U" |
| ch3-web.mp4      | Websites |
| ch4-ai.mp4       | AI models |
| ch5-apps.mp4     | Apps |
| ch6-finale.mp4   | Logo finale |

Then run `./tools/build_frames.sh`. It joins the clips, cuts the scroll frames, and the captions time themselves automatically.

## Settings for ALL clips
- 16:9, 1080p, 5 to 10 seconds, **locked static camera** (no pan/zoom, except ch6)
- Pure near-black background (#09090b), polished liquid-gold look matching the logo
- Use the SAME gold in every clip: warm yellow gold (#f7d251), glossy metal, soft golden glow
- Use the logo (`assets/logo-official.jpg`) as the start image for ch2 and ch6 if your tool supports image-to-video

## Negative prompt (paste into every clip)
```
camera movement, camera zoom, camera pan, people, hands, text, letters, watermark, extra logos, blue, purple, red, white background, blur, flicker, morphing, background change
```

## ch1-ignite (5-10s, text-to-video)
```
Pitch black empty studio void. A small point of golden light appears in the center, grows and ignites into a glowing polished liquid-gold sphere floating in the middle of the frame, soft golden rim light, tiny golden particles drift around it, slow motion, cinematic, photorealistic 8k, locked static camera, dark background unchanged
```

## ch2-assemble (10s, image-to-video from ch1's last frame, or text-to-video)
```
The glowing golden sphere stretches and flows, golden particles and liquid-gold ribbons swirl in from all around and assemble into a large glossy gold letter "U" shape, thick polished gold bars with a curved bottom, smooth reflective metal, soft golden glow, by the final frame the gold U is fully formed and perfectly centered, slow motion, locked static camera, pure black background
```
Tip: if the assembly looks weak, generate the U *breaking apart* into particles and reverse the clip. Add `"reverse": true` for ch2 in `tools/build_frames.sh`.

## ch3-web (5-10s)
```
Floating glass website browser windows with thin glowing gold outlines unfold from the center in a layered fan, minimal gold wireframe layouts of web pages with headings, image blocks and buttons light up one by one, polished gold and dark glass, soft golden glow, slow motion, elegant, locked static camera, pure black background
```

## ch4-ai (5-10s)
```
A glowing golden neural network of connected nodes and thin light lines floats in black space, golden pulses of light travel along the connections and the network brightens and grows more complex, a luminous golden core at its center, particles drifting, slow motion, cinematic, locked static camera, pure black background
```

## ch5-apps (5-10s)
```
A sleek black smartphone with thin gold metal edges rises slowly into frame and hovers upright in the center, its screen lights up with a minimal gold-on-black app interface, small golden glowing app icons float outward from the screen and orbit, slow motion, photorealistic, locked static camera, pure black background
```

## ch6-finale (5-10s, image-to-video using the LOGO as start image)
```
The glossy gold "U" Digitrix Media logo glows on a pure black background, a soft golden light sweep glides across the polished gold surface, faint golden particles float upward, the glow slowly blooms warmer and richer, very slow gentle push-in, logo shape and text stay exactly unchanged
```
(this is the only clip where a gentle camera push-in is allowed)

## Notes
- AI video models garble small text, so keep the lettering out of clips 1-5. The real logo is shown by the website itself (nav, footer, loader).
- Different clip lengths are fine. The scroll length follows the total film.
- You can regenerate any single clip and re-run the script.
