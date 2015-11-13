//=============================================================================
// main.js
//=============================================================================
import SceneManager from './managers/SceneManager';
import PluginManager from './managers/PluginManager';
import Scene_Boot from './scenes/Boot';
PluginManager.setup($plugins);

window.onload = function() {
    SceneManager.run(Scene_Boot);
};
