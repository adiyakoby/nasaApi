"use strict";

(function () {
    const roversArray = [];
    document.addEventListener('DOMContentLoaded', function () {

        //Dom content and buttons
        //nav buttons
        const HomeButton = document.getElementById("home-button");
        const SavedImagesButton = document.getElementById("saved-images-button");

        //saved images buttons
        const startCarousel = document.getElementById("start-carousel-btn");
        const stopCarousel = document.getElementById("stop-carousel-btn");
        const backToSearch = document.getElementById("back-to-search-btn");


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

        });

        SavedImagesButton.addEventListener("click", function () {
            htmlManager.renderSavedImages()
            htmlManager.addImagesToCarousel();
            htmlManager.showSavedImagesPage();
        });


        startCarousel.addEventListener("click", function () {
            htmlManager.startCarousel();

        });

        stopCarousel.addEventListener("click", function () {
            htmlManager.stopCarousel();

        });

        backToSearch.addEventListener("click", function () {
            htmlManager.showHome();
            htmlManager.stopCarousel();

        });




    });


})();