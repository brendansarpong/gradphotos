# Brendan's Photos

Static portfolio site for Brendan's photography. Hosted at [sarpongphotos.com](https://sarpongphotos.com).

## `index.html` — the main page

This is the homepage. It shows four photo categories and is where visitors browse the work.

**Categories:** Places, Studio, People, Grad. Each one has a thumbnail on the landing view and a full gallery behind it.

**Desktop:** Four thumbnails sit in a collage. They drift slightly with the cursor. Hover a thumb to see its category name; click to load that gallery below. A short intro message ("Head to contact page to book") shows on load, then fades out.

**Mobile:** The collage is replaced by a swipeable carousel. Tap a card to open its gallery. Dots at the bottom show which category you're on.

**Gallery:** Clicking a category scrolls down and fills `#gallery` with that category's photos (defined in `script.js`). Tap any image to open the lightbox for prev/next browsing.

**Other bits on the page:**
- `#descriptionBox` — one-line blurb for the active category
- `#backToTopBtn` — jumps back to the category picker
- Header links out to Pricing, Contact, and About Me

## Other files

| File | What it does |
|------|--------------|
| `script.js` | Gallery data, category switching, lightbox, mobile carousel |
| `style.css` | Layout and animations |
| `nav.js` | Mobile menu toggle |
| `pricing.html`, `contact.html`, `about-me.html` | Rest of the site |
| `images/` | Full-res and compressed JPEGs |

No build step. Open `index.html` in a browser or serve the folder as static files.
