const thumbs = document.querySelectorAll(".thumb");
const gallery = document.getElementById("gallery");
const title = document.getElementById("mainTitle");
const descriptionBox = document.getElementById("descriptionBox");
const loadingTitle = document.getElementById("loadingTitle");
const brandText = document.getElementById("brandText");
const categoryLabel = document.getElementById("categoryLabel");
const backToTopBtn = document.getElementById("backToTopBtn");
const isMobile = window.matchMedia("(max-width: 768px)").matches;
let currentCategory = null;
let currentGalleryImages = [];
let currentImageIndex = 0;
let mobileTitleTimeout = null;

document.querySelector(".header .logo").addEventListener("click", (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
  categoryLabel.classList.remove("visible");
  document.body.classList.remove("in-category", "scrolled");
  currentCategory = null;
});

title.classList.add("hidden");

thumbs.forEach(img => {
  if (img.complete) {
    img.classList.add("loaded");
  } else {
    img.addEventListener("load", () => img.classList.add("loaded"));
  }
});

let loadingDismissed = false;
const LOADING_DISMISS_MS = isMobile ? 2500 : 2000;
let loadingTimeout = setTimeout(dismissLoading, LOADING_DISMISS_MS);

function dismissLoading() {
  if (loadingDismissed) return;
  loadingDismissed = true;
  clearTimeout(loadingTimeout);
  loadingTitle.classList.add("dismissed");
  brandText.classList.add("visible");
}

thumbs.forEach(thumb => {
  thumb.addEventListener("mouseenter", () => {
    title.innerText = thumb.dataset.category;
    title.classList.remove("hidden");
  });
  thumb.addEventListener("mouseleave", () => {
    setTimeout(() => {
      const overThumb = document.querySelector(".thumb:hover");
      if (!overThumb) title.classList.add("hidden");
    }, 50);
  });
});

const descriptions = {
  PLACES: "Places I've been.",
  STUDIO: "Studio pictures.",
  PEOPLE: "Portraits of people I know.",
  GRAD: "Graduation photos of my friend Mia."
};

const IMAGE_BASE = "images/jpegs (smaller size)/image compress/";
const GRAD_IMAGE_BASE = "images/";

const galleries = {
  PLACES: [
    "places_cali_mountains_TN.jpg",
    "places_cali_betweentrees.jpg",
    "places_amsterdamwater.jpg",
    "places_cali_mountainswithme.jpg",
    "places_cali_paintedladies.jpg",
    "places_cali_thethinker.jpg",
    "places_capitol.jpg",
    "places_amsterdamauntie.jpg",
    "places_amsterdamtrainstop.jpg",
    "places_dczoo.jpg",
    "places_eiffeltower.jpg",
    "places_parisguy.jpg",
    "images/places_colombiaredeemer.JPEG"
  ],
  STUDIO: [
    "studio_pyc_wk2 (hands)_TN.jpg",
    "studio_sayffoot.jpg",
    "studio_pyc_wk2 (ezinne).jpg",
    "studio_pyc_wk2.jpg",
    "studio_sayfsit.jpg",
    "people_me_faces.jpg",
    "studio_birthday.jpg"
  ],
  PEOPLE: [
    "people_caymanfriends_TN.jpg",
    "people_miaguitar.jpg",
    "people_lindacar.jpg",
    "people_aashi.jpg",
    "people_aashistreet.jpg",
    "people_friendspoint.jpg",
    "people_peoplesjazznight_beyourself.jpg",
    "people_peoplesjazznight_keyanna.jpg",
    "people_joesclothesbros.jpg",
    "people_oisin.jpg",
    "people_adpfriends.jpg",
    "people_miahutton.jpg",
    "people_lawrencecigarette.jpg",
    "images/people_colombiafamily.JPEG",
    "images/people_nickcolombiawalk.JPEG",
    "images/people_girlsundernumber.JPEG",
    "images/people_mialookback.JPEG"
  ],
  GRAD: [
    "grad_mia_TN.jpg",
    "grad_miaalma.jpg",
    "grad_miapillar.jpg",
    "grad_miasubway-2.jpg"
  ]
};

const thumbSpeed = [1.25, 0.65, 1, 0.85]; // PLACES, STUDIO, PEOPLE, GRAD
const moveStrength = 44;
let thumbTargetX = 0;
let thumbTargetY = 0;
let thumbCurrentX = 0;
let thumbCurrentY = 0;

if (!isMobile) {
  document.addEventListener("mousemove", e => {
    thumbTargetX = (e.clientX / window.innerWidth - 0.5) * -moveStrength;
    thumbTargetY = (e.clientY / window.innerHeight - 0.5) * -moveStrength;
  });

  function animateThumbs() {
    const lerp = 0.14;
    thumbCurrentX += (thumbTargetX - thumbCurrentX) * lerp;
    thumbCurrentY += (thumbTargetY - thumbCurrentY) * lerp;

    thumbs.forEach((img, i) => {
      const s = thumbSpeed[i] ?? 1;
      img.style.transform =
        `translateX(${thumbCurrentX * s}px) translateY(${thumbCurrentY * s}px)`;
    });

    requestAnimationFrame(animateThumbs);
  }

  requestAnimationFrame(animateThumbs);
}

const GALLERY_SCROLL_TOP = () => gallery.offsetTop || window.innerHeight;

function enterCategory(category) {
  dismissLoading();

  currentCategory = category;
  title.classList.add("hidden");
  descriptionBox.innerText = descriptions[category];

  gallery.classList.remove("gallery-enter");
  gallery.innerHTML = "";
  currentGalleryImages = [];

  const base = category === "GRAD" ? GRAD_IMAGE_BASE : IMAGE_BASE;
  galleries[category].forEach((img, index) => {
    const item = document.createElement("div");
    item.className = "gallery-item";

    const placeholder = document.createElement("div");
    placeholder.className = "gallery-img-placeholder";
    placeholder.setAttribute("aria-hidden", "true");
    const placeholderText = document.createElement("span");
    placeholderText.className = "gallery-img-placeholder-text";
    placeholderText.textContent = "Loading photos…";
    placeholder.appendChild(placeholderText);

    const image = document.createElement("img");
    image.src = img.includes("/") ? img : `${base}${img}`;
    image.loading = "lazy";
    image.decoding = "async";
    image.classList.add("gallery-img");
    image.dataset.index = index;

    const markLoaded = () => {
      image.classList.add("loaded");
      item.classList.add("gallery-item--loaded");
    };

    image.addEventListener("load", markLoaded);
    image.addEventListener("error", markLoaded);
    image.addEventListener("click", () => openLightbox(index));

    item.appendChild(placeholder);
    item.appendChild(image);
    gallery.appendChild(item);
    currentGalleryImages.push(image.src);

    if (image.complete) {
      markLoaded();
    }
  });

  document.body.classList.add("in-category");
  updateScrolledState();
  window.scrollTo({ top: GALLERY_SCROLL_TOP(), behavior: "smooth" });

  const mobileGallery = window.matchMedia("(max-width: 768px)").matches;
  if (mobileGallery) {
    gallery.classList.remove("gallery-enter");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        gallery.classList.add("gallery-enter");
      });
    });
    const onGalleryAnimEnd = (e) => {
      if (e.target !== gallery || e.animationName !== "galleryEnterMobile") return;
      gallery.classList.remove("gallery-enter");
    };
    gallery.addEventListener("animationend", onGalleryAnimEnd, { once: true });
  }
}

thumbs.forEach(thumb => {
  thumb.addEventListener("click", () => enterCategory(thumb.dataset.category));
});

const mobileCarousel = document.getElementById("mobileCarousel");
const carouselTrack = document.getElementById("carouselTrack");
const carouselTitle = document.getElementById("carouselTitle");
const carouselDesc = document.getElementById("carouselDesc");
const carouselCaption = document.querySelector(".carousel-caption");
const carouselDots = document.getElementById("carouselDots");

if (isMobile && mobileCarousel && carouselTrack && carouselTitle && carouselDesc) {
  mobileCarousel.setAttribute("aria-hidden", "false");

  const baseCards = [
    {
      category: "GRAD",
      src: "images/grad_mia_TN.jpg",
      alt: "Grad",
    },
    {
      category: "PEOPLE",
      src: "images/jpegs (smaller size)/image compress/people_caymanfriends_TN.jpg",
      alt: "People",
    },
    {
      category: "STUDIO",
      src: "images/jpegs (smaller size)/image compress/studio_pyc_wk2 (hands)_TN.jpg",
      alt: "Studio",
    },
    {
      category: "PLACES",
      src: "images/jpegs (smaller size)/image compress/places_cali_mountains_TN.jpg",
      alt: "Places",
    },
  ];

  const LOOPS_EACH_SIDE = 4;
  const LOOPS_TOTAL = LOOPS_EACH_SIDE * 2 + 1;

  carouselTrack.innerHTML = "";
  let introCardIndex = 0;
  for (let loop = 0; loop < LOOPS_TOTAL; loop += 1) {
    baseCards.forEach((cfg) => {
      const article = document.createElement("article");
      article.className = "carousel-card";
      article.dataset.category = cfg.category;

      const wrap = document.createElement("div");
      wrap.className = "carousel-card-img-wrap";
      wrap.style.setProperty("--intro-delay", `${(introCardIndex % 4) * 42}ms`);

      const img = document.createElement("img");
      img.src = cfg.src;
      img.alt = cfg.alt;
      img.decoding = "async";

      wrap.appendChild(img);
      article.appendChild(wrap);
      carouselTrack.appendChild(article);
      introCardIndex += 1;
    });
  }

  const cards = carouselTrack.querySelectorAll(".carousel-card");
  let lastActiveIndex = 0;
  const START_INDEX = LOOPS_EACH_SIDE * baseCards.length; // middle loop, GRAD
  const SWIPE_DISTANCE_THRESHOLD = 44;
  const SNAP_ANIM_MS = 195;
  let isAnimatingScroll = false;
  let scrollAnimRAF = null;
  let isDraggingCarousel = false;
  let gestureAnchorIndex = START_INDEX;
  const baseLen = baseCards.length;
  const dotButtons = carouselDots
    ? Array.from(carouselDots.querySelectorAll(".carousel-dot"))
    : [];

  function getBaseIndexFromIndex(loopedIndex) {
    if (!baseLen) return 0;
    return ((loopedIndex % baseLen) + baseLen) % baseLen;
  }

  function setDots(loopedIndex) {
    if (!dotButtons.length) return;
    const baseIndex = getBaseIndexFromIndex(loopedIndex);
    dotButtons.forEach((btn, i) => {
      if (i === baseIndex) {
        btn.setAttribute("aria-current", "true");
      } else {
        btn.removeAttribute("aria-current");
      }
    });
  }

  function scrollToIndex(index, behavior = "smooth") {
    const card = cards[index];
    if (!card) return;
    const prev = carouselTrack.style.scrollBehavior;
    const centeredLeft = card.offsetLeft - (carouselTrack.clientWidth - card.offsetWidth) / 2;
    carouselTrack.style.scrollBehavior = behavior === "smooth" ? "smooth" : "auto";
    carouselTrack.scrollLeft = centeredLeft;
    carouselTrack.style.scrollBehavior = prev || "";
  }

  function cancelScrollAnimation() {
    if (scrollAnimRAF) {
      cancelAnimationFrame(scrollAnimRAF);
      scrollAnimRAF = null;
    }
    isAnimatingScroll = false;
  }

  function animateToIndex(index, duration = SNAP_ANIM_MS) {
    const card = cards[index];
    if (!card) return;
    cancelScrollAnimation();

    const start = carouselTrack.scrollLeft;
    const end = card.offsetLeft - (carouselTrack.clientWidth - card.offsetWidth) / 2;
    const delta = end - start;

    if (Math.abs(delta) < 0.5 || duration <= 0) {
      carouselTrack.scrollLeft = end;
      lastActiveIndex = index;
      setCaption(index);
      setDots(index);
      updateCardTransforms();
      return;
    }

    isAnimatingScroll = true;
    const startTime = performance.now();
    // Fast start, soft landing — stronger ease-out than cubic, still no overshoot.
    const easeOutQuint = (t) => 1 - Math.pow(1 - t, 5);

    function tick(now) {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      carouselTrack.scrollLeft = start + delta * easeOutQuint(t);
      updateCardTransforms();
      if (t < 1) {
        scrollAnimRAF = requestAnimationFrame(tick);
        return;
      }
      scrollAnimRAF = null;
      isAnimatingScroll = false;
      lastActiveIndex = index;
      setCaption(index);
      setDots(index);
    }

    scrollAnimRAF = requestAnimationFrame(tick);
  }

  function updateCardTransforms() {
    if (!cards.length) return;
    const cardWidth = cards[START_INDEX].offsetWidth || 1;
    const trackCenter = carouselTrack.scrollLeft + carouselTrack.clientWidth / 2;

    cards.forEach((card) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const raw = (trackCenter - cardCenter) / cardWidth;
      const t = Math.max(-1.2, Math.min(1.2, raw));
      const abs = Math.abs(t);

      const translateY = abs * 6;
      const scale = 1 - abs * 0.07;
      const opacity = 1 - Math.min(0.32, abs * 0.2);

      card.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
      card.style.opacity = `${opacity}`;
      card.style.zIndex = `${100 - Math.round(abs * 20)}`;
    });
  }

  function setCaption(index) {
    const card = cards[index];
    if (!card) return;
    const cat = card.dataset.category;
    carouselTitle.textContent = cat;
    carouselDesc.textContent = descriptions[cat] || "";
    if (carouselCaption) {
      carouselCaption.classList.remove("animate");
      void carouselCaption.offsetWidth;
      carouselCaption.classList.add("animate");
      setTimeout(() => carouselCaption.classList.remove("animate"), 420);
    }
  }

  function initCarouselPosition() {
    scrollToIndex(START_INDEX, "auto");
    lastActiveIndex = START_INDEX;
    updateCardTransforms();
    setCaption(START_INDEX);
    setDots(START_INDEX);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => requestAnimationFrame(initCarouselPosition));
  } else {
    requestAnimationFrame(initCarouselPosition);
  }

  function getNearestIndex() {
    const midpoint = carouselTrack.scrollLeft + carouselTrack.clientWidth / 2;
    let nearestIndex = lastActiveIndex;
    let nearestDistance = Infinity;
    cards.forEach((card, index) => {
      const center = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(center - midpoint);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });
    return nearestIndex;
  }

  updateCardTransforms();
  carouselTrack.style.scrollBehavior = "auto";
  carouselTrack.style.scrollSnapType = "none";
  carouselTrack.style.touchAction = "pan-y";

  let carouselRAF = null;
  carouselTrack.addEventListener(
    "scroll",
    () => {
      if (carouselRAF) cancelAnimationFrame(carouselRAF);
      carouselRAF = requestAnimationFrame(() => {
        updateCardTransforms();
        if (!isDraggingCarousel && !isAnimatingScroll) {
          const nearest = getNearestIndex();
          if (nearest !== lastActiveIndex) {
            lastActiveIndex = nearest;
            setCaption(nearest);
            setDots(nearest);
          }
        }
        carouselRAF = null;
      });
    },
    { passive: true }
  );

  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartScrollLeft = 0;
  let lastTouchX = 0;
  let isHorizontalSwipe = null;
  let moved = false;

  carouselTrack.addEventListener(
    "touchstart",
    (e) => {
      if (!e.touches.length) return;
      cancelScrollAnimation();
      isDraggingCarousel = true;
      gestureAnchorIndex = getNearestIndex();
      lastActiveIndex = gestureAnchorIndex;
      setDots(gestureAnchorIndex);
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchStartScrollLeft = carouselTrack.scrollLeft;
      lastTouchX = touch.clientX;
      isHorizontalSwipe = null;
      moved = false;
    },
    { passive: true }
  );

  carouselTrack.addEventListener(
    "touchmove",
    (e) => {
      if (!e.touches.length) return;
      const touch = e.touches[0];
      const dx = touch.clientX - touchStartX;
      const dy = touch.clientY - touchStartY;

      if (isHorizontalSwipe === null) {
        const absX = Math.abs(dx);
        const absY = Math.abs(dy);
        if (absX > 6 || absY > 6) {
          isHorizontalSwipe = absX > absY;
        }
      }

      if (!isHorizontalSwipe) return;
      e.preventDefault();
      moved = true;
      carouselTrack.scrollLeft = touchStartScrollLeft - dx;
      lastTouchX = touch.clientX;
    },
    { passive: false }
  );

  function finishCarouselGesture() {
    isDraggingCarousel = false;
  }

  carouselTrack.addEventListener(
    "touchend",
    () => {
      if (!moved || !isHorizontalSwipe) {
        finishCarouselGesture();
        return;
      }
      const totalDx = lastTouchX - touchStartX;
      const absDx = Math.abs(totalDx);
      let targetIndex = gestureAnchorIndex;
      if (absDx >= SWIPE_DISTANCE_THRESHOLD) {
        targetIndex = totalDx < 0 ? gestureAnchorIndex + 1 : gestureAnchorIndex - 1;
      }
      targetIndex = Math.max(0, Math.min(cards.length - 1, targetIndex));
      animateToIndex(targetIndex);
      finishCarouselGesture();
    },
    { passive: true }
  );

  carouselTrack.addEventListener(
    "touchcancel",
    () => {
      cancelScrollAnimation();
      scrollToIndex(gestureAnchorIndex, "auto");
      updateCardTransforms();
      lastActiveIndex = gestureAnchorIndex;
      setCaption(gestureAnchorIndex);
      finishCarouselGesture();
      isHorizontalSwipe = null;
      moved = false;
    },
    { passive: true }
  );

  window.addEventListener(
    "resize",
    () => {
      requestAnimationFrame(() => {
        cancelScrollAnimation();
        scrollToIndex(lastActiveIndex, "auto");
        updateCardTransforms();
      });
    },
    { passive: true }
  );

  cards.forEach((card) => {
    // If the user taps while the carousel is still settling, stop the settle immediately
    // so the tap feels responsive instead of "blocked" by the animation.
    card.addEventListener(
      "touchstart",
      () => {
        if (isAnimatingScroll) cancelScrollAnimation();
      },
      { passive: true }
    );
    card.addEventListener("click", () => {
      cancelScrollAnimation();
      enterCategory(card.dataset.category);
    });
  });
}

function updateScrolledState() {
  const threshold = window.innerHeight * 0.4;
  const inCategory = document.body.classList.contains("in-category");
  const scrolledPast = window.scrollY > threshold;
  const shouldShowCategoryUI = inCategory && scrolledPast;

  document.body.classList.toggle("scrolled", shouldShowCategoryUI);

  if (!shouldShowCategoryUI && descriptionBox) {
    descriptionBox.innerText = "";
  }

  if (categoryLabel) {
    if (shouldShowCategoryUI && currentCategory) {
      categoryLabel.textContent = currentCategory;
      categoryLabel.classList.add("visible");
    } else {
      categoryLabel.classList.remove("visible");
    }
  }
}

window.addEventListener("scroll", () => {
  const inCategory = document.body.classList.contains("in-category");
  if (inCategory && window.scrollY <= 0) {
    document.body.classList.remove("in-category", "scrolled");
    currentCategory = null;
    if (categoryLabel) categoryLabel.classList.remove("visible");
    if (descriptionBox) descriptionBox.innerText = "";
  }
  updateScrolledState();
}, { passive: true });
updateScrolledState();

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const closeLightbox = document.getElementById("closeLightbox");

const prevLightbox = document.getElementById("prevLightbox");
const nextLightbox = document.getElementById("nextLightbox");

function applyLightboxImage() {
  if (!currentGalleryImages.length) return;
  lightboxImg.classList.remove("rotate-cw");
  lightboxImg.src = currentGalleryImages[currentImageIndex];
}

function closeLightboxView() {
  lightbox.style.display = "none";
  document.removeEventListener("keydown", lightboxKeydown);
}

function updateLightboxArrows() {
  const n = currentGalleryImages.length;
  prevLightbox.style.visibility = n > 1 && currentImageIndex > 0 ? "visible" : "hidden";
  nextLightbox.style.visibility = n > 1 && currentImageIndex < n - 1 ? "visible" : "hidden";
}

function openLightbox(index) {
  if (!currentGalleryImages.length) return;
  currentImageIndex = index;
  lightbox.style.display = "flex";
  applyLightboxImage();
  updateLightboxArrows();
  document.addEventListener("keydown", lightboxKeydown);
}

function lightboxKeydown(e) {
  if (e.key === "Escape") {
    closeLightboxView();
    return;
  }
  if (e.key === "ArrowLeft") {
    if (currentImageIndex > 0) {
      currentImageIndex--;
      applyLightboxImage();
      updateLightboxArrows();
    }
    return;
  }
  if (e.key === "ArrowRight") {
    if (currentImageIndex < currentGalleryImages.length - 1) {
      currentImageIndex++;
      applyLightboxImage();
      updateLightboxArrows();
    }
  }
}

closeLightbox.addEventListener("click", closeLightboxView);

function showPrevImage() {
  if (!currentGalleryImages.length) return;
  currentImageIndex = Math.max(0, currentImageIndex - 1);
  applyLightboxImage();
  updateLightboxArrows();
}

function showNextImage() {
  if (!currentGalleryImages.length) return;
  currentImageIndex = Math.min(currentGalleryImages.length - 1, currentImageIndex + 1);
  applyLightboxImage();
  updateLightboxArrows();
}

prevLightbox.addEventListener("click", showPrevImage);
nextLightbox.addEventListener("click", showNextImage);

if (backToTopBtn) {
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
