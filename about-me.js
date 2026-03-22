document.addEventListener("DOMContentLoaded", () => {
  const introDetails = document.querySelector(".projects-intro-details");
  const mqWide = window.matchMedia("(min-width: 769px)");

  function syncIntroOpen() {
    if (!introDetails) return;
    introDetails.open = mqWide.matches;
  }
  syncIntroOpen();
  if (typeof mqWide.addEventListener === "function") {
    mqWide.addEventListener("change", syncIntroOpen);
  } else {
    mqWide.addListener(syncIntroOpen);
  }

  const lightbox = document.getElementById("paintingLightbox");
  const lightboxImg = document.querySelector("#paintingLightbox .painting-lightbox-img");
  const closeBtn = document.querySelector("#paintingLightbox .painting-lightbox-close");
  const prevBtn = document.querySelector("#paintingLightbox .painting-lightbox-prev");
  const nextBtn = document.querySelector("#paintingLightbox .painting-lightbox-next");
  const thumbs = document.querySelectorAll(".painting-thumb[data-full-src]");

  if (!lightbox || !lightboxImg || !thumbs.length) return;

  const sources = Array.from(thumbs).map((t) => ({
    src: t.dataset.fullSrc,
    alt: t.dataset.alt || t.alt || "",
  }));

  let index = 0;

  function updateArrows() {
    const n = sources.length;
    if (prevBtn) prevBtn.hidden = n <= 1;
    if (nextBtn) nextBtn.hidden = n <= 1;
  }

  function showAt(i) {
    index = ((i % sources.length) + sources.length) % sources.length;
    const { src, alt } = sources[index];
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    updateArrows();
  }

  function openLightbox(i) {
    showAt(i);
    lightbox.hidden = false;
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeydown);
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.removeAttribute("src");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKeydown);
  }

  function onKeydown(e) {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showAt(index - 1);
    if (e.key === "ArrowRight") showAt(index + 1);
  }

  thumbs.forEach((btn, i) => {
    btn.addEventListener("click", () => openLightbox(i));
  });

  closeBtn?.addEventListener("click", closeLightbox);
  prevBtn?.addEventListener("click", () => showAt(index - 1));
  nextBtn?.addEventListener("click", () => showAt(index + 1));

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
});
