"use strict";

/**
 * The `apiManager` module responsible for interacting with the NASA API and initializing the form.
 * It encapsulates API-related functionalities and error handling.
 * @module apiManager
 */
const apiManager = (function () {

    // NASA API key and URL
    const API_KEY = "ACsJrPYqG2NleSki1rWH1DjyKtqkxd7prMqy68D5"
    const NASA_URL = "https://api.nasa.gov/mars-photos/api/v1/rovers"

    // Constants for error handling
    const Error = "Error!"
    const ErrorMessage = "Error fetching data:"


    /**
     * Asynchronous function to fetch data from the provided URL and handle errors.
     *
     * @param {string} url - The URL to fetch data from.
     * @returns {Promise<object>} - A promise that resolves to the fetched JSON data.
     */
    const fetchData = async (url) => {
        try {
            const response = await fetch(url);
            await validation.statusCheck(response);
            return response.json();
        } catch (e) {
            console.log(ErrorMessage, e);
            htmlManager.showToast(Error, e.message);
        }
    };

    /**
     * Asynchronous function to initialize the form by fetching rover information from NASA API.
     * Registers the rovers in the `roversBank` and updates the HTML manager.
     */
    const initForm = async () => {
        try {
            const url = `${NASA_URL}?api_key=${API_KEY}`;
            const data = await fetchData(url);
            if (data) {
                roversBank.registerRovers(data);
                htmlManager.addRovers(roversBank.getRovers());

            }
        }
        catch (e) {
            console.log(ErrorMessage, e);
            htmlManager.showToast(Error, e.message);
        }
    };

    /**
     * Asynchronous function to fetch images from NASA API based on user input.
     *
     * @param {object} obj - An object containing user input (roverName, dateFormat, camera, earth_date, sol.).
     * @returns {Promise<object>} - A promise that resolves to the fetched image data.
     */
    const fetchImages = async (obj) => {
        try {
            const url = `${NASA_URL}/${obj.roverName}/photos?api_key=${API_KEY}&${obj.dateFormat}=${obj[obj.dateFormat]}&camera=${obj.camera}&page=1`;
            const data = await fetchData(url);
            return Promise.resolve(data);
        } catch (e) {
            console.log(ErrorMessage, e);
            htmlManager.showToast(Error, e.message);
        }

    };

    // Expose the public API for the `apiManager` module
    return {
        init: initForm,
        fetchImages: fetchImages,

    };

})();