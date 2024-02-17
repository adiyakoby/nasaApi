"use strict";

const validation = (function () {

    const statusCheck = function (response) {
        if(response.status >= 200 && response.status < 300) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(new Error(response.statusText))
        }
    };

    const solDateCheck = function (maxDate, userInput) {
        return !(userInput < 0 || userInput > maxDate);
    };

    function earthDateCheck(date, startDate, endDate) {
        const currentDate = new Date(date);
        const start = new Date(startDate);
        const end = new Date(endDate);

        return currentDate >= start && currentDate <= end;
    }


    return {
        statusCheck: statusCheck,
        solDateCheck: solDateCheck,
        earthDateCheck: earthDateCheck,
    }

})();