var buttonColors = ['red', 'blue', 'green', 'yellow'];
var randomChosenColor;
var gamePattern = [];
var userPattern = [];
var level = 0;
var index = 0;
var start = false;

function nextMove() {
    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColor = buttonColors[randomNumber];
  
    gamePattern.push(randomChosenColor);
  
    $("#" + randomChosenColor).addClass("flash");
    setTimeout(function() {
      $("#" + randomChosenColor).removeClass("flash");
    }, 200);
  
    playSound(randomChosenColor);

    level++;
    $("#level-title").text("Level " + level);
}

function playSound(name) {
    var buttonSound = new Audio("sounds/" + name + ".mp3");
    buttonSound.play();
}

function animatePress(currentColor) {
    $("#" + currentColor).addClass("pressed");
    setTimeout(function() {
        $("#" + currentColor).removeClass("pressed");
    }, 100);
}

function checkAnswer() {
    return userPattern[index] === gamePattern[index];
}

function startGame() { 
    $(document).keydown(function() {
        if (!start)
            nextMove();
        start = true;
    });
}

$(".btn").on("click", function() {
    var userChosenColor = this.id;
    animatePress(userChosenColor);
    userPattern.push(userChosenColor);
    playSound(userChosenColor);

    var answer = checkAnswer();

    if (!answer) {
        gamePattern = [];
        userPattern = [];
        level = 0;
        index = 0;
        start = false;

        $("body").addClass("game-over");
        setTimeout(function() {
            $("body").removeClass("game-over");
        }, 200);
        playSound("wrong");

        $("#level-title").text("Game Over, Press Any Key to Restart");
        startGame();
    } else {
        if (index + 1 === level) {
            userPattern = [];
            index = 0;
            setTimeout(function() {
                nextMove();
            }, 1200);
        } else {
            index++;
        }
    }
});

startGame();