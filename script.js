const banner = document.querySelector("#announcement");
const closeBannerButton = document.querySelector("#close-announcement");

closeBannerButton.addEventListener("click", () => {
  banner.hidden = true;
});
