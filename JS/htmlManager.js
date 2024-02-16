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

const htmlManager= (function () {
    //Array for rovers and cameras
    const roversArray = []
    const camerasArray = []

    //DOM elements
    const spinnerLoader = document.getElementById("spinner-loader");
    const roverSelection = document.getElementById("rover-select");
    const cameraSelection = document.getElementById("camera-select");

    //default string
    const cameraSelectionMassage = '<option>Please select a rover first.</option>';

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


    const addCameras = function (nameOfRover) {
        const selectedRover = roversArray.find(rover=>rover.name === nameOfRover);
        cameraSelection.innerHTML = ''; // clear the selection
        console.log(selectedRover)
        if(selectedRover) {
            selectedRover["cameras"].forEach((camera)=> {
                const newCamera = document.createElement("option");
                newCamera.value = newCamera.innerText = camera.full_name;
                cameraSelection.appendChild(newCamera);
            });
        } else {
            cameraSelection.innerHTML = cameraSelectionMassage; // default string.
        }
    };

    const clearForm = function () {

    };

    const addDateFormat = function () {

    };


    return {
        registerRovers : registerRovers,
        addCameras : addCameras,
        clearForm : clearForm,
        addDateFormat: addDateFormat,
    }

})();