const isProjectsMobile = window.matchMedia("(max-width: 768px)").matches;

if (!isProjectsMobile) {
  const projectCards = document.querySelectorAll(".project-card");

  document.addEventListener("mousemove", (e) => {
    if (!projectCards.length) return;

    const baseX = (e.clientX / window.innerWidth - 0.5) * -20;
    const baseY = (e.clientY / window.innerHeight - 0.5) * -16;

    projectCards.forEach((card, index) => {
      const depth = 0.7 + index * 0.15;
      card.style.transform = `translate(${baseX * depth}px, ${baseY * depth}px)`;
    });
  });
}
