(() => {
  const dialog = document.querySelector("#clip-dialog");
  const articles = [...dialog.querySelectorAll("article")];
  const openClip = (id) => {
    let shown = false;
    for (const article of articles) {
      const match = article.id === id;
      article.hidden = !match;
      if (match) shown = true;
    }
    if (!shown || typeof dialog.showModal !== "function") return;
    if (!dialog.open) dialog.showModal();
  };
  document.querySelectorAll(".tile").forEach((tile) => {
    tile.addEventListener("click", () => openClip(tile.dataset.clip));
  });
  dialog.querySelector("[data-close]").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
})();
