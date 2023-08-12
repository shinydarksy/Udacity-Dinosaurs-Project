class Dinosaur {
    constructor(dinoObj, humanData) {
        const { species, weight, height, diet, where, when, fact } = dinoObj;
        this.species = species;
        this.height = Number(height);
        this.weight = Number(weight);
        this.diet = diet;
        this.where = where;
        this.when = when;
        this.fact = fact;

        const compareData = this.compare(humanData);
        this.heightRatio = compareData.heightRatio;
        this.weightRatio = compareData.weightRatio;
        this.dietDescription = compareData.dietDescription;
    }

    compare(humanData) {
        const { feet, inches } = humanData;
        const humanHeightIn = feet * 12 + inches;
        const weightRatio = this.weight / humanData.weight;
        const dietDescription =
            humanData.diet.toLowerCase() === this.diet
                ? `You are both ${humanData.diet}s, pretty cool!`
                : `You're a ${humanData.diet} but the ${this.species} was a ${this.diet}.`;
        return { heightRatio: this.height / humanHeightIn, weightRatio, dietDescription };
    }
}


export default Dinosaur