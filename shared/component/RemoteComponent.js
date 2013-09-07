(function(global, undefined) {
'use strict';

global.RemoteComponent = function() {
    Component.call(this);
}
RemoteComponent.extend(Component);
Component.registerComponent(RemoteComponent, 5);


})(global);
