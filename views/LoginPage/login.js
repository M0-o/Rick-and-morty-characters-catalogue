let rotateBtn = document.querySelectorAll(".rotate-btn");
let mainWrapper = document.querySelector("#mainWrapper");

rotateBtn.forEach((el) =>
  el.addEventListener("click", () => {
    mainWrapper.classList.toggle("rotate");
  })
);
