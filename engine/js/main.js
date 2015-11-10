//=============================================================================
// main.js
//=============================================================================
import {SceneManager, PluginManager} from './rpg_managers';
import {Scene_Boot} from './rpg_scenes';
PluginManager.setup($plugins);

window.onload = function() {
    SceneManager.run(Scene_Boot);
};
