"use strict";

const apiManager = (function () {
    const API_KEY = "ACsJrPYqG2NleSki1rWH1DjyKtqkxd7prMqy68D5"
    const NASA_URL = "https://api.nasa.gov/mars-photos/api/v1/rovers"

    const initForm = function(){

        fetch(`${NASA_URL}?api_key=${API_KEY}`)
            .then(validation.statusCheck)
            .then(res => res.json())
            .then(htmlManager.registerRovers)
            .catch(error => console.log("Error fetching data:", error))
    };

    const fetchImages = function () {

    };


    return {
        init: initForm,
        fetchImages: fetchImages,

    }

})();