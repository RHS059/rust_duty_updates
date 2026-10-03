# rust_duty_updates

Preview grid for Rust Duty review clips. Open the GitHub Pages site at https://rhs059.github.io/rust_duty_updates/

Clip titles, makers, review state, scores, and video paths live in previews.json. The page reads that file. Leave video null until a file exists.

Put each video in the media folder and set video to a same-site path such as media/hip-walk-forward.mp4. GitHub Pages will serve it next to the page. Do not use Git LFS. Pages serves the pointer file, not the video.

Keep each file under 25 MB. GitHub rejects files over 100 MB. If revisions get large, move the files to a public bucket and change only the video URLs in previews.json.
