"use strict";

/**
 * @description Manages the registration and retrieval of rover data.
 * @module roversBank
 */
const roversBank = (function () {

    //Array for rovers
    const roversArray = []

    /**
     * Registers rovers by adding them to the internal roversArray.
     * @param {Object} res - The response object containing rover information.
     * @function
     */
    const registerRovers = function (res) {
        res["rovers"].forEach(rover => roversArray.push(rover));
    };


    /**
     * Retrieves a copy of the array containing registered rovers.
     * @returns {Array<roversArray>} - A copy of the array containing registered rovers.
     * @function
     */
    const getRovers = () => {
        return [...roversArray];
    }

    return {
        registerRovers: registerRovers,
        getRovers: getRovers,
    }
})();