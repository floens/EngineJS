(function(global) {
'use strict';

global.Storage = {};
Storage.getSupport = function() {
    return localStorage != undefined;
}

Storage.get = function(key) {
    return localStorage.getItem(key);
}

Storage.set = function(key, value) {
    localStorage.setItem(key, value);
}

Storage.clear = function() {
    localStorage.clear();
    log('Storage cleared.');
}

})(global);
