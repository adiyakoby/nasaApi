"use strict";

const htmlManager= (function (qualifiedName, value) {
    //Array for rovers and cameras
    const roversArray = []
    const imagesArray = []

    //DOM elements
    const dateFormat = document.getElementById("date-format");

    const DateSelection = document.getElementById("earthDate");
    const DateSelectionInput = document.getElementById("date-picker-input");
    const SolSelection = document.getElementById("solDate");
    const SolSelectionInput = document.getElementById("sol-picker-input");

    const spinnerLoader = document.getElementById("spinner-loader");
    const roverSelection = document.getElementById("rover-select");
    const cameraSelection = document.getElementById("camera-select");


    const NasaForm = document.getElementById("nasaForm");
    const imagesContainer = document.getElementById("images-container");
    const emptyArrayAlert = document.getElementById("empty-array-alert");

    //default string
    const cameraSelectionMessage  = '<option value="">Please select a rover first.</option>';
    const earthDateSelection = "earth_date";
    const marsDateSelection = "sol";

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
     * @name addDateFormat
     * @description This function is designed to toggle the visibility and disable/enable input elements
     * based on whether the Earth date or Martian Sol date is selected.
     *
     */
    const addDateFormat = function () {
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
            }
        } catch (error) {
            console.log("Error fetching data:", error);
        }
        finally
        {
            inValidElements();
        }

    };

    const clearForm = function () {
        NasaForm.reset();
        addDateFormat();
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

    };
    
    const createNewImage = function (img) {

        const src = img.img_src;

        // Create the main container div with class "card" and style
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card col-md-4';
        //cardDiv.style.width = '18rem';

        // Create the image element with class "card-img-top"
        const imgElement = document.createElement('img');
        Object.assign(imgElement, { src: src, className: 'card-img-top', alt: 'nasaPhoto' });

        // Create the div with class "card-body"
        const cardBodyDiv = document.createElement('div');
        cardBodyDiv.className = 'card-body';

        // Create and append elements using a template literal
        cardBodyDiv.innerHTML = `
          <p class="card-text">Earth date: ${img.earth_date}</p>
          <p class="card-text">Sol: ${img.sol}</p>
          <p class="card-text">Camera: ${img.camera.name}</p>
          <p class="card-text">Mission: ${img.rover.name}</p>
          <a href=#" class="btn btn-primary" onclick="">Save</a>
          <a href="${src}" class="btn btn-primary" target="_blank">Full size</a>`;

        // Append the elements to the appropriate parent elements
        cardDiv.appendChild(imgElement);
        cardDiv.appendChild(cardBodyDiv);

        imagesContainer.appendChild(cardDiv);

    };

    return {
        registerRovers : registerRovers,
        addCameras : addCameras,
        clearForm : clearForm,
        addDateFormat : addDateFormat,
        updateDates : updateDates,
        getImages : getImages,
        createNewImage : createNewImage,
        inValidElements: inValidElements,



    }

})();