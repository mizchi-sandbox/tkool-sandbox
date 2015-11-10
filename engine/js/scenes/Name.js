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
// Scene_Name
//
// The scene class of the name input screen.

export function Scene_Name() {
    this.initialize.apply(this, arguments);
}

Scene_Name.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Name.prototype.constructor = Scene_Name;

Scene_Name.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_Name.prototype.prepare = function(actorId, maxLength) {
    this._actorId = actorId;
    this._maxLength = maxLength;
};

Scene_Name.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this._actor = $gameActors.actor(this._actorId);
    this.createEditWindow();
    this.createInputWindow();
};

Scene_Name.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this._editWindow.refresh();
};

Scene_Name.prototype.createEditWindow = function() {
    this._editWindow = new Window_NameEdit(this._actor, this._maxLength);
    this.addWindow(this._editWindow);
};

Scene_Name.prototype.createInputWindow = function() {
    this._inputWindow = new Window_NameInput(this._editWindow);
    this._inputWindow.setHandler('ok', this.onInputOk.bind(this));
    this.addWindow(this._inputWindow);
};

Scene_Name.prototype.onInputOk = function() {
    this._actor.setName(this._editWindow.name());
    this.popScene();
};
