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
    Star Creation
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
    windowHeight = window.innerHeight,
    pageMidX = windowWidth/2,
    pageMidY = windowHeight/2;

$(window).resize(function() {
    windowWidth = window.innerWidth,
    windowHeight = window.innerHeight;
}) 

var $spaceShip = $("#tridiv").find(".scene");

// Move the enemy space ship around
$spaceShip.css({
    transform:"translateX("+3*windowWidth/4+"px) scale(.2)"
}).velocity({ // First showing
    translateX: ["-"+3*windowWidth/4+"px", 3*windowWidth/4+"px"],
    translateY: ["0px", "-250px"],
    rotateX: ["720deg", "0deg"],
    rotateY: ["-90deg", "-90deg"],
    scaleX: [0.2,0.2],
    scaleY: [0.2,0.2],
    scaleZ: [0.2,0.2]
}, {
    duration:2500,
    delay:3000
})
.velocity({ // Second showing - first half
    translateX: ["-5%", "-"+windowWidth+"px"],
    translateY: ["-10%", "-20%"],
    rotateX: ["-40deg", "-20deg"],
    rotateY: ["210deg", "140deg"],
    rotateZ: ["25deg", "-35deg"],
    scaleX: [0.3,0.8],
    scaleY: [0.3,0.8],
    scaleZ: [0.3,0.8]
}, {
    duration:1200,
    delay:2000
})
.velocity({ // Second showing - second half
    translateX: "-25%",
    translateY: "-"+windowHeight+"px",
    rotateX: "-40deg",
    rotateY: "200deg",
    rotateZ: "-20deg",
    scaleX: 0.1,
    scaleY: 0.1,
    scaleZ: 0.1
})
.velocity({
    // Wait for delay to finish
    opacity: 1
}, {
    duration: 5000,
    // Hide HUV and show the end text
    complete: function () {
        toggleHUV();
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

// "Move the camera" left
setTimeout(function() {
    pageMidX = pageMidX + windowWidth/4;

    $container.velocity({
        backgroundPosition: [windowWidth/4,1]
    }, {
        duration:1000,
        queue:false,
        complete:function() {
            pageMidX = pageMidX - windowWidth/4;
            $container.velocity("reverse", { queue:false });
        }
    })
}, 4000)

/* Special enhancements for WebKit browsers, which are faster at image resizing and box-shadow manipulation. */
if (isWebkit) {
    $stars.css("boxShadow", "0px 0px 4px 0px #ffff");
}

// Make and animate the stars
$stars.each(function() {
    var size = r(4, 10),
        myX = r(0, 2*windowWidth) - (pageMidX),
        myY = r(0, 2*windowHeight) - (pageMidY),
        thisStar = $(this);
    thisStar.css({width:size,height:size});

    (function run(x, y) {
        var newX = (x-pageMidX) * 10,
            newY = (y-pageMidY) * 10;
        // Make sure it goes off screen
        if(newX < windowWidth && newY < windowHeight && (newX > 0 && newY > 0)) {
            newX = 2*newX;
            newY = 2*newY;
        }  
        thisStar.velocity({
            opacity:1
        }, {
            duration:500,
            queue: false
        })
        .velocity({
            translateX: [newX,x],
            translateY: [newY,y]
        }, {
            duration: r(1000,3000),
            queue:false,
            complete: function () {
                var x = pageMidX - (Math.random() > 0.5 ? Math.random() * pageMidX : -Math.random() * pageMidX),
                    y = pageMidY - (Math.random() > 0.5 ? Math.random() * pageMidY : -Math.random() * pageMidY)
                
                thisStar.velocity({
                    opacity:0
                }, {
                    duration:500,
                    queue:false
                }).css({
                    transform: "translate("+x+"px,"+y+"px)"
                });
                run(x, y);
            }
        });
    }())
})
.appendTo($container);

// Fade out start description
$description.velocity({
    opacity: [0, 0.65]
}, {
    display: "none",
    delay: 3500,
    duration: 1100
});

var $teamStats = $HUV.find('.teamStats'),
    $commands = $HUV.find('.commands'),
    $artillery = $HUV.find('.artillery'),
    $HUVmid = $HUV.find('.HUVmid'),
    $radar = $HUV.find('.radar'),
    $targetDistance = $HUV.find('.targetDistance'),
    $shipStats = $HUV.find('.shipStats'),
    moveIn = true,
    HUVduration = 750;

function toggleHUV() {
    if(moveIn) {        
        $teamStats.velocity({
            translateX: [0,"-130%"]
        }, {
            duration:HUVduration
        })
        $commands.velocity({
            translateY: [0,"-100%"],
            translateX: ["-50%","-50%"]
        }, {
            duration:HUVduration
        })
        $artillery.velocity({
            translateX: [0,"130%"]
        }, {
            duration:HUVduration
        })
        $HUVmid.velocity({
            opacity: [1,0]
        }, {
            duration:HUVduration * 2
        })
        $radar.velocity({
            opacity: [1,0]
        }, {
            duration:HUVduration * 2
        })
        $targetDistance.velocity({
            translateY: [0,"100%"],
            translateX: ["-50%","-50%"]
        }, {
            duration:HUVduration
        })
        $shipStats.velocity({
            translateX: [0,"130%"]
        }, {
            duration:HUVduration
        })
        moveIn = false;
    } else {
        $teamStats.velocity("reverse");
        $commands.velocity("reverse");
        $artillery.velocity("reverse");
        $HUVmid.velocity("reverse");
        $radar.velocity("reverse");
        $targetDistance.velocity("reverse");
        $shipStats.velocity("reverse");
        moveIn = true;
    }
}

toggleHUV();