import Scene_File from './File';
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
// Scene_Load
//
// The scene class of the load screen.
import Scene_Map from './Map';

export default function Scene_Load() {
    this.initialize.apply(this, arguments);
}

Scene_Load.prototype = Object.create(Scene_File.prototype);
Scene_Load.prototype.constructor = Scene_Load;

Scene_Load.prototype.initialize = function() {
    Scene_File.prototype.initialize.call(this);
    this._loadSuccess = false;
};

Scene_Load.prototype.terminate = function() {
    Scene_File.prototype.terminate.call(this);
    if (this._loadSuccess) {
        $gameSystem.onAfterLoad();
    }
};

Scene_Load.prototype.mode = function() {
    return 'load';
};

Scene_Load.prototype.helpWindowText = function() {
    return TextManager.loadMessage;
};

Scene_Load.prototype.firstSavefileIndex = function() {
    return DataManager.latestSavefileId() - 1;
};

Scene_Load.prototype.onSavefileOk = function() {
    Scene_File.prototype.onSavefileOk.call(this);
    if (DataManager.loadGame(this.savefileId())) {
        this.onLoadSuccess();
    } else {
        this.onLoadFailure();
    }
};

Scene_Load.prototype.onLoadSuccess = function() {
    SoundManager.playLoad();
    this.fadeOutAll();
    this.reloadMapIfUpdated();
    SceneManager.goto(Scene_Map);
    this._loadSuccess = true;
};

Scene_Load.prototype.onLoadFailure = function() {
    SoundManager.playBuzzer();
    this.activateListWindow();
};

Scene_Load.prototype.reloadMapIfUpdated = function() {
    if ($gameSystem.versionId() !== $dataSystem.versionId) {
        $gamePlayer.reserveTransfer($gameMap.mapId(), $gamePlayer.x, $gamePlayer.y);
        $gamePlayer.requestMapReload();
    }
};
