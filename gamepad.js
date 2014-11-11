// Here's the thing...
var Rx = require('rx');

// An array of valid gamepads
var gamepads = [];

// Connect/Disconnect
var gamepadConnected = Rx.Observable.fromEvent(window, 'gamepadconnected');
var gamepadDisconnected = Rx.Observable.fromEvent(window, 'gamepaddisconnected');

var gamepadOnSub = gamepadConnected.subscribe(
    function (e) {
      console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
        e.gamepad.index, e.gamepad.id,
        e.gamepad.buttons.length, e.gamepad.axes.length);

      if(e.gamepad) {
        gamepadHandler(e, true);
      }
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    });

var gamepadDisSub = gamepadDisconnected.subscribe(
  function(e) {
    console.log("Gamepad disconnected from index %d: %s",
    e.gamepad.index, e.gamepad.id);
    gamepadHandler(e, false);
  });

function gamepadHandler(event, connecting) {
  var gamepad = event.gamepad;

  // Note:
  // gamepad === navigator.getGamepads()[gamepad.index]
  if (connecting) {
    gamepads.forEach(function(gp) {
      gamepads[gamepad.index] = gamepad;
    });
  } else {
    delete gamepads[gamepad.index];
  }
}

// Use an interval because requestAnimationFrame steps over the stuff already in place in kart
// There must be some way i can merge rAF into kart later.
var interval = setInterval(pollGamepads, 500);

var gamepadInfo, ball;
var a = false,
    b = false,
    x = false,
    y = false,
    left = false,
    right = false,
    up = false,
    down = false;

function pollGamepads() {
  var gamepads = navigator.getGamepads();
  for (var i = 0; i < gamepads.length; i++) {
    var gp = gamepads[i];
    if(gp) {
      gamepadInfo = "Gamepad connected at index " + gp.index + ": " + gp.id + ". It has " + gp.buttons.length + " buttons and " + gp.axes.length + " axes.";
      gameLoop();
      clearInterval(interval);
    }
  }
}

function buttonPressed(b) {
  if (typeof(b) == "object") {
    return b.pressed;
  }
  return b == 1.0;
}

function gameLoop() {
  var gamepads = navigator.getGamepads()
  if (!gamepads)
    return;

  var gp = gamepads[0];
  a = buttonPressed(gp.buttons[0])
  b = buttonPressed(gp.buttons[1])
  x = buttonPressed(gp.buttons[2])
  y = buttonPressed(gp.buttons[3])
  up = buttonPressed(gp.buttons[12])
  down = buttonPressed(gp.buttons[13])
  left = buttonPressed(gp.buttons[14])
  right = buttonPressed(gp.buttons[15])

  setTimeout(gameLoop, 500)
}
