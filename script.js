const thumbs = document.querySelectorAll(".thumb");
const gallery = document.getElementById("gallery");
const title = document.getElementById("mainTitle");
const descriptionBox = document.getElementById("descriptionBox");
const loadingTitle = document.getElementById("loadingTitle");
const brandText = document.getElementById("brandText");
const categoryLabel = document.getElementById("categoryLabel");

document.querySelector(".header .logo").addEventListener("click", (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
  categoryLabel.classList.remove("visible");
});

title.classList.add("hidden");

// Dismiss loading title after 2s or first thumb interaction (whichever first)
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
    dismissLoading();
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
  PLACES: "Places I've photographed while traveling.",
  STUDIO: "Studio portraits and creative lighting work.",
  PEOPLE: "Candid portraits of people.",
  GRAD: "Graduation photos — coming soon."
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
  GRAD: []
};

// Float thumbs opposite to cursor; different speeds per thumb for depth (stronger effect)
const thumbSpeed = [1.25, 0.65, 1, 0.85]; // PLACES, STUDIO, PEOPLE, GRAD
const moveStrength = 36; // more pronounced movement (was 20)

document.addEventListener("mousemove", e => {
  const baseX = (e.clientX / window.innerWidth - 0.5) * -moveStrength;
  const baseY = (e.clientY / window.innerHeight - 0.5) * -moveStrength;

  thumbs.forEach((img, i) => {
    const s = thumbSpeed[i] ?? 1;
    img.style.transform =
      `translateX(${baseX * s}px) translateY(${baseY * s}px) translateZ(${30 + s * 15}px)`;
  });
});

document.addEventListener("touchmove", e => {
  const touch = e.touches[0];
  const baseX = (touch.clientX / window.innerWidth - 0.5) * -moveStrength;
  const baseY = (touch.clientY / window.innerHeight - 0.5) * -moveStrength;

  thumbs.forEach((img, i) => {
    const s = thumbSpeed[i] ?? 1;
    img.style.transform =
      `translateX(${baseX * s}px) translateY(${baseY * s}px) translateZ(${30 + s * 15}px)`;
  });
});

thumbs.forEach(thumb => {
  thumb.addEventListener("click", () => {
    dismissLoading();

    const category = thumb.dataset.category;

    title.classList.add("hidden");
    categoryLabel.textContent = category;
    categoryLabel.classList.add("visible");
    descriptionBox.innerText = descriptions[category];

    gallery.innerHTML = "";

    galleries[category].forEach(img => {
      const image = document.createElement("img");
      image.src = `images/${img}`;
      image.classList.add("gallery-img");

      image.addEventListener("click", () => openLightbox(image.src));

      gallery.appendChild(image);
    });

    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth"
    });

  });
});

function updateScrolledState() {
  const threshold = window.innerHeight * 0.4;
  document.body.classList.toggle("scrolled", window.scrollY > threshold);
}

window.addEventListener("scroll", () => {
  document.querySelectorAll(".gallery-img").forEach(img => {
    const speed = 0.15;
    const offset = window.scrollY * speed;
    img.style.transform = `translateY(${offset}px)`;
  });
  updateScrolledState();
}, { passive: true });
updateScrolledState();

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const closeLightbox = document.getElementById("closeLightbox");

function openLightbox(src) {
  lightbox.style.display = "flex";
  lightboxImg.src = src;
}

closeLightbox.addEventListener("click", () => {
  lightbox.style.display = "none";
});