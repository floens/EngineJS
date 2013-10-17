(function(global, undefined) {
'use strict';

global.UILoad = function(text) {
    UI.call(this);

    this.displayText = text;

    this.z = 0;
}
UILoad.extend(UI);

UILoad.prototype.render = function() {
    this.parent.render.call(this);

    this.canvas.clear();

    this.z += 0.09;

    /*var smallestScreen = Screen.width > Screen.height ? Screen.height : Screen.width;

    var radius = smallestScreen * 0.4;
    var x = Math.cos(this.z) * radius + Screen.width / 2;
    var y = Math.sin(this.z) * radius + Screen.height / 2;

    this.canvas.fillCircle(x, y, 10, '#4300F4');*/

    this.canvas.fillText(this.displayText, Screen.width / 2, Screen.height / 2, '#ffffff', 20, 'center');
}

})(global);
