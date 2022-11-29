const popmotion = require('popmotion');
const ball = document.querySelector('.ball');
// githubn test changes 
popmotion.animate({
    from: "0px",
    to: "100px",
    repeat: Infinity,
    repeatType: "mirror",
    type: "spring",
    onUpdate(update) {
        ball.style.top = update;
    }
});