//=============================================================================
// main.js
//=============================================================================
import {SceneManager, PluginManager} from './managers';
import {Scene_Boot} from './scenes';
PluginManager.setup($plugins);

window.onload = function() {
    SceneManager.run(Scene_Boot);
};
