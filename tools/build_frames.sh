#!/bin/bash
# Usage: ./tools/build_frames.sh   (run from the digitrix/ folder, after putting 6 clips in clips/)
cd "$(dirname "$0")/.." || exit 1
python3 tools/build_master.py "$(cat <<JSON
{
  "clips_dir": "$PWD/clips",
  "frames_dir": "$PWD/public/frames",
  "master": "$PWD/assets/master.mp4",
  "fps": 12, "width": 1400, "xfade": 0.4,
  "chapters": [
    {"name": "ignite",   "file": "ch1-ignite.mp4"},
    {"name": "assemble", "file": "ch2-assemble.mp4"},
    {"name": "web",      "file": "ch3-web.mp4"},
    {"name": "ai",       "file": "ch4-ai.mp4"},
    {"name": "apps",     "file": "ch5-apps.mp4"},
    {"name": "finale",   "file": "ch6-finale.mp4"}
  ]
}
JSON
)"
