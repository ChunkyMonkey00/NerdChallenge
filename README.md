# ArrayQuest

Welcome to **ArrayQuest**, an exciting coding adventure where you navigate through arrays using a unique coding language. Use commands to explore, manipulate, and solve challenges in this array-based game. You can play it as a language or dive into the game itself.

## Game Description

In ArrayQuest, you'll be faced with a series of challenges that require you to manipulate an array using a set of commands. The commands include moving through the array, printing values, creating loops, and performing mathematical operations.

## Command Documentation

### Basic Commands:
- `>`: Move one step forward in the array.
- `<`: Move one step backward in the array.
- `.`: Print the number at the current position.
- `(`, `)`: Create and end a nested block for advanced operations.
- `number`: Set the current position to the specified number.
- `+`, `-`, `*`, `/`: Perform basic arithmetic operations on the current number.

### Advanced Commands:
- `^`: Insert a saved number into the current position.
- `_`: Save the current number as a variable.
- `:`: Inherit values within a nest or loop.
- `;`: Carry values outside of a nest or loop.

### Loops and Challenges:
- `[`, `]`: Start and end a loop, allowing repetitive operations.
- Type "challenge" in the console to initiate challenges.
- Win challenges by setting the array to the specified number.
- Complete challenges with the fewest characters to earn higher scores.

## Try it out!

Visit the <a href="https://chunkymonkey00.github.io/NerdChallenge/" target="_blank">ArrayQuest Demo</a> to experience the game and test your coding skills.

Enjoy your coding adventure in the world of ArrayQuest! 🚀  
  
---
  

# Command Documentation

## Commands:
- `>`: Move index up one
- `<`: Move index down one
- `.`: Print number at the current index
- `(`: Start a nest
- `)`: End a nest
- `~`: Placeholder (ignored)
- `number`: Set the number at the current index
- `_`: Save the number at the current index as a variable
- `^`: Insert saved number into the current index
- `:`: Inherit values in a nest
- `;`: Inherit values after the loop is complete
- `[`: Start a loop
- `]`: End a loop
- `+`: Add to the current index
- `-`: Subtract from the current index
- `/`: Divide the current index
- `*`: Multiply the current index

## Nests:
- Nests must have a start and end
- Nests cannot contain other nests
- Nests create a new sub-command line
- Carrying values into nests: if the first char of a nest is `:`, it will be inherited
- If `;` is placed at the end of a nest, the index and saved values will be carried into the main command line
- Example: `(:4_<^;)`

## Loops:
- Loops must have a start and end
- Loops cannot contain loops or nests
- Loops must start with a number; the amount of iterations to perform
- Loops create a new sub-command line
- Loops can carry values into them by using `:` as the second character
- Loops can make the main command line inherit their values by specifying `;` as their last command
- Example: `[2:<<^;]`

## Math Operators:
- Math operators by default perform their operation by 1
- You can only perform single-digit operations
- If a number is given after the operator, that will be the operation's constant
- Example: `+12` will add 1 then set the number to 2
- Add will add 1, subtract will subtract 1
- Multiply and divide will by 1, respectively

## Challenges:
- Type "challenge" in the console to give yourself a challenge
- You will always start with the first number already filled in
- The current challenge will only end if you type `end`, `endChallenge`, `end challenge`, or `endChall`
- You can win (ending the challenge) by setting the array to the number given to you by the challenge
- Try to do it in as few characters as possible
- You will be returned how long it took you, as well as how many characters it took
- You will also be evaluated based on how many times you set a number using the `<number>` command

## Loops (Challenge):
- Loops will only subtract score from you ONCE
- As such, you are encouraged to use loops as much as possible
- All defining characters are ignored (num of times to run loop, `:`, and `;`)

---
- jamesbaus on UC
- ChunkyMonkey00 on github
