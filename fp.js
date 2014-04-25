/***************
     Setup
***************/

var isWebkit = /Webkit/i.test(navigator.userAgent),
    isChrome = /Chrome/i.test(navigator.userAgent),
    isMobile = !! ("ontouchstart" in window),
    isAndroid = /Android/i.test(navigator.userAgent);

$.fn.velocity.defaults.easing = "easeInOutSine";

/* Randomly generate an integer between two numbers. */
function r(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

if (isMobile && isAndroid && !isChrome) {
    alert("Although Velocity.js works on all browsers, this 3D demo is for iOS devices or Android devices running Chrome only. Redirecting you to Velocity's documentation.");
    window.location = "index.html";
}

/*******************
    Dot Creation
*******************/

/* Differentiate dot counts based on roughly-guestimated device and browser capabilities. */
var starsCount = isMobile ? (isAndroid ? 40 : 70) : (isChrome ? 275 : 225),
    starsHTML = "",
    $stars;

for (var i = 0; i < starsCount; i++) {
    starsHTML += "<div class='star'></div>";
}
$stars = $(starsHTML);

/*****************
    Animation
*****************/

var $container = $("#stars"),
    $description = $("#description"),
    $HUV = $(".HUV");

var windowWidth = window.innerWidth,
    windowHeight = window.innerHeight;

var translateZMin = -100,
    translateZMax = 00;

/*$container.css("perspective-origin", windowWidth / 2 + "px " + (windowHeight / 2) + "px")
    .velocity({
    perspective: [1000, 1000],
    opacity: [0.85, 0.55]
}, {
    duration: 800,
    loop: 1,
    delay: 3250
})*/;

/* Special enhancements for WebKit browsers, which are faster at image resizing and box-shadow manipulation. */
if (isWebkit) {
    $stars.css("boxShadow", "0px 0px 4px 0px #ffff");
}

$stars.each(function() { 
    var size = r(4, 15);
    $(this).css({
        transform:"translate3d("+r(0, windowWidth)+"px,"+r(0, windowHeight)+"px,"+r(translateZMin, translateZMax)+"px)",
        height:size,
        width:size
    })
}).delay(20000)/*
    .velocity({

    translateX: [
    function () {
        return "+=" + r(-windowWidth, windowWidth)
    },
    function () {
        return r(0, windowWidth)
    }],

    translateY: [
    function () {
        return "+=" + r(-windowHeight, windowHeight)
    },
    function () {
        return r(0, windowHeight)
    }],

    translateZ: [
    function () {
        return "+=" + r(translateZMin, translateZMax)
    },
    function () {
        return r(translateZMin, translateZMax)
    }]
}, {
    duration: 7000
})*/
    .velocity("reverse", {
    easing: "easeOutQuad"
})
    .velocity({
    opacity: 0
}, {
    duration: 2000,
    complete: function () {
        $HUV.velocity({
            opacity:0
        }, {
            duration:1500
        })
        $description.html("<a href='http://zachsaucier.com/'>Created by Zach Saucier.</a><br /><br />The limit of what we can do is what we imagine.<br />Sincerely, <a href='https://twitter.com/ZachSaucier'>@ZachSaucier</a>")
            .velocity({
            opacity: 0.75
        }, {
            duration: 3500,
            display: "block"
        });
    }
})
    .appendTo($container);

$description.velocity({
    opacity: [0, 0.65]
}, {
    display: "none",
    delay: 3500,
    duration: 1100
});

$HUV.velocity({
    opacity:[1, 0]
}, {
    duration:700
})