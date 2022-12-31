
function switchDrums (drumId) {
  switch (drumId) {
    case "w":
      var crash = new Audio("sounds/crash.mp3");
      crash.play();
      break;

    case "a":
      var kick = new Audio("sounds/kick-bass.mp3");
      kick.play();
      break;

    case "s":
      var snare = new Audio("sounds/snare.mp3");
      snare.play();
      break;

    case "d":
      var tom1 = new Audio("sounds/tom-1.mp3");
      tom1.play();
      break;

    case "j":
      var tom2 = new Audio("sounds/tom-2.mp3");
      tom2.play();
      break;

    case "k":
      var tom3 = new Audio("sounds/tom-3.mp3");
      tom3.play();
      break;

    case "l":
      var tom4 = new Audio("sounds/tom-4.mp3");
      tom4.play();
      break;

    default:
      console.log(buttonInnerHtml);
  }
}

function buttonAnimation(btnKey) {
  var btnPressed = document.querySelector("." + btnKey);

  btnPressed.classList.add("pressed");
  setTimeout(function () {
    btnPressed.classList.remove("pressed");
  }, 100);
}

var drums = document.querySelectorAll(".drum");
var numberOfDrums = drums.length;

for (var i = 0; i < numberOfDrums; i++) {
  drums[i].addEventListener("click", function () {
    var buttonInnerHtml = this.innerHTML;
    switchDrums(buttonInnerHtml);
    buttonAnimation(buttonInnerHtml);
  });
}

document.addEventListener("keydown", function(event) {
  switchDrums(event.key);
  buttonAnimation(event.key);
})
