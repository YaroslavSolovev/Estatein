// Находим баннер и кнопку его закрытия
const banner = document.querySelector("#announcement");
const closeBannerButton = document.querySelector("#close-announcement");

// После нажатия скрываем баннер, остальные блоки поднимаются вверх
closeBannerButton.addEventListener("click", () => {
  banner.hidden = true;
});
