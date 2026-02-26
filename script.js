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
  PEOPLE: "Portraits of  I know.",
  GRAD: "Graduation photos of my friend Mia."
};

// Filenames in /images/; _TN files are category thumbnails, not in gallery grid
const galleries = {
  PLACES: [
    "places_cali_betweentrees.jpg",
    "places_cali_mountainswithme.jpg",
    "places_cali_paintedladies.jpg",
    "places_cali_thethinker.jpg",
    "places_capitol.jpg",
    "places_mexicanspot.JPG",
    "places_amsterdamwater.JPG",
    "places_amsterdamauntie.JPG",
    "places_amsterdamtrainstop.JPG",
    "places_dczoo.jpeg",
    "places_eiffeltower.JPG",
    "places_parisguy.JPG"
  ],
  STUDIO: [
    "studio_birthday.JPG",
    "studio_pyc_wk2 (ezinne).JPG",
    "studio_pyc_wk2.JPG"
  ],
  PEOPLE: [
    "people_aashi.JPG",
    "people_aashistreet.JPG",
    "people_friendspoint.jpg",
    "people_lindacar.jpg",
    "people_me_faces.JPG",
    "people_peoplesjazznight_beyourself.JPG",
    "people_peoplesjazznight_keyanna.JPG",
    "people_joesclothesbros.JPG",
    "people_miaguitar.jpeg",
    "people_oisin.jpeg",
    "people_adpfriends.jpeg",
    "people_miahutton.jpeg",
    "people_lawrencecigarette.jpeg"
  ],
  GRAD: [
    "grad_miapillar.png",
    "grad_miasubway.png",
    "grad_miasunlight.png",
    "grad_miaalma.png"
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

thumbs.forEach(thumb => {
  thumb.addEventListener("click", () => {
    dismissLoading();

    const category = thumb.dataset.category;
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
      image.src = `images/${img}`;
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
    // Smooth scroll so thumbnails and gallery slide up together
    window.scrollTo({ top: GALLERY_SCROLL_TOP(), behavior: "smooth" });
  });
});

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
