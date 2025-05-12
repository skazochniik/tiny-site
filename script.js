const elts = {
  text1: document.getElementById("text1"),
  text2: document.getElementById("text2")
};

const texts = [
  "tiny",
  "est",
  "un",
  "cœur",
  "de",
  "l'identité",
  "visuelle",
  ":3",
  "meow"
];

const morphTime = 1;
const cooldownTime = 0.25;

let textIndex = texts.length - 1;
let time = new Date();
let morph = 0;
let cooldown = cooldownTime;

elts.text1.textContent = texts[textIndex % texts.length];
elts.text2.textContent = texts[(textIndex + 1) % texts.length];

function doMorph() {
  morph -= cooldown;
  cooldown = 0;

  let fraction = morph / morphTime;

  if (fraction > 1) {
    cooldown = cooldownTime;
    fraction = 1;
  }

  setMorph(fraction);
}

function setMorph(fraction) {
  elts.text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
  elts.text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

  fraction = 1 - fraction;
  elts.text1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
  elts.text1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

  elts.text1.textContent = texts[textIndex % texts.length];
  elts.text2.textContent = texts[(textIndex + 1) % texts.length];
}

function doCooldown() {
  morph = 0;
  elts.text2.style.filter = "";
  elts.text2.style.opacity = "100%";

  elts.text1.style.filter = "";
  elts.text1.style.opacity = "0%";
}

function animate() {
  requestAnimationFrame(animate);

  let newTime = new Date();
  let shouldIncrementIndex = cooldown > 0;
  let dt = (newTime - time) / 1500;
  time = newTime;

  cooldown -= dt;

  if (cooldown <= 0) {
    if (shouldIncrementIndex) {
      textIndex++;
    }

    doMorph();
  } else {
    doCooldown();
  }
}

animate();

function makeButtonRunaway(btn, allButtons) {
  document.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const rect = btn.getBoundingClientRect();
    const btnX = rect.left + rect.width / 2;
    const btnY = rect.top + rect.height / 2;

    const distX = mouseX - btnX;
    const distY = mouseY - btnY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance < 150) {
      const offsetX = -(distX / distance) * 100;
      const offsetY = -(distY / distance) * 100;

      let newLeft = btn.offsetLeft + offsetX;
      let newTop = btn.offsetTop + offsetY;

      const maxX = window.innerWidth - btn.offsetWidth;
      const maxY = window.innerHeight - btn.offsetHeight;

      // Проверка, чтобы кнопки не пересекались
      allButtons.forEach(otherBtn => {
        if (btn !== otherBtn) {
          const otherRect = otherBtn.getBoundingClientRect();
          const otherX = otherRect.left + otherRect.width / 2;
          const otherY = otherRect.top + otherRect.height / 2;

          const dx = (newLeft + btn.offsetWidth / 2) - otherX;
          const dy = (newTop + btn.offsetHeight / 2) - otherY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const minDist = (btn.offsetWidth + otherBtn.offsetWidth) / 2;

          if (dist < minDist) {
            const overlap = minDist - dist;
            const pushX = (dx / dist) * overlap;
            const pushY = (dy / dist) * overlap;
            newLeft += pushX;
            newTop += pushY;
          }
        }
      });

      btn.style.left = Math.min(Math.max(0, newLeft), maxX) + "px";
      btn.style.top = Math.min(Math.max(0, newTop), maxY) + "px";
    }
  });
}

// Создаем массив всех кнопок
const allButtons = [
  document.getElementById("runaway-btn-1"),
  document.getElementById("runaway-btn-2"),
  document.getElementById("runaway-btn-3"),
  document.getElementById("runaway-btn-4"),
  document.getElementById("runaway-btn-5")
];

// Применяем поведение ко всем кнопкам
allButtons.forEach(btn => {
  makeButtonRunaway(btn, allButtons);
});



// Сохраняем изначальные top-позиции
const originalTopPositions = allButtons.map(btn => ({
  btn,
  originalTop: btn.style.top
}));

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  originalTopPositions.forEach(({ btn, originalTop }) => {
    if (scrollY > 100) {
      btn.style.top = "20px"; // прибиваем наверх
    } else {
      btn.style.top = originalTop; // возвращаем назад
    }
  });
});


// Прокрутка ко #highlight-text1 при клике на любую кнопку
allButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = document.getElementById("highlight-text1");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});


