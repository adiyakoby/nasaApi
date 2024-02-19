"use strict";

const htmlManager= (function (qualifiedName, value) {

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




    //default string
    const cameraSelectionMessage  = '<option value="">Please select a rover first.</option>';
    const earthDateSelection = "earth_date";
    const marsDateSelection = "sol";


    const spinnerToggle = function () {
        spinnerLoader.classList.toggle("d-none");
    };

    const addRovers = function (roversArr) {
        roversArr.forEach((rover)=> {
            const newRover = document.createElement("option");
            newRover.value = newRover.innerText = rover.name;
            roverSelection.appendChild(newRover);
            });
        spinnerToggle();
    };

    const selectedRover = () => roversBank.getRovers().find(rover => rover.name === roverSelection.value);

    const inValidElements = () => Array.from(NasaForm.elements).forEach(element => {
        if(element.value === '') element.classList.add("is-invalid")
        else if(element.type !== "date" && element.type !== "number") element.classList.remove("is-invalid");
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
        try {
            if(imagesBank.registerImages(res)) {
                imagesBank.getImages().forEach(img => createDivImage(img))
            } else {
                emptyArrayAlert.classList.remove("d-none");
            }
        } catch (error) {
            console.log("Error fetching images:", error);
        }
        spinnerToggle();
    };

    const cardBodyDivCreator = (date, sol, camera, mission, src) => {
        return  `
          <p class="card-text">Earth date: ${date}</p>
          <p class="card-text">Sol: ${sol}</p>
          <p class="card-text">Camera: ${camera}</p>
          <p class="card-text">Mission: ${mission}</p>
          <a href=#" class="btn btn-primary" onclick="imagesBank.saveImage(this.nextElementSibling.getAttribute('href'))">Save</a>
          <a href="${src}" class="btn btn-primary" target="_blank">Full size</a>`;
    };

    const createDivImage = function (img) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card col-md-4';
        cardDiv.style.width = '18rem';

        const imgElement = document.createElement('img');
        Object.assign(imgElement, { src: img.src, className: 'card-img-top', alt: 'nasaPhoto' , id:`${img.id}` });

        const cardBodyDiv = document.createElement('div');
        cardBodyDiv.className = 'card-body';

        // Create and append elements using a template literal
        cardBodyDiv.innerHTML = cardBodyDivCreator(img.earth_date, img.sol, img.camera, img.mission, img.src);

        // Append the elements to the appropriate parent elements
        cardDiv.appendChild(imgElement);
        cardDiv.appendChild(cardBodyDiv);

        imagesContainer.appendChild(cardDiv);

    };

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


    const showToast = (header, msg) => {
        toastLiveExample.innerHTML = toastBodyCreator(header, msg);
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
        toastBootstrap.show();
    };


    const cardBodySavedImagesCreator = function (img) {
        return `<div class="row g-0">
                    <div class="col-md-4">
                        <img src="${img.src}" class="img-fluid rounded-start" alt="nasa-image"> 
                    </div>
                    <div class="col-md-8">
                        <div class="card-body" data-img-id="${img.id}" data-img-src="${img.src}">
                            <p class="card-text" > earth_date: ${img.earth_date}, sol: ${img.sol}<br>camera: ${img.camera}, id: ${img.id}</p>
                            <button class="btn btn-danger col-12" onclick="imagesBank.eraseImage(this.parentNode)">delete</button>
                        </div>
                    </div>
                </div>`;
    }

    const addImage = function (img) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card col-md-4';
        cardDiv.style.maxWidth = '540px';

        cardDiv.innerHTML = cardBodySavedImagesCreator(img);
        savedImagesContainer.appendChild(cardDiv);

    };

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

        imgElements[0].className = "carousel-item active"  //start the first one
        // Append all the created elements to the carouselInner container
        imgElements.forEach(imgElement => carouselInner.appendChild(imgElement));

    };

    const showHome = () => {
        homePage.classList.remove("d-none")
        savedImagesPage.classList.add("d-none")
    };
    const showSavedImagesPage = () => {
        homePage.classList.add("d-none");
        savedImagesPage.classList.remove("d-none");
    };
    
    const renderSavedImages = function () {
        savedImagesContainer.innerHTML = "";
        imagesBank.getSavedImages().forEach(img => addImage(img));
    }

    const startCarousel = () => { if(imagesBank.getSavedImages().length > 0) carouselDiv.classList.remove("d-none"); }
    const stopCarousel = () => { carouselDiv.classList.add("d-none"); }

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

    }

})();