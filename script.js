const elts = {
  text1: document.getElementById("text1"),
  text2: document.getElementById("text2")
};

const typoBtn = document.getElementById("runaway-btn-2");

const textsFr = ["tiny", "est", "un", "cœur", "de", "l'identité", "visuelle"];
const textsEn = ["tiny", "is", "a", "heart", "of", "the visual", "identity"];

let texts = textsFr;
let currentLanguage = 'fr';
let textIndex = 0;


typoBtn.addEventListener("click", () => {
  if (currentLanguage === 'fr') {
    texts = textsEn;
    currentLanguage = 'en';
    typoBtn.textContent = 'fr';
  } else {
    texts = textsFr;
    currentLanguage = 'fr';
    typoBtn.textContent = 'angl';
  }

  textIndex = 0;
  updateText(); 
});


function updateText() {
  elts.text1.textContent = texts[textIndex];
  elts.text2.textContent = texts[(textIndex + 1) % texts.length];
}


const morphTime = 2;
const cooldownTime = 0.5;
let morph = 0;
let cooldown = cooldownTime;
let time = new Date();

updateText();


function doMorph() {
  morph -= cooldown;
  cooldown = 0;

  let fraction = morph / morphTime;
  if (fraction > 1) {
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
  let dt = (newTime - time) / 1500;
  time = newTime;

  cooldown -= dt;

   if (cooldown <= 0) {
    if (morph === 0) {
     textIndex = (textIndex + 1) % texts.length;
      updateText();
    }

    doMorph();

    morph += dt;
    if (morph > morphTime) {
      morph = morphTime;
      cooldown = cooldownTime;
    }
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


const allButtons = [
  document.getElementById("runaway-btn-1"),
  document.getElementById("runaway-btn-2"),
  document.getElementById("runaway-btn-3"),
  document.getElementById("runaway-btn-4")
];


allButtons.forEach(btn => {
  makeButtonRunaway(btn, allButtons);
});


const originalTopPositions = allButtons.map(btn => ({
  btn,
  originalTop: btn.style.top
}));

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  originalTopPositions.forEach(({ btn, originalTop }) => {
    if (scrollY > 100) {
      btn.style.top = "20px";
    } else {
      btn.style.top = originalTop; 
    }
  });
});


document.getElementById("runaway-btn-1").addEventListener("click", () => {
  const target = document.getElementById("highlight-text1");
  if (target) {
    target.scrollIntoView({ behavior: "smooth" });
  }
});


const moreBtn = document.getElementById("runaway-btn-3");
 const mainContent = document.getElementById("all-content");
 const newView = document.getElementById("new-view");

 moreBtn.addEventListener("click", () => {
  mainContent.style.display = "none";
  newView.style.display = "block";
});


const backBtn = document.getElementById("back-btn");

 backBtn.addEventListener("click", () => {
  newView.style.display = "none";
  mainContent.style.display = "block";
});







const animatedText = document.getElementById("animated-text");
 const originalText = animatedText.textContent;
 animatedText.textContent = '';

 const letters = [];

 for (let char of originalText) {
   const span = document.createElement('span');

   if (char === ' ') {
     span.innerHTML = '&nbsp;';
     span.classList.add('letter', 'space');
  } else {
     span.textContent = char;
     span.classList.add('letter');
    }
    animatedText.appendChild(span);
    letters.push(span);
 } 


 letters.forEach((letter, index) => {
   letter.addEventListener("mousemove", () => {
     const radius = 3; 

     for (let i = index - radius; i <= index + radius; i++) {
       const target = letters[i];
       if (target && !target.classList.contains('space')) {
         target.style.transition = 'none';
         const x = (Math.random() - 0.5) * 350;
         const y = (Math.random() - 0.5) * 350;
         const angle = (Math.random() - 0.5) * 400;
         target.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;
       }
     }
  });

  letter.addEventListener("mouseleave", () => {
    const radius = 3;
    for (let i = index - radius; i <= index + radius; i++) {
      const target = letters[i];
      if (target) {
        target.style.transition = 'transform 0.4s ease';
        target.style.transform = `translate(0, 0) rotate(0deg)`;
      }
    }
  });
});


document.getElementById("runaway-btn-4").addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
});
