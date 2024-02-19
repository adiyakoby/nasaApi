"use strict";

/**
 * Manages the registration and retrieval of NASA images.
 * @module imagesBank
 */
const imagesBank = (function () {

    /**
     * Represents a NASA image.
     * @class
     * @name nasaImage
     * @private
     */
    class nasaImage {
        #id;
        #src;
        #sol;
        #earth_date;
        #camera;
        #mission;

        /**
         * Creates a new instance of the nasaImage class.
         * @constructor
         * @param {number} id - The unique identifier for the image.
         * @param {string} src - The source URL of the image.
         * @param {number} sol - The Martian sol associated with the image.
         * @param {string} earth_date - The Earth date associated with the image.
         * @param {string} camera - The camera used to capture the image.
         * @param {string} rover - The rover associated with the image.
         */
        constructor(id, src, sol, earth_date, camera, rover) {
            this.#id = id;
            this.#src = src;
            this.#sol = sol;
            this.#earth_date = earth_date;
            this.#camera = camera
            this.#mission = rover;

        }

        /**
         * Gets the unique identifier of the image.
         * @type {number}
         */
        get id() {return this.#id};

        /**
         * Gets the source URL of the image.
         * @type {string}
         */
        get src() {return this.#src};

        /**
         * Gets the Martian sol associated with the image.
         * @type {number}
         */
        get sol() {return this.#sol};

        /**
         * Gets the Earth date associated with the image.
         * @type {string}
         */
        get earth_date() {return this.#earth_date};

        /**
         * Gets the camera used to capture the image.
         * @type {string}
         */
        get camera() {return this.#camera};

        /**
         * Gets the rover associated with the image.
         * @type {string}
         */
        get mission() {return this.#mission};
    }


    const imagesArray = []
    const savedImagesArray = []

    //default string
    const toastSavedMessage = 'image saved into your preferred list.';
    const toastNotSavedMessage = 'image was saved into your preferred list already, no duplicates allowed..'

    /**
     * Registers images by adding them to the internal imagesArray.
     * @param {Object} res - The response object containing image information.
     * @returns {boolean} - True if images were registered successfully, false otherwise.
     * @function
     */
    const registerImages = function (res) {
        imagesArray.length = 0; //reset the array between new requests

        let length = res["photos"].length
        if(res && length > 0) {
            let limit = (length > 50 ? 50 : length);
            res["photos"].slice(0, limit).forEach(photo => {
                imagesArray.push(new nasaImage(
                    parseInt(photo.id),
                    photo.img_src,
                    photo.sol,
                    photo.earth_date,
                    photo.camera.name,
                    photo.rover.name
                ));
            });
            return true;
        }
        return false;
    };


    /**
     * Saves a selected image to the list of saved images.
     * @param {HTMLElement} imgButton - The selected image element to save. *(save button element)*
     * @returns {void}
     * @function
     */
    const saveImage = function (imgButton) {

        const newImage = imagesArray.find(image=> image.id===parseInt(imgButton.dataset.imgId));
        let header = '';
        let msg = '';

        if(savedImagesArray.every(img => img !== newImage)){
            savedImagesArray.push(newImage);
            header = "Saved";
            msg = toastSavedMessage;

        } else {
            header = "Not saved";
            msg = toastNotSavedMessage;
        }
        htmlManager.showToast(header, msg);
    };

    /**
     * Erases a saved image from the list of saved images.
     * @param {HTMLElement} imgButton - The image element to erase. *(delete button element)*
     * @returns {void}
     * @function
     */
    const eraseImage = function (imgButton) {

        const indexToDel = savedImagesArray.findIndex(function (image) {
            return image.id === parseInt(imgButton.dataset.imgId);
        });

        if(indexToDel !== -1) {
            savedImagesArray.splice(indexToDel, 1);
            htmlManager.renderSavedImages();
        }
    };

    /**
     * Retrieves a copy of the array containing registered images.
     * @returns {Array<nasaImage>} - A copy of the array containing registered images.
     * @function
     */
    const getImages = () => {return [...imagesArray]};

    /**
     * Retrieves a copy of the array containing saved images.
     * @returns {Array<nasaImage>} - A copy of the array containing saved images.
     * @function
     */
    const getSavedImages = () => {return [...savedImagesArray]};


    return {
        registerImages: registerImages,
        saveImage : saveImage,
        getImages: getImages,
        getSavedImages : getSavedImages,
        eraseImage : eraseImage,

        };

})();
