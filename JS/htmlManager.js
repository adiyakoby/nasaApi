"use strict";

/*
{
    "id": 7,
    "name": "Spirit",
    "landing_date": "2004-01-04",
    "launch_date": "2003-06-10",
    "status": "complete",
    "max_sol": 2208,
    "max_date": "2010-03-21",
    "total_photos": 124550,
    "cameras": [
        {
            "name": "FHAZ",
            "full_name": "Front Hazard Avoidance Camera"
        },
        {
            "name": "NAVCAM",
            "full_name": "Navigation Camera"
        },
        {
            "name": "PANCAM",
            "full_name": "Panoramic Camera"
        },
        {
            "name": "MINITES",
            "full_name": "Miniature Thermal Emission Spectrometer (Mini-TES)"
        },
        {
            "name": "ENTRY",
            "full_name": "Entry, Descent, and Landing Camera"
        },
        {
            "name": "RHAZ",
            "full_name": "Rear Hazard Avoidance Camera"
        }
    ]
}
*/

const htmlManager= (function (qualifiedName, value) {
    //Array for rovers and cameras
    const roversArray = []

    //DOM elements
    const dateFormat = document.getElementById("date-format");

    const DateSelection = document.getElementById("earthDate");
    const DateSelectionInput = document.getElementById("date-picker-input");
    const SolSelection = document.getElementById("solDate");
    const SolSelectionInput = document.getElementById("sol-picker-input");

    const spinnerLoader = document.getElementById("spinner-loader");
    const roverSelection = document.getElementById("rover-select");
    const cameraSelection = document.getElementById("camera-select");




    //default string
    const cameraSelectionMassage = '<option>Please select a rover first.</option>';
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

    const addCameras = function () {
        cameraSelection.disabled = false;
        cameraSelection.innerHTML = cameraSelectionMassage; // default string.
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
        DateSelectionInput.min = rover.landing_date;
        DateSelectionInput.max = rover.max_date;
        SolSelectionInput.max = rover.max_sol; //sol min is 0
    };

    const clearForm = function () {

    };

    /**
     * Toggle between Earth and Mars date selections.
     * @param {string} date - The selected date ('earth' or 'mars').
     */
    const addDateFormat = function () {
        const earthSelected = dateFormat.value === earthDateSelection; // Check if Earth date is selected

        DateSelection.classList.toggle("d-none", !earthSelected);
        DateSelectionInput.disabled = !earthSelected;

        SolSelection.classList.toggle("d-none", earthSelected);
        SolSelectionInput.disabled = earthSelected;
    };

    const checkDate = function (date) {
        if(dateFormat.value === earthDateSelection) {
            validation.earthDateCheck(DateSelectionInput.value, DateSelectionInput.min, DateSelectionInput.max );

        } else if (dateFormat.value === marsDateSelection) {
            validation.solDateCheck(SolSelectionInput.max, SolSelectionInput.value);
        }
    };


    const getImages = function () {
        const selectedRoverData = selectedRover();

        if(selectedRoverData) {
            const rover = {
                "roverName" : selectedRover().name,
                "camera" : cameraSelection.value,
                "dateFormat" : dateFormat.value,
                "earth_date" :  DateSelectionInput.value,
                "sol" : SolSelectionInput.value
            };
            apiManager.fetchImages(rover);
        }

    };

    return {
        registerRovers : registerRovers,
        addCameras : addCameras,
        clearForm : clearForm,
        addDateFormat : addDateFormat,
        updateDates : updateDates,
        checkDate : checkDate,
        getImages : getImages,


    }

})();