import Scene_MenuBase from './SceneMenuBase';
import {
  Stage, Graphics, Sprite, Bitmap, WindowLayer, ScreenSprite, TouchInput, Input
} from '../core';
import {
  DataManager, ConfigManager, ImageManager, SoundManager, SceneManager,
  AudioManager,TextManager
} from '../managers';
import {
  Window_TitleCommand, Window_MapName, Window_Message, Window_ScrollText,
  Window_MenuStatus, Window_MenuCommand, Window_Gold,
  Window_Help, Window_ItemCategory, Window_ItemList,Window_MenuActor,
  Window_SkillType, Window_SkillStatus, Window_SkillList,
  Window_EquipStatus, Window_EquipCommand, Window_EquipSlot, Window_EquipItem,
  Window_Status, Window_Options,
  Window_SavefileList,
  Window_GameEnd
} from '../windows';
import {Spriteset_Map} from '../sprites';
import {Game_Action} from '../objects';

//-----------------------------------------------------------------------------
// Scene_Options
//
// The scene class of the options screen.

export default function Scene_Options() {
    this.initialize.apply(this, arguments);
}

Scene_Options.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Options.prototype.constructor = Scene_Options;

Scene_Options.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_Options.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createOptionsWindow();
};

Scene_Options.prototype.terminate = function() {
    Scene_MenuBase.prototype.terminate.call(this);
    ConfigManager.save();
};

Scene_Options.prototype.createOptionsWindow = function() {
    this._optionsWindow = new Window_Options();
    this._optionsWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._optionsWindow);
};
