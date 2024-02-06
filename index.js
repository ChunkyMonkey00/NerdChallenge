var state = {
  index: 0,
  saved: 0,
  lIndex: 0,
  lSaved: 0,
  correctedIndex: 0,
  last: [0, 0, 0, 0, 0, 0, 0, 0],
  errFound: false,
}

var subState = {
  index: 0,
  saved: 0,
}

var challenge = {
  in: false,
  arr: [0, 0, 0, 0, 0, 0, 0, 0],
  score: 1000,
  time: 0,
}

function getI(i) {
  return document.getElementById("box" + i);
}

function getAll() {
  state.lIndex = state.index;
  state.lSaved = state.saved;

  let a = [];
  for (var i = 0; i < 8; i++) {
    a.push(Number(valI(i)));
  }
  return a;
}

function valI(i) {
  return document.getElementById("box" + i).innerHTML;
}

function setI(i, val) {
  document.getElementById("box" + i).innerHTML = val;
}

function setCursor(i) {
  var rect = document.getElementById("box" + i).getBoundingClientRect();
  var half = document.getElementById("box" + i).offsetWidth / 2;
  half -= document.getElementById("cursor").offsetWidth / 2;
  document.getElementById("cursor").style.left = rect.left + half + "px";
  document.getElementById("cursor").style.top = rect.bottom + "px";
}

(function () {
  var oldLog = console.log;
  var oldWarn = console.warn;
  var oldInfo = console.info;
  var oldError = console.error;
  var oldClear = console.clear

  console.log = function (message) {
    log(arguments[0], "log");
    oldLog.apply(console, arguments);
  };

  console.warn = function (message) {
    log(arguments[0], "warn");
    oldWarn.apply(console, arguments);
  };

  console.info = function (message) {
    log(arguments[0], "info");
    oldInfo.apply(console, arguments);
  };

  console.error = function (message) {
    log(arguments[0], "error");
    oldError.apply(console, arguments);
  };

  console.clear = function () {
    clearLog();
    oldClear();
  };

})();

function log(str, method) {
  var cnsl = document.getElementById("consoleOutput");
  var logEntry = document.createElement("div");

  if (method == "log") logEntry.style.color = "green";
  if (method == "warn") logEntry.style.color = "yellow";
  if (method == "error") logEntry.style.color = "red";
  if (method == "info") logEntry.style.color = "white";

  logEntry.style.width = "100%";
  logEntry.style.borderBottom = "0.2px solid rgba(211,211,211,0.3)";

  let now = new Date();
  let hours = now.getHours().toString().padStart(2, '0');
  let minutes = now.getMinutes().toString().padStart(2, '0');
  let seconds = now.getSeconds().toString().padStart(2, '0');

  let ts = `${hours}:${minutes}:${seconds}`;

  logEntry.innerHTML = `<span style="color: rgba(128, 128, 128, 0.5);">${ts};</span> ${str}`;

  cnsl.appendChild(logEntry);
  cnsl.scrollTo(0, cnsl.scrollHeight);
}

function clearLog() {
  var cnsl = document.getElementById("consoleOutput");
  cnsl.innerHTML = "";
  cnsl.scrollTo(0, cnsl.scrollHeight);
}

/* Log extensions (methods specifically used in log) */
var terms = [
  ["hi", "Hello!"],
  ["bye", "Goodbye :("]
];

var funcs = [
  ["challenge", "giveChallenge()"],
  ["end", "endChallenge()"],
  ["endChallenge", "endChallenge()"],
  ["end challenge", "endChallenge()"],
  ["endChall", "endChallenge()"],
]

function processLog(str) {
  var str = str.toLowerCase();
  for (var i = 0; i < terms.length; i++) {
    if (terms[i][0] == str) {
      log(terms[i][1]);
      return true;
    }
  }

  for (var i = 0; i < funcs.length; i++) {
    if (funcs[i][0] == str) {
      eval(funcs[i][1]);
      return true;
    }
  }
  return false;
}

function clear() {
  for (var i = 0; i < 8; i++) {
    setI(i, 0);
  }
}

/* Challenges */
function giveChallenge() {
  var rndChall = [];
  for (var i = 0; i < 8; i++) {
    rndChall.push(Math.floor(Math.random() * 9));
  }
  log("Your challenge is: " + rndChall, "info");
  challenge.num = rndChall;
  challenge.score = 1000;
  challenge.time = Date.now();
  challenge.in = true;

  setI(0, challenge.num[0]);
  state.index = 0;
  setCursor(0);

  currentArray = getAll();
  targetArray = rndChall;
}

function endChallenge(win = false) {
  // Calculate the time difference in seconds
  var timeDifferenceInSeconds = Math.floor((Date.now() - challenge.time) / 1000);

  // Calculate minutes and seconds
  var minutes = Math.min(Math.floor(timeDifferenceInSeconds / 60), 60); // Limit to 60 minutes
  var seconds = timeDifferenceInSeconds % 60;

  // Format the time difference as "MM:SS"
  challenge.time = minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
  var fail = false;

  if (challenge.score <= 0) {
    fail = true;
  }

  if (win && !fail) {
    log("Challenge completed! Info:", "info");
    log(`Score: ${challenge.score}; Time: ${challenge.time}`);
  }

  if (win && fail) {
    log("You failed. Info:", "info");
    log(`Score: ${challenge.score}; Time: ${challenge.time}`);
  }

  if (!win) {
    log("You gave up >:O", "warn");
  }

  if (challenge.in) {
    var result = findCommands(currentArray, targetArray);
    result = findLoops(result);
    log("Computer's solution:", "info")
    log(result);
  }

  challenge.in = false;
}

/* Setup everything */
clear();
setCursor(0);

document.getElementById("input").addEventListener('keydown', function (e) {
  if (e.keyCode == 13) {
    processInput(document.getElementById("input").value);
  }
});

document.getElementById("consoleInput").addEventListener('keydown', function (e) {
  if (e.keyCode == 13) {
    if (!processLog(document.getElementById("consoleInput").value)) {
      try {
        eval(document.getElementById("consoleInput").value);
      } catch (e) {
        console.warn(e);
      }
    }
    document.getElementById("consoleInput").value = "";
  }
});

function startContained(arr) {
  //Process it
  var instructions = arr;
  if (arr[0] == ":") {
    subState.index = state.index;
    subState.saved = state.saved;
    arr[0] = "~";
  }

  for (var i = 0; i < instructions.length; i++) {
    if (state.errFound) return;

    /* Check because we like to splice stuff */
    if (i > instructions.length) break;

    let recognized = false;

    let t = instructions[i];

    /* Disconcern instructions already processed */
    if (t == "~") continue;

    if (t == ">") {
      subState.index++;
      recognized = true;
    }
    if (t == "<") {
      subState.index--;
      recognized = true;
    }

    /* Movement Corrections */
    if (subState.index < 0) subState.index = 0;
    if (subState.index > 7) subState.index = 7;

    if (Number(t) || Number(t) == 0) {
      setI(subState.index, t);
      challenge.score -= 325;
      recognized = true;
    }

    if (t == ".") {
      console.log(valI(subState.index));
      recognized = true;
    }

    if (t == "_") {
      subState.saved = valI(subState.index);
      recognized = true;
    }

    if (t == "^") {
      setI(subState.index, subState.saved);
      recognized = true;
    }

    if (t == ";") {
      recognized = true;
    }

    if (t == "+" && (Number(instructions[i + 1]) || Number(instructions[i + 1] == 0))) {
      setI(subState.index, Number(valI(subState.index)) + Number(instructions[i + 1]));

      /* Make sure we ignore that next number */
      instructions[i + 1] = "~";

      recognized = true;
    } else if (t == "+") {
      setI(subState.index, Number(valI(subState.index)) + 1);
      recognized = true;
    }

    if (t == "-" && (Number(instructions[i + 1]) || Number(instructions[i + 1] == 0))) {
      setI(subState.index, Number(valI(subState.index)) - Number(instructions[i + 1]));

      /* Make sure we ignore that next number */
      instructions[i + 1] = "~";

      recognized = true;
    } else if (t == "-") {
      setI(subState.index, Number(valI(subState.index)) - 1);
      recognized = true;
    }

    if (t == "/" && (Number(instructions[i + 1]) || Number(instructions[i + 1] == 0))) {
      setI(subState.index, Number(valI(subState.index)) / Number(instructions[i + 1]));

      /* Make sure we ignore that next number */
      instructions[i + 1] = "~";

      recognized = true;
    } else if (t == "/") {
      setI(subState.index, Number(valI(subState.index)) / 1);
      recognized = true;
    }

    if (t == "*" && (Number(instructions[i + 1]) || Number(instructions[i + 1] == 0))) {
      setI(subState.index, Number(valI(subState.index)) * Number(instructions[i + 1]));

      /* Make sure we ignore that next number */
      instructions[i + 1] = "~";

      recognized = true;
    } else if (t == "*") {
      setI(subState.index, Number(valI(subState.index)) * 1);
      recognized = true;
    }

    if (!recognized) console.warn(`Instruction '${t}' at char: <${i}> not recognized`)
  }

  /* Challenge */
  challenge.score -= 25 * instructions.length;

  if (arr[arr.length - 1] == ";") {
    state.index = subState.index;
    state.saved = subState.saved;
  }
}

function convertContained(instructions, i) {
  let l = instructions.indexOf(")");
  let a = [];

  /* j=i;j<l+1;j++ BUT exclude parenthesis in the contained, so and sub 1 */
  for (var j = i + 1; j < l; j++) {
    a.push(instructions[j]);
  }

  if (a.includes("(") || a.includes(")")) { stopExecution("can't nest more than once."); return []; }

  state.correctedIndex += a.length + 2;

  instructions.splice(instructions.indexOf("("), l - i + 1);

  /* Var reset here because loops dont reset substate vars */
  subState.index = 0;
  subState.saved = 0;

  startContained(a);

  return instructions;
}

function convertLoop(instructions, i) {
  let l = instructions.indexOf("]");
  let a = [];
  let num;

  /* j=i;j<l+1;j++ BUT exclude parenthesis in the contained, so and sub 1 */
  for (var j = i + 1; j < l; j++) {
    a.push(instructions[j]);
  }

  if (Number(a[0]) || Number(a[0] == 0)) {
    num = a[0];
  } else {
    stopExecution("loop did not specify number of iterations."); return [];
  }

  if (a.includes("[") || a.includes("]")) { stopExecution("can't contain loop within loop."); return; }
  if (a.includes("(") || a.includes(")")) { stopExecution("loops can't contain nests."); return; }

  state.correctedIndex += a.length + 2;

  instructions.splice(instructions.indexOf("["), l - i + 1);

  /* Var reset here because loops dont reset substate vars */
  subState.index = 0;
  subState.saved = 0;

  /* Finally, make sure we ignore the iteration counter now */
  a[0] = "~";

  startLoop(a, num);

  return instructions;
}

function startLoop(arr, num) {
  //Process it
  let ignoreCount = 1;
  var instructions = arr;
  if (arr[1] == ":") {
    ignoreCount++;
    subState.index = state.index;
    subState.saved = state.saved;
    arr[1] = "~";
  }

  for (var j = 0; j < num; j++) {
    for (var i = 0; i < instructions.length; i++) {
      if (state.errFound) return;

      /* Check because we like to splice stuff */
      if (i > instructions.length) break;

      let recognized = false;

      let t = instructions[i];

      /* Disconcern instructions already processed */
      if (t == "~") continue;

      if (t == ">") {
        subState.index++;
        recognized = true;
      }
      if (t == "<") {
        subState.index--;
        recognized = true;
      }

      /* Movement Corrections */
      if (subState.index < 0) subState.index = 0;
      if (subState.index > 7) subState.index = 7;

      if (Number(t) || Number(t) == 0) {
        setI(subState.index, t);
        challenge.score -= 325;
        recognized = true;
      }

      if (t == ".") {
        console.log(valI(subState.index));
        recognized = true;
      }

      if (t == "_") {
        subState.saved = valI(subState.index);
        recognized = true;
      }

      if (t == "^") {
        setI(subState.index, subState.saved);
        recognized = true;
      }

      if (t == ";") {
        recognized = true;
      }

      if (t == "+" && (Number(instructions[i + 1]) || Number(instructions[i + 1] == 0))) {
        setI(subState.index, Number(valI(subState.index)) + Number(instructions[i + 1]));

        /* Make sure we ignore that next number */
        instructions[i + 1] = "~";

        recognized = true;
      } else if (t == "+") {
        setI(subState.index, Number(valI(subState.index)) + 1);
        recognized = true;
      }

      if (t == "-" && (Number(instructions[i + 1]) || Number(instructions[i + 1] == 0))) {
        setI(subState.index, Number(valI(subState.index)) - Number(instructions[i + 1]));

        /* Make sure we ignore that next number */
        instructions[i + 1] = "~";

        recognized = true;
      } else if (t == "-") {
        setI(subState.index, Number(valI(subState.index)) - 1);
        recognized = true;
      }

      if (t == "/" && (Number(instructions[i + 1]) || Number(instructions[i + 1] == 0))) {
        setI(subState.index, Number(valI(subState.index)) / Number(instructions[i + 1]));

        /* Make sure we ignore that next number */
        instructions[i + 1] = "~";

        recognized = true;
      } else if (t == "/") {
        setI(subState.index, Number(valI(subState.index)) / 1);
        recognized = true;
      }

      if (t == "*" && (Number(instructions[i + 1]) || Number(instructions[i + 1] == 0))) {
        setI(subState.index, Number(valI(subState.index)) * Number(instructions[i + 1]));

        /* Make sure we ignore that next number */
        instructions[i + 1] = "~";

        recognized = true;
      } else if (t == "*") {
        setI(subState.index, Number(valI(subState.index)) * 1);
        recognized = true;
      }

      if (!recognized) console.warn(`Instruction '${t}' at char: <${i}> not recognized`)
    }
  }

  if (arr[arr.length - 1] == ";") {
    state.index = subState.index;
    state.saved = subState.saved;
    ignoreCount++;
  }

  /* Challenge */
  challenge.score -= 25 * (instructions.length - ignoreCount);

}

function setToLast() {
  for (var i = 0; i < 8; i++) {
    setI(i, state.last[i]);
  }

  state.index = state.lIndex;
  state.saved = state.lSaved;
}

function stopExecution(err) {
  state.errFound = true;
  console.warn("Reverted: " + err);
  setToLast();
}

function processInput(input) {
  //Process it
  var instructions = input.split("");

  state.errFound = false;
  state.correctedIndex = 0;

  for (var i = 0; i < instructions.length; i++) {
    if (state.errFound) return;

    /* Check because we like to splice stuff */
    if (i > instructions.length) break;

    let recognized = false;

    let t = instructions[i];

    /* Disconcern instructions already processed */
    if (t == "~") continue;

    if (t == ">") {
      state.index++;
      recognized = true;
    }
    if (t == "<") {
      state.index--;
      recognized = true;
    }

    /* Movement Corrections */
    if (state.index < 0) state.index = 0;
    if (state.index > 7) state.index = 7;

    if (Number(t) || Number(t) == 0) {
      setI(state.index, t);
      challenge.score -= 325;
      recognized = true;
    }

    if (t == ".") {
      console.log(valI(state.index));
      recognized = true;
    }

    /* Check if theres a matching end, and that is greater than the current start */
    if (t === "(" && instructions.includes(")") && instructions.indexOf(")") > i) {
      instructions = convertContained(instructions, i);
      i--;
      recognized = true;
    }

    if (t === "[" && instructions.includes("]") && instructions.indexOf("]") > i) {
      instructions = convertLoop(instructions, i);
      i--;
      recognized = true;
    }

    if (t == "_") {
      state.saved = valI(state.index);
      recognized = true;
    }

    if (t == "^") {
      setI(state.index, state.saved);
      recognized = true;
    }

    if (t == "+" && (Number(instructions[i + 1]) || Number(instructions[i + 1] == 0))) {
      setI(state.index, Number(valI(state.index)) + Number(instructions[i + 1]));

      /* Make sure we ignore that next number */
      instructions[i + 1] = "~";

      recognized = true;
    } else if (t == "+") {
      setI(state.index, Number(valI(state.index)) + 1);
      recognized = true;
    }

    if (t == "-" && (Number(instructions[i + 1]) || Number(instructions[i + 1] == 0))) {
      setI(state.index, Number(valI(state.index)) - Number(instructions[i + 1]));

      /* Make sure we ignore that next number */
      instructions[i + 1] = "~";

      recognized = true;
    } else if (t == "-") {
      setI(state.index, Number(valI(state.index)) - 1);
      recognized = true;
    }

    if (t == "/" && (Number(instructions[i + 1]) || Number(instructions[i + 1] == 0))) {
      setI(state.index, Number(valI(state.index)) / Number(instructions[i + 1]));

      /* Make sure we ignore that next number */
      instructions[i + 1] = "~";

      recognized = true;
    } else if (t == "/") {
      setI(state.index, Number(valI(state.index)) / 1);
      recognized = true;
    }

    if (t == "*" && (Number(instructions[i + 1]) || Number(instructions[i + 1] == 0))) {
      setI(state.index, Number(valI(state.index)) * Number(instructions[i + 1]));

      /* Make sure we ignore that next number */
      instructions[i + 1] = "~";

      recognized = true;
    } else if (t == "*") {
      setI(state.index, Number(valI(state.index)) * 1);
      recognized = true;
    }

    setCursor(state.index);

    if (!recognized) console.warn(`Instruction '${t}' at char: <${i + state.correctedIndex}> not recognized`);
  }

  /* Succefully completed instruction */
  if (!state.errFound) state.last = getAll();
  document.getElementById("input").value = "";

  /* Challenge */
  challenge.score -= 25 * instructions.length;

  if (String(getAll()) == String(challenge.num) && challenge.in) {
    endChallenge(true);
  }
}

/* Listeners for automated function */
window.addEventListener('resize', () => setCursor(state.index));

/* Automated cursor function */
var show = true;
const cursorBlink = setInterval(() => {
  if (show) document.getElementById("cursor").style.visibility = "visible";
  if (!show) document.getElementById("cursor").style.visibility = "hidden";
  show = !show;
}, 500);

/* Auto solver */
function findMorD(diff, x, y) {
  if (diff > 2) {
    if (Number.isInteger(y / x)) {
      return y / x
    } else {
      return null;
    }
  } else if (diff < -2) {
    if (Number.isInteger(x / y)) {
      return x / y
    } else {
      return null;
    }
  }
}

function findCommands(currentArray, targetArray) {
  let commands = "";
  let currentIndex = 0;

  for (let i = 0; i < currentArray.length; i++) {
    if (currentArray[i] !== targetArray[i]) {
      // Calculate the difference between current and target values
      let diff = targetArray[i] - currentArray[i];

      let mord = findMorD(diff, currentArray[i], targetArray[i]);
      if (mord != null) {
        if (diff < -2) commands += "/" + mord;
        if (diff > 2) commands += "*" + mord;
      } else {
        if((diff > 4 || diff < -4) && currentArray[i]!=0 && targetArray[i]!=0) {
          commands += "*"+targetArray[i]+"/"+currentArray[i];
        } else {
        // Choose the appropriate command based on the difference
        if (diff > 0) {
          commands += "+".repeat(diff);
        } else if (diff < 0) {
          commands += "-".repeat(Math.abs(diff));
        }
        }
      }

    }
    // Move to the next index and add the command to set the value
    commands += ">";
    currentIndex = i;
  }

  return commands;
}

function findLoops(str) {
  let result = "";
  let count = 0;
  let currentChar = null;

  for (let i = 0; i < str.length; i++) {
    if (str[i] === '+' || str[i] === '-') {
      if (currentChar === null) {
        currentChar = str[i];
        count = 1;
      } else if (str[i] === currentChar) {
        count++;
      } else {
        // Only create a loop if the count is 3 or more
        if (count >= 3) {
          result += "[" + count + ":" + currentChar + ";]";
        } else {
          // Otherwise, append the individual characters
          for (let j = 0; j < count; j++) {
            result += currentChar;
          }
        }
        currentChar = str[i];
        count = 1;
      }
    } else {
      // Handle non-loop characters
      if (currentChar !== null) {
        // End the current sequence before appending the non-loop character
        if (count >= 3) {
          result += "[" + count + ":" + currentChar + ";]";
        } else {
          for (let j = 0; j < count; j++) {
            result += currentChar;
          }
        }
        currentChar = null;
      }
      result += str[i];
    }
  }

  // Handle the end of the last sequence
  if (currentChar !== null) {
    if (count >= 3) {
      result += "[" + count + ":" + currentChar + ";]";
    } else {
      for (let j = 0; j < count; j++) {
        result += currentChar;
      }
    }
  }

  // Remove trailing '<' and '>' characters
  result = result.replace(/[<>]+$/, '');

  return result;
}

var currentArray;
var targetArray;

/* Docs:

Commands:
> = move index up one
< = move index down one
. = print num at current index
( = start a nest
) = end a nest
~ = placeholder (ignored)
number = set number at current index
_ = save number at current index as variable
^ = insert saved number into current index
: = inherit values in a nest
; = inherit values after loop is complete
[ = start a loop
] = end a loop
+ = add to the current index
- = subtract from the current index
/ = divide current index
* = multiply current index

Nests:
- Nests must have a start and end
- Nests cannot contain other nests
- Nests create a new sub-command line: if you are at index 4 and start a nest, you will have a nested index of 0, and when ending the next your index is back to 4.
- Carrying values into nests: if the first char of a nest is :, it will be inherited.
- If you choose to put a ; at the end of a nest, the index and saved values will be carried into the main command line.
- Example: (:4_<^;)

Loops:
- Loops must have a start and end
- Loops cannot contain loops or nests
- Loops must start with a number; the amount of iterations to perform
- Loops create a new sub-command line
- Loops can also carry values into them by using : as the second character
- Loops can make the main command line inherit their values by specifying ; as their last command.
- Example: [2:<<^;]

Math operators:
- Math operators by default perform their operation by 1.
- You can only perform single digit operations.
- If a number is given after the operator, that will be the operation's constant.
- EX: +12 will add 1 then set the number to 2
- Add will add 1, subtract will subtract 1.
- Multiply and divide will by 1, respectively.


Challenges:
- Type "challenge" in the console to give yourself a challenge
- You will always start with the first number already filled in
- The current challenge will only end if you type end, endChallenge, end challenge, or endChall
- You can win (ending the challenge) by setting the array to the number given to you by the challenge!
- Try to do it in as few characters as possible
- You will be returned how long it took you, as well as how many characters it took.
- You will also be evaluated based on how many times you set a number using the <number> command
Loops (challenge):
- Loops will only subtract score from you ONCE
- As such you are encouraged to use loops as much as possible.
- All defining characters are ignored (num of time to run loop, :, and ;)
*/
