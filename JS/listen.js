"use strict";

(function () {
    const roversArray = [];
    document.addEventListener('DOMContentLoaded', function () {

        //Dom content and buttons
        //nav buttons
        const HomeButton = document.getElementById("home-page");
        const SavedImagesButton = document.getElementById("saved-images");


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
            htmlManager.addDateFormat();
        });

        //
        // SolSelection.addEventListener("change", function () {
        //     htmlManager.checkDate();
        // });

        roverSelection.addEventListener("change", function () {
            htmlManager.addCameras();
            htmlManager.updateDates();
        });

        // cameraSelection.addEventListener("click", function () {
        //     htmlManager.inValidElements();
        // });


        SearchButton.addEventListener("click" , function () {
            htmlManager.getImages();
        });

        ClearButton.addEventListener("click", function () {
            htmlManager.clearForm();
        });




    });


})();