// Закрываем верхний баннер. Остальная страница поднимается на его место
const banner = document.querySelector("#announcement");
const closeBannerButton = document.querySelector("#close-announcement");

closeBannerButton.addEventListener("click", () => {
  banner.hidden = true;
});

// В каждой секции три карточки. Меняем их порядок, не копируя HTML в JavaScript
function setupSlider(sectionSelector) {
  const section = document.querySelector(sectionSelector);
  const grid = section.querySelector(".card-grid");
  const cards = Array.from(grid.children);
  const buttons = section.querySelectorAll(".section-arrow");
  const counter = section.querySelector(".section-navigation p");
  let current = 0;

  counter.setAttribute("aria-live", "polite");
  counter.setAttribute("aria-atomic", "true");

  function showCards() {
    for (let index = 0; index < cards.length; index++) {
      grid.append(cards[(current + index) % cards.length]);
    }
    counter.innerHTML = `<span>0${current + 1}</span> of 0${cards.length}`;
  }

  buttons[0].disabled = false;
  buttons[0].addEventListener("click", () => {
    current = (current - 1 + cards.length) % cards.length;
    showCards();
  });
  buttons[1].addEventListener("click", () => {
    current = (current + 1) % cards.length;
    showCards();
  });

  showCards();
}

setupSlider("#properties");
setupSlider("#testimonials");
setupSlider("#faq");

// Берём данные выбранного объекта из его карточки, чтобы они не расходились
const propertyDialog = document.querySelector("#property-dialog");
const dialogImage = document.querySelector("#dialog-image");
const dialogTitle = document.querySelector("#dialog-title");
const dialogDescription = document.querySelector("#dialog-description");
const dialogFeatures = document.querySelector("#dialog-features");
const dialogPrice = document.querySelector("#dialog-price");

function openProperty(card) {
  const image = card.querySelector(".property-card__image");
  const description = card.querySelector(".property-card__content p").cloneNode(true);
  description.querySelector("button").remove();

  dialogImage.src = image.getAttribute("src");
  dialogImage.alt = image.alt;
  dialogTitle.textContent = card.querySelector("h3").textContent;
  dialogDescription.textContent = description.textContent.trim().replace(/\.\.\.$/, ".");
  dialogFeatures.replaceChildren(...card.querySelector(".property-card__features").cloneNode(true).children);
  dialogPrice.textContent = card.querySelector(".property-card__price strong").textContent;

  propertyDialog.showModal();
  document.body.classList.add("modal-open");
}

document.querySelectorAll(".property-card").forEach((card) => {
  card.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => openProperty(card));
  });
});

propertyDialog.querySelector(".property-dialog__close").addEventListener("click", () => {
  propertyDialog.close();
});

// По Tab переходим с последнего элемента окна на первый и обратно
propertyDialog.addEventListener("keydown", (event) => {
  if (event.key !== "Tab") return;
  const first = propertyDialog.querySelector("button");
  const last = propertyDialog.querySelector("a");
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

// Нажатие на затемнение закрывает окно, а на его содержимое — нет
propertyDialog.addEventListener("click", (event) => {
  const bounds = propertyDialog.getBoundingClientRect();
  if (event.target === propertyDialog && (
    event.clientX < bounds.left || event.clientX > bounds.right ||
    event.clientY < bounds.top || event.clientY > bounds.bottom
  )) {
    propertyDialog.close();
  }
});

propertyDialog.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
});

document.querySelector("#dialog-contact").addEventListener("click", () => {
  propertyDialog.close();
});

// Каждый ответ раскрывается независимо. ARIA сообщает его состояние скринридеру
document.querySelectorAll(".faq-card__button").forEach((button) => {
  const answer = document.getElementById(button.getAttribute("aria-controls"));
  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!expanded));
    button.textContent = expanded ? "Read More" : "Read Less";
    answer.hidden = expanded;
  });
});

// Учебная форма проверяет адрес, но ничего не отправляет и не сохраняет
const emailForm = document.querySelector("#email-form");
const emailStatus = document.querySelector("#email-status");

emailForm.addEventListener("submit", (event) => {
  event.preventDefault();
  emailStatus.hidden = false;
  emailStatus.textContent = "Demo only: your email has not been sent or saved.";
});
