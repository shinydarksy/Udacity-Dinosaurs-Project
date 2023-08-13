import Dinosaur from "./Dinosaur.js";
const dinoData = await fetch("/dino.json"); 
const dinoJSON = await dinoData.json();
const ALL_DINOSAURS = dinoJSON;

/**
* @description This function shuffles the elements of an array in place.
* @param {array} array - The array to shuffle.
* @returns {array} The shuffled array.
*/
function shuffle(array) {
    // This function shuffles the elements of an array in place.

    // Iterate over the array from the end to the beginning.
    for (let i = array.length - 1; i > 0; i--) {
        // Get a random index from 0 to i.
        const j = Math.floor(Math.random() * (i + 1));
        // Swap the elements at indices i and j.
        [array[i], array[j]] = [array[j], array[i]];
    }

    // Return the shuffled array.
    return array;
}

/**
* @description This function gets the dinosaurs from the dinosData object and creates Dinosaur objects for each one.
* @param {object} dinosData - An object that contains an array of dinosaur data.
* @param {object} humanData - An object that contains the user's data.
* @returns {array} The array of Dinosaur objects.
*/
function getDinosaurs(dinosData, humanData) {
    // Get the dinosaurs array from the dinosData object.
    let dinosaurs = dinosData["Dinos"];

    // Create a new Dinosaur object for each dinosaur in the dinosaurs array.
    dinosaurs = dinosaurs.map((dinoData) => new Dinosaur(dinoData, humanData));

    // Return the array of Dinosaur objects.
    return dinosaurs;
}

/**
* @description This function gets the human data from the user input and creates a human object.
* @returns {object} The human object.
*/
function getHumanData() {
    // This function gets the human data from the user input.

    // Get the input elements from the document.
    const inputs = document.querySelectorAll("input");
    const diet = document.querySelector("select");

    // Get the user's name, height, weight, and diet.
    const name = inputs[0].value;
    const feet = Number(inputs[1].value);
    const inches = Number(inputs[2].value);
    const weight = Number(inputs[3].value);

    // Create a human data object.
    const humanData = {
        name,
        feet,
        inches,
        weight,
        diet: diet.value,
    };

    // Return the human data object.
    return humanData;
}

/**
* @description This function hides the form element with the id 'dino-compare'.
* @returns {void}
*/
function hideForm() {
    // This function hides the form element with the id 'dino-compare'.

    // Get the form element from the document.
    const form = document.getElementById("dino-compare");

    // Add the 'hidden' class to the form element.
    form.classList.add("hidden");
}

/**
* @description This function gets a random fact about the dinosaur.
* @param {object} tileData - The dinosaur data object.
* @returns {string} The random fact.
*/
function getRandomFact(tileData) {
    // This function gets a random fact about the dinosaur.

    // If the dinosaur is a human or a pigeon, return nothing.
    if (tileData.species === "human" || tileData.species === "Pigeon") {
        return;
    }

    // Create an array of facts about the dinosaur.
    const facts = [
        tileData.dietDescription,
        tileData.fact,
        `The ${tileData.species} was ${tileData.heightRatio} ${tileData.heightRatio > 1 ? "taller" : "shorter"
        } than you.`,
        `The ${tileData.species} was ${tileData.weightRatio} times ${tileData.weightRatio > 1 ? "taller" : "shorter"
        } than you.`,
        `The ${tileData.species} existed during the ${tileData.when} period.`,
        `The ${tileData.species} lived in ${tileData.where}.`,
    ];

    // Get a random fact from the array.
    const fact = facts[Math.floor(Math.random() * facts.length)];

    // Return the fact.
    return fact;
}

/**
* @description This function displays the grid of dinosaurs and the human.
* @param {array} dinos - The array of dinosaur data.
* @param {object} human - The human data object.
*/
function displayGrid(dinos, human) {
    // This function displays the grid of dinosaurs and the human.

    // Get the grid element from the document.
    const grid = document.querySelector("#grid");

    // Shuffle the dinosaurs array.
    dinos = shuffle(dinos);

    // Create an array of tile data.
    const tileData = dinos.slice(0, 4).concat([human], dinos.slice(4));

    // Create an array of HTML elements for the tiles.
    const tiles = tileData.map((tile) => {
        const fact = getRandomFact(tile);
        return `
        <div class="grid-item">
          <h3>${tile.species || tile.name}</h3>
          <img src="images/${tile.species || "human"}.png">
          <p>${fact ? fact : ""}</p>
        </div>
      `;
    });

    // Set the HTML of the grid element to the tiles.
    grid.innerHTML = tiles.join("");
}

/**
* @description This function clears the form and removes any validation errors.
*/
function clearForm() {
    // This function clears the form and removes any validation errors.

    // Get all of the input elements in the form.
    const fields = document.querySelectorAll("input");

    // Loop through the input elements and clear their values.
    fields.forEach((field) => {
        field.value = "";
        field.classList.remove("is-invalid");
    });

    // Clear the validation messages.
    const validation = document.querySelector(".validation");
    validation.innerHTML = "";

    const validationSpecific = document.querySelector(".validation-specific");
    validationSpecific.innerHTML = "";
}

/**
* @description This function displays the refresh button and clears the grid and form.
*/
function displayRefreshBtn() {
    // This function displays the refresh button.

    // Get the form element from the document.
    const form = document.querySelector("#dino-compare");

    // Create a new button element.
    const refreshBtn = document.createElement("div");
    refreshBtn.innerHTML = "<h1>Retry</h1>";
    refreshBtn.classList.add("Retry");
    refreshBtn.classList.add("btn");

    // Append the button element to the document.
    document.querySelector("#retry").prepend(refreshBtn);

    // Add an event listener to the button element.
    refreshBtn.addEventListener("click", () => {
        // Clear the button text.
        refreshBtn.innerHTML = "";
        grid.innerHTML = "";
        // Remove the hidden class from the form element.
        form.classList.remove("hidden");
    });
}

/**
* @description This function validates the form data entered by the user and displays any errors.
* @param {object} human - The human data object.
* @returns {boolean} Whether the form is complete.
*/
function validateFormData(human) {
    // This function validates the form data entered by the user.

    // Get the data from the human object.
    const { name, feet, inches, weight } = human;

    // Create an array of errors.
    const errors = [];

    // Check if the name is empty.
    if (!name) {
        errors.push("Please enter your name, human.");
    } else if (name.length < 3) {
        errors.push("Your name must be at least 3 characters long.");
    }

    // Check if the feet is less than 1.
    if (feet < 1) {
        errors.push("Feet must be a number greater than 0.");
    }

    // Check if the inches is less than 1.
    if (inches < 1) {
        errors.push("Inches must be a number greater than 0.");
    }

    // Check if the weight is less than 1.
    if (weight < 1) {
        errors.push("Weight must be a number greater than 0.");
    }

    // Check if there are any errors.
    const isComplete = errors.length === 0;

    // Set the HTML of the error field.
    const errorField = document.querySelector(".validation-specific");
    errorField.innerHTML = errors.join("<br/>");

    // Set the display of the modal.
    const modal = document.querySelector(".modal");
    if (!isComplete) {
        modal.style.display = "block";
    }

    // Return whether the form is complete.
    return isComplete;
}

/**
* @description This function handles the user interaction for comparing dinosaurs. 
*/
const dinoCompare = () => {
    // This function handles the user interaction for comparing dinosaurs.

    const container = document.querySelector(".validation"); // Get the validation container.
    const compareBtn = document.querySelector("#btn"); // Get the compare button.
    const modal = document.querySelector(".modal"); // Get the modal.

    clearForm(); // Clear the form.

    window.onclick = (event) => { // Hide the modal if the user clicks outside of it.
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    compareBtn.addEventListener("click", () => { // Handle the compare button click event.
        const humanData = getHumanData(); // Get the human data from the form.
        if (validateFormData(humanData)) { // Validate the human data.
            const dinoArray = getDinosaurs(ALL_DINOSAURS, humanData); // Get the dinosaur array.
            hideForm(); // Hide the form.
            displayGrid(dinoArray, humanData); // Display the grid.
            displayRefreshBtn(); // Display the refresh button.
            clearForm(); // Clear the form.
        } else { // If the human data is invalid, display an error message.
            container.innerHTML = "<span class='error'>Please complete all fields</span>";
        }
    });
};

dinoCompare();