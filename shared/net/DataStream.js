(function(global) {
'use strict';

global.DataStream = function() {
    this._currentIndex = 0;
    this._data = [];
}

/**
 * Append a number to this stream
 * @param  {number} number
 */
DataStream.prototype.writeNumber = function(number) {
    if (!Utils.isNumber(number)) throw new Error('Not a number.');
    this._data.push(number);
}

/**
 * Append a string to this stream
 * @param  {string} string
 */
DataStream.prototype.writeString = function(string) {
    if (!Utils.isString(string)) throw new Error('Not a string.');
    this._data.push(string);
}


/**
 * Read the next element as a number, throws if it isn't a number
 * @return {number}
 */
DataStream.prototype.readNumber = function() {
    if (!this.hasNext()) throw new Error('No more data.');

    var element = this._data[this._currentIndex];

    if (!Utils.isNumber(element)) throw new Error('Not a number.');

    this._currentIndex++;

    return element;
}

/**
 * Read the next element as a string, throws if it isn't a string
 * @return {string}
 */
DataStream.prototype.readString = function() {
    if (!this.hasNext()) throw new Error('No more data.');

    var element = this._data[this._currentIndex];

    if (!Utils.isString(element)) throw new Error('Not a string.');

    this._currentIndex++;

    return element;
}

DataStream.prototype.hasNext = function() {
    return this._currentIndex < this._data.length;
}

DataStream.prototype.setIndex = function(e) {
    this._currentIndex = e;
}


/**
 * Set raw data to this stream. Internal usage.
 * @param {string} data
 */
DataStream.prototype.setData = function(data) {
    var list = null;

    try {
        list = JSON.parse(data);
    } catch(err) {
        throw new Error('Malformed input data.');
    }

    if (!Utils.isArray(list)) {
        throw new Error('Malformed input data.');
    }

    if (list.length == 0) {
        throw new Error('Malformed input data.');
    }

    if (!Utils.isNumber(list[0])) {
        throw new Error('Malformed input data.');
    }

    this.setIndex(0);
    this._data = list;
}

/**
 * Read the written data as a string to send away. Internal usage.
 * @return {string}
 */
DataStream.prototype.getData = function() {
    // TODO: Not possible?
    if (!Utils.isArray(this._data)) {
        throw new Error('Malformed output data.');
    }

    var output = null;
    try {
        output = JSON.stringify(this._data);
    } catch(err) {
        throw new Error('Malformed output data.');
    }

    return output;
}

})(global);
