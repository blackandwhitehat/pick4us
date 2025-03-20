let numPlayers = 0;
let numOptions = 0;
let options = [];
let currentMode = "";
let currentPlayer = 0;
let previousPlayer = -1;
let playerOptions = [];
let playerNames = [];
let playerOrder = [];
let pickingItem = "";
let currentTheme = "default";  // Track the selected theme

const animations = ["fade-out", "rotate-out", "zoom-out", "slide-up"];

function startGame() {
    console.log("Starting game...");
    numPlayers = parseInt(document.getElementById("numPlayers").value);
    numOptions = parseInt(document.getElementById("numOptions").value);
    pickingItem = document.getElementById("pickingItem").value || "item";

    if (numPlayers < 2) {
        alert("This is a group consensus tool");
        return;
    }
    if (isNaN(numPlayers) || isNaN(numOptions) || numPlayers < 1 || numOptions < 1) {
        alert("Please enter valid numbers for participants and options.");
        return;
    }

    document.getElementById("intro-description").style.display = "none";
    document.getElementById("game-setup").style.display = "none";
    document.getElementById("player-setup").style.display = "block";
    document.getElementById("pickingItemDisplay").innerText = pickingItem;
    document.getElementById("pickingItemDisplayGameplay").innerText = pickingItem;

    setupPlayerNames();
    applyButtonStyles(currentTheme);  // Ensure correct button styles
}

function setupPlayerNames() {
    const playerNamesInput = document.getElementById("playerNamesInput");
    playerNamesInput.innerHTML = "";

    for (let i = 0; i < numPlayers; i++) {
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = `Participant ${i + 1} Name (optional)`;
        input.dataset.index = i;
        playerNamesInput.appendChild(input);
        playerNamesInput.appendChild(document.createElement("br"));
    }
    applyButtonStyles(currentTheme);  // Ensure correct button styles after setting up names
}

function setSelectionMode(mode) {
    console.log("Setting selection mode to:", mode);
    currentMode = mode;
    document.getElementById("selection-mode").style.display = "none";
    currentPlayer = 0;
    promptPlayerOptions();
    applyButtonStyles(currentTheme);
}

function submitPlayerNames() {
    console.log("Submitting player names...");
    playerNames = Array.from(document.querySelectorAll("#playerNamesInput input")).map(
        (input, index) => input.value.trim() || `Participant ${index + 1}`
    );

    document.getElementById("player-setup").style.display = "none";
    document.getElementById("selection-mode").style.display = "block";
    applyButtonStyles(currentTheme);
}

function promptPlayerOptions() {
    console.log("Prompting player options...");
    document.getElementById("player-prompt").style.display = "block";
    document.getElementById("currentPlayerName").innerText = playerNames[currentPlayer];

    const optionsInput = document.getElementById("optionsInput");
    optionsInput.innerHTML = "";

    const numOptionsToEnter = currentPlayer === numPlayers - 1 ? numOptions + 1 : numOptions;
    document.getElementById("additionalOptionText").style.display = currentPlayer === numPlayers - 1 ? "block" : "none";

    for (let i = 0; i < numOptionsToEnter; i++) {
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = `Option ${i + 1}`;
        optionsInput.appendChild(input);
        optionsInput.appendChild(document.createElement("br"));
    }
    applyButtonStyles(currentTheme);  // Ensure button styles are applied after setting up options input
}

function submitPlayerOptions() {
    console.log("Submitting player options...");
    const inputs = document.getElementById("optionsInput").getElementsByTagName("input");
    const playerOptionsList = Array.from(inputs).map(input => input.value.trim()).filter(option => option !== "");

    const numOptionsToEnter = currentPlayer === numPlayers - 1 ? numOptions + 1 : numOptions;
    if (playerOptionsList.length < numOptionsToEnter) {
        alert("Please fill in all options.");
        return;
    }

    // Check for duplicate options within the player's entries
    const duplicatePlayerOption = playerOptionsList.find((option, index) => 
        playerOptionsList.indexOf(option) !== index
    );
    if (duplicatePlayerOption) {
        alert(`You have entered the option "${duplicatePlayerOption}" multiple times. Please enter unique options.`);
        return;
    }

    // Check for duplicate options with other players' entries
    const duplicateOption = playerOptionsList.find(option => options.includes(option));
    if (duplicateOption) {
        alert(`The option "${duplicateOption}" has already been entered by another participant. Please enter unique options.`);
        return;
    }

    options.push(...playerOptionsList);
    currentPlayer++;

    if (currentPlayer < numPlayers) {
        promptPlayerOptions();
    } else {
        document.getElementById("player-prompt").style.display = "none";
        document.getElementById("gameplay").style.display = "block";
        playerOrder = [...Array(numPlayers).keys()];
        displayOptions();

        currentPlayer = 0;
        promptNextTurn();
    }
}


function displayOptions() {
    console.log("Displaying options...");
    const optionsList = document.getElementById("optionsList");
    optionsList.innerHTML = options.map((option, index) => `<li onclick="selectOption(${index})">${option}</li>`).join("");
    applyButtonStyles(currentTheme);  // Ensure button styles after re-rendering options
}

function promptNextTurn() {
    if (options.length === 1) {
        endGame();
        return;
    }

    if (currentMode === "roundRobin") {
        currentPlayer = currentPlayer % numPlayers;
    } else if (currentMode === "random") {
        let newPlayer;
        do {
            newPlayer = Math.floor(Math.random() * numPlayers);
        } while (newPlayer === previousPlayer);
        currentPlayer = newPlayer;
        previousPlayer = currentPlayer;
    }

    document.getElementById("currentPlayerTurn").innerText = playerNames[currentPlayer];
    applyButtonStyles(currentTheme);  // Ensure button styles after updating current player's turn
}

function selectOption(index) {
    const optionElement = document.querySelector(`#optionsList li:nth-child(${index + 1})`);
    const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
    optionElement.classList.add(randomAnimation);
    
    setTimeout(() => {
        options.splice(index, 1);
        displayOptions();
        if (options.length > 1) {
            currentPlayer++;
            promptNextTurn();
        } else {
            endGame();
        }
    }, 500);
}

function endGame() {
    console.log("Game ended.");
    document.getElementById("gameplay").style.display = "none";
    document.getElementById("finalSelection").innerText = `Final Selection: ${options[0]}`;
    document.getElementById("finalSelection").style.display = "block";
    document.getElementById("shareButtons").style.display = "flex";
    document.getElementById("backButton").style.display = "block";
    applyButtonStyles(currentTheme);
}

function resetGame() {
    console.log("Resetting game...");
    document.getElementById("finalSelection").style.display = "none";
    document.getElementById("shareButtons").style.display = "none";
    document.getElementById("backButton").style.display = "none";
    document.getElementById("game-setup").style.display = "block";
    document.getElementById("selection-mode").style.display = "none";
    document.getElementById("player-setup").style.display = "none";
    document.getElementById("player-prompt").style.display = "none";
    document.getElementById("gameplay").style.display = "none";
    document.getElementById("intro-description").style.display = "block";
    options = [];
    currentPlayer = 0;
    previousPlayer = -1;
    applyButtonStyles(currentTheme);  // Ensure button styles after resetting game
}

function setTheme(theme) {
    console.log("Setting theme to:", theme);
    currentTheme = theme;  // Update the current theme variable
    const body = document.body;
    const container = document.querySelector(".container");
    const title = document.getElementById("title");
    const introText = document.getElementById("intro-description");
    const labels = document.querySelectorAll("label");

    // Additional elements to customize
    const specialTexts = [
        document.getElementById("currentPlayerName"),
        document.getElementById("mode-description"),
        document.getElementById("pickingItemDisplay"),
        document.getElementById("pickingItemDisplayGameplay"),
        document.getElementById("additionalOptionText"),
        document.getElementById("currentPlayerTurn"),
        document.querySelector("#player-setup h2"),  // Customize Participant Names header
        document.querySelector("#selection-mode h2"),  // Select Elimination Mode header
        document.querySelector("#player-prompt h3"),  // Enter Your Options prompt
        document.querySelector("#gameplay h3")  // Turn prompt in gameplay
    ];

    if (theme === "dark") {
        body.style.backgroundColor = "#1e1e1e";
        body.style.color = "#ffffff";
        container.style.backgroundColor = "#333";
        title.style.color = "#ffffff";
        introText.style.color = "#ffffff";
        labels.forEach(label => label.style.color = "#ffffff");
        specialTexts.forEach(textElement => {
            if (textElement) textElement.style.color = "#ffffff";
        });
    } else if (theme === "bright") {
        body.style.backgroundColor = "#fbe29f";
        body.style.color = "#333";
        container.style.backgroundColor = "#fdf5db";
        title.style.color = "#2c3e50";
        introText.style.color = "#333";
        labels.forEach(label => label.style.color = "#333");
        specialTexts.forEach(textElement => {
            if (textElement) textElement.style.color = "#333";
        });
    } else {
        body.style.backgroundColor = "#f4f7fa";
        body.style.color = "#333";
        container.style.backgroundColor = "#fff";
        title.style.color = "#2c3e50";
        introText.style.color = "#555";
        labels.forEach(label => label.style.color = "#333");
        specialTexts.forEach(textElement => {
            if (textElement) textElement.style.color = "#333";
        });
    }
    applyButtonStyles(theme);
    setSessionCookie("selectedTheme", theme, 1);
}

// Apply button styles based on theme
function applyButtonStyles(theme = currentTheme) {
    console.log("Applying button styles for theme:", theme);
    const buttons = document.querySelectorAll("button, .share-buttons button, #optionsList li");
    buttons.forEach(button => {
        if (theme === "dark") {
            button.style.backgroundColor = "#444";
            button.style.color = "#ffffff";
        } else if (theme === "bright") {
            button.style.backgroundColor = "#ffffff";
            button.style.color = "#333";
            button.style.border = "1px solid #333";
        } else {
            button.style.backgroundColor = "#3498db";
            button.style.color = "#ffffff";
            button.style.border = "none";
        }
    });
}

// Cookie functions
function setSessionCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getSessionCookie(name) {
    const nameEQ = name + "=";
    const cookiesArray = document.cookie.split(';');
    for (let i = 0; i < cookiesArray.length; i++) {
        let cookie = cookiesArray[i];
        while (cookie.charAt(0) === ' ') cookie = cookie.substring(1, cookie.length);
        if (cookie.indexOf(nameEQ) === 0) return cookie.substring(nameEQ.length, cookie.length);
    }
    return null;
}

// Load theme on page load
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = getSessionCookie("selectedTheme") || "default";
    setTheme(savedTheme);
    applyButtonStyles(savedTheme);  // Apply button styles immediately on load
    console.log("Initial theme set to:", savedTheme);
});

// Social media sharing functions
function shareOnFacebook() {
    const url = `https://www.facebook.com/sharer/sharer.php?u=https://pick4.us&quote=We decided on ${options[0]}! Thanks to Pick4.us!`;
    window.open(url, "_blank");
}

function shareOnX() {
    const url = `https://x.com/intent/tweet?text=We decided on ${options[0]}! Thanks to Pick4.us!&url=https://pick4.us`;
    window.open(url, "_blank");
}
