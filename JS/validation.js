"use strict";

const validation = (function () {

    const statusCheck = function (response) {
        if(response.status >= 200 && response.status < 300) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(new Error(response.statusText))
        }
    };

    const isSolDateValid = function (userInput, maxDate) {
        return userInput >= 0 && userInput <= maxDate;
    };

    const isEarthDateValid = function (date, startDate, endDate) {
        const currentDate = new Date(date);
        const start = new Date(startDate);
        const end = new Date(endDate);

        return currentDate >= start && currentDate <= end;
    }



    const isInvalidElement  = (element) => {
        // const cond = !(element.hasAttribute("required") &&
        //                         !(element.parentNode.classList.contains("d-none")) &&
        //                           element.value.trim() === '');
        //
        // if(!cond) htmlManager.inValidElement(element);
        // return cond;

       return !(element.hasAttribute("required") &&
                !(element.parentNode.classList.contains("d-none")) &&
                element.value.trim() === '');
    };


    const isFormValid = (form) => {
        return Array.from(form.elements).every(isInvalidElement);
    };


    return {
        statusCheck: statusCheck,
        isSolDateValid: isSolDateValid,
        isEarthDateValid: isEarthDateValid,
        isFormValid: isFormValid,
    }

})();