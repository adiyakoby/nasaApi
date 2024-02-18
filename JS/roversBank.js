


const roversBank = (function () {

    //Array for rovers
    const roversArray = []

    const registerRovers = function (res) {
        res["rovers"].forEach(rover => roversArray.push(rover));
    };

    const getRovers = () => {
        return [...roversArray];
    }

    return {
        registerRovers: registerRovers,
        getRovers: getRovers,
    }
})();