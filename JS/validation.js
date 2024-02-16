"use strict";

const validation = (function () {

    const statusCheck = function (response) {
        if(response.status >= 200 && response.status < 300) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(new Error(response.statusText))
        }
    };



    return {
        statusCheck: statusCheck,
    }

})();