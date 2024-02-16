"use strict";

(function () {
    const roversArray = [];
    document.addEventListener('DOMContentLoaded', function () {

        //Dom content and buttons
        //nav buttons
        const HomeButton = document.getElementById("home-page");
        const SavedImagesButton = document.getElementById("saved-images");


        //form content
        const dateFormat = document.getElementById("ate-format");
        const DateSelection = document.getElementById("date-picker");

        const searchButton = document.getElementById("search-Button");
        const ClearButton = document.getElementById("clear-Button");
        const roverSelection = document.getElementById("rover-select");

        //images container
        const imagesContainer = document.getElementById("images-container");



        apiManager.init();

        // Event listeners
        dateFormat.addEventListener("change", function () {
            htmlManager.addDateFormat();
        });
        //
        // DateSelection.addEventListener("change", function () {
        //
        // });

        roverSelection.addEventListener("change", function () {
            htmlManager.addCameras(roverSelection.value);
        });

        // cameraSelection.addEventListener("click", function () {
        //
        // });
        //
        ClearButton.addEventListener("click", function () {
            htmlManager.clearForm();
        });




    });


})();