// Get the canvas and context
const canvas = document.getElementById('gameCanvas'); // Selects the HTML canvas element by its ID
const ctx = canvas.getContext('2d'); // Gets the 2D drawing context to draw on the canvas

// Player objects
const player1 = {
    x: 100, // Sets the initial x-coordinate (horizontal position) of Player 1
    y: 250, // Sets the initial y-coordinate (vertical position) of Player 1
    width: 50, // Defines the width of Player 1's character
    height: 50, // Defines the height of Player 1's character
    speed: 5, // Sets how fast Player 1 moves
    health: 100, // Sets the initial health points for Player 1
    direction: 'right', // Sets the initial direction Player 1 is facing
    special: 0 //Sets the initial special charge for Player 1
};

const player2 = {
    x: 650, // Sets the initial x-coordinate of Player 2 (farther to the right)
    y: 250, // Sets the initial y-coordinate of Player 2
    width: 50, // Defines the width of Player 2's character
    height: 50, // Defines the height of Player 2's character
    speed: 5, // Sets how fast Player 2 moves
    health: 100, // Sets the initial health points for Player 2
    direction: 'left', // Sets the initial direction Player 1 is facing (opposite too Player 2)
    special: 0 //Sets the initial special charge for Player 2
};

// Draw characters
function drawCharacters() {
    // Draw Player 1
    ctx.fillStyle = '#ff99cc'; // Sets the fill color to a kawaii pink for Player 1
    ctx.fillRect(player1.x, player1.y, player1.width, player1.height); // Draws Player 1 as a rectangle at their current position
    
    // Draw Player 2
    ctx.fillStyle = '#99ccff'; // Sets the fill color to a kawaii blue for Player 2
    ctx.fillRect(player2.x, player2.y, player2.width, player2.height); // Draws Player 2 as a rectangle at their current position
}

// Handle movement
document.addEventListener('keydown', (event) => { // Listens for keyboard input events
    // Player 1 controls (WASD)
    switch (event.key) { // Checks which key was pressed
        case 'w': // If 'W' is pressed
            player1.y -= player1.speed; // Moves Player 1 up by subtracting speed from y-coordinate
            break; // Exits the switch statement
        case 's': // If 'S' is pressed
            player1.y += player1.speed; // Moves Player 1 down by adding speed to y-coordinate
            break; // Exits the switch statement
        case 'a': // If 'A' is pressed
            player1.x -= player1.speed; // Moves Player 1 left by subtracting speed from x-coordinate
            player1.direction = 'left'; // Updates Player 1's direction to 'left'
            break; // Exits the switch statement
        case 'd': // If 'D' is pressed
            player1.x += player1.speed; // Moves Player 1 right by adding speed to x-coordinate
            player1.direction = 'right'; // Updates Player 1's direction to 'right'
            break; // Exits the switch statement
    }

    // Player 2 controls (Arrow keys)
    switch (event.key) { // Checks which key was pressed for Player 2
        case 'ArrowUp': // If 'Arrow Up' is pressed
            player2.y -= player2.speed; // Moves Player 2 up
            break; // Exits the switch statement
        case 'ArrowDown': // If 'Arrow Down' is pressed
            player2.y += player2.speed; // Moves Player 2 down
            break; // Exits the switch statement
        case 'ArrowLeft': // If 'Arrow Left' is pressed
            player2.x -= player2.speed; // Moves Player 2 left
            player2.direction = 'left'; // Updates Player 2's direction
            break; // Exits the switch statement
        case 'ArrowRight': // If 'Arrow Right' is pressed
            player2.x += player2.speed; // Moves Player 2 right
            player2.direction = 'right'; // Updates Player 2's direction
            break; // Exits the switch statement
    }
});

// Attack function (simple collision-based attack)
function attack(attacker, defender) {
    // Checks if the attacker is close enough to the defender to land a hit
    if (Math.abs(attacker.x - defender.x) < 60 && Math.abs(attacker.y - defender.y) < 60) {
        defender.health -= 10; // Reduces defender's health by 10 points if hit
        if (defender.health <= 0) { // Checks if defender's health has reached 0 or below
            document.getElementById('game-over').classList.remove('hidden'); // Displays the "Game Over" message
        }
    }
}

// Special function (I just copy-pasted the attack func. Should I just implement it to the attack func? - KyuByt)
function special(attacker, defender) {
    // Checks if the attacker is close enough to the defender to land a hit 
    if (Math.abs(attacker.x - defender.x) < 60 && Math.abs(attacker.y - defender.y) < 60) {
        defender.special += 10; // Charges defender's special by 10 points if hit
        attacker.special += 2; // Charges attacker's special by 2 points if attack connects
    }
}

//Crude Colission Detection (Try 3) (Still have to limit movement to canvas too - KyuByt)
function isColliding() {
    //Checks if a player is inside the other (Still have to make it the same for both players)
    if (Math.abs(player1.x - player2.x) < 50 && Math.abs(player1.y - player2.y) < 50) {
        //If the difference between the xpos of both players is negative (P1 is colliding w/ P2 from the left)
        if(player1.x - player2.x <= 0) { 
            player1.x = player2.x - player1.width - 1; //Make P1.x equal P2.x minus P1.width minus 1 to prevent staying inside
            console.log('colision Right');  //Log in console a right-side collision from P1
        }
        //If the difference between the xpos of both players is positive (P1 is colliding w/ P2 from the right)
        if(player1.x - player2.x >= 0) {
            player1.x = player2.x + player1.width + 1; //Make P1.x equal P2.x plus P1.width plus 1 to prevent staying inside
            console.log('colision Left'); //Log in console a left-side collision from P1
        }
        //If the difference between the ypos of both players is negative (P1 is colliding w/ P2 from the bottom)
    }
}

// Handle attacks
document.addEventListener('keydown', (event) => { // Listens for keyboard input for attacks
    if (event.key === ' ') { // If Spacebar is pressed
        attack(player1, player2); // Player 1 attacks Player 2
        special(player1, player2); // (I can't code for my life but i can halfway read it - KyuByt)
    }
    if (event.key === 'Enter') { // If Enter key is pressed
        attack(player2, player1); // Player 2 attacks Player 1
        special(player2, player1); // (or stress test the game- KyuByt)
    }
});

// Update game state
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clears the canvas for redrawing
    drawCharacters(); // Redraws both characters in their new positions
    
    // Update health bars
    document.getElementById('player1-health').style.width = `${player1.health}%`; // Updates Player 1's health bar width
    document.getElementById('player1-health').textContent = `${player1.health}%`; // Updates Player 1's health bar text
    
    document.getElementById('player2-health').style.width = `${player2.health}%`; // Updates Player 2's health bar width
    document.getElementById('player2-health').textContent = `${player2.health}%`; // Updates Player 2's health bar text

    // Update special bars (Copy-Paste you already know it - KyuByt)
    document.getElementById('player1-special').style.width = `${player1.special}%`; // Updates Player 1's special bar width
    document.getElementById('player1-special').textContent = `${player1.special}%`; // Updates Player 1's special bar text
    
    document.getElementById('player2-special').style.width = `${player2.special}%`; // Updates Player 2's special bar width
    document.getElementById('player2-special').textContent = `${player2.special}%`; // Updates Player 2's special bar text

}

// Game loop
function gameLoop() {
    update(); // Calls the update function to refresh the game state
    isColliding();
    requestAnimationFrame(gameLoop); // Continuously loops the game by calling itself
}

// Start the game
gameLoop(); // Initiates the game loop to start the game