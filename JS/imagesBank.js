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

    //Home Page and Saved Images Page containers.
    const homeImagesMap = new Map()
    const savedImagesMap = new Map()

    //const Sizes
    const MaxSavedImages = 50;

    //default string
    const toastSavedHeader = "Saved";
    const toastNotSavedHeader = "Not saved";
    const toastMaxCapacityHeader = "Max capacity reached!";
    const toastSavedMessage = 'image saved into your preferred list.';
    const toastNotSavedMessage = 'image was saved into your preferred list already, no duplicates allowed..';
    const toastMaxCapacityMessage = `cannot save more than ${MaxSavedImages} images, please delete images before saving.`;

    /**
     * Registers images by adding them to the internal homeImagesMap.
     * @param {Object} res - The response object containing image information.
     * @returns {boolean} - True if images were registered successfully, false otherwise.
     * @function
     */
    const registerImages = function (res) {
        homeImagesMap.clear(); //reset the map between new requests
        let length = res["photos"].length

        if(res && length > 0) {
            res["photos"].forEach( photo => {
                homeImagesMap.set(parseInt(photo.id), new nasaImage(
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
     * Saves a selected image to the map of saved images.
     * @param {HTMLElement} imgButton - The selected image element to save. *(save button element)*
     * @returns {void}
     * @function
     */
    const saveImage = function (imgButton) {
        const imgId = parseInt(imgButton.dataset.imgId);

        let header = '';
        let msg = '';

        if(!savedImagesMap.has(imgId) && savedImagesMap.size < MaxSavedImages){
            savedImagesMap.set(imgId, homeImagesMap.get(imgId));
            header = toastSavedHeader;
            msg = toastSavedMessage;
        } else{
            header = savedImagesMap.has(imgId) ? toastNotSavedHeader : toastMaxCapacityHeader ;
            msg = savedImagesMap.has(imgId) ? toastNotSavedMessage : toastMaxCapacityMessage  ;
        }
        htmlManager.showToast(header, msg);

    };

    /**
     * Erases a saved image from the map of saved images.
     * @param {HTMLElement} imgButton - The image element to erase. *(delete button element)*
     * @returns {void}
     * @function
     */
    const eraseImage = function (imgButton) {

        const imgId = parseInt(imgButton.dataset.imgId);

        if(savedImagesMap.has(imgId)) {
            savedImagesMap.delete(imgId);
            htmlManager.renderSavedImages();
        }
    };

    /**
     * Retrieves a copy of the array containing registered images.
     * @returns {Array<nasaImage>} - A copy of the array containing registered images.
     * @function
     */
    const getImages = () => {return Array.from(homeImagesMap.values())};

    /**
     * Retrieves a copy of the array containing saved images.
     * @returns {Array<nasaImage>} - A copy of the array containing saved images.
     * @function
     */
    const getSavedImages = () => {return Array.from(savedImagesMap.values())};


    return {
        registerImages: registerImages,
        saveImage : saveImage,
        getImages: getImages,
        getSavedImages : getSavedImages,
        eraseImage : eraseImage,

        };

})();
