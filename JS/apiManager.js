"use strict";

const apiManager = (function () {
    const API_KEY = "ACsJrPYqG2NleSki1rWH1DjyKtqkxd7prMqy68D5"
    const NASA_URL = "https://api.nasa.gov/mars-photos/api/v1/rovers"

    //const vars and messages.
    const Error = "Error!"
    const ErrorMessage = "Error fetching data:"

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

    const fetchImages = async (obj) => {
        try {
            const url = `${NASA_URL}/${obj.roverName}/photos?api_key=${API_KEY}&${obj.dateFormat}=${obj[obj.dateFormat]}&camera=${obj.camera}`;
            const data = await fetchData(url);
            return Promise.resolve(data);
        } catch (e) {
            console.log(ErrorMessage, e);
            htmlManager.showToast(Error, e.message);
        }

    };



    return {
        init: initForm,
        fetchImages: fetchImages,

    }

})();