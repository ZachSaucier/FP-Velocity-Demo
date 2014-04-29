/***************
     Setup
***************/
var isMobile = !! ("ontouchstart" in window),
    isAndroid = /Android/i.test(navigator.userAgent);

$.fn.velocity.defaults.easing = "easeInOutSine";

/* Randomly generate an integer between two numbers. */
function r(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* Differentiate start counts based on roughly-guestimated device capabilities. */
var starsCount = isMobile ? (isAndroid ? 40 : 70) : 225,
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
    $rShip = $(".rship.bad"),
    pageMidX = windowWidth/2,
    pageMidY = windowHeight/2;

if(windowWidth < 875) {
    $description.html($description.html() + "</br></br>Please view in a larger window for the full experience");
}

var $spaceShip = $("#tridiv").find(".scene");

// Move the enemy space ship around
$spaceShip.css({
    transform:"translateX("+[3*windowWidth/4]+"px) scale(.2)",
    opacity:"1"
}).delay(3000)
.queue(function() {
    // Move the radar ship
    $rShip.velocity({
        translateX: ["-10px","165px"],
        translateY: ["15px","15px"],
        rotateZ: ["90deg","90deg"]
    }, {
        duration:800,
        delay: 600
    })

    // Change star origin & update count
    pageMidX = pageMidX + windowWidth/4;
    
    // Move the "camera"
    $container.velocity({
        backgroundPosition: [windowWidth/4,1]
    }, {
        duration:1000,
        delay:1000,
        queue:false,
        complete:function() {
            $("#enemies").html(1);
            pageMidX = pageMidX - windowWidth/4;
            $(".commandsContain").velocity({
                paddingTop: "30px"
            }, {
                duration: 500,
                queue: false
            })
            $container.velocity("reverse", { queue:false });
        }
    })
    $spaceShip.dequeue();
})
.velocity({ // First showing
    translateX: ["-"+[3*windowWidth/4]+"px", [3*windowWidth/4]+"px"],
    translateY: ["0px", "-250px"],
    rotateX: ["720deg", "0deg"],
    rotateY: ["-90deg", "-90deg"],
    scaleX: [0.2,0.2],
    scaleY: [0.2,0.2],
    scaleZ: [0.2,0.2]
}, {
    duration:2500
})
.delay(1000)
.queue(function() {
    $rShip.velocity({
        translateX: ["50px","17px"],
        translateY: ["10px","28px"],
        rotateZ: ["-25deg","50deg"]
    }, {
        duration:1000,
        delay: 300
    })
    $spaceShip.dequeue();
})
.velocity({ // Second showing - first half
    translateX: ["-5%", "-"+[5*windowWidth/4]+"px"],
    translateY: ["-10%", "-20%"],
    rotateX: ["-40deg", "-20deg"],
    rotateY: ["210deg", "140deg"],
    rotateZ: ["25deg", "-35deg"],
    scaleX: [0.3,0.8],
    scaleY: [0.3,0.8],
    scaleZ: [0.3,0.8]
}, {
    duration:1200
})
.queue(function() {
    $rShip.velocity({
        translateX: "25px",
        translateY: "-30px",
        rotateZ: "-2deg"
    }, {
        duration:500
    })
    $spaceShip.dequeue();
})
.velocity({ // Second showing - second half
    translateX: "-25%",
    translateY: "-100%",
    rotateX: "-40deg",
    rotateY: "200deg",
    rotateZ: "-20deg",
    scaleX: 0.1,
    scaleY: 0.1,
    scaleZ: 0.1
}, {
    duration:1500,
    complete: function() {
        $(".commandsContain").velocity({
             paddingTop: "0px"
        }, {
            duration: 500,
            queue: false
        })
    }
})
.velocity({
    // Wait for delay to finish
    opacity: 1
}, {
    duration: 2000,
    // Hide HUV and show the end text
    complete: function () {
        toggleHUV();
        $HUV.velocity({
            opacity:0
        }, {
            duration:1500
        })
        $description.html("<a href='http://zachsaucier.com/'>Created by Zach Saucier.</a><br /><br />"
                        +"The limit of what we can do is what we imagine.<br />Sincerely, "
                        +"<a href='https://twitter.com/ZachSaucier'>@ZachSaucier</a></br></br>"
                        +"View the source <a href='https://github.com/ZachSaucier/FP-Velocity-Demo'>on GitHub</a>")
            .velocity({
            opacity: 0.75
        }, {
            duration: 3500,
            display: "block"
        });
    }
})

// Make and animate the stars
$stars.each(function() {
    var size = r(4, 10),
        myX = pageMidX - (Math.random() > 0.5 ? Math.random() * pageMidX : -Math.random() * pageMidX),
        myY = pageMidY - (Math.random() > 0.5 ? Math.random() * pageMidY : -Math.random() * pageMidY),
        newX = (myX-pageMidX) * 10,
        newY = (myY-pageMidY) * 10,
        myDuration = r(1000,3000);
        // Make more go off screen
        if(newX < windowWidth && newY < windowHeight && (newX > 0 && newY > 0)) {
            newX = 2*newX;
            newY = 2*newY;
        }

    $(this).css({width:size,height:size});
    (function run(elem) {
        $(elem).velocity({
            opacity:1
        }, {
            duration:500,
            queue: false
        })
        .velocity({
            translateX: [newX,myX],
            translateY: [newY,myY]
        }, {
            duration: myDuration,
            queue:false,
            complete: function () {               
                $(elem).velocity({
                    opacity:0
                }, {
                    duration:500,
                    queue:false
                }).css({
                    transform: "translate("+myX+"px,"+myY+"px)"
                });
                run(elem);
            }
        })
    })(this)
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

(function changeSpeed() {
    setTimeout(function() { 
        $("#speed").html(r(440, 470));
        changeSpeed();
    },100);        
})();

$rShip.css({"transform":"translateX(165px) translateY(15px) rotate(90deg)"})

toggleHUV();