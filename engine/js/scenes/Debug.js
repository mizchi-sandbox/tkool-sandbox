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
// Scene_Debug
//
// The scene class of the debug screen.

export default function Scene_Debug() {
    this.initialize.apply(this, arguments);
}

Scene_Debug.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Debug.prototype.constructor = Scene_Debug;

Scene_Debug.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_Debug.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createRangeWindow();
    this.createEditWindow();
    this.createDebugHelpWindow();
};

Scene_Debug.prototype.createRangeWindow = function() {
    this._rangeWindow = new Window_DebugRange(0, 0);
    this._rangeWindow.setHandler('ok',     this.onRangeOk.bind(this));
    this._rangeWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._rangeWindow);
};

Scene_Debug.prototype.createEditWindow = function() {
    var wx = this._rangeWindow.width;
    var ww = Graphics.boxWidth - wx;
    this._editWindow = new Window_DebugEdit(wx, 0, ww);
    this._editWindow.setHandler('cancel', this.onEditCancel.bind(this));
    this._rangeWindow.setEditWindow(this._editWindow);
    this.addWindow(this._editWindow);
};

Scene_Debug.prototype.createDebugHelpWindow = function() {
    var wx = this._editWindow.x;
    var wy = this._editWindow.height;
    var ww = this._editWindow.width;
    var wh = Graphics.boxHeight - wy;
    this._debugHelpWindow = new Window_Base(wx, wy, ww, wh);
    this.addWindow(this._debugHelpWindow);
};

Scene_Debug.prototype.onRangeOk = function() {
    this._editWindow.activate();
    this._editWindow.select(0);
    this.refreshHelpWindow();
};

Scene_Debug.prototype.onEditCancel = function() {
    this._rangeWindow.activate();
    this._editWindow.deselect();
    this.refreshHelpWindow();
};

Scene_Debug.prototype.refreshHelpWindow = function() {
    this._debugHelpWindow.contents.clear();
    if (this._editWindow.active) {
        this._debugHelpWindow.drawTextEx(this.helpText(), 4, 0);
    }
};

Scene_Debug.prototype.helpText = function() {
    if (this._rangeWindow.mode() === 'switch') {
        return 'Enter : ON / OFF';
    } else {
        return ('Left     :  -1\n' +
                'Right    :  +1\n' +
                'Pageup   : -10\n' +
                'Pagedown : +10');
    }
};