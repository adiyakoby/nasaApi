"use strict";

/**
 * Self-invoking function to encapsulate the code and avoid polluting the global scope.
 */
(function () {

    document.addEventListener('DOMContentLoaded', function () {

        //----------------Dom content and buttons----------------
        //----------------nav buttons----------------
        const HomeButton = document.getElementById("home-button");
        const SavedImagesButton = document.getElementById("saved-images-button");

        //----------------saved images buttons----------------
        const startCarousel = document.getElementById("start-carousel-btn");
        const stopCarousel = document.getElementById("stop-carousel-btn");
        const backToSearch = document.getElementById("back-to-search-btn");


        //----------------form content----------------
        const dateFormat = document.getElementById("date-format");
        const roverSelection = document.getElementById("rover-select");
        const SearchButton = document.getElementById("search-Button");
        const ClearButton = document.getElementById("clear-Button");


        /**
         * Initialize the application by fetching the rover information from the server.
         * This function is invoked immediately upon the DOM content being loaded.
         */
        apiManager.init();  // fetch the rover once from the server.


        // ----------------Event listeners----------------

        /**
         * Event listener for the 'date-format' input change.
         * Updates the date format in the HTML manager.
         */
        dateFormat.addEventListener("change", function () {
            htmlManager.updateDateFormat();
        });

        /**
         * Event listener for the 'rover-select' input change.
         * Adds available cameras and updates dates in the HTML manager.
         */
        roverSelection.addEventListener("change", function () {
            htmlManager.addCameras();
            htmlManager.updateDates();
        });

        /**
         * Event listener for the 'Search' button click.
         * Initiates the process to retrieve and display images based on user input.
         */
        SearchButton.addEventListener("click" , function () {
            htmlManager.getImages();
        });

        /**
         * Event listener for the 'Clear' button click.
         * Clears the form content in the HTML manager.
         */
        ClearButton.addEventListener("click", function () {
            htmlManager.clearForm();
        });

        /**
         * Event listener for the 'Home' button click.
         * Shows the home page in the HTML manager.
         */
        HomeButton.addEventListener("click", function () {
            htmlManager.showHome();

        });

        /**
         * Event listener for the 'Saved Images' button click.
         * Renders saved images, adds them to the carousel, and shows the saved images page in the HTML manager.
         */
        SavedImagesButton.addEventListener("click", function () {
            htmlManager.renderSavedImages()
            htmlManager.addImagesToCarousel();
            htmlManager.showSavedImagesPage();
        });

        /**
         * Event listener for the 'Start Carousel' button click.
         * Initiates and shows the image carousel in the HTML manager.
         */
        startCarousel.addEventListener("click", function () {
            htmlManager.startCarousel();

        });

        /**
         * Event listener for the 'Stop Carousel' button click.
         * Stops and hide the image carousel in the HTML manager.
         */
        stopCarousel.addEventListener("click", function () {
            htmlManager.stopCarousel();

        });

        /**
         * Event listener for the 'Back to Search' button click.
         * Shows the home page and stops the image carousel in the HTML manager.
         */
        backToSearch.addEventListener("click", function () {
            htmlManager.showHome();
            htmlManager.stopCarousel();

        });
    });

})();