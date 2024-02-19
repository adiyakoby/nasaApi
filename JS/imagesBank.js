"use strict";


const imagesBank = (function () {

    class nasaImage {
        #id;
        #src;
        #sol;
        #earth_date;
        #camera;
        #mission;

        constructor(id, src, sol, earth_date, camera, rover) {
            this.#id = id;
            this.#src = src;
            this.#sol = sol;
            this.#earth_date = earth_date;
            this.#camera = camera
            this.#mission = rover;

        }
        get id() {return this.#id};
        get src() {return this.#src};
        get sol() {return this.#sol};
        get earth_date() {return this.#earth_date};
        get camera() {return this.#camera};
        get mission() {return this.#mission};
    }


    const imagesArray = []
    const savedImagesArray = []

    //default string
    const toastSavedMessage = 'image saved into your preferred list.';
    const toastNotSavedMessage = 'image was saved into your preferred list already, no duplicates allowed..'


    const registerImages = function (res) {
        imagesArray.length = 0; //reset the array between new requests

        let length = res["photos"].length
        if(res && length > 0) {
            let limit = (length > 50 ? 50 : length);
            res["photos"].slice(0, limit).forEach(photo => {
                imagesArray.push(new nasaImage(parseInt(photo.id), photo.img_src, photo.sol,  photo.earth_date,
                                                                                photo.camera.name, photo.rover.name));
            });
            return true;
        }
        return false;
    };

    const saveImage = function (newImageSrc) {

        const newImage = imagesArray.find(img=> img.src===newImageSrc);
        let header = ''
        let msg = ''

        if(savedImagesArray.every(img => img !== newImage)){
            savedImagesArray.push(newImage);
            //htmlManager.addImage(newImage);
            header = "Saved";
            msg = toastSavedMessage;

        } else {
            header = "Not saved";
            msg = toastNotSavedMessage;
        }
        htmlManager.showToast(header, msg);
    };

    const eraseImage = function (img) {

        const indexToDel = savedImagesArray.findIndex(function (image) {
            return image.id === parseInt(img.dataset.imgId) && image.src === img.dataset.imgSrc;
        });

        if(indexToDel !== -1) {
            savedImagesArray.splice(indexToDel, 1);
            htmlManager.renderSavedImages();
        }
    };

    const getImages = () => {return [...imagesArray]};

    const getSavedImages = () => {return [...savedImagesArray]};


    return {
        registerImages: registerImages,
        saveImage : saveImage,
        getImages: getImages,
        getSavedImages : getSavedImages,
        eraseImage : eraseImage,

        };

})();
