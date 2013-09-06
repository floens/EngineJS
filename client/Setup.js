// Shared code seperating is done this way.
window.CLIENT = true;
window.SERVER = false;

// Node.js uses global, browsers use window. Make them both global
window.global = window;
