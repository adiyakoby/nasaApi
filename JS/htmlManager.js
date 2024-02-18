"use strict";

const htmlManager= (function (qualifiedName, value) {
    //Array for rovers and cameras
    const roversArray = []
    const imagesArray = []

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
    const emptyArrayAlert = document.getElementById("empty-array-alert");

    const toastLiveExample = document.getElementById('liveToast');




    //default string
    const cameraSelectionMessage  = '<option value="">Please select a rover first.</option>';
    const earthDateSelection = "earth_date";
    const marsDateSelection = "sol";
    const toastSavedMessage = 'image saved into your preferred list.';
    const toastNotSavedMessage = 'image was saved into your preferred list already, no duplicates allowed..'

    const registerRovers = function (res) {
        res["rovers"].forEach(rover => roversArray.push(rover))
        spinnerToggle();
        addRovers();
    };

    const spinnerToggle = function () {
        spinnerLoader.classList.toggle("d-none");
    };

    const addRovers = function () {
    roversArray.forEach((rover)=> {
        const newRover = document.createElement("option");
        newRover.value = newRover.innerText = rover.name;
        roverSelection.appendChild(newRover);
        });
    };

    const selectedRover = () => roversArray.find(rover => rover.name === roverSelection.value);

    const inValidElements = () => Array.from(NasaForm.elements).forEach(element => {
        if(element.value === '') element.classList.add("is-invalid")
        else element.classList.remove("is-invalid");
    });


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
     *
     * @function
     * @name updateDateFormat
     * @description This function is designed to toggle the visibility and disable/enable input elements
     * based on whether the Earth date or Martian Sol date is selected.
     *
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

    const checkDate = function () {
        if(dateFormat.value === earthDateSelection) {
            return validation.isEarthDateValid(DateSelectionInput.value, DateSelectionInput.min, DateSelectionInput.max );

        } else if (dateFormat.value === marsDateSelection) {
            return validation.isSolDateValid(parseInt(SolSelectionInput.value), SolSelectionInput.max);
        }
    };


    const getImages = function () {
        spinnerToggle();
        emptyArrayAlert.classList.add("d-none");


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
                    .then(showImages)
            } else {
                spinnerToggle();
            }
        } catch (error) {
            console.log("Error fetching data:", error);
            clearForm();
        }
        finally
        {
            inValidElements();

        }

    };

    const clearForm = function () {
        NasaForm.reset();
        updateDateFormat();
        emptyArrayAlert.classList.add("d-none");
        Array.from(NasaForm.elements).forEach(e=>e.classList.remove("is-invalid"));

    };


    const showImages = function (res) {
        imagesContainer.innerHTML = '';
        if(res && res["photos"].length > 0) {
            emptyArrayAlert.classList.add("d-none");
            let limit = (res["photos"].length > 50 ? 50 : res["photos"].length);
            res["photos"].slice(0, limit).forEach(photo => createNewImage(photo));
        } else {
            emptyArrayAlert.classList.remove("d-none");
        }
        spinnerToggle();
    };
    
    const createNewImage = function (img) {
        const src = img.img_src;
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card col-md-4';
        cardDiv.style.width = '18rem';

        const imgElement = document.createElement('img');
        Object.assign(imgElement, { src: src, className: 'card-img-top', alt: 'nasaPhoto' , id:`${img.id}`});

        const cardBodyDiv = document.createElement('div');
        cardBodyDiv.className = 'card-body';

        // Create and append elements using a template literal
        cardBodyDiv.innerHTML = `
          <p class="card-text">Earth date: ${img.earth_date}</p>
          <p class="card-text">Sol: ${img.sol}</p>
          <p class="card-text">Camera: ${img.camera.name}</p>
          <p class="card-text">Mission: ${img.rover.name}</p>
          <a href=#" class="btn btn-primary" onclick="htmlManager.saveImage(this.parentNode.parentNode)">Save</a>
          <a href="${src}" class="btn btn-primary" target="_blank">Full size</a>`;

        // Append the elements to the appropriate parent elements
        cardDiv.appendChild(imgElement);
        cardDiv.appendChild(cardBodyDiv);

        imagesContainer.appendChild(cardDiv);

    };


    const toastBodyCreator = (header, msg) => {
        return `<div class="toast-header">
                <strong class="me-auto">${header}</strong>
                <small>Now</small>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    ${msg}
                </div>`
    };

    const saveImage = function (newImage) {
        let header = ''
        let msg = ''
        if(imagesArray.every(img => img !== newImage)){
            console.log("added new img")
            imagesArray.push(newImage);
            header = "Saved";
            msg = toastSavedMessage;


        } else {
            header = "Not saved";
            msg = toastNotSavedMessage;
        }

        toastLiveExample.innerHTML = toastBodyCreator(header, msg);
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
        toastBootstrap.show();
    }


    const showHome = () => { homePage.classList.remove("d-none") };
    const showSavedImages = () => { homePage.classList.add("d-none") };

    return {
        registerRovers : registerRovers,
        addCameras : addCameras,
        clearForm : clearForm,
        updateDateFormat : updateDateFormat,
        updateDates : updateDates,
        getImages : getImages,
        createNewImage : createNewImage,
        inValidElements : inValidElements,
        showHome : showHome,
        showSavedImages : showSavedImages,
        saveImage : saveImage,

    }

})();