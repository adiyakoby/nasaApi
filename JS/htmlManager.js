"use strict";

/**
 * The `htmlManager` module is responsible for managing the HTML elements and interactions within the application.
 * It handles DOM manipulation, form updates, image rendering, and displays.
 * @module htmlManager
 */
const htmlManager= (function () {

    //DOM elements
    const homePage = document.getElementById("home-page");
    const savedImagesPage = document.getElementById("saved-images-page");
    const NasaForm = document.getElementById("nasaForm");
    const dateFormat = document.getElementById("date-format");
    const DateSelection = document.getElementById("earthDate");
    const DateSelectionInput = document.getElementById("date-picker-input");
    const SolSelection = document.getElementById("solDate");
    const SolSelectionInput = document.getElementById("sol-picker-input");
    const spinnerLoader = document.getElementById("spinner-loader");
    const roverSelection = document.getElementById("rover-select");
    const cameraSelection = document.getElementById("camera-select");
    const imagesContainer = document.getElementById("images-container");
    const savedImagesContainer = document.getElementById("saved-images-container");
    const emptyArrayAlert = document.getElementById("empty-array-alert");
    const toastLiveExample = document.getElementById('liveToast');
    const carouselInner = document.getElementById('carousel-Images');
    const carouselDiv = document.getElementById("nasaCarouselImages");




    // Default strings and constants
    const cameraSelectionMessage  = '<option value="">Please select a rover first.</option>';
    const earthDateSelection = "earth_date";
    const marsDateSelection = "sol";
    //const vars and messages.
    const Error = "Error!"
    const ErrorMessage = "Error fetching data:"

    /**
     * Toggles the visibility of the spinner loader.
     * @private
     */
    const spinnerToggle = function () {
        spinnerLoader.classList.toggle("d-none");
    };

    /**
     * Adds rover options to the rover selection dropdown based on the provided array of rovers.
     * @param {Array} roversArr - An array of rover objects.
     * @private
     */
    const addRovers = function (roversArr) {
        roversArr.forEach((rover)=> {
            const newRover = document.createElement("option");
            newRover.value = newRover.innerText = rover.name;
            roverSelection.appendChild(newRover);
            });
        spinnerToggle();
    };

    /**
     * Returns the selected rover object from the rovers bank.
     * @returns {Object} - The selected rover object.
     * @private
     */
    const selectedRover = () => roversBank.getRovers().find(rover => rover.name === roverSelection.value);

    /**
     * Marks invalid form elements by adding the "is-invalid" class. -> shows errors.
     * @private
     */
    const inValidElements = () => Array.from(NasaForm.elements).forEach(element => {
        if(element.value === '') element.classList.add("is-invalid")
        else if(element.type !== "date" && element.type !== "number") element.classList.remove("is-invalid");
    });

    /**
     * Adds camera options to the camera selection dropdown based on the selected rover's cameras.
     * @private
     */
    const addCameras = function () {
        cameraSelection.disabled = false; //let the user choose a camera
        cameraSelection.innerHTML = cameraSelectionMessage; // default string.

        if(selectedRover()) {
            selectedRover()["cameras"].forEach((camera)=> {
                const newCamera = document.createElement("option");
                newCamera.value = camera.name;
                newCamera.innerText = camera.full_name;
                cameraSelection.appendChild(newCamera);
            });
        }
    };

    /**
     * Updates the date inputs based on the selected rover's landing date and mission duration.
     */
    const updateDates = function () {
        const rover = selectedRover();
        if(rover) {
            roverSelection.classList.remove("is-invalid");
            DateSelectionInput.min = rover.landing_date;
            DateSelectionInput.max = rover.max_date;
            SolSelectionInput.max = rover.max_sol; //sol min is 0
        }
    };

    /**
     * Toggles visibility and enables/disables input elements based on Earth or Martian Sol date selection.
     * @description This function is designed to toggle the visibility and disable/enable input elements
     * based on whether the Earth date or Martian Sol date is selected.
     */
    const updateDateFormat = function () {
        const earthSelected = dateFormat.value === earthDateSelection; // Check if Earth date is selected

        DateSelection.classList.toggle("d-none", !earthSelected);
        DateSelectionInput.disabled = !earthSelected;
        DateSelectionInput.classList.remove("is-invalid");

        SolSelection.classList.toggle("d-none", earthSelected);
        SolSelectionInput.disabled = earthSelected;
        SolSelectionInput.classList.remove("is-invalid");
    };

    /**
     * Checks the selected date input for validity. sol or earth_date.
     * @returns {boolean} - True if the date is valid, otherwise false.
     * @private
     */
    const checkDate = function () {

        if(dateFormat.value === earthDateSelection && !validation.isEarthDateValid(DateSelectionInput.value, DateSelectionInput.min, DateSelectionInput.max)) {
            console.log("inside check date in earth -> returning false")
            DateSelectionInput.classList.add("is-invalid");
            return false;

        } else if (dateFormat.value === marsDateSelection && !validation.isSolDateValid(parseInt(SolSelectionInput.value), SolSelectionInput.max)) {
            SolSelectionInput.classList.add("is-invalid");
            return false;
        }
        DateSelectionInput.classList.remove("is-invalid");
        SolSelectionInput.classList.remove("is-invalid");
        return true;
    };


    /**
     * Initiates the process to retrieve and display images based on user input.
     */
    const getImages = function () {
        spinnerToggle();
        imagesContainer.innerHTML = '';

        try{
            if(validation.isFormValid(NasaForm) && checkDate()) {
                const rover = {
                    "roverName": selectedRover().name,
                    "camera": cameraSelection.value,
                    "dateFormat": dateFormat.value,
                    "earth_date": DateSelectionInput.value,
                    "sol": SolSelectionInput.value
                };
                apiManager.fetchImages(rover)
                    .then(showImages);
                emptyArrayAlert.classList.add("d-none");

            } else {
                spinnerToggle();
            }
        } catch (e) {
            console.log(ErrorMessage, e);
            showToast(Error , ErrorMessage + e.message);
            clearForm();
        }
        finally {
            inValidElements();
        }

    };

    /**
     * Clears the form content and resets the validation state.
     */
    const clearForm = function () {
        NasaForm.reset();
        updateDateFormat();
        emptyArrayAlert.classList.add("d-none");
        Array.from(NasaForm.elements).forEach(e=>e.classList.remove("is-invalid"));

    };


    /**
     * Renders images on the page based on the provided response.
     * @param {object} res - The response object containing image data.
     */
    const showImages = function (res) {
        try {
            if(imagesBank.registerImages(res)) {
                imagesBank.getImages().forEach(img => createDivImage(img))
            } else {
                emptyArrayAlert.classList.remove("d-none");
            }
        } catch (e) {
            console.log(ErrorMessage, e);
            showToast(Error , ErrorMessage + e.message);
        }
        spinnerToggle();
    };

    /**
     * Creates the HTML content for the body of a card element representing a NASA image in the Home page.
     * @param {Object} img - The NASA image object.
     * @returns {string} - The HTML content for the card body.
     * @function
     */
    const cardBodyDivCreator = (img) => {
        return  `
          <p class="card-text">Earth date: ${img.earth_date}</p>
          <p class="card-text">Sol: ${img.sol}</p>
          <p class="card-text">Camera: ${img.camera}</p>
          <p class="card-text">Mission: ${img.mission}</p>
          <a href=#" class="btn btn-primary save-btn" data-img-id="${img.id}"">Save</a>
          <a href="${img.src}" class="btn btn-primary" target="_blank">Full size</a>`;
    };

    /**
     * Creates a card element representing a NASA image and appends it to the images container, also adds an event
     * listene to the save button.
     * @param {Object} img - The NASA image object to display.
     * @returns {void}
     * @function
     */
    const createDivImage = function (img) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card col-md-4';
        cardDiv.style.width = '18rem';

        const imgElement = document.createElement('img');
        Object.assign(imgElement, { src: img.src, className: 'card-img-top', alt: 'nasaPhoto' , id:`${img.id}` });

        const cardBodyDiv = document.createElement('div');
        cardBodyDiv.className = 'card-body';

        // Create and append elements using a template literal
        cardBodyDiv.innerHTML = cardBodyDivCreator(img);

        const saveButton = cardBodyDiv.querySelector('.save-btn');

        saveButton.addEventListener('click', function () {
            imagesBank.saveImage(saveButton);
        });

        // Append the elements to the appropriate parent elements
        cardDiv.appendChild(imgElement);
        cardDiv.appendChild(cardBodyDiv);

        imagesContainer.appendChild(cardDiv);

    };

    /**
     * Creates a toast notification body.
     * @param {string} header - The header text for the toast notification.
     * @param {string} msg - The message text for the toast notification.
     * @returns {string} - The HTML string for the toast body.
     */
    const toastBodyCreator = (header, msg) => {
        let success = header.toLowerCase() === "saved" ? 'success' : 'danger';
        return `<div class="toast-header text-bg-${success}">
                <strong class="me-auto">${header}</strong>
                <small>Now</small>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body ">
                    ${msg}
                </div>`
    };

    /**
     * Displays a toast notification with the specified header and message.
     * @param {string} header - The header text for the toast notification.
     * @param {string} msg - The message text for the toast notification.
     */
    const showToast = (header, msg) => {
        toastLiveExample.innerHTML = toastBodyCreator(header, msg);
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
        toastBootstrap.show();
    };

    /**
     * Creates the HTML content for the card body of a saved image in the saved images page, including
     * details like earth_date, sol, camera, id, and src.
     * @param {Object} img - The saved image object containing details like earth_date, sol, camera, id, and src.
     * @returns {string} - The HTML content for the card body.
     */
    const cardBodySavedImagesCreator = function (img) {
        return `<div class="row g-0">
                    <div class="col-md-4">
                        <img src="${img.src}" class="img-fluid rounded-start" alt="nasa-image"> 
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <p class="card-text" > earth_date: ${img.earth_date}, sol: ${img.sol}<br>camera: ${img.camera}, id: ${img.id}</p>
                            <button class="btn btn-danger col-12 delete-btn" data-img-id="${img.id}">delete</button>
                        </div>
                    </div>
                </div>`;
    }

    /**
     * Adds a NASA image to the list of saved images and renders it in the UI, also adds an event listener
     * to the delete button.
     * @param {Object} img - The NASA image object to add.
     * @returns {void}
     * @function
     */
    const addImage = function (img) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card col-md-4';
        cardDiv.style.maxWidth = '540px';

        cardDiv.innerHTML = cardBodySavedImagesCreator(img);

        const deleteButton = cardDiv.querySelector('.delete-btn');

        deleteButton.addEventListener('click', function () {
            imagesBank.eraseImage(deleteButton);
        });
        savedImagesContainer.appendChild(cardDiv);

    };

    /**
     * Adds saved images to the image carousel.
     */
    const addImagesToCarousel = function () {
        const savedImages = imagesBank.getSavedImages();

        carouselInner.innerHTML = ""; //reset carousel

        // Create an array of HTML elements for each saved image
        const imgElements = savedImages.map(img => {
            const imgDiv = document.createElement("div");
            imgDiv.className = "carousel-item";

            const imgElement = document.createElement('img');
            imgElement.src = img.src;
            imgElement.className = 'd-block w-100';
            imgElement.alt = 'nasaPhoto';

            imgDiv.appendChild(imgElement);
            return imgDiv;
        });
        if(imgElements.length>0)
            imgElements[0].className = "carousel-item active"  //start the first one
        // Append all the created elements to the carouselInner container
        imgElements.forEach(imgElement => carouselInner.appendChild(imgElement));

    };

    /**
     * Shows the home page and hides the saved images page.
     */
    const showHome = () => {
        homePage.classList.remove("d-none")
        savedImagesPage.classList.add("d-none")
    };

    /**
     * Shows the saved images page and hides the home page.
     */
    const showSavedImagesPage = () => {
        homePage.classList.add("d-none");
        savedImagesPage.classList.remove("d-none");
    };

    /**
     * Renders saved images on the saved images page.
     */
    const renderSavedImages = function () {
        savedImagesContainer.innerHTML = "";
        imagesBank.getSavedImages().forEach(img => addImage(img));
    }

    /**
     * Starts the image carousel if there are saved images.
     */
    const startCarousel = () => {if(imagesBank.getSavedImages().length > 0) carouselDiv.classList.remove("d-none");}

    /**
     * Stops the image carousel.
     */
    const stopCarousel = () => { carouselDiv.classList.add("d-none"); }

    // Expose the public API for the `htmlManager` module
    return {
        addRovers: addRovers,
        addCameras : addCameras,
        clearForm : clearForm,
        updateDateFormat : updateDateFormat,
        updateDates : updateDates,
        getImages : getImages,
        inValidElements : inValidElements,
        showHome : showHome,
        showSavedImagesPage : showSavedImagesPage,
        showToast : showToast,
        addImage : addImage,
        addImagesToCarousel : addImagesToCarousel,
        renderSavedImages: renderSavedImages,
        startCarousel : startCarousel,
        stopCarousel : stopCarousel,

    };

})();