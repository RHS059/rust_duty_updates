(() => {
  const AELLA = `<svg class="glyph glyph-aella" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 6.2 26.4 25.8c.7 1.3-.2 2.9-1.7 2.9H7.3c-1.5 0-2.4-1.6-1.7-2.9Z"/></svg>`;
  const THUMB_UP = `<svg class="glyph glyph-thumb" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M23 10c0-1.11-.9-2-2-2h-6.32l.96-4.57c.02-.1.03-.21.03-.32 0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.58C7.22 7.95 7 8.45 7 9v10a2 2 0 0 0 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73V10zM1 21h4V9H1v12z"/></svg>`;
  const THUMB_DOWN = `<svg class="glyph glyph-thumb" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M23 14c0 1.11-.9 2-2 2h-6.32l.96 4.57c.02.1.03.21.03.32 0 .41-.17.79-.44 1.06L14.17 23 7.59 16.42C7.22 16.05 7 15.55 7 15V5a2 2 0 0 1 2-2h9c.83 0 1.54.5 1.84 1.22l3.02 7.05c.09.23.14.47.14.73V14zM1 3h4v12H1V3z"/></svg>`;
  const CLOCK = `<svg class="glyph glyph-clock" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7.2" fill="none" stroke="#f8f8f2" stroke-width="2.1"/><path d="M12 7.4V12.2l3.1 2" fill="none" stroke="#f8f8f2" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  const makerName = { aella: "Aella", halcyon: "Halcyon", elara: "Elara" };

  const markHtml = (clip) => {
    if (clip.review === "reviewing") {
      return `<span class="mark mark-review" role="img" aria-label="Elara is reviewing">${CLOCK}</span>`;
    }
    if (clip.review === "pass") {
      return `<span class="mark mark-pass" role="img" aria-label="Pass">${THUMB_UP}</span>`;
    }
    if (clip.review === "fail") {
      const score = clip.score == null ? "Fail" : `Fail, score ${clip.score}`;
      return `<span class="mark mark-fail" role="img" aria-label="${score}">${THUMB_DOWN}</span>`;
    }
    if (clip.maker === "halcyon") {
      return `<span class="mark mark-halcyon" role="img" aria-label="Halcyon"></span>`;
    }
    if (clip.maker === "elara") {
      return `<span class="mark mark-elara" role="img" aria-label="Elara"></span>`;
    }
    return `<span class="mark mark-aella" role="img" aria-label="Aella">${AELLA}</span>`;
  };

  const grid = document.querySelector("#media-grid");
  const note = document.querySelector("#media-note");
  const agents = document.querySelector("#agent-list");
  const dialog = document.querySelector("#clip-dialog");
  const sheet = document.querySelector("#sheet-body");

  const openClip = (id) => {
    const article = sheet.querySelector(`#${CSS.escape(id)}`);
    if (!article || typeof dialog.showModal !== "function") return;
    for (const node of sheet.querySelectorAll("article")) node.hidden = node !== article;
    if (!dialog.open) dialog.showModal();
  };

  const render = (data) => {
    const clips = (data.clips || []).filter((clip) => data.showWithoutVideo !== false || clip.video);
    const ready = clips.filter((clip) => clip.video).length;
    note.textContent = ready ? `${ready} of ${clips.length} clips have a video.` : "No videos yet. The colored tiles are placeholders until a file is set in previews.json.";
    grid.replaceChildren();
    for (const clip of clips) {
      const button = document.createElement("button");
      button.className = "tile";
      button.type = "button";
      button.dataset.clip = clip.id;
      button.setAttribute("aria-label", clip.title);
      const art = clip.video
        ? `<video class="tile-video" src="${clip.video}" muted loop playsinline autoplay preload="metadata"></video>`
        : `<span class="tile-art" aria-hidden="true"><span class="pane pane-reference">Reference</span><span class="pane pane-current">Current render</span></span>`;
      button.innerHTML = `${art}<span class="tile-title"></span>${markHtml(clip)}`;
      button.querySelector(".tile-title").textContent = clip.title;
      button.addEventListener("click", () => openClip(clip.id));
      grid.append(button);

      const article = document.createElement("article");
      article.id = clip.id;
      article.hidden = true;
      const h = document.createElement("h2");
      h.textContent = clip.title;
      if (clip.video) {
        const video = document.createElement("video");
        video.className = "sheet-video";
        video.src = clip.video;
        video.controls = true;
        video.loop = true;
        video.playsInline = true;
        article.append(video);
      }
      article.append(h);
      sheet.append(article);
    }

    const counts = { aella: [], halcyon: [], elara: [] };
    for (const clip of clips) {
      if (counts[clip.maker]) counts[clip.maker].push(clip.title);
    }
    const rows = [
      ["aella", "mark mark-aella", AELLA, "Orange rounded triangle.", counts.aella],
      ["halcyon", "mark mark-halcyon", "", "Blue circle.", counts.halcyon],
      ["elara", "mark mark-review", CLOCK, "Grey square. A white clock means she is reviewing. A white thumbs up is pass. A red thumbs down is fail.", []]
    ];
    agents.replaceChildren();
    for (const [name, klass, glyph, blurb, titles] of rows) {
      const li = document.createElement("li");
      li.innerHTML = `<span class="${klass}" aria-hidden="true">${glyph}</span><div><strong></strong><p class="blurb"></p><p class="made"></p></div>`;
      li.querySelector("strong").textContent = makerName[name];
      li.querySelector(".blurb").textContent = blurb;
      li.querySelector(".made").textContent = titles.length ? `On this grid: ${titles.join(", ")}.` : "Reviewer. She does not make the clips.";
      agents.append(li);
    }
  };

  dialog.querySelector("[data-close]").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  fetch("previews.json")
    .then((response) => {
      if (!response.ok) throw new Error(String(response.status));
      return response.json();
    })
    .then(render)
    .catch(() => {
      note.textContent = "Could not load previews.json.";
    });
})();
