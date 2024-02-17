"use strict";

const apiManager = (function () {
    const API_KEY = "odfqlILFpvxzdXhFGjK8AIKyQlLpO22hM259pvrs" // odfqlILFpvxzdXhFGjK8AIKyQlLpO22hM259pvrs - KASHI  // - ACsJrPYqG2NleSki1rWH1DjyKtqkxd7prMqy68D5  - MY
    const NASA_URL = "https://api.nasa.gov/mars-photos/api/v1/rovers"

    const fetchData = async (url) => {
        try {
            const response = await fetch(url);
            validation.statusCheck(response);
            return response.json();
        } catch (error) {
            console.log("Error fetching data:", error);
        }
    };

    const initForm = async () => {
        const url = `${NASA_URL}?api_key=${API_KEY}`;
        const data = await fetchData(url);
        if (data) htmlManager.registerRovers(data);
    };

    const fetchImages = async (obj) => {
        const url = `${NASA_URL}/${obj.roverName}/photos?api_key=${API_KEY}&${obj.dateFormat}=
                                                                           ${obj[obj.dateFormat]}&camera=${obj.camera}`;
        const data = await fetchData(url);
        if (data) console.log(data);
    };



    return {
        init: initForm,
        fetchImages: fetchImages,

    }

})();