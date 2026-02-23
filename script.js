const thumbs = document.querySelectorAll(".thumb");
const gallery = document.getElementById("gallery");
const title = document.getElementById("mainTitle");
const descriptionBox = document.getElementById("descriptionBox");

document.querySelector(".header .logo").addEventListener("click", (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

title.classList.add("hidden");

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
    "places_mexicanspot.JPG"
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
    "people_peoplesjazznight_keyanna.JPG"
  ],
  GRAD: []
};

// Float thumbs opposite to cursor direction (positions set in CSS)
document.addEventListener("mousemove", e => {
  const x = (e.clientX / window.innerWidth - 0.5) * -20;
  const y = (e.clientY / window.innerHeight - 0.5) * -20;

  thumbs.forEach(img => {
    img.style.transform =
      `translateX(${x}px) translateY(${y}px) translateZ(40px)`;
  });
});

document.addEventListener("touchmove", e => {
  const touch = e.touches[0];
  const x = (touch.clientX / window.innerWidth - 0.5) * -20;
  const y = (touch.clientY / window.innerHeight - 0.5) * -20;

  thumbs.forEach(img => {
    img.style.transform =
      `translateX(${x}px) translateY(${y}px) translateZ(40px)`;
  });
});

thumbs.forEach(thumb => {
  thumb.addEventListener("click", () => {

    const category = thumb.dataset.category;

    title.innerText = category;
    title.classList.remove("hidden");
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