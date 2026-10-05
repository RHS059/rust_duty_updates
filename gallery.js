(() => {
  const AELLA = `<svg class="glyph glyph-aella" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 6.2 26.4 25.8c.7 1.3-.2 2.9-1.7 2.9H7.3c-1.5 0-2.4-1.6-1.7-2.9Z"/></svg>`;
  const THUMB_UP = `<svg class="glyph glyph-thumb" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M23 10c0-1.11-.9-2-2-2h-6.32l.96-4.57c.02-.1.03-.21.03-.32 0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.58C7.22 7.95 7 8.45 7 9v10a2 2 0 0 0 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73V10zM1 21h4V9H1v12z"/></svg>`;
  const THUMB_DOWN = `<svg class="glyph glyph-thumb" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M23 14c0 1.11-.9 2-2 2h-6.32l.96 4.57c.02.1.03.21.03.32 0 .41-.17.79-.44 1.06L14.17 23 7.59 16.42C7.22 16.05 7 15.55 7 15V5a2 2 0 0 1 2-2h9c.83 0 1.54.5 1.84 1.22l3.02 7.05c.09.23.14.47.14.73V14zM1 3h4v12H1V3z"/></svg>`;
  const CLOCK = `<svg class="glyph glyph-clock" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7.2" fill="none" stroke="#f8f8f2" stroke-width="2.1"/><path d="M12 7.4V12.2l3.1 2" fill="none" stroke="#f8f8f2" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  const makerName = { aella: "Aella", halcyon: "Halcyon", elara: "Elara" };
  const BATCH = 6;

  // Last git author time of each video file. previews.json has no timestamps.
  // Newer time ranks first. Equal times keep previews.json order.
  // A video missing from this map uses a YYYY-MM-DD in its filename at local midnight, else stays after dated clips in file order.
  const MEDIA_COMMIT_TIME = {
    "media/2026-10-03-reload_current_wip-eevee-studio-reference.mp4": "2026-10-03T12:06:16-05:00",
    "media/hip-forward-r5.mp4": "2026-10-03T13:45:17-05:00",
    "media/hip-backward-r5.mp4": "2026-10-03T13:48:03-05:00",
    "media/hip-left-r5.mp4": "2026-10-03T13:50:29-05:00",
    "media/hip-right-r5.mp4": "2026-10-03T13:52:16-05:00",
    "media/jump_animation.mp4": "2026-10-03T19:43:44-05:00",
    "media/2026-10-03-ads-v4-hip_walk_forward_r1-eevee-reference-126f.mp4": "2026-10-03T12:06:16-05:00",
    "media/2026-10-03-ads-v4-hip_walk_backward_r1-eevee-reference-162f.mp4": "2026-10-03T12:06:16-05:00",
    "media/2026-10-03-ads-v4-hip_strafe_left_r1-eevee-reference-114f.mp4": "2026-10-03T12:06:16-05:00",
    "media/2026-10-03-ads-v4-hip_strafe_right_r1-eevee-reference-84f.mp4": "2026-10-03T12:06:16-05:00",
    "media/2026-10-03-ads-v5-trial1-hip_walk_forward_r1-eevee-reference-126f.mp4": "2026-10-03T12:06:16-05:00",
    "media/2026-10-03-ads-v6-trial1-hip_walk_forward_r1-eevee-reference-126f.mp4": "2026-10-03T12:28:09-05:00",
    "media/2026-10-03-ads-v7-articulation15-forward-public47-r1-eevee-reference-126f.mp4": "2026-10-03T14:45:02-05:00",
    "media/2026-10-03-ads-v8-articulation15-forward-public47-r5-eevee-reference-126f.mp4": "2026-10-03T15:31:43-05:00",
    "media/2026-10-03-ads-lateral-trial1-public47-left-eevee-proxy-114f.mp4": "2026-10-03T13:20:41-05:00",
    "media/2026-10-03-ads-lateral-trial1-public47-right-eevee-proxy-84f.mp4": "2026-10-03T13:22:19-05:00",
    "media/2026-10-03-ads-lateral-trial2-public47-left-eevee-proxy-114f.mp4": "2026-10-03T15:04:58-05:00",
    "media/2026-10-03-ads-lateral-trial2-public47-right-eevee-proxy-84f.mp4": "2026-10-03T15:04:58-05:00",
    "media/2026-10-03-ads-lateral-trial3-public47-left-eevee-proxy-114f.mp4": "2026-10-03T15:44:49-05:00",
    "media/2026-10-03-ads-lateral-trial3-public47-right-eevee-proxy-84f.mp4": "2026-10-03T15:44:49-05:00",
    "media/2026-10-03-pickup_pose_inspection-eevee-studio-reference.mp4": "2026-10-03T12:06:16-05:00"
  };

  const commitMillis = (clip) => {
    if (!clip.video) return null;
    const known = MEDIA_COMMIT_TIME[clip.video];
    if (known) return Date.parse(known);
    const dated = String(clip.video).match(/(\d{4}-\d{2}-\d{2})/);
    if (dated) return Date.parse(`${dated[1]}T00:00:00-05:00`);
    return null;
  };

  const sortClips = (clips) => clips
    .map((clip, index) => ({ clip, index }))
    .sort((a, b) => {
      const ta = commitMillis(a.clip);
      const tb = commitMillis(b.clip);
      const aMissing = ta == null;
      const bMissing = tb == null;
      if (aMissing !== bMissing) return aMissing ? 1 : -1;
      if (ta != null && ta !== tb) return tb - ta;
      return a.index - b.index;
    })
    .map((row) => row.clip);

  const takeBatch = (clips, shown) => clips.slice(shown, shown + BATCH);

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

  if (typeof document === "undefined") {
    globalThis.__galleryTest = { sortClips, takeBatch, BATCH, commitMillis };
    return;
  }

  const grid = document.querySelector("#media-grid");
  const note = document.querySelector("#media-note");
  const sentinel = document.querySelector("#grid-sentinel");
  const trendHost = document.querySelector("#score-trend");
  const trendColors = [
    "var(--pink)",
    "var(--purple)",
    "var(--green)",
    "var(--yellow)",
    "var(--fg)",
    "var(--red)",
    "var(--orange)",
    "var(--comment)"
  ];

  const svgEl = (name, attrs) => {
    const el = document.createElementNS("http://www.w3.org/2000/svg", name);
    for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, String(value));
    return el;
  };

  const priorHipScores = {
    "HIP walk forward": [64, 74, 78, 79],
    "HIP walk backward": [41, 68, 76, 78],
    "HIP strafe left": [58, 54, 79, 78],
    "HIP strafe right": [46, 72, 77, 78],
    "Jump": [74]
  };

  const scoredSeries = (clips) => {
    const order = [];
    const groups = new Map();
    for (const clip of clips) {
      if (typeof clip.score !== "number" || !clip.motion) continue;
      if (!groups.has(clip.motion)) {
        groups.set(clip.motion, []);
        order.push(clip.motion);
      }
      groups.get(clip.motion).push(clip.score);
    }
    return order.map((name, index) => {
      const scores = groups.get(name).slice();
      const prior = priorHipScores[name];
      if (prior && !prior.every((score, i) => scores[i] === score)) {
        const merged = prior.slice();
        for (const score of scores) {
          if (merged[merged.length - 1] !== score) merged.push(score);
        }
        scores.splice(0, scores.length, ...merged);
      }
      return {
        name,
        scores,
        color: trendColors[index % trendColors.length]
      };
    });
  };

  const renderTrend = (clips) => {
    if (!trendHost) return;
    const series = scoredSeries(clips);
    trendHost.replaceChildren();
    if (!series.length) {
      trendHost.hidden = true;
      return;
    }
    trendHost.hidden = false;

    const width = 640;
    const height = 228;
    const pad = { l: 36, r: 12, t: 14, b: 28 };
    const plotW = width - pad.l - pad.r;
    const plotH = height - pad.t - pad.b;
    const yMax = 100;
    const maxN = Math.max(...series.map((item) => item.scores.length));
    const xOf = (index) => maxN <= 1 ? pad.l + plotW / 2 : pad.l + (index / (maxN - 1)) * plotW;
    const yOf = (score) => pad.t + (1 - score / yMax) * plotH;

    const svg = svgEl("svg", {
      viewBox: `0 0 ${width} ${height}`,
      role: "img",
      "aria-label": series.map((item) => `${item.name}: ${item.scores.join(", ")}`).join(". ")
    });

    for (const tick of [0, 20, 40, 60, 80, 100]) {
      const y = yOf(tick);
      const gridLine = svgEl("line", {
        x1: pad.l,
        x2: width - pad.r,
        y1: y,
        y2: y,
        stroke: tick === 80 ? "var(--comment)" : "var(--current)",
        "stroke-width": tick === 80 ? 1.25 : 1,
        "stroke-dasharray": tick === 80 ? "4 4" : "0"
      });
      svg.append(gridLine);
      const label = svgEl("text", {
        x: pad.l - 8,
        y: y + 4,
        fill: "var(--comment)",
        "font-size": 11,
        "text-anchor": "end"
      });
      label.textContent = String(tick);
      svg.append(label);
    }

    for (let index = 0; index < maxN; index += 1) {
      const label = svgEl("text", {
        x: xOf(index),
        y: height - 8,
        fill: "var(--comment)",
        "font-size": 11,
        "text-anchor": "middle"
      });
      label.textContent = String(index + 1);
      svg.append(label);
    }

    for (const item of series) {
      if (item.scores.length < 2) continue;
      const points = item.scores.map((score, index) => `${xOf(index)},${yOf(score)}`).join(" ");
      svg.append(svgEl("polyline", {
        points,
        fill: "none",
        stroke: item.color,
        "stroke-width": 2,
        "stroke-linejoin": "round",
        "stroke-linecap": "round"
      }));
    }

    for (const item of series) {
      item.scores.forEach((score, index) => {
        const dot = svgEl("circle", {
          cx: xOf(index),
          cy: yOf(score),
          r: 4,
          fill: item.color,
          stroke: "var(--bg)",
          "stroke-width": 1.5
        });
        const tip = svgEl("title", {});
        tip.textContent = `${item.name} ${score}`;
        dot.append(tip);
        svg.append(dot);
      });
    }

    const plot = document.createElement("div");
    plot.className = "trend-plot";
    plot.append(svg);
    trendHost.append(plot);

    const legend = document.createElement("ul");
    legend.className = "trend-legend";
    for (const item of series) {
      const li = document.createElement("li");
      const swatch = document.createElement("span");
      swatch.className = "trend-swatch";
      swatch.style.background = item.color;
      swatch.setAttribute("aria-hidden", "true");
      const name = document.createElement("span");
      name.textContent = item.name;
      li.append(swatch, name);
      legend.append(li);
    }
    trendHost.append(legend);
  };

  const agents = document.querySelector("#agent-list");
  const dialog = document.querySelector("#clip-dialog");
  const sheet = document.querySelector("#sheet-body");

  const buildArticle = (clip) => {
    const article = document.createElement("article");
    article.id = clip.id;
    article.hidden = true;
    if (clip.video) {
      const video = document.createElement("video");
      video.className = "sheet-video";
      video.src = clip.video;
      video.controls = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = "none";
      article.append(video);
    }
    const h = document.createElement("h2");
    h.textContent = clip.title;
    article.append(h);
    return article;
  };

  const openClip = (clip) => {
    if (!clip || typeof dialog.showModal !== "function") return;
    let article = sheet.querySelector(`#${CSS.escape(clip.id)}`);
    if (!article) {
      article = buildArticle(clip);
      sheet.append(article);
    }
    for (const node of sheet.querySelectorAll("article")) node.hidden = node !== article;
    const video = article.querySelector("video");
    if (video) video.preload = "metadata";
    if (!dialog.open) dialog.showModal();
  };

  const renderTile = (clip) => {
    const button = document.createElement("button");
    button.className = "tile";
    button.type = "button";
    button.dataset.clip = clip.id;
    button.setAttribute("aria-label", clip.title);
    const art = clip.video
      ? `<video class="tile-video" src="${clip.video}" muted loop playsinline preload="metadata"></video>`
      : `<span class="tile-art" aria-hidden="true"><span class="pane pane-reference">Reference</span><span class="pane pane-current">Current render</span></span>`;
    button.innerHTML = `${art}<span class="tile-title"></span>${markHtml(clip)}`;
    button.querySelector(".tile-title").textContent = clip.title;
    const tileVideo = button.querySelector("video");
    if (tileVideo) {
      tileVideo.muted = true;
      const reset = () => {
        try {
          tileVideo.currentTime = 0;
        } catch (error) {
          /* metadata may not be ready yet */
        }
      };
      button.addEventListener("pointerenter", () => {
        reset();
        const pending = tileVideo.play();
        if (pending && typeof pending.catch === "function") pending.catch(() => {});
      });
      button.addEventListener("pointerleave", () => {
        tileVideo.pause();
        reset();
      });
    }
    button.addEventListener("click", () => openClip(clip));
    grid.append(button);
  };

  const renderAgents = () => {
    const rows = [
      ["aella", "mark mark-aella", AELLA],
      ["halcyon", "mark mark-halcyon", ""],
      ["elara", "mark mark-elara", ""]
    ];
    agents.replaceChildren();
    for (const [name, klass, glyph] of rows) {
      const li = document.createElement("li");
      li.innerHTML = `<span class="${klass}" aria-hidden="true">${glyph}</span><strong></strong>`;
      li.querySelector("strong").textContent = makerName[name];
      agents.append(li);
    }
  };

  const render = (data) => {
    const source = data.clips || [];
    renderTrend(source);
    const ordered = sortClips(source.filter((clip) => data.showWithoutVideo !== false || clip.video));
    if (!ordered.length) {
      note.hidden = false;
      note.textContent = "No videos yet.";
    } else {
      note.hidden = true;
      note.textContent = "";
    }
    grid.replaceChildren();
    sheet.replaceChildren();
    let shown = 0;
    const appendBatch = () => {
      const next = takeBatch(ordered, shown);
      for (const clip of next) renderTile(clip);
      shown += next.length;
    };
    appendBatch();
    if (ordered.length > shown && typeof IntersectionObserver === "function") {
      let observer = null;
      const pump = () => {
        if (shown >= ordered.length) {
          if (observer) observer.disconnect();
          return;
        }
        appendBatch();
        if (shown >= ordered.length) {
          if (observer) observer.disconnect();
          return;
        }
        requestAnimationFrame(() => {
          const rect = sentinel.getBoundingClientRect();
          if (rect.top <= window.innerHeight + 240) pump();
        });
      };
      observer = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        pump();
      }, { rootMargin: "240px 0px" });
      observer.observe(sentinel);
    } else {
      while (shown < ordered.length) appendBatch();
    }
    renderAgents();
  };

  dialog.querySelector("[data-close]").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => {
    for (const video of sheet.querySelectorAll("video")) video.pause();
  });

  fetch("previews.json")
    .then((response) => {
      if (!response.ok) throw new Error(String(response.status));
      return response.json();
    })
    .then(render)
    .catch(() => {
      note.hidden = false;
      note.textContent = "Could not load previews. Refresh the page.";
    });
})();
