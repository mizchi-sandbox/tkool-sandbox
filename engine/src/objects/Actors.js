import Game_Actor from './Actor';

//-----------------------------------------------------------------------------
// Game_Actors
//
// The wrapper class for an actor array.

export default function Game_Actors() {
    this.initialize.apply(this, arguments);
}

Game_Actors.prototype.initialize = function() {
    this._data = [];
};

Game_Actors.prototype.actor = function(actorId) {
    if ($dataActors[actorId]) {
        if (!this._data[actorId]) {
            this._data[actorId] = new Game_Actor(actorId);
        }
        return this._data[actorId];
    }
    return null;
};
