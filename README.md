# TkoolSandbox

ツクールエンジンの勝手リファクタ版

WIP: 動作保証しません。セーブ、戦闘、ショップ周りがまだ動いてないです。技術的に困難というよりかは、単純に手間の問題。現時点では既存プラグインとの互換もありません。

## 目的

- プラグイン作成のためのコードリーディング用資料
- プラグインじゃ飽き足らない人向けのスクラッチベース
- より良いエコシステムの為にコミュニティベースの叩き台
- グローバル名前空間を極力使わないように
- (将来的に)TypeScript化

## ツール

- babel
- browserify

## 構成

```
engine/src/
├── $globals.js
├── core.js
├── index.js
├── managers
│   ├── AudioManager.js
│   ├── BattleManager.js
│   ├── ConfigManager.js
│   ├── DataManager.js
│   ├── ImageManager.js
│   ├── PluginManager.js
│   ├── SceneManager.js
│   ├── SoundManager.js
│   ├── StorageManager.js
│   └── TextManager.js
├── objects
│   ├── Action.js
│   ├── ActionResult.js
│   ├── Actor.js
│   ├── Actors.js
│   ├── Battler.js
│   ├── BattlerBase.js
│   ├── Character.js
│   ├── CharacterBase.js
│   ├── CommonEvent.js
│   ├── Enemy.js
│   ├── Event.js
│   ├── Follower.js
│   ├── Followers.js
│   ├── Intercepter.js
│   ├── Item.js
│   ├── Map.js
│   ├── Message.js
│   ├── Party.js
│   ├── Picture.js
│   ├── Player.js
│   ├── Screen.js
│   ├── SelfSwitches.js
│   ├── Switches.js
│   ├── System.js
│   ├── Temp.js
│   ├── Timer.js
│   ├── Troop.js
│   ├── Unit.js
│   ├── Variables.js
│   └── Vehicle.js
├── plugins.js
├── scenes
│   ├── Base.js
│   ├── Battle.js
│   ├── Boot.js
│   ├── Debug.js
│   ├── Equip.js
│   ├── File.js
│   ├── GameEnd.js
│   ├── Gameover.js
│   ├── Item.js
│   ├── ItemBase.js
│   ├── Load.js
│   ├── Map.js
│   ├── Menu.js
│   ├── MenuBase.js
│   ├── Name.js
│   ├── Options.js
│   ├── Save.js
│   ├── Shop.js
│   ├── Skill.js
│   ├── Status.js
│   └── Title.js
├── sprites
│   ├── Actor.js
│   ├── Animation.js
│   ├── Baloon.js
│   ├── Base.js
│   ├── Battler.js
│   ├── Button.js
│   ├── Character.js
│   ├── Damage.js
│   ├── Enemy.js
│   ├── Picture.js
│   ├── SpritesetBase.js
│   ├── SpritesetBattle.js
│   ├── SpritesetMap.js
│   ├── StateIcon.js
│   ├── StateOverlay.js
│   └── Weapon.js
└── windows
    ├── ActorCommand.js
    ├── Base.js
    ├── BattleActor.js
    ├── BattleEnemy.js
    ├── BattleItem.js
    ├── BattleLog.js
    ├── BattleSkill.js
    ├── BattleStatus.js
    ├── ChoiceList.js
    ├── Command.js
    ├── DebugRange.js
    ├── EquipCommand.js
    ├── EquipItem.js
    ├── EquipSlot.js
    ├── EquipStatus.js
    ├── EventItem.js
    ├── GameEnd.js
    ├── Gold.js
    ├── Help.js
    ├── HorzCommand.js
    ├── ItemCategory.js
    ├── ItemList.js
    ├── MapName.js
    ├── MenuActor.js
    ├── MenuCommand.js
    ├── MenuStatus.js
    ├── Message.js
    ├── NameEdit.js
    ├── NameInput.js
    ├── NumberInput.js
    ├── Options.js
    ├── PartyCommand.js
    ├── SaveFileList.js
    ├── ScrollText.js
    ├── Selectable.js
    ├── ShopBuy.js
    ├── ShopCommand.js
    ├── ShopNumber.js
    ├── ShopSell.js
    ├── ShopStatus.js
    ├── SkillList.js
    ├── SkillStatus.js
    ├── SkillType.js
    ├── Status.js
    └── TitleCommand.js

5 directories, 126 files
```
