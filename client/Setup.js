// Shared code seperating is done this way.
// This is at the beginning of loading other scripts because SpriteManager is called
//   directly when scripts are loaded, and servers don't have SpriteManager.
window.CLIENT = true;
window.SERVER = false;

// Node.js uses global, browsers use window. Make them both global
window.global = window;
