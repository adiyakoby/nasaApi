"use strict";

/**
 * The `validation` module handles various validation checks used in the application.
 * It includes functions for status code checks, sol date validation, earth date validation,
 * and form validation.
 * @module validation
 */
const validation = (function () {

    /**
     * Checks the HTTP response status and resolves or rejects the promise accordingly.
     *
     * @param {Response} response - The HTTP response object.
     * @returns {Promise<Response>} - A promise that either resolves with the response or rejects with an error.
     */
    const statusCheck = function (response) {
        if(response.status >= 200 && response.status < 300) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(new Error(response.statusText))
        }
    };

    /**
     * Validates if the provided sol date is within the valid range (0 to maxDate).
     *
     * @param {number} userInput - The sol date entered by the user.
     * @param {number} maxDate - The maximum valid sol date.
     * @returns {boolean} - True if the sol date is valid, otherwise false.
     */
    const isSolDateValid = function (userInput, maxDate) {
        return userInput >= 0 && userInput <= maxDate;
    };

    /**
     * Validates if the provided Earth date is within the specified range (startDate to endDate).
     *
     * @param {string} date - The Earth date to be validated.
     * @param {string} startDate - The start date of the valid range.
     * @param {string} endDate - The end date of the valid range.
     * @returns {boolean} - True if the Earth date is valid, otherwise false.
     */
    const isEarthDateValid = function (date, startDate, endDate) {
        const currentDate = new Date(date);
        const start = new Date(startDate);
        const end = new Date(endDate);

        return currentDate >= start && currentDate <= end;
    }

    /**
     * Checks if the given form element is valid (not empty) based on the conditions that the input is required,
     * shown and empty.
     *
     * @param {HTMLElement} element - The form element to be validated.
     * @returns {boolean} - True if the element is valid, otherwise false.
     */
    const isInvalidElement  = (element) => {
       return !(element.hasAttribute("required") &&
                !(element.parentNode.classList.contains("d-none")) &&
                element.value.trim() === '');
    };

    /**
     * Checks if the entire form is valid by validating each element.
     *
     * @param {HTMLFormElement} form - The HTML form element to be validated.
     * @returns {boolean} - True if the form is valid, otherwise false.
     */
    const isFormValid = (form) => {
        return Array.from(form.elements).every(isInvalidElement);
    };

    // Expose the public API for the `validation` module
    return {
        statusCheck: statusCheck,
        isSolDateValid: isSolDateValid,
        isEarthDateValid: isEarthDateValid,
        isFormValid: isFormValid,
    };

})();