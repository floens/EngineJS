(function(global, undefined) {
'use strict';

var fs = require('fs');

global.MapLoader = {};

MapLoader.save = function(name, map) {
	var obj = {
		width: map.width,
		height: map.height,
		tileArray: []
	};

	var size = map.width * map.height,
		newTileArray = new Array(size);

    // JSON sees typed arrays as objects instead of arrays
    for (var i = 0; i < size; i++) {
        newTileArray[i] = map.tileArray[i];
    }

    obj.tileArray = newTileArray;

    var fileName = 'saved_maps/' + name + '.json';

    fs.writeFile(fileName, JSON.stringify(obj), function(err) {
        if (err) {
            log('Error saving map');
            log(err.stack, true);
            return;
        }
    	// log('Saved map as ' + fileName);
    })
}

MapLoader.exists = function(name) {
	var fileName = 'saved_maps/' + name + '.json';
	return fs.existsSync(fileName);
}

MapLoader.load = function(name) {
	var fileName = 'saved_maps/' + name + '.json';

	if (!fs.existsSync(fileName)) {
		log(fileName + ' not found.');
	}

	log('Loading map...');
	try {
		var unparsed = fs.readFileSync(fileName);
	} catch(err) {
		log('Error opening ' + fileName);
		log(err.stack, true);
		return;
	}

	var parsed = JSON.parse(unparsed);

	var map = new Map(parsed.width, parsed.height);

	var size = parsed.width * parsed.height;
	for (var i = 0; i < size; i++) {
		map.tileArray[i] = parsed.tileArray[i];
	}

	log('Done.');

	return map;
}

})(global);
