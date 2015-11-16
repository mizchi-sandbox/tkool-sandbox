// require("./js/libs/pixi");
// require("./js/libs/fpsmeter");
// require("./js/libs/lz-string");
require("./core");
require("./$globals");
require("./plugins");

import SceneManager from './managers/SceneManager';
import PluginManager from './managers/PluginManager';
import Scene_Boot from './scenes/Boot';
PluginManager.setup($plugins);
window.onload = function() {
    SceneManager.run(Scene_Boot);
};
