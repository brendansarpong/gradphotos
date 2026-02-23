const thumbs = document.querySelectorAll(".thumb");
const gallery = document.getElementById("gallery");
const title = document.getElementById("mainTitle");
const descriptionBox = document.getElementById("descriptionBox");

const descriptions = {
  PLACES: "Places I've photographed while traveling.",
  STUDIO: "Studio portraits and creative lighting work.",
  PEOPLE: "Candid portraits of people.",
  EVENTS: "Live events and moments.",
  GRAD: "Some sample shots of my friend Alex.",
  FILM: "Film photography experiments."
};

const galleries = {
  PLACES: ["1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg"],
  STUDIO: ["1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg"],
  PEOPLE: ["1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg"],
  EVENTS: ["1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg"],
  GRAD: ["1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg"],
  FILM: ["1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg"]
};

thumbs.forEach(img => {
  const x = Math.random() * 75;
  const y = Math.random() * 70;
  const rotate = Math.random() * 10 - 5;

  img.style.left = x + "%";
  img.style.top = y + "%";
  img.dataset.rotate = rotate;
  img.style.transform = `rotate(${rotate}deg) translateZ(0px)`;
});

document.addEventListener("mousemove", e => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;

  thumbs.forEach(img => {
    const r = img.dataset.rotate;
    img.style.transform =
      `rotate(${r}deg) translateX(${x}px) translateY(${y}px) translateZ(40px)`;
  });
});

document.addEventListener("touchmove", e => {
  const touch = e.touches[0];
  const x = (touch.clientX / window.innerWidth - 0.5) * 20;
  const y = (touch.clientY / window.innerHeight - 0.5) * 20;

  thumbs.forEach(img => {
    const r = img.dataset.rotate;
    img.style.transform =
      `rotate(${r}deg) translateX(${x}px) translateY(${y}px) translateZ(40px)`;
  });
});

thumbs.forEach(thumb => {
  thumb.addEventListener("click", () => {

    const category = thumb.dataset.category;

    title.innerText = category;
    descriptionBox.innerText = descriptions[category];

    gallery.innerHTML = "";

    galleries[category].forEach(img => {
      const image = document.createElement("img");
      image.src = `images/${category.toLowerCase()}/${img}`;
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

window.addEventListener("scroll", () => {
  document.querySelectorAll(".gallery-img").forEach(img => {
    const speed = 0.15;
    const offset = window.scrollY * speed;
    img.style.transform = `translateY(${offset}px)`;
  });
});

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