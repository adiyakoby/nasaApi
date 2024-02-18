"use strict";

(function () {
    const roversArray = [];
    document.addEventListener('DOMContentLoaded', function () {

        //Dom content and buttons
        //nav buttons
        const HomeButton = document.getElementById("home-button");
        const SavedImagesButton = document.getElementById("saved-images-button");


        //form content
        const dateFormat = document.getElementById("date-format");
        const DateSelection = document.getElementById("earthDate");
        const SolSelection = document.getElementById("solDate");

        const SearchButton = document.getElementById("search-Button");
        const ClearButton = document.getElementById("clear-Button");
        const roverSelection = document.getElementById("rover-select");
        const cameraSelection = document.getElementById("camera-select");


        apiManager.init();  // fetch the rover once from the server.

        // Event listeners
        dateFormat.addEventListener("change", function () {
            htmlManager.updateDateFormat();
        });


        roverSelection.addEventListener("change", function () {
            htmlManager.addCameras();
            htmlManager.updateDates();
        });

        SearchButton.addEventListener("click" , function () {

            htmlManager.getImages();
        });

        ClearButton.addEventListener("click", function () {
            htmlManager.clearForm();
        });

        HomeButton.addEventListener("click", function () {
            htmlManager.showHome();
            htmlManager.addImagesToCarousel();
        });

        SavedImagesButton.addEventListener("click", function () {
            htmlManager.renderSavedImages()
            htmlManager.showSavedImagesPage();
        });




    });


})();