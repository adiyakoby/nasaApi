"use strict";

const imagesBank = (function () {
    const imagesArray = []

    //default string
    const toastSavedMessage = 'image saved into your preferred list.';
    const toastNotSavedMessage = 'image was saved into your preferred list already, no duplicates allowed..'

    const saveImage = function (newImage) {
        let header = ''
        let msg = ''

        if(imagesArray.every(img => img !== newImage)){
            imagesArray.push(newImage);
            htmlManager.addImage(newImage);
            header = "Saved";
            msg = toastSavedMessage;

        } else {
            header = "Not saved";
            msg = toastNotSavedMessage;
        }

        htmlManager.showToast(header, msg);
    };

    const getImages = () => { return [...imagesArray]; };


    return {
        saveImage : saveImage,
        getImages : getImages,

        };


})();
