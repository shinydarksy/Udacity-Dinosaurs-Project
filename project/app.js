import Dinosaur from "./Dinosaur.js";
const dinoData = await fetch('/dino.json');
const dinoJSON = await dinoData.json();
const ALL_DINOSAURS = dinoJSON;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}
  

function getDinosaurs(dinosData, humanData) {
    let dinosaurs = dinosData["Dinos"].map(
        (dinoData) => new Dinosaur(dinoData, humanData)
    );
    return dinosaurs;
}

function getHumanData() {
    const inputs = document.querySelectorAll("input");
    const diet = document.querySelector("select");

    const name = inputs[0].value;
    const feet = Number(inputs[1].value);
    const inches = Number(inputs[2].value);
    const weight = Number(inputs[3].value);

    return {
        name,
        feet,
        inches,
        weight,
        diet: diet.value,
    };
}

function hideForm() {
    const form = document.getElementById("dino-compare");
    form.classList.add("hidden");
  }

function getRandomFact(tileData) {
    if (tileData.species === "human") return;
    if (tileData.species === "Pigeon") return tileData.fact;

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

    return facts[Math.floor(Math.random() * facts.length)];
}

function displayGrid(dinos, human) {
    const grid = document.querySelector("#grid");
    dinos = shuffle(dinos)
    const tileData = dinos.slice(0, 4).concat([human], dinos.slice(4));
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
  
    grid.innerHTML = tiles.join("");
  }

  function clearForm() {
    const fields = document.querySelectorAll("input");
    fields.forEach((field) => {
      field.value = "";
      field.classList.remove("is-invalid");
    });
  
    const validation = document.querySelector(".validation");
    validation.innerHTML = "";
  
    const validationSpecific = document.querySelector(".validation-specific");
    validationSpecific.innerHTML = "";
  }

function displayRefreshBtn() {
    const form = document.querySelector("#dino-compare");
    const refreshBtn = document.createElement("div");
    refreshBtn.innerHTML = `<h1>Retry</h1>`;
    refreshBtn.classList.add("Retry");
    refreshBtn.classList.add("btn");
    document.querySelector("#retry").prepend(refreshBtn);

    refreshBtn.addEventListener("click", () => {
        grid.innerHTML = "";
        refreshBtn.innerHTML = "";
        form.classList.remove("hidden");
    });
}

function validateFormData(human) {
    const { name, feet, inches, weight } = human;
    const errors = [];

    if (!name) {
        errors.push("Please enter your name, human.");
    } else if (name.length < 3) {
        errors.push("Your name must be at least 3 characters long.");
    }

    if (feet < 1) {
        errors.push("Feet must be a number greater than 0.");
    }

    if (inches < 1) {
        errors.push("Inches must be a number greater than 0.");
    }


    if (weight < 1) {
        errors.push("Weight must be a number greater than 0.");
    }

    const isComplete = errors.length === 0;

    const errorField = document.querySelector(".validation-specific");
    errorField.innerHTML = errors.join("<br/>");

    const modal = document.querySelector(".modal");
    if (!isComplete) {
        modal.style.display = "block";
    }

    return isComplete;
}


const dinoCompare = () => {
    const container = document.querySelector(".validation");
    const compareBtn = document.querySelector("#btn");
    const modal = document.querySelector(".modal");

    clearForm();

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    compareBtn.addEventListener("click", () => {
        const humanData = getHumanData();
        if (validateFormData(humanData)) {
            const dinoArray = getDinosaurs(ALL_DINOSAURS, humanData);
            hideForm();
            displayGrid(dinoArray, humanData);
            displayRefreshBtn();
            clearForm();
        } else {
            container.innerHTML = `<span class="error">Please complete all fields</span>`;
        }
    });
};

dinoCompare();