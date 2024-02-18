"use strict";

const apiManager = (function () {
    const API_KEY = "odfqlILFpvxzdXhFGjK8AIKyQlLpO22hM259pvrs" // KASHI
    //const API_KEY = "ACsJrPYqG2NleSki1rWH1DjyKtqkxd7prMqy68D5" // MY
    const NASA_URL = "https://api.nasa.gov/mars-photos/api/v1/rovers" //https://api.nasa.gov/mars-photos/api/v1/rovers/spirit/photos?api_key=odfqlILFpvxzdXhFGjK8AIKyQlLpO22hM259pvrs&sol=3=

    const fetchData = async (url) => {
        try {
            const response = await fetch(url);
            await validation.statusCheck(response);
            return response.json();
        } catch (error) {
            console.log("Error fetching data:", error);
        }
    };

    const initForm = async () => {
        try {
            const url = `${NASA_URL}?api_key=${API_KEY}`;
            const data = await fetchData(url);
            if (data) htmlManager.registerRovers(data);
        }
        catch (e) {
            console.log("Error fetching data:", e);
        }
    };

    const fetchImages = async (obj) => {
        try {
            const url = `${NASA_URL}/${obj.roverName}/photos?api_key=${API_KEY}&${obj.dateFormat}=${obj[obj.dateFormat]}&camera=${obj.camera}`;
            const data = await fetchData(url);
            return Promise.resolve(data);
        } catch (e) {
            console.log("Error fetching data:", e);
        }

    };



    return {
        init: initForm,
        fetchImages: fetchImages,

    }

})();