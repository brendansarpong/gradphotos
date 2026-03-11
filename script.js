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

// Fade-in thumbnails once loaded
thumbs.forEach(img => {
  if (img.complete) {
    img.classList.add("loaded");
  } else {
    img.addEventListener("load", () => img.classList.add("loaded"));
  }
});

// Dismiss loading title after fixed 2s only (no early dismiss on interaction)
let loadingDismissed = false;
let loadingTimeout = setTimeout(dismissLoading, 2000);

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

// Compressed images in images/jpegs (smaller size)/image compress/
const IMAGE_BASE = "images/jpegs (smaller size)/image compress/";

const galleries = {
  PLACES: [
    "places_cali_mountains_TN.jpg",
    "places_cali_betweentrees.jpg",
    "places_cali_mountainswithme.jpg",
    "places_cali_paintedladies.jpg",
    "places_cali_thethinker.jpg",
    "places_capitol.jpg",
    "places_mexicanspot.jpg",
    "places_amsterdamwater.jpg",
    "places_amsterdamauntie.jpg",
    "places_amsterdamtrainstop.jpg",
    "places_dczoo.jpg",
    "places_eiffeltower.jpg",
    "places_parisguy.jpg"
  ],
  STUDIO: [
    "studio_pyc_wk2 (hands)_TN.jpg",
    "studio_birthday.jpg",
    "studio_pyc_wk2 (ezinne).jpg",
    "studio_pyc_wk2.jpg",
    "studio_sayffoot.jpg",
    "studio_sayfsit.jpg"
  ],
  PEOPLE: [
    "people_caymanfriends_TN.jpg",
    "people_aashi.jpg",
    "people_aashistreet.jpg",
    "people_friendspoint.jpg",
    "people_lindacar.jpg",
    "people_me_faces.jpg",
    "people_peoplesjazznight_beyourself.jpg",
    "people_peoplesjazznight_keyanna.jpg",
    "people_joesclothesbros.jpg",
    "people_miaguitar.jpg",
    "people_oisin.jpg",
    "people_adpfriends.jpg",
    "people_miahutton.jpg",
    "people_lawrencecigarette.jpg"
  ],
  GRAD: [
    "grad_mia_TN.jpg",
    "grad_miapillar.jpg",
    "grad_miasubway.jpg",
    "grad_miasunlight.jpg",
    "grad_miaalma.jpg"
  ]
};

// Float thumbs opposite to cursor; different speeds per thumb for depth
const thumbSpeed = [1.25, 0.65, 1, 0.85]; // PLACES, STUDIO, PEOPLE, GRAD
const moveStrength = 44; // slightly faster movement

if (!isMobile) {
  document.addEventListener("mousemove", e => {
    const baseX = (e.clientX / window.innerWidth - 0.5) * -moveStrength;
    const baseY = (e.clientY / window.innerHeight - 0.5) * -moveStrength;

    thumbs.forEach((img, i) => {
      const s = thumbSpeed[i] ?? 1;
      img.style.transform =
        `translateX(${baseX * s}px) translateY(${baseY * s}px) translateZ(${30 + s * 15}px)`;
    });
  });
}

const GALLERY_SCROLL_TOP = () => gallery.offsetTop || window.innerHeight;

const mobileHint = document.querySelector(".collage-mobile-hint");

function enterCategory(category) {
  dismissLoading();
  if (mobileHint) mobileHint.classList.add("dismissed");

  currentCategory = category;
  title.classList.add("hidden");
  descriptionBox.innerText = descriptions[category];

  gallery.innerHTML = "";
  currentGalleryImages = [];

  const loader = document.createElement("div");
  loader.id = "galleryLoading";
  loader.textContent = "Loading photos…";
  gallery.appendChild(loader);

  let remaining = galleries[category].length;

  galleries[category].forEach((img, index) => {
    const image = document.createElement("img");
    image.src = `${IMAGE_BASE}${img}`;
    image.loading = "lazy";
    image.decoding = "async";
    image.classList.add("gallery-img");
    image.dataset.index = index;

    image.addEventListener("load", () => {
      image.classList.add("loaded");
      remaining -= 1;
      if (remaining <= 0 && loader.parentNode) {
        loader.parentNode.removeChild(loader);
      }
    });
    image.addEventListener("click", () => openLightbox(index));

    gallery.appendChild(image);
    currentGalleryImages.push(image.src);
  });

  document.body.classList.add("in-category");
  updateScrolledState();
  window.scrollTo({ top: GALLERY_SCROLL_TOP(), behavior: "smooth" });
}

thumbs.forEach(thumb => {
  thumb.addEventListener("click", () => enterCategory(thumb.dataset.category));
});

// Mobile-only: horizontal card carousel — swipe to change card, tap to open category
const mobileCarousel = document.getElementById("mobileCarousel");
const carouselTrack = document.getElementById("carouselTrack");
const carouselTitle = document.getElementById("carouselTitle");
const carouselDesc = document.getElementById("carouselDesc");
const carouselCaption = document.querySelector(".carousel-caption");

if (isMobile && mobileCarousel && carouselTrack && carouselTitle && carouselDesc) {
  mobileCarousel.setAttribute("aria-hidden", "false");

  const cards = carouselTrack.querySelectorAll(".carousel-card");
  let lastActiveIndex = 0;

  function updateCardTransforms() {
    if (!cards.length) return;
    const cardWidth = cards[0].offsetWidth || 1;
    const trackCenter = carouselTrack.scrollLeft + carouselTrack.clientWidth / 2;

    cards.forEach((card) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const raw = (trackCenter - cardCenter) / cardWidth; // +left, -right
      const t = Math.max(-1.2, Math.min(1.2, raw));
      const abs = Math.abs(t);

      // Center card is front/straight; neighbors peek underneath.
      const translateX = t * 34;
      const translateY = abs * 10;
      const rotateZ = t * 3.2;
      const scale = 1 - abs * 0.09;
      const opacity = 1 - Math.min(0.35, abs * 0.22);

      card.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) rotateZ(${rotateZ}deg) scale(${scale})`;
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

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const idx = Array.from(cards).indexOf(entry.target);
        if (idx === -1 || idx === lastActiveIndex) return;
        lastActiveIndex = idx;
        setCaption(idx);
      });
    },
    { root: carouselTrack, threshold: 0.5 }
  );
  cards.forEach((card) => observer.observe(card));
  setCaption(0);
  updateCardTransforms();

  let carouselRAF = null;
  carouselTrack.addEventListener(
    "scroll",
    () => {
      if (carouselRAF) cancelAnimationFrame(carouselRAF);
      carouselRAF = requestAnimationFrame(() => {
        updateCardTransforms();
        carouselRAF = null;
      });
    },
    { passive: true }
  );

  cards.forEach((card) => {
    card.addEventListener("click", () => enterCategory(card.dataset.category));
  });
}

function updateScrolledState() {
  const threshold = window.innerHeight * 0.4;
  const inCategory = document.body.classList.contains("in-category");
  const scrolledPast = window.scrollY > threshold;
  const shouldShowCategoryUI = inCategory && scrolledPast;

  document.body.classList.toggle("scrolled", shouldShowCategoryUI);

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
