(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
// require("./js/libs/pixi");
// require("./js/libs/fpsmeter");
// require("./js/libs/lz-string");
"use strict";

require("./js/core");
require("./js/managers");
require("./js/objects");
require("./js/scenes");
require("./js/sprites");
require("./js/windows");
require("./js/plugins");
require("./js/main");

},{"./js/core":4,"./js/main":5,"./js/managers":6,"./js/objects":7,"./js/plugins":8,"./js/scenes":9,"./js/sprites":10,"./js/windows":11}],4:[function(require,module,exports){
//=============================================================================
// rpg_core.js
//=============================================================================
//-----------------------------------------------------------------------------
/**
 * This is not a class, but contains some methods that will be added to the
 * standard Javascript objects.
 *
 * @class JsExtensions
 */'use strict';Object.defineProperty(exports,'__esModule',{value:true});exports.JsExtensions = JsExtensions;exports.Utils = Utils;exports.Point = Point;exports.Rectangle = Rectangle;exports.Bitmap = Bitmap;exports.Graphics = Graphics;exports.Input = Input;exports.TouchInput = TouchInput;exports.Sprite = Sprite;exports.Tilemap = Tilemap;exports.TilingSprite = TilingSprite;exports.ScreenSprite = ScreenSprite;exports.Window = Window;exports.WindowLayer = WindowLayer;exports.Weather = Weather;exports.ToneFilter = ToneFilter;exports.ToneSprite = ToneSprite;exports.Stage = Stage;exports.WebAudio = WebAudio;exports.Html5Audio = Html5Audio;exports.JsonEx = JsonEx;function JsExtensions(){throw new Error('This is not a class');} /**
 * Returns a number whose value is limited to the given range.
 *
 * @method Number.prototype.clamp
 * @param {Number} min The lower boundary
 * @param {Number} max The upper boundary
 * @return {Number} A number in the range (min, max)
 */Number.prototype.clamp = function(min,max){return Math.min(Math.max(this,min),max);}; /**
 * Returns a modulo value which is always positive.
 *
 * @method Number.prototype.mod
 * @param {Number} n The divisor
 * @return {Number} A modulo value
 */Number.prototype.mod = function(n){return (this % n + n) % n;}; /**
 * Replaces %1, %2 and so on in the string to the arguments.
 *
 * @method String.prototype.format
 * @param {Any} ...args The objects to format
 * @return {String} A formatted string
 */String.prototype.format = function(){var args=arguments;return this.replace(/%([0-9]+)/g,function(s,n){return args[Number(n) - 1];});}; /**
 * Makes a number string with leading zeros.
 *
 * @method String.prototype.padZero
 * @param {Number} length The length of the output string
 * @return {String} A string with leading zeros
 */String.prototype.padZero = function(length){var s=this;while(s.length < length) {s = '0' + s;}return s;}; /**
 * Makes a number string with leading zeros.
 *
 * @method Number.prototype.padZero
 * @param {Number} length The length of the output string
 * @return {String} A string with leading zeros
 */Number.prototype.padZero = function(length){return String(this).padZero(length);}; /**
 * Checks whether the two arrays are same.
 *
 * @method Array.prototype.equals
 * @param {Array} array The array to compare to
 * @return {Boolean} True if the two arrays are same
 */Array.prototype.equals = function(array){if(!array || this.length !== array.length){return false;}for(var i=0;i < this.length;i++) {if(this[i] instanceof Array && array[i] instanceof Array){if(!this[i].equals(array[i])){return false;}}else if(this[i] !== array[i]){return false;}}return true;}; /**
 * Makes a shallow copy of the array.
 *
 * @method Array.prototype.clone
 * @return {Array} A shallow copy of the array
 */Array.prototype.clone = function(){return this.slice(0);}; /**
 * Checks whether the array contains a given element.
 *
 * @method Array.prototype.contains
 * @param {Any} element The element to search for
 * @return {Boolean} True if the array contains a given element
 */Array.prototype.contains = function(element){return this.indexOf(element) >= 0;}; /**
 * Checks whether the string contains a given string.
 *
 * @method String.prototype.contains
 * @param {String} string The string to search for
 * @return {Boolean} True if the string contains a given string
 */String.prototype.contains = function(string){return this.indexOf(string) >= 0;}; /**
 * Generates a random integer in the range (0, max-1).
 *
 * @static
 * @method Math.randomInt
 * @param {Number} max The upper boundary (excluded)
 * @return {Number} A random integer
 */Math.randomInt = function(max){return Math.floor(max * Math.random());}; //-----------------------------------------------------------------------------
/**
 * The static class that defines utility methods.
 *
 * @class Utils
 */function Utils(){throw new Error('This is a static class');} /**
 * The name of the RPG Maker. 'MV' in the current version.
 *
 * @static
 * @property RPGMAKER_NAME
 * @type String
 * @final
 */Utils.RPGMAKER_NAME = 'MV'; /**
 * Checks whether the option is in the query string.
 *
 * @static
 * @method isOptionValid
 * @param {String} name The option name
 * @return {Boolean} True if the option is in the query string
 */Utils.isOptionValid = function(name){return location.search.slice(1).split('&').contains(name);}; /**
 * Checks whether the platform is NW.js.
 *
 * @static
 * @method isNwjs
 * @return {Boolean} True if the platform is NW.js
 */Utils.isNwjs = function(){return false; // TODO
// return typeof require === 'function' && typeof process === 'object';
}; /**
 * Checks whether the platform is a mobile device.
 *
 * @static
 * @method isMobileDevice
 * @return {Boolean} True if the platform is a mobile device
 */Utils.isMobileDevice = function(){var r=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;return !!navigator.userAgent.match(r);}; /**
 * Checks whether the browser is Mobile Safari.
 *
 * @static
 * @method isMobileSafari
 * @return {Boolean} True if the browser is Mobile Safari
 */Utils.isMobileSafari = function(){var agent=navigator.userAgent;return !!(agent.match(/iPhone|iPad|iPod/) && agent.match(/AppleWebKit/) && !agent.match('CriOS'));}; /**
 * Checks whether the browser is Android Chrome.
 *
 * @static
 * @method isAndroidChrome
 * @return {Boolean} True if the browser is Android Chrome
 */Utils.isAndroidChrome = function(){var agent=navigator.userAgent;return !!(agent.match(/Android/) && agent.match(/Chrome/));}; /**
 * Checks whether the browser can read files in the game folder.
 *
 * @static
 * @method canReadGameFiles
 * @return {Boolean} True if the browser can read files in the game folder
 */Utils.canReadGameFiles = function(){var scripts=document.getElementsByTagName('script');var lastScript=scripts[scripts.length - 1];var xhr=new XMLHttpRequest();try{xhr.open('GET',lastScript.src);xhr.overrideMimeType('text/javascript');xhr.send();return true;}catch(e) {return false;}}; /**
 * Makes a CSS color string from RGB values.
 *
 * @static
 * @method rgbToCssColor
 * @param {Number} r The red value in the range (0, 255)
 * @param {Number} g The green value in the range (0, 255)
 * @param {Number} b The blue value in the range (0, 255)
 * @return {String} CSS color string
 */Utils.rgbToCssColor = function(r,g,b){r = Math.round(r);g = Math.round(g);b = Math.round(b);return 'rgb(' + r + ',' + g + ',' + b + ')';}; //-----------------------------------------------------------------------------
/**
 * The point class.
 *
 * @class Point
 * @constructor
 * @param {Number} x The x coordinate
 * @param {Number} y The y coordinate
 */function Point(){this.initialize.apply(this,arguments);}Point.prototype = Object.create(PIXI.Point.prototype);Point.prototype.constructor = Point;Point.prototype.initialize = function(x,y){PIXI.Point.call(this,x,y);}; /**
 * The x coordinate.
 *
 * @property x
 * @type Number
 */ /**
 * The y coordinate.
 *
 * @property y
 * @type Number
 */ //-----------------------------------------------------------------------------
/**
 * The rectangle class.
 *
 * @class Rectangle
 * @constructor
 * @param {Number} x The x coordinate for the upper-left corner
 * @param {Number} y The y coordinate for the upper-left corner
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 */function Rectangle(){this.initialize.apply(this,arguments);}Rectangle.prototype = Object.create(PIXI.Rectangle.prototype);Rectangle.prototype.constructor = Rectangle;Rectangle.prototype.initialize = function(x,y,width,height){PIXI.Rectangle.call(this,x,y,width,height);}; /**
 * @static
 * @property emptyRectangle
 * @type Rectangle
 * @private
 */Rectangle.emptyRectangle = new Rectangle(0,0,0,0); /**
 * The x coordinate for the upper-left corner.
 *
 * @property x
 * @type Number
 */ /**
 * The y coordinate for the upper-left corner.
 *
 * @property y
 * @type Number
 */ /**
 * The width of the rectangle.
 *
 * @property width
 * @type Number
 */ /**
 * The height of the rectangle.
 *
 * @property height
 * @type Number
 */ //-----------------------------------------------------------------------------
/**
 * The basic object that represents an image.
 *
 * @class Bitmap
 * @constructor
 * @param {Number} width The width of the bitmap
 * @param {Number} height The height of the bitmap
 */function Bitmap(){this.initialize.apply(this,arguments);}Bitmap.prototype.initialize = function(width,height){this._canvas = document.createElement('canvas');this._context = this._canvas.getContext('2d');this._canvas.width = Math.max(width || 0,1);this._canvas.height = Math.max(height || 0,1);this._baseTexture = new PIXI.BaseTexture(this._canvas);this._baseTexture.scaleMode = PIXI.scaleModes.NEAREST;this._image = null;this._url = '';this._paintOpacity = 255;this._smooth = false;this._loadListeners = [];this._isLoading = false;this._hasError = false; /**
     * The face name of the font.
     *
     * @property fontFace
     * @type String
     */this.fontFace = 'GameFont'; /**
     * The size of the font in pixels.
     *
     * @property fontSize
     * @type Number
     */this.fontSize = 28; /**
     * Whether the font is italic.
     *
     * @property fontItalic
     * @type Boolean
     */this.fontItalic = false; /**
     * The color of the text in CSS format.
     *
     * @property textColor
     * @type String
     */this.textColor = '#ffffff'; /**
     * The color of the outline of the text in CSS format.
     *
     * @property outlineColor
     * @type String
     */this.outlineColor = 'rgba(0, 0, 0, 0.5)'; /**
     * The width of the outline of the text.
     *
     * @property outlineWidth
     * @type Number
     */this.outlineWidth = 4;}; /**
 * Loads a image file and returns a new bitmap object.
 *
 * @static
 * @method load
 * @param {String} url The image url of the texture
 * @return Bitmap
 */Bitmap.load = function(url){var bitmap=new Bitmap();bitmap._image = new Image();bitmap._image.src = url;bitmap._image.onload = Bitmap.prototype._onLoad.bind(bitmap);bitmap._image.onerror = Bitmap.prototype._onError.bind(bitmap);bitmap._url = url;bitmap._isLoading = true;return bitmap;}; /**
 * Takes a snapshot of the game screen and returns a new bitmap object.
 *
 * @static
 * @method snap
 * @param {Stage} stage The stage object
 * @return Bitmap
 */Bitmap.snap = function(stage){var width=Graphics.width;var height=Graphics.height;var bitmap=new Bitmap(width,height);var context=bitmap._context;var renderTexture=new PIXI.RenderTexture(width,height);if(stage){renderTexture.render(stage);stage.worldTransform.identity();}if(Graphics.isWebGL()){var gl=renderTexture.renderer.gl;var webGLPixels=new Uint8Array(4 * width * height);gl.bindFramebuffer(gl.FRAMEBUFFER,renderTexture.textureBuffer.frameBuffer);gl.readPixels(0,0,width,height,gl.RGBA,gl.UNSIGNED_BYTE,webGLPixels);gl.bindFramebuffer(gl.FRAMEBUFFER,null);var canvasData=context.getImageData(0,0,width,height);canvasData.data.set(webGLPixels);context.putImageData(canvasData,0,0);}else {context.drawImage(renderTexture.textureBuffer.canvas,0,0);}bitmap._setDirty();return bitmap;}; /**
 * Checks whether the bitmap is ready to render.
 *
 * @method isReady
 * @return {Boolean} True if the bitmap is ready to render
 */Bitmap.prototype.isReady = function(){return !this._isLoading;}; /**
 * Checks whether a loading error has occurred.
 *
 * @method isError
 * @return {Boolean} True if a loading error has occurred
 */Bitmap.prototype.isError = function(){return this._hasError;}; /**
 * [read-only] The url of the image file.
 *
 * @property url
 * @type String
 */Object.defineProperty(Bitmap.prototype,'url',{get:function get(){return this._url;},configurable:true}); /**
 * [read-only] The base texture that holds the image.
 *
 * @property baseTexture
 * @type PIXI.BaseTexture
 */Object.defineProperty(Bitmap.prototype,'baseTexture',{get:function get(){return this._baseTexture;},configurable:true}); /**
 * [read-only] The bitmap canvas.
 *
 * @property canvas
 * @type HTMLCanvasElement
 */Object.defineProperty(Bitmap.prototype,'canvas',{get:function get(){return this._canvas;},configurable:true}); /**
 * [read-only] The 2d context of the bitmap canvas.
 *
 * @property context
 * @type CanvasRenderingContext2D
 */Object.defineProperty(Bitmap.prototype,'context',{get:function get(){return this._context;},configurable:true}); /**
 * [read-only] The width of the bitmap.
 *
 * @property width
 * @type Number
 */Object.defineProperty(Bitmap.prototype,'width',{get:function get(){return this._isLoading?0:this._canvas.width;},configurable:true}); /**
 * [read-only] The height of the bitmap.
 *
 * @property height
 * @type Number
 */Object.defineProperty(Bitmap.prototype,'height',{get:function get(){return this._isLoading?0:this._canvas.height;},configurable:true}); /**
 * [read-only] The rectangle of the bitmap.
 *
 * @property rect
 * @type Rectangle
 */Object.defineProperty(Bitmap.prototype,'rect',{get:function get(){return new Rectangle(0,0,this.width,this.height);},configurable:true}); /**
 * Whether the smooth scaling is applied.
 *
 * @property smooth
 * @type Boolean
 */Object.defineProperty(Bitmap.prototype,'smooth',{get:function get(){return this._smooth;},set:function set(value){if(this._smooth !== value){this._smooth = value;if(this._smooth){this._baseTexture.scaleMode = PIXI.scaleModes.LINEAR;}else {this._baseTexture.scaleMode = PIXI.scaleModes.NEAREST;}}},configurable:true}); /**
 * The opacity of the drawing object in the range (0, 255).
 *
 * @property paintOpacity
 * @type Number
 */Object.defineProperty(Bitmap.prototype,'paintOpacity',{get:function get(){return this._paintOpacity;},set:function set(value){if(this._paintOpacity !== value){this._paintOpacity = value;this._context.globalAlpha = this._paintOpacity / 255;}},configurable:true}); /**
 * Resizes the bitmap.
 *
 * @method resize
 * @param {Number} width The new width of the bitmap
 * @param {Number} height The new height of the bitmap
 */Bitmap.prototype.resize = function(width,height){width = Math.max(width || 0,1);height = Math.max(height || 0,1);this._canvas.width = width;this._canvas.height = height;this._baseTexture.width = width;this._baseTexture.height = height;}; /**
 * Performs a block transfer.
 *
 * @method blt
 * @param {Bitmap} source The bitmap to draw
 * @param {Number} sx The x coordinate in the source
 * @param {Number} sy The y coordinate in the source
 * @param {Number} sw The width of the source image
 * @param {Number} sh The height of the source image
 * @param {Number} dx The x coordinate in the destination
 * @param {Number} dy The y coordinate in the destination
 * @param {Number} [dw=sw] The width to draw the image in the destination
 * @param {Number} [dh=sh] The height to draw the image in the destination
 */Bitmap.prototype.blt = function(source,sx,sy,sw,sh,dx,dy,dw,dh){dw = dw || sw;dh = dh || sh;if(sx >= 0 && sy >= 0 && sw > 0 && sh > 0 && dw > 0 && dh > 0 && sx + sw <= source.width && sy + sh <= source.height){this._context.globalCompositeOperation = 'source-over';this._context.drawImage(source._canvas,sx,sy,sw,sh,dx,dy,dw,dh);this._setDirty();}}; /**
 * Returns pixel color at the specified point.
 *
 * @method getPixel
 * @param {Number} x The x coordinate of the pixel in the bitmap
 * @param {Number} y The y coordinate of the pixel in the bitmap
 * @return {String} The pixel color (hex format)
 */Bitmap.prototype.getPixel = function(x,y){var data=this._context.getImageData(x,y,1,1).data;var result='#';for(var i=0;i < 3;i++) {result += data[i].toString(16).padZero(2);}return result;}; /**
 * Returns alpha pixel value at the specified point.
 *
 * @method getAlphaPixel
 * @param {Number} x The x coordinate of the pixel in the bitmap
 * @param {Number} y The y coordinate of the pixel in the bitmap
 * @return {String} The alpha value
 */Bitmap.prototype.getAlphaPixel = function(x,y){var data=this._context.getImageData(x,y,1,1).data;return data[3];}; /**
 * Clears the specified rectangle.
 *
 * @method clearRect
 * @param {Number} x The x coordinate for the upper-left corner
 * @param {Number} y The y coordinate for the upper-left corner
 * @param {Number} width The width of the rectangle to clear
 * @param {Number} height The height of the rectangle to clear
 */Bitmap.prototype.clearRect = function(x,y,width,height){this._context.clearRect(x,y,width,height);this._setDirty();}; /**
 * Clears the entire bitmap.
 *
 * @method clear
 */Bitmap.prototype.clear = function(){this.clearRect(0,0,this.width,this.height);}; /**
 * Fills the specified rectangle.
 *
 * @method fillRect
 * @param {Number} x The x coordinate for the upper-left corner
 * @param {Number} y The y coordinate for the upper-left corner
 * @param {Number} width The width of the rectangle to clear
 * @param {Number} height The height of the rectangle to clear
 * @param {String} color The color of the rectangle in CSS format
 */Bitmap.prototype.fillRect = function(x,y,width,height,color){var context=this._context;context.save();context.fillStyle = color;context.fillRect(x,y,width,height);context.restore();this._setDirty();}; /**
 * Fills the entire bitmap.
 *
 * @method fillAll
 * @param {String} color The color of the rectangle in CSS format
 */Bitmap.prototype.fillAll = function(color){this.fillRect(0,0,this.width,this.height,color);}; /**
 * Draws the rectangle with a gradation.
 *
 * @method gradientFillRect
 * @param {Number} x The x coordinate for the upper-left corner
 * @param {Number} y The y coordinate for the upper-left corner
 * @param {Number} width The width of the rectangle to clear
 * @param {Number} height The height of the rectangle to clear
 * @param {String} color1 The start color of the gradation
 * @param {String} color2 The end color of the gradation
 * @param {Boolean} vertical Whether it draws a vertical gradient
 */Bitmap.prototype.gradientFillRect = function(x,y,width,height,color1,color2,vertical){var context=this._context;var grad;if(vertical){grad = context.createLinearGradient(x,y,x,y + height);}else {grad = context.createLinearGradient(x,y,x + width,y);}grad.addColorStop(0,color1);grad.addColorStop(1,color2);context.save();context.fillStyle = grad;context.fillRect(x,y,width,height);context.restore();this._setDirty();}; /**
 * Draw the filled circle.
 *
 * @method drawCircle
 * @param {Number} x The x coordinate of the center of the circle
 * @param {Number} y The y coordinate of the center of the circle
 * @param {Number} radius The radius of the circle
 * @param {String} color The color of the circle in CSS format
 */Bitmap.prototype.drawCircle = function(x,y,radius,color){var context=this._context;context.save();context.fillStyle = color;context.beginPath();context.arc(x,y,radius,0,Math.PI * 2,false);context.fill();context.restore();this._setDirty();}; /**
 * Draws the outline text to the bitmap.
 *
 * @method drawText
 * @param {String} text The text that will be drawn
 * @param {Number} x The x coordinate for the left of the text
 * @param {Number} y The y coordinate for the top of the text
 * @param {Number} maxWidth The maximum allowed width of the text
 * @param {Number} lineHeight The height of the text line
 * @param {String} align The alignment of the text
 */Bitmap.prototype.drawText = function(text,x,y,maxWidth,lineHeight,align){ // Note: Firefox has a bug with textBaseline: Bug 737852
//       So we use 'alphabetic' here.
if(text !== undefined){var tx=x;var ty=y + lineHeight - (lineHeight - this.fontSize * 0.7) / 2;var context=this._context;var alpha=context.globalAlpha;maxWidth = maxWidth || 0xffffffff;if(align === 'center'){tx += maxWidth / 2;}if(align === 'right'){tx += maxWidth;}context.save();context.font = this._makeFontNameText();context.textAlign = align;context.textBaseline = 'alphabetic';context.globalAlpha = 1;this._drawTextOutline(text,tx,ty,maxWidth);context.globalAlpha = alpha;this._drawTextBody(text,tx,ty,maxWidth);context.restore();this._setDirty();}}; /**
 * Returns the width of the specified text.
 *
 * @method measureTextWidth
 * @param {String} text The text to be measured
 * @return {Number} The width of the text in pixels
 */Bitmap.prototype.measureTextWidth = function(text){var context=this._context;context.save();context.font = this._makeFontNameText();var width=context.measureText(text).width;context.restore();return width;}; /**
 * Changes the color tone of the entire bitmap.
 *
 * @method adjustTone
 * @param {Number} r The red strength in the range (-255, 255)
 * @param {Number} g The green strength in the range (-255, 255)
 * @param {Number} b The blue strength in the range (-255, 255)
 */Bitmap.prototype.adjustTone = function(r,g,b){if((r || g || b) && this.width > 0 && this.height > 0){var context=this._context;var imageData=context.getImageData(0,0,this.width,this.height);var pixels=imageData.data;for(var i=0;i < pixels.length;i += 4) {pixels[i + 0] += r;pixels[i + 1] += g;pixels[i + 2] += b;}context.putImageData(imageData,0,0);this._setDirty();}}; /**
 * Rotates the hue of the entire bitmap.
 *
 * @method rotateHue
 * @param {Number} offset The hue offset in 360 degrees
 */Bitmap.prototype.rotateHue = function(offset){function rgbToHsl(r,g,b){var cmin=Math.min(r,g,b);var cmax=Math.max(r,g,b);var h=0;var s=0;var l=(cmin + cmax) / 2;var delta=cmax - cmin;if(delta > 0){if(r === cmax){h = 60 * (((g - b) / delta + 6) % 6);}else if(g === cmax){h = 60 * ((b - r) / delta + 2);}else {h = 60 * ((r - g) / delta + 4);}s = delta / (255 - Math.abs(2 * l - 255));}return [h,s,l];}function hslToRgb(h,s,l){var c=(255 - Math.abs(2 * l - 255)) * s;var x=c * (1 - Math.abs(h / 60 % 2 - 1));var m=l - c / 2;var cm=c + m;var xm=x + m;if(h < 60){return [cm,xm,m];}else if(h < 120){return [xm,cm,m];}else if(h < 180){return [m,cm,xm];}else if(h < 240){return [m,xm,cm];}else if(h < 300){return [xm,m,cm];}else {return [cm,m,xm];}}if(offset && this.width > 0 && this.height > 0){offset = (offset % 360 + 360) % 360;var context=this._context;var imageData=context.getImageData(0,0,this.width,this.height);var pixels=imageData.data;for(var i=0;i < pixels.length;i += 4) {var hsl=rgbToHsl(pixels[i + 0],pixels[i + 1],pixels[i + 2]);var h=(hsl[0] + offset) % 360;var s=hsl[1];var l=hsl[2];var rgb=hslToRgb(h,s,l);pixels[i + 0] = rgb[0];pixels[i + 1] = rgb[1];pixels[i + 2] = rgb[2];}context.putImageData(imageData,0,0);this._setDirty();}}; /**
 * Applies a blur effect to the bitmap.
 *
 * @method blur
 */Bitmap.prototype.blur = function(){for(var i=0;i < 2;i++) {var w=this.width;var h=this.height;var canvas=this._canvas;var context=this._context;var tempCanvas=document.createElement('canvas');var tempContext=tempCanvas.getContext('2d');tempCanvas.width = w + 2;tempCanvas.height = h + 2;tempContext.drawImage(canvas,0,0,w,h,1,1,w,h);tempContext.drawImage(canvas,0,0,w,1,1,0,w,1);tempContext.drawImage(canvas,0,0,1,h,0,1,1,h);tempContext.drawImage(canvas,0,h - 1,w,1,1,h + 1,w,1);tempContext.drawImage(canvas,w - 1,0,1,h,w + 1,1,1,h);context.save();context.fillStyle = 'black';context.fillRect(0,0,w,h);context.globalCompositeOperation = 'lighter';context.globalAlpha = 1 / 9;for(var y=0;y < 3;y++) {for(var x=0;x < 3;x++) {context.drawImage(tempCanvas,x,y,w,h,0,0,w,h);}}context.restore();}this._setDirty();}; /**
 * Add a callback function that will be called when the bitmap is loaded.
 *
 * @method addLoadListener
 * @param {Function} listner The callback function
 */Bitmap.prototype.addLoadListener = function(listner){if(this._isLoading){this._loadListeners.push(listner);}else {listner();}}; /**
 * @method _makeFontNameText
 * @private
 */Bitmap.prototype._makeFontNameText = function(){return (this.fontItalic?'Italic ':'') + this.fontSize + 'px ' + this.fontFace;}; /**
 * @method _drawTextOutline
 * @param {String} text
 * @param {Number} tx
 * @param {Number} ty
 * @param {Number} maxWidth
 * @private
 */Bitmap.prototype._drawTextOutline = function(text,tx,ty,maxWidth){var context=this._context;context.strokeStyle = this.outlineColor;context.lineWidth = this.outlineWidth;context.lineJoin = 'round';context.strokeText(text,tx,ty,maxWidth);}; /**
 * @method _drawTextBody
 * @param {String} text
 * @param {Number} tx
 * @param {Number} ty
 * @param {Number} maxWidth
 * @private
 */Bitmap.prototype._drawTextBody = function(text,tx,ty,maxWidth){var context=this._context;context.fillStyle = this.textColor;context.fillText(text,tx,ty,maxWidth);}; /**
 * @method _onLoad
 * @private
 */Bitmap.prototype._onLoad = function(){this._isLoading = false;this.resize(this._image.width,this._image.height);this._context.drawImage(this._image,0,0);this._setDirty();this._callLoadListeners();}; /**
 * @method _callLoadListeners
 * @private
 */Bitmap.prototype._callLoadListeners = function(){while(this._loadListeners.length > 0) {var listener=this._loadListeners.shift();listener();}}; /**
 * @method _onError
 * @private
 */Bitmap.prototype._onError = function(){this._hasError = true;}; /**
 * @method _setDirty
 * @private
 */Bitmap.prototype._setDirty = function(){this._baseTexture.dirty();}; //-----------------------------------------------------------------------------
/**
 * The static class that carries out graphics processing.
 *
 * @class Graphics
 */function Graphics(){throw new Error('This is a static class');} /**
 * Initializes the graphics system.
 *
 * @static
 * @method initialize
 * @param {Number} width The width of the game screen
 * @param {Number} height The height of the game screen
 * @param {String} type The type of the renderer.
 *                 'canvas', 'webgl', or 'auto'.
 */Graphics.initialize = function(width,height,type){this._width = width || 800;this._height = height || 600;this._rendererType = type || 'auto';this._boxWidth = this._width;this._boxHeight = this._height;this._scale = 1;this._realScale = 1;this._errorPrinter = null;this._canvas = null;this._video = null;this._upperCanvas = null;this._renderer = null;this._fpsMeter = null;this._modeBox = null;this._skipCount = 0;this._maxSkip = 3;this._rendered = false;this._loadingImage = null;this._loadingCount = 0;this._fpsMeterToggled = false;this._stretchEnabled = this._defaultStretchMode();this._canUseDifferenceBlend = false;this._canUseSaturationBlend = false;this._hiddenCanvas = null;this._testCanvasBlendModes();this._modifyExistingElements();this._updateRealScale();this._createAllElements();this._disableTextSelection();this._disableContextMenu();this._setupEventHandlers();}; /**
 * The total frame count of the game screen.
 *
 * @static
 * @property frameCount
 * @type Number
 */Graphics.frameCount = 0; /**
 * The alias of PIXI.blendModes.NORMAL.
 *
 * @static
 * @property BLEND_NORMAL
 * @type Number
 * @final
 */Graphics.BLEND_NORMAL = 0; /**
 * The alias of PIXI.blendModes.ADD.
 *
 * @static
 * @property BLEND_ADD
 * @type Number
 * @final
 */Graphics.BLEND_ADD = 1; /**
 * The alias of PIXI.blendModes.MULTIPLY.
 *
 * @static
 * @property BLEND_MULTIPLY
 * @type Number
 * @final
 */Graphics.BLEND_MULTIPLY = 2; /**
 * The alias of PIXI.blendModes.SCREEN.
 *
 * @static
 * @property BLEND_SCREEN
 * @type Number
 * @final
 */Graphics.BLEND_SCREEN = 3; /**
 * Marks the beginning of each frame for FPSMeter.
 *
 * @static
 * @method tickStart
 */Graphics.tickStart = function(){if(this._fpsMeter){this._fpsMeter.tickStart();}}; /**
 * Marks the end of each frame for FPSMeter.
 *
 * @static
 * @method tickEnd
 */Graphics.tickEnd = function(){if(this._fpsMeter && this._rendered){this._fpsMeter.tick();}}; /**
 * Renders the stage to the game screen.
 *
 * @static
 * @method render
 * @param {Stage} stage The stage object to be rendered
 */Graphics.render = function(stage){if(this._skipCount === 0){var startTime=Date.now();if(stage){this._renderer.render(stage);}var endTime=Date.now();var elapsed=endTime - startTime;this._skipCount = Math.min(Math.floor(elapsed / 15),this._maxSkip);this._rendered = true;}else {this._skipCount--;this._rendered = false;}this.frameCount++;}; /**
 * Checks whether the renderer type is WebGL.
 *
 * @static
 * @method isWebGL
 * @return {Boolean} True if the renderer type is WebGL
 */Graphics.isWebGL = function(){return this._renderer && this._renderer.type === PIXI.WEBGL_RENDERER;}; /**
 * Checks whether the current browser supports WebGL.
 *
 * @static
 * @method hasWebGL
 * @return {Boolean} True if the current browser supports WebGL.
 */Graphics.hasWebGL = function(){try{var canvas=document.createElement('canvas');return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));}catch(e) {return false;}}; /**
 * Checks whether the canvas blend mode 'difference' is supported.
 *
 * @static
 * @method canUseDifferenceBlend
 * @return {Boolean} True if the canvas blend mode 'difference' is supported
 */Graphics.canUseDifferenceBlend = function(){return this._canUseDifferenceBlend;}; /**
 * Checks whether the canvas blend mode 'saturation' is supported.
 *
 * @static
 * @method canUseSaturationBlend
 * @return {Boolean} True if the canvas blend mode 'saturation' is supported
 */Graphics.canUseSaturationBlend = function(){return this._canUseSaturationBlend;}; /**
 * Sets the source of the "Now Loading" image.
 *
 * @static
 * @method setLoadingImage
 */Graphics.setLoadingImage = function(src){this._loadingImage = new Image();this._loadingImage.src = src;}; /**
 * Initializes the counter for displaying the "Now Loading" image.
 *
 * @static
 * @method startLoading
 */Graphics.startLoading = function(){this._loadingCount = 0;}; /**
 * Increments the loading counter and displays the "Now Loading" image if necessary.
 *
 * @static
 * @method updateLoading
 */Graphics.updateLoading = function(){this._loadingCount++;this._paintUpperCanvas();this._upperCanvas.style.opacity = 1;}; /**
 * Erases the "Now Loading" image.
 *
 * @static
 * @method endLoading
 */Graphics.endLoading = function(){this._clearUpperCanvas();this._upperCanvas.style.opacity = 0;}; /**
 * Displays the error text to the screen.
 *
 * @static
 * @method printError
 * @param {String} name The name of the error
 * @param {String} message The message of the error
 */Graphics.printError = function(name,message){if(this._errorPrinter){this._errorPrinter.innerHTML = this._makeErrorHtml(name,message);}this._applyCanvasFilter();this._clearUpperCanvas();}; /**
 * Shows the FPSMeter element.
 *
 * @static
 * @method showFps
 */Graphics.showFps = function(){if(this._fpsMeter){this._fpsMeter.show();this._modeBox.style.opacity = 1;}}; /**
 * Hides the FPSMeter element.
 *
 * @static
 * @method hideFps
 */Graphics.hideFps = function(){if(this._fpsMeter){this._fpsMeter.hide();this._modeBox.style.opacity = 0;}}; /**
 * Loads a font file.
 *
 * @static
 * @method loadFont
 * @param {String} name The face name of the font
 * @param {String} url The url of the font file
 */Graphics.loadFont = function(name,url){var style=document.createElement('style');var head=document.getElementsByTagName('head');var rule='@font-face { font-family: "' + name + '"; src: url("' + url + '"); }';style.type = 'text/css';head.item(0).appendChild(style);style.sheet.insertRule(rule,0);this._createFontLoader(name);}; /**
 * Checks whether the font file is loaded.
 *
 * @static
 * @method isFontLoaded
 * @param {String} name The face name of the font
 * @return {Boolean} True if the font file is loaded
 */Graphics.isFontLoaded = function(name){if(!this._hiddenCanvas){this._hiddenCanvas = document.createElement('canvas');}var context=this._hiddenCanvas.getContext('2d');var text='abcdefghijklmnopqrstuvwxyz';var width1,width2;context.font = '40px ' + name + ', sans-serif';width1 = context.measureText(text).width;context.font = '40px sans-serif';width2 = context.measureText(text).width;return width1 !== width2;}; /**
 * Starts playback of a video.
 *
 * @static
 * @method playVideo
 * @param {String} src
 */Graphics.playVideo = function(src){this._video.src = src;this._video.onloadeddata = this._onVideoLoad.bind(this);this._video.onerror = this._onVideoError.bind(this);this._video.onended = this._onVideoEnd.bind(this);this._video.load();}; /**
 * Checks whether the video is playing.
 *
 * @static
 * @method isVideoPlaying
 * @return {Boolean} True if the video is playing
 */Graphics.isVideoPlaying = function(){return this._video && this._isVideoVisible();}; /**
 * Checks whether the browser can play the specified video type.
 *
 * @static
 * @method canPlayVideoType
 * @param {String} type The video type to test support for
 * @return {Boolean} True if the browser can play the specified video type
 */Graphics.canPlayVideoType = function(type){return this._video && this._video.canPlayType(type);}; /**
 * Converts an x coordinate on the page to the corresponding
 * x coordinate on the canvas area.
 *
 * @static
 * @method pageToCanvasX
 * @param {Number} x The x coordinate on the page to be converted
 * @return {Number} The x coordinate on the canvas area
 */Graphics.pageToCanvasX = function(x){if(this._canvas){var left=this._canvas.offsetLeft;return Math.round((x - left) / this._realScale);}else {return 0;}}; /**
 * Converts a y coordinate on the page to the corresponding
 * y coordinate on the canvas area.
 *
 * @static
 * @method pageToCanvasY
 * @param {Number} y The y coordinate on the page to be converted
 * @return {Number} The y coordinate on the canvas area
 */Graphics.pageToCanvasY = function(y){if(this._canvas){var top=this._canvas.offsetTop;return Math.round((y - top) / this._realScale);}else {return 0;}}; /**
 * Checks whether the specified point is inside the game canvas area.
 *
 * @static
 * @method isInsideCanvas
 * @param {Number} x The x coordinate on the canvas area
 * @param {Number} y The y coordinate on the canvas area
 * @return {Boolean} True if the specified point is inside the game canvas area
 */Graphics.isInsideCanvas = function(x,y){return x >= 0 && x < this._width && y >= 0 && y < this._height;}; /**
 * The width of the game screen.
 *
 * @static
 * @property width
 * @type Number
 */Object.defineProperty(Graphics,'width',{get:function get(){return this._width;},set:function set(value){if(this._width !== value){this._width = value;this._updateAllElements();}},configurable:true}); /**
 * The height of the game screen.
 *
 * @static
 * @property height
 * @type Number
 */Object.defineProperty(Graphics,'height',{get:function get(){return this._height;},set:function set(value){if(this._height !== value){this._height = value;this._updateAllElements();}},configurable:true}); /**
 * The width of the window display area.
 *
 * @static
 * @property boxWidth
 * @type Number
 */Object.defineProperty(Graphics,'boxWidth',{get:function get(){return this._boxWidth;},set:function set(value){this._boxWidth = value;},configurable:true}); /**
 * The height of the window display area.
 *
 * @static
 * @property boxHeight
 * @type Number
 */Object.defineProperty(Graphics,'boxHeight',{get:function get(){return this._boxHeight;},set:function set(value){this._boxHeight = value;},configurable:true}); /**
 * The zoom scale of the game screen.
 *
 * @static
 * @property scale
 * @type Number
 */Object.defineProperty(Graphics,'scale',{get:function get(){return this._scale;},set:function set(value){if(this._scale !== value){this._scale = value;this._updateAllElements();}},configurable:true}); /**
 * @static
 * @method _createAllElements
 * @private
 */Graphics._createAllElements = function(){this._createErrorPrinter();this._createCanvas();this._createVideo();this._createUpperCanvas();this._createRenderer();this._createFPSMeter();this._createModeBox();this._createGameFontLoader();}; /**
 * @static
 * @method _updateAllElements
 * @private
 */Graphics._updateAllElements = function(){this._updateRealScale();this._updateErrorPrinter();this._updateCanvas();this._updateVideo();this._updateUpperCanvas();this._updateRenderer();this._paintUpperCanvas();}; /**
 * @static
 * @method _updateRealScale
 * @private
 */Graphics._updateRealScale = function(){if(this._stretchEnabled){var h=window.innerWidth / this._width;var v=window.innerHeight / this._height;this._realScale = Math.min(h,v);}else {this._realScale = this._scale;}}; /**
 * @static
 * @method _makeErrorHtml
 * @param {String} name
 * @param {String} message
 * @return {String}
 * @private
 */Graphics._makeErrorHtml = function(name,message){return '<font color="yellow"><b>' + name + '</b></font><br>' + '<font color="white">' + message + '</font><br>';}; /**
 * @static
 * @method _defaultStretchMode
 * @private
 */Graphics._defaultStretchMode = function(){return Utils.isNwjs() || Utils.isMobileDevice();}; /**
 * @static
 * @method _testCanvasBlendModes
 * @private
 */Graphics._testCanvasBlendModes = function(){var canvas,context,imageData1,imageData2;canvas = document.createElement('canvas');canvas.width = 1;canvas.height = 1;context = canvas.getContext('2d');context.globalCompositeOperation = 'source-over';context.fillStyle = 'white';context.fillRect(0,0,1,1);context.globalCompositeOperation = 'difference';context.fillStyle = 'white';context.fillRect(0,0,1,1);imageData1 = context.getImageData(0,0,1,1);context.globalCompositeOperation = 'source-over';context.fillStyle = 'black';context.fillRect(0,0,1,1);context.globalCompositeOperation = 'saturation';context.fillStyle = 'white';context.fillRect(0,0,1,1);imageData2 = context.getImageData(0,0,1,1);this._canUseDifferenceBlend = imageData1.data[0] === 0;this._canUseSaturationBlend = imageData2.data[0] === 0;}; /**
 * @static
 * @method _modifyExistingElements
 * @private
 */Graphics._modifyExistingElements = function(){var elements=document.getElementsByTagName('*');for(var i=0;i < elements.length;i++) {if(elements[i].style.zIndex > 0){elements[i].style.zIndex = 0;}}}; /**
 * @static
 * @method _createErrorPrinter
 * @private
 */Graphics._createErrorPrinter = function(){this._errorPrinter = document.createElement('p');this._errorPrinter.id = 'ErrorPrinter';this._updateErrorPrinter();document.body.appendChild(this._errorPrinter);}; /**
 * @static
 * @method _updateErrorPrinter
 * @private
 */Graphics._updateErrorPrinter = function(){this._errorPrinter.width = this._width * 0.9;this._errorPrinter.height = 40;this._errorPrinter.style.textAlign = 'center';this._errorPrinter.style.textShadow = '1px 1px 3px #000';this._errorPrinter.style.fontSize = '20px';this._errorPrinter.style.zIndex = 99;this._centerElement(this._errorPrinter);}; /**
 * @static
 * @method _createCanvas
 * @private
 */Graphics._createCanvas = function(){this._canvas = document.createElement('canvas');this._canvas.id = 'GameCanvas';this._updateCanvas();document.body.appendChild(this._canvas);}; /**
 * @static
 * @method _updateCanvas
 * @private
 */Graphics._updateCanvas = function(){this._canvas.width = this._width;this._canvas.height = this._height;this._canvas.style.zIndex = 1;this._centerElement(this._canvas);}; /**
 * @static
 * @method _createVideo
 * @private
 */Graphics._createVideo = function(){this._video = document.createElement('video');this._video.id = 'GameVideo';this._video.style.opacity = 0;this._updateVideo();document.body.appendChild(this._video);}; /**
 * @static
 * @method _updateVideo
 * @private
 */Graphics._updateVideo = function(){this._video.width = this._width;this._video.height = this._height;this._video.style.zIndex = 2;this._centerElement(this._video);}; /**
 * @static
 * @method _createUpperCanvas
 * @private
 */Graphics._createUpperCanvas = function(){this._upperCanvas = document.createElement('canvas');this._upperCanvas.id = 'UpperCanvas';this._updateUpperCanvas();document.body.appendChild(this._upperCanvas);}; /**
 * @static
 * @method _updateUpperCanvas
 * @private
 */Graphics._updateUpperCanvas = function(){this._upperCanvas.width = this._width;this._upperCanvas.height = this._height;this._upperCanvas.style.zIndex = 3;this._centerElement(this._upperCanvas);}; /**
 * @static
 * @method _clearUpperCanvas
 * @private
 */Graphics._clearUpperCanvas = function(){var context=this._upperCanvas.getContext('2d');context.clearRect(0,0,this._width,this._height);}; /**
 * @static
 * @method _paintUpperCanvas
 * @private
 */Graphics._paintUpperCanvas = function(){this._clearUpperCanvas();if(this._loadingImage && this._loadingCount >= 20){var context=this._upperCanvas.getContext('2d');var dx=(this._width - this._loadingImage.width) / 2;var dy=(this._height - this._loadingImage.height) / 2;var alpha=((this._loadingCount - 20) / 30).clamp(0,1);context.save();context.globalAlpha = alpha;context.drawImage(this._loadingImage,dx,dy);context.restore();}}; /**
 * @static
 * @method _createRenderer
 * @private
 */Graphics._createRenderer = function(){PIXI.dontSayHello = true;var width=this._width;var height=this._height;var options={view:this._canvas};try{switch(this._rendererType){case 'canvas':this._renderer = new PIXI.CanvasRenderer(width,height,options);break;case 'webgl':this._renderer = new PIXI.WebGLRenderer(width,height,options);break;default:this._renderer = PIXI.autoDetectRenderer(width,height,options);break;}}catch(e) {this._renderer = null;}}; /**
 * @static
 * @method _updateRenderer
 * @private
 */Graphics._updateRenderer = function(){if(this._renderer){this._renderer.resize(this._width,this._height);}}; /**
 * @static
 * @method _createFPSMeter
 * @private
 */Graphics._createFPSMeter = function(){var options={graph:1,decimals:0,theme:'transparent',toggleOn:null};this._fpsMeter = new FPSMeter(options);this._fpsMeter.hide();}; /**
 * @static
 * @method _createModeBox
 * @private
 */Graphics._createModeBox = function(){var box=document.createElement('div');box.id = 'modeTextBack';box.style.position = 'absolute';box.style.left = '5px';box.style.top = '5px';box.style.width = '119px';box.style.height = '58px';box.style.background = 'rgba(0,0,0,0.2)';box.style.zIndex = 9;box.style.opacity = 0;var text=document.createElement('div');text.id = 'modeText';text.style.position = 'absolute';text.style.left = '0px';text.style.top = '41px';text.style.width = '119px';text.style.fontSize = '12px';text.style.fontFamily = 'monospace';text.style.color = 'white';text.style.textAlign = 'center';text.style.textShadow = '1px 1px 0 rgba(0,0,0,0.5)';text.innerHTML = this.isWebGL()?'WebGL mode':'Canvas mode';document.body.appendChild(box);box.appendChild(text);this._modeBox = box;}; /**
 * @static
 * @method _createGameFontLoader
 * @private
 */Graphics._createGameFontLoader = function(){this._createFontLoader('GameFont');}; /**
 * @static
 * @method _createFontLoader
 * @param {String} name
 * @private
 */Graphics._createFontLoader = function(name){var div=document.createElement('div');var text=document.createTextNode('.');div.style.fontFamily = name;div.style.fontSize = '0px';div.style.color = 'transparent';div.style.position = 'absolute';div.style.margin = 'auto';div.style.top = '0px';div.style.left = '0px';div.style.width = '1px';div.style.height = '1px';div.appendChild(text);document.body.appendChild(div);}; /**
 * @static
 * @method _centerElement
 * @param {HTMLElement} element
 * @private
 */Graphics._centerElement = function(element){var width=element.width * this._realScale;var height=element.height * this._realScale;element.style.position = 'absolute';element.style.margin = 'auto';element.style.top = 0;element.style.left = 0;element.style.right = 0;element.style.bottom = 0;element.style.width = width + 'px';element.style.height = height + 'px';}; /**
 * @static
 * @method _disableTextSelection
 * @private
 */Graphics._disableTextSelection = function(){var body=document.body;body.style.userSelect = 'none';body.style.webkitUserSelect = 'none';body.style.msUserSelect = 'none';body.style.mozUserSelect = 'none';}; /**
 * @static
 * @method _disableContextMenu
 * @private
 */Graphics._disableContextMenu = function(){var elements=document.body.getElementsByTagName('*');var oncontextmenu=function oncontextmenu(){return false;};for(var i=0;i < elements.length;i++) {elements[i].oncontextmenu = oncontextmenu;}}; /**
 * @static
 * @method _applyCanvasFilter
 * @private
 */Graphics._applyCanvasFilter = function(){if(this._canvas){this._canvas.style.opacity = 0.5;this._canvas.style.filter = 'blur(8px)';this._canvas.style.webkitFilter = 'blur(8px)';}}; /**
 * @static
 * @method _onVideoLoad
 * @private
 */Graphics._onVideoLoad = function(){this._video.play();this._updateVisibility(true);}; /**
 * @static
 * @method _onVideoError
 * @private
 */Graphics._onVideoError = function(){this._updateVisibility(false);}; /**
 * @static
 * @method _onVideoEnd
 * @private
 */Graphics._onVideoEnd = function(){this._updateVisibility(false);}; /**
 * @static
 * @method _updateVisibility
 * @param {Boolean} videoVisible
 * @private
 */Graphics._updateVisibility = function(videoVisible){this._video.style.opacity = videoVisible?1:0;this._canvas.style.opacity = videoVisible?0:1;}; /**
 * @static
 * @method _isVideoVisible
 * @return {Boolean}
 * @private
 */Graphics._isVideoVisible = function(){return this._video.style.opacity > 0;}; /**
 * @static
 * @method _setupEventHandlers
 * @private
 */Graphics._setupEventHandlers = function(){window.addEventListener('resize',this._onWindowResize.bind(this));document.addEventListener('keydown',this._onKeyDown.bind(this));}; /**
 * @static
 * @method _onWindowResize
 * @private
 */Graphics._onWindowResize = function(){this._updateAllElements();}; /**
 * @static
 * @method _onKeyDown
 * @param {KeyboardEvent} event
 * @private
 */Graphics._onKeyDown = function(event){if(!event.ctrlKey && !event.altKey){switch(event.keyCode){case 113: // F2
event.preventDefault();this._switchFPSMeter();break;case 114: // F3
event.preventDefault();this._switchStretchMode();break;case 115: // F4
event.preventDefault();this._switchFullScreen();break;}}}; /**
 * @static
 * @method _switchFPSMeter
 * @private
 */Graphics._switchFPSMeter = function(){if(this._fpsMeter.isPaused){this.showFps();this._fpsMeter.showFps();this._fpsMeterToggled = false;}else if(!this._fpsMeterToggled){this._fpsMeter.showDuration();this._fpsMeterToggled = true;}else {this.hideFps();}}; /**
 * @static
 * @method _switchStretchMode
 * @return {Boolean}
 * @private
 */Graphics._switchStretchMode = function(){this._stretchEnabled = !this._stretchEnabled;this._updateAllElements();}; /**
 * @static
 * @method _switchFullScreen
 * @private
 */Graphics._switchFullScreen = function(){if(this._isFullScreen()){this._requestFullScreen();}else {this._cancelFullScreen();}}; /**
 * @static
 * @method _isFullScreen
 * @return {Boolean}
 * @private
 */Graphics._isFullScreen = function(){return document.fullScreenElement && document.fullScreenElement !== null || !document.mozFullScreen && !document.webkitFullscreenElement && !document.msFullscreenElement;}; /**
 * @static
 * @method _requestFullScreen
 * @private
 */Graphics._requestFullScreen = function(){var element=document.body;if(element.requestFullScreen){element.requestFullScreen();}else if(element.mozRequestFullScreen){element.mozRequestFullScreen();}else if(element.webkitRequestFullScreen){element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);}else if(element.msRequestFullscreen){element.msRequestFullscreen();}}; /**
 * @static
 * @method _cancelFullScreen
 * @private
 */Graphics._cancelFullScreen = function(){if(document.cancelFullScreen){document.cancelFullScreen();}else if(document.mozCancelFullScreen){document.mozCancelFullScreen();}else if(document.webkitCancelFullScreen){document.webkitCancelFullScreen();}else if(document.msExitFullscreen){document.msExitFullscreen();}}; //-----------------------------------------------------------------------------
/**
 * The static class that handles input data from the keyboard and gamepads.
 *
 * @class Input
 */function Input(){throw new Error('This is a static class');} /**
 * Initializes the input system.
 *
 * @static
 * @method initialize
 */Input.initialize = function(){this.clear();this._wrapNwjsAlert();this._setupEventHandlers();}; /**
 * The wait time of the key repeat in frames.
 *
 * @static
 * @property keyRepeatWait
 * @type Number
 */Input.keyRepeatWait = 24; /**
 * The interval of the key repeat in frames.
 *
 * @static
 * @property keyRepeatInterval
 * @type Number
 */Input.keyRepeatInterval = 6; /**
 * A hash table to convert from a virtual key code to a mapped key name.
 *
 * @static
 * @property keyMapper
 * @type Object
 */Input.keyMapper = {9:'tab', // tab
13:'ok', // enter
16:'shift', // shift
17:'control', // control
18:'control', // alt
27:'escape', // escape
32:'ok', // space
33:'pageup', // pageup
34:'pagedown', // pagedown
37:'left', // left arrow
38:'up', // up arrow
39:'right', // right arrow
40:'down', // down arrow
45:'escape', // insert
81:'pageup', // Q
87:'pagedown', // W
88:'escape', // X
90:'ok', // Z
96:'escape', // numpad 0
98:'down', // numpad 2
100:'left', // numpad 4
102:'right', // numpad 6
104:'up', // numpad 8
120:'debug' // F9
}; /**
 * A hash table to convert from a gamepad button to a mapped key name.
 *
 * @static
 * @property gamepadMapper
 * @type Object
 */Input.gamepadMapper = {0:'ok', // A
1:'cancel', // B
2:'shift', // X
3:'menu', // Y
4:'pageup', // LB
5:'pagedown', // RB
12:'up', // D-pad up
13:'down', // D-pad down
14:'left', // D-pad left
15:'right'}; /**
 * Clears all the input data.
 *
 * @static
 * @method clear
 */ // D-pad right
Input.clear = function(){this._currentState = {};this._previousState = {};this._gamepadStates = [];this._latestButton = null;this._pressedTime = 0;this._dir4 = 0;this._dir8 = 0;this._preferredAxis = '';this._date = 0;}; /**
 * Updates the input data.
 *
 * @static
 * @method update
 */Input.update = function(){this._pollGamepads();if(this._currentState[this._latestButton]){this._pressedTime++;}else {this._latestButton = null;}for(var name in this._currentState) {if(this._currentState[name] && !this._previousState[name]){this._latestButton = name;this._pressedTime = 0;this._date = Date.now();}this._previousState[name] = this._currentState[name];}this._updateDirection();}; /**
 * Checks whether a key is currently pressed down.
 *
 * @static
 * @method isPressed
 * @param {String} keyName The mapped name of the key
 * @return {Boolean} True if the key is pressed
 */Input.isPressed = function(keyName){if(this._isEscapeCompatible(keyName) && this.isPressed('escape')){return true;}else {return !!this._currentState[keyName];}}; /**
 * Checks whether a key is just pressed.
 *
 * @static
 * @method isTriggered
 * @param {String} keyName The mapped name of the key
 * @return {Boolean} True if the key is triggered
 */Input.isTriggered = function(keyName){if(this._isEscapeCompatible(keyName) && this.isTriggered('escape')){return true;}else {return this._latestButton === keyName && this._pressedTime === 0;}}; /**
 * Checks whether a key is just pressed or a key repeat occurred.
 *
 * @static
 * @method isRepeated
 * @param {String} keyName The mapped name of the key
 * @return {Boolean} True if the key is repeated
 */Input.isRepeated = function(keyName){if(this._isEscapeCompatible(keyName) && this.isRepeated('escape')){return true;}else {return this._latestButton === keyName && (this._pressedTime === 0 || this._pressedTime >= this.keyRepeatWait && this._pressedTime % this.keyRepeatInterval === 0);}}; /**
 * Checks whether a key is kept depressed.
 *
 * @static
 * @method isLongPressed
 * @param {String} keyName The mapped name of the key
 * @return {Boolean} True if the key is long-pressed
 */Input.isLongPressed = function(keyName){if(this._isEscapeCompatible(keyName) && this.isLongPressed('escape')){return true;}else {return this._latestButton === keyName && this._pressedTime >= this.keyRepeatWait;}}; /**
 * [read-only] The four direction value as a number of the numpad, or 0 for neutral.
 *
 * @static
 * @property dir4
 * @type Number
 */Object.defineProperty(Input,'dir4',{get:function get(){return this._dir4;},configurable:true}); /**
 * [read-only] The eight direction value as a number of the numpad, or 0 for neutral.
 *
 * @static
 * @property dir8
 * @type Number
 */Object.defineProperty(Input,'dir8',{get:function get(){return this._dir8;},configurable:true}); /**
 * [read-only] The time of the last input in milliseconds.
 *
 * @static
 * @property date
 * @type Number
 */Object.defineProperty(Input,'date',{get:function get(){return this._date;},configurable:true}); /**
 * @static
 * @method _wrapNwjsAlert
 * @private
 */Input._wrapNwjsAlert = function(){if(Utils.isNwjs()){var _alert=window.alert;window.alert = function(){var gui=require('nw.gui');var win=gui.Window.get();_alert.apply(this,arguments);win.focus();Input.clear();};}}; /**
 * @static
 * @method _setupEventHandlers
 * @private
 */Input._setupEventHandlers = function(){document.addEventListener('keydown',this._onKeyDown.bind(this));document.addEventListener('keyup',this._onKeyUp.bind(this));window.addEventListener('blur',this._onLostFocus.bind(this));}; /**
 * @static
 * @method _onKeyDown
 * @param {KeyboardEvent} event
 * @private
 */Input._onKeyDown = function(event){if(this._shouldPreventDefault(event.keyCode)){event.preventDefault();}if(event.keyCode === 144){ // Numlock
this.clear();}var buttonName=this.keyMapper[event.keyCode];if(buttonName){this._currentState[buttonName] = true;}}; /**
 * @static
 * @method _shouldPreventDefault
 * @param {Number} keyCode
 * @private
 */Input._shouldPreventDefault = function(keyCode){switch(keyCode){case 8: // backspace
case 33: // pageup
case 34: // pagedown
case 37: // left arrow
case 38: // up arrow
case 39: // right arrow
case 40: // down arrow
return true;}return false;}; /**
 * @static
 * @method _onKeyUp
 * @param {KeyboardEvent} event
 * @private
 */Input._onKeyUp = function(event){var buttonName=this.keyMapper[event.keyCode];if(buttonName){this._currentState[buttonName] = false;}if(event.keyCode === 0){ // For QtWebEngine on OS X
this.clear();}}; /**
 * @static
 * @method _onLostFocus
 * @private
 */Input._onLostFocus = function(){this.clear();}; /**
 * @static
 * @method _pollGamepads
 * @private
 */Input._pollGamepads = function(){if(navigator.getGamepads){var gamepads=navigator.getGamepads();if(gamepads){for(var i=0;i < gamepads.length;i++) {var gamepad=gamepads[i];if(gamepad && gamepad.connected){this._updateGamepadState(gamepad);}}}}}; /**
 * @static
 * @method _updateGamepadState
 * @param {Gamepad} gamepad
 * @param {Number} index
 * @private
 */Input._updateGamepadState = function(gamepad){var lastState=this._gamepadStates[gamepad.index] || [];var newState=[];var buttons=gamepad.buttons;var axes=gamepad.axes;var threshold=0.5;for(var i=0;i < buttons.length;i++) {newState[i] = buttons[i].pressed;}if(axes[1] < -threshold){newState[12] = true; // up
}else if(axes[1] > threshold){newState[13] = true; // down
}if(axes[0] < -threshold){newState[14] = true; // left
}else if(axes[0] > threshold){newState[15] = true; // right
}for(var j=0;j < newState.length;j++) {if(newState[j] !== lastState[j]){var buttonName=this.gamepadMapper[j];if(buttonName){this._currentState[buttonName] = newState[j];}}}this._gamepadStates[gamepad.index] = newState;}; /**
 * @static
 * @method _updateDirection
 * @private
 */Input._updateDirection = function(){var x=this._signX();var y=this._signY();this._dir8 = this._makeNumpadDirection(x,y);if(x !== 0 && y !== 0){if(this._preferredAxis === 'x'){y = 0;}else {x = 0;}}else if(x !== 0){this._preferredAxis = 'y';}else if(y !== 0){this._preferredAxis = 'x';}this._dir4 = this._makeNumpadDirection(x,y);}; /**
 * @static
 * @method _signX
 * @private
 */Input._signX = function(){var x=0;if(this.isPressed('left')){x--;}if(this.isPressed('right')){x++;}return x;}; /**
 * @static
 * @method _signY
 * @private
 */Input._signY = function(){var y=0;if(this.isPressed('up')){y--;}if(this.isPressed('down')){y++;}return y;}; /**
 * @static
 * @method _makeNumpadDirection
 * @param {Number} x
 * @param {Number} y
 * @return {Number}
 * @private
 */Input._makeNumpadDirection = function(x,y){if(x !== 0 || y !== 0){return 5 - y * 3 + x;}return 0;}; /**
 * @static
 * @method _isEscapeCompatible
 * @param {String} keyName
 * @return {Boolean}
 * @private
 */Input._isEscapeCompatible = function(keyName){return keyName === 'cancel' || keyName === 'menu';}; //-----------------------------------------------------------------------------
/**
 * The static class that handles input data from the mouse and touchscreen.
 *
 * @class TouchInput
 */function TouchInput(){throw new Error('This is a static class');} /**
 * Initializes the touch system.
 *
 * @static
 * @method initialize
 */TouchInput.initialize = function(){this.clear();this._setupEventHandlers();}; /**
 * The wait time of the pseudo key repeat in frames.
 *
 * @static
 * @property keyRepeatWait
 * @type Number
 */TouchInput.keyRepeatWait = 24; /**
 * The interval of the pseudo key repeat in frames.
 *
 * @static
 * @property keyRepeatInterval
 * @type Number
 */TouchInput.keyRepeatInterval = 6; /**
 * Clears all the touch data.
 *
 * @static
 * @method clear
 */TouchInput.clear = function(){this._mousePressed = false;this._screenPressed = false;this._pressedTime = 0;this._events = {};this._events.triggered = false;this._events.cancelled = false;this._events.moved = false;this._events.released = false;this._events.wheelX = 0;this._events.wheelY = 0;this._triggered = false;this._cancelled = false;this._moved = false;this._released = false;this._wheelX = 0;this._wheelY = 0;this._x = 0;this._y = 0;this._date = 0;}; /**
 * Updates the touch data.
 *
 * @static
 * @method update
 */TouchInput.update = function(){this._triggered = this._events.triggered;this._cancelled = this._events.cancelled;this._moved = this._events.moved;this._released = this._events.released;this._wheelX = this._events.wheelX;this._wheelY = this._events.wheelY;this._events.triggered = false;this._events.cancelled = false;this._events.moved = false;this._events.released = false;this._events.wheelX = 0;this._events.wheelY = 0;if(this.isPressed()){this._pressedTime++;}}; /**
 * Checks whether the mouse button or touchscreen is currently pressed down.
 *
 * @static
 * @method isPressed
 * @return {Boolean} True if the mouse button or touchscreen is pressed
 */TouchInput.isPressed = function(){return this._mousePressed || this._screenPressed;}; /**
 * Checks whether the left mouse button or touchscreen is just pressed.
 *
 * @static
 * @method isTriggered
 * @return {Boolean} True if the mouse button or touchscreen is triggered
 */TouchInput.isTriggered = function(){return this._triggered;}; /**
 * Checks whether the left mouse button or touchscreen is just pressed
 * or a pseudo key repeat occurred.
 *
 * @static
 * @method isRepeated
 * @return {Boolean} True if the mouse button or touchscreen is repeated
 */TouchInput.isRepeated = function(){return this.isPressed() && (this._triggered || this._pressedTime >= this.keyRepeatWait && this._pressedTime % this.keyRepeatInterval === 0);}; /**
 * Checks whether the left mouse button or touchscreen is kept depressed.
 *
 * @static
 * @method isLongPressed
 * @return {Boolean} True if the left mouse button or touchscreen is long-pressed
 */TouchInput.isLongPressed = function(){return this.isPressed() && this._pressedTime >= this.keyRepeatWait;}; /**
 * Checks whether the right mouse button is just pressed.
 *
 * @static
 * @method isCancelled
 * @return {Boolean} True if the right mouse button is just pressed
 */TouchInput.isCancelled = function(){return this._cancelled;}; /**
 * Checks whether the mouse or a finger on the touchscreen is moved.
 *
 * @static
 * @method isMoved
 * @return {Boolean} True if the mouse or a finger on the touchscreen is moved
 */TouchInput.isMoved = function(){return this._moved;}; /**
 * Checks whether the left mouse button or touchscreen is released.
 *
 * @static
 * @method isReleased
 * @return {Boolean} True if the mouse button or touchscreen is released
 */TouchInput.isReleased = function(){return this._released;}; /**
 * [read-only] The horizontal scroll amount.
 *
 * @static
 * @property wheelX
 * @type Number
 */Object.defineProperty(TouchInput,'wheelX',{get:function get(){return this._wheelX;},configurable:true}); /**
 * [read-only] The vertical scroll amount.
 *
 * @static
 * @property wheelY
 * @type Number
 */Object.defineProperty(TouchInput,'wheelY',{get:function get(){return this._wheelY;},configurable:true}); /**
 * [read-only] The x coordinate on the canvas area of the latest touch event.
 *
 * @static
 * @property x
 * @type Number
 */Object.defineProperty(TouchInput,'x',{get:function get(){return this._x;},configurable:true}); /**
 * [read-only] The y coordinate on the canvas area of the latest touch event.
 *
 * @static
 * @property y
 * @type Number
 */Object.defineProperty(TouchInput,'y',{get:function get(){return this._y;},configurable:true}); /**
 * [read-only] The time of the last input in milliseconds.
 *
 * @static
 * @property date
 * @type Number
 */Object.defineProperty(TouchInput,'date',{get:function get(){return this._date;},configurable:true}); /**
 * @static
 * @method _setupEventHandlers
 * @private
 */TouchInput._setupEventHandlers = function(){document.addEventListener('mousedown',this._onMouseDown.bind(this));document.addEventListener('mousemove',this._onMouseMove.bind(this));document.addEventListener('mouseup',this._onMouseUp.bind(this));document.addEventListener('wheel',this._onWheel.bind(this));document.addEventListener('touchstart',this._onTouchStart.bind(this));document.addEventListener('touchmove',this._onTouchMove.bind(this));document.addEventListener('touchend',this._onTouchEnd.bind(this));document.addEventListener('touchcancel',this._onTouchCancel.bind(this));document.addEventListener('pointerdown',this._onPointerDown.bind(this));}; /**
 * @static
 * @method _onMouseDown
 * @param {MouseEvent} event
 * @private
 */TouchInput._onMouseDown = function(event){if(event.button === 0){this._onLeftButtonDown(event);}else if(event.button === 1){this._onMiddleButtonDown(event);}else if(event.button === 2){this._onRightButtonDown(event);}}; /**
 * @static
 * @method _onLeftButtonDown
 * @param {MouseEvent} event
 * @private
 */TouchInput._onLeftButtonDown = function(event){var x=Graphics.pageToCanvasX(event.pageX);var y=Graphics.pageToCanvasY(event.pageY);if(Graphics.isInsideCanvas(x,y)){this._mousePressed = true;this._pressedTime = 0;this._onTrigger(x,y);}}; /**
 * @static
 * @method _onMiddleButtonDown
 * @param {MouseEvent} event
 * @private
 */TouchInput._onMiddleButtonDown = function(event){}; /**
 * @static
 * @method _onRightButtonDown
 * @param {MouseEvent} event
 * @private
 */TouchInput._onRightButtonDown = function(event){var x=Graphics.pageToCanvasX(event.pageX);var y=Graphics.pageToCanvasY(event.pageY);if(Graphics.isInsideCanvas(x,y)){this._onCancel(x,y);}}; /**
 * @static
 * @method _onMouseMove
 * @param {MouseEvent} event
 * @private
 */TouchInput._onMouseMove = function(event){if(this._mousePressed){var x=Graphics.pageToCanvasX(event.pageX);var y=Graphics.pageToCanvasY(event.pageY);this._onMove(x,y);}}; /**
 * @static
 * @method _onMouseUp
 * @param {MouseEvent} event
 * @private
 */TouchInput._onMouseUp = function(event){if(event.button === 0){var x=Graphics.pageToCanvasX(event.pageX);var y=Graphics.pageToCanvasY(event.pageY);this._mousePressed = false;this._onRelease(x,y);}}; /**
 * @static
 * @method _onWheel
 * @param {WheelEvent} event
 * @private
 */TouchInput._onWheel = function(event){this._events.wheelX += event.deltaX;this._events.wheelY += event.deltaY;event.preventDefault();}; /**
 * @static
 * @method _onTouchStart
 * @param {TouchEvent} event
 * @private
 */TouchInput._onTouchStart = function(event){for(var i=0;i < event.changedTouches.length;i++) {var touch=event.changedTouches[i];var x=Graphics.pageToCanvasX(touch.pageX);var y=Graphics.pageToCanvasY(touch.pageY);if(Graphics.isInsideCanvas(x,y)){this._screenPressed = true;this._pressedTime = 0;if(event.touches.length >= 2){this._onCancel(x,y);}else {this._onTrigger(x,y);}event.preventDefault();}}if(window.cordova || window.navigator.standalone){event.preventDefault();}}; /**
 * @static
 * @method _onTouchMove
 * @param {TouchEvent} event
 * @private
 */TouchInput._onTouchMove = function(event){for(var i=0;i < event.changedTouches.length;i++) {var touch=event.changedTouches[i];var x=Graphics.pageToCanvasX(touch.pageX);var y=Graphics.pageToCanvasY(touch.pageY);this._onMove(x,y);}}; /**
 * @static
 * @method _onTouchEnd
 * @param {TouchEvent} event
 * @private
 */TouchInput._onTouchEnd = function(event){for(var i=0;i < event.changedTouches.length;i++) {var touch=event.changedTouches[i];var x=Graphics.pageToCanvasX(touch.pageX);var y=Graphics.pageToCanvasY(touch.pageY);this._screenPressed = false;this._onRelease(x,y);}}; /**
 * @static
 * @method _onTouchCancel
 * @param {TouchEvent} event
 * @private
 */TouchInput._onTouchCancel = function(event){this._screenPressed = false;}; /**
 * @static
 * @method _onPointerDown
 * @param {PointerEvent} event
 * @private
 */TouchInput._onPointerDown = function(event){if(event.pointerType === 'touch' && !event.isPrimary){var x=Graphics.pageToCanvasX(event.pageX);var y=Graphics.pageToCanvasY(event.pageY);if(Graphics.isInsideCanvas(x,y)){ // For Microsoft Edge
this._onCancel(x,y);event.preventDefault();}}}; /**
 * @static
 * @method _onTrigger
 * @param {Number} x
 * @param {Number} y
 * @private
 */TouchInput._onTrigger = function(x,y){this._events.triggered = true;this._x = x;this._y = y;this._date = Date.now();}; /**
 * @static
 * @method _onCancel
 * @param {Number} x
 * @param {Number} y
 * @private
 */TouchInput._onCancel = function(x,y){this._events.cancelled = true;this._x = x;this._y = y;}; /**
 * @static
 * @method _onMove
 * @param {Number} x
 * @param {Number} y
 * @private
 */TouchInput._onMove = function(x,y){this._events.moved = true;this._x = x;this._y = y;}; /**
 * @static
 * @method _onRelease
 * @param {Number} x
 * @param {Number} y
 * @private
 */TouchInput._onRelease = function(x,y){this._events.released = true;this._x = x;this._y = y;}; //-----------------------------------------------------------------------------
/**
 * The basic object that is rendered to the game screen.
 *
 * @class Sprite
 * @constructor
 * @param {Bitmap} bitmap The image for the sprite
 */function Sprite(){this.initialize.apply(this,arguments);}Sprite.prototype = Object.create(PIXI.Sprite.prototype);Sprite.prototype.constructor = Sprite;Sprite.prototype.initialize = function(bitmap){var texture=new PIXI.Texture(new PIXI.BaseTexture());PIXI.Sprite.call(this,texture);this._bitmap = null;this._frame = new Rectangle();this._realFrame = new Rectangle();this._offset = new Point();this._blendColor = [0,0,0,0];this._colorTone = [0,0,0,0];this._canvas = null;this._context = null;this._tintTexture = null;this.spriteId = Sprite._counter++;this.opaque = false;this.bitmap = bitmap;}; // Number of the created objects.
Sprite._counter = 0; /**
 * The image for the sprite.
 *
 * @property bitmap
 * @type Bitmap
 */Object.defineProperty(Sprite.prototype,'bitmap',{get:function get(){return this._bitmap;},set:function set(value){if(this._bitmap !== value){this._bitmap = value;if(this._bitmap){this.setFrame(0,0,0,0);this._bitmap.addLoadListener(this._onBitmapLoad.bind(this));}else {this.texture.setFrame(Rectangle.emptyRectangle);}}},configurable:true}); /**
 * The width of the sprite without the scale.
 *
 * @property width
 * @type Number
 */Object.defineProperty(Sprite.prototype,'width',{get:function get(){return this._frame.width;},set:function set(value){this._frame.width = value;this._refresh();},configurable:true}); /**
 * The height of the sprite without the scale.
 *
 * @property height
 * @type Number
 */Object.defineProperty(Sprite.prototype,'height',{get:function get(){return this._frame.height;},set:function set(value){this._frame.height = value;this._refresh();},configurable:true}); /**
 * The opacity of the sprite (0 to 255).
 *
 * @property opacity
 * @type Number
 */Object.defineProperty(Sprite.prototype,'opacity',{get:function get(){return this.alpha * 255;},set:function set(value){this.alpha = value.clamp(0,255) / 255;},configurable:true}); /**
 * Updates the sprite for each frame.
 *
 * @method update
 */Sprite.prototype.update = function(){this.children.forEach(function(child){if(child.update){child.update();}});}; /**
 * Sets the x and y at once.
 *
 * @method move
 * @param {Number} x The x coordinate of the sprite
 * @param {Number} y The y coordinate of the sprite
 */Sprite.prototype.move = function(x,y){this.x = x;this.y = y;}; /**
 * Sets the rectagle of the bitmap that the sprite displays.
 *
 * @method setFrame
 * @param {Number} x The x coordinate of the frame
 * @param {Number} y The y coordinate of the frame
 * @param {Number} width The width of the frame
 * @param {Number} height The height of the frame
 */Sprite.prototype.setFrame = function(x,y,width,height){var frame=this._frame;if(x !== frame.x || y !== frame.y || width !== frame.width || height !== frame.height){frame.x = x;frame.y = y;frame.width = width;frame.height = height;this._refresh();}}; /**
 * Gets the blend color for the sprite.
 *
 * @method getBlendColor
 * @return {Array} The blend color [r, g, b, a]
 */Sprite.prototype.getBlendColor = function(){return this._blendColor.clone();}; /**
 * Sets the blend color for the sprite.
 *
 * @method setBlendColor
 * @param {Array} color The blend color [r, g, b, a]
 */Sprite.prototype.setBlendColor = function(color){if(!(color instanceof Array)){throw new Error('Argument must be an array');}if(!this._blendColor.equals(color)){this._blendColor = color.clone();this._refresh();}}; /**
 * Gets the color tone for the sprite.
 *
 * @method getColorTone
 * @return {Array} The color tone [r, g, b, gray]
 */Sprite.prototype.getColorTone = function(){return this._colorTone.clone();}; /**
 * Sets the color tone for the sprite.
 *
 * @method setColorTone
 * @param {Array} tone The color tone [r, g, b, gray]
 */Sprite.prototype.setColorTone = function(tone){if(!(tone instanceof Array)){throw new Error('Argument must be an array');}if(!this._colorTone.equals(tone)){this._colorTone = tone.clone();this._refresh();}}; /**
 * @method _onBitmapLoad
 * @private
 */Sprite.prototype._onBitmapLoad = function(){if(this._frame.width === 0 && this._frame.height === 0){this._frame.width = this._bitmap.width;this._frame.height = this._bitmap.height;}this._refresh();}; /**
 * @method _refresh
 * @private
 */Sprite.prototype._refresh = function(){var frameX=Math.floor(this._frame.x);var frameY=Math.floor(this._frame.y);var frameW=Math.floor(this._frame.width);var frameH=Math.floor(this._frame.height);var bitmapW=this._bitmap?this._bitmap.width:0;var bitmapH=this._bitmap?this._bitmap.height:0;var realX=frameX.clamp(0,bitmapW);var realY=frameY.clamp(0,bitmapH);var realW=(frameW - realX + frameX).clamp(0,bitmapW - realX);var realH=(frameH - realY + frameY).clamp(0,bitmapH - realY);this._realFrame.x = realX;this._realFrame.y = realY;this._realFrame.width = realW;this._realFrame.height = realH;this._offset.x = realX - frameX;this._offset.y = realY - frameY;if(realW > 0 && realH > 0){if(this._needsTint()){this._createTinter(realW,realH);this._executeTint(realX,realY,realW,realH);this._tintTexture.dirty();this.texture.baseTexture = this._tintTexture;this.texture.setFrame(new Rectangle(0,0,realW,realH));}else {if(this._bitmap){this.texture.baseTexture = this._bitmap.baseTexture;}this.texture.setFrame(this._realFrame);}}else if(this._bitmap){this.texture.setFrame(Rectangle.emptyRectangle);}else {this.texture.trim = this._frame;this.texture.setFrame(this._frame);this.texture.trim = null;}}; /**
 * @method _isInBitmapRect
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w
 * @param {Number} h
 * @return {Boolean}
 * @private
 */Sprite.prototype._isInBitmapRect = function(x,y,w,h){return this._bitmap && x + w > 0 && y + h > 0 && x < this._bitmap.width && y < this._bitmap.height;}; /**
 * @method _needsTint
 * @return {Boolean}
 * @private
 */Sprite.prototype._needsTint = function(){var tone=this._colorTone;return tone[0] || tone[1] || tone[2] || tone[3] || this._blendColor[3] > 0;}; /**
 * @method _createTinter
 * @param {Number} w
 * @param {Number} h
 * @private
 */Sprite.prototype._createTinter = function(w,h){if(!this._canvas){this._canvas = document.createElement('canvas');this._context = this._canvas.getContext('2d');}this._canvas.width = w;this._canvas.height = h;if(!this._tintTexture){this._tintTexture = new PIXI.BaseTexture(this._canvas);}this._tintTexture.width = w;this._tintTexture.height = h;this._tintTexture.scaleMode = this._bitmap.baseTexture.scaleMode;}; /**
 * @method _executeTint
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w
 * @param {Number} h
 * @private
 */Sprite.prototype._executeTint = function(x,y,w,h){var context=this._context;var tone=this._colorTone;var color=this._blendColor;context.globalCompositeOperation = 'copy';context.drawImage(this._bitmap.canvas,x,y,w,h,0,0,w,h);if(Graphics.canUseSaturationBlend()){var gray=Math.max(0,tone[3]);context.globalCompositeOperation = 'saturation';context.fillStyle = 'rgba(255,255,255,' + gray / 255 + ')';context.fillRect(0,0,w,h);}var r1=Math.max(0,tone[0]);var g1=Math.max(0,tone[1]);var b1=Math.max(0,tone[2]);context.globalCompositeOperation = 'lighter';context.fillStyle = Utils.rgbToCssColor(r1,g1,b1);context.fillRect(0,0,w,h);if(Graphics.canUseDifferenceBlend()){context.globalCompositeOperation = 'difference';context.fillStyle = 'white';context.fillRect(0,0,w,h);var r2=Math.max(0,-tone[0]);var g2=Math.max(0,-tone[1]);var b2=Math.max(0,-tone[2]);context.globalCompositeOperation = 'lighter';context.fillStyle = Utils.rgbToCssColor(r2,g2,b2);context.fillRect(0,0,w,h);context.globalCompositeOperation = 'difference';context.fillStyle = 'white';context.fillRect(0,0,w,h);}var r3=Math.max(0,color[0]);var g3=Math.max(0,color[1]);var b3=Math.max(0,color[2]);var a3=Math.max(0,color[3]);context.globalCompositeOperation = 'source-atop';context.fillStyle = Utils.rgbToCssColor(r3,g3,b3);context.globalAlpha = a3 / 255;context.fillRect(0,0,w,h);context.globalCompositeOperation = 'destination-in';context.globalAlpha = 1;context.drawImage(this._bitmap.canvas,x,y,w,h,0,0,w,h);}; /**
 * @method updateTransform
 * @private
 */Sprite.prototype.updateTransform = function(){PIXI.Sprite.prototype.updateTransform.call(this);this.worldTransform.tx += this._offset.x;this.worldTransform.ty += this._offset.y;}; /**
 * @method _renderCanvas
 * @param {Object} renderSession
 * @private
 */Sprite.prototype._renderCanvas = function(renderSession){if(this.visible && this.alpha > 0){if(this.texture.crop.width <= 0 || this.texture.crop.height <= 0){if(this._mask){renderSession.maskManager.pushMask(this._mask,renderSession);}for(var i=0,j=this.children.length;i < j;i++) {this.children[i]._renderCanvas(renderSession);}if(this._mask){renderSession.maskManager.popMask(renderSession);}}else {PIXI.Sprite.prototype._renderCanvas.call(this,renderSession);}}}; /**
 * @method _renderWebGL
 * @param {Object} renderSession
 * @private
 */Sprite.prototype._renderWebGL = function(renderSession){if(this.visible && this.alpha > 0){var spriteBatch=renderSession.spriteBatch;if(this._filters){spriteBatch.flush();renderSession.filterManager.pushFilter(this._filterBlock);if(this.opaque){ // Required for a bug in Firefox on Windows
renderSession.gl.clearColor(0,0,0,1);renderSession.gl.clear(renderSession.gl.COLOR_BUFFER_BIT);}}if(this._mask){spriteBatch.stop();renderSession.maskManager.pushMask(this.mask,renderSession);spriteBatch.start();}spriteBatch.render(this);for(var i=0,j=this.children.length;i < j;i++) {this.children[i]._renderWebGL(renderSession);}if(this._mask){spriteBatch.stop();renderSession.maskManager.popMask(this._mask,renderSession);spriteBatch.start();}if(this._filters){spriteBatch.stop();renderSession.filterManager.popFilter();spriteBatch.start();}}}; // The important members from Pixi.js
/**
 * The visibility of the sprite.
 *
 * @property visible
 * @type Boolean
 */ /**
 * The x coordinate of the sprite.
 *
 * @property x
 * @type Number
 */ /**
 * The y coordinate of the sprite.
 *
 * @property y
 * @type Number
 */ /**
 * The origin point of the sprite. (0,0) to (1,1).
 *
 * @property anchor
 * @type Point
 */ /**
 * The scale factor of the sprite.
 *
 * @property scale
 * @type Point
 */ /**
 * The rotation of the sprite in radians.
 *
 * @property rotation
 * @type Number
 */ /**
 * The blend mode to be applied to the sprite.
 *
 * @property blendMode
 * @type Number
 */ /**
 * Sets the filters for the sprite.
 *
 * @property filters
 * @type Array
 */ /**
 * [read-only] The array of children of the sprite.
 *
 * @property children
 * @type Array
 */ /**
 * [read-only] The object that contains the sprite.
 *
 * @property parent
 * @type Object
 */ /**
 * Adds a child to the container.
 *
 * @method addChild
 * @param {Object} child The child to add
 * @return {Object} The child that was added
 */ /**
 * Adds a child to the container at a specified index.
 *
 * @method addChildAt
 * @param {Object} child The child to add
 * @param {Number} index The index to place the child in
 * @return {Object} The child that was added
 */ /**
 * Removes a child from the container.
 *
 * @method removeChild
 * @param {Object} child The child to remove
 * @return {Object} The child that was removed
 */ /**
 * Removes a child from the specified index position.
 *
 * @method removeChildAt
 * @param {Number} index The index to get the child from
 * @return {Object} The child that was removed
 */ //-----------------------------------------------------------------------------
/**
 * The tilemap which displays 2D tile-based game map.
 *
 * @class Tilemap
 * @constructor
 */function Tilemap(){this.initialize.apply(this,arguments);}Tilemap.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);Tilemap.prototype.constructor = Tilemap;Tilemap.prototype.initialize = function(){PIXI.DisplayObjectContainer.call(this);this._margin = 20;this._width = Graphics.width + this._margin * 2;this._height = Graphics.height + this._margin * 2;this._tileWidth = 48;this._tileHeight = 48;this._mapWidth = 0;this._mapHeight = 0;this._mapData = null;this._layerWidth = 0;this._layerHeight = 0;this._lastTiles = []; /**
     * The bitmaps used as a tileset.
     *
     * @property bitmaps
     * @type Array
     */this.bitmaps = []; /**
     * The origin point of the tilemap for scrolling.
     *
     * @property origin
     * @type Point
     */this.origin = new Point(); /**
     * The tileset flags.
     *
     * @property flags
     * @type Array
     */this.flags = []; /**
     * The animation count for autotiles.
     *
     * @property animationCount
     * @type Number
     */this.animationCount = 0; /**
     * Whether the tilemap loops horizontal.
     *
     * @property horizontalWrap
     * @type Boolean
     */this.horizontalWrap = false; /**
     * Whether the tilemap loops vertical.
     *
     * @property verticalWrap
     * @type Boolean
     */this.verticalWrap = false;this._createLayers();this.refresh();}; /**
 * The width of the screen in pixels.
 *
 * @property width
 * @type Number
 */Object.defineProperty(Tilemap.prototype,'width',{get:function get(){return this._width;},set:function set(value){if(this._width !== value){this._width = value;this._createLayers();}}}); /**
 * The height of the screen in pixels.
 *
 * @property height
 * @type Number
 */Object.defineProperty(Tilemap.prototype,'height',{get:function get(){return this._height;},set:function set(value){if(this._height !== value){this._height = value;this._createLayers();}}}); /**
 * The width of a tile in pixels.
 *
 * @property tileWidth
 * @type Number
 */Object.defineProperty(Tilemap.prototype,'tileWidth',{get:function get(){return this._tileWidth;},set:function set(value){if(this._tileWidth !== value){this._tileWidth = value;this._createLayers();}}}); /**
 * The height of a tile in pixels.
 *
 * @property tileHeight
 * @type Number
 */Object.defineProperty(Tilemap.prototype,'tileHeight',{get:function get(){return this._tileHeight;},set:function set(value){if(this._tileHeight !== value){this._tileHeight = value;this._createLayers();}}}); /**
 * Sets the tilemap data.
 *
 * @method setData
 * @param {Number} width The width of the map in number of tiles
 * @param {Number} height The height of the map in number of tiles
 * @param {Array} data The one dimensional array for the map data
 */Tilemap.prototype.setData = function(width,height,data){this._mapWidth = width;this._mapHeight = height;this._mapData = data;}; /**
 * Checks whether the tileset is ready to render.
 *
 * @method isReady
 * @type Boolean
 * @return {Boolean} True if the tilemap is ready
 */Tilemap.prototype.isReady = function(){for(var i=0;i < this.bitmaps.length;i++) {if(this.bitmaps[i] && !this.bitmaps[i].isReady()){return false;}}return true;}; /**
 * Updates the tilemap for each frame.
 *
 * @method update
 */Tilemap.prototype.update = function(){this.animationCount++;this.children.forEach(function(child){if(child.update){child.update();}});}; /**
 * Forces to repaint the entire tilemap.
 *
 * @method refresh
 */Tilemap.prototype.refresh = function(){this._lastTiles.length = 0;}; /**
 * @method updateTransform
 * @private
 */Tilemap.prototype.updateTransform = function(){var ox=Math.floor(this.origin.x);var oy=Math.floor(this.origin.y);var startX=Math.floor((ox - this._margin) / this._tileWidth);var startY=Math.floor((oy - this._margin) / this._tileHeight);this._updateLayerPositions(startX,startY);this._paintAllTiles(startX,startY);this._sortChildren();PIXI.DisplayObjectContainer.prototype.updateTransform.call(this);}; /**
 * @method _createLayers
 * @private
 */Tilemap.prototype._createLayers = function(){var width=this._width;var height=this._height;var margin=this._margin;var tileCols=Math.ceil(width / this._tileWidth) + 1;var tileRows=Math.ceil(height / this._tileHeight) + 1;var layerWidth=tileCols * this._tileWidth;var layerHeight=tileRows * this._tileHeight;this._lowerBitmap = new Bitmap(layerWidth,layerHeight);this._upperBitmap = new Bitmap(layerWidth,layerHeight);this._layerWidth = layerWidth;this._layerHeight = layerHeight; /*
     * Z coordinate:
     *
     * 0 : Lower tiles
     * 1 : Lower characters
     * 3 : Normal characters
     * 4 : Upper tiles
     * 5 : Upper characters
     * 6 : Airship shadow
     * 7 : Balloon
     * 8 : Animation
     * 9 : Destination
     */this._lowerLayer = new Sprite();this._lowerLayer.move(-margin,-margin,width,height);this._lowerLayer.z = 0;this._upperLayer = new Sprite();this._upperLayer.move(-margin,-margin,width,height);this._upperLayer.z = 4;for(var i=0;i < 4;i++) {this._lowerLayer.addChild(new Sprite(this._lowerBitmap));this._upperLayer.addChild(new Sprite(this._upperBitmap));}this.addChild(this._lowerLayer);this.addChild(this._upperLayer);}; /**
 * @method _updateLayerPositions
 * @param {Number} startX
 * @param {Number} startY
 * @private
 */Tilemap.prototype._updateLayerPositions = function(startX,startY){var m=this._margin;var ox=Math.floor(this.origin.x);var oy=Math.floor(this.origin.y);var x2=(ox - m).mod(this._layerWidth);var y2=(oy - m).mod(this._layerHeight);var w1=this._layerWidth - x2;var h1=this._layerHeight - y2;var w2=this._width - w1;var h2=this._height - h1;for(var i=0;i < 2;i++) {var children;if(i === 0){children = this._lowerLayer.children;}else {children = this._upperLayer.children;}children[0].move(0,0,w1,h1);children[0].setFrame(x2,y2,w1,h1);children[1].move(w1,0,w2,h1);children[1].setFrame(0,y2,w2,h1);children[2].move(0,h1,w1,h2);children[2].setFrame(x2,0,w1,h2);children[3].move(w1,h1,w2,h2);children[3].setFrame(0,0,w2,h2);}}; /**
 * @method _paintAllTiles
 * @param {Number} startX
 * @param {Number} startY
 * @private
 */Tilemap.prototype._paintAllTiles = function(startX,startY){var tileCols=Math.ceil(this._width / this._tileWidth) + 1;var tileRows=Math.ceil(this._height / this._tileHeight) + 1;for(var y=0;y < tileRows;y++) {for(var x=0;x < tileCols;x++) {this._paintTiles(startX,startY,x,y);}}}; /**
 * @method _paintTiles
 * @param {Number} startX
 * @param {Number} startY
 * @param {Number} x
 * @param {Number} y
 * @private
 */Tilemap.prototype._paintTiles = function(startX,startY,x,y){var tableEdgeVirtualId=10000;var mx=startX + x;var my=startY + y;var dx=(mx * this._tileWidth).mod(this._layerWidth);var dy=(my * this._tileHeight).mod(this._layerHeight);var lx=dx / this._tileWidth;var ly=dy / this._tileHeight;var tileId0=this._readMapData(mx,my,0);var tileId1=this._readMapData(mx,my,1);var tileId2=this._readMapData(mx,my,2);var tileId3=this._readMapData(mx,my,3);var shadowBits=this._readMapData(mx,my,4);var upperTileId1=this._readMapData(mx,my - 1,1);var lowerTiles=[];var upperTiles=[];if(this._isHigherTile(tileId0)){upperTiles.push(tileId0);}else {lowerTiles.push(tileId0);}if(this._isHigherTile(tileId1)){upperTiles.push(tileId1);}else {lowerTiles.push(tileId1);}lowerTiles.push(-shadowBits);if(this._isTableTile(upperTileId1) && !this._isTableTile(tileId1)){if(!Tilemap.isShadowingTile(tileId0)){lowerTiles.push(tableEdgeVirtualId + upperTileId1);}}if(this._isOverpassPosition(mx,my)){upperTiles.push(tileId2);upperTiles.push(tileId3);}else {if(this._isHigherTile(tileId2)){upperTiles.push(tileId2);}else {lowerTiles.push(tileId2);}if(this._isHigherTile(tileId3)){upperTiles.push(tileId3);}else {lowerTiles.push(tileId3);}}var count=1000 + this.animationCount - my;var frameUpdated=count % 30 === 0;this._animationFrame = Math.floor(count / 30);var lastLowerTiles=this._readLastTiles(0,lx,ly);if(!lowerTiles.equals(lastLowerTiles) || Tilemap.isTileA1(tileId0) && frameUpdated){this._lowerBitmap.clearRect(dx,dy,this._tileWidth,this._tileHeight);for(var i=0;i < lowerTiles.length;i++) {var lowerTileId=lowerTiles[i];if(lowerTileId < 0){this._drawShadow(this._lowerBitmap,shadowBits,dx,dy);}else if(lowerTileId >= tableEdgeVirtualId){this._drawTableEdge(this._lowerBitmap,upperTileId1,dx,dy);}else {this._drawTile(this._lowerBitmap,lowerTileId,dx,dy);}}this._writeLastTiles(0,lx,ly,lowerTiles);}var lastUpperTiles=this._readLastTiles(1,lx,ly);if(!upperTiles.equals(lastUpperTiles)){this._upperBitmap.clearRect(dx,dy,this._tileWidth,this._tileHeight);for(var j=0;j < upperTiles.length;j++) {this._drawTile(this._upperBitmap,upperTiles[j],dx,dy);}this._writeLastTiles(1,lx,ly,upperTiles);}}; /**
 * @method _readLastTiles
 * @param {Number} i
 * @param {Number} x
 * @param {Number} y
 * @private
 */Tilemap.prototype._readLastTiles = function(i,x,y){var array1=this._lastTiles[i];if(array1){var array2=array1[y];if(array2){var tiles=array2[x];if(tiles){return tiles;}}}return [];}; /**
 * @method _writeLastTiles
 * @param {Number} i
 * @param {Number} x
 * @param {Number} y
 * @param {Array} tiles
 * @private
 */Tilemap.prototype._writeLastTiles = function(i,x,y,tiles){var array1=this._lastTiles[i];if(!array1){array1 = this._lastTiles[i] = [];}var array2=array1[y];if(!array2){array2 = array1[y] = [];}array2[x] = tiles;}; /**
 * @method _drawTile
 * @param {Bitmap} bitmap
 * @param {Number} tileId
 * @param {Number} dx
 * @param {Number} dy
 * @private
 */Tilemap.prototype._drawTile = function(bitmap,tileId,dx,dy){if(Tilemap.isVisibleTile(tileId)){if(Tilemap.isAutotile(tileId)){this._drawAutotile(bitmap,tileId,dx,dy);}else {this._drawNormalTile(bitmap,tileId,dx,dy);}}}; /**
 * @method _drawNormalTile
 * @param {Bitmap} bitmap
 * @param {Number} tileId
 * @param {Number} dx
 * @param {Number} dy
 * @private
 */Tilemap.prototype._drawNormalTile = function(bitmap,tileId,dx,dy){var setNumber=0;if(Tilemap.isTileA5(tileId)){setNumber = 4;}else {setNumber = 5 + Math.floor(tileId / 256);}var w=this._tileWidth;var h=this._tileHeight;var sx=(Math.floor(tileId / 128) % 2 * 8 + tileId % 8) * w;var sy=Math.floor(tileId % 256 / 8) % 16 * h;var source=this.bitmaps[setNumber];if(source){bitmap.blt(source,sx,sy,w,h,dx,dy,w,h);}}; /**
 * @method _drawAutotile
 * @param {Bitmap} bitmap
 * @param {Number} tileId
 * @param {Number} dx
 * @param {Number} dy
 * @private
 */Tilemap.prototype._drawAutotile = function(bitmap,tileId,dx,dy){var autotileTable=Tilemap.FLOOR_AUTOTILE_TABLE;var kind=Tilemap.getAutotileKind(tileId);var shape=Tilemap.getAutotileShape(tileId);var tx=kind % 8;var ty=Math.floor(kind / 8);var bx=0;var by=0;var setNumber=0;var isTable=false;if(Tilemap.isTileA1(tileId)){var waterSurfaceIndex=[0,1,2,1][this._animationFrame % 4];setNumber = 0;if(kind === 0){bx = waterSurfaceIndex * 2;by = 0;}else if(kind === 1){bx = waterSurfaceIndex * 2;by = 3;}else if(kind === 2){bx = 6;by = 0;}else if(kind === 3){bx = 6;by = 3;}else {bx = Math.floor(tx / 4) * 8;by = ty * 6 + Math.floor(tx / 2) % 2 * 3;if(kind % 2 === 0){bx += waterSurfaceIndex * 2;}else {bx += 6;autotileTable = Tilemap.WATERFALL_AUTOTILE_TABLE;by += this._animationFrame % 3;}}}else if(Tilemap.isTileA2(tileId)){setNumber = 1;bx = tx * 2;by = (ty - 2) * 3;isTable = this._isTableTile(tileId);}else if(Tilemap.isTileA3(tileId)){setNumber = 2;bx = tx * 2;by = (ty - 6) * 2;autotileTable = Tilemap.WALL_AUTOTILE_TABLE;}else if(Tilemap.isTileA4(tileId)){setNumber = 3;bx = tx * 2;by = Math.floor((ty - 10) * 2.5 + (ty % 2 === 1?0.5:0));if(ty % 2 === 1){autotileTable = Tilemap.WALL_AUTOTILE_TABLE;}}var table=autotileTable[shape];var source=this.bitmaps[setNumber];if(table && source){var w1=this._tileWidth / 2;var h1=this._tileHeight / 2;for(var i=0;i < 4;i++) {var qsx=table[i][0];var qsy=table[i][1];var sx1=(bx * 2 + qsx) * w1;var sy1=(by * 2 + qsy) * h1;var dx1=dx + i % 2 * w1;var dy1=dy + Math.floor(i / 2) * h1;if(isTable && (qsy === 1 || qsy === 5)){var qsx2=qsx;var qsy2=3;if(qsy === 1){qsx2 = [0,3,2,1][qsx];}var sx2=(bx * 2 + qsx2) * w1;var sy2=(by * 2 + qsy2) * h1;bitmap.blt(source,sx2,sy2,w1,h1,dx1,dy1,w1,h1);dy1 += h1 / 2;bitmap.blt(source,sx1,sy1,w1,h1 / 2,dx1,dy1,w1,h1 / 2);}else {bitmap.blt(source,sx1,sy1,w1,h1,dx1,dy1,w1,h1);}}}}; /**
 * @method _drawTableEdge
 * @param {Bitmap} bitmap
 * @param {Number} tileId
 * @param {Number} dx
 * @param {Number} dy
 * @private
 */Tilemap.prototype._drawTableEdge = function(bitmap,tileId,dx,dy){if(Tilemap.isTileA2(tileId)){var autotileTable=Tilemap.FLOOR_AUTOTILE_TABLE;var kind=Tilemap.getAutotileKind(tileId);var shape=Tilemap.getAutotileShape(tileId);var tx=kind % 8;var ty=Math.floor(kind / 8);var setNumber=1;var bx=tx * 2;var by=(ty - 2) * 3;var table=autotileTable[shape];if(table){var source=this.bitmaps[setNumber];var w1=this._tileWidth / 2;var h1=this._tileHeight / 2;for(var i=0;i < 2;i++) {var qsx=table[2 + i][0];var qsy=table[2 + i][1];var sx1=(bx * 2 + qsx) * w1;var sy1=(by * 2 + qsy) * h1 + h1 / 2;var dx1=dx + i % 2 * w1;var dy1=dy + Math.floor(i / 2) * h1;bitmap.blt(source,sx1,sy1,w1,h1 / 2,dx1,dy1,w1,h1 / 2);}}}}; /**
 * @method _drawShadow
 * @param {Bitmap} bitmap
 * @param {Number} shadowBits
 * @param {Number} dx
 * @param {Number} dy
 * @private
 */Tilemap.prototype._drawShadow = function(bitmap,shadowBits,dx,dy){if(shadowBits & 0x0f){var w1=this._tileWidth / 2;var h1=this._tileHeight / 2;var color='rgba(0,0,0,0.5)';for(var i=0;i < 4;i++) {if(shadowBits & 1 << i){var dx1=dx + i % 2 * w1;var dy1=dy + Math.floor(i / 2) * h1;bitmap.fillRect(dx1,dy1,w1,h1,color);}}}}; /**
 * @method _readMapData
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @return {Number}
 * @private
 */Tilemap.prototype._readMapData = function(x,y,z){if(this._mapData){var width=this._mapWidth;var height=this._mapHeight;if(this.horizontalWrap){x = x.mod(width);}if(this.verticalWrap){y = y.mod(height);}if(x >= 0 && x < width && y >= 0 && y < height){return this._mapData[(z * height + y) * width + x] || 0;}else {return 0;}}else {return 0;}}; /**
 * @method _isHigherTile
 * @param {Number} tileId
 * @return {Boolean}
 * @private
 */Tilemap.prototype._isHigherTile = function(tileId){return this.flags[tileId] & 0x10;}; /**
 * @method _isTableTile
 * @param {Number} tileId
 * @return {Boolean}
 * @private
 */Tilemap.prototype._isTableTile = function(tileId){return Tilemap.isTileA2(tileId) && this.flags[tileId] & 0x80;}; /**
 * @method _isOverpassPosition
 * @param {Number} mx
 * @param {Number} my
 * @return {Boolean}
 * @private
 */Tilemap.prototype._isOverpassPosition = function(mx,my){return false;}; /**
 * @method _sortChildren
 * @private
 */Tilemap.prototype._sortChildren = function(){this.children.sort(this._compareChildOrder.bind(this));}; /**
 * @method _compareChildOrder
 * @param {Object} a
 * @param {Object} b
 * @private
 */Tilemap.prototype._compareChildOrder = function(a,b){if(a.z !== b.z){return a.z - b.z;}else if(a.y !== b.y){return a.y - b.y;}else {return a.spriteId - b.spriteId;}}; // Tile type checkers
Tilemap.TILE_ID_B = 0;Tilemap.TILE_ID_C = 256;Tilemap.TILE_ID_D = 512;Tilemap.TILE_ID_E = 768;Tilemap.TILE_ID_A5 = 1536;Tilemap.TILE_ID_A1 = 2048;Tilemap.TILE_ID_A2 = 2816;Tilemap.TILE_ID_A3 = 4352;Tilemap.TILE_ID_A4 = 5888;Tilemap.TILE_ID_MAX = 8192;Tilemap.isVisibleTile = function(tileId){return tileId > 0 && tileId < this.TILE_ID_MAX;};Tilemap.isAutotile = function(tileId){return tileId >= this.TILE_ID_A1;};Tilemap.getAutotileKind = function(tileId){return Math.floor((tileId - this.TILE_ID_A1) / 48);};Tilemap.getAutotileShape = function(tileId){return (tileId - this.TILE_ID_A1) % 48;};Tilemap.makeAutotileId = function(kind,shape){return this.TILE_ID_A1 + kind * 48 + shape;};Tilemap.isSameKindTile = function(tileID1,tileID2){if(this.isAutotile(tileID1) && this.isAutotile(tileID2)){return this.getAutotileKind(tileID1) === this.getAutotileKind(tileID2);}else {return tileID1 === tileID2;}};Tilemap.isTileA1 = function(tileId){return tileId >= this.TILE_ID_A1 && tileId < this.TILE_ID_A2;};Tilemap.isTileA2 = function(tileId){return tileId >= this.TILE_ID_A2 && tileId < this.TILE_ID_A3;};Tilemap.isTileA3 = function(tileId){return tileId >= this.TILE_ID_A3 && tileId < this.TILE_ID_A4;};Tilemap.isTileA4 = function(tileId){return tileId >= this.TILE_ID_A4 && tileId < this.TILE_ID_MAX;};Tilemap.isTileA5 = function(tileId){return tileId >= this.TILE_ID_A5 && tileId < this.TILE_ID_A1;};Tilemap.isWaterTile = function(tileId){if(this.isTileA1(tileId)){return !(tileId >= this.TILE_ID_A1 + 96 && tileId < this.TILE_ID_A1 + 192);}else {return false;}};Tilemap.isWaterfallTile = function(tileId){if(tileId >= this.TILE_ID_A1 + 192 && tileId < this.TILE_ID_A2){return this.getAutotileKind(tileId) % 2 === 1;}else {return false;}};Tilemap.isGroundTile = function(tileId){return this.isTileA1(tileId) || this.isTileA2(tileId) || this.isTileA5(tileId);};Tilemap.isShadowingTile = function(tileId){return this.isTileA3(tileId) || this.isTileA4(tileId);};Tilemap.isRoofTile = function(tileId){return this.isTileA3(tileId) && this.getAutotileKind(tileId) % 16 < 8;};Tilemap.isWallTopTile = function(tileId){return this.isTileA4(tileId) && this.getAutotileKind(tileId) % 16 < 8;};Tilemap.isWallSideTile = function(tileId){return (this.isTileA3(tileId) || this.isTileA4(tileId)) && getAutotileKind(tileId) % 16 >= 8;};Tilemap.isWallTile = function(tileId){return this.isWallTopTile(tileId) || this.isWallSideTile(tileId);};Tilemap.isFloorTypeAutotile = function(tileId){return this.isTileA1(tileId) && !this.isWaterfallTile(tileId) || this.isTileA2(tileId) || this.isWallTopTile(tileId);};Tilemap.isWallTypeAutotile = function(tileId){return this.isRoofTile(tileId) || this.isWallSideTile(tileId);};Tilemap.isWaterfallTypeAutotile = function(tileId){return this.isWaterfallTile(tileId);}; // Autotile shape number to coordinates of tileset images
Tilemap.FLOOR_AUTOTILE_TABLE = [[[2,4],[1,4],[2,3],[1,3]],[[2,0],[1,4],[2,3],[1,3]],[[2,4],[3,0],[2,3],[1,3]],[[2,0],[3,0],[2,3],[1,3]],[[2,4],[1,4],[2,3],[3,1]],[[2,0],[1,4],[2,3],[3,1]],[[2,4],[3,0],[2,3],[3,1]],[[2,0],[3,0],[2,3],[3,1]],[[2,4],[1,4],[2,1],[1,3]],[[2,0],[1,4],[2,1],[1,3]],[[2,4],[3,0],[2,1],[1,3]],[[2,0],[3,0],[2,1],[1,3]],[[2,4],[1,4],[2,1],[3,1]],[[2,0],[1,4],[2,1],[3,1]],[[2,4],[3,0],[2,1],[3,1]],[[2,0],[3,0],[2,1],[3,1]],[[0,4],[1,4],[0,3],[1,3]],[[0,4],[3,0],[0,3],[1,3]],[[0,4],[1,4],[0,3],[3,1]],[[0,4],[3,0],[0,3],[3,1]],[[2,2],[1,2],[2,3],[1,3]],[[2,2],[1,2],[2,3],[3,1]],[[2,2],[1,2],[2,1],[1,3]],[[2,2],[1,2],[2,1],[3,1]],[[2,4],[3,4],[2,3],[3,3]],[[2,4],[3,4],[2,1],[3,3]],[[2,0],[3,4],[2,3],[3,3]],[[2,0],[3,4],[2,1],[3,3]],[[2,4],[1,4],[2,5],[1,5]],[[2,0],[1,4],[2,5],[1,5]],[[2,4],[3,0],[2,5],[1,5]],[[2,0],[3,0],[2,5],[1,5]],[[0,4],[3,4],[0,3],[3,3]],[[2,2],[1,2],[2,5],[1,5]],[[0,2],[1,2],[0,3],[1,3]],[[0,2],[1,2],[0,3],[3,1]],[[2,2],[3,2],[2,3],[3,3]],[[2,2],[3,2],[2,1],[3,3]],[[2,4],[3,4],[2,5],[3,5]],[[2,0],[3,4],[2,5],[3,5]],[[0,4],[1,4],[0,5],[1,5]],[[0,4],[3,0],[0,5],[1,5]],[[0,2],[3,2],[0,3],[3,3]],[[0,2],[1,2],[0,5],[1,5]],[[0,4],[3,4],[0,5],[3,5]],[[2,2],[3,2],[2,5],[3,5]],[[0,2],[3,2],[0,5],[3,5]],[[0,0],[1,0],[0,1],[1,1]]];Tilemap.WALL_AUTOTILE_TABLE = [[[2,2],[1,2],[2,1],[1,1]],[[0,2],[1,2],[0,1],[1,1]],[[2,0],[1,0],[2,1],[1,1]],[[0,0],[1,0],[0,1],[1,1]],[[2,2],[3,2],[2,1],[3,1]],[[0,2],[3,2],[0,1],[3,1]],[[2,0],[3,0],[2,1],[3,1]],[[0,0],[3,0],[0,1],[3,1]],[[2,2],[1,2],[2,3],[1,3]],[[0,2],[1,2],[0,3],[1,3]],[[2,0],[1,0],[2,3],[1,3]],[[0,0],[1,0],[0,3],[1,3]],[[2,2],[3,2],[2,3],[3,3]],[[0,2],[3,2],[0,3],[3,3]],[[2,0],[3,0],[2,3],[3,3]],[[0,0],[3,0],[0,3],[3,3]]];Tilemap.WATERFALL_AUTOTILE_TABLE = [[[2,0],[1,0],[2,1],[1,1]],[[0,0],[1,0],[0,1],[1,1]],[[2,0],[3,0],[2,1],[3,1]],[[0,0],[3,0],[0,1],[3,1]]]; // The important members from Pixi.js
/**
 * [read-only] The array of children of the tilemap.
 *
 * @property children
 * @type Array
 */ /**
 * [read-only] The object that contains the tilemap.
 *
 * @property parent
 * @type Object
 */ /**
 * Adds a child to the container.
 *
 * @method addChild
 * @param {Object} child The child to add
 * @return {Object} The child that was added
 */ /**
 * Adds a child to the container at a specified index.
 *
 * @method addChildAt
 * @param {Object} child The child to add
 * @param {Number} index The index to place the child in
 * @return {Object} The child that was added
 */ /**
 * Removes a child from the container.
 *
 * @method removeChild
 * @param {Object} child The child to remove
 * @return {Object} The child that was removed
 */ /**
 * Removes a child from the specified index position.
 *
 * @method removeChildAt
 * @param {Number} index The index to get the child from
 * @return {Object} The child that was removed
 */ //-----------------------------------------------------------------------------
/**
 * The sprite object for a tiling image.
 *
 * @class TilingSprite
 * @constructor
 * @param {Bitmap} bitmap The image for the tiling sprite
 */function TilingSprite(){this.initialize.apply(this,arguments);}TilingSprite.prototype = Object.create(PIXI.TilingSprite.prototype);TilingSprite.prototype.constructor = TilingSprite;TilingSprite.prototype.initialize = function(bitmap){var texture=new PIXI.Texture(new PIXI.BaseTexture());PIXI.TilingSprite.call(this,texture);this._bitmap = null;this._width = 0;this._height = 0;this._frame = new Rectangle(); /**
     * The origin point of the tiling sprite for scrolling.
     *
     * @property origin
     * @type Point
     */this.origin = new Point();this.bitmap = bitmap;}; /**
 * The image for the tiling sprite.
 *
 * @property bitmap
 * @type Bitmap
 */Object.defineProperty(TilingSprite.prototype,'bitmap',{get:function get(){return this._bitmap;},set:function set(value){if(this._bitmap !== value){this._bitmap = value;if(this._bitmap){this._bitmap.addLoadListener(this._onBitmapLoad.bind(this));}else {this.texture.setFrame(Rectangle.emptyRectangle);}}},configurable:true}); /**
 * The opacity of the tiling sprite (0 to 255).
 *
 * @property opacity
 * @type Number
 */Object.defineProperty(TilingSprite.prototype,'opacity',{get:function get(){return this.alpha * 255;},set:function set(value){this.alpha = value.clamp(0,255) / 255;},configurable:true}); /**
 * Updates the tiling sprite for each frame.
 *
 * @method update
 */TilingSprite.prototype.update = function(){this.children.forEach(function(child){if(child.update){child.update();}});}; /**
 * Sets the x, y, width, and height all at once.
 *
 * @method move
 * @param {Number} x The x coordinate of the tiling sprite
 * @param {Number} y The y coordinate of the tiling sprite
 * @param {Number} width The width of the tiling sprite
 * @param {Number} height The height of the tiling sprite
 */TilingSprite.prototype.move = function(x,y,width,height){this.x = x || 0;this.y = y || 0;this._width = width || 0;this._height = height || 0;}; /**
 * Specifies the region of the image that the tiling sprite will use.
 *
 * @method setFrame
 * @param {Number} x The x coordinate of the frame
 * @param {Number} y The y coordinate of the frame
 * @param {Number} width The width of the frame
 * @param {Number} height The height of the frame
 */TilingSprite.prototype.setFrame = function(x,y,width,height){this._frame.x = x;this._frame.y = y;this._frame.width = width;this._frame.height = height;this._refresh();}; /**
 * @method updateTransform
 * @private
 */TilingSprite.prototype.updateTransform = function(){this.tilePosition.x = Math.round(-this.origin.x);this.tilePosition.y = Math.round(-this.origin.y);if(!this.tilingTexture){this.originalTexture = null;this.generateTilingTexture(true);}PIXI.TilingSprite.prototype.updateTransform.call(this);}; /**
 * @method _onBitmapLoad
 * @private
 */TilingSprite.prototype._onBitmapLoad = function(){this.texture.baseTexture = this._bitmap.baseTexture;this._refresh();}; /**
 * @method _refresh
 * @private
 */TilingSprite.prototype._refresh = function(){var frame=this._frame.clone();if(frame.width === 0 && frame.height === 0 && this._bitmap){frame.width = this._bitmap.width;frame.height = this._bitmap.height;}var lastTrim=this.texture.trim;this.texture.trim = frame;this.texture.setFrame(frame);this.texture.trim = lastTrim;this.tilingTexture = null;}; // The important members from Pixi.js
/**
 * The visibility of the tiling sprite.
 *
 * @property visible
 * @type Boolean
 */ /**
 * The x coordinate of the tiling sprite.
 *
 * @property x
 * @type Number
 */ /**
 * The y coordinate of the tiling sprite.
 *
 * @property y
 * @type Number
 */ //-----------------------------------------------------------------------------
/**
 * The sprite which covers the entire game screen.
 *
 * @class ScreenSprite
 * @constructor
 */function ScreenSprite(){this.initialize.apply(this,arguments);}ScreenSprite.prototype = Object.create(PIXI.Sprite.prototype);ScreenSprite.prototype.constructor = ScreenSprite;ScreenSprite.prototype.initialize = function(){var texture=new PIXI.Texture(new PIXI.BaseTexture());PIXI.Sprite.call(this,texture);this._bitmap = new Bitmap(1,1);this.texture.baseTexture = this._bitmap.baseTexture;this.texture.setFrame(new Rectangle(0,0,1,1));this.scale.x = Graphics.width;this.scale.y = Graphics.height;this.opacity = 0;this._red = -1;this._green = -1;this._blue = -1;this._colorText = '';this.setBlack();}; /**
 * The opacity of the sprite (0 to 255).
 *
 * @property opacity
 * @type Number
 */Object.defineProperty(ScreenSprite.prototype,'opacity',{get:function get(){return this.alpha * 255;},set:function set(value){this.alpha = value.clamp(0,255) / 255;},configurable:true}); /**
 * Sets black to the color of the screen sprite.
 *
 * @method setBlack
 */ScreenSprite.prototype.setBlack = function(){this.setColor(0,0,0);}; /**
 * Sets white to the color of the screen sprite.
 *
 * @method setWhite
 */ScreenSprite.prototype.setWhite = function(){this.setColor(255,255,255);}; /**
 * Sets the color of the screen sprite by values.
 *
 * @method setColor
 * @param {Number} r The red value in the range (0, 255)
 * @param {Number} g The green value in the range (0, 255)
 * @param {Number} b The blue value in the range (0, 255)
 */ScreenSprite.prototype.setColor = function(r,g,b){if(this._red !== r || this._green !== g || this._blue !== b){r = Math.round(r || 0).clamp(0,255);g = Math.round(g || 0).clamp(0,255);b = Math.round(b || 0).clamp(0,255);this._red = r;this._green = g;this._blue = b;this._colorText = Utils.rgbToCssColor(r,g,b);this._bitmap.fillAll(this._colorText);}}; /**
 * @method _renderCanvas
 * @param {Object} renderSession
 * @private
 */ScreenSprite.prototype._renderCanvas = function(renderSession){if(this.visible && this.alpha > 0){var context=renderSession.context;var t=this.worldTransform;var r=renderSession.resolution;context.setTransform(t.a,t.b,t.c,t.d,t.tx * r,t.ty * r);context.globalCompositeOperation = PIXI.blendModesCanvas[this.blendMode];context.globalAlpha = this.alpha;context.fillStyle = this._colorText;context.fillRect(0,0,Graphics.width,Graphics.height);}}; //-----------------------------------------------------------------------------
/**
 * The window in the game.
 *
 * @class Window
 * @constructor
 */function Window(){this.initialize.apply(this,arguments);}Window.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);Window.prototype.constructor = Window;Window.prototype.initialize = function(){PIXI.DisplayObjectContainer.call(this);this._isWindow = true;this._windowskin = null;this._width = 0;this._height = 0;this._cursorRect = new Rectangle();this._openness = 255;this._animationCount = 0;this._padding = 18;this._margin = 4;this._colorTone = [0,0,0];this._windowSpriteContainer = null;this._windowBackSprite = null;this._windowCursorSprite = null;this._windowFrameSprite = null;this._windowContentsSprite = null;this._windowArrowSprites = [];this._windowPauseSignSprite = null;this._createAllParts(); /**
     * The origin point of the window for scrolling.
     *
     * @property origin
     * @type Point
     */this.origin = new Point(); /**
     * The active state for the window.
     *
     * @property active
     * @type Boolean
     */this.active = true; /**
     * The visibility of the down scroll arrow.
     *
     * @property downArrowVisible
     * @type Boolean
     */this.downArrowVisible = false; /**
     * The visibility of the up scroll arrow.
     *
     * @property upArrowVisible
     * @type Boolean
     */this.upArrowVisible = false; /**
     * The visibility of the pause sign.
     *
     * @property pause
     * @type Boolean
     */this.pause = false;}; /**
 * The image used as a window skin.
 *
 * @property windowskin
 * @type Bitmap
 */Object.defineProperty(Window.prototype,'windowskin',{get:function get(){return this._windowskin;},set:function set(value){if(this._windowskin !== value){this._windowskin = value;this._windowskin.addLoadListener(this._onWindowskinLoad.bind(this));}},configurable:true}); /**
 * The bitmap used for the window contents.
 *
 * @property contents
 * @type Bitmap
 */Object.defineProperty(Window.prototype,'contents',{get:function get(){return this._windowContentsSprite.bitmap;},set:function set(value){this._windowContentsSprite.bitmap = value;},configurable:true}); /**
 * The width of the window in pixels.
 *
 * @property width
 * @type Number
 */Object.defineProperty(Window.prototype,'width',{get:function get(){return this._width;},set:function set(value){this._width = value;this._refreshAllParts();},configurable:true}); /**
 * The height of the window in pixels.
 *
 * @property height
 * @type Number
 */Object.defineProperty(Window.prototype,'height',{get:function get(){return this._height;},set:function set(value){this._height = value;this._refreshAllParts();},configurable:true}); /**
 * The size of the padding between the frame and contents.
 *
 * @property padding
 * @type Number
 */Object.defineProperty(Window.prototype,'padding',{get:function get(){return this._padding;},set:function set(value){this._padding = value;this._refreshAllParts();},configurable:true}); /**
 * The size of the margin for the window background.
 *
 * @property margin
 * @type Number
 */Object.defineProperty(Window.prototype,'margin',{get:function get(){return this._margin;},set:function set(value){this._margin = value;this._refreshAllParts();},configurable:true}); /**
 * The opacity of the window without contents (0 to 255).
 *
 * @property opacity
 * @type Number
 */Object.defineProperty(Window.prototype,'opacity',{get:function get(){return this._windowSpriteContainer.alpha * 255;},set:function set(value){this._windowSpriteContainer.alpha = value.clamp(0,255) / 255;},configurable:true}); /**
 * The opacity of the window background (0 to 255).
 *
 * @property backOpacity
 * @type Number
 */Object.defineProperty(Window.prototype,'backOpacity',{get:function get(){return this._windowBackSprite.alpha * 255;},set:function set(value){this._windowBackSprite.alpha = value.clamp(0,255) / 255;},configurable:true}); /**
 * The opacity of the window contents (0 to 255).
 *
 * @property contentsOpacity
 * @type Number
 */Object.defineProperty(Window.prototype,'contentsOpacity',{get:function get(){return this._windowContentsSprite.alpha * 255;},set:function set(value){this._windowContentsSprite.alpha = value.clamp(0,255) / 255;},configurable:true}); /**
 * The openness of the window (0 to 255).
 *
 * @property openness
 * @type Number
 */Object.defineProperty(Window.prototype,'openness',{get:function get(){return this._openness;},set:function set(value){if(this._openness !== value){this._openness = value.clamp(0,255);this._windowSpriteContainer.scale.y = this._openness / 255;this._windowSpriteContainer.y = this.height / 2 * (1 - this._openness / 255);}},configurable:true}); /**
 * Updates the window for each frame.
 *
 * @method update
 */Window.prototype.update = function(){if(this.active){this._animationCount++;}this.children.forEach(function(child){if(child.update){child.update();}});}; /**
 * Sets the x, y, width, and height all at once.
 *
 * @method move
 * @param {Number} x The x coordinate of the window
 * @param {Number} y The y coordinate of the window
 * @param {Number} width The width of the window
 * @param {Number} height The height of the window
 */Window.prototype.move = function(x,y,width,height){this.x = x || 0;this.y = y || 0;if(this._width !== width || this._height !== height){this._width = width || 0;this._height = height || 0;this._refreshAllParts();}}; /**
 * Returns true if the window is completely open (openness == 255).
 *
 * @method isOpen
 */Window.prototype.isOpen = function(){return this._openness >= 255;}; /**
 * Returns true if the window is completely closed (openness == 0).
 *
 * @method isClosed
 */Window.prototype.isClosed = function(){return this._openness <= 0;}; /**
 * Sets the position of the command cursor.
 *
 * @method setCursorRect
 * @param {Number} x The x coordinate of the cursor
 * @param {Number} y The y coordinate of the cursor
 * @param {Number} width The width of the cursor
 * @param {Number} height The height of the cursor
 */Window.prototype.setCursorRect = function(x,y,width,height){var cx=Math.floor(x || 0);var cy=Math.floor(y || 0);var cw=Math.floor(width || 0);var ch=Math.floor(height || 0);var rect=this._cursorRect;if(rect.x !== cx || rect.y !== cy || rect.width !== cw || rect.height !== ch){this._cursorRect.x = cx;this._cursorRect.y = cy;this._cursorRect.width = cw;this._cursorRect.height = ch;this._refreshCursor();}}; /**
 * Changes the color of the background.
 *
 * @method setTone
 * @param {Number} r The red value in the range (-255, 255)
 * @param {Number} g The green value in the range (-255, 255)
 * @param {Number} b The blue value in the range (-255, 255)
 */Window.prototype.setTone = function(r,g,b){var tone=this._colorTone;if(r !== tone[0] || g !== tone[1] || b !== tone[2]){this._colorTone = [r,g,b];this._refreshBack();}}; /**
 * Adds a child between the background and contents.
 *
 * @method addChildToBack
 * @param {Object} child The child to add
 * @return {Object} The child that was added
 */Window.prototype.addChildToBack = function(child){var containerIndex=this.children.indexOf(this._windowSpriteContainer);return this.addChildAt(child,containerIndex + 1);}; /**
 * @method updateTransform
 * @private
 */Window.prototype.updateTransform = function(){this._updateCursor();this._updateArrows();this._updatePauseSign();this._updateContents();PIXI.DisplayObjectContainer.prototype.updateTransform.call(this);}; /**
 * @method _createAllParts
 * @private
 */Window.prototype._createAllParts = function(){this._windowSpriteContainer = new PIXI.DisplayObjectContainer();this._windowBackSprite = new Sprite();this._windowCursorSprite = new Sprite();this._windowFrameSprite = new Sprite();this._windowContentsSprite = new Sprite();this._downArrowSprite = new Sprite();this._upArrowSprite = new Sprite();this._windowPauseSignSprite = new Sprite();this._windowBackSprite.bitmap = new Bitmap(1,1);this._windowBackSprite.alpha = 192 / 255;this.addChild(this._windowSpriteContainer);this._windowSpriteContainer.addChild(this._windowBackSprite);this._windowSpriteContainer.addChild(this._windowFrameSprite);this.addChild(this._windowCursorSprite);this.addChild(this._windowContentsSprite);this.addChild(this._downArrowSprite);this.addChild(this._upArrowSprite);this.addChild(this._windowPauseSignSprite);}; /**
 * @method _onWindowskinLoad
 * @private
 */Window.prototype._onWindowskinLoad = function(){this._refreshAllParts();}; /**
 * @method _refreshAllParts
 * @private
 */Window.prototype._refreshAllParts = function(){this._refreshBack();this._refreshFrame();this._refreshCursor();this._refreshContents();this._refreshArrows();this._refreshPauseSign();}; /**
 * @method _refreshBack
 * @private
 */Window.prototype._refreshBack = function(){var m=this._margin;var w=this._width - m * 2;var h=this._height - m * 2;var bitmap=new Bitmap(w,h);this._windowBackSprite.bitmap = bitmap;this._windowBackSprite.setFrame(0,0,w,h);this._windowBackSprite.move(m,m);if(w > 0 && h > 0 && this._windowskin){var p=96;bitmap.blt(this._windowskin,0,0,p,p,0,0,w,h);for(var y=0;y < h;y += p) {for(var x=0;x < w;x += p) {bitmap.blt(this._windowskin,0,p,p,p,x,y,p,p);}}var tone=this._colorTone;bitmap.adjustTone(tone[0],tone[1],tone[2]);}}; /**
 * @method _refreshFrame
 * @private
 */Window.prototype._refreshFrame = function(){var w=this._width;var h=this._height;var m=24;var bitmap=new Bitmap(w,h);this._windowFrameSprite.bitmap = bitmap;this._windowFrameSprite.setFrame(0,0,w,h);if(w > 0 && h > 0 && this._windowskin){var skin=this._windowskin;var p=96;var q=96;bitmap.blt(skin,p + m,0 + 0,p - m * 2,m,m,0,w - m * 2,m);bitmap.blt(skin,p + m,0 + q - m,p - m * 2,m,m,h - m,w - m * 2,m);bitmap.blt(skin,p + 0,0 + m,m,p - m * 2,0,m,m,h - m * 2);bitmap.blt(skin,p + q - m,0 + m,m,p - m * 2,w - m,m,m,h - m * 2);bitmap.blt(skin,p + 0,0 + 0,m,m,0,0,m,m);bitmap.blt(skin,p + q - m,0 + 0,m,m,w - m,0,m,m);bitmap.blt(skin,p + 0,0 + q - m,m,m,0,h - m,m,m);bitmap.blt(skin,p + q - m,0 + q - m,m,m,w - m,h - m,m,m);}}; /**
 * @method _refreshCursor
 * @private
 */Window.prototype._refreshCursor = function(){var pad=this._padding;var x=this._cursorRect.x + pad - this.origin.x;var y=this._cursorRect.y + pad - this.origin.y;var w=this._cursorRect.width;var h=this._cursorRect.height;var m=4;var x2=Math.max(x,pad);var y2=Math.max(y,pad);var ox=x - x2;var oy=y - y2;var w2=Math.min(w,this._width - pad - x2);var h2=Math.min(h,this._height - pad - y2);var bitmap=new Bitmap(w2,h2);this._windowCursorSprite.bitmap = bitmap;this._windowCursorSprite.setFrame(0,0,w2,h2);this._windowCursorSprite.move(x2,y2);if(w > 0 && h > 0 && this._windowskin){var skin=this._windowskin;var p=96;var q=48;bitmap.blt(skin,p + m,p + m,q - m * 2,q - m * 2,ox + m,oy + m,w - m * 2,h - m * 2);bitmap.blt(skin,p + m,p + 0,q - m * 2,m,ox + m,oy + 0,w - m * 2,m);bitmap.blt(skin,p + m,p + q - m,q - m * 2,m,ox + m,oy + h - m,w - m * 2,m);bitmap.blt(skin,p + 0,p + m,m,q - m * 2,ox + 0,oy + m,m,h - m * 2);bitmap.blt(skin,p + q - m,p + m,m,q - m * 2,ox + w - m,oy + m,m,h - m * 2);bitmap.blt(skin,p + 0,p + 0,m,m,ox + 0,oy + 0,m,m);bitmap.blt(skin,p + q - m,p + 0,m,m,ox + w - m,oy + 0,m,m);bitmap.blt(skin,p + 0,p + q - m,m,m,ox + 0,oy + h - m,m,m);bitmap.blt(skin,p + q - m,p + q - m,m,m,ox + w - m,oy + h - m,m,m);}}; /**
 * @method _refreshContents
 * @private
 */Window.prototype._refreshContents = function(){this._windowContentsSprite.move(this.padding,this.padding);}; /**
 * @method _refreshArrows
 * @private
 */Window.prototype._refreshArrows = function(){var w=this._width;var h=this._height;var p=24;var q=p / 2;var sx=96 + p;var sy=0 + p;this._downArrowSprite.bitmap = this._windowskin;this._downArrowSprite.anchor.x = 0.5;this._downArrowSprite.anchor.y = 0.5;this._downArrowSprite.setFrame(sx + q,sy + q + p,p,q);this._downArrowSprite.move(w / 2,h - q);this._upArrowSprite.bitmap = this._windowskin;this._upArrowSprite.anchor.x = 0.5;this._upArrowSprite.anchor.y = 0.5;this._upArrowSprite.setFrame(sx + q,sy,p,q);this._upArrowSprite.move(w / 2,q);}; /**
 * @method _refreshPauseSign
 * @private
 */Window.prototype._refreshPauseSign = function(){var sx=144;var sy=96;var p=24;this._windowPauseSignSprite.bitmap = this._windowskin;this._windowPauseSignSprite.anchor.x = 0.5;this._windowPauseSignSprite.anchor.y = 1;this._windowPauseSignSprite.move(this._width / 2,this._height);this._windowPauseSignSprite.setFrame(sx,sy,p,p);this._windowPauseSignSprite.alpha = 0;}; /**
 * @method _updateCursor
 * @private
 */Window.prototype._updateCursor = function(){var blinkCount=this._animationCount % 40;var cursorOpacity=this.contentsOpacity;if(this.active){if(blinkCount < 20){cursorOpacity -= blinkCount * 8;}else {cursorOpacity -= (40 - blinkCount) * 8;}}this._windowCursorSprite.alpha = cursorOpacity / 255;this._windowCursorSprite.visible = this.isOpen();}; /**
 * @method _updateContents
 * @private
 */Window.prototype._updateContents = function(){var w=this._width - this._padding * 2;var h=this._height - this._padding * 2;if(w > 0 && h > 0){this._windowContentsSprite.setFrame(this.origin.x,this.origin.y,w,h);this._windowContentsSprite.visible = this.isOpen();}else {this._windowContentsSprite.visible = false;}}; /**
 * @method _updateArrows
 * @private
 */Window.prototype._updateArrows = function(){this._downArrowSprite.visible = this.isOpen() && this.downArrowVisible;this._upArrowSprite.visible = this.isOpen() && this.upArrowVisible;}; /**
 * @method _updatePauseSign
 * @private
 */Window.prototype._updatePauseSign = function(){var sprite=this._windowPauseSignSprite;var x=Math.floor(this._animationCount / 16) % 2;var y=Math.floor(this._animationCount / 16 / 2) % 2;var sx=144;var sy=96;var p=24;if(!this.pause){sprite.alpha = 0;}else if(sprite.alpha < 1){sprite.alpha = Math.min(sprite.alpha + 0.1,1);}sprite.setFrame(sx + x * p,sy + y * p,p,p);sprite.visible = this.isOpen();}; // The important members from Pixi.js
/**
 * The visibility of the window.
 *
 * @property visible
 * @type Boolean
 */ /**
 * The x coordinate of the window.
 *
 * @property x
 * @type Number
 */ /**
 * The y coordinate of the window.
 *
 * @property y
 * @type Number
 */ /**
 * [read-only] The array of children of the window.
 *
 * @property children
 * @type Array
 */ /**
 * [read-only] The object that contains the window.
 *
 * @property parent
 * @type Object
 */ /**
 * Adds a child to the container.
 *
 * @method addChild
 * @param {Object} child The child to add
 * @return {Object} The child that was added
 */ /**
 * Adds a child to the container at a specified index.
 *
 * @method addChildAt
 * @param {Object} child The child to add
 * @param {Number} index The index to place the child in
 * @return {Object} The child that was added
 */ /**
 * Removes a child from the container.
 *
 * @method removeChild
 * @param {Object} child The child to remove
 * @return {Object} The child that was removed
 */ /**
 * Removes a child from the specified index position.
 *
 * @method removeChildAt
 * @param {Number} index The index to get the child from
 * @return {Object} The child that was removed
 */ //-----------------------------------------------------------------------------
/**
 * The layer which contains game windows.
 *
 * @class WindowLayer
 * @constructor
 */function WindowLayer(){this.initialize.apply(this,arguments);}WindowLayer.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);WindowLayer.prototype.constructor = WindowLayer;WindowLayer.prototype.initialize = function(){PIXI.DisplayObjectContainer.call(this);this._width = 0;this._height = 0;this._tempCanvas = null;this._vertexBuffer = null;this._translationMatrix = [1,0,0,0,1,0,0,0,1];this._dummySprite = new Sprite(new Bitmap(1,1));}; /**
 * The width of the window layer in pixels.
 *
 * @property width
 * @type Number
 */Object.defineProperty(WindowLayer.prototype,'width',{get:function get(){return this._width;},set:function set(value){this._width = value;},configurable:true}); /**
 * The height of the window layer in pixels.
 *
 * @property height
 * @type Number
 */Object.defineProperty(WindowLayer.prototype,'height',{get:function get(){return this._height;},set:function set(value){this._height = value;},configurable:true}); /**
 * Sets the x, y, width, and height all at once.
 *
 * @method move
 * @param {Number} x The x coordinate of the window layer
 * @param {Number} y The y coordinate of the window layer
 * @param {Number} width The width of the window layer
 * @param {Number} height The height of the window layer
 */WindowLayer.prototype.move = function(x,y,width,height){this.x = x;this.y = y;this.width = width;this.height = height;}; /**
 * Updates the window layer for each frame.
 *
 * @method update
 */WindowLayer.prototype.update = function(){this.children.forEach(function(child){if(child.update){child.update();}});}; /**
 * @method _renderCanvas
 * @param {Object} renderSession
 * @private
 */WindowLayer.prototype._renderCanvas = function(renderSession){if(!this.visible){return;}if(!this._tempCanvas){this._tempCanvas = document.createElement('canvas');}this._tempCanvas.width = Graphics.width;this._tempCanvas.height = Graphics.height;var realCanvasContext=renderSession.context;var context=this._tempCanvas.getContext('2d');context.save();context.clearRect(0,0,Graphics.width,Graphics.height);context.beginPath();context.rect(this.x,this.y,this.width,this.height);context.closePath();context.clip();renderSession.context = context;for(var i=0;i < this.children.length;i++) {var child=this.children[i];if(child._isWindow && child.visible && child.openness > 0){this._canvasClearWindowRect(renderSession,child);context.save();child._renderCanvas(renderSession);context.restore();}}context.restore();renderSession.context = realCanvasContext;renderSession.context.setTransform(1,0,0,1,0,0);renderSession.context.globalCompositeOperation = 'source-over';renderSession.context.globalAlpha = 1;renderSession.context.drawImage(this._tempCanvas,0,0);for(var j=0;j < this.children.length;j++) {if(!this.children[j]._isWindow){this.children[j]._renderCanvas(renderSession);}}}; /**
 * @method _canvasClearWindowRect
 * @param {Object} renderSession
 * @param {Window} window
 * @private
 */WindowLayer.prototype._canvasClearWindowRect = function(renderSession,window){var rx=this.x + window.x;var ry=this.y + window.y + window.height / 2 * (1 - window._openness / 255);var rw=window.width;var rh=window.height * window._openness / 255;renderSession.context.clearRect(rx,ry,rw,rh);}; /**
 * @method _renderWebGL
 * @param {Object} renderSession
 * @private
 */WindowLayer.prototype._renderWebGL = function(renderSession){if(!this.visible){return;}var gl=renderSession.gl;if(!this._vertexBuffer){this._vertexBuffer = gl.createBuffer();}this._dummySprite._renderWebGL(renderSession);renderSession.spriteBatch.stop();gl.enable(gl.STENCIL_TEST);gl.clear(gl.STENCIL_BUFFER_BIT);this._webglMaskOutside(renderSession);renderSession.spriteBatch.start();for(var i=this.children.length - 1;i >= 0;i--) {var child=this.children[i];if(child._isWindow && child.visible && child.openness > 0){gl.stencilFunc(gl.EQUAL,0,0xFF);child._renderWebGL(renderSession);renderSession.spriteBatch.stop();this._webglMaskWindow(renderSession,child);renderSession.spriteBatch.start();}}gl.disable(gl.STENCIL_TEST);for(var j=0;j < this.children.length;j++) {if(!this.children[j]._isWindow){this.children[j]._renderWebGL(renderSession);}}}; /**
 * @method _webglMaskOutside
 * @param {Object} renderSession
 * @private
 */WindowLayer.prototype._webglMaskOutside = function(renderSession){var x1=this.x;var y1=this.y;var x2=this.x + this.width;var y2=this.y + this.height;this._webglMaskRect(renderSession,0,0,Graphics.width,y1);this._webglMaskRect(renderSession,0,y2,Graphics.width,Graphics.height - y2);this._webglMaskRect(renderSession,0,0,x1,Graphics.height);this._webglMaskRect(renderSession,x2,0,Graphics.width - x2,Graphics.height);}; /**
 * @method _webglMaskWindow
 * @param {Object} renderSession
 * @param {Window} window
 * @private
 */WindowLayer.prototype._webglMaskWindow = function(renderSession,window){var rx=this.x + window.x;var ry=this.y + window.y + window.height / 2 * (1 - window._openness / 255);var rw=window.width;var rh=window.height * window._openness / 255;this._webglMaskRect(renderSession,rx,ry,rw,rh);}; /**
 * @method _webglMaskRect
 * @param {Object} renderSession
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w
 * @param {Number} h
 * @private
 */WindowLayer.prototype._webglMaskRect = function(renderSession,x,y,w,h){if(w > 0 && h > 0){var gl=renderSession.gl;var projection=renderSession.projection;var offset=renderSession.offset;var shader=renderSession.shaderManager.primitiveShader;renderSession.shaderManager.setShader(shader);gl.uniformMatrix3fv(shader.translationMatrix,false,this._translationMatrix);gl.uniform1f(shader.flipY,1);gl.uniform2f(shader.projectionVector,projection.x,-projection.y);gl.uniform2f(shader.offsetVector,-offset.x,-offset.y);gl.stencilFunc(gl.EQUAL,0,0xFF);gl.stencilOp(gl.KEEP,gl.KEEP,gl.INCR);var data=new Float32Array([x,y,x + w,y,x,y + h,x,y + h,x + w,y,x + w,y + h]);gl.bindBuffer(gl.ARRAY_BUFFER,this._vertexBuffer);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);gl.enableVertexAttribArray(shader.aVertexPosition);gl.vertexAttribPointer(shader.aVertexPosition,2,gl.FLOAT,false,0,0);gl.drawArrays(gl.TRIANGLES,0,6);gl.stencilOp(gl.KEEP,gl.KEEP,gl.KEEP);}}; // The important members from Pixi.js
/**
 * The x coordinate of the window layer.
 *
 * @property x
 * @type Number
 */ /**
 * The y coordinate of the window layer.
 *
 * @property y
 * @type Number
 */ /**
 * [read-only] The array of children of the window layer.
 *
 * @property children
 * @type Array
 */ /**
 * [read-only] The object that contains the window layer.
 *
 * @property parent
 * @type Object
 */ /**
 * Adds a child to the container.
 *
 * @method addChild
 * @param {Object} child The child to add
 * @return {Object} The child that was added
 */ /**
 * Adds a child to the container at a specified index.
 *
 * @method addChildAt
 * @param {Object} child The child to add
 * @param {Number} index The index to place the child in
 * @return {Object} The child that was added
 */ /**
 * Removes a child from the container.
 *
 * @method removeChild
 * @param {Object} child The child to remove
 * @return {Object} The child that was removed
 */ /**
 * Removes a child from the specified index position.
 *
 * @method removeChildAt
 * @param {Number} index The index to get the child from
 * @return {Object} The child that was removed
 */ //-----------------------------------------------------------------------------
/**
 * The weather effect which displays rain, storm, or snow.
 *
 * @class Weather
 * @constructor
 */function Weather(){this.initialize.apply(this,arguments);}Weather.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);Weather.prototype.constructor = Weather;Weather.prototype.initialize = function(){PIXI.DisplayObjectContainer.call(this);this._width = Graphics.width;this._height = Graphics.height;this._sprites = [];this._createBitmaps();this._createDimmer(); /**
     * The type of the weather in ['none', 'rain', 'storm', 'snow'].
     *
     * @property type
     * @type String
     */this.type = 'none'; /**
     * The power of the weather in the range (0, 9).
     *
     * @property power
     * @type Number
     */this.power = 0; /**
     * The origin point of the weather for scrolling.
     *
     * @property origin
     * @type Point
     */this.origin = new Point();}; /**
 * Updates the weather for each frame.
 *
 * @method update
 */Weather.prototype.update = function(){this._updateDimmer();this._updateAllSprites();}; /**
 * @method _createBitmaps
 * @private
 */Weather.prototype._createBitmaps = function(){this._rainBitmap = new Bitmap(1,60);this._rainBitmap.fillAll('white');this._stormBitmap = new Bitmap(2,100);this._stormBitmap.fillAll('white');this._snowBitmap = new Bitmap(9,9);this._snowBitmap.drawCircle(4,4,4,'white');}; /**
 * @method _createDimmer
 * @private
 */Weather.prototype._createDimmer = function(){this._dimmerSprite = new ScreenSprite();this._dimmerSprite.setColor(80,80,80);this.addChild(this._dimmerSprite);}; /**
 * @method _updateDimmer
 * @private
 */Weather.prototype._updateDimmer = function(){this._dimmerSprite.opacity = Math.floor(this.power * 6);}; /**
 * @method _updateAllSprites
 * @private
 */Weather.prototype._updateAllSprites = function(){var maxSprites=Math.floor(this.power * 10);while(this._sprites.length < maxSprites) {this._addSprite();}while(this._sprites.length > maxSprites) {this._removeSprite();}this._sprites.forEach(function(sprite){this._updateSprite(sprite);sprite.x = sprite.ax - this.origin.x;sprite.y = sprite.ay - this.origin.y;},this);}; /**
 * @method _addSprite
 * @private
 */Weather.prototype._addSprite = function(){var sprite=new Sprite(this.viewport);sprite.opacity = 0;this._sprites.push(sprite);this.addChild(sprite);}; /**
 * @method _removeSprite
 * @private
 */Weather.prototype._removeSprite = function(){this.removeChild(this._sprites.pop());}; /**
 * @method _updateSprite
 * @param {Sprite} sprite
 * @private
 */Weather.prototype._updateSprite = function(sprite){switch(this.type){case 'rain':this._updateRainSprite(sprite);break;case 'storm':this._updateStormSprite(sprite);break;case 'snow':this._updateSnowSprite(sprite);break;}if(sprite.opacity < 40){this._rebornSprite(sprite);}}; /**
 * @method _updateRainSprite
 * @param {Sprite} sprite
 * @private
 */Weather.prototype._updateRainSprite = function(sprite){sprite.bitmap = this._rainBitmap;sprite.rotation = Math.PI / 16;sprite.ax -= 6 * Math.sin(sprite.rotation);sprite.ay += 6 * Math.cos(sprite.rotation);sprite.opacity -= 6;}; /**
 * @method _updateStormSprite
 * @param {Sprite} sprite
 * @private
 */Weather.prototype._updateStormSprite = function(sprite){sprite.bitmap = this._stormBitmap;sprite.rotation = Math.PI / 8;sprite.ax -= 8 * Math.sin(sprite.rotation);sprite.ay += 8 * Math.cos(sprite.rotation);sprite.opacity -= 8;}; /**
 * @method _updateSnowSprite
 * @param {Sprite} sprite
 * @private
 */Weather.prototype._updateSnowSprite = function(sprite){sprite.bitmap = this._snowBitmap;sprite.rotation = Math.PI / 16;sprite.ax -= 3 * Math.sin(sprite.rotation);sprite.ay += 3 * Math.cos(sprite.rotation);sprite.opacity -= 3;}; /**
 * @method _rebornSprite
 * @param {Sprite} sprite
 * @private
 */Weather.prototype._rebornSprite = function(sprite){sprite.ax = Math.randomInt(Graphics.width + 100) - 100 + this.origin.x;sprite.ay = Math.randomInt(Graphics.height + 200) - 200 + this.origin.y;sprite.opacity = 160 + Math.randomInt(60);}; //-----------------------------------------------------------------------------
/**
 * The color matrix filter for WebGL.
 *
 * @class ToneFilter
 * @constructor
 */function ToneFilter(){PIXI.AbstractFilter.call(this);this.initialize.apply(this,arguments);}ToneFilter.prototype = Object.create(PIXI.AbstractFilter.prototype);ToneFilter.prototype.constructor = ToneFilter;ToneFilter.prototype.initialize = function(){this.passes = [this];this.uniforms = {matrix:{type:'mat4',value:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]}};this.fragmentSrc = ['precision mediump float;','varying vec2 vTextureCoord;','varying vec4 vColor;','uniform mat4 matrix;','uniform sampler2D uSampler;','void main(void) {','   gl_FragColor = texture2D(uSampler, vTextureCoord) * matrix;','}'];}; /**
 * Resets the filter.
 *
 * @method reset
 */ToneFilter.prototype.reset = function(){this.uniforms.matrix.value = [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];}; /**
 * Changes the hue.
 *
 * @method adjustHue
 * @param {Number} value The hue value in the range (-360, 360)
 */ToneFilter.prototype.adjustHue = function(value){value = (value || 0) / 180;if(value !== 0){var c=Math.cos(value * Math.PI);var s=Math.sin(value * Math.PI);var a00=0.213 + c * 0.787 - s * 0.213;var a01=0.715 - c * 0.715 - s * 0.715;var a02=0.072 - c * 0.072 + s * 0.928;var a10=0.213 - c * 0.213 + s * 0.143;var a11=0.715 + c * 0.285 + s * 0.140;var a12=0.072 - c * 0.072 - s * 0.283;var a20=0.213 - c * 0.213 - s * 0.787;var a21=0.715 - c * 0.715 + s * 0.715;var a22=0.072 + c * 0.928 + s * 0.072;this._multiplyMatrix([a00,a01,a02,0,a10,a11,a12,0,a20,a21,a22,0,0,0,0,1]);}}; /**
 * Changes the saturation.
 *
 * @method adjustSaturation
 * @param {Number} value The saturation value in the range (-255, 255)
 */ToneFilter.prototype.adjustSaturation = function(value){value = (value || 0).clamp(-255,255) / 255;if(value !== 0){var a=1 + value;var a00=0.213 + 0.787 * a;var a01=0.715 - 0.715 * a;var a02=0.072 - 0.072 * a;var a10=0.213 - 0.213 * a;var a11=0.715 + 0.285 * a;var a12=0.072 - 0.072 * a;var a20=0.213 - 0.213 * a;var a21=0.715 - 0.715 * a;var a22=0.072 + 0.928 * a;this._multiplyMatrix([a00,a01,a02,0,a10,a11,a12,0,a20,a21,a22,0,0,0,0,1]);}}; /**
 * Changes the tone.
 *
 * @method adjustTone
 * @param {Number} r The red strength in the range (-255, 255)
 * @param {Number} g The green strength in the range (-255, 255)
 * @param {Number} b The blue strength in the range (-255, 255)
 */ToneFilter.prototype.adjustTone = function(r,g,b){r = (r || 0).clamp(-255,255) / 255;g = (g || 0).clamp(-255,255) / 255;b = (b || 0).clamp(-255,255) / 255;if(r !== 0 || g !== 0 || b !== 0){this._multiplyMatrix([1,0,0,r,0,1,0,g,0,0,1,b,0,0,0,1]);}}; /**
 * @method _multiplyMatrix
 * @param {Array} matrix
 * @private
 */ToneFilter.prototype._multiplyMatrix = function(matrix){var value=this.uniforms.matrix.value;var temp=[];for(var i=0;i < 4;i++) {for(var m=0;m < 4;m++) {temp[m] = value[i * 4 + m];}for(var j=0;j < 4;j++) {var val=0;for(var n=0;n < 4;n++) {val += matrix[n * 4 + j] * temp[n];}value[i * 4 + j] = val;}}}; //-----------------------------------------------------------------------------
/**
 * The sprite which changes the screen color in 2D canvas mode.
 *
 * @class ToneSprite
 * @constructor
 */function ToneSprite(){this.initialize.apply(this,arguments);}ToneSprite.prototype = Object.create(PIXI.DisplayObject.prototype);ToneSprite.prototype.constructor = ToneSprite;ToneSprite.prototype.initialize = function(){PIXI.DisplayObject.call(this);this.clear();}; /**
 * Clears the tone.
 *
 * @method reset
 */ToneSprite.prototype.clear = function(){this._red = 0;this._green = 0;this._blue = 0;this._gray = 0;}; /**
 * Sets the tone.
 *
 * @method setTone
 * @param {Number} r The red strength in the range (-255, 255)
 * @param {Number} g The green strength in the range (-255, 255)
 * @param {Number} b The blue strength in the range (-255, 255)
 * @param {Number} gray The grayscale level in the range (0, 255)
 */ToneSprite.prototype.setTone = function(r,g,b,gray){this._red = Math.round(r || 0).clamp(-255,255);this._green = Math.round(g || 0).clamp(-255,255);this._blue = Math.round(b || 0).clamp(-255,255);this._gray = Math.round(gray || 0).clamp(0,255);}; /**
 * @method _renderCanvas
 * @param {Object} renderSession
 * @private
 */ToneSprite.prototype._renderCanvas = function(renderSession){if(this.visible){var context=renderSession.context;var t=this.worldTransform;var r=renderSession.resolution;var width=Graphics.width;var height=Graphics.height;context.save();context.setTransform(t.a,t.b,t.c,t.d,t.tx * r,t.ty * r);if(Graphics.canUseSaturationBlend() && this._gray > 0){context.globalCompositeOperation = 'saturation';context.globalAlpha = this._gray / 255;context.fillStyle = '#ffffff';context.fillRect(0,0,width,height);}context.globalAlpha = 1;var r1=Math.max(0,this._red);var g1=Math.max(0,this._green);var b1=Math.max(0,this._blue);if(r1 || g1 || b1){context.globalCompositeOperation = 'lighter';context.fillStyle = Utils.rgbToCssColor(r1,g1,b1);context.fillRect(0,0,width,height);}if(Graphics.canUseDifferenceBlend()){var r2=Math.max(0,-this._red);var g2=Math.max(0,-this._green);var b2=Math.max(0,-this._blue);if(r2 || g2 || b2){context.globalCompositeOperation = 'difference';context.fillStyle = '#ffffff';context.fillRect(0,0,width,height);context.globalCompositeOperation = 'lighter';context.fillStyle = Utils.rgbToCssColor(r2,g2,b2);context.fillRect(0,0,width,height);context.globalCompositeOperation = 'difference';context.fillStyle = '#ffffff';context.fillRect(0,0,width,height);}}context.restore();}}; /**
 * @method _renderWebGL
 * @param {Object} renderSession
 * @private
 */ToneSprite.prototype._renderWebGL = function(renderSession){ // Not supported
}; //-----------------------------------------------------------------------------
/**
 * The root object of the display tree.
 *
 * @class Stage
 * @constructor
 */function Stage(){this.initialize.apply(this,arguments);}Stage.prototype = Object.create(PIXI.Stage.prototype);Stage.prototype.constructor = Stage;Stage.prototype.initialize = function(){PIXI.Stage.call(this); // The interactive flag causes a memory leak.
this.interactive = false;}; /**
 * [read-only] The array of children of the stage.
 *
 * @property children
 * @type Array
 */ /**
 * Adds a child to the container.
 *
 * @method addChild
 * @param {Object} child The child to add
 * @return {Object} The child that was added
 */ /**
 * Adds a child to the container at a specified index.
 *
 * @method addChildAt
 * @param {Object} child The child to add
 * @param {Number} index The index to place the child in
 * @return {Object} The child that was added
 */ /**
 * Removes a child from the container.
 *
 * @method removeChild
 * @param {Object} child The child to remove
 * @return {Object} The child that was removed
 */ /**
 * Removes a child from the specified index position.
 *
 * @method removeChildAt
 * @param {Number} index The index to get the child from
 * @return {Object} The child that was removed
 */ //-----------------------------------------------------------------------------
/**
 * The audio object of Web Audio API.
 *
 * @class WebAudio
 * @constructor
 * @param {String} url The url of the audio file
 */function WebAudio(){this.initialize.apply(this,arguments);}WebAudio.prototype.initialize = function(url){if(!WebAudio._initialized){WebAudio.initialize();}this.clear();this._load(url);this._url = url;};WebAudio._context = null;WebAudio._masterGainNode = null;WebAudio._initialized = false;WebAudio._unlocked = false; /**
 * Initializes the audio system.
 *
 * @static
 * @method initialize
 * @param {Boolean} noAudio Flag for the no-audio mode
 * @return {Boolean} True if the audio system is available
 */WebAudio.initialize = function(noAudio){if(!this._initialized){if(!noAudio){this._createContext();this._detectCodecs();this._createMasterGainNode();this._setupEventHandlers();}this._initialized = true;}return !!this._context;}; /**
 * Checks whether the browser can play ogg files.
 *
 * @static
 * @method canPlayOgg
 * @return {Boolean} True if the browser can play ogg files
 */WebAudio.canPlayOgg = function(){if(!this._initialized){this.initialize();}return !!this._canPlayOgg;}; /**
 * Checks whether the browser can play m4a files.
 *
 * @static
 * @method canPlayM4a
 * @return {Boolean} True if the browser can play m4a files
 */WebAudio.canPlayM4a = function(){if(!this._initialized){this.initialize();}return !!this._canPlayM4a;}; /**
 * @static
 * @method _createContext
 * @private
 */WebAudio._createContext = function(){try{if(typeof AudioContext !== 'undefined'){this._context = new AudioContext();}else if(typeof webkitAudioContext !== 'undefined'){this._context = new webkitAudioContext();}}catch(e) {this._context = null;}}; /**
 * @static
 * @method _detectCodecs
 * @private
 */WebAudio._detectCodecs = function(){var audio=document.createElement('audio');if(audio.canPlayType){this._canPlayOgg = audio.canPlayType('audio/ogg');this._canPlayM4a = audio.canPlayType('audio/mp4');}}; /**
 * @static
 * @method _createMasterGainNode
 * @private
 */WebAudio._createMasterGainNode = function(){var context=WebAudio._context;if(context){this._masterGainNode = context.createGain();this._masterGainNode.gain.value = 1;this._masterGainNode.connect(context.destination);}}; /**
 * @static
 * @method _setupEventHandlers
 * @private
 */WebAudio._setupEventHandlers = function(){document.addEventListener('touchstart',this._onTouchStart.bind(this));document.addEventListener('visibilitychange',this._onVisibilityChange.bind(this));}; /**
 * @static
 * @method _onTouchStart
 * @private
 */WebAudio._onTouchStart = function(){var context=WebAudio._context;if(context && !this._unlocked){ // Unlock Web Audio on iOS
var node=context.createBufferSource();node.start(0);this._unlocked = true;}}; /**
 * @static
 * @method _onVisibilityChange
 * @private
 */WebAudio._onVisibilityChange = function(){if(document.visibilityState === 'hidden'){this._onHide();}else {this._onShow();}}; /**
 * @static
 * @method _onHide
 * @private
 */WebAudio._onHide = function(){if(this._shouldMuteOnHide()){this._fadeOut(1);}}; /**
 * @static
 * @method _onShow
 * @private
 */WebAudio._onShow = function(){if(this._shouldMuteOnHide()){this._fadeIn(0.5);}}; /**
 * @static
 * @method _shouldMuteOnHide
 * @private
 */WebAudio._shouldMuteOnHide = function(){return Utils.isMobileDevice();}; /**
 * @static
 * @method _fadeIn
 * @param {Number} duration
 * @private
 */WebAudio._fadeIn = function(duration){if(this._masterGainNode){var gain=this._masterGainNode.gain;var currentTime=WebAudio._context.currentTime;gain.setValueAtTime(gain.value,currentTime);gain.linearRampToValueAtTime(1,currentTime + duration);}}; /**
 * @static
 * @method _fadeOut
 * @param {Number} duration
 * @private
 */WebAudio._fadeOut = function(duration){if(this._masterGainNode){var gain=this._masterGainNode.gain;var currentTime=WebAudio._context.currentTime;gain.setValueAtTime(gain.value,currentTime);gain.linearRampToValueAtTime(0,currentTime + duration);}}; /**
 * Clears the audio data.
 *
 * @method clear
 */WebAudio.prototype.clear = function(){this.stop();this._buffer = null;this._sourceNode = null;this._gainNode = null;this._pannerNode = null;this._totalTime = 0;this._sampleRate = 0;this._loopStart = 0;this._loopLength = 0;this._startTime = 0;this._volume = 1;this._pitch = 1;this._pan = 0;this._endTimer = null;this._loadListeners = [];this._stopListeners = [];this._hasError = false;this._autoPlay = false;}; /**
 * [read-only] The url of the audio file.
 *
 * @property url
 * @type String
 */Object.defineProperty(WebAudio.prototype,'url',{get:function get(){return this._url;},configurable:true}); /**
 * The volume of the audio.
 *
 * @property volume
 * @type Number
 */Object.defineProperty(WebAudio.prototype,'volume',{get:function get(){return this._volume;},set:function set(value){this._volume = value;if(this._gainNode){this._gainNode.gain.value = this._volume;}},configurable:true}); /**
 * The pitch of the audio.
 *
 * @property pitch
 * @type Number
 */Object.defineProperty(WebAudio.prototype,'pitch',{get:function get(){return this._pitch;},set:function set(value){if(this._pitch !== value){this._pitch = value;if(this.isPlaying()){this.play(this._sourceNode.loop,0);}}},configurable:true}); /**
 * The pan of the audio.
 *
 * @property pan
 * @type Number
 */Object.defineProperty(WebAudio.prototype,'pan',{get:function get(){return this._pan;},set:function set(value){this._pan = value;this._updatePanner();},configurable:true}); /**
 * Checks whether the audio data is ready to play.
 *
 * @method isReady
 * @return {Boolean} True if the audio data is ready to play
 */WebAudio.prototype.isReady = function(){return !!this._buffer;}; /**
 * Checks whether a loading error has occurred.
 *
 * @method isError
 * @return {Boolean} True if a loading error has occurred
 */WebAudio.prototype.isError = function(){return this._hasError;}; /**
 * Checks whether the audio is playing.
 *
 * @method isPlaying
 * @return {Boolean} True if the audio is playing
 */WebAudio.prototype.isPlaying = function(){return !!this._sourceNode;}; /**
 * Plays the audio.
 *
 * @method play
 * @param {Boolean} loop Whether the audio data play in a loop
 * @param {Number} offset The start position to play in seconds
 */WebAudio.prototype.play = function(loop,offset){if(this.isReady()){offset = offset || 0;this._startPlaying(loop,offset);}else if(WebAudio._context){this._autoPlay = true;this.addLoadListener((function(){if(this._autoPlay){this.play(loop,offset);}}).bind(this));}}; /**
 * Stops the audio.
 *
 * @method stop
 */WebAudio.prototype.stop = function(){this._autoPlay = false;this._removeEndTimer();this._removeNodes();if(this._stopListeners){while(this._stopListeners.length > 0) {var listner=this._stopListeners.shift();listner();}}}; /**
 * Performs the audio fade-in.
 *
 * @method fadeIn
 * @param {Number} duration Fade-in time in seconds
 */WebAudio.prototype.fadeIn = function(duration){if(this.isReady()){if(this._gainNode){var gain=this._gainNode.gain;var currentTime=WebAudio._context.currentTime;gain.setValueAtTime(0,currentTime);gain.linearRampToValueAtTime(this._volume,currentTime + duration);}}else if(this._autoPlay){this.addLoadListener((function(){this.fadeIn(duration);}).bind(this));}}; /**
 * Performs the audio fade-out.
 *
 * @method fadeOut
 * @param {Number} duration Fade-out time in seconds
 */WebAudio.prototype.fadeOut = function(duration){if(this._gainNode){var gain=this._gainNode.gain;var currentTime=WebAudio._context.currentTime;gain.setValueAtTime(gain.value,currentTime);gain.linearRampToValueAtTime(0,currentTime + duration);}this._autoPlay = false;}; /**
 * Gets the seek position of the audio.
 *
 * @method seek
 */WebAudio.prototype.seek = function(){if(WebAudio._context){var pos=(WebAudio._context.currentTime - this._startTime) * this._pitch;if(this._loopLength > 0){while(pos >= this._loopStart + this._loopLength) {pos -= this._loopLength;}}return pos;}else {return 0;}}; /**
 * Add a callback function that will be called when the audio data is loaded.
 *
 * @method addLoadListener
 * @param {Function} listner The callback function
 */WebAudio.prototype.addLoadListener = function(listner){this._loadListeners.push(listner);}; /**
 * Add a callback function that will be called when the playback is stopped.
 *
 * @method addStopListener
 * @param {Function} listner The callback function
 */WebAudio.prototype.addStopListener = function(listner){this._stopListeners.push(listner);}; /**
 * @method _load
 * @param {String} url
 * @private
 */WebAudio.prototype._load = function(url){if(WebAudio._context){var xhr=new XMLHttpRequest();xhr.open('GET',url);xhr.responseType = 'arraybuffer';xhr.onload = (function(){if(xhr.status < 400){this._onXhrLoad(xhr);}}).bind(this);xhr.onerror = (function(){this._hasError = true;}).bind(this);xhr.send();}}; /**
 * @method _onXhrLoad
 * @param {XMLHttpRequest} xhr
 * @private
 */WebAudio.prototype._onXhrLoad = function(xhr){var array=new Uint8Array(xhr.response);this._readLoopComments(array);WebAudio._context.decodeAudioData(xhr.response,(function(buffer){this._buffer = buffer;this._totalTime = buffer.duration;if(this._loopLength > 0 && this._sampleRate > 0){this._loopStart /= this._sampleRate;this._loopLength /= this._sampleRate;}else {this._loopStart = 0;this._loopLength = this._totalTime;}this._onLoad();}).bind(this));}; /**
 * @method _startPlaying
 * @param {Boolean} loop
 * @param {Number} offset
 * @private
 */WebAudio.prototype._startPlaying = function(loop,offset){this._removeEndTimer();this._removeNodes();this._createNodes();this._connectNodes();this._sourceNode.loop = loop;this._sourceNode.start(0,offset);this._startTime = WebAudio._context.currentTime - offset / this._pitch;this._createEndTimer();}; /**
 * @method _createNodes
 * @private
 */WebAudio.prototype._createNodes = function(){var context=WebAudio._context;this._sourceNode = context.createBufferSource();this._sourceNode.buffer = this._buffer;this._sourceNode.loopStart = this._loopStart;this._sourceNode.loopEnd = this._loopStart + this._loopLength;this._sourceNode.playbackRate.value = this._pitch;this._gainNode = context.createGain();this._gainNode.gain.value = this._volume;this._pannerNode = context.createPanner();this._pannerNode.panningModel = 'equalpower';this._updatePanner();}; /**
 * @method _connectNodes
 * @private
 */WebAudio.prototype._connectNodes = function(){this._sourceNode.connect(this._gainNode);this._gainNode.connect(this._pannerNode);this._pannerNode.connect(WebAudio._masterGainNode);}; /**
 * @method _removeNodes
 * @private
 */WebAudio.prototype._removeNodes = function(){if(this._sourceNode){this._sourceNode.stop(0);this._sourceNode = null;this._gainNode = null;this._pannerNode = null;}}; /**
 * @method _createEndTimer
 * @private
 */WebAudio.prototype._createEndTimer = function(){if(this._sourceNode && !this._sourceNode.loop){var endTime=this._startTime + this._totalTime / this._pitch;var delay=endTime - WebAudio._context.currentTime;this._endTimer = setTimeout((function(){this.stop();}).bind(this),delay * 1000);}}; /**
 * @method _removeEndTimer
 * @private
 */WebAudio.prototype._removeEndTimer = function(){if(this._endTimer){clearTimeout(this._endTimer);this._endTimer = null;}}; /**
 * @method _updatePanner
 * @private
 */WebAudio.prototype._updatePanner = function(){if(this._pannerNode){var x=this._pan;var z=1 - Math.abs(x);this._pannerNode.setPosition(x,0,z);}}; /**
 * @method _onLoad
 * @private
 */WebAudio.prototype._onLoad = function(){while(this._loadListeners.length > 0) {var listner=this._loadListeners.shift();listner();}}; /**
 * @method _readLoopComments
 * @param {Uint8Array} array
 * @private
 */WebAudio.prototype._readLoopComments = function(array){this._readOgg(array);this._readMp4(array);}; /**
 * @method _readOgg
 * @param {Uint8Array} array
 * @private
 */WebAudio.prototype._readOgg = function(array){var index=0;while(index < array.length) {if(this._readFourCharacters(array,index) === 'OggS'){index += 26;var vorbisHeaderFound=false;var numSegments=array[index++];var segments=[];for(var i=0;i < numSegments;i++) {segments.push(array[index++]);}for(i = 0;i < numSegments;i++) {if(this._readFourCharacters(array,index + 1) === 'vorb'){var headerType=array[index];if(headerType === 1){this._sampleRate = this._readLittleEndian(array,index + 12);}else if(headerType === 3){this._readMetaData(array,index,segments[i]);}vorbisHeaderFound = true;}index += segments[i];}if(!vorbisHeaderFound){break;}}else {break;}}}; /**
 * @method _readMp4
 * @param {Uint8Array} array
 * @private
 */WebAudio.prototype._readMp4 = function(array){if(this._readFourCharacters(array,4) === 'ftyp'){var index=0;while(index < array.length) {var size=this._readBigEndian(array,index);var name=this._readFourCharacters(array,index + 4);if(name === 'moov'){index += 8;}else {if(name === 'mvhd'){this._sampleRate = this._readBigEndian(array,index + 20);}if(name === 'udta' || name === 'meta'){this._readMetaData(array,index,size);}index += size;if(size <= 1){break;}}}}}; /**
 * @method _readMetaData
 * @param {Uint8Array} array
 * @param {Number} index
 * @param {Number} size
 * @private
 */WebAudio.prototype._readMetaData = function(array,index,size){for(var i=index;i < index + size - 10;i++) {if(this._readFourCharacters(array,i) === 'LOOP'){var text='';while(array[i] > 0) {text += String.fromCharCode(array[i++]);}if(text.match(/LOOPSTART=([0-9]+)/)){this._loopStart = parseInt(RegExp.$1);}if(text.match(/LOOPLENGTH=([0-9]+)/)){this._loopLength = parseInt(RegExp.$1);}if(text == 'LOOPSTART' || text == 'LOOPLENGTH'){var text2='';i += 16;while(array[i] > 0) {text2 += String.fromCharCode(array[i++]);}if(text == 'LOOPSTART'){this._loopStart = parseInt(text2);}else {this._loopLength = parseInt(text2);}}}}}; /**
 * @method _readLittleEndian
 * @param {Uint8Array} array
 * @param {Number} index
 * @private
 */WebAudio.prototype._readLittleEndian = function(array,index){return array[index + 3] * 0x1000000 + array[index + 2] * 0x10000 + array[index + 1] * 0x100 + array[index + 0];}; /**
 * @method _readBigEndian
 * @param {Uint8Array} array
 * @param {Number} index
 * @private
 */WebAudio.prototype._readBigEndian = function(array,index){return array[index + 0] * 0x1000000 + array[index + 1] * 0x10000 + array[index + 2] * 0x100 + array[index + 3];}; /**
 * @method _readFourCharacters
 * @param {Uint8Array} array
 * @param {Number} index
 * @private
 */WebAudio.prototype._readFourCharacters = function(array,index){var string='';for(var i=0;i < 4;i++) {string += String.fromCharCode(array[index + i]);}return string;}; //-----------------------------------------------------------------------------
/**
 * The static class that handles HTML5 Audio.
 *
 * @class Html5Audio
 * @constructor
 */function Html5Audio(){throw new Error('This is a static class');}Html5Audio._initialized = false;Html5Audio._unlocked = false;Html5Audio._audioElement = null;Html5Audio._gainTweenInterval = null;Html5Audio._tweenGain = 0;Html5Audio._tweenTargetGain = 0;Html5Audio._tweenGainStep = 0;Html5Audio._staticSePath = null; /**
 * Sets up the Html5 Audio.
 *
 * @static
 * @method setup
 * @param {String} url The url of the audio file
 */Html5Audio.setup = function(url){if(!this._initialized){this.initialize();}this.clear();this._url = url;}; /**
 * Initializes the audio system.
 *
 * @static
 * @method initialize
 * @return {Boolean} True if the audio system is available
 */Html5Audio.initialize = function(){if(!this._initialized){if(!this._audioElement){try{this._audioElement = new Audio();}catch(e) {this._audioElement = null;}}if(!!this._audioElement)this._setupEventHandlers();this._initialized = true;}return !!this._audioElement;}; /**
 * @static
 * @method _setupEventHandlers
 * @private
 */Html5Audio._setupEventHandlers = function(){document.addEventListener('touchstart',this._onTouchStart.bind(this));document.addEventListener('visibilitychange',this._onVisibilityChange.bind(this));this._audioElement.addEventListener("loadeddata",this._onLoadedData.bind(this));this._audioElement.addEventListener("error",this._onError.bind(this));this._audioElement.addEventListener("ended",this._onEnded.bind(this));}; /**
 * @static
 * @method _onTouchStart
 * @private
 */Html5Audio._onTouchStart = function(){if(this._audioElement && !this._unlocked){if(this._isLoading){this._load(this._url);this._unlocked = true;}else {if(this._staticSePath){this._audioElement.src = this._staticSePath;this._audioElement.volume = 0;this._audioElement.loop = false;this._audioElement.play();this._unlocked = true;}}}}; /**
 * @static
 * @method _onVisibilityChange
 * @private
 */Html5Audio._onVisibilityChange = function(){if(document.visibilityState === 'hidden'){this._onHide();}else {this._onShow();}}; /**
 * @static
 * @method _onLoadedData
 * @private
 */Html5Audio._onLoadedData = function(){this._buffered = true;if(this._unlocked)this._onLoad();}; /**
 * @static
 * @method _onError
 * @private
 */Html5Audio._onError = function(){this._hasError = true;}; /**
 * @static
 * @method _onEnded
 * @private
 */Html5Audio._onEnded = function(){if(!this._audioElement.loop){this.stop();}}; /**
 * @static
 * @method _onHide
 * @private
 */Html5Audio._onHide = function(){this._audioElement.volume = 0;this._tweenGain = 0;}; /**
 * @static
 * @method _onShow
 * @private
 */Html5Audio._onShow = function(){this.fadeIn(0.5);}; /**
 * Clears the audio data.
 *
 * @static
 * @method clear
 */Html5Audio.clear = function(){this.stop();this._volume = 1;this._loadListeners = [];this._hasError = false;this._autoPlay = false;this._isLoading = false;this._buffered = false;}; /**
 * Set the URL of static se.
 *
 * @static
 * @param {String} url
 */Html5Audio.setStaticSe = function(url){if(!this._initialized){this.initialize();this.clear();}this._staticSePath = url;}; /**
 * [read-only] The url of the audio file.
 *
 * @property url
 * @type String
 */Object.defineProperty(Html5Audio,'url',{get:function get(){return Html5Audio._url;},configurable:true}); /**
 * The volume of the audio.
 *
 * @property volume
 * @type Number
 */Object.defineProperty(Html5Audio,'volume',{get:(function(){return Html5Audio._volume;}).bind(undefined),set:function set(value){Html5Audio._volume = value;if(Html5Audio._audioElement){Html5Audio._audioElement.volume = this._volume;}},configurable:true}); /**
 * Checks whether the audio data is ready to play.
 *
 * @static
 * @method isReady
 * @return {Boolean} True if the audio data is ready to play
 */Html5Audio.isReady = function(){return this._buffered;}; /**
 * Checks whether a loading error has occurred.
 *
 * @static
 * @method isError
 * @return {Boolean} True if a loading error has occurred
 */Html5Audio.isError = function(){return this._hasError;}; /**
 * Checks whether the audio is playing.
 *
 * @static
 * @method isPlaying
 * @return {Boolean} True if the audio is playing
 */Html5Audio.isPlaying = function(){return !this._audioElement.paused;}; /**
 * Plays the audio.
 *
 * @static
 * @method play
 * @param {Boolean} loop Whether the audio data play in a loop
 * @param {Number} offset The start position to play in seconds
 */Html5Audio.play = function(loop,offset){if(this.isReady()){offset = offset || 0;this._startPlaying(loop,offset);}else if(Html5Audio._audioElement){this._autoPlay = true;this.addLoadListener((function(){if(this._autoPlay){this.play(loop,offset);if(this._gainTweenInterval){clearInterval(this._gainTweenInterval);this._gainTweenInterval = null;}}}).bind(this));if(!this._isLoading)this._load(this._url);}}; /**
 * Stops the audio.
 *
 * @static
 * @method stop
 */Html5Audio.stop = function(){if(this._audioElement)this._audioElement.pause();this._autoPlay = false;if(this._tweenInterval){clearInterval(this._tweenInterval);this._tweenInterval = null;this._audioElement.volume = 0;}}; /**
 * Performs the audio fade-in.
 *
 * @static
 * @method fadeIn
 * @param {Number} duration Fade-in time in seconds
 */Html5Audio.fadeIn = function(duration){if(this.isReady()){if(this._audioElement){this._tweenTargetGain = this._volume;this._tweenGain = 0;this._startGainTween(duration);}}else if(this._autoPlay){this.addLoadListener((function(){this.fadeIn(duration);}).bind(this));}}; /**
 * Performs the audio fade-out.
 *
 * @static
 * @method fadeOut
 * @param {Number} duration Fade-out time in seconds
 */Html5Audio.fadeOut = function(duration){if(this._audioElement){this._tweenTargetGain = 0;this._tweenGain = this._volume;this._startGainTween(duration);}}; /**
 * Gets the seek position of the audio.
 *
 * @static
 * @method seek
 */Html5Audio.seek = function(){if(this._audioElement){return this._audioElement.currentTime;}else {return 0;}}; /**
 * Add a callback function that will be called when the audio data is loaded.
 *
 * @static
 * @method addLoadListener
 * @param {Function} listner The callback function
 */Html5Audio.addLoadListener = function(listner){this._loadListeners.push(listner);}; /**
 * @static
 * @method _load
 * @param {String} url
 * @private
 */Html5Audio._load = function(url){if(this._audioElement){this._isLoading = true;this._audioElement.src = url;this._audioElement.load();}}; /**
 * @static
 * @method _startPlaying
 * @param {Boolean} loop
 * @param {Number} offset
 * @private
 */Html5Audio._startPlaying = function(loop,offset){this._audioElement.loop = loop;if(this._gainTweenInterval){clearInterval(this._gainTweenInterval);this._gainTweenInterval = null;}if(this._audioElement){this._audioElement.volume = this._volume;this._audioElement.currentTime = offset;this._audioElement.play();}}; /**
 * @static
 * @method _onLoad
 * @private
 */Html5Audio._onLoad = function(){this._isLoading = false;while(this._loadListeners.length > 0) {var listener=this._loadListeners.shift();listener();}}; /**
 * @static
 * @method _startGainTween
 * @params {Number} duration
 * @private
 */Html5Audio._startGainTween = function(duration){this._audioElement.volume = this._tweenGain;if(this._gainTweenInterval){clearInterval(this._gainTweenInterval);this._gainTweenInterval = null;}this._tweenGainStep = (this._tweenTargetGain - this._tweenGain) / (60 * duration);this._gainTweenInterval = setInterval(function(){Html5Audio._applyTweenValue(Html5Audio._tweenTargetGain);},1000 / 60);}; /**
 * @static
 * @method _applyTweenValue
 * @param {Number} volume
 * @private
 */Html5Audio._applyTweenValue = function(volume){Html5Audio._tweenGain += Html5Audio._tweenGainStep;if(Html5Audio._tweenGain < 0 && Html5Audio._tweenGainStep < 0){Html5Audio._tweenGain = 0;}else if(Html5Audio._tweenGain > volume && Html5Audio._tweenGainStep > 0){Html5Audio._tweenGain = volume;}if(Math.abs(Html5Audio._tweenTargetGain - Html5Audio._tweenGain) < 0.01){Html5Audio._tweenGain = Html5Audio._tweenTargetGain;clearInterval(Html5Audio._gainTweenInterval);Html5Audio._gainTweenInterval = null;}Html5Audio._audioElement.volume = Html5Audio._tweenGain;}; //-----------------------------------------------------------------------------
/**
 * The static class that handles JSON with object information.
 *
 * @class JsonEx
 */function JsonEx(){throw new Error('This is a static class');} /**
 * The maximum depth of objects.
 *
 * @static
 * @property maxDepth
 * @type Number
 * @default 100
 */JsonEx.maxDepth = 100; /**
 * Converts an object to a JSON string with object information.
 *
 * @static
 * @method stringify
 * @param {Object} object The object to be converted
 * @return {String} The JSON string
 */JsonEx.stringify = function(object){return JSON.stringify(this._encode(object));}; /**
 * Parses a JSON string and reconstructs the corresponding object.
 *
 * @static
 * @method parse
 * @param {String} json The JSON string
 * @return {Object} The reconstructed object
 */JsonEx.parse = function(json){return this._decode(JSON.parse(json));}; /**
 * Makes a deep copy of the specified object.
 *
 * @static
 * @method makeDeepCopy
 * @param {Object} object The object to be copied
 * @return {Object} The copied object
 */JsonEx.makeDeepCopy = function(object){return this.parse(this.stringify(object));}; /**
 * @static
 * @method _encode
 * @param {Object} value
 * @param {Number} depth
 * @return {Object}
 * @private
 */JsonEx._encode = function(value,depth){depth = depth || 0;if(++depth >= this.maxDepth){throw new Error('Object too deep');}var type=Object.prototype.toString.call(value);if(type === '[object Object]' || type === '[object Array]'){var constructorName=this._getConstructorName(value);if(constructorName !== 'Object' && constructorName !== 'Array'){value['@'] = constructorName;}for(var key in value) {if(value.hasOwnProperty(key)){value[key] = this._encode(value[key],depth + 1);}}}depth--;return value;}; /**
 * @static
 * @method _decode
 * @param {Object} value
 * @return {Object}
 * @private
 */JsonEx._decode = function(value){var GameObjects=require('./objects');var type=Object.prototype.toString.call(value);if(type === '[object Object]' || type === '[object Array]'){if(value['@']){ // var constructor = window[value['@']];
var constructor=GameObjects[value['@']];if(constructor){value = this._resetPrototype(value,constructor.prototype);}}for(var key in value) {if(value.hasOwnProperty(key)){value[key] = this._decode(value[key]);}}}return value;}; /**
 * @static
 * @method _getConstructorName
 * @param {Object} value
 * @return {String}
 * @private
 */JsonEx._getConstructorName = function(value){var name=value.constructor.name;if(name === undefined){var func=/^\s*function\s*([A-Za-z0-9_$]*)/;name = func.exec(value.constructor)[1];}return name;}; /**
 * @static
 * @method _resetPrototype
 * @param {Object} value
 * @param {Object} prototype
 * @return {Object}
 * @private
 */JsonEx._resetPrototype = function(value,prototype){if(Object.setPrototypeOf !== undefined){Object.setPrototypeOf(value,prototype);}else if('__proto__' in value){value.__proto__ = prototype;}else {var newValue=Object.create(prototype);for(var key in value) {if(value.hasOwnProperty(key)){newValue[key] = value[key];}}value = newValue;}return value;};

},{"./objects":7,"nw.gui":1}],5:[function(require,module,exports){
//=============================================================================
// main.js
//=============================================================================
'use strict';

var _managers = require('./managers');

var _scenes = require('./scenes');

_managers.PluginManager.setup($plugins);

window.onload = function () {
    _managers.SceneManager.run(_scenes.Scene_Boot);
};

},{"./managers":6,"./scenes":9}],6:[function(require,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.DataManager = DataManager;
exports.ConfigManager = ConfigManager;
exports.StorageManager = StorageManager;
exports.ImageManager = ImageManager;
exports.AudioManager = AudioManager;
exports.SoundManager = SoundManager;
exports.TextManager = TextManager;
exports.SceneManager = SceneManager;
exports.BattleManager = BattleManager;
exports.PluginManager = PluginManager;

var _core = require('./core');

var _objects = require('./objects');

var _sprites = require('./sprites');

//=============================================================================
// rpg_managers.js
//=============================================================================

//-----------------------------------------------------------------------------
// DataManager
//
// The static class that manages the database and game objects.

function DataManager() {
    throw new Error('This is a static class');
}

window.$dataActors = null;
window.$dataClasses = null;
window.$dataSkills = null;
window.$dataItems = null;
window.$dataWeapons = null;
window.$dataArmors = null;
window.$dataEnemies = null;
window.$dataTroops = null;
window.$dataStates = null;
window.$dataAnimations = null;
window.$dataTilesets = null;
window.$dataCommonEvents = null;
window.$dataSystem = null;
window.$dataMapInfos = null;
window.$dataMap = null;
window.$gameTemp = null;
window.$gameSystem = null;
window.$gameScreen = null;
window.$gameTimer = null;
window.$gameMessage = null;
window.$gameSwitches = null;
window.$gameVariables = null;
window.$gameSelfSwitches = null;
window.$gameActors = null;
window.$gameParty = null;
window.$gameTroop = null;
window.$gameMap = null;
window.$gamePlayer = null;
window.$testEvent = null;

DataManager._globalId = 'RPGMV';
DataManager._lastAccessedId = 1;
DataManager._errorUrl = null;

DataManager._databaseFiles = [{ name: '$dataActors', src: 'Actors.json' }, { name: '$dataClasses', src: 'Classes.json' }, { name: '$dataSkills', src: 'Skills.json' }, { name: '$dataItems', src: 'Items.json' }, { name: '$dataWeapons', src: 'Weapons.json' }, { name: '$dataArmors', src: 'Armors.json' }, { name: '$dataEnemies', src: 'Enemies.json' }, { name: '$dataTroops', src: 'Troops.json' }, { name: '$dataStates', src: 'States.json' }, { name: '$dataAnimations', src: 'Animations.json' }, { name: '$dataTilesets', src: 'Tilesets.json' }, { name: '$dataCommonEvents', src: 'CommonEvents.json' }, { name: '$dataSystem', src: 'System.json' }, { name: '$dataMapInfos', src: 'MapInfos.json' }];

DataManager.loadDatabase = function () {
    var test = this.isBattleTest() || this.isEventTest();
    var prefix = test ? 'Test_' : '';
    for (var i = 0; i < this._databaseFiles.length; i++) {
        var name = this._databaseFiles[i].name;
        var src = this._databaseFiles[i].src;
        this.loadDataFile(name, prefix + src);
    }
    if (this.isEventTest()) {
        this.loadDataFile('$testEvent', prefix + 'Event.json');
    }
};

DataManager.loadDataFile = function (name, src) {
    var xhr = new XMLHttpRequest();
    var url = 'data/' + src;
    xhr.open('GET', url);
    xhr.overrideMimeType('application/json');
    console.log('DEBUG: start loading', url);
    xhr.onload = function () {
        if (xhr.status < 400) {
            window[name] = JSON.parse(xhr.responseText);
            console.log('DEBUG: loaded', name);
            DataManager.onLoad(window[name]);
        }
    };
    xhr.onerror = function () {
        DataManager._errorUrl = DataManager._errorUrl || url;
    };
    window[name] = null;
    xhr.send();
};

DataManager.isDatabaseLoaded = function () {
    this.checkError();
    for (var i = 0; i < this._databaseFiles.length; i++) {
        if (!window[this._databaseFiles[i].name]) {
            return false;
        }
    }
    return true;
};

DataManager.loadMapData = function (mapId) {
    if (mapId > 0) {
        var filename = 'Map%1.json'.format(mapId.padZero(3));
        this.loadDataFile('$dataMap', filename);
    } else {
        this.makeEmptyMap();
    }
};

DataManager.makeEmptyMap = function () {
    $dataMap = {};
    $dataMap.data = [];
    $dataMap.events = [];
    $dataMap.width = 100;
    $dataMap.height = 100;
    $dataMap.scrollType = 3;
};

DataManager.isMapLoaded = function () {
    this.checkError();
    return !!$dataMap;
};

DataManager.onLoad = function (object) {
    var array;
    if (object === $dataMap) {
        this.extractMetadata(object);
        array = object.events;
    } else {
        array = object;
    }
    if (Array.isArray(array)) {
        for (var i = 0; i < array.length; i++) {
            var data = array[i];
            if (data && data.note !== undefined) {
                this.extractMetadata(data);
            }
        }
    }
};

DataManager.extractMetadata = function (data) {
    var re = /<([^<>:]+)(:?)([^>]*)>/g;
    data.meta = {};
    for (;;) {
        var match = re.exec(data.note);
        if (match) {
            if (match[2] === ':') {
                data.meta[match[1]] = match[3];
            } else {
                data.meta[match[1]] = true;
            }
        } else {
            break;
        }
    }
};

DataManager.checkError = function () {
    if (DataManager._errorUrl) {
        throw new Error('Failed to load: ' + DataManager._errorUrl);
    }
};

DataManager.isBattleTest = function () {
    return _core.Utils.isOptionValid('btest');
};

DataManager.isEventTest = function () {
    return _core.Utils.isOptionValid('etest');
};

DataManager.isSkill = function (item) {
    return item && $dataSkills.contains(item);
};

DataManager.isItem = function (item) {
    return item && $dataItems.contains(item);
};

DataManager.isWeapon = function (item) {
    return item && $dataWeapons.contains(item);
};

DataManager.isArmor = function (item) {
    return item && $dataArmors.contains(item);
};

DataManager.createGameObjects = function () {
    $gameTemp = new _objects.Game_Temp();
    $gameSystem = new _objects.Game_System();
    $gameScreen = new _objects.Game_Screen();
    $gameTimer = new _objects.Game_Timer();
    $gameMessage = new _objects.Game_Message();
    $gameSwitches = new _objects.Game_Switches();
    $gameVariables = new _objects.Game_Variables();
    $gameSelfSwitches = new _objects.Game_SelfSwitches();
    $gameActors = new _objects.Game_Actors();
    $gameParty = new _objects.Game_Party();
    $gameTroop = new _objects.Game_Troop();
    $gameMap = new _objects.Game_Map();
    $gamePlayer = new _objects.Game_Player();
};

DataManager.setupNewGame = function () {
    this.createGameObjects();
    this.selectSavefileForNewGame();
    $gameParty.setupStartingMembers();
    $gamePlayer.reserveTransfer($dataSystem.startMapId, $dataSystem.startX, $dataSystem.startY);
    _core.Graphics.frameCount = 0;
};

DataManager.setupBattleTest = function () {
    this.createGameObjects();
    $gameParty.setupBattleTest();
    BattleManager.setup($dataSystem.testTroopId, true, false);
    BattleManager.setBattleTest(true);
    BattleManager.playBattleBgm();
};

DataManager.setupEventTest = function () {
    this.createGameObjects();
    this.selectSavefileForNewGame();
    $gameParty.setupStartingMembers();
    $gamePlayer.reserveTransfer(-1, 8, 6);
    $gamePlayer.setTransparent(false);
};

DataManager.loadGlobalInfo = function () {
    var json;
    try {
        json = StorageManager.load(0);
    } catch (e) {
        console.error(e);
        return [];
    }
    if (json) {
        var globalInfo = JSON.parse(json);
        for (var i = 1; i <= this.maxSavefiles(); i++) {
            if (!StorageManager.exists(i)) {
                delete globalInfo[i];
            }
        }
        return globalInfo;
    } else {
        return [];
    }
};

DataManager.saveGlobalInfo = function (info) {
    StorageManager.save(0, JSON.stringify(info));
};

DataManager.isThisGameFile = function (savefileId) {
    var globalInfo = this.loadGlobalInfo();
    if (globalInfo && globalInfo[savefileId]) {
        if (StorageManager.isLocalMode()) {
            return true;
        } else {
            var savefile = globalInfo[savefileId];
            return savefile.globalId === this._globalId && savefile.title === $dataSystem.gameTitle;
        }
    } else {
        return false;
    }
};

DataManager.isAnySavefileExists = function () {
    var globalInfo = this.loadGlobalInfo();
    if (globalInfo) {
        for (var i = 1; i < globalInfo.length; i++) {
            if (this.isThisGameFile(i)) {
                return true;
            }
        }
    }
    return false;
};

DataManager.latestSavefileId = function () {
    var globalInfo = this.loadGlobalInfo();
    var savefileId = 1;
    var timestamp = 0;
    if (globalInfo) {
        for (var i = 1; i < globalInfo.length; i++) {
            if (this.isThisGameFile(i) && globalInfo[i].timestamp > timestamp) {
                timestamp = globalInfo[i].timestamp;
                savefileId = i;
            }
        }
    }
    return savefileId;
};

DataManager.loadAllSavefileImages = function () {
    var globalInfo = this.loadGlobalInfo();
    if (globalInfo) {
        for (var i = 1; i < globalInfo.length; i++) {
            if (this.isThisGameFile(i)) {
                var info = globalInfo[i];
                this.loadSavefileImages(info);
            }
        }
    }
};

DataManager.loadSavefileImages = function (info) {
    if (info.characters) {
        for (var i = 0; i < info.characters.length; i++) {
            ImageManager.loadCharacter(info.characters[i][0]);
        }
    }
    if (info.faces) {
        for (var j = 0; j < info.faces.length; j++) {
            ImageManager.loadFace(info.faces[j][0]);
        }
    }
};

DataManager.maxSavefiles = function () {
    return 20;
};

DataManager.saveGame = function (savefileId) {
    try {
        return this.saveGameWithoutRescue(savefileId);
    } catch (e) {
        console.error(e);
        try {
            StorageManager.remove(savefileId);
        } catch (e2) {}
        return false;
    }
};

DataManager.loadGame = function (savefileId) {
    try {
        return this.loadGameWithoutRescue(savefileId);
    } catch (e) {
        console.error(e);
        return false;
    }
};

DataManager.loadSavefileInfo = function (savefileId) {
    var globalInfo = this.loadGlobalInfo();
    return globalInfo && globalInfo[savefileId] ? globalInfo[savefileId] : null;
};

DataManager.lastAccessedSavefileId = function () {
    return this._lastAccessedId;
};

DataManager.saveGameWithoutRescue = function (savefileId) {
    var json = _core.JsonEx.stringify(this.makeSaveContents());
    if (json.length >= 200000) {
        console.warn('Save data too big!');
    }
    StorageManager.save(savefileId, json);
    this._lastAccessedId = savefileId;
    var globalInfo = this.loadGlobalInfo() || [];
    globalInfo[savefileId] = this.makeSavefileInfo();
    this.saveGlobalInfo(globalInfo);
    return true;
};

DataManager.loadGameWithoutRescue = function (savefileId) {
    var globalInfo = this.loadGlobalInfo();
    if (this.isThisGameFile(savefileId)) {
        var json = StorageManager.load(savefileId);
        this.createGameObjects();
        this.extractSaveContents(_core.JsonEx.parse(json));
        this._lastAccessedId = savefileId;
        return true;
    } else {
        return false;
    }
};

DataManager.selectSavefileForNewGame = function () {
    var globalInfo = this.loadGlobalInfo();
    this._lastAccessedId = 1;
    if (globalInfo) {
        var numSavefiles = Math.max(0, globalInfo.length - 1);
        if (numSavefiles < this.maxSavefiles()) {
            this._lastAccessedId = numSavefiles + 1;
        } else {
            var timestamp = Number.MAX_VALUE;
            for (var i = 1; i < globalInfo.length; i++) {
                if (!globalInfo[i]) {
                    this._lastAccessedId = i;
                    break;
                }
                if (globalInfo[i].timestamp < timestamp) {
                    timestamp = globalInfo[i].timestamp;
                    this._lastAccessedId = i;
                }
            }
        }
    }
};

DataManager.makeSavefileInfo = function () {
    var info = {};
    info.globalId = this._globalId;
    info.title = $dataSystem.gameTitle;
    info.characters = $gameParty.charactersForSavefile();
    info.faces = $gameParty.facesForSavefile();
    info.playtime = $gameSystem.playtimeText();
    info.timestamp = Date.now();
    return info;
};

DataManager.makeSaveContents = function () {
    // A save data does not contain $gameTemp, $gameMessage, and $gameTroop.
    var contents = {};
    contents.system = $gameSystem;
    contents.screen = $gameScreen;
    contents.timer = $gameTimer;
    contents.switches = $gameSwitches;
    contents.variables = $gameVariables;
    contents.selfSwitches = $gameSelfSwitches;
    contents.actors = $gameActors;
    contents.party = $gameParty;
    contents.map = $gameMap;
    contents.player = $gamePlayer;
    return contents;
};

DataManager.extractSaveContents = function (contents) {
    $gameSystem = contents.system;
    $gameScreen = contents.screen;
    $gameTimer = contents.timer;
    $gameSwitches = contents.switches;
    $gameVariables = contents.variables;
    $gameSelfSwitches = contents.selfSwitches;
    $gameActors = contents.actors;
    $gameParty = contents.party;
    $gameMap = contents.map;
    $gamePlayer = contents.player;
};

//-----------------------------------------------------------------------------
// ConfigManager
//
// The static class that manages the configuration data.

function ConfigManager() {
    throw new Error('This is a static class');
}

ConfigManager.alwaysDash = false;
ConfigManager.commandRemember = false;

Object.defineProperty(ConfigManager, 'bgmVolume', {
    get: function get() {
        return AudioManager._bgmVolume;
    },
    set: function set(value) {
        AudioManager.bgmVolume = value;
    },
    configurable: true
});

Object.defineProperty(ConfigManager, 'bgsVolume', {
    get: function get() {
        return AudioManager.bgsVolume;
    },
    set: function set(value) {
        AudioManager.bgsVolume = value;
    },
    configurable: true
});

Object.defineProperty(ConfigManager, 'meVolume', {
    get: function get() {
        return AudioManager.meVolume;
    },
    set: function set(value) {
        AudioManager.meVolume = value;
    },
    configurable: true
});

Object.defineProperty(ConfigManager, 'seVolume', {
    get: function get() {
        return AudioManager.seVolume;
    },
    set: function set(value) {
        AudioManager.seVolume = value;
    },
    configurable: true
});

ConfigManager.load = function () {
    var json;
    var config = {};
    try {
        json = StorageManager.load(-1);
    } catch (e) {
        console.error(e);
    }
    if (json) {
        config = JSON.parse(json);
    }
    this.applyData(config);
};

ConfigManager.save = function () {
    StorageManager.save(-1, JSON.stringify(this.makeData()));
};

ConfigManager.makeData = function () {
    var config = {};
    config.alwaysDash = this.alwaysDash;
    config.commandRemember = this.commandRemember;
    config.bgmVolume = this.bgmVolume;
    config.bgsVolume = this.bgsVolume;
    config.meVolume = this.meVolume;
    config.seVolume = this.seVolume;
    return config;
};

ConfigManager.applyData = function (config) {
    this.alwaysDash = this.readFlag(config, 'alwaysDash');
    this.commandRemember = this.readFlag(config, 'commandRemember');
    this.bgmVolume = this.readVolume(config, 'bgmVolume');
    this.bgsVolume = this.readVolume(config, 'bgsVolume');
    this.meVolume = this.readVolume(config, 'meVolume');
    this.seVolume = this.readVolume(config, 'seVolume');
};

ConfigManager.readFlag = function (config, name) {
    return !!config[name];
};

ConfigManager.readVolume = function (config, name) {
    var value = config[name];
    if (value !== undefined) {
        return Number(value).clamp(0, 100);
    } else {
        return 100;
    }
};

//-----------------------------------------------------------------------------
// StorageManager
//
// The static class that manages storage for saving game data.

function StorageManager() {
    throw new Error('This is a static class');
}

StorageManager.save = function (savefileId, json) {
    if (this.isLocalMode()) {
        this.saveToLocalFile(savefileId, json);
    } else {
        this.saveToWebStorage(savefileId, json);
    }
};

StorageManager.load = function (savefileId) {
    if (this.isLocalMode()) {
        return this.loadFromLocalFile(savefileId);
    } else {
        return this.loadFromWebStorage(savefileId);
    }
};

StorageManager.exists = function (savefileId) {
    if (this.isLocalMode()) {
        return this.localFileExists(savefileId);
    } else {
        return this.webStorageExists(savefileId);
    }
};

StorageManager.remove = function (savefileId) {
    if (this.isLocalMode()) {
        this.removeLocalFile(savefileId);
    } else {
        this.removeWebStorage(savefileId);
    }
};

StorageManager.isLocalMode = function () {
    return _core.Utils.isNwjs();
};

StorageManager.saveToLocalFile = function (savefileId, json) {
    var data = LZString.compressToBase64(json);
    var fs = require('fs');
    var dirPath = this.localFileDirectoryPath();
    var filePath = this.localFilePath(savefileId);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
    fs.writeFileSync(filePath, data);
};

StorageManager.loadFromLocalFile = function (savefileId) {
    var data = null;
    var fs = require('fs');
    var filePath = this.localFilePath(savefileId);
    if (fs.existsSync(filePath)) {
        data = fs.readFileSync(filePath, { encoding: 'utf8' });
    }
    return LZString.decompressFromBase64(data);
};

StorageManager.localFileExists = function (savefileId) {
    var fs = require('fs');
    return fs.existsSync(this.localFilePath(savefileId));
};

StorageManager.removeLocalFile = function (savefileId) {
    var fs = require('fs');
    var filePath = this.localFilePath(savefileId);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

StorageManager.saveToWebStorage = function (savefileId, json) {
    var key = this.webStorageKey(savefileId);
    var data = LZString.compressToBase64(json);
    localStorage.setItem(key, data);
};

StorageManager.loadFromWebStorage = function (savefileId) {
    var key = this.webStorageKey(savefileId);
    var data = localStorage.getItem(key);
    return LZString.decompressFromBase64(data);
};

StorageManager.webStorageExists = function (savefileId) {
    var key = this.webStorageKey(savefileId);
    return !!localStorage.getItem(key);
};

StorageManager.removeWebStorage = function (savefileId) {
    var key = this.webStorageKey(savefileId);
    localStorage.removeItem(key);
};

StorageManager.localFileDirectoryPath = function () {
    var path = window.location.pathname.replace(/(\/www|)\/[^\/]*$/, '/save/');
    if (path.match(/^\/([A-Z]\:)/)) {
        path = path.slice(1);
    }
    return decodeURIComponent(path);
};

StorageManager.localFilePath = function (savefileId) {
    var name;
    if (savefileId < 0) {
        name = 'config.rpgsave';
    } else if (savefileId === 0) {
        name = 'global.rpgsave';
    } else {
        name = 'file%1.rpgsave'.format(savefileId);
    }
    return this.localFileDirectoryPath() + name;
};

StorageManager.webStorageKey = function (savefileId) {
    if (savefileId < 0) {
        return 'RPG Config';
    } else if (savefileId === 0) {
        return 'RPG Global';
    } else {
        return 'RPG File%1'.format(savefileId);
    }
};

//-----------------------------------------------------------------------------
// ImageManager
//
// The static class that loads images, creates bitmap objects and retains them.

function ImageManager() {
    throw new Error('This is a static class');
}

ImageManager._cache = {};

ImageManager.loadAnimation = function (filename, hue) {
    return this.loadBitmap('img/animations/', filename, hue, true);
};

ImageManager.loadBattleback1 = function (filename, hue) {
    return this.loadBitmap('img/battlebacks1/', filename, hue, true);
};

ImageManager.loadBattleback2 = function (filename, hue) {
    return this.loadBitmap('img/battlebacks2/', filename, hue, true);
};

ImageManager.loadEnemy = function (filename, hue) {
    return this.loadBitmap('img/enemies/', filename, hue, true);
};

ImageManager.loadCharacter = function (filename, hue) {
    return this.loadBitmap('img/characters/', filename, hue, false);
};

ImageManager.loadFace = function (filename, hue) {
    return this.loadBitmap('img/faces/', filename, hue, true);
};

ImageManager.loadParallax = function (filename, hue) {
    return this.loadBitmap('img/parallaxes/', filename, hue, true);
};

ImageManager.loadPicture = function (filename, hue) {
    return this.loadBitmap('img/pictures/', filename, hue, true);
};

ImageManager.loadSvActor = function (filename, hue) {
    return this.loadBitmap('img/sv_actors/', filename, hue, false);
};

ImageManager.loadSvEnemy = function (filename, hue) {
    return this.loadBitmap('img/sv_enemies/', filename, hue, true);
};

ImageManager.loadSystem = function (filename, hue) {
    return this.loadBitmap('img/system/', filename, hue, false);
};

ImageManager.loadTileset = function (filename, hue) {
    return this.loadBitmap('img/tilesets/', filename, hue, false);
};

ImageManager.loadTitle1 = function (filename, hue) {
    return this.loadBitmap('img/titles1/', filename, hue, true);
};

ImageManager.loadTitle2 = function (filename, hue) {
    return this.loadBitmap('img/titles2/', filename, hue, true);
};

ImageManager.loadBitmap = function (folder, filename, hue, smooth) {
    if (filename) {
        var path = folder + encodeURIComponent(filename) + '.png';
        var bitmap = this.loadNormalBitmap(path, hue || 0);
        bitmap.smooth = smooth;
        return bitmap;
    } else {
        return this.loadEmptyBitmap();
    }
};

ImageManager.loadEmptyBitmap = function () {
    if (!this._cache[null]) {
        this._cache[null] = new _core.Bitmap();
    }
    return this._cache[null];
};

ImageManager.loadNormalBitmap = function (path, hue) {
    var key = path + ':' + hue;
    if (!this._cache[key]) {
        var bitmap = _core.Bitmap.load(path);
        bitmap.addLoadListener(function () {
            bitmap.rotateHue(hue);
        });
        this._cache[key] = bitmap;
    }
    return this._cache[key];
};

ImageManager.clear = function () {
    this._cache = {};
};

ImageManager.isReady = function () {
    for (var key in this._cache) {
        var bitmap = this._cache[key];
        if (bitmap.isError()) {
            throw new Error('Failed to load: ' + bitmap.url);
        }
        if (!bitmap.isReady()) {
            return false;
        }
    }
    return true;
};

ImageManager.isObjectCharacter = function (filename) {
    var sign = filename.match(/^[\!\$]+/);
    return sign && sign[0].contains('!');
};

ImageManager.isBigCharacter = function (filename) {
    var sign = filename.match(/^[\!\$]+/);
    return sign && sign[0].contains('$');
};

ImageManager.isZeroParallax = function (filename) {
    return filename.charAt(0) === '!';
};

//-----------------------------------------------------------------------------
// AudioManager
//
// The static class that handles BGM, BGS, ME and SE.

function AudioManager() {
    throw new Error('This is a static class');
}

AudioManager._bgmVolume = 100;
AudioManager._bgsVolume = 100;
AudioManager._meVolume = 100;
AudioManager._seVolume = 100;
AudioManager._currentBgm = null;
AudioManager._currentBgs = null;
AudioManager._bgmBuffer = null;
AudioManager._bgsBuffer = null;
AudioManager._meBuffer = null;
AudioManager._seBuffers = [];
AudioManager._staticBuffers = [];
AudioManager._replayFadeTime = 0.5;
AudioManager._path = 'audio/';

Object.defineProperty(AudioManager, 'bgmVolume', {
    get: function get() {
        return this._bgmVolume;
    },
    set: function set(value) {
        this._bgmVolume = value;
        this.updateBgmParameters(this._currentBgm);
    },
    configurable: true
});

Object.defineProperty(AudioManager, 'bgsVolume', {
    get: function get() {
        return this._bgsVolume;
    },
    set: function set(value) {
        this._bgsVolume = value;
        this.updateBgsParameters(this._currentBgs);
    },
    configurable: true
});

Object.defineProperty(AudioManager, 'meVolume', {
    get: function get() {
        return this._meVolume;
    },
    set: function set(value) {
        this._meVolume = value;
        this.updateMeParameters(this._currentMe);
    },
    configurable: true
});

Object.defineProperty(AudioManager, 'seVolume', {
    get: function get() {
        return this._seVolume;
    },
    set: function set(value) {
        this._seVolume = value;
    },
    configurable: true
});

AudioManager.playBgm = function (bgm, pos) {
    if (this.isCurrentBgm(bgm)) {
        this.updateBgmParameters(bgm);
    } else {
        this.stopBgm();
        if (bgm.name) {
            this._bgmBuffer = this.createBuffer('bgm', bgm.name);
            this.updateBgmParameters(bgm);
            if (!this._meBuffer) {
                this._bgmBuffer.play(true, pos || 0);
            }
        }
    }
    this.updateCurrentBgm(bgm, pos);
};

AudioManager.replayBgm = function (bgm) {
    if (this.isCurrentBgm(bgm)) {
        this.updateBgmParameters(bgm);
    } else {
        this.playBgm(bgm, bgm.pos);
        if (this._bgmBuffer) {
            this._bgmBuffer.fadeIn(this._replayFadeTime);
        }
    }
};

AudioManager.isCurrentBgm = function (bgm) {
    return this._currentBgm && this._bgmBuffer && this._currentBgm.name === bgm.name;
};

AudioManager.updateBgmParameters = function (bgm) {
    this.updateBufferParameters(this._bgmBuffer, this._bgmVolume, bgm);
};

AudioManager.updateCurrentBgm = function (bgm, pos) {
    this._currentBgm = {
        name: bgm.name,
        volume: bgm.volume,
        pitch: bgm.pitch,
        pan: bgm.pan,
        pos: pos
    };
};

AudioManager.stopBgm = function () {
    if (this._bgmBuffer) {
        this._bgmBuffer.stop();
        this._bgmBuffer = null;
        this._currentBgm = null;
    }
};

AudioManager.fadeOutBgm = function (duration) {
    if (this._bgmBuffer && this._currentBgm) {
        this._bgmBuffer.fadeOut(duration);
        this._currentBgm = null;
    }
};

AudioManager.fadeInBgm = function (duration) {
    if (this._bgmBuffer && this._currentBgm) {
        this._bgmBuffer.fadeIn(duration);
    }
};

AudioManager.playBgs = function (bgs, pos) {
    if (this.isCurrentBgs(bgs)) {
        this.updateBgsParameters(bgs);
    } else {
        this.stopBgs();
        if (bgs.name) {
            this._bgsBuffer = this.createBuffer('bgs', bgs.name);
            this.updateBgsParameters(bgs);
            this._bgsBuffer.play(true, pos || 0);
        }
    }
    this.updateCurrentBgs(bgs, pos);
};

AudioManager.replayBgs = function (bgs) {
    if (this.isCurrentBgs(bgs)) {
        this.updateBgsParameters(bgs);
    } else {
        this.playBgs(bgs, bgs.pos);
        if (this._bgsBuffer) {
            this._bgsBuffer.fadeIn(this._replayFadeTime);
        }
    }
};

AudioManager.isCurrentBgs = function (bgs) {
    return this._currentBgs && this._bgsBuffer && this._currentBgs.name === bgs.name;
};

AudioManager.updateBgsParameters = function (bgs) {
    this.updateBufferParameters(this._bgsBuffer, this._bgsVolume, bgs);
};

AudioManager.updateCurrentBgs = function (bgs, pos) {
    this._currentBgs = {
        name: bgs.name,
        volume: bgs.volume,
        pitch: bgs.pitch,
        pan: bgs.pan,
        pos: pos
    };
};

AudioManager.stopBgs = function () {
    if (this._bgsBuffer) {
        this._bgsBuffer.stop();
        this._bgsBuffer = null;
        this._currentBgs = null;
    }
};

AudioManager.fadeOutBgs = function (duration) {
    if (this._bgsBuffer && this._currentBgs) {
        this._bgsBuffer.fadeOut(duration);
        this._currentBgs = null;
    }
};

AudioManager.fadeInBgs = function (duration) {
    if (this._bgsBuffer && this._currentBgs) {
        this._bgsBuffer.fadeIn(duration);
    }
};

AudioManager.playMe = function (me) {
    this.stopMe();
    if (me.name) {
        if (this._bgmBuffer && this._currentBgm) {
            this._currentBgm.pos = this._bgmBuffer.seek();
            this._bgmBuffer.stop();
        }
        this._meBuffer = this.createBuffer('me', me.name);
        this.updateMeParameters(me);
        this._meBuffer.play(false);
        this._meBuffer.addStopListener(this.stopMe.bind(this));
    }
};

AudioManager.updateMeParameters = function (me) {
    this.updateBufferParameters(this._meBuffer, this._meVolume, me);
};

AudioManager.fadeOutMe = function (duration) {
    if (this._meBuffer) {
        this._meBuffer.fadeOut(duration);
    }
};

AudioManager.stopMe = function () {
    if (this._meBuffer) {
        this._meBuffer.stop();
        this._meBuffer = null;
        if (this._bgmBuffer && this._currentBgm && !this._bgmBuffer.isPlaying()) {
            this._bgmBuffer.play(true, this._currentBgm.pos);
            this._bgmBuffer.fadeIn(this._replayFadeTime);
        }
    }
};

AudioManager.playSe = function (se) {
    if (se.name) {
        this._seBuffers = this._seBuffers.filter(function (audio) {
            return audio.isPlaying();
        });
        var buffer = this.createBuffer('se', se.name);
        this.updateSeParameters(buffer, se);
        buffer.play(false);
        this._seBuffers.push(buffer);
    }
};

AudioManager.updateSeParameters = function (buffer, se) {
    this.updateBufferParameters(buffer, this._seVolume, se);
};

AudioManager.stopSe = function () {
    this._seBuffers.forEach(function (buffer) {
        buffer.stop();
    });
    this._seBuffers = [];
};

AudioManager.playStaticSe = function (se) {
    if (se.name) {
        this.loadStaticSe(se);
        for (var i = 0; i < this._staticBuffers.length; i++) {
            var buffer = this._staticBuffers[i];
            if (buffer._reservedSeName === se.name) {
                buffer.stop();
                this.updateSeParameters(buffer, se);
                buffer.play(false);
                break;
            }
        }
    }
};

AudioManager.loadStaticSe = function (se) {
    if (se.name && !this.isStaticSe(se)) {
        var buffer = this.createBuffer('se', se.name);
        buffer._reservedSeName = se.name;
        this._staticBuffers.push(buffer);
        if (this.shouldUseHtml5Audio()) {
            Html5Audio.setStaticSe(buffer._url);
        }
    }
};

AudioManager.isStaticSe = function (se) {
    for (var i = 0; i < this._staticBuffers.length; i++) {
        var buffer = this._staticBuffers[i];
        if (buffer._reservedSeName === se.name) {
            return true;
        }
    }
    return false;
};

AudioManager.stopAll = function () {
    this.stopMe();
    this.stopBgm();
    this.stopBgs();
    this.stopSe();
};

AudioManager.saveBgm = function () {
    if (this._currentBgm) {
        var bgm = this._currentBgm;
        return {
            name: bgm.name,
            volume: bgm.volume,
            pitch: bgm.pitch,
            pan: bgm.pan,
            pos: this._bgmBuffer ? this._bgmBuffer.seek() : 0
        };
    } else {
        return this.makeEmptyAudioObject();
    }
};

AudioManager.saveBgs = function () {
    if (this._currentBgs) {
        var bgs = this._currentBgs;
        return {
            name: bgs.name,
            volume: bgs.volume,
            pitch: bgs.pitch,
            pan: bgs.pan,
            pos: this._bgsBuffer ? this._bgsBuffer.seek() : 0
        };
    } else {
        return this.makeEmptyAudioObject();
    }
};

AudioManager.makeEmptyAudioObject = function () {
    return { name: '', volume: 0, pitch: 0 };
};

AudioManager.createBuffer = function (folder, name) {
    var ext = this.audioFileExt();
    var url = this._path + folder + '/' + encodeURIComponent(name) + ext;
    if (this.shouldUseHtml5Audio() && folder === 'bgm') {
        Html5Audio.setup(url);
        return Html5Audio;
    } else {
        return new _core.WebAudio(url);
    }
};

AudioManager.updateBufferParameters = function (buffer, configVolume, audio) {
    if (buffer && audio) {
        buffer.volume = configVolume * (audio.volume || 0) / 10000;
        buffer.pitch = (audio.pitch || 0) / 100;
        buffer.pan = (audio.pan || 0) / 100;
    }
};

AudioManager.audioFileExt = function () {
    if (_core.WebAudio.canPlayOgg() && !_core.Utils.isMobileDevice()) {
        return '.ogg';
    } else {
        return '.m4a';
    }
};

AudioManager.shouldUseHtml5Audio = function () {
    // We use HTML5 Audio to play BGM instead of Web Audio API
    // because decodeAudioData() is very slow on Android Chrome.
    return _core.Utils.isAndroidChrome();
};

AudioManager.checkErrors = function () {
    this.checkWebAudioError(this._bgmBuffer);
    this.checkWebAudioError(this._bgsBuffer);
    this.checkWebAudioError(this._meBuffer);
    this._seBuffers.forEach((function (buffer) {
        this.checkWebAudioError(buffer);
    }).bind(this));
    this._staticBuffers.forEach((function (buffer) {
        this.checkWebAudioError(buffer);
    }).bind(this));
};

AudioManager.checkWebAudioError = function (webAudio) {
    if (webAudio && webAudio.isError()) {
        throw new Error('Failed to load: ' + webAudio.url);
    }
};

//-----------------------------------------------------------------------------
// SoundManager
//
// The static class that plays sound effects defined in the database.

function SoundManager() {
    throw new Error('This is a static class');
}

SoundManager.preloadImportantSounds = function () {
    this.loadSystemSound(0);
    this.loadSystemSound(1);
    this.loadSystemSound(2);
    this.loadSystemSound(3);
};

SoundManager.loadSystemSound = function (n) {
    if ($dataSystem) {
        AudioManager.loadStaticSe($dataSystem.sounds[n]);
    }
};

SoundManager.playSystemSound = function (n) {
    if ($dataSystem) {
        AudioManager.playStaticSe($dataSystem.sounds[n]);
    }
};

SoundManager.playCursor = function () {
    this.playSystemSound(0);
};

SoundManager.playOk = function () {
    this.playSystemSound(1);
};

SoundManager.playCancel = function () {
    this.playSystemSound(2);
};

SoundManager.playBuzzer = function () {
    this.playSystemSound(3);
};

SoundManager.playEquip = function () {
    this.playSystemSound(4);
};

SoundManager.playSave = function () {
    this.playSystemSound(5);
};

SoundManager.playLoad = function () {
    this.playSystemSound(6);
};

SoundManager.playBattleStart = function () {
    this.playSystemSound(7);
};

SoundManager.playEscape = function () {
    this.playSystemSound(8);
};

SoundManager.playEnemyAttack = function () {
    this.playSystemSound(9);
};

SoundManager.playEnemyDamage = function () {
    this.playSystemSound(10);
};

SoundManager.playEnemyCollapse = function () {
    this.playSystemSound(11);
};

SoundManager.playBossCollapse1 = function () {
    this.playSystemSound(12);
};

SoundManager.playBossCollapse2 = function () {
    this.playSystemSound(13);
};

SoundManager.playActorDamage = function () {
    this.playSystemSound(14);
};

SoundManager.playActorCollapse = function () {
    this.playSystemSound(15);
};

SoundManager.playRecovery = function () {
    this.playSystemSound(16);
};

SoundManager.playMiss = function () {
    this.playSystemSound(17);
};

SoundManager.playEvasion = function () {
    this.playSystemSound(18);
};

SoundManager.playMagicEvasion = function () {
    this.playSystemSound(19);
};

SoundManager.playReflection = function () {
    this.playSystemSound(20);
};

SoundManager.playShop = function () {
    this.playSystemSound(21);
};

SoundManager.playUseItem = function () {
    this.playSystemSound(22);
};

SoundManager.playUseSkill = function () {
    this.playSystemSound(23);
};

//-----------------------------------------------------------------------------
// TextManager
//
// The static class that handles terms and messages.

function TextManager() {
    throw new Error('This is a static class');
}

TextManager.basic = function (basicId) {
    return $dataSystem.terms.basic[basicId] || '';
};

TextManager.param = function (paramId) {
    return $dataSystem.terms.params[paramId] || '';
};

TextManager.command = function (commandId) {
    return $dataSystem.terms.commands[commandId] || '';
};

TextManager.message = function (messageId) {
    return $dataSystem.terms.messages[messageId] || '';
};

TextManager.getter = function (method, param) {
    return {
        get: function get() {
            return this[method](param);
        },
        configurable: true
    };
};

Object.defineProperty(TextManager, 'currencyUnit', {
    get: function get() {
        return $dataSystem.currencyUnit;
    },
    configurable: true
});

Object.defineProperties(TextManager, {
    level: TextManager.getter('basic', 0),
    levelA: TextManager.getter('basic', 1),
    hp: TextManager.getter('basic', 2),
    hpA: TextManager.getter('basic', 3),
    mp: TextManager.getter('basic', 4),
    mpA: TextManager.getter('basic', 5),
    tp: TextManager.getter('basic', 6),
    tpA: TextManager.getter('basic', 7),
    exp: TextManager.getter('basic', 8),
    expA: TextManager.getter('basic', 9),
    fight: TextManager.getter('command', 0),
    escape: TextManager.getter('command', 1),
    attack: TextManager.getter('command', 2),
    guard: TextManager.getter('command', 3),
    item: TextManager.getter('command', 4),
    skill: TextManager.getter('command', 5),
    equip: TextManager.getter('command', 6),
    status: TextManager.getter('command', 7),
    formation: TextManager.getter('command', 8),
    save: TextManager.getter('command', 9),
    gameEnd: TextManager.getter('command', 10),
    options: TextManager.getter('command', 11),
    weapon: TextManager.getter('command', 12),
    armor: TextManager.getter('command', 13),
    keyItem: TextManager.getter('command', 14),
    equip2: TextManager.getter('command', 15),
    optimize: TextManager.getter('command', 16),
    clear: TextManager.getter('command', 17),
    newGame: TextManager.getter('command', 18),
    continue_: TextManager.getter('command', 19),
    toTitle: TextManager.getter('command', 21),
    cancel: TextManager.getter('command', 22),
    buy: TextManager.getter('command', 24),
    sell: TextManager.getter('command', 25),
    alwaysDash: TextManager.getter('message', 'alwaysDash'),
    commandRemember: TextManager.getter('message', 'commandRemember'),
    bgmVolume: TextManager.getter('message', 'bgmVolume'),
    bgsVolume: TextManager.getter('message', 'bgsVolume'),
    meVolume: TextManager.getter('message', 'meVolume'),
    seVolume: TextManager.getter('message', 'seVolume'),
    possession: TextManager.getter('message', 'possession'),
    expTotal: TextManager.getter('message', 'expTotal'),
    expNext: TextManager.getter('message', 'expNext'),
    saveMessage: TextManager.getter('message', 'saveMessage'),
    loadMessage: TextManager.getter('message', 'loadMessage'),
    file: TextManager.getter('message', 'file'),
    partyName: TextManager.getter('message', 'partyName'),
    emerge: TextManager.getter('message', 'emerge'),
    preemptive: TextManager.getter('message', 'preemptive'),
    surprise: TextManager.getter('message', 'surprise'),
    escapeStart: TextManager.getter('message', 'escapeStart'),
    escapeFailure: TextManager.getter('message', 'escapeFailure'),
    victory: TextManager.getter('message', 'victory'),
    defeat: TextManager.getter('message', 'defeat'),
    obtainExp: TextManager.getter('message', 'obtainExp'),
    obtainGold: TextManager.getter('message', 'obtainGold'),
    obtainItem: TextManager.getter('message', 'obtainItem'),
    levelUp: TextManager.getter('message', 'levelUp'),
    obtainSkill: TextManager.getter('message', 'obtainSkill'),
    useItem: TextManager.getter('message', 'useItem'),
    criticalToEnemy: TextManager.getter('message', 'criticalToEnemy'),
    criticalToActor: TextManager.getter('message', 'criticalToActor'),
    actorDamage: TextManager.getter('message', 'actorDamage'),
    actorRecovery: TextManager.getter('message', 'actorRecovery'),
    actorGain: TextManager.getter('message', 'actorGain'),
    actorLoss: TextManager.getter('message', 'actorLoss'),
    actorDrain: TextManager.getter('message', 'actorDrain'),
    actorNoDamage: TextManager.getter('message', 'actorNoDamage'),
    actorNoHit: TextManager.getter('message', 'actorNoHit'),
    enemyDamage: TextManager.getter('message', 'enemyDamage'),
    enemyRecovery: TextManager.getter('message', 'enemyRecovery'),
    enemyGain: TextManager.getter('message', 'enemyGain'),
    enemyLoss: TextManager.getter('message', 'enemyLoss'),
    enemyDrain: TextManager.getter('message', 'enemyDrain'),
    enemyNoDamage: TextManager.getter('message', 'enemyNoDamage'),
    enemyNoHit: TextManager.getter('message', 'enemyNoHit'),
    evasion: TextManager.getter('message', 'evasion'),
    magicEvasion: TextManager.getter('message', 'magicEvasion'),
    magicReflection: TextManager.getter('message', 'magicReflection'),
    counterAttack: TextManager.getter('message', 'counterAttack'),
    substitute: TextManager.getter('message', 'substitute'),
    buffAdd: TextManager.getter('message', 'buffAdd'),
    debuffAdd: TextManager.getter('message', 'debuffAdd'),
    buffRemove: TextManager.getter('message', 'buffRemove'),
    actionFailure: TextManager.getter('message', 'actionFailure')
});

//-----------------------------------------------------------------------------
// SceneManager
//
// The static class that manages scene transitions.

function SceneManager() {
    throw new Error('This is a static class');
}

SceneManager._scene = null;
SceneManager._nextScene = null;
SceneManager._stack = [];
SceneManager._stopped = false;
SceneManager._sceneStarted = false;
SceneManager._exiting = false;
SceneManager._previousClass = null;
SceneManager._backgroundBitmap = null;
SceneManager._screenWidth = 816;
SceneManager._screenHeight = 624;
SceneManager._boxWidth = 816;
SceneManager._boxHeight = 624;

SceneManager.run = function (sceneClass) {
    try {
        this.initialize();
        this.goto(sceneClass);
        this.requestUpdate();
    } catch (e) {
        throw e;
        // this.catchException(e);
    }
};

SceneManager.initialize = function () {
    this.initGraphics();
    this.checkFileAccess();
    this.initAudio();
    this.initInput();
    this.initNwjs();
    this.checkPluginErrors();
    this.setupErrorHandlers();
};

SceneManager.initGraphics = function () {
    var type = this.preferableRendererType();
    _core.Graphics.initialize(this._screenWidth, this._screenHeight, type);
    _core.Graphics.boxWidth = this._boxWidth;
    _core.Graphics.boxHeight = this._boxHeight;
    _core.Graphics.setLoadingImage('img/system/Loading.png');
    if (_core.Utils.isOptionValid('showfps')) {
        _core.Graphics.showFps();
    }
    if (type === 'webgl') {
        this.checkWebGL();
    }
};

SceneManager.preferableRendererType = function () {
    if (_core.Utils.isOptionValid('canvas')) {
        return 'canvas';
    } else if (_core.Utils.isOptionValid('webgl')) {
        return 'webgl';
    } else if (this.shouldUseCanvasRenderer()) {
        return 'canvas';
    } else {
        return 'auto';
    }
};

SceneManager.shouldUseCanvasRenderer = function () {
    return _core.Utils.isMobileDevice();
};

SceneManager.checkWebGL = function () {
    if (!_core.Graphics.hasWebGL()) {
        throw new Error('Your browser does not support WebGL.');
    }
};

SceneManager.checkFileAccess = function () {
    if (!_core.Utils.canReadGameFiles()) {
        throw new Error('Your browser does not allow to read local files.');
    }
};

SceneManager.initAudio = function () {
    var noAudio = _core.Utils.isOptionValid('noaudio');
    if (!_core.WebAudio.initialize(noAudio) && !noAudio) {
        throw new Error('Your browser does not support Web Audio API.');
    }
};

SceneManager.initInput = function () {
    _core.Input.initialize();
    _core.TouchInput.initialize();
};

SceneManager.initNwjs = function () {
    if (_core.Utils.isNwjs()) {
        var gui = require('nw.gui');
        var win = gui.Window.get();
        if (process.platform === 'darwin' && !win.menu) {
            var menubar = new gui.Menu({ type: 'menubar' });
            var option = { hideEdit: true, hideWindow: true };
            menubar.createMacBuiltin('Game', option);
            win.menu = menubar;
        }
    }
};

SceneManager.checkPluginErrors = function () {
    PluginManager.checkErrors();
};

SceneManager.setupErrorHandlers = function () {
    window.addEventListener('error', this.onError.bind(this));
    document.addEventListener('keydown', this.onKeyDown.bind(this));
};

SceneManager.requestUpdate = function () {
    if (!this._stopped) {
        requestAnimationFrame(this.update.bind(this));
    }
};

SceneManager.update = function () {
    try {
        this.tickStart();
        this.updateInputData();
        this.updateMain();
        this.tickEnd();
    } catch (e) {
        this.catchException(e);
    }
};

SceneManager.terminate = function () {
    window.close();
};

SceneManager.onError = function (e) {
    throw e; // TODO: debug

    console.error(e.message);
    console.error(e.filename, e.lineno);
    try {
        this.stop();
        _core.Graphics.printError('Error', e.message);
        AudioManager.stopAll();
    } catch (e2) {}
};

SceneManager.onKeyDown = function (event) {
    if (!event.ctrlKey && !event.altKey) {
        switch (event.keyCode) {
            case 116:
                // F5
                if (_core.Utils.isNwjs()) {
                    location.reload();
                }
                break;
            case 119:
                // F8
                if (_core.Utils.isNwjs() && _core.Utils.isOptionValid('test')) {
                    require('nw.gui').Window.get().showDevTools();
                }
                break;
        }
    }
};

SceneManager.catchException = function (e) {
    if (e instanceof Error) {
        _core.Graphics.printError(e.name, e.message);
        console.error(e.stack);
    } else {
        _core.Graphics.printError('UnknownError', e);
    }
    AudioManager.stopAll();
    this.stop();
};

SceneManager.tickStart = function () {
    _core.Graphics.tickStart();
};

SceneManager.tickEnd = function () {
    _core.Graphics.tickEnd();
};

SceneManager.updateInputData = function () {
    _core.Input.update();
    _core.TouchInput.update();
};

SceneManager.updateMain = function () {
    this.changeScene();
    this.updateScene();
    this.renderScene();
    this.requestUpdate();
};

SceneManager.changeScene = function () {
    if (this.isSceneChanging() && !this.isCurrentSceneBusy()) {
        if (this._scene) {
            this._scene.terminate();
            this._previousClass = this._scene.constructor;
        }
        this._scene = this._nextScene;
        if (this._scene) {
            this._scene.create();
            this._nextScene = null;
            this._sceneStarted = false;
            this.onSceneCreate();
        }
        if (this._exiting) {
            this.terminate();
        }
    }
};

SceneManager.updateScene = function () {
    if (this._scene) {
        if (!this._sceneStarted && this._scene.isReady()) {
            this._scene.start();
            this._sceneStarted = true;
            this.onSceneStart();
        }
        if (this.isCurrentSceneStarted()) {
            this._scene.update();
        }
    }
};

SceneManager.renderScene = function () {
    if (this.isCurrentSceneStarted()) {
        _core.Graphics.render(this._scene);
    } else if (this._scene) {
        this.onSceneLoading();
    }
};

SceneManager.onSceneCreate = function () {
    _core.Graphics.startLoading();
};

SceneManager.onSceneStart = function () {
    _core.Graphics.endLoading();
};

SceneManager.onSceneLoading = function () {
    _core.Graphics.updateLoading();
};

SceneManager.isSceneChanging = function () {
    return this._exiting || !!this._nextScene;
};

SceneManager.isCurrentSceneBusy = function () {
    return this._scene && this._scene.isBusy();
};

SceneManager.isCurrentSceneStarted = function () {
    return this._scene && this._sceneStarted;
};

SceneManager.isNextScene = function (sceneClass) {
    return this._nextScene && this._nextScene.constructor === sceneClass;
};

SceneManager.isPreviousScene = function (sceneClass) {
    return this._previousClass === sceneClass;
};

SceneManager.goto = function (sceneClass) {
    if (sceneClass) {
        this._nextScene = new sceneClass();
    }
    if (this._scene) {
        this._scene.stop();
    }
};

SceneManager.push = function (sceneClass) {
    this._stack.push(this._scene.constructor);
    this.goto(sceneClass);
};

SceneManager.pop = function () {
    if (this._stack.length > 0) {
        this.goto(this._stack.pop());
    } else {
        this.exit();
    }
};

SceneManager.exit = function () {
    this.goto(null);
    this._exiting = true;
};

SceneManager.clearStack = function () {
    this._stack = [];
};

SceneManager.stop = function () {
    this._stopped = true;
};

SceneManager.prepareNextScene = function () {
    this._nextScene.prepare.apply(this._nextScene, arguments);
};

SceneManager.snap = function () {
    return _core.Bitmap.snap(this._scene);
};

SceneManager.snapForBackground = function () {
    this._backgroundBitmap = this.snap();
    this._backgroundBitmap.blur();
};

SceneManager.backgroundBitmap = function () {
    return this._backgroundBitmap;
};

//-----------------------------------------------------------------------------
// BattleManager
//
// The static class that manages battle progress.

function BattleManager() {
    throw new Error('This is a static class');
}

BattleManager.setup = function (troopId, canEscape, canLose) {
    this.initMembers();
    this._canEscape = canEscape;
    this._canLose = canLose;
    $gameTroop.setup(troopId);
    $gameScreen.onBattleStart();
    this.makeEscapeRatio();
};

BattleManager.initMembers = function () {
    this._phase = 'init';
    this._canEscape = false;
    this._canLose = false;
    this._battleTest = false;
    this._eventCallback = null;
    this._preemptive = false;
    this._surprise = false;
    this._actorIndex = -1;
    this._actionForcedBattler = null;
    this._mapBgm = null;
    this._mapBgs = null;
    this._actionBattlers = [];
    this._subject = null;
    this._action = null;
    this._targets = [];
    this._logWindow = null;
    this._statusWindow = null;
    this._spriteset = null;
    this._escapeRatio = 0;
    this._escaped = false;
    this._rewards = {};
};

BattleManager.isBattleTest = function () {
    return this._battleTest;
};

BattleManager.setBattleTest = function (battleTest) {
    this._battleTest = battleTest;
};

BattleManager.setEventCallback = function (callback) {
    this._eventCallback = callback;
};

BattleManager.setLogWindow = function (logWindow) {
    this._logWindow = logWindow;
};

BattleManager.setStatusWindow = function (statusWindow) {
    this._statusWindow = statusWindow;
};

BattleManager.setSpriteset = function (spriteset) {
    this._spriteset = spriteset;
};

BattleManager.onEncounter = function () {
    this._preemptive = Math.random() < this.ratePreemptive();
    this._surprise = Math.random() < this.rateSurprise() && !this._preemptive;
};

BattleManager.ratePreemptive = function () {
    return $gameParty.ratePreemptive($gameTroop.agility());
};

BattleManager.rateSurprise = function () {
    return $gameParty.rateSurprise($gameTroop.agility());
};

BattleManager.saveBgmAndBgs = function () {
    this._mapBgm = AudioManager.saveBgm();
    this._mapBgs = AudioManager.saveBgs();
};

BattleManager.playBattleBgm = function () {
    AudioManager.playBgm($gameSystem.battleBgm());
    AudioManager.stopBgs();
};

BattleManager.playVictoryMe = function () {
    AudioManager.playMe($gameSystem.victoryMe());
};

BattleManager.playDefeatMe = function () {
    AudioManager.playMe($gameSystem.defeatMe());
};

BattleManager.replayBgmAndBgs = function () {
    if (this._mapBgm) {
        AudioManager.replayBgm(this._mapBgm);
    } else {
        AudioManager.stopBgm();
    }
    if (this._mapBgs) {
        AudioManager.replayBgs(this._mapBgs);
    }
};

BattleManager.makeEscapeRatio = function () {
    this._escapeRatio = 0.5 * $gameParty.agility() / $gameTroop.agility();
};

BattleManager.update = function () {
    if (!this.isBusy() && !this.updateEvent()) {
        switch (this._phase) {
            case 'start':
                this.startInput();
                break;
            case 'turn':
                this.updateTurn();
                break;
            case 'action':
                this.updateAction();
                break;
            case 'turnEnd':
                this.updateTurnEnd();
                break;
            case 'battleEnd':
                this.updateBattleEnd();
                break;
        }
    }
};

BattleManager.updateEvent = function () {
    switch (this._phase) {
        case 'start':
        case 'turn':
        case 'turnEnd':
            if (this.isActionForced()) {
                this.processForcedAction();
                return true;
            } else {
                return this.updateEventMain();
            }
    }
    return this.checkAbort();
};

BattleManager.updateEventMain = function () {
    $gameTroop.updateInterpreter();
    $gameParty.requestMotionRefresh();
    if ($gameTroop.isEventRunning() || this.checkBattleEnd()) {
        return true;
    }
    $gameTroop.setupBattleEvent();
    if ($gameTroop.isEventRunning() || SceneManager.isSceneChanging()) {
        return true;
    }
    return false;
};

BattleManager.isBusy = function () {
    return $gameMessage.isBusy() || this._spriteset.isBusy() || this._logWindow.isBusy();
};

BattleManager.isInputting = function () {
    return this._phase === 'input';
};

BattleManager.isInTurn = function () {
    return this._phase === 'turn';
};

BattleManager.isTurnEnd = function () {
    return this._phase === 'turnEnd';
};

BattleManager.isAborting = function () {
    return this._phase === 'aborting';
};

BattleManager.isBattleEnd = function () {
    return this._phase === 'battleEnd';
};

BattleManager.canEscape = function () {
    return this._canEscape;
};

BattleManager.canLose = function () {
    return this._canLose;
};

BattleManager.isEscaped = function () {
    return this._escaped;
};

BattleManager.actor = function () {
    return this._actorIndex >= 0 ? $gameParty.members()[this._actorIndex] : null;
};

BattleManager.clearActor = function () {
    this.changeActor(-1, '');
};

BattleManager.changeActor = function (newActorIndex, lastActorActionState) {
    var lastActor = this.actor();
    this._actorIndex = newActorIndex;
    var newActor = this.actor();
    if (lastActor) {
        lastActor.setActionState(lastActorActionState);
    }
    if (newActor) {
        newActor.setActionState('inputting');
    }
};

BattleManager.startBattle = function () {
    this._phase = 'start';
    $gameSystem.onBattleStart();
    $gameParty.onBattleStart();
    $gameTroop.onBattleStart();
    this.displayStartMessages();
};

BattleManager.displayStartMessages = function () {
    $gameTroop.enemyNames().forEach(function (name) {
        $gameMessage.add(TextManager.emerge.format(name));
    });
    if (this._preemptive) {
        $gameMessage.add(TextManager.preemptive.format($gameParty.name()));
    } else if (this._surprise) {
        $gameMessage.add(TextManager.surprise.format($gameParty.name()));
    }
};

BattleManager.startInput = function () {
    this._phase = 'input';
    $gameParty.makeActions();
    $gameTroop.makeActions();
    this.clearActor();
    if (this._surprise || !$gameParty.canInput()) {
        this.startTurn();
    }
};

BattleManager.inputtingAction = function () {
    return this.actor() ? this.actor().inputtingAction() : null;
};

BattleManager.selectNextCommand = function () {
    do {
        if (!this.actor() || !this.actor().selectNextCommand()) {
            this.changeActor(this._actorIndex + 1, 'waiting');
            if (this._actorIndex >= $gameParty.size()) {
                this.startTurn();
                break;
            }
        }
    } while (!this.actor().canInput());
};

BattleManager.selectPreviousCommand = function () {
    do {
        if (!this.actor() || !this.actor().selectPreviousCommand()) {
            this.changeActor(this._actorIndex - 1, 'undecided');
            if (this._actorIndex < 0) {
                return;
            }
        }
    } while (!this.actor().canInput());
};

BattleManager.refreshStatus = function () {
    this._statusWindow.refresh();
};

BattleManager.startTurn = function () {
    this._phase = 'turn';
    this.clearActor();
    $gameTroop.increaseTurn();
    this.makeActionOrders();
    $gameParty.requestMotionRefresh();
    this._logWindow.startTurn();
};

BattleManager.updateTurn = function () {
    $gameParty.requestMotionRefresh();
    if (!this._subject) {
        this._subject = this.getNextSubject();
    }
    if (this._subject) {
        this.processTurn();
    } else {
        this.endTurn();
    }
};

BattleManager.processTurn = function () {
    var subject = this._subject;
    var action = subject.currentAction();
    if (action) {
        action.prepare();
        if (action.isValid()) {
            this.startAction();
        }
        subject.removeCurrentAction();
    } else {
        subject.onAllActionsEnd();
        this.refreshStatus();
        this._logWindow.displayAutoAffectedStatus(subject);
        this._logWindow.displayCurrentState(subject);
        this._logWindow.displayRegeneration(subject);
        this._subject = this.getNextSubject();
    }
};

BattleManager.endTurn = function () {
    this._phase = 'turnEnd';
    this._preemptive = false;
    this._surprise = false;
    this.allBattleMembers().forEach(function (battler) {
        battler.onTurnEnd();
        this.refreshStatus();
        this._logWindow.displayAutoAffectedStatus(battler);
        this._logWindow.displayRegeneration(battler);
    }, this);
};

BattleManager.updateTurnEnd = function () {
    this.startInput();
};

BattleManager.getNextSubject = function () {
    for (;;) {
        var battler = this._actionBattlers.shift();
        if (!battler) {
            return null;
        }
        if (battler.isBattleMember() && battler.isAlive()) {
            return battler;
        }
    }
};

BattleManager.allBattleMembers = function () {
    return $gameParty.members().concat($gameTroop.members());
};

BattleManager.makeActionOrders = function () {
    var battlers = [];
    if (!this._surprise) {
        battlers = battlers.concat($gameParty.members());
    }
    if (!this._preemptive) {
        battlers = battlers.concat($gameTroop.members());
    }
    battlers.forEach(function (battler) {
        battler.makeSpeed();
    });
    battlers.sort(function (a, b) {
        return b.speed() - a.speed();
    });
    this._actionBattlers = battlers;
};

BattleManager.startAction = function () {
    var subject = this._subject;
    var action = subject.currentAction();
    var targets = action.makeTargets();
    this._phase = 'action';
    this._action = action;
    this._targets = targets;
    subject.useItem(action.item());
    this._action.applyGlobal();
    this.refreshStatus();
    this._logWindow.startAction(subject, action, targets);
};

BattleManager.updateAction = function () {
    var target = this._targets.shift();
    if (target) {
        this.invokeAction(this._subject, target);
    } else {
        this.endAction();
    }
};

BattleManager.endAction = function () {
    this._logWindow.endAction(this._subject);
    this._phase = 'turn';
};

BattleManager.invokeAction = function (subject, target) {
    this._logWindow.push('pushBaseLine');
    if (Math.random() < this._action.itemCnt(target)) {
        this.invokeCounterAttack(subject, target);
    } else if (Math.random() < this._action.itemMrf(target)) {
        this.invokeMagicReflection(subject, target);
    } else {
        this.invokeNormalAction(subject, target);
    }
    subject.setLastTarget(target);
    this._logWindow.push('popBaseLine');
    this.refreshStatus();
};

BattleManager.invokeNormalAction = function (subject, target) {
    var realTarget = this.applySubstitute(target);
    this._action.apply(realTarget);
    this._logWindow.displayActionResults(subject, realTarget);
};

BattleManager.invokeCounterAttack = function (subject, target) {
    var action = new Game_Action(target);
    action.setAttack();
    action.apply(subject);
    this._logWindow.displayCounter(target);
    this._logWindow.displayActionResults(subject, subject);
};

BattleManager.invokeMagicReflection = function (subject, target) {
    this._logWindow.displayReflection(target);
    this._action.apply(subject);
    this._logWindow.displayActionResults(subject, subject);
};

BattleManager.applySubstitute = function (target) {
    if (this.checkSubstitute(target)) {
        var substitute = target.friendsUnit().substituteBattler();
        if (substitute && target !== substitute) {
            this._logWindow.displaySubstitute(substitute, target);
            return substitute;
        }
    }
    return target;
};

BattleManager.checkSubstitute = function (target) {
    return target.isDying() && !this._action.isCertainHit();
};

BattleManager.isActionForced = function () {
    return !!this._actionForcedBattler;
};

BattleManager.forceAction = function (battler) {
    this._actionForcedBattler = battler;
    var index = this._actionBattlers.indexOf(battler);
    if (index >= 0) {
        this._actionBattlers.splice(index, 1);
    }
};

BattleManager.processForcedAction = function () {
    if (this._actionForcedBattler) {
        this._subject = this._actionForcedBattler;
        this._actionForcedBattler = null;
        this.startAction();
        this._subject.removeCurrentAction();
    }
};

BattleManager.abort = function () {
    this._phase = 'aborting';
};

BattleManager.checkBattleEnd = function () {
    if (this._phase) {
        if (this.checkAbort()) {
            return true;
        } else if ($gameParty.isAllDead()) {
            this.processDefeat();
            return true;
        } else if ($gameTroop.isAllDead()) {
            this.processVictory();
            return true;
        }
    }
    return false;
};

BattleManager.checkAbort = function () {
    if ($gameParty.isEmpty() || this.isAborting()) {
        this.processAbort();
        return true;
    }
    return false;
};

BattleManager.processVictory = function () {
    $gameParty.removeBattleStates();
    $gameParty.performVictory();
    this.playVictoryMe();
    this.replayBgmAndBgs();
    this.makeRewards();
    this.displayVictoryMessage();
    this.displayRewards();
    this.gainRewards();
    this.endBattle(0);
};

BattleManager.processEscape = function () {
    $gameParty.removeBattleStates();
    $gameParty.performEscape();
    SoundManager.playEscape();
    var success = this._preemptive ? true : Math.random() < this._escapeRatio;
    if (success) {
        this.displayEscapeSuccessMessage();
        this._escaped = true;
        this.processAbort();
    } else {
        this.displayEscapeFailureMessage();
        this._escapeRatio += 0.1;
        $gameParty.clearActions();
        this.startTurn();
    }
    return success;
};

BattleManager.processAbort = function () {
    this.replayBgmAndBgs();
    this.endBattle(1);
};

BattleManager.processDefeat = function () {
    this.displayDefeatMessage();
    this.playDefeatMe();
    if (this._canLose) {
        this.replayBgmAndBgs();
    } else {
        AudioManager.stopBgm();
    }
    this.endBattle(2);
};

BattleManager.endBattle = function (result) {
    this._phase = 'battleEnd';
    if (this._eventCallback) {
        this._eventCallback(result);
    }
    if (result === 0) {
        $gameSystem.onBattleWin();
    } else if (this._escaped) {
        $gameSystem.onBattleEscape();
    }
};

BattleManager.updateBattleEnd = function () {
    if (this.isBattleTest()) {
        AudioManager.stopBgm();
        SceneManager.exit();
    } else if ($gameParty.isAllDead()) {
        if (this._canLose) {
            $gameParty.reviveBattleMembers();
            SceneManager.pop();
        } else {
            SceneManager.goto(Scene_Gameover);
        }
    } else {
        SceneManager.pop();
    }
    this._phase = null;
};

BattleManager.makeRewards = function () {
    this._rewards = {};
    this._rewards.gold = $gameTroop.goldTotal();
    this._rewards.exp = $gameTroop.expTotal();
    this._rewards.items = $gameTroop.makeDropItems();
};

BattleManager.displayVictoryMessage = function () {
    $gameMessage.add(TextManager.victory.format($gameParty.name()));
};

BattleManager.displayDefeatMessage = function () {
    $gameMessage.add(TextManager.defeat.format($gameParty.name()));
};

BattleManager.displayEscapeSuccessMessage = function () {
    $gameMessage.add(TextManager.escapeStart.format($gameParty.name()));
};

BattleManager.displayEscapeFailureMessage = function () {
    $gameMessage.add(TextManager.escapeStart.format($gameParty.name()));
    $gameMessage.add('\\.' + TextManager.escapeFailure);
};

BattleManager.displayRewards = function () {
    this.displayExp();
    this.displayGold();
    this.displayDropItems();
};

BattleManager.displayExp = function () {
    var exp = this._rewards.exp;
    if (exp > 0) {
        var text = TextManager.obtainExp.format(exp, TextManager.exp);
        $gameMessage.add('\\.' + text);
    }
};

BattleManager.displayGold = function () {
    var gold = this._rewards.gold;
    if (gold > 0) {
        $gameMessage.add('\\.' + TextManager.obtainGold.format(gold));
    }
};

BattleManager.displayDropItems = function () {
    var items = this._rewards.items;
    if (items.length > 0) {
        $gameMessage.newPage();
        items.forEach(function (item) {
            $gameMessage.add(TextManager.obtainItem.format(item.name));
        });
    }
};

BattleManager.gainRewards = function () {
    this.gainExp();
    this.gainGold();
    this.gainDropItems();
};

BattleManager.gainExp = function () {
    var exp = this._rewards.exp;
    $gameParty.allMembers().forEach(function (actor) {
        actor.gainExp(exp);
    });
};

BattleManager.gainGold = function () {
    $gameParty.gainGold(this._rewards.gold);
};

BattleManager.gainDropItems = function () {
    var items = this._rewards.items;
    items.forEach(function (item) {
        $gameParty.gainItem(item, 1);
    });
};

//-----------------------------------------------------------------------------
// PluginManager
//
// The static class that manages the plugins.

function PluginManager() {
    throw new Error('This is a static class');
}

window.PluginManager = PluginManager;
window.PluginManager = PluginManager;

PluginManager._path = 'js/plugins/';
PluginManager._scripts = [];
PluginManager._errorUrls = [];
PluginManager._parameters = {};

PluginManager.setup = function (plugins) {
    plugins.forEach(function (plugin) {
        if (plugin.status && !this._scripts.contains(plugin.name)) {
            this.setParameters(plugin.name, plugin.parameters);
            this.loadScript(plugin.name + '.js');
            this._scripts.push(plugin.name);
        }
    }, this);
};

PluginManager.checkErrors = function () {
    var url = this._errorUrls.shift();
    if (url) {
        throw new Error('Failed to load: ' + url);
    }
};

PluginManager.parameters = function (name) {
    return this._parameters[name.toLowerCase()] || {};
};

PluginManager.setParameters = function (name, parameters) {
    this._parameters[name.toLowerCase()] = parameters;
};

PluginManager.loadScript = function (name) {
    var url = this._path + name;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.async = false;
    script.onerror = this.onError.bind(this);
    script._url = url;
    document.body.appendChild(script);
};

PluginManager.onError = function (e) {
    this._errorUrls.push(e.target._url);
};

}).call(this,require('_process'))
},{"./core":4,"./objects":7,"./sprites":10,"_process":2,"fs":1,"nw.gui":1}],7:[function(require,module,exports){
'use strict';Object.defineProperty(exports,'__esModule',{value:true});exports.Game_Temp = Game_Temp;exports.Game_System = Game_System;exports.Game_Timer = Game_Timer;exports.Game_Message = Game_Message;exports.Game_Switches = Game_Switches;exports.Game_Variables = Game_Variables;exports.Game_SelfSwitches = Game_SelfSwitches;exports.Game_Screen = Game_Screen;exports.Game_Picture = Game_Picture;exports.Game_Item = Game_Item;exports.Game_Action = Game_Action;exports.Game_ActionResult = Game_ActionResult;exports.Game_BattlerBase = Game_BattlerBase;exports.Game_Battler = Game_Battler;exports.Game_Actor = Game_Actor;exports.Game_Enemy = Game_Enemy;exports.Game_Actors = Game_Actors;exports.Game_Unit = Game_Unit;exports.Game_Party = Game_Party;exports.Game_Troop = Game_Troop;exports.Game_Map = Game_Map;exports.Game_CommonEvent = Game_CommonEvent;exports.Game_CharacterBase = Game_CharacterBase;exports.Game_Character = Game_Character;exports.Game_Player = Game_Player;exports.Game_Follower = Game_Follower;exports.Game_Followers = Game_Followers;exports.Game_Vehicle = Game_Vehicle;exports.Game_Event = Game_Event;exports.Game_Interpreter = Game_Interpreter;var _core=require('./core');var _managers=require('./managers'); //=============================================================================
// rpg_objects.js
//=============================================================================
//-----------------------------------------------------------------------------
// Game_Temp
//
// The game object class for temporary data that is not included in save data.
function Game_Temp(){this.initialize.apply(this,arguments);}Game_Temp.prototype.initialize = function(){this._isPlaytest = _core.Utils.isOptionValid('test');this._commonEventId = 0;this._destinationX = null;this._destinationY = null;};Game_Temp.prototype.isPlaytest = function(){return this._isPlaytest;};Game_Temp.prototype.reserveCommonEvent = function(commonEventId){this._commonEventId = commonEventId;};Game_Temp.prototype.clearCommonEvent = function(){this._commonEventId = 0;};Game_Temp.prototype.isCommonEventReserved = function(){return this._commonEventId > 0;};Game_Temp.prototype.reservedCommonEvent = function(){return $dataCommonEvents[this._commonEventId];};Game_Temp.prototype.setDestination = function(x,y){this._destinationX = x;this._destinationY = y;};Game_Temp.prototype.clearDestination = function(){this._destinationX = null;this._destinationY = null;};Game_Temp.prototype.isDestinationValid = function(){return this._destinationX !== null;};Game_Temp.prototype.destinationX = function(){return this._destinationX;};Game_Temp.prototype.destinationY = function(){return this._destinationY;}; //-----------------------------------------------------------------------------
// Game_System
//
// The game object class for the system data.
function Game_System(){this.initialize.apply(this,arguments);}Game_System.prototype.initialize = function(){this._saveEnabled = true;this._menuEnabled = true;this._encounterEnabled = true;this._formationEnabled = true;this._battleCount = 0;this._winCount = 0;this._escapeCount = 0;this._saveCount = 0;this._versionId = 0;this._framesOnSave = 0;this._bgmOnSave = null;this._bgsOnSave = null;this._windowTone = null;this._battleBgm = null;this._victoryMe = null;this._defeatMe = null;this._savedBgm = null;this._walkingBgm = null;};Game_System.prototype.isJapanese = function(){return $dataSystem.locale.match(/^ja/);};Game_System.prototype.isChinese = function(){return $dataSystem.locale.match(/^zh/);};Game_System.prototype.isKorean = function(){return $dataSystem.locale.match(/^ko/);};Game_System.prototype.isCJK = function(){return $dataSystem.locale.match(/^(ja|zh|ko)/);};Game_System.prototype.isRussian = function(){return $dataSystem.locale.match(/^ru/);};Game_System.prototype.isSideView = function(){return $dataSystem.optSideView;};Game_System.prototype.isSaveEnabled = function(){return this._saveEnabled;};Game_System.prototype.disableSave = function(){this._saveEnabled = false;};Game_System.prototype.enableSave = function(){this._saveEnabled = true;};Game_System.prototype.isMenuEnabled = function(){return this._menuEnabled;};Game_System.prototype.disableMenu = function(){this._menuEnabled = false;};Game_System.prototype.enableMenu = function(){this._menuEnabled = true;};Game_System.prototype.isEncounterEnabled = function(){return this._encounterEnabled;};Game_System.prototype.disableEncounter = function(){this._encounterEnabled = false;};Game_System.prototype.enableEncounter = function(){this._encounterEnabled = true;};Game_System.prototype.isFormationEnabled = function(){return this._formationEnabled;};Game_System.prototype.disableFormation = function(){this._formationEnabled = false;};Game_System.prototype.enableFormation = function(){this._formationEnabled = true;};Game_System.prototype.battleCount = function(){return this._battleCount;};Game_System.prototype.winCount = function(){return this._winCount;};Game_System.prototype.escapeCount = function(){return this._escapeCount;};Game_System.prototype.saveCount = function(){return this._saveCount;};Game_System.prototype.versionId = function(){return this._versionId;};Game_System.prototype.windowTone = function(){return this._windowTone || $dataSystem.windowTone;};Game_System.prototype.setWindowTone = function(value){this._windowTone = value;};Game_System.prototype.battleBgm = function(){return this._battleBgm || $dataSystem.battleBgm;};Game_System.prototype.setBattleBgm = function(value){this._battleBgm = value;};Game_System.prototype.victoryMe = function(){return this._victoryMe || $dataSystem.victoryMe;};Game_System.prototype.setVictoryMe = function(value){this._victoryMe = value;};Game_System.prototype.defeatMe = function(){return this._defeatMe || $dataSystem.defeatMe;};Game_System.prototype.setDefeatMe = function(value){this._defeatMe = value;};Game_System.prototype.onBattleStart = function(){this._battleCount++;};Game_System.prototype.onBattleWin = function(){this._winCount++;};Game_System.prototype.onBattleEscape = function(){this._escapeCount++;};Game_System.prototype.onBeforeSave = function(){this._saveCount++;this._versionId = $dataSystem.versionId;this._framesOnSave = _core.Graphics.frameCount;this._bgmOnSave = _managers.AudioManager.saveBgm();this._bgsOnSave = _managers.AudioManager.saveBgs();};Game_System.prototype.onAfterLoad = function(){_core.Graphics.frameCount = this._framesOnSave;_managers.AudioManager.playBgm(this._bgmOnSave);_managers.AudioManager.playBgs(this._bgsOnSave);};Game_System.prototype.playtime = function(){return Math.floor(_core.Graphics.frameCount / 60);};Game_System.prototype.playtimeText = function(){var hour=Math.floor(this.playtime() / 60 / 60);var min=Math.floor(this.playtime() / 60) % 60;var sec=this.playtime() % 60;return hour.padZero(2) + ':' + min.padZero(2) + ':' + sec.padZero(2);};Game_System.prototype.saveBgm = function(){this._savedBgm = _managers.AudioManager.saveBgm();};Game_System.prototype.replayBgm = function(){if(this._savedBgm){_managers.AudioManager.replayBgm(this._savedBgm);}};Game_System.prototype.saveWalkingBgm = function(){this._walkingBgm = _managers.AudioManager.saveBgm();};Game_System.prototype.replayWalkingBgm = function(){if(this._walkingBgm){_managers.AudioManager.playBgm(this._walkingBgm);}}; //-----------------------------------------------------------------------------
// Game_Timer
//
// The game object class for the timer.
function Game_Timer(){this.initialize.apply(this,arguments);}Game_Timer.prototype.initialize = function(){this._frames = 0;this._working = false;};Game_Timer.prototype.update = function(sceneActive){if(sceneActive && this._working && this._frames > 0){this._frames--;if(this._frames === 0){this.onExpire();}}};Game_Timer.prototype.start = function(count){this._frames = count;this._working = true;};Game_Timer.prototype.stop = function(){this._working = false;};Game_Timer.prototype.isWorking = function(){return this._working;};Game_Timer.prototype.seconds = function(){return Math.floor(this._frames / 60);};Game_Timer.prototype.onExpire = function(){BattleManager.abort();}; //-----------------------------------------------------------------------------
// Game_Message
//
// The game object class for the state of the message window that displays text
// or selections, etc.
function Game_Message(){this.initialize.apply(this,arguments);}Game_Message.prototype.initialize = function(){this.clear();};Game_Message.prototype.clear = function(){this._texts = [];this._choices = [];this._faceName = '';this._faceIndex = 0;this._background = 0;this._positionType = 2;this._choiceDefaultType = 0;this._choiceCancelType = 0;this._choiceBackground = 0;this._choicePositionType = 2;this._numInputVariableId = 0;this._numInputMaxDigits = 0;this._itemChoiceVariableId = 0;this._itemChoiceItypeId = 0;this._scrollMode = false;this._scrollSpeed = 2;this._scrollNoFast = false;this._choiceCallback = null;};Game_Message.prototype.choices = function(){return this._choices;};Game_Message.prototype.faceName = function(){return this._faceName;};Game_Message.prototype.faceIndex = function(){return this._faceIndex;};Game_Message.prototype.background = function(){return this._background;};Game_Message.prototype.positionType = function(){return this._positionType;};Game_Message.prototype.choiceDefaultType = function(){return this._choiceDefaultType;};Game_Message.prototype.choiceCancelType = function(){return this._choiceCancelType;};Game_Message.prototype.choiceBackground = function(){return this._choiceBackground;};Game_Message.prototype.choicePositionType = function(){return this._choicePositionType;};Game_Message.prototype.numInputVariableId = function(){return this._numInputVariableId;};Game_Message.prototype.numInputMaxDigits = function(){return this._numInputMaxDigits;};Game_Message.prototype.itemChoiceVariableId = function(){return this._itemChoiceVariableId;};Game_Message.prototype.itemChoiceItypeId = function(){return this._itemChoiceItypeId;};Game_Message.prototype.scrollMode = function(){return this._scrollMode;};Game_Message.prototype.scrollSpeed = function(){return this._scrollSpeed;};Game_Message.prototype.scrollNoFast = function(){return this._scrollNoFast;};Game_Message.prototype.add = function(text){this._texts.push(text);};Game_Message.prototype.setFaceImage = function(faceName,faceIndex){this._faceName = faceName;this._faceIndex = faceIndex;};Game_Message.prototype.setBackground = function(background){this._background = background;};Game_Message.prototype.setPositionType = function(positionType){this._positionType = positionType;};Game_Message.prototype.setChoices = function(choices,defaultType,cancelType){this._choices = choices;this._choiceDefaultType = defaultType;this._choiceCancelType = cancelType;};Game_Message.prototype.setChoiceBackground = function(background){this._choiceBackground = background;};Game_Message.prototype.setChoicePositionType = function(positionType){this._choicePositionType = positionType;};Game_Message.prototype.setNumberInput = function(variableId,maxDigits){this._numInputVariableId = variableId;this._numInputMaxDigits = maxDigits;};Game_Message.prototype.setItemChoice = function(variableId,itemType){this._itemChoiceVariableId = variableId;this._itemChoiceItypeId = itemType;};Game_Message.prototype.setScroll = function(speed,noFast){this._scrollMode = true;this._scrollSpeed = speed;this._scrollNoFast = noFast;};Game_Message.prototype.setChoiceCallback = function(callback){this._choiceCallback = callback;};Game_Message.prototype.onChoice = function(n){if(this._choiceCallback){this._choiceCallback(n);this._choiceCallback = null;}};Game_Message.prototype.hasText = function(){return this._texts.length > 0;};Game_Message.prototype.isChoice = function(){return this._choices.length > 0;};Game_Message.prototype.isNumberInput = function(){return this._numInputVariableId > 0;};Game_Message.prototype.isItemChoice = function(){return this._itemChoiceVariableId > 0;};Game_Message.prototype.isBusy = function(){return this.hasText() || this.isChoice() || this.isNumberInput() || this.isItemChoice();};Game_Message.prototype.newPage = function(){if(this._texts.length > 0){this._texts[this._texts.length - 1] += '\f';}};Game_Message.prototype.allText = function(){return this._texts.reduce(function(previousValue,currentValue){return previousValue + '\n' + currentValue;});}; //-----------------------------------------------------------------------------
// Game_Switches
//
// The game object class for switches.
function Game_Switches(){this.initialize.apply(this,arguments);}Game_Switches.prototype.initialize = function(){this.clear();};Game_Switches.prototype.clear = function(){this._data = [];};Game_Switches.prototype.value = function(switchId){return !!this._data[switchId];};Game_Switches.prototype.setValue = function(switchId,value){if(switchId > 0 && switchId < $dataSystem.switches.length){this._data[switchId] = value;this.onChange();}};Game_Switches.prototype.onChange = function(){$gameMap.requestRefresh();}; //-----------------------------------------------------------------------------
// Game_Variables
//
// The game object class for variables.
function Game_Variables(){this.initialize.apply(this,arguments);}Game_Variables.prototype.initialize = function(){this.clear();};Game_Variables.prototype.clear = function(){this._data = [];};Game_Variables.prototype.value = function(variableId){return this._data[variableId] || 0;};Game_Variables.prototype.setValue = function(variableId,value){if(variableId > 0 && variableId < $dataSystem.variables.length){if(typeof value === 'number'){value = Math.floor(value);}this._data[variableId] = value;this.onChange();}};Game_Variables.prototype.onChange = function(){$gameMap.requestRefresh();}; //-----------------------------------------------------------------------------
// Game_SelfSwitches
//
// The game object class for self switches.
function Game_SelfSwitches(){this.initialize.apply(this,arguments);}Game_SelfSwitches.prototype.initialize = function(){this.clear();};Game_SelfSwitches.prototype.clear = function(){this._data = {};};Game_SelfSwitches.prototype.value = function(key){return !!this._data[key];};Game_SelfSwitches.prototype.setValue = function(key,value){if(value){this._data[key] = true;}else {delete this._data[key];}this.onChange();};Game_SelfSwitches.prototype.onChange = function(){$gameMap.requestRefresh();}; //-----------------------------------------------------------------------------
// Game_Screen
//
// The game object class for screen effect data, such as changes in color tone
// and flashes.
function Game_Screen(){this.initialize.apply(this,arguments);}Game_Screen.prototype.initialize = function(){this.clear();};Game_Screen.prototype.clear = function(){this.clearFade();this.clearTone();this.clearFlash();this.clearShake();this.clearZoom();this.clearWeather();this.clearPictures();};Game_Screen.prototype.onBattleStart = function(){this.clearFade();this.clearFlash();this.clearShake();this.clearZoom();this.eraseBattlePictures();};Game_Screen.prototype.brightness = function(){return this._brightness;};Game_Screen.prototype.tone = function(){return this._tone;};Game_Screen.prototype.flashColor = function(){return this._flashColor;};Game_Screen.prototype.shake = function(){return this._shake;};Game_Screen.prototype.zoomX = function(){return this._zoomX;};Game_Screen.prototype.zoomY = function(){return this._zoomY;};Game_Screen.prototype.zoomScale = function(){return this._zoomScale;};Game_Screen.prototype.weatherType = function(){return this._weatherType;};Game_Screen.prototype.weatherPower = function(){return this._weatherPower;};Game_Screen.prototype.picture = function(pictureId){var realPictureId=this.realPictureId(pictureId);return this._pictures[realPictureId];};Game_Screen.prototype.realPictureId = function(pictureId){if($gameParty.inBattle()){return pictureId + this.maxPictures();}else {return pictureId;}};Game_Screen.prototype.clearFade = function(){this._brightness = 255;this._fadeOutDuration = 0;this._fadeInDuration = 0;};Game_Screen.prototype.clearTone = function(){this._tone = [0,0,0,0];this._toneTarget = [0,0,0,0];this._toneDuration = 0;};Game_Screen.prototype.clearFlash = function(){this._flashColor = [0,0,0,0];this._flashDuration = 0;};Game_Screen.prototype.clearShake = function(){this._shakePower = 0;this._shakeSpeed = 0;this._shakeDuration = 0;this._shakeDirection = 1;this._shake = 0;};Game_Screen.prototype.clearZoom = function(){this._zoomX = 0;this._zoomY = 0;this._zoomScale = 1;this._zoomScaleTarget = 1;this._zoomDuration = 0;};Game_Screen.prototype.clearWeather = function(){this._weatherType = 'none';this._weatherPower = 0;this._weatherPowerTarget = 0;this._weatherDuration = 0;};Game_Screen.prototype.clearPictures = function(){this._pictures = [];};Game_Screen.prototype.eraseBattlePictures = function(){this._pictures = this._pictures.slice(0,this.maxPictures() + 1);};Game_Screen.prototype.maxPictures = function(){return 100;};Game_Screen.prototype.startFadeOut = function(duration){this._fadeOutDuration = duration;this._fadeInDuration = 0;};Game_Screen.prototype.startFadeIn = function(duration){this._fadeInDuration = duration;this._fadeOutDuration = 0;};Game_Screen.prototype.startTint = function(tone,duration){this._toneTarget = tone.clone();this._toneDuration = duration;if(this._toneDuration === 0){this._tone = this._toneTarget.clone();}};Game_Screen.prototype.startFlash = function(color,duration){this._flashColor = color.clone();this._flashDuration = duration;};Game_Screen.prototype.startShake = function(power,speed,duration){this._shakePower = power;this._shakeSpeed = speed;this._shakeDuration = duration;};Game_Screen.prototype.startZoom = function(x,y,scale,duration){this._zoomX = x;this._zoomY = y;this._zoomScaleTarget = scale;this._zoomDuration = duration;};Game_Screen.prototype.setZoom = function(x,y,scale){this._zoomX = x;this._zoomY = y;this._zoomScale = scale;};Game_Screen.prototype.changeWeather = function(type,power,duration){if(type !== 'none' || duration === 0){this._weatherType = type;}this._weatherPowerTarget = type === 'none'?0:power;this._weatherDuration = duration;if(duration === 0){this._weatherPower = this._weatherPowerTarget;}};Game_Screen.prototype.update = function(){this.updateFadeOut();this.updateFadeIn();this.updateTone();this.updateFlash();this.updateShake();this.updateZoom();this.updateWeather();this.updatePictures();};Game_Screen.prototype.updateFadeOut = function(){if(this._fadeOutDuration > 0){var d=this._fadeOutDuration;this._brightness = this._brightness * (d - 1) / d;this._fadeOutDuration--;}};Game_Screen.prototype.updateFadeIn = function(){if(this._fadeInDuration > 0){var d=this._fadeInDuration;this._brightness = (this._brightness * (d - 1) + 255) / d;this._fadeInDuration--;}};Game_Screen.prototype.updateTone = function(){if(this._toneDuration > 0){var d=this._toneDuration;for(var i=0;i < 4;i++) {this._tone[i] = (this._tone[i] * (d - 1) + this._toneTarget[i]) / d;}this._toneDuration--;}};Game_Screen.prototype.updateFlash = function(){if(this._flashDuration > 0){var d=this._flashDuration;this._flashColor[3] *= (d - 1) / d;this._flashDuration--;}};Game_Screen.prototype.updateShake = function(){if(this._shakeDuration > 0 || this._shake !== 0){var delta=this._shakePower * this._shakeSpeed * this._shakeDirection / 10;if(this._shakeDuration <= 1 && this._shake * (this._shake + delta) < 0){this._shake = 0;}else {this._shake += delta;}if(this._shake > this._shakePower * 2){this._shakeDirection = -1;}if(this._shake < -this._shakePower * 2){this._shakeDirection = 1;}this._shakeDuration--;}};Game_Screen.prototype.updateZoom = function(){if(this._zoomDuration > 0){var d=this._zoomDuration;var t=this._zoomScaleTarget;this._zoomScale = (this._zoomScale * (d - 1) + t) / d;this._zoomDuration--;}};Game_Screen.prototype.updateWeather = function(){if(this._weatherDuration > 0){var d=this._weatherDuration;var t=this._weatherPowerTarget;this._weatherPower = (this._weatherPower * (d - 1) + t) / d;this._weatherDuration--;if(this._weatherDuration === 0 && this._weatherPowerTarget === 0){this._weatherType = 'none';}}};Game_Screen.prototype.updatePictures = function(){this._pictures.forEach(function(picture){if(picture){picture.update();}});};Game_Screen.prototype.startFlashForDamage = function(){this.startFlash([255,0,0,128],8);};Game_Screen.prototype.showPicture = function(pictureId,name,origin,x,y,scaleX,scaleY,opacity,blendMode){var realPictureId=this.realPictureId(pictureId);var picture=new Game_Picture();picture.show(name,origin,x,y,scaleX,scaleY,opacity,blendMode);this._pictures[realPictureId] = picture;};Game_Screen.prototype.movePicture = function(pictureId,origin,x,y,scaleX,scaleY,opacity,blendMode,duration){var picture=this.picture(pictureId);if(picture){picture.move(origin,x,y,scaleX,scaleY,opacity,blendMode,duration);}};Game_Screen.prototype.rotatePicture = function(pictureId,speed){var picture=this.picture(pictureId);if(picture){picture.rotate(speed);}};Game_Screen.prototype.tintPicture = function(pictureId,tone,duration){var picture=this.picture(pictureId);if(picture){picture.tint(tone,duration);}};Game_Screen.prototype.erasePicture = function(pictureId){var realPictureId=this.realPictureId(pictureId);this._pictures[realPictureId] = null;}; //-----------------------------------------------------------------------------
// Game_Picture
//
// The game object class for a picture.
function Game_Picture(){this.initialize.apply(this,arguments);}Game_Picture.prototype.initialize = function(){this.initBasic();this.initTarget();this.initTone();this.initRotation();};Game_Picture.prototype.name = function(){return this._name;};Game_Picture.prototype.origin = function(){return this._origin;};Game_Picture.prototype.x = function(){return this._x;};Game_Picture.prototype.y = function(){return this._y;};Game_Picture.prototype.scaleX = function(){return this._scaleX;};Game_Picture.prototype.scaleY = function(){return this._scaleY;};Game_Picture.prototype.opacity = function(){return this._opacity;};Game_Picture.prototype.blendMode = function(){return this._blendMode;};Game_Picture.prototype.tone = function(){return this._tone;};Game_Picture.prototype.angle = function(){return this._angle;};Game_Picture.prototype.initBasic = function(){this._name = '';this._origin = 0;this._x = 0;this._y = 0;this._scaleX = 100;this._scaleY = 100;this._opacity = 255;this._blendMode = 0;};Game_Picture.prototype.initTarget = function(){this._targetX = this._x;this._targetY = this._y;this._targetScaleX = this._scaleX;this._targetScaleY = this._scaleY;this._targetOpacity = this._opacity;this._duration = 0;};Game_Picture.prototype.initTone = function(){this._tone = null;this._toneTarget = null;this._toneDuration = 0;};Game_Picture.prototype.initRotation = function(){this._angle = 0;this._rotationSpeed = 0;};Game_Picture.prototype.show = function(name,origin,x,y,scaleX,scaleY,opacity,blendMode){this._name = name;this._origin = origin;this._x = x;this._y = y;this._scaleX = scaleX;this._scaleY = scaleY;this._opacity = opacity;this._blendMode = blendMode;this.initTarget();this.initTone();this.initRotation();};Game_Picture.prototype.move = function(origin,x,y,scaleX,scaleY,opacity,blendMode,duration){this._origin = origin;this._targetX = x;this._targetY = y;this._targetScaleX = scaleX;this._targetScaleY = scaleY;this._targetOpacity = opacity;this._blendMode = blendMode;this._duration = duration;};Game_Picture.prototype.rotate = function(speed){this._rotationSpeed = speed;};Game_Picture.prototype.tint = function(tone,duration){if(!this._tone){this._tone = [0,0,0,0];}this._toneTarget = tone.clone();this._toneDuration = duration;if(this._toneDuration === 0){this._tone = this._toneTarget.clone();}};Game_Picture.prototype.erase = function(){this._name = '';this._origin = 0;this.initTarget();this.initTone();this.initRotation();};Game_Picture.prototype.update = function(){this.updateMove();this.updateTone();this.updateRotation();};Game_Picture.prototype.updateMove = function(){if(this._duration > 0){var d=this._duration;this._x = (this._x * (d - 1) + this._targetX) / d;this._y = (this._y * (d - 1) + this._targetY) / d;this._scaleX = (this._scaleX * (d - 1) + this._targetScaleX) / d;this._scaleY = (this._scaleY * (d - 1) + this._targetScaleY) / d;this._opacity = (this._opacity * (d - 1) + this._targetOpacity) / d;this._duration--;}};Game_Picture.prototype.updateTone = function(){if(this._toneDuration > 0){var d=this._toneDuration;for(var i=0;i < 4;i++) {this._tone[i] = (this._tone[i] * (d - 1) + this._toneTarget[i]) / d;}this._toneDuration--;}};Game_Picture.prototype.updateRotation = function(){if(this._rotationSpeed > 0){this._angle += this._rotationSpeed / 2;}}; //-----------------------------------------------------------------------------
// Game_Item
//
// The game object class for handling skills, items, weapons, and armor. It is
// required because save data should not include the database object itself.
function Game_Item(){this.initialize.apply(this,arguments);}Game_Item.prototype.initialize = function(item){this._dataClass = '';this._itemId = 0;if(item){this.setObject(item);}};Game_Item.prototype.isSkill = function(){return this._dataClass === 'skill';};Game_Item.prototype.isItem = function(){return this._dataClass === 'item';};Game_Item.prototype.isUsableItem = function(){return this.isSkill() || this.isItem();};Game_Item.prototype.isWeapon = function(){return this._dataClass === 'weapon';};Game_Item.prototype.isArmor = function(){return this._dataClass === 'armor';};Game_Item.prototype.isEquipItem = function(){return this.isWeapon() || this.isArmor();};Game_Item.prototype.isNull = function(){return this._dataClass === '';};Game_Item.prototype.itemId = function(){return this._itemId;};Game_Item.prototype.object = function(){if(this.isSkill()){return $dataSkills[this._itemId];}else if(this.isItem()){return $dataItems[this._itemId];}else if(this.isWeapon()){return $dataWeapons[this._itemId];}else if(this.isArmor()){return $dataArmors[this._itemId];}else {return null;}};Game_Item.prototype.setObject = function(item){if(_managers.DataManager.isSkill(item)){this._dataClass = 'skill';}else if(_managers.DataManager.isItem(item)){this._dataClass = 'item';}else if(_managers.DataManager.isWeapon(item)){this._dataClass = 'weapon';}else if(_managers.DataManager.isArmor(item)){this._dataClass = 'armor';}else {this._dataClass = '';}this._itemId = item?item.id:0;};Game_Item.prototype.setEquip = function(isWeapon,itemId){this._dataClass = isWeapon?'weapon':'armor';this._itemId = itemId;}; //-----------------------------------------------------------------------------
// Game_Action
//
// The game object class for a battle action.
function Game_Action(){this.initialize.apply(this,arguments);}Game_Action.EFFECT_RECOVER_HP = 11;Game_Action.EFFECT_RECOVER_MP = 12;Game_Action.EFFECT_GAIN_TP = 13;Game_Action.EFFECT_ADD_STATE = 21;Game_Action.EFFECT_REMOVE_STATE = 22;Game_Action.EFFECT_ADD_BUFF = 31;Game_Action.EFFECT_ADD_DEBUFF = 32;Game_Action.EFFECT_REMOVE_BUFF = 33;Game_Action.EFFECT_REMOVE_DEBUFF = 34;Game_Action.EFFECT_SPECIAL = 41;Game_Action.EFFECT_GROW = 42;Game_Action.EFFECT_LEARN_SKILL = 43;Game_Action.EFFECT_COMMON_EVENT = 44;Game_Action.SPECIAL_EFFECT_ESCAPE = 0;Game_Action.HITTYPE_CERTAIN = 0;Game_Action.HITTYPE_PHYSICAL = 1;Game_Action.HITTYPE_MAGICAL = 2;Game_Action.prototype.initialize = function(subject,forcing){this._subjectActorId = 0;this._subjectEnemyIndex = -1;this._forcing = forcing || false;this.setSubject(subject);this.clear();};Game_Action.prototype.clear = function(){this._item = new Game_Item();this._targetIndex = -1;};Game_Action.prototype.setSubject = function(subject){if(subject.isActor()){this._subjectActorId = subject.actorId();this._subjectEnemyIndex = -1;}else {this._subjectEnemyIndex = subject.index();this._subjectActorId = 0;}};Game_Action.prototype.subject = function(){if(this._subjectActorId > 0){return $gameActors.actor(this._subjectActorId);}else {return $gameTroop.members()[this._subjectEnemyIndex];}};Game_Action.prototype.friendsUnit = function(){return this.subject().friendsUnit();};Game_Action.prototype.opponentsUnit = function(){return this.subject().opponentsUnit();};Game_Action.prototype.setEnemyAction = function(action){if(action){this.setSkill(action.skillId);}else {this.clear();}};Game_Action.prototype.setAttack = function(){this.setSkill(this.subject().attackSkillId());};Game_Action.prototype.setGuard = function(){this.setSkill(this.subject().guardSkillId());};Game_Action.prototype.setSkill = function(skillId){this._item.setObject($dataSkills[skillId]);};Game_Action.prototype.setItem = function(itemId){this._item.setObject($dataItems[itemId]);};Game_Action.prototype.setItemObject = function(object){this._item.setObject(object);};Game_Action.prototype.setTarget = function(targetIndex){this._targetIndex = targetIndex;};Game_Action.prototype.item = function(){return this._item.object();};Game_Action.prototype.isSkill = function(){return this._item.isSkill();};Game_Action.prototype.isItem = function(){return this._item.isItem();};Game_Action.prototype.numRepeats = function(){var repeats=this.item().repeats;if(this.isAttack()){repeats += this.subject().attackTimesAdd();}return Math.floor(repeats);};Game_Action.prototype.checkItemScope = function(list){return list.contains(this.item().scope);};Game_Action.prototype.isForOpponent = function(){return this.checkItemScope([1,2,3,4,5,6]);};Game_Action.prototype.isForFriend = function(){return this.checkItemScope([7,8,9,10,11]);};Game_Action.prototype.isForDeadFriend = function(){return this.checkItemScope([9,10]);};Game_Action.prototype.isForUser = function(){return this.checkItemScope([11]);};Game_Action.prototype.isForOne = function(){return this.checkItemScope([1,3,7,9,11]);};Game_Action.prototype.isForRandom = function(){return this.checkItemScope([3,4,5,6]);};Game_Action.prototype.isForAll = function(){return this.checkItemScope([2,8,10]);};Game_Action.prototype.needsSelection = function(){return this.checkItemScope([1,7,9]);};Game_Action.prototype.numTargets = function(){return this.isForRandom()?this.item().scope - 2:0;};Game_Action.prototype.checkDamageType = function(list){return list.contains(this.item().damage.type);};Game_Action.prototype.isHpEffect = function(){return this.checkDamageType([1,3,5]);};Game_Action.prototype.isMpEffect = function(){return this.checkDamageType([2,4,6]);};Game_Action.prototype.isDamage = function(){return this.checkDamageType([1,2]);};Game_Action.prototype.isRecover = function(){return this.checkDamageType([3,4]);};Game_Action.prototype.isDrain = function(){return this.checkDamageType([5,6]);};Game_Action.prototype.isHpRecover = function(){return this.checkDamageType([3]);};Game_Action.prototype.isMpRecover = function(){return this.checkDamageType([4]);};Game_Action.prototype.isCertainHit = function(){return this.item().hitType === Game_Action.HITTYPE_CERTAIN;};Game_Action.prototype.isPhysical = function(){return this.item().hitType === Game_Action.HITTYPE_PHYSICAL;};Game_Action.prototype.isMagical = function(){return this.item().hitType === Game_Action.HITTYPE_MAGICAL;};Game_Action.prototype.isAttack = function(){return this.item() === $dataSkills[this.subject().attackSkillId()];};Game_Action.prototype.isGuard = function(){return this.item() === $dataSkills[this.subject().guardSkillId()];};Game_Action.prototype.isMagicSkill = function(){if(this.isSkill()){return $dataSystem.magicSkills.contains(this.item().stypeId);}else {return false;}};Game_Action.prototype.decideRandomTarget = function(){var target;if(this.isForDeadFriend()){target = this.friendsUnit().randomDeadTarget();}else if(this.isForFriend()){target = this.friendsUnit().randomTarget();}else {target = this.opponentsUnit().randomTarget();}if(target){this._targetIndex = target.index;}else {this.clear();}};Game_Action.prototype.setConfusion = function(){this.setAttack();};Game_Action.prototype.prepare = function(){if(this.subject().isConfused() && !this._forcing){this.setConfusion();}};Game_Action.prototype.isValid = function(){return this._forcing && this.item() || this.subject().canUse(this.item());};Game_Action.prototype.speed = function(){var agi=this.subject().agi;var speed=agi + Math.randomInt(Math.floor(5 + agi / 4));if(this.item()){speed += this.item().speed;}if(this.isAttack()){speed += this.subject().attackSpeed();}return speed;};Game_Action.prototype.makeTargets = function(){var targets=[];if(!this._forcing && this.subject().isConfused()){targets = [this.confusionTarget()];}else if(this.isForOpponent()){targets = this.targetsForOpponents();}else if(this.isForFriend()){targets = this.targetsForFriends();}return this.repeatTargets(targets);};Game_Action.prototype.repeatTargets = function(targets){var repeatedTargets=[];var repeats=this.numRepeats();for(var i=0;i < targets.length;i++) {var target=targets[i];if(target){for(var j=0;j < repeats;j++) {repeatedTargets.push(target);}}}return repeatedTargets;};Game_Action.prototype.confusionTarget = function(){switch(this.subject().confusionLevel()){case 1:return this.opponentsUnit().randomTarget();case 2:if(Math.randomInt(2) === 0){return this.opponentsUnit().randomTarget();}return this.friendsUnit().randomTarget();default:return this.friendsUnit().randomTarget();}};Game_Action.prototype.targetsForOpponents = function(){var targets=[];var unit=this.opponentsUnit();if(this.isForRandom()){for(var i=0;i < this.numTargets();i++) {targets.push(unit.randomTarget());}}else if(this.isForOne()){if(this._targetIndex < 0){targets.push(unit.randomTarget());}else {targets.push(unit.smoothTarget(this._targetIndex));}}else {targets = unit.aliveMembers();}return targets;};Game_Action.prototype.targetsForFriends = function(){var targets=[];var unit=this.friendsUnit();if(this.isForUser()){return [this.subject()];}else if(this.isForDeadFriend()){if(this.isForOne()){targets.push(unit.smoothDeadTarget(this._targetIndex));}else {targets = unit.deadMembers();}}else if(this.isForOne()){if(this._targetIndex < 0){targets.push(unit.randomTarget());}else {targets.push(unit.smoothTarget(this._targetIndex));}}else {targets = unit.aliveMembers();}return targets;};Game_Action.prototype.evaluate = function(){var value=0;this.itemTargetCandidates().forEach(function(target){var targetValue=this.evaluateWithTarget(target);if(this.isForAll()){value += targetValue;}else if(targetValue > value){value = targetValue;this._targetIndex = target.index;}},this);value *= this.numRepeats();if(value > 0){value += Math.random();}return value;};Game_Action.prototype.itemTargetCandidates = function(){if(!this.isValid()){return [];}else if(this.isForOpponent()){return this.opponentsUnit().aliveMembers();}else if(this.isForUser()){return [this.subject()];}else if(this.isForDeadFriend()){return this.friendsUnit().deadMembers();}else {return this.friendsUnit().aliveMembers();}};Game_Action.prototype.evaluateWithTarget = function(target){if(this.isHpEffect()){var value=this.makeDamageValue(target,false);if(this.isForOpponent()){return value / Math.max(target.hp,1);}else {var recovery=Math.min(-value,target.mhp - target.hp);return recovery / target.mhp;}}};Game_Action.prototype.testApply = function(target){return this.isForDeadFriend() === target.isDead() && ($gameParty.inBattle() || this.isForOpponent() || this.isHpRecover() && target.hp < target.mhp || this.isMpRecover() && target.mp < target.mmp || this.hasItemAnyValidEffects(target));};Game_Action.prototype.hasItemAnyValidEffects = function(target){return this.item().effects.some(function(effect){return this.testItemEffect(target,effect);},this);};Game_Action.prototype.testItemEffect = function(target,effect){switch(effect.code){case Game_Action.EFFECT_RECOVER_HP:return target.hp < target.mhp || effect.value1 < 0 || effect.value2 < 0;case Game_Action.EFFECT_RECOVER_MP:return target.mp < target.mmp || effect.value1 < 0 || effect.value2 < 0;case Game_Action.EFFECT_ADD_STATE:return !target.isStateAffected(effect.dataId);case Game_Action.EFFECT_REMOVE_STATE:return target.isStateAffected(effect.dataId);case Game_Action.EFFECT_ADD_BUFF:return !target.isMaxBuffAffected(effect.dataId);case Game_Action.EFFECT_ADD_DEBUFF:return !target.isMaxDebuffAffected(effect.dataId);case Game_Action.EFFECT_REMOVE_BUFF:return target.isBuffAffected(effect.dataId);case Game_Action.EFFECT_REMOVE_DEBUFF:return target.isDebuffAffected(effect.dataId);case Game_Action.EFFECT_LEARN_SKILL:return target.isActor() && !target.isLearnedSkill(effect.dataId);default:return true;}};Game_Action.prototype.itemCnt = function(target){if(this.isPhysical() && target.canMove()){return target.cnt;}else {return 0;}};Game_Action.prototype.itemMrf = function(target){if(this.isMagical()){return target.mrf;}else {return 0;}};Game_Action.prototype.itemHit = function(target){if(this.isPhysical()){return this.item().successRate * 0.01 * this.subject().hit;}else {return this.item().successRate * 0.01;}};Game_Action.prototype.itemEva = function(target){if(this.isPhysical()){return target.eva;}else if(this.isMagical()){return target.mev;}else {return 0;}};Game_Action.prototype.itemCri = function(target){return this.item().damage.critical?this.subject().cri * (1 - target.cev):0;};Game_Action.prototype.apply = function(target){var result=target.result();this.subject().clearResult();result.clear();result.used = this.testApply(target);result.missed = result.used && Math.random() >= this.itemHit(target);result.evaded = !result.missed && Math.random() < this.itemEva(target);result.physical = this.isPhysical();result.drain = this.isDrain();if(result.isHit()){if(this.item().damage.type > 0){result.critical = Math.random() < this.itemCri(target);var value=this.makeDamageValue(target,result.critical);this.executeDamage(target,value);}this.item().effects.forEach(function(effect){this.applyItemEffect(target,effect);},this);this.applyItemUserEffect(target);}};Game_Action.prototype.makeDamageValue = function(target,critical){var item=this.item();var baseValue=this.evalDamageFormula(target);var value=baseValue * this.calcElementRate(target);if(this.isPhysical()){value *= target.pdr;}if(this.isMagical()){value *= target.mdr;}if(baseValue < 0){value *= target.rec;}if(critical){value = this.applyCritical(value);}value = this.applyVariance(value,item.damage.variance);value = this.applyGuard(value,target);value = Math.round(value);return value;};Game_Action.prototype.evalDamageFormula = function(target){try{var item=this.item();var a=this.subject();var b=target;var v=$gameVariables._data;var sign=[3,4].contains(item.damage.type)?-1:1;return Math.max(eval(item.damage.formula),0) * sign;}catch(e) {return 0;}};Game_Action.prototype.calcElementRate = function(target){if(this.item().damage.elementId < 0){return this.elementsMaxRate(target,this.subject().attackElements());}else {return target.elementRate(this.item().damage.elementId);}};Game_Action.prototype.elementsMaxRate = function(target,elements){if(elements.length > 0){return Math.max.apply(null,elements.map(function(elementId){return target.elementRate(elementId);},this));}else {return 1;}};Game_Action.prototype.applyCritical = function(damage){return damage * 3;};Game_Action.prototype.applyVariance = function(damage,variance){var amp=Math.floor(Math.max(Math.abs(damage) * variance / 100,0));var v=Math.randomInt(amp + 1) + Math.randomInt(amp + 1) - amp;return damage >= 0?damage + v:damage - v;};Game_Action.prototype.applyGuard = function(damage,target){return damage / (damage > 0 && target.isGuard()?2 * target.grd:1);};Game_Action.prototype.executeDamage = function(target,value){var result=target.result();if(value === 0){result.critical = false;}if(this.isHpEffect()){this.executeHpDamage(target,value);}if(this.isMpEffect()){this.executeMpDamage(target,value);}};Game_Action.prototype.executeHpDamage = function(target,value){if(this.isDrain()){value = Math.min(target.hp,value);}this.makeSuccess(target);target.gainHp(-value);if(value > 0){target.onDamage(value);}this.gainDrainedHp(value);};Game_Action.prototype.executeMpDamage = function(target,value){if(!this.isMpRecover()){value = Math.min(target.mp,value);}if(value !== 0){this.makeSuccess(target);}target.gainMp(-value);this.gainDrainedMp(value);};Game_Action.prototype.gainDrainedHp = function(value){if(this.isDrain()){this.subject().gainHp(value);}};Game_Action.prototype.gainDrainedMp = function(value){if(this.isDrain()){this.subject().gainMp(value);}};Game_Action.prototype.applyItemEffect = function(target,effect){switch(effect.code){case Game_Action.EFFECT_RECOVER_HP:this.itemEffectRecoverHp(target,effect);break;case Game_Action.EFFECT_RECOVER_MP:this.itemEffectRecoverMp(target,effect);break;case Game_Action.EFFECT_GAIN_TP:this.itemEffectGainTp(target,effect);break;case Game_Action.EFFECT_ADD_STATE:this.itemEffectAddState(target,effect);break;case Game_Action.EFFECT_REMOVE_STATE:this.itemEffectRemoveState(target,effect);break;case Game_Action.EFFECT_ADD_BUFF:this.itemEffectAddBuff(target,effect);break;case Game_Action.EFFECT_ADD_DEBUFF:this.itemEffectAddDebuff(target,effect);break;case Game_Action.EFFECT_REMOVE_BUFF:this.itemEffectRemoveBuff(target,effect);break;case Game_Action.EFFECT_REMOVE_DEBUFF:this.itemEffectRemoveDebuff(target,effect);break;case Game_Action.EFFECT_SPECIAL:this.itemEffectSpecial(target,effect);break;case Game_Action.EFFECT_GROW:this.itemEffectGrow(target,effect);break;case Game_Action.EFFECT_LEARN_SKILL:this.itemEffectLearnSkill(target,effect);break;case Game_Action.EFFECT_COMMON_EVENT:this.itemEffectCommonEvent(target,effect);break;}};Game_Action.prototype.itemEffectRecoverHp = function(target,effect){var value=(target.mhp * effect.value1 + effect.value2) * target.rec;if(this.isItem()){value *= this.subject().pha;}value = Math.floor(value);if(value !== 0){target.gainHp(value);this.makeSuccess(target);}};Game_Action.prototype.itemEffectRecoverMp = function(target,effect){var value=(target.mmp * effect.value1 + effect.value2) * target.rec;if(this.isItem()){value *= this.subject().pha;}value = Math.floor(value);if(value !== 0){target.gainMp(value);this.makeSuccess(target);}};Game_Action.prototype.itemEffectGainTp = function(target,effect){var value=Math.floor(effect.value1);if(value !== 0){target.gainTp(value);this.makeSuccess(target);}};Game_Action.prototype.itemEffectAddState = function(target,effect){if(effect.dataId === 0){this.itemEffectAddAttackState(target,effect);}else {this.itemEffectAddNormalState(target,effect);}};Game_Action.prototype.itemEffectAddAttackState = function(target,effect){this.subject().attackStates().forEach((function(stateId){var chance=effect.value1;chance *= target.stateRate(stateId);chance *= this.subject().attackStatesRate(stateId);chance *= this.lukEffectRate(target);if(Math.random() < chance){target.addState(stateId);this.makeSuccess(target);}}).bind(this),target);};Game_Action.prototype.itemEffectAddNormalState = function(target,effect){var chance=effect.value1;if(!this.isCertainHit()){chance *= target.stateRate(effect.dataId);chance *= this.lukEffectRate(target);}if(Math.random() < chance){target.addState(effect.dataId);this.makeSuccess(target);}};Game_Action.prototype.itemEffectRemoveState = function(target,effect){var chance=effect.value1;if(Math.random() < chance){target.removeState(effect.dataId);this.makeSuccess(target);}};Game_Action.prototype.itemEffectAddBuff = function(target,effect){target.addBuff(effect.dataId,effect.value1);this.makeSuccess(target);};Game_Action.prototype.itemEffectAddDebuff = function(target,effect){var chance=target.debuffRate(effect.dataId) * this.lukEffectRate(target);if(Math.random() < chance){target.addDebuff(effect.dataId,effect.value1);this.makeSuccess(target);}};Game_Action.prototype.itemEffectRemoveBuff = function(target,effect){if(target.isBuffAffected(effect.dataId)){target.removeBuff(effect.dataId);this.makeSuccess(target);}};Game_Action.prototype.itemEffectRemoveDebuff = function(target,effect){if(target.isDebuffAffected(effect.dataId)){target.removeBuff(effect.dataId);this.makeSuccess(target);}};Game_Action.prototype.itemEffectSpecial = function(target,effect){if(effect.dataId === Game_Action.SPECIAL_EFFECT_ESCAPE){target.escape();this.makeSuccess(target);}};Game_Action.prototype.itemEffectGrow = function(target,effect){target.addParam(effect.dataId,Math.floor(effect.value1));this.makeSuccess(target);};Game_Action.prototype.itemEffectLearnSkill = function(target,effect){if(target.isActor()){target.learnSkill(effect.dataId);this.makeSuccess(target);}};Game_Action.prototype.itemEffectCommonEvent = function(target,effect){};Game_Action.prototype.makeSuccess = function(target){target.result().success = true;};Game_Action.prototype.applyItemUserEffect = function(target){var value=Math.floor(this.item().tpGain * this.subject().tcr);this.subject().gainSilentTp(value);};Game_Action.prototype.lukEffectRate = function(target){return Math.max(1.0 + (this.subject().luk - target.luk) * 0.001,0.0);};Game_Action.prototype.applyGlobal = function(){this.item().effects.forEach(function(effect){if(effect.code === Game_Action.EFFECT_COMMON_EVENT){$gameTemp.reserveCommonEvent(effect.dataId);}},this);}; //-----------------------------------------------------------------------------
// Game_ActionResult
//
// The game object class for a result of a battle action. For convinience, all
// member variables in this class are public.
function Game_ActionResult(){this.initialize.apply(this,arguments);}Game_ActionResult.prototype.initialize = function(){this.clear();};Game_ActionResult.prototype.clear = function(){this.used = false;this.missed = false;this.evaded = false;this.physical = false;this.drain = false;this.critical = false;this.success = false;this.hpAffected = false;this.hpDamage = 0;this.mpDamage = 0;this.tpDamage = 0;this.addedStates = [];this.removedStates = [];this.addedBuffs = [];this.addedDebuffs = [];this.removedBuffs = [];};Game_ActionResult.prototype.addedStateObjects = function(){return this.addedStates.map(function(id){return $dataStates[id];});};Game_ActionResult.prototype.removedStateObjects = function(){return this.removedStates.map(function(id){return $dataStates[id];});};Game_ActionResult.prototype.isStatusAffected = function(){return this.addedStates.length > 0 || this.removedStates.length > 0 || this.addedBuffs.length > 0 || this.addedDebuffs.length > 0 || this.removedBuffs.length > 0;};Game_ActionResult.prototype.isHit = function(){return this.used && !this.missed && !this.evaded;};Game_ActionResult.prototype.isStateAdded = function(stateId){return this.addedStates.contains(stateId);};Game_ActionResult.prototype.pushAddedState = function(stateId){if(!this.isStateAdded(stateId)){this.addedStates.push(stateId);}};Game_ActionResult.prototype.isStateRemoved = function(stateId){return this.removedStates.contains(stateId);};Game_ActionResult.prototype.pushRemovedState = function(stateId){if(!this.isStateRemoved(stateId)){this.removedStates.push(stateId);}};Game_ActionResult.prototype.isBuffAdded = function(paramId){return this.addedBuffs.contains(paramId);};Game_ActionResult.prototype.pushAddedBuff = function(paramId){if(!this.isBuffAdded(paramId)){this.addedBuffs.push(paramId);}};Game_ActionResult.prototype.isDebuffAdded = function(paramId){return this.addedDebuffs.contains(paramId);};Game_ActionResult.prototype.pushAddedDebuff = function(paramId){if(!this.isDebuffAdded(paramId)){this.addedDebuffs.push(paramId);}};Game_ActionResult.prototype.isBuffRemoved = function(paramId){return this.removedBuffs.contains(paramId);};Game_ActionResult.prototype.pushRemovedBuff = function(paramId){if(!this.isBuffRemoved(paramId)){this.removedBuffs.push(paramId);}}; //-----------------------------------------------------------------------------
// Game_BattlerBase
//
// The superclass of Game_Battler. It mainly contains parameters calculation.
function Game_BattlerBase(){this.initialize.apply(this,arguments);}Game_BattlerBase.TRAIT_ELEMENT_RATE = 11;Game_BattlerBase.TRAIT_DEBUFF_RATE = 12;Game_BattlerBase.TRAIT_STATE_RATE = 13;Game_BattlerBase.TRAIT_STATE_RESIST = 14;Game_BattlerBase.TRAIT_PARAM = 21;Game_BattlerBase.TRAIT_XPARAM = 22;Game_BattlerBase.TRAIT_SPARAM = 23;Game_BattlerBase.TRAIT_ATTACK_ELEMENT = 31;Game_BattlerBase.TRAIT_ATTACK_STATE = 32;Game_BattlerBase.TRAIT_ATTACK_SPEED = 33;Game_BattlerBase.TRAIT_ATTACK_TIMES = 34;Game_BattlerBase.TRAIT_STYPE_ADD = 41;Game_BattlerBase.TRAIT_STYPE_SEAL = 42;Game_BattlerBase.TRAIT_SKILL_ADD = 43;Game_BattlerBase.TRAIT_SKILL_SEAL = 44;Game_BattlerBase.TRAIT_EQUIP_WTYPE = 51;Game_BattlerBase.TRAIT_EQUIP_ATYPE = 52;Game_BattlerBase.TRAIT_EQUIP_LOCK = 53;Game_BattlerBase.TRAIT_EQUIP_SEAL = 54;Game_BattlerBase.TRAIT_SLOT_TYPE = 55;Game_BattlerBase.TRAIT_ACTION_PLUS = 61;Game_BattlerBase.TRAIT_SPECIAL_FLAG = 62;Game_BattlerBase.TRAIT_COLLAPSE_TYPE = 63;Game_BattlerBase.TRAIT_PARTY_ABILITY = 64;Game_BattlerBase.FLAG_ID_AUTO_BATTLE = 0;Game_BattlerBase.FLAG_ID_GUARD = 1;Game_BattlerBase.FLAG_ID_SUBSTITUTE = 2;Game_BattlerBase.FLAG_ID_PRESERVE_TP = 3;Game_BattlerBase.ICON_BUFF_START = 32;Game_BattlerBase.ICON_DEBUFF_START = 48;Object.defineProperties(Game_BattlerBase.prototype,{ // Hit Points
hp:{get:function get(){return this._hp;},configurable:true}, // Magic Points
mp:{get:function get(){return this._mp;},configurable:true}, // Tactical Points
tp:{get:function get(){return this._tp;},configurable:true}, // Maximum Hit Points
mhp:{get:function get(){return this.param(0);},configurable:true}, // Maximum Magic Points
mmp:{get:function get(){return this.param(1);},configurable:true}, // ATtacK power
atk:{get:function get(){return this.param(2);},configurable:true}, // DEFense power
def:{get:function get(){return this.param(3);},configurable:true}, // Magic ATtack power
mat:{get:function get(){return this.param(4);},configurable:true}, // Magic DeFense power
mdf:{get:function get(){return this.param(5);},configurable:true}, // AGIlity
agi:{get:function get(){return this.param(6);},configurable:true}, // LUcK
luk:{get:function get(){return this.param(7);},configurable:true}, // HIT rate
hit:{get:function get(){return this.xparam(0);},configurable:true}, // EVAsion rate
eva:{get:function get(){return this.xparam(1);},configurable:true}, // CRItical rate
cri:{get:function get(){return this.xparam(2);},configurable:true}, // Critical EVasion rate
cev:{get:function get(){return this.xparam(3);},configurable:true}, // Magic EVasion rate
mev:{get:function get(){return this.xparam(4);},configurable:true}, // Magic ReFlection rate
mrf:{get:function get(){return this.xparam(5);},configurable:true}, // CouNTer attack rate
cnt:{get:function get(){return this.xparam(6);},configurable:true}, // Hp ReGeneration rate
hrg:{get:function get(){return this.xparam(7);},configurable:true}, // Mp ReGeneration rate
mrg:{get:function get(){return this.xparam(8);},configurable:true}, // Tp ReGeneration rate
trg:{get:function get(){return this.xparam(9);},configurable:true}, // TarGet Rate
tgr:{get:function get(){return this.sparam(0);},configurable:true}, // GuaRD effect rate
grd:{get:function get(){return this.sparam(1);},configurable:true}, // RECovery effect rate
rec:{get:function get(){return this.sparam(2);},configurable:true}, // PHArmacology
pha:{get:function get(){return this.sparam(3);},configurable:true}, // Mp Cost Rate
mcr:{get:function get(){return this.sparam(4);},configurable:true}, // Tp Charge Rate
tcr:{get:function get(){return this.sparam(5);},configurable:true}, // Physical Damage Rate
pdr:{get:function get(){return this.sparam(6);},configurable:true}, // Magical Damage Rate
mdr:{get:function get(){return this.sparam(7);},configurable:true}, // Floor Damage Rate
fdr:{get:function get(){return this.sparam(8);},configurable:true}, // EXperience Rate
exr:{get:function get(){return this.sparam(9);},configurable:true}});Game_BattlerBase.prototype.initialize = function(){this.initMembers();};Game_BattlerBase.prototype.initMembers = function(){this._hp = 1;this._mp = 0;this._tp = 0;this._hidden = false;this.clearParamPlus();this.clearStates();this.clearBuffs();};Game_BattlerBase.prototype.clearParamPlus = function(){this._paramPlus = [0,0,0,0,0,0,0,0];};Game_BattlerBase.prototype.clearStates = function(){this._states = [];this._stateTurns = {};};Game_BattlerBase.prototype.eraseState = function(stateId){var index=this._states.indexOf(stateId);if(index >= 0){this._states.splice(index,1);}delete this._stateTurns[stateId];};Game_BattlerBase.prototype.isStateAffected = function(stateId){return this._states.contains(stateId);};Game_BattlerBase.prototype.isDeathStateAffected = function(){return this.isStateAffected(this.deathStateId());};Game_BattlerBase.prototype.deathStateId = function(){return 1;};Game_BattlerBase.prototype.resetStateCounts = function(stateId){var state=$dataStates[stateId];var variance=1 + Math.max(state.maxTurns - state.minTurns,0);this._stateTurns[stateId] = state.minTurns + Math.randomInt(variance);};Game_BattlerBase.prototype.isStateExpired = function(stateId){return this._stateTurns[stateId] === 0;};Game_BattlerBase.prototype.updateStateTurns = function(){this._states.forEach(function(stateId){if(this._stateTurns[stateId] > 0){this._stateTurns[stateId]--;}},this);};Game_BattlerBase.prototype.clearBuffs = function(){this._buffs = [0,0,0,0,0,0,0,0];this._buffTurns = [0,0,0,0,0,0,0,0];};Game_BattlerBase.prototype.eraseBuff = function(paramId){this._buffs[paramId] = 0;this._buffTurns[paramId] = 0;};Game_BattlerBase.prototype.buffLength = function(){return this._buffs.length;};Game_BattlerBase.prototype.buff = function(paramId){return this._buffs[paramId];};Game_BattlerBase.prototype.isBuffAffected = function(paramId){return this._buffs[paramId] > 0;};Game_BattlerBase.prototype.isDebuffAffected = function(paramId){return this._buffs[paramId] < 0;};Game_BattlerBase.prototype.isBuffOrDebuffAffected = function(paramId){return this._buffs[paramId] !== 0;};Game_BattlerBase.prototype.isMaxBuffAffected = function(paramId){return this._buffs[paramId] === 2;};Game_BattlerBase.prototype.isMaxDebuffAffected = function(paramId){return this._buffs[paramId] === -2;};Game_BattlerBase.prototype.increaseBuff = function(paramId){if(!this.isMaxBuffAffected(paramId)){this._buffs[paramId]++;}};Game_BattlerBase.prototype.decreaseBuff = function(paramId){if(!this.isMaxDebuffAffected(paramId)){this._buffs[paramId]--;}};Game_BattlerBase.prototype.overwriteBuffTurns = function(paramId,turns){if(this._buffTurns[paramId] < turns){this._buffTurns[paramId] = turns;}};Game_BattlerBase.prototype.isBuffExpired = function(paramId){return this._buffTurns[paramId] === 0;};Game_BattlerBase.prototype.updateBuffTurns = function(){for(var i=0;i < this._buffTurns.length;i++) {if(this._buffTurns[i] > 0){this._buffTurns[i]--;}}};Game_BattlerBase.prototype.die = function(){this._hp = 0;this.clearStates();this.clearBuffs();};Game_BattlerBase.prototype.revive = function(){if(this._hp === 0){this._hp = 1;}};Game_BattlerBase.prototype.states = function(){return this._states.map(function(id){return $dataStates[id];});};Game_BattlerBase.prototype.stateIcons = function(){return this.states().map(function(state){return state.iconIndex;}).filter(function(iconIndex){return iconIndex > 0;});};Game_BattlerBase.prototype.buffIcons = function(){var icons=[];for(var i=0;i < this._buffs.length;i++) {if(this._buffs[i] !== 0){icons.push(this.buffIconIndex(this._buffs[i],i));}}return icons;};Game_BattlerBase.prototype.buffIconIndex = function(buffLevel,paramId){if(buffLevel > 0){return Game_BattlerBase.ICON_BUFF_START + (buffLevel - 1) * 8 + paramId;}else if(buffLevel < 0){return Game_BattlerBase.ICON_DEBUFF_START + (-buffLevel - 1) * 8 + paramId;}else {return 0;}};Game_BattlerBase.prototype.allIcons = function(){return this.stateIcons().concat(this.buffIcons());};Game_BattlerBase.prototype.traitObjects = function(){ // Returns an array of the all objects having traits. States only here.
return this.states();};Game_BattlerBase.prototype.allTraits = function(){return this.traitObjects().reduce(function(r,obj){return r.concat(obj.traits);},[]);};Game_BattlerBase.prototype.traits = function(code){return this.allTraits().filter(function(trait){return trait.code === code;});};Game_BattlerBase.prototype.traitsWithId = function(code,id){return this.allTraits().filter(function(trait){return trait.code === code && trait.dataId === id;});};Game_BattlerBase.prototype.traitsPi = function(code,id){return this.traitsWithId(code,id).reduce(function(r,trait){return r * trait.value;},1);};Game_BattlerBase.prototype.traitsSum = function(code,id){return this.traitsWithId(code,id).reduce(function(r,trait){return r + trait.value;},0);};Game_BattlerBase.prototype.traitsSumAll = function(code){return this.traits(code).reduce(function(r,trait){return r + trait.value;},0);};Game_BattlerBase.prototype.traitsSet = function(code){return this.traits(code).reduce(function(r,trait){return r.concat(trait.dataId);},[]);};Game_BattlerBase.prototype.paramBase = function(paramId){return 0;};Game_BattlerBase.prototype.paramPlus = function(paramId){return this._paramPlus[paramId];};Game_BattlerBase.prototype.paramMin = function(paramId){if(paramId === 1){return 0; // MMP
}else {return 1;}};Game_BattlerBase.prototype.paramMax = function(paramId){if(paramId === 0){return 999999; // MHP
}else if(paramId === 1){return 9999; // MMP
}else {return 999;}};Game_BattlerBase.prototype.paramRate = function(paramId){return this.traitsPi(Game_BattlerBase.TRAIT_PARAM,paramId);};Game_BattlerBase.prototype.paramBuffRate = function(paramId){return this._buffs[paramId] * 0.25 + 1.0;};Game_BattlerBase.prototype.param = function(paramId){var value=this.paramBase(paramId) + this.paramPlus(paramId);value *= this.paramRate(paramId) * this.paramBuffRate(paramId);var maxValue=this.paramMax(paramId);var minValue=this.paramMin(paramId);return Math.round(value.clamp(minValue,maxValue));};Game_BattlerBase.prototype.xparam = function(xparamId){return this.traitsSum(Game_BattlerBase.TRAIT_XPARAM,xparamId);};Game_BattlerBase.prototype.sparam = function(sparamId){return this.traitsPi(Game_BattlerBase.TRAIT_SPARAM,sparamId);};Game_BattlerBase.prototype.elementRate = function(elementId){return this.traitsPi(Game_BattlerBase.TRAIT_ELEMENT_RATE,elementId);};Game_BattlerBase.prototype.debuffRate = function(paramId){return this.traitsPi(Game_BattlerBase.TRAIT_DEBUFF_RATE,paramId);};Game_BattlerBase.prototype.stateRate = function(stateId){return this.traitsPi(Game_BattlerBase.TRAIT_STATE_RATE,stateId);};Game_BattlerBase.prototype.stateResistSet = function(){return this.traitsSet(Game_BattlerBase.TRAIT_STATE_RESIST);};Game_BattlerBase.prototype.isStateResist = function(stateId){return this.stateResistSet().contains(stateId);};Game_BattlerBase.prototype.attackElements = function(){return this.traitsSet(Game_BattlerBase.TRAIT_ATTACK_ELEMENT);};Game_BattlerBase.prototype.attackStates = function(){return this.traitsSet(Game_BattlerBase.TRAIT_ATTACK_STATE);};Game_BattlerBase.prototype.attackStatesRate = function(stateId){return this.traitsSum(Game_BattlerBase.TRAIT_ATTACK_STATE,stateId);};Game_BattlerBase.prototype.attackSpeed = function(){return this.traitsSumAll(Game_BattlerBase.TRAIT_ATTACK_SPEED);};Game_BattlerBase.prototype.attackTimesAdd = function(){return Math.max(this.traitsSumAll(Game_BattlerBase.TRAIT_ATTACK_TIMES),0);};Game_BattlerBase.prototype.addedSkillTypes = function(){return this.traitsSet(Game_BattlerBase.TRAIT_STYPE_ADD);};Game_BattlerBase.prototype.isSkillTypeSealed = function(stypeId){return this.traitsSet(Game_BattlerBase.TRAIT_STYPE_SEAL).contains(stypeId);};Game_BattlerBase.prototype.addedSkills = function(){return this.traitsSet(Game_BattlerBase.TRAIT_SKILL_ADD);};Game_BattlerBase.prototype.isSkillSealed = function(skillId){return this.traitsSet(Game_BattlerBase.TRAIT_SKILL_SEAL).contains(skillId);};Game_BattlerBase.prototype.isEquipWtypeOk = function(wtypeId){return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_WTYPE).contains(wtypeId);};Game_BattlerBase.prototype.isEquipAtypeOk = function(atypeId){return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_ATYPE).contains(atypeId);};Game_BattlerBase.prototype.isEquipTypeLocked = function(etypeId){return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_LOCK).contains(etypeId);};Game_BattlerBase.prototype.isEquipTypeSealed = function(etypeId){return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_SEAL).contains(etypeId);};Game_BattlerBase.prototype.slotType = function(){var set=this.traitsSet(Game_BattlerBase.TRAIT_SLOT_TYPE);return set.length > 0?Math.max.apply(null,set):0;};Game_BattlerBase.prototype.isDualWield = function(){return this.slotType() === 1;};Game_BattlerBase.prototype.actionPlusSet = function(){return this.traits(Game_BattlerBase.TRAIT_ACTION_PLUS).map(function(trait){return trait.value;});};Game_BattlerBase.prototype.specialFlag = function(flagId){return this.traits(Game_BattlerBase.TRAIT_SPECIAL_FLAG).some(function(trait){return trait.dataId === flagId;});};Game_BattlerBase.prototype.collapseType = function(){var set=this.traitsSet(Game_BattlerBase.TRAIT_COLLAPSE_TYPE);return set.length > 0?Math.max.apply(null,set):0;};Game_BattlerBase.prototype.partyAbility = function(abilityId){return this.traits(Game_BattlerBase.TRAIT_PARTY_ABILITY).some(function(trait){return trait.dataId === abilityId;});};Game_BattlerBase.prototype.isAutoBattle = function(){return this.specialFlag(Game_BattlerBase.FLAG_ID_AUTO_BATTLE);};Game_BattlerBase.prototype.isGuard = function(){return this.specialFlag(Game_BattlerBase.FLAG_ID_GUARD) && this.canMove();};Game_BattlerBase.prototype.isSubstitute = function(){return this.specialFlag(Game_BattlerBase.FLAG_ID_SUBSTITUTE) && this.canMove();};Game_BattlerBase.prototype.isPreserveTp = function(){return this.specialFlag(Game_BattlerBase.FLAG_ID_PRESERVE_TP);};Game_BattlerBase.prototype.addParam = function(paramId,value){this._paramPlus[paramId] += value;this.refresh();};Game_BattlerBase.prototype.setHp = function(hp){this._hp = hp;this.refresh();};Game_BattlerBase.prototype.setMp = function(mp){this._mp = mp;this.refresh();};Game_BattlerBase.prototype.setTp = function(tp){this._tp = tp;this.refresh();};Game_BattlerBase.prototype.maxTp = function(){return 100;};Game_BattlerBase.prototype.refresh = function(){this.stateResistSet().forEach(function(stateId){this.eraseState(stateId);},this);this._hp = this._hp.clamp(0,this.mhp);this._mp = this._mp.clamp(0,this.mmp);this._tp = this._tp.clamp(0,this.maxTp());};Game_BattlerBase.prototype.recoverAll = function(){this.clearStates();this._hp = this.mhp;this._mp = this.mmp;};Game_BattlerBase.prototype.hpRate = function(){return this.hp / this.mhp;};Game_BattlerBase.prototype.mpRate = function(){return this.mmp > 0?this.mp / this.mmp:0;};Game_BattlerBase.prototype.tpRate = function(){return this.tp / 100;};Game_BattlerBase.prototype.hide = function(){this._hidden = true;};Game_BattlerBase.prototype.appear = function(){this._hidden = false;};Game_BattlerBase.prototype.isHidden = function(){return this._hidden;};Game_BattlerBase.prototype.isAppeared = function(){return !this.isHidden();};Game_BattlerBase.prototype.isDead = function(){return this.isAppeared() && this.isDeathStateAffected();};Game_BattlerBase.prototype.isAlive = function(){return this.isAppeared() && !this.isDeathStateAffected();};Game_BattlerBase.prototype.isDying = function(){return this.isAlive() && this._hp < this.mhp / 4;};Game_BattlerBase.prototype.isRestricted = function(){return this.isAppeared() && this.restriction() > 0;};Game_BattlerBase.prototype.canInput = function(){return this.isAppeared() && !this.isRestricted() && !this.isAutoBattle();};Game_BattlerBase.prototype.canMove = function(){return this.isAppeared() && this.restriction() < 4;};Game_BattlerBase.prototype.isConfused = function(){return this.isAppeared() && this.restriction() >= 1 && this.restriction() <= 3;};Game_BattlerBase.prototype.confusionLevel = function(){return this.isConfused()?this.restriction():0;};Game_BattlerBase.prototype.isActor = function(){return false;};Game_BattlerBase.prototype.isEnemy = function(){return false;};Game_BattlerBase.prototype.sortStates = function(){this._states.sort(function(a,b){var p1=$dataStates[a].priority;var p2=$dataStates[b].priority;if(p1 !== p2){return p2 - p1;}return a - b;});};Game_BattlerBase.prototype.restriction = function(){return Math.max.apply(null,this.states().map(function(state){return state.restriction;}).concat(0));};Game_BattlerBase.prototype.addNewState = function(stateId){if(stateId === this.deathStateId()){this.die();}var restricted=this.isRestricted();this._states.push(stateId);this.sortStates();if(!restricted && this.isRestricted()){this.onRestrict();}};Game_BattlerBase.prototype.onRestrict = function(){};Game_BattlerBase.prototype.mostImportantStateText = function(){var states=this.states();for(var i=0;i < states.length;i++) {if(states[i].message3){return states[i].message3;}}return '';};Game_BattlerBase.prototype.stateMotionIndex = function(){var states=this.states();if(states.length > 0){return states[0].motion;}else {return 0;}};Game_BattlerBase.prototype.stateOverlayIndex = function(){var states=this.states();if(states.length > 0){return states[0].overlay;}else {return 0;}};Game_BattlerBase.prototype.isSkillWtypeOk = function(skill){return true;};Game_BattlerBase.prototype.skillMpCost = function(skill){return Math.floor(skill.mpCost * this.mcr);};Game_BattlerBase.prototype.skillTpCost = function(skill){return skill.tpCost;};Game_BattlerBase.prototype.canPaySkillCost = function(skill){return this._tp >= this.skillTpCost(skill) && this._mp >= this.skillMpCost(skill);};Game_BattlerBase.prototype.paySkillCost = function(skill){this._mp -= this.skillMpCost(skill);this._tp -= this.skillTpCost(skill);};Game_BattlerBase.prototype.isOccasionOk = function(item){if($gameParty.inBattle()){return item.occasion === 0 || item.occasion === 1;}else {return item.occasion === 0 || item.occasion === 2;}};Game_BattlerBase.prototype.meetsUsableItemConditions = function(item){return this.canMove() && this.isOccasionOk(item);};Game_BattlerBase.prototype.meetsSkillConditions = function(skill){return this.meetsUsableItemConditions(skill) && this.isSkillWtypeOk(skill) && this.canPaySkillCost(skill) && !this.isSkillSealed(skill.id) && !this.isSkillTypeSealed(skill.stypeId);};Game_BattlerBase.prototype.meetsItemConditions = function(item){return this.meetsUsableItemConditions(item) && $gameParty.hasItem(item);};Game_BattlerBase.prototype.canUse = function(item){if(!item){return false;}else if(_managers.DataManager.isSkill(item)){return this.meetsSkillConditions(item);}else if(_managers.DataManager.isItem(item)){return this.meetsItemConditions(item);}else {return false;}};Game_BattlerBase.prototype.canEquip = function(item){if(!item){return false;}else if(_managers.DataManager.isWeapon(item)){return this.canEquipWeapon(item);}else if(_managers.DataManager.isArmor(item)){return this.canEquipArmor(item);}else {return false;}};Game_BattlerBase.prototype.canEquipWeapon = function(item){return this.isEquipWtypeOk(item.wtypeId) && !this.isEquipTypeSealed(item.etypeId);};Game_BattlerBase.prototype.canEquipArmor = function(item){return this.isEquipAtypeOk(item.atypeId) && !this.isEquipTypeSealed(item.etypeId);};Game_BattlerBase.prototype.attackSkillId = function(){return 1;};Game_BattlerBase.prototype.guardSkillId = function(){return 2;};Game_BattlerBase.prototype.canAttack = function(){return this.canUse($dataSkills[this.attackSkillId()]);};Game_BattlerBase.prototype.canGuard = function(){return this.canUse($dataSkills[this.guardSkillId()]);}; //-----------------------------------------------------------------------------
// Game_Battler
//
// The superclass of Game_Actor and Game_Enemy. It contains methods for sprites
// and actions.
function Game_Battler(){this.initialize.apply(this,arguments);}Game_Battler.prototype = Object.create(Game_BattlerBase.prototype);Game_Battler.prototype.constructor = Game_Battler;Game_Battler.prototype.initialize = function(){Game_BattlerBase.prototype.initialize.call(this);};Game_Battler.prototype.initMembers = function(){Game_BattlerBase.prototype.initMembers.call(this);this._actions = [];this._speed = 0;this._result = new Game_ActionResult();this._actionState = '';this._lastTargetIndex = 0;this._animations = [];this._damagePopup = false;this._effectType = null;this._motionType = null;this._weaponImageId = 0;this._motionRefresh = false;this._selected = false;};Game_Battler.prototype.clearAnimations = function(){this._animations = [];};Game_Battler.prototype.clearDamagePopup = function(){this._damagePopup = false;};Game_Battler.prototype.clearWeaponAnimation = function(){this._weaponImageId = 0;};Game_Battler.prototype.clearEffect = function(){this._effectType = null;};Game_Battler.prototype.clearMotion = function(){this._motionType = null;this._motionRefresh = false;};Game_Battler.prototype.requestEffect = function(effectType){this._effectType = effectType;};Game_Battler.prototype.requestMotion = function(motionType){this._motionType = motionType;};Game_Battler.prototype.requestMotionRefresh = function(){this._motionRefresh = true;};Game_Battler.prototype.select = function(){this._selected = true;};Game_Battler.prototype.deselect = function(){this._selected = false;};Game_Battler.prototype.isAnimationRequested = function(){return this._animations.length > 0;};Game_Battler.prototype.isDamagePopupRequested = function(){return this._damagePopup;};Game_Battler.prototype.isEffectRequested = function(){return !!this._effectType;};Game_Battler.prototype.isMotionRequested = function(){return !!this._motionType;};Game_Battler.prototype.isWeaponAnimationRequested = function(){return this._weaponImageId > 0;};Game_Battler.prototype.isMotionRefreshRequested = function(){return this._motionRefresh;};Game_Battler.prototype.isSelected = function(){return this._selected;};Game_Battler.prototype.effectType = function(){return this._effectType;};Game_Battler.prototype.motionType = function(){return this._motionType;};Game_Battler.prototype.weaponImageId = function(){return this._weaponImageId;};Game_Battler.prototype.shiftAnimation = function(){return this._animations.shift();};Game_Battler.prototype.startAnimation = function(animationId,mirror,delay){var data={animationId:animationId,mirror:mirror,delay:delay};this._animations.push(data);};Game_Battler.prototype.startDamagePopup = function(){this._damagePopup = true;};Game_Battler.prototype.startWeaponAnimation = function(weaponImageId){this._weaponImageId = weaponImageId;};Game_Battler.prototype.action = function(index){return this._actions[index];};Game_Battler.prototype.setAction = function(index,action){this._actions[index] = action;};Game_Battler.prototype.numActions = function(){return this._actions.length;};Game_Battler.prototype.clearActions = function(){this._actions = [];};Game_Battler.prototype.result = function(){return this._result;};Game_Battler.prototype.clearResult = function(){this._result.clear();};Game_Battler.prototype.refresh = function(){Game_BattlerBase.prototype.refresh.call(this);if(this.hp === 0){this.addState(this.deathStateId());}else {this.removeState(this.deathStateId());}};Game_Battler.prototype.addState = function(stateId){if(this.isStateAddable(stateId)){if(!this.isStateAffected(stateId)){this.addNewState(stateId);this.refresh();}this.resetStateCounts(stateId);this._result.pushAddedState(stateId);}};Game_Battler.prototype.isStateAddable = function(stateId){return this.isAlive() && $dataStates[stateId] && !this.isStateResist(stateId) && !this._result.isStateRemoved(stateId) && !this.isStateRestrict(stateId);};Game_Battler.prototype.isStateRestrict = function(stateId){return $dataStates[stateId].removeByRestriction && this.isRestricted();};Game_Battler.prototype.onRestrict = function(){Game_BattlerBase.prototype.onRestrict.call(this);this.clearActions();this.states().forEach(function(state){if(state.removeByRestriction){this.removeState(state.id);}},this);};Game_Battler.prototype.removeState = function(stateId){if(this.isStateAffected(stateId)){if(stateId === this.deathStateId()){this.revive();}this.eraseState(stateId);this.refresh();this._result.pushRemovedState(stateId);}};Game_Battler.prototype.escape = function(){if($gameParty.inBattle()){this.hide();}this.clearActions();this.clearStates();SoundManager.playEscape();};Game_Battler.prototype.addBuff = function(paramId,turns){if(this.isAlive()){this.increaseBuff(paramId);if(this.isBuffAffected(paramId)){this.overwriteBuffTurns(paramId,turns);}this._result.pushAddedBuff(paramId);this.refresh();}};Game_Battler.prototype.addDebuff = function(paramId,turns){if(this.isAlive()){this.decreaseBuff(paramId);if(this.isDebuffAffected(paramId)){this.overwriteBuffTurns(paramId,turns);}this._result.pushAddedDebuff(paramId);this.refresh();}};Game_Battler.prototype.removeBuff = function(paramId){if(this.isAlive() && this.isBuffOrDebuffAffected(paramId)){this.eraseBuff(paramId);this._result.pushRemovedBuff(paramId);this.refresh();}};Game_Battler.prototype.removeBattleStates = function(){this.states().forEach(function(state){if(state.removeAtBattleEnd){this.removeState(state.id);}},this);};Game_Battler.prototype.removeAllBuffs = function(){for(var i=0;i < this.buffLength();i++) {this.removeBuff(i);}};Game_Battler.prototype.removeStatesAuto = function(timing){this.states().forEach(function(state){if(this.isStateExpired(state.id) && state.autoRemovalTiming === timing){this.removeState(state.id);}},this);};Game_Battler.prototype.removeBuffsAuto = function(){for(var i=0;i < this.buffLength();i++) {if(this.isBuffExpired(i)){this.removeBuff(i);}}};Game_Battler.prototype.removeStatesByDamage = function(){this.states().forEach(function(state){if(state.removeByDamage && Math.randomInt(100) < state.chanceByDamage){this.removeState(state.id);}},this);};Game_Battler.prototype.makeActionTimes = function(){return this.actionPlusSet().reduce(function(r,p){return Math.random() < p?r + 1:r;},1);};Game_Battler.prototype.makeActions = function(){this.clearActions();if(this.canMove()){var actionTimes=this.makeActionTimes();this._actions = [];for(var i=0;i < actionTimes;i++) {this._actions.push(new Game_Action(this));}}};Game_Battler.prototype.speed = function(){return this._speed;};Game_Battler.prototype.makeSpeed = function(){this._speed = Math.min.apply(null,this._actions.map(function(action){return action.speed();})) || 0;};Game_Battler.prototype.currentAction = function(){return this._actions[0];};Game_Battler.prototype.removeCurrentAction = function(){this._actions.shift();};Game_Battler.prototype.setLastTarget = function(target){if(target){this._lastTargetIndex = target.index();}else {this._lastTargetIndex = 0;}};Game_Battler.prototype.forceAction = function(skillId,targetIndex){this.clearActions();var action=new Game_Action(this,true);action.setSkill(skillId);if(targetIndex === -2){action.setTarget(this._lastTargetIndex);}else if(targetIndex === -1){action.decideRandomTarget();}else {action.setTarget(targetIndex);}this._actions.push(action);};Game_Battler.prototype.useItem = function(item){if(_managers.DataManager.isSkill(item)){this.paySkillCost(item);}else if(_managers.DataManager.isItem(item)){this.consumeItem(item);}};Game_Battler.prototype.consumeItem = function(item){$gameParty.consumeItem(item);};Game_Battler.prototype.gainHp = function(value){this._result.hpDamage = -value;this._result.hpAffected = true;this.setHp(this.hp + value);};Game_Battler.prototype.gainMp = function(value){this._result.mpDamage = -value;this.setMp(this.mp + value);};Game_Battler.prototype.gainTp = function(value){this._result.tpDamage = -value;this.setTp(this.tp + value);};Game_Battler.prototype.gainSilentTp = function(value){this.setTp(this.tp + value);};Game_Battler.prototype.initTp = function(){this.setTp(Math.randomInt(25));};Game_Battler.prototype.clearTp = function(){this.setTp(0);};Game_Battler.prototype.chargeTpByDamage = function(damageRate){var value=Math.floor(50 * damageRate * this.tcr);this.gainSilentTp(value);};Game_Battler.prototype.regenerateHp = function(){var value=Math.floor(this.mhp * this.hrg);value = Math.max(value,-this.maxSlipDamage());if(value !== 0){this.gainHp(value);}};Game_Battler.prototype.maxSlipDamage = function(){return $dataSystem.optSlipDeath?this.hp:Math.max(this.hp - 1,0);};Game_Battler.prototype.regenerateMp = function(){var value=Math.floor(this.mmp * this.mrg);if(value !== 0){this.gainMp(value);}};Game_Battler.prototype.regenerateTp = function(){var value=Math.floor(100 * this.trg);this.gainSilentTp(value);};Game_Battler.prototype.regenerateAll = function(){if(this.isAlive()){this.regenerateHp();this.regenerateMp();this.regenerateTp();}};Game_Battler.prototype.onBattleStart = function(){this.setActionState('undecided');this.clearMotion();if(!this.isPreserveTp()){this.initTp();}};Game_Battler.prototype.onAllActionsEnd = function(){this.clearResult();this.removeStatesAuto(1);this.removeBuffsAuto();};Game_Battler.prototype.onTurnEnd = function(){this.clearResult();this.regenerateAll();this.updateStateTurns();this.updateBuffTurns();this.removeStatesAuto(2);};Game_Battler.prototype.onBattleEnd = function(){this.clearResult();this.removeBattleStates();this.removeAllBuffs();this.clearActions();if(!this.isPreserveTp()){this.clearTp();}this.appear();};Game_Battler.prototype.onDamage = function(value){this.removeStatesByDamage();this.chargeTpByDamage(value / this.mhp);};Game_Battler.prototype.setActionState = function(actionState){this._actionState = actionState;this.requestMotionRefresh();};Game_Battler.prototype.isUndecided = function(){return this._actionState === 'undecided';};Game_Battler.prototype.isInputting = function(){return this._actionState === 'inputting';};Game_Battler.prototype.isWaiting = function(){return this._actionState === 'waiting';};Game_Battler.prototype.isActing = function(){return this._actionState === 'acting';};Game_Battler.prototype.isChanting = function(){if(this.isWaiting()){return this._actions.some(function(action){return action.isMagicSkill();});}return false;};Game_Battler.prototype.isGuardWaiting = function(){if(this.isWaiting()){return this._actions.some(function(action){return action.isGuard();});}return false;};Game_Battler.prototype.performActionStart = function(action){if(!action.isGuard()){this.setActionState('acting');}};Game_Battler.prototype.performAction = function(action){};Game_Battler.prototype.performActionEnd = function(){this.setActionState('done');};Game_Battler.prototype.performDamage = function(){};Game_Battler.prototype.performMiss = function(){SoundManager.playMiss();};Game_Battler.prototype.performRecovery = function(){SoundManager.playRecovery();};Game_Battler.prototype.performEvasion = function(){SoundManager.playEvasion();};Game_Battler.prototype.performMagicEvasion = function(){SoundManager.playMagicEvasion();};Game_Battler.prototype.performCounter = function(){SoundManager.playEvasion();};Game_Battler.prototype.performReflection = function(){SoundManager.playReflection();};Game_Battler.prototype.performSubstitute = function(target){};Game_Battler.prototype.performCollapse = function(){}; //-----------------------------------------------------------------------------
// Game_Actor
//
// The game object class for an actor.
function Game_Actor(){this.initialize.apply(this,arguments);}Game_Actor.prototype = Object.create(Game_Battler.prototype);Game_Actor.prototype.constructor = Game_Actor;Object.defineProperty(Game_Actor.prototype,'level',{get:function get(){return this._level;},configurable:true});Game_Actor.prototype.initialize = function(actorId){Game_Battler.prototype.initialize.call(this);this.setup(actorId);};Game_Actor.prototype.initMembers = function(){Game_Battler.prototype.initMembers.call(this);this._actorId = 0;this._name = '';this._nickname = '';this._classId = 0;this._level = 0;this._characterName = '';this._characterIndex = 0;this._faceName = '';this._faceIndex = 0;this._battlerName = '';this._exp = {};this._skills = [];this._equips = [];this._actionInputIndex = 0;this._lastMenuSkill = new Game_Item();this._lastBattleSkill = new Game_Item();this._lastCommandSymbol = '';};Game_Actor.prototype.setup = function(actorId){var actor=$dataActors[actorId];this._actorId = actorId;this._name = actor.name;this._nickname = actor.nickname;this._profile = actor.profile;this._classId = actor.classId;this._level = actor.initialLevel;this.initImages();this.initExp();this.initSkills();this.initEquips(actor.equips);this.clearParamPlus();this.recoverAll();};Game_Actor.prototype.actorId = function(){return this._actorId;};Game_Actor.prototype.actor = function(){return $dataActors[this._actorId];};Game_Actor.prototype.name = function(){return this._name;};Game_Actor.prototype.setName = function(name){this._name = name;};Game_Actor.prototype.nickname = function(){return this._nickname;};Game_Actor.prototype.setNickname = function(nickname){this._nickname = nickname;};Game_Actor.prototype.profile = function(){return this._profile;};Game_Actor.prototype.setProfile = function(profile){this._profile = profile;};Game_Actor.prototype.characterName = function(){return this._characterName;};Game_Actor.prototype.characterIndex = function(){return this._characterIndex;};Game_Actor.prototype.faceName = function(){return this._faceName;};Game_Actor.prototype.faceIndex = function(){return this._faceIndex;};Game_Actor.prototype.battlerName = function(){return this._battlerName;};Game_Actor.prototype.clearStates = function(){Game_Battler.prototype.clearStates.call(this);this._stateSteps = {};};Game_Actor.prototype.eraseState = function(stateId){Game_Battler.prototype.eraseState.call(this,stateId);delete this._stateSteps[stateId];};Game_Actor.prototype.resetStateCounts = function(stateId){Game_Battler.prototype.resetStateCounts.call(this,stateId);this._stateSteps[stateId] = $dataStates[stateId].stepsToRemove;};Game_Actor.prototype.initImages = function(){var actor=this.actor();this._characterName = actor.characterName;this._characterIndex = actor.characterIndex;this._faceName = actor.faceName;this._faceIndex = actor.faceIndex;this._battlerName = actor.battlerName;};Game_Actor.prototype.expForLevel = function(level){var c=this.currentClass();var basis=c.expParams[0];var extra=c.expParams[1];var acc_a=c.expParams[2];var acc_b=c.expParams[3];return Math.round(basis * Math.pow(level - 1,0.9 + acc_a / 250) * level * (level + 1) / (6 + Math.pow(level,2) / 50 / acc_b) + (level - 1) * extra);};Game_Actor.prototype.initExp = function(){this._exp[this._classId] = this.currentLevelExp();};Game_Actor.prototype.currentExp = function(){return this._exp[this._classId];};Game_Actor.prototype.currentLevelExp = function(){return this.expForLevel(this._level);};Game_Actor.prototype.nextLevelExp = function(){return this.expForLevel(this._level + 1);};Game_Actor.prototype.nextRequiredExp = function(){return this.nextLevelExp() - this.currentExp();};Game_Actor.prototype.maxLevel = function(){return this.actor().maxLevel;};Game_Actor.prototype.isMaxLevel = function(){return this._level >= this.maxLevel();};Game_Actor.prototype.initSkills = function(){this._skills = [];this.currentClass().learnings.forEach(function(learning){if(learning.level <= this._level){this.learnSkill(learning.skillId);}},this);};Game_Actor.prototype.initEquips = function(equips){var slots=this.equipSlots();var maxSlots=slots.length;this._equips = [];for(var i=0;i < maxSlots;i++) {this._equips[i] = new Game_Item();}for(var j=0;j < equips.length;j++) {if(j < maxSlots){this._equips[j].setEquip(slots[j] === 1,equips[j]);}}this.releaseUnequippableItems(true);this.refresh();};Game_Actor.prototype.equipSlots = function(){var slots=[];for(var i=1;i < $dataSystem.equipTypes.length;i++) {slots.push(i);}if(slots.length >= 2 && this.isDualWield()){slots[1] = 1;}return slots;};Game_Actor.prototype.equips = function(){return this._equips.map(function(item){return item.object();});};Game_Actor.prototype.weapons = function(){return this.equips().filter(function(item){return item && _managers.DataManager.isWeapon(item);});};Game_Actor.prototype.armors = function(){return this.equips().filter(function(item){return item && _managers.DataManager.isArmor(item);});};Game_Actor.prototype.hasWeapon = function(weapon){return this.weapons().contains(weapon);};Game_Actor.prototype.hasArmor = function(armor){return this.armors().contains(armor);};Game_Actor.prototype.isEquipChangeOk = function(slotId){return !this.isEquipTypeLocked(this.equipSlots()[slotId]) && !this.isEquipTypeSealed(this.equipSlots()[slotId]);};Game_Actor.prototype.changeEquip = function(slotId,item){if(this.tradeItemWithParty(item,this.equips()[slotId]) && (!item || this.equipSlots()[slotId] === item.etypeId)){this._equips[slotId].setObject(item);this.refresh();}};Game_Actor.prototype.forceChangeEquip = function(slotId,item){this._equips[slotId].setObject(item);this.releaseUnequippableItems(true);this.refresh();};Game_Actor.prototype.tradeItemWithParty = function(newItem,oldItem){if(newItem && !$gameParty.hasItem(newItem)){return false;}else {$gameParty.gainItem(oldItem,1);$gameParty.loseItem(newItem,1);return true;}};Game_Actor.prototype.changeEquipById = function(etypeId,itemId){var slotId=etypeId - 1;if(this.equipSlots()[slotId] === 1){this.changeEquip(slotId,$dataWeapons[itemId]);}else {this.changeEquip(slotId,$dataArmors[itemId]);}};Game_Actor.prototype.isEquipped = function(item){return this.equips().contains(item);};Game_Actor.prototype.discardEquip = function(item){var slotId=this.equips().indexOf(item);if(slotId >= 0){this._equips[slotId].setObject(null);}};Game_Actor.prototype.releaseUnequippableItems = function(forcing){for(;;) {var slots=this.equipSlots();var equips=this.equips();var changed=false;for(var i=0;i < equips.length;i++) {var item=equips[i];if(item && (!this.canEquip(item) || item.etypeId !== slots[i])){if(!forcing){this.tradeItemWithParty(null,item);}this._equips[i].setObject(null);changed = true;}}if(!changed){break;}}};Game_Actor.prototype.clearEquipments = function(){var maxSlots=this.equipSlots().length;for(var i=0;i < maxSlots;i++) {if(this.isEquipChangeOk(i)){this.changeEquip(i,null);}}};Game_Actor.prototype.optimizeEquipments = function(){var maxSlots=this.equipSlots().length;this.clearEquipments();for(var i=0;i < maxSlots;i++) {if(this.isEquipChangeOk(i)){this.changeEquip(i,this.bestEquipItem(i));}}};Game_Actor.prototype.bestEquipItem = function(slotId){var etypeId=this.equipSlots()[slotId];var items=$gameParty.equipItems().filter(function(item){return item.etypeId === etypeId && this.canEquip(item);},this);var bestItem=null;var bestPerformance=-1000;for(var i=0;i < items.length;i++) {var performance=this.calcEquipItemPerformance(items[i]);if(performance > bestPerformance){bestPerformance = performance;bestItem = items[i];}}return bestItem;};Game_Actor.prototype.calcEquipItemPerformance = function(item){return item.params.reduce(function(a,b){return a + b;});};Game_Actor.prototype.isSkillWtypeOk = function(skill){var wtypeId1=skill.requiredWtypeId1;var wtypeId2=skill.requiredWtypeId2;if(wtypeId1 === 0 && wtypeId2 === 0 || wtypeId1 > 0 && this.isWtypeEquipped(wtypeId1) || wtypeId2 > 0 && this.isWtypeEquipped(wtypeId2)){return true;}else {return false;}};Game_Actor.prototype.isWtypeEquipped = function(wtypeId){return this.weapons().some(function(weapon){return weapon.wtypeId === wtypeId;});};Game_Actor.prototype.refresh = function(){this.releaseUnequippableItems(false);Game_Battler.prototype.refresh.call(this);};Game_Actor.prototype.isActor = function(){return true;};Game_Actor.prototype.friendsUnit = function(){return $gameParty;};Game_Actor.prototype.opponentsUnit = function(){return $gameTroop;};Game_Actor.prototype.index = function(){return $gameParty.members().indexOf(this);};Game_Actor.prototype.isBattleMember = function(){return $gameParty.battleMembers().contains(this);};Game_Actor.prototype.isFormationChangeOk = function(){return true;};Game_Actor.prototype.currentClass = function(){return $dataClasses[this._classId];};Game_Actor.prototype.isClass = function(gameClass){return gameClass && this._classId === gameClass.id;};Game_Actor.prototype.skills = function(){var list=[];this._skills.concat(this.addedSkills()).forEach(function(id){if(!list.contains($dataSkills[id])){list.push($dataSkills[id]);}});return list;};Game_Actor.prototype.usableSkills = function(){return this.skills().filter(function(skill){return this.canUse(skill);},this);};Game_Actor.prototype.traitObjects = function(){var objects=Game_Battler.prototype.traitObjects.call(this);objects = objects.concat([this.actor(),this.currentClass()]);var equips=this.equips();for(var i=0;i < equips.length;i++) {var item=equips[i];if(item){objects.push(item);}}return objects;};Game_Actor.prototype.attackElements = function(){var set=Game_Battler.prototype.attackElements.call(this);if(this.hasNoWeapons() && !set.contains(this.bareHandsElementId())){set.push(this.bareHandsElementId());}return set;};Game_Actor.prototype.hasNoWeapons = function(){return this.weapons().length === 0;};Game_Actor.prototype.bareHandsElementId = function(){return 1;};Game_Actor.prototype.paramMax = function(paramId){if(paramId === 0){return 9999; // MHP
}return Game_Battler.prototype.paramMax.call(this,paramId);};Game_Actor.prototype.paramBase = function(paramId){return this.currentClass().params[paramId][this._level];};Game_Actor.prototype.paramPlus = function(paramId){var value=Game_Battler.prototype.paramPlus.call(this,paramId);var equips=this.equips();for(var i=0;i < equips.length;i++) {var item=equips[i];if(item){value += item.params[paramId];}}return value;};Game_Actor.prototype.attackAnimationId1 = function(){if(this.hasNoWeapons()){return this.bareHandsAnimationId();}else {var weapons=this.weapons();return weapons[0]?weapons[0].animationId:0;}};Game_Actor.prototype.attackAnimationId2 = function(){var weapons=this.weapons();return weapons[1]?weapons[1].animationId:0;};Game_Actor.prototype.bareHandsAnimationId = function(){return 1;};Game_Actor.prototype.changeExp = function(exp,show){this._exp[this._classId] = Math.max(exp,0);var lastLevel=this._level;var lastSkills=this.skills();while(!this.isMaxLevel() && this.currentExp() >= this.nextLevelExp()) {this.levelUp();}while(this.currentExp() < this.currentLevelExp()) {this.levelDown();}if(show && this._level > lastLevel){this.displayLevelUp(this.findNewSkills(lastSkills));}this.refresh();};Game_Actor.prototype.levelUp = function(){this._level++;this.currentClass().learnings.forEach(function(learning){if(learning.level === this._level){this.learnSkill(learning.skillId);}},this);};Game_Actor.prototype.levelDown = function(){this._level--;};Game_Actor.prototype.findNewSkills = function(lastSkills){var newSkills=this.skills();for(var i=0;i < lastSkills.length;i++) {var index=newSkills.indexOf(lastSkills[i]);if(index >= 0){newSkills.splice(index,1);}}return newSkills;};Game_Actor.prototype.displayLevelUp = function(newSkills){var text=TextManager.levelUp.format(this._name,TextManager.level,this._level);$gameMessage.newPage();$gameMessage.add(text);newSkills.forEach(function(skill){$gameMessage.add(TextManager.obtainSkill.format(skill.name));});};Game_Actor.prototype.gainExp = function(exp){var newExp=this.currentExp() + Math.round(exp * this.finalExpRate());this.changeExp(newExp,this.shouldDisplayLevelUp());};Game_Actor.prototype.finalExpRate = function(){return this.exr * (this.isBattleMember()?1:this.benchMembersExpRate());};Game_Actor.prototype.benchMembersExpRate = function(){return $dataSystem.optExtraExp?1:0;};Game_Actor.prototype.shouldDisplayLevelUp = function(){return true;};Game_Actor.prototype.changeLevel = function(level,show){level = level.clamp(1,this.maxLevel());this.changeExp(this.expForLevel(level),show);};Game_Actor.prototype.learnSkill = function(skillId){if(!this.isLearnedSkill(skillId)){this._skills.push(skillId);this._skills.sort(function(a,b){return a - b;});}};Game_Actor.prototype.forgetSkill = function(skillId){var index=this._skills.indexOf(skillId);if(index >= 0){this._skills.splice(index,1);}};Game_Actor.prototype.isLearnedSkill = function(skillId){return this._skills.contains(skillId);};Game_Actor.prototype.changeClass = function(classId,keepExp){if(keepExp){this._exp[classId] = this.currentExp();}this._classId = classId;this.changeExp(this._exp[this._classId] || 0,false);this.refresh();};Game_Actor.prototype.setCharacterImage = function(characterName,characterIndex){this._characterName = characterName;this._characterIndex = characterIndex;};Game_Actor.prototype.setFaceImage = function(faceName,faceIndex){this._faceName = faceName;this._faceIndex = faceIndex;};Game_Actor.prototype.setBattlerImage = function(battlerName){this._battlerName = battlerName;};Game_Actor.prototype.isSpriteVisible = function(){return $gameSystem.isSideView();};Game_Actor.prototype.startAnimation = function(animationId,mirror,delay){mirror = !mirror;Game_Battler.prototype.startAnimation.call(this,animationId,mirror,delay);};Game_Actor.prototype.performActionStart = function(action){Game_Battler.prototype.performActionStart.call(this,action);};Game_Actor.prototype.performAction = function(action){Game_Battler.prototype.performAction.call(this,action);if(action.isAttack()){this.performAttack();}else if(action.isGuard()){this.requestMotion('guard');}else if(action.isMagicSkill()){this.requestMotion('spell');}else if(action.isSkill()){this.requestMotion('skill');}else if(action.isItem()){this.requestMotion('item');}};Game_Actor.prototype.performActionEnd = function(){Game_Battler.prototype.performActionEnd.call(this);};Game_Actor.prototype.performAttack = function(){var weapons=this.weapons();var wtypeId=weapons[0]?weapons[0].wtypeId:0;var attackMotion=$dataSystem.attackMotions[wtypeId];if(attackMotion){if(attackMotion.type === 0){this.requestMotion('thrust');}else if(attackMotion.type === 1){this.requestMotion('swing');}else if(attackMotion.type === 2){this.requestMotion('missile');}this.startWeaponAnimation(attackMotion.weaponImageId);}};Game_Actor.prototype.performDamage = function(){Game_Battler.prototype.performDamage.call(this);if(this.isSpriteVisible()){this.requestMotion('damage');}else {$gameScreen.startShake(5,5,10);}SoundManager.playActorDamage();};Game_Actor.prototype.performEvasion = function(){Game_Battler.prototype.performEvasion.call(this);this.requestMotion('evade');};Game_Actor.prototype.performMagicEvasion = function(){Game_Battler.prototype.performMagicEvasion.call(this);this.requestMotion('evade');};Game_Actor.prototype.performCounter = function(){Game_Battler.prototype.performCounter.call(this);this.performAttack();};Game_Actor.prototype.performCollapse = function(){Game_Battler.prototype.performCollapse.call(this);if($gameParty.inBattle()){SoundManager.playActorCollapse();}};Game_Actor.prototype.performVictory = function(){if(this.canMove()){this.requestMotion('victory');}};Game_Actor.prototype.performEscape = function(){if(this.canMove()){this.requestMotion('escape');}};Game_Actor.prototype.makeActionList = function(){var list=[];var action=new Game_Action(this);action.setAttack();list.push(action);this.usableSkills().forEach(function(skill){action = new Game_Action(this);action.setSkill(skill.id);list.push(action);},this);return list;};Game_Actor.prototype.makeAutoBattleActions = function(){for(var i=0;i < this.numActions();i++) {var list=this.makeActionList();var maxValue=Number.MIN_VALUE;for(var j=0;j < list.length;j++) {var value=list[j].evaluate();if(value > maxValue){maxValue = value;this.setAction(i,list[j]);}}}this.setActionState('waiting');};Game_Actor.prototype.makeConfusionActions = function(){for(var i=0;i < this.numActions();i++) {this.action(i).setConfusion();}this.setActionState('waiting');};Game_Actor.prototype.makeActions = function(){Game_Battler.prototype.makeActions.call(this);if(this.numActions() > 0){this.setActionState('undecided');}else {this.setActionState('waiting');}if(this.isAutoBattle()){this.makeAutoBattleActions();}else if(this.isConfused()){this.makeConfusionActions();}};Game_Actor.prototype.onPlayerWalk = function(){this.clearResult();this.checkFloorEffect();if($gamePlayer.isNormal()){this.turnEndOnMap();this.states().forEach(function(state){this.updateStateSteps(state);},this);this.showAddedStates();this.showRemovedStates();}};Game_Actor.prototype.updateStateSteps = function(state){if(state.removeByWalking){if(this._stateSteps[state.id] > 0){if(--this._stateSteps[state.id] === 0){this.removeState(state.id);}}}};Game_Actor.prototype.showAddedStates = function(){this.result().addedStateObjects().forEach(function(state){if(state.message1){$gameMessage.add(this._name + state.message1);}},this);};Game_Actor.prototype.showRemovedStates = function(){this.result().removedStateObjects().forEach(function(state){if(state.message4){$gameMessage.add(this._name + state.message4);}},this);};Game_Actor.prototype.stepsForTurn = function(){return 20;};Game_Actor.prototype.turnEndOnMap = function(){if($gameParty.steps() % this.stepsForTurn() === 0){this.onTurnEnd();if(this.result().hpDamage > 0){this.performMapDamage();}}};Game_Actor.prototype.checkFloorEffect = function(){if($gamePlayer.isOnDamageFloor()){this.executeFloorDamage();}};Game_Actor.prototype.executeFloorDamage = function(){var damage=Math.floor(this.basicFloorDamage() * this.fdr);damage = Math.min(damage,this.maxFloorDamage());this.gainHp(-damage);if(damage > 0){this.performMapDamage();}};Game_Actor.prototype.basicFloorDamage = function(){return 10;};Game_Actor.prototype.maxFloorDamage = function(){return $dataSystem.optFloorDeath?this.hp:Math.max(this.hp - 1,0);};Game_Actor.prototype.performMapDamage = function(){if(!$gameParty.inBattle()){$gameScreen.startFlashForDamage();}};Game_Actor.prototype.clearActions = function(){Game_Battler.prototype.clearActions.call(this);this._actionInputIndex = 0;};Game_Actor.prototype.inputtingAction = function(){return this.action(this._actionInputIndex);};Game_Actor.prototype.selectNextCommand = function(){if(this._actionInputIndex < this.numActions() - 1){this._actionInputIndex++;return true;}else {return false;}};Game_Actor.prototype.selectPreviousCommand = function(){if(this._actionInputIndex > 0){this._actionInputIndex--;return true;}else {return false;}};Game_Actor.prototype.lastMenuSkill = function(){return this._lastMenuSkill.object();};Game_Actor.prototype.setLastMenuSkill = function(skill){this._lastMenuSkill.setObject(skill);};Game_Actor.prototype.lastBattleSkill = function(){return this._lastBattleSkill.object();};Game_Actor.prototype.setLastBattleSkill = function(skill){this._lastBattleSkill.setObject(skill);};Game_Actor.prototype.lastCommandSymbol = function(){return this._lastCommandSymbol;};Game_Actor.prototype.setLastCommandSymbol = function(symbol){this._lastCommandSymbol = symbol;}; //-----------------------------------------------------------------------------
// Game_Enemy
//
// The game object class for an enemy.
function Game_Enemy(){this.initialize.apply(this,arguments);}Game_Enemy.prototype = Object.create(Game_Battler.prototype);Game_Enemy.prototype.constructor = Game_Enemy;Game_Enemy.prototype.initialize = function(enemyId,x,y){Game_Battler.prototype.initialize.call(this);this.setup(enemyId,x,y);};Game_Enemy.prototype.initMembers = function(){Game_Battler.prototype.initMembers.call(this);this._enemyId = 0;this._letter = '';this._plural = false;this._screenX = 0;this._screenY = 0;};Game_Enemy.prototype.setup = function(enemyId,x,y){this._enemyId = enemyId;this._screenX = x;this._screenY = y;this.recoverAll();};Game_Enemy.prototype.isEnemy = function(){return true;};Game_Enemy.prototype.friendsUnit = function(){return $gameTroop;};Game_Enemy.prototype.opponentsUnit = function(){return $gameParty;};Game_Enemy.prototype.index = function(){return $gameTroop.members().indexOf(this);};Game_Enemy.prototype.isBattleMember = function(){return this.index() >= 0;};Game_Enemy.prototype.enemyId = function(){return this._enemyId;};Game_Enemy.prototype.enemy = function(){return $dataEnemies[this._enemyId];};Game_Enemy.prototype.traitObjects = function(){return Game_Battler.prototype.traitObjects.call(this).concat(this.enemy());};Game_Enemy.prototype.paramBase = function(paramId){return this.enemy().params[paramId];};Game_Enemy.prototype.exp = function(){return this.enemy().exp;};Game_Enemy.prototype.gold = function(){return this.enemy().gold;};Game_Enemy.prototype.makeDropItems = function(){return this.enemy().dropItems.reduce((function(r,di){if(di.kind > 0 && Math.random() * di.denominator < this.dropItemRate()){return r.concat(this.itemObject(di.kind,di.dataId));}else {return r;}}).bind(this),[]);};Game_Enemy.prototype.dropItemRate = function(){return $gameParty.hasDropItemDouble()?2:1;};Game_Enemy.prototype.itemObject = function(kind,dataId){if(kind === 1){return $dataItems[dataId];}else if(kind === 2){return $dataWeapons[dataId];}else if(kind === 3){return $dataArmors[dataId];}else {return null;}};Game_Enemy.prototype.isSpriteVisible = function(){return true;};Game_Enemy.prototype.screenX = function(){return this._screenX;};Game_Enemy.prototype.screenY = function(){return this._screenY;};Game_Enemy.prototype.battlerName = function(){return this.enemy().battlerName;};Game_Enemy.prototype.battlerHue = function(){return this.enemy().battlerHue;};Game_Enemy.prototype.originalName = function(){return this.enemy().name;};Game_Enemy.prototype.name = function(){return this.originalName() + (this._plural?this._letter:'');};Game_Enemy.prototype.isLetterEmpty = function(){return this._letter === '';};Game_Enemy.prototype.setLetter = function(letter){this._letter = letter;};Game_Enemy.prototype.setPlural = function(plural){this._plural = plural;};Game_Enemy.prototype.performActionStart = function(action){Game_Battler.prototype.performActionStart.call(this,action);this.requestEffect('whiten');};Game_Enemy.prototype.performAction = function(action){Game_Battler.prototype.performAction.call(this,action);};Game_Enemy.prototype.performActionEnd = function(){Game_Battler.prototype.performActionEnd.call(this);};Game_Enemy.prototype.performDamage = function(){Game_Battler.prototype.performDamage.call(this);SoundManager.playEnemyDamage();this.requestEffect('blink');};Game_Enemy.prototype.performCollapse = function(){Game_Battler.prototype.performCollapse.call(this);switch(this.collapseType()){case 0:this.requestEffect('collapse');SoundManager.playEnemyCollapse();break;case 1:this.requestEffect('bossCollapse');SoundManager.playBossCollapse1();break;case 2:this.requestEffect('instantCollapse');break;}};Game_Enemy.prototype.transform = function(enemyId){var name=this.originalName();this._enemyId = enemyId;if(this.originalName() !== name){this._letter = '';this._plural = false;}this.refresh();if(this.numActions() > 0){this.makeActions();}};Game_Enemy.prototype.meetsCondition = function(action){var param1=action.conditionParam1;var param2=action.conditionParam2;switch(action.conditionType){case 1:return this.meetsTurnCondition(param1,param2);case 2:return this.meetsHpCondition(param1,param2);case 3:return this.meetsMpCondition(param1,param2);case 4:return this.meetsStateCondition(param1);case 5:return this.meetsPartyLevelCondition(param1);case 6:return this.meetsSwitchCondition(param1);default:return true;}};Game_Enemy.prototype.meetsTurnCondition = function(param1,param2){var n=$gameTroop.turnCount();if(param2 === 0){return n === param1;}else {return n > 0 && n >= param1 && n % param2 === param1 % param2;}};Game_Enemy.prototype.meetsHpCondition = function(param1,param2){return this.hpRate() >= param1 && this.hpRate() <= param2;};Game_Enemy.prototype.meetsMpCondition = function(param1,param2){return this.mpRate() >= param1 && this.mpRate() <= param2;};Game_Enemy.prototype.meetsStateCondition = function(param){return this.isStateAffected(param);};Game_Enemy.prototype.meetsPartyLevelCondition = function(param){return $gameParty.highestLevel() >= param;};Game_Enemy.prototype.meetsSwitchCondition = function(param){return $gameSwitches.value(param);};Game_Enemy.prototype.isActionValid = function(action){return this.meetsCondition(action) && this.canUse($dataSkills[action.skillId]);};Game_Enemy.prototype.selectAction = function(actionList,ratingZero){var sum=actionList.reduce(function(r,a){return r + a.rating - ratingZero;},0);if(sum > 0){var value=Math.randomInt(sum);for(var i=0;i < actionList.length;i++) {var action=actionList[i];value -= action.rating - ratingZero;if(value < 0){return action;}}}else {return null;}};Game_Enemy.prototype.selectAllActions = function(actionList){var ratingMax=Math.max.apply(null,actionList.map(function(a){return a.rating;}));var ratingZero=ratingMax - 3;actionList = actionList.filter(function(a){return a.rating > ratingZero;});for(var i=0;i < this.numActions();i++) {this.action(i).setEnemyAction(this.selectAction(actionList,ratingZero));}};Game_Enemy.prototype.makeActions = function(){Game_Battler.prototype.makeActions.call(this);if(this.numActions() > 0){var actionList=this.enemy().actions.filter(function(a){return this.isActionValid(a);},this);if(actionList.length > 0){this.selectAllActions(actionList);}}this.setActionState('waiting');}; //-----------------------------------------------------------------------------
// Game_Actors
//
// The wrapper class for an actor array.
function Game_Actors(){this.initialize.apply(this,arguments);}Game_Actors.prototype.initialize = function(){this._data = [];};Game_Actors.prototype.actor = function(actorId){if($dataActors[actorId]){if(!this._data[actorId]){this._data[actorId] = new Game_Actor(actorId);}return this._data[actorId];}return null;}; //-----------------------------------------------------------------------------
// Game_Unit
//
// The superclass of Game_Party and Game_Troop.
function Game_Unit(){this.initialize.apply(this,arguments);}Game_Unit.prototype.initialize = function(){this._inBattle = false;};Game_Unit.prototype.inBattle = function(){return this._inBattle;};Game_Unit.prototype.members = function(){return [];};Game_Unit.prototype.aliveMembers = function(){return this.members().filter(function(member){return member.isAlive();});};Game_Unit.prototype.deadMembers = function(){return this.members().filter(function(member){return member.isDead();});};Game_Unit.prototype.movableMembers = function(){return this.members().filter(function(member){return member.canMove();});};Game_Unit.prototype.clearActions = function(){return this.members().forEach(function(member){return member.clearActions();});};Game_Unit.prototype.agility = function(){var members=this.members();if(members.length === 0){return 1;}var sum=members.reduce(function(r,member){return r + member.agi;},0);return sum / members.length;};Game_Unit.prototype.tgrSum = function(){return this.aliveMembers().reduce(function(r,member){return r + member.tgr;},0);};Game_Unit.prototype.randomTarget = function(){var tgrRand=Math.random() * this.tgrSum();var target=null;this.aliveMembers().forEach(function(member){tgrRand -= member.tgr;if(tgrRand <= 0 && !target){target = member;}});return target;};Game_Unit.prototype.randomDeadTarget = function(){var members=this.deadMembers();if(members.length === 0){return null;}return members[Math.floor(Math.random() * members.length)];};Game_Unit.prototype.smoothTarget = function(index){if(index < 0){index = 0;}var member=this.members()[index];return member && member.isAlive()?member:this.aliveMembers()[0];};Game_Unit.prototype.smoothDeadTarget = function(index){if(index < 0){index = 0;}var member=this.members()[index];return member && member.isDead()?member:this.deadMembers()[0];};Game_Unit.prototype.clearResults = function(){this.members().forEach(function(member){member.clearResult();});};Game_Unit.prototype.onBattleStart = function(){this.members().forEach(function(member){member.onBattleStart();});this._inBattle = true;};Game_Unit.prototype.onBattleEnd = function(){this._inBattle = false;this.members().forEach(function(member){member.onBattleEnd();});};Game_Unit.prototype.makeActions = function(){this.members().forEach(function(member){member.makeActions();});};Game_Unit.prototype.select = function(activeMember){this.members().forEach(function(member){if(member === activeMember){member.select();}else {member.deselect();}});};Game_Unit.prototype.isAllDead = function(){return this.aliveMembers().length === 0;};Game_Unit.prototype.substituteBattler = function(){var members=this.members();for(var i=0;i < members.length;i++) {if(members[i].isSubstitute()){return members[i];}}}; //-----------------------------------------------------------------------------
// Game_Party
//
// The game object class for the party. Information such as gold and items is
// included.
function Game_Party(){this.initialize.apply(this,arguments);}Game_Party.prototype = Object.create(Game_Unit.prototype);Game_Party.prototype.constructor = Game_Party;Game_Party.ABILITY_ENCOUNTER_HALF = 0;Game_Party.ABILITY_ENCOUNTER_NONE = 1;Game_Party.ABILITY_CANCEL_SURPRISE = 2;Game_Party.ABILITY_RAISE_PREEMPTIVE = 3;Game_Party.ABILITY_GOLD_DOUBLE = 4;Game_Party.ABILITY_DROP_ITEM_DOUBLE = 5;Game_Party.prototype.initialize = function(){Game_Unit.prototype.initialize.call(this);this._gold = 0;this._steps = 0;this._lastItem = new Game_Item();this._menuActorId = 0;this._targetActorId = 0;this._actors = [];this.initAllItems();};Game_Party.prototype.initAllItems = function(){this._items = {};this._weapons = {};this._armors = {};};Game_Party.prototype.exists = function(){return this._actors.length > 0;};Game_Party.prototype.size = function(){return this.members().length;};Game_Party.prototype.isEmpty = function(){return this.size() === 0;};Game_Party.prototype.members = function(){return this.inBattle()?this.battleMembers():this.allMembers();};Game_Party.prototype.allMembers = function(){return this._actors.map(function(id){return $gameActors.actor(id);});};Game_Party.prototype.battleMembers = function(){return this.allMembers().slice(0,this.maxBattleMembers()).filter(function(actor){return actor.isAppeared();});};Game_Party.prototype.maxBattleMembers = function(){return 4;};Game_Party.prototype.leader = function(){return this.battleMembers()[0];};Game_Party.prototype.reviveBattleMembers = function(){this.battleMembers().forEach(function(actor){if(actor.isDead()){actor.setHp(1);}});};Game_Party.prototype.items = function(){var list=[];for(var id in this._items) {list.push($dataItems[id]);}return list;};Game_Party.prototype.weapons = function(){var list=[];for(var id in this._weapons) {list.push($dataWeapons[id]);}return list;};Game_Party.prototype.armors = function(){var list=[];for(var id in this._armors) {list.push($dataArmors[id]);}return list;};Game_Party.prototype.equipItems = function(){return this.weapons().concat(this.armors());};Game_Party.prototype.allItems = function(){return this.items().concat(this.equipItems());};Game_Party.prototype.itemContainer = function(item){if(!item){return null;}else if(_managers.DataManager.isItem(item)){return this._items;}else if(_managers.DataManager.isWeapon(item)){return this._weapons;}else if(_managers.DataManager.isArmor(item)){return this._armors;}else {return null;}};Game_Party.prototype.setupStartingMembers = function(){this._actors = [];$dataSystem.partyMembers.forEach(function(actorId){if($gameActors.actor(actorId)){this._actors.push(actorId);}},this);};Game_Party.prototype.name = function(){var numBattleMembers=this.battleMembers().length;if(numBattleMembers === 0){return '';}else if(numBattleMembers === 1){return this.leader().name();}else {return TextManager.partyName.format(this.leader().name());}};Game_Party.prototype.setupBattleTest = function(){this.setupBattleTestMembers();this.setupBattleTestItems();};Game_Party.prototype.setupBattleTestMembers = function(){$dataSystem.testBattlers.forEach(function(battler){var actor=$gameActors.actor(battler.actorId);if(actor){actor.changeLevel(battler.level,false);actor.initEquips(battler.equips);actor.recoverAll();this.addActor(battler.actorId);}},this);};Game_Party.prototype.setupBattleTestItems = function(){$dataItems.forEach(function(item){if(item && item.name.length > 0){this.gainItem(item,this.maxItems(item));}},this);};Game_Party.prototype.highestLevel = function(){return Math.max.apply(null,this.members().map(function(actor){return actor.level;}));};Game_Party.prototype.addActor = function(actorId){if(!this._actors.contains(actorId)){this._actors.push(actorId);$gamePlayer.refresh();$gameMap.requestRefresh();}};Game_Party.prototype.removeActor = function(actorId){if(this._actors.contains(actorId)){this._actors.splice(this._actors.indexOf(actorId),1);$gamePlayer.refresh();$gameMap.requestRefresh();}};Game_Party.prototype.gold = function(){return this._gold;};Game_Party.prototype.gainGold = function(amount){this._gold = (this._gold + amount).clamp(0,this.maxGold());};Game_Party.prototype.loseGold = function(amount){this.gainGold(-amount);};Game_Party.prototype.maxGold = function(){return 99999999;};Game_Party.prototype.steps = function(){return this._steps;};Game_Party.prototype.increaseSteps = function(){this._steps++;};Game_Party.prototype.numItems = function(item){var container=this.itemContainer(item);return container?container[item.id] || 0:0;};Game_Party.prototype.maxItems = function(item){return 99;};Game_Party.prototype.hasMaxItems = function(item){return this.numItems(item) >= this.maxItems(item);};Game_Party.prototype.hasItem = function(item,includeEquip){if(includeEquip === undefined){includeEquip = false;}if(this.numItems(item) > 0){return true;}else if(includeEquip && this.isAnyMemberEquipped(item)){return true;}else {return false;}};Game_Party.prototype.isAnyMemberEquipped = function(item){return this.members().some(function(actor){return actor.equips().contains(item);});};Game_Party.prototype.gainItem = function(item,amount,includeEquip){var container=this.itemContainer(item);if(container){var lastNumber=this.numItems(item);var newNumber=lastNumber + amount;container[item.id] = newNumber.clamp(0,this.maxItems(item));if(container[item.id] === 0){delete container[item.id];}if(includeEquip && newNumber < 0){this.discardMembersEquip(item,-newNumber);}$gameMap.requestRefresh();}};Game_Party.prototype.discardMembersEquip = function(item,amount){var n=amount;this.members().forEach(function(actor){while(n > 0 && actor.isEquipped(item)) {actor.discardEquip(item);n--;}});};Game_Party.prototype.loseItem = function(item,amount,includeEquip){this.gainItem(item,-amount,includeEquip);};Game_Party.prototype.consumeItem = function(item){if(_managers.DataManager.isItem(item) && item.consumable){this.loseItem(item,1);}};Game_Party.prototype.canUse = function(item){return this.members().some(function(actor){return actor.canUse(item);});};Game_Party.prototype.canInput = function(){return this.members().some(function(actor){return actor.canInput();});};Game_Party.prototype.isAllDead = function(){if(Game_Unit.prototype.isAllDead.call(this)){return this.inBattle() || !this.isEmpty();}else {return false;}};Game_Party.prototype.onPlayerWalk = function(){this.members().forEach(function(actor){return actor.onPlayerWalk();});};Game_Party.prototype.menuActor = function(){var actor=$gameActors.actor(this._menuActorId);if(!this.members().contains(actor)){actor = this.members()[0];}return actor;};Game_Party.prototype.setMenuActor = function(actor){this._menuActorId = actor.actorId();};Game_Party.prototype.makeMenuActorNext = function(){var index=this.members().indexOf(this.menuActor());if(index >= 0){index = (index + 1) % this.members().length;this.setMenuActor(this.members()[index]);}else {this.setMenuActor(this.members()[0]);}};Game_Party.prototype.makeMenuActorPrevious = function(){var index=this.members().indexOf(this.menuActor());if(index >= 0){index = (index + this.members().length - 1) % this.members().length;this.setMenuActor(this.members()[index]);}else {this.setMenuActor(this.members()[0]);}};Game_Party.prototype.targetActor = function(){var actor=$gameActors.actor(this._targetActorId);if(!this.members().contains(actor)){actor = this.members()[0];}return actor;};Game_Party.prototype.setTargetActor = function(actor){this._targetActorId = actor.actorId();};Game_Party.prototype.lastItem = function(){return this._lastItem.object();};Game_Party.prototype.setLastItem = function(item){this._lastItem.setObject(item);};Game_Party.prototype.swapOrder = function(index1,index2){var temp=this._actors[index1];this._actors[index1] = this._actors[index2];this._actors[index2] = temp;$gamePlayer.refresh();};Game_Party.prototype.charactersForSavefile = function(){return this.battleMembers().map(function(actor){return [actor.characterName(),actor.characterIndex()];});};Game_Party.prototype.facesForSavefile = function(){return this.battleMembers().map(function(actor){return [actor.faceName(),actor.faceIndex()];});};Game_Party.prototype.partyAbility = function(abilityId){return this.battleMembers().some(function(actor){return actor.partyAbility(abilityId);});};Game_Party.prototype.hasEncounterHalf = function(){return this.partyAbility(Game_Party.ABILITY_ENCOUNTER_HALF);};Game_Party.prototype.hasEncounterNone = function(){return this.partyAbility(Game_Party.ABILITY_ENCOUNTER_NONE);};Game_Party.prototype.hasCancelSurprise = function(){return this.partyAbility(Game_Party.ABILITY_CANCEL_SURPRISE);};Game_Party.prototype.hasRaisePreemptive = function(){return this.partyAbility(Game_Party.ABILITY_RAISE_PREEMPTIVE);};Game_Party.prototype.hasGoldDouble = function(){return this.partyAbility(Game_Party.ABILITY_GOLD_DOUBLE);};Game_Party.prototype.hasDropItemDouble = function(){return this.partyAbility(Game_Party.ABILITY_DROP_ITEM_DOUBLE);};Game_Party.prototype.ratePreemptive = function(troopAgi){var rate=this.agility() >= troopAgi?0.05:0.03;if(this.hasRaisePreemptive()){rate *= 4;}return rate;};Game_Party.prototype.rateSurprise = function(troopAgi){var rate=this.agility() >= troopAgi?0.03:0.05;if(this.hasCancelSurprise()){rate = 0;}return rate;};Game_Party.prototype.performVictory = function(){this.members().forEach(function(actor){actor.performVictory();});};Game_Party.prototype.performEscape = function(){this.members().forEach(function(actor){actor.performEscape();});};Game_Party.prototype.removeBattleStates = function(){this.members().forEach(function(actor){actor.removeBattleStates();});};Game_Party.prototype.requestMotionRefresh = function(){this.members().forEach(function(actor){actor.requestMotionRefresh();});}; //-----------------------------------------------------------------------------
// Game_Troop
//
// The game object class for a troop and the battle-related data.
function Game_Troop(){this.initialize.apply(this,arguments);}Game_Troop.prototype = Object.create(Game_Unit.prototype);Game_Troop.prototype.constructor = Game_Troop;Game_Troop.LETTER_TABLE_HALF = [' A',' B',' C',' D',' E',' F',' G',' H',' I',' J',' K',' L',' M',' N',' O',' P',' Q',' R',' S',' T',' U',' V',' W',' X',' Y',' Z'];Game_Troop.LETTER_TABLE_FULL = ['Ａ','Ｂ','Ｃ','Ｄ','Ｅ','Ｆ','Ｇ','Ｈ','Ｉ','Ｊ','Ｋ','Ｌ','Ｍ','Ｎ','Ｏ','Ｐ','Ｑ','Ｒ','Ｓ','Ｔ','Ｕ','Ｖ','Ｗ','Ｘ','Ｙ','Ｚ'];Game_Troop.prototype.initialize = function(){Game_Unit.prototype.initialize.call(this);this._interpreter = new Game_Interpreter();this.clear();};Game_Troop.prototype.isEventRunning = function(){return this._interpreter.isRunning();};Game_Troop.prototype.updateInterpreter = function(){this._interpreter.update();};Game_Troop.prototype.turnCount = function(){return this._turnCount;};Game_Troop.prototype.members = function(){return this._enemies;};Game_Troop.prototype.clear = function(){this._interpreter.clear();this._troopId = 0;this._eventFlags = {};this._enemies = [];this._turnCount = 0;this._namesCount = {};};Game_Troop.prototype.troop = function(){return $dataTroops[this._troopId];};Game_Troop.prototype.setup = function(troopId){this.clear();this._troopId = troopId;this._enemies = [];this.troop().members.forEach(function(member){if($dataEnemies[member.enemyId]){var enemyId=member.enemyId;var x=member.x;var y=member.y;var enemy=new Game_Enemy(enemyId,x,y);if(member.hidden){enemy.hide();}this._enemies.push(enemy);}},this);this.makeUniqueNames();};Game_Troop.prototype.makeUniqueNames = function(){var table=this.letterTable();this.members().forEach(function(enemy){if(enemy.isAlive() && enemy.isLetterEmpty()){var name=enemy.originalName();var n=this._namesCount[name] || 0;enemy.setLetter(table[n % table.length]);this._namesCount[name] = n + 1;}},this);this.members().forEach(function(enemy){var name=enemy.originalName();if(this._namesCount[name] >= 2){enemy.setPlural(true);}},this);};Game_Troop.prototype.letterTable = function(){return $gameSystem.isCJK()?Game_Troop.LETTER_TABLE_FULL:Game_Troop.LETTER_TABLE_HALF;};Game_Troop.prototype.enemyNames = function(){var names=[];this.members().forEach(function(enemy){var name=enemy.originalName();if(enemy.isAlive() && !names.contains(name)){names.push(name);}});return names;};Game_Troop.prototype.meetsConditions = function(page){var c=page.conditions;if(!c.turnEnding && !c.turnValid && !c.enemyValid && !c.actorValid && !c.switchValid){return false; // Conditions not set
}if(c.turnEnding){if(!BattleManager.isTurnEnd()){return false;}}if(c.turnValid){var n=this._turnCount;var a=c.turnA;var b=c.turnB;if(b === 0 && n !== a){return false;}if(b > 0 && (n < 1 || n < a || n % b !== a % b)){return false;}}if(c.enemyValid){var enemy=$gameTroop.members()[c.enemyIndex];if(!enemy || enemy.hpRate() * 100 > c.enemyHp){return false;}}if(c.actorValid){var actor=$gameActors.actor(c.actorId);if(!actor || actor.hpRate() * 100 > c.actorHp){return false;}}if(c.switchValid){if(!$gameSwitches.value(c.switchId)){return false;}}return true;};Game_Troop.prototype.setupBattleEvent = function(){if(!this._interpreter.isRunning()){if(this._interpreter.setupReservedCommonEvent()){return;}var pages=this.troop().pages;for(var i=0;i < pages.length;i++) {var page=pages[i];if(this.meetsConditions(page) && !this._eventFlags[i]){this._interpreter.setup(page.list);if(page.span <= 1){this._eventFlags[i] = true;}break;}}}};Game_Troop.prototype.increaseTurn = function(){var pages=this.troop().pages;for(var i=0;i < pages.length;i++) {var page=pages[i];if(page.span === 1){this._eventFlags[i] = false;}}this._turnCount++;};Game_Troop.prototype.expTotal = function(){return this.deadMembers().reduce(function(r,enemy){return r + enemy.exp();},0);};Game_Troop.prototype.goldTotal = function(){return this.deadMembers().reduce(function(r,enemy){return r + enemy.gold();},0) * this.goldRate();};Game_Troop.prototype.goldRate = function(){return $gameParty.hasGoldDouble()?2:1;};Game_Troop.prototype.makeDropItems = function(){return this.deadMembers().reduce(function(r,enemy){return r.concat(enemy.makeDropItems());},[]);}; //-----------------------------------------------------------------------------
// Game_Map
//
// The game object class for a map. It contains scrolling and passage
// determination functions.
function Game_Map(){this.initialize.apply(this,arguments);}Game_Map.prototype.initialize = function(){this._interpreter = new Game_Interpreter();this._mapId = 0;this._tilesetId = 0;this._events = [];this._commonEvents = [];this._vehicles = [];this._displayX = 0;this._displayY = 0;this._nameDisplay = true;this._scrollDirection = 2;this._scrollRest = 0;this._scrollSpeed = 4;this._parallaxName = '';this._parallaxZero = false;this._parallaxLoopX = false;this._parallaxLoopY = false;this._parallaxSx = 0;this._parallaxSy = 0;this._parallaxX = 0;this._parallaxY = 0;this._battleback1Name = null;this._battleback2Name = null;this.createVehicles();};Game_Map.prototype.setup = function(mapId){if(!$dataMap){throw new Error('The map data is not available');}this._mapId = mapId;this._tilesetId = $dataMap.tilesetId;this._displayX = 0;this._displayY = 0;this.refereshVehicles();this.setupEvents();this.setupScroll();this.setupParallax();this.setupBattleback();this._needsRefresh = false;};Game_Map.prototype.isEventRunning = function(){return this._interpreter.isRunning() || this.isAnyEventStarting();};Game_Map.prototype.tileWidth = function(){return 48;};Game_Map.prototype.tileHeight = function(){return 48;};Game_Map.prototype.mapId = function(){return this._mapId;};Game_Map.prototype.tilesetId = function(){return this._tilesetId;};Game_Map.prototype.displayX = function(){return this._displayX;};Game_Map.prototype.displayY = function(){return this._displayY;};Game_Map.prototype.parallaxName = function(){return this._parallaxName;};Game_Map.prototype.battleback1Name = function(){return this._battleback1Name;};Game_Map.prototype.battleback2Name = function(){return this._battleback2Name;};Game_Map.prototype.requestRefresh = function(mapId){this._needsRefresh = true;};Game_Map.prototype.isNameDisplayEnabled = function(){return this._nameDisplay;};Game_Map.prototype.disableNameDisplay = function(){this._nameDisplay = false;};Game_Map.prototype.enableNameDisplay = function(){this._nameDisplay = true;};Game_Map.prototype.createVehicles = function(){this._vehicles = [];this._vehicles[0] = new Game_Vehicle('boat');this._vehicles[1] = new Game_Vehicle('ship');this._vehicles[2] = new Game_Vehicle('airship');};Game_Map.prototype.refereshVehicles = function(){this._vehicles.forEach(function(vehicle){vehicle.refresh();});};Game_Map.prototype.vehicles = function(){return this._vehicles;};Game_Map.prototype.vehicle = function(type){if(type === 0 || type === 'boat'){return this.boat();}else if(type === 1 || type === 'ship'){return this.ship();}else if(type === 2 || type === 'airship'){return this.airship();}else {return null;}};Game_Map.prototype.boat = function(){return this._vehicles[0];};Game_Map.prototype.ship = function(){return this._vehicles[1];};Game_Map.prototype.airship = function(){return this._vehicles[2];};Game_Map.prototype.setupEvents = function(){this._events = [];for(var i=0;i < $dataMap.events.length;i++) {if($dataMap.events[i]){this._events[i] = new Game_Event(this._mapId,i);}}this._commonEvents = this.parallelCommonEvents().map(function(commonEvent){return new Game_CommonEvent(commonEvent.id);});this.refreshTileEvents();};Game_Map.prototype.events = function(){return this._events.filter(function(event){return !!event;});};Game_Map.prototype.event = function(eventId){return this._events[eventId];};Game_Map.prototype.eraseEvent = function(eventId){this._events[eventId].erase();};Game_Map.prototype.parallelCommonEvents = function(){return $dataCommonEvents.filter(function(commonEvent){return commonEvent && commonEvent.trigger === 2;});};Game_Map.prototype.setupScroll = function(){this._scrollDirection = 2;this._scrollRest = 0;this._scrollSpeed = 4;};Game_Map.prototype.setupParallax = function(){this._parallaxName = $dataMap.parallaxName || '';this._parallaxZero = _managers.ImageManager.isZeroParallax(this._parallaxName);this._parallaxLoopX = $dataMap.parallaxLoopX;this._parallaxLoopY = $dataMap.parallaxLoopY;this._parallaxSx = $dataMap.parallaxSx;this._parallaxSy = $dataMap.parallaxSy;this._parallaxX = 0;this._parallaxY = 0;};Game_Map.prototype.setupBattleback = function(){if($dataMap.specifyBattleback){this._battleback1Name = $dataMap.battleback1Name;this._battleback2Name = $dataMap.battleback2Name;}else {this._battleback1Name = null;this._battleback2Name = null;}};Game_Map.prototype.setDisplayPos = function(x,y){if(this.isLoopHorizontal()){this._displayX = x.mod(this.width());this._parallaxX = x;}else {var endX=this.width() - this.screenTileX();this._displayX = endX < 0?endX / 2:x.clamp(0,endX);this._parallaxX = this._displayX;}if(this.isLoopVertical()){this._displayY = y.mod(this.height());this._parallaxY = y;}else {var endY=this.height() - this.screenTileY();this._displayY = endY < 0?endY / 2:y.clamp(0,endY);this._parallaxY = this._displayY;}};Game_Map.prototype.parallaxOx = function(){if(this._parallaxZero){return this._parallaxX * this.tileWidth();}else if(this._parallaxLoopX){return this._parallaxX * this.tileWidth() / 2;}else {return 0;}};Game_Map.prototype.parallaxOy = function(){if(this._parallaxZero){return this._parallaxY * this.tileHeight();}else if(this._parallaxLoopY){return this._parallaxY * this.tileHeight() / 2;}else {return 0;}};Game_Map.prototype.tileset = function(){return $dataTilesets[this._tilesetId];};Game_Map.prototype.tilesetFlags = function(){var tileset=this.tileset();if(tileset){return tileset.flags;}else {return [];}};Game_Map.prototype.displayName = function(){return $dataMap.displayName;};Game_Map.prototype.width = function(){return $dataMap.width;};Game_Map.prototype.height = function(){return $dataMap.height;};Game_Map.prototype.data = function(){return $dataMap.data;};Game_Map.prototype.isLoopHorizontal = function(){return $dataMap.scrollType === 2 || $dataMap.scrollType === 3;};Game_Map.prototype.isLoopVertical = function(){return $dataMap.scrollType === 1 || $dataMap.scrollType === 3;};Game_Map.prototype.isDashDisabled = function(){return $dataMap.disableDashing;};Game_Map.prototype.encounterList = function(){return $dataMap.encounterList;};Game_Map.prototype.encounterStep = function(){return $dataMap.encounterStep;};Game_Map.prototype.isOverworld = function(){return this.tileset() && this.tileset().mode === 0;};Game_Map.prototype.screenTileX = function(){return _core.Graphics.width / this.tileWidth();};Game_Map.prototype.screenTileY = function(){return _core.Graphics.height / this.tileHeight();};Game_Map.prototype.adjustX = function(x){if(this.isLoopHorizontal() && x < this._displayX - (this.width() - this.screenTileX()) / 2){return x - this._displayX + $dataMap.width;}else {return x - this._displayX;}};Game_Map.prototype.adjustY = function(y){if(this.isLoopVertical() && y < this._displayY - (this.height() - this.screenTileY()) / 2){return y - this._displayY + $dataMap.height;}else {return y - this._displayY;}};Game_Map.prototype.roundX = function(x){return this.isLoopHorizontal()?x.mod(this.width()):x;};Game_Map.prototype.roundY = function(y){return this.isLoopVertical()?y.mod(this.height()):y;};Game_Map.prototype.xWithDirection = function(x,d){return x + (d === 6?1:d === 4?-1:0);};Game_Map.prototype.yWithDirection = function(y,d){return y + (d === 2?1:d === 8?-1:0);};Game_Map.prototype.roundXWithDirection = function(x,d){return this.roundX(x + (d === 6?1:d === 4?-1:0));};Game_Map.prototype.roundYWithDirection = function(y,d){return this.roundY(y + (d === 2?1:d === 8?-1:0));};Game_Map.prototype.deltaX = function(x1,x2){var result=x1 - x2;if(this.isLoopHorizontal() && Math.abs(result) > this.width() / 2){if(result < 0){result += this.width();}else {result -= this.width();}}return result;};Game_Map.prototype.deltaY = function(y1,y2){var result=y1 - y2;if(this.isLoopVertical() && Math.abs(result) > this.height() / 2){if(result < 0){result += this.height();}else {result -= this.height();}}return result;};Game_Map.prototype.distance = function(x1,y1,x2,y2){return Math.abs(this.deltaX(x1,x2)) + Math.abs(this.deltaY(y1,y2));};Game_Map.prototype.canvasToMapX = function(x){var tileWidth=this.tileWidth();var originX=this._displayX * tileWidth;var mapX=Math.floor((originX + x) / tileWidth);return this.roundX(mapX);};Game_Map.prototype.canvasToMapY = function(y){var tileHeight=this.tileHeight();var originY=this._displayY * tileHeight;var mapY=Math.floor((originY + y) / tileHeight);return this.roundY(mapY);};Game_Map.prototype.autoplay = function(){if($dataMap.autoplayBgm){_managers.AudioManager.playBgm($dataMap.bgm);}if($dataMap.autoplayBgs){_managers.AudioManager.playBgs($dataMap.bgs);}};Game_Map.prototype.refreshIfNeeded = function(){if(this._needsRefresh){this.refresh();}};Game_Map.prototype.refresh = function(){this.events().forEach(function(event){event.refresh();});this._commonEvents.forEach(function(event){event.refresh();});this.refreshTileEvents();this._needsRefresh = false;};Game_Map.prototype.refreshTileEvents = function(){this.tileEvents = this.events().filter(function(event){return event.isTile();});};Game_Map.prototype.eventsXy = function(x,y){return this.events().filter(function(event){return event.pos(x,y);});};Game_Map.prototype.eventsXyNt = function(x,y){return this.events().filter(function(event){return event.posNt(x,y);});};Game_Map.prototype.tileEventsXy = function(x,y){return this.tileEvents.filter(function(event){return event.posNt(x,y);});};Game_Map.prototype.eventIdXy = function(x,y){var list=this.eventsXy(x,y);return list.length === 0?0:list[0].eventId();};Game_Map.prototype.scrollDown = function(distance){if(this.isLoopVertical()){this._displayY += distance;this._displayY %= $dataMap.height;if(this._parallaxLoopY){this._parallaxY += distance;}}else if(this.height() >= this.screenTileY()){var lastY=this._displayY;this._displayY = Math.min(this._displayY + distance,this.height() - this.screenTileY());this._parallaxY += this._displayY - lastY;}};Game_Map.prototype.scrollLeft = function(distance){if(this.isLoopHorizontal()){this._displayX += $dataMap.width - distance;this._displayX %= $dataMap.width;if(this._parallaxLoopX){this._parallaxX -= distance;}}else if(this.width() >= this.screenTileX()){var lastX=this._displayX;this._displayX = Math.max(this._displayX - distance,0);this._parallaxX += this._displayX - lastX;}};Game_Map.prototype.scrollRight = function(distance){if(this.isLoopHorizontal()){this._displayX += distance;this._displayX %= $dataMap.width;if(this._parallaxLoopX){this._parallaxX += distance;}}else if(this.width() >= this.screenTileX()){var lastX=this._displayX;this._displayX = Math.min(this._displayX + distance,this.width() - this.screenTileX());this._parallaxX += this._displayX - lastX;}};Game_Map.prototype.scrollUp = function(distance){if(this.isLoopVertical()){this._displayY += $dataMap.height - distance;this._displayY %= $dataMap.height;if(this._parallaxLoopY){this._parallaxY -= distance;}}else if(this.height() >= this.screenTileY()){var lastY=this._displayY;this._displayY = Math.max(this._displayY - distance,0);this._parallaxY += this._displayY - lastY;}};Game_Map.prototype.isValid = function(x,y){return x >= 0 && x < this.width() && y >= 0 && y < this.height();};Game_Map.prototype.checkPassage = function(x,y,bit){var flags=this.tilesetFlags();var tiles=this.allTiles(x,y);for(var i=0;i < tiles.length;i++) {var flag=flags[tiles[i]];if((flag & 0x10) !== 0) // [*] No effect on passage
continue;if((flag & bit) === 0) // [o] Passable
return true;if((flag & bit) === bit) // [x] Impassable
return false;}return false;};Game_Map.prototype.tileId = function(x,y,z){var width=$dataMap.width;var height=$dataMap.height;return $dataMap.data[(z * height + y) * width + x] || 0;};Game_Map.prototype.layeredTiles = function(x,y){var tiles=[];for(var i=0;i < 4;i++) {tiles.push(this.tileId(x,y,3 - i));}return tiles;};Game_Map.prototype.allTiles = function(x,y){var tiles=this.tileEventsXy(x,y).map(function(event){return event.tileId();});return tiles.concat(this.layeredTiles(x,y));};Game_Map.prototype.autotileType = function(x,y,z){var tileId=this.tileId(x,y,z);return tileId >= 2048?Math.floor((tileId - 2048) / 48):-1;};Game_Map.prototype.isPassable = function(x,y,d){return this.checkPassage(x,y,1 << d / 2 - 1 & 0x0f);};Game_Map.prototype.isBoatPassable = function(x,y){return this.checkPassage(x,y,0x0200);};Game_Map.prototype.isShipPassable = function(x,y){return this.checkPassage(x,y,0x0400);};Game_Map.prototype.isAirshipLandOk = function(x,y){return this.checkPassage(x,y,0x0800) && this.checkPassage(x,y,0x0f);};Game_Map.prototype.checkLayeredTilesFlags = function(x,y,bit){var flags=this.tilesetFlags();return this.layeredTiles(x,y).some(function(tileId){return (flags[tileId] & bit) !== 0;});};Game_Map.prototype.isLadder = function(x,y){return this.isValid(x,y) && this.checkLayeredTilesFlags(x,y,0x20);};Game_Map.prototype.isBush = function(x,y){return this.isValid(x,y) && this.checkLayeredTilesFlags(x,y,0x40);};Game_Map.prototype.isCounter = function(x,y){return this.isValid(x,y) && this.checkLayeredTilesFlags(x,y,0x80);};Game_Map.prototype.isDamageFloor = function(x,y){return this.isValid(x,y) && this.checkLayeredTilesFlags(x,y,0x100);};Game_Map.prototype.terrainTag = function(x,y){if(this.isValid(x,y)){var flags=this.tilesetFlags();var tiles=this.layeredTiles(x,y);for(var i=0;i < tiles.length;i++) {var tag=flags[tiles[i]] >> 12;if(tag > 0){return tag;}}}return 0;};Game_Map.prototype.regionId = function(x,y){return this.isValid(x,y)?this.tileId(x,y,5):0;};Game_Map.prototype.startScroll = function(direction,distance,speed){this._scrollDirection = direction;this._scrollRest = distance;this._scrollSpeed = speed;};Game_Map.prototype.isScrolling = function(){return this._scrollRest > 0;};Game_Map.prototype.update = function(sceneActive){this.refreshIfNeeded();if(sceneActive){this.updateInterpreter();}this.updateScroll();this.updateEvents();this.updateVehicles();this.updateParallax();};Game_Map.prototype.updateScroll = function(){if(this.isScrolling()){var lastX=this._displayX;var lastY=this._displayY;this.doScroll(this._scrollDirection,this.scrollDistance());if(this._displayX === lastX && this._displayY === lastY){this._scrollRest = 0;}else {this._scrollRest -= this.scrollDistance();}}};Game_Map.prototype.scrollDistance = function(){return Math.pow(2,this._scrollSpeed) / 256;};Game_Map.prototype.doScroll = function(direction,distance){switch(direction){case 2:this.scrollDown(distance);break;case 4:this.scrollLeft(distance);break;case 6:this.scrollRight(distance);break;case 8:this.scrollUp(distance);break;}};Game_Map.prototype.updateEvents = function(){this.events().forEach(function(event){event.update();});this._commonEvents.forEach(function(event){event.update();});};Game_Map.prototype.updateVehicles = function(){this._vehicles.forEach(function(vehicle){vehicle.update();});};Game_Map.prototype.updateParallax = function(){if(this._parallaxLoopX){this._parallaxX += this._parallaxSx / this.tileWidth() / 2;}if(this._parallaxLoopY){this._parallaxY += this._parallaxSy / this.tileHeight() / 2;}};Game_Map.prototype.changeTileset = function(tilesetId){this._tilesetId = tilesetId;this.refresh();};Game_Map.prototype.changeBattleback = function(battleback1Name,battleback2Name){this._battleback1Name = battleback1Name;this._battleback2Name = battleback2Name;};Game_Map.prototype.changeParallax = function(name,loopX,loopY,sx,sy){this._parallaxName = name;this._parallaxZero = _managers.ImageManager.isZeroParallax(this._parallaxName);if(this._parallaxLoopX && !loopX){this._parallaxX = 0;}if(this._parallaxLoopY && !loopY){this._parallaxY = 0;}this._parallaxLoopX = loopX;this._parallaxLoopY = loopY;this._parallaxSx = sx;this._parallaxSy = sy;};Game_Map.prototype.updateInterpreter = function(){for(;;) {this._interpreter.update();if(this._interpreter.isRunning()){return;}if(this._interpreter.eventId() > 0){this.unlockEvent(this._interpreter.eventId());this._interpreter.clear();}if(!this.setupStartingEvent()){return;}}};Game_Map.prototype.unlockEvent = function(eventId){if(this._events[eventId]){this._events[eventId].unlock();}};Game_Map.prototype.setupStartingEvent = function(){this.refreshIfNeeded();if(this._interpreter.setupReservedCommonEvent()){return true;}if(this.setupTestEvent()){return true;}if(this.setupStartingMapEvent()){return true;}if(this.setupAutorunCommonEvent()){return true;}return false;};Game_Map.prototype.setupTestEvent = function(){if($testEvent){this._interpreter.setup($testEvent,0);$testEvent = null;return true;}return false;};Game_Map.prototype.setupStartingMapEvent = function(){var events=this.events();for(var i=0;i < events.length;i++) {var event=events[i];if(event.isStarting()){event.clearStartingFlag();this._interpreter.setup(event.list(),event.eventId());return true;}}return false;};Game_Map.prototype.setupAutorunCommonEvent = function(){for(var i=0;i < $dataCommonEvents.length;i++) {var event=$dataCommonEvents[i];if(event && event.trigger === 1 && $gameSwitches.value(event.switchId)){this._interpreter.setup(event.list);return true;}}return false;};Game_Map.prototype.isAnyEventStarting = function(){return this.events().some(function(event){return event.isStarting();});}; //-----------------------------------------------------------------------------
// Game_CommonEvent
//
// The game object class for a common event. It contains functionality for
// running parallel process events.
function Game_CommonEvent(){this.initialize.apply(this,arguments);}Game_CommonEvent.prototype.initialize = function(commonEventId){this._commonEventId = commonEventId;this.refresh();};Game_CommonEvent.prototype.event = function(){return $dataCommonEvents[this._commonEventId];};Game_CommonEvent.prototype.list = function(){return this.event().list;};Game_CommonEvent.prototype.refresh = function(){if(this.isActive()){if(!this._interpreter){this._interpreter = new Game_Interpreter();}}else {this._interpreter = null;}};Game_CommonEvent.prototype.isActive = function(){var event=this.event();return event.trigger === 2 && $gameSwitches.value(event.switchId);};Game_CommonEvent.prototype.update = function(){if(this._interpreter){if(!this._interpreter.isRunning()){this._interpreter.setup(this.list());}this._interpreter.update();}}; //-----------------------------------------------------------------------------
// Game_CharacterBase
//
// The superclass of Game_Character. It handles basic information, such as
// coordinates and images, shared by all characters.
function Game_CharacterBase(){this.initialize.apply(this,arguments);}Object.defineProperties(Game_CharacterBase.prototype,{x:{get:function get(){return this._x;},configurable:true},y:{get:function get(){return this._y;},configurable:true}});Game_CharacterBase.prototype.initialize = function(){this.initMembers();};Game_CharacterBase.prototype.initMembers = function(){this._x = 0;this._y = 0;this._realX = 0;this._realY = 0;this._moveSpeed = 4;this._moveFrequency = 6;this._opacity = 255;this._blendMode = 0;this._direction = 2;this._pattern = 1;this._priorityType = 1;this._tileId = 0;this._characterName = '';this._characterIndex = 0;this._isObjectCharacter = false;this._walkAnime = true;this._stepAnime = false;this._directionFix = false;this._through = false;this._transparent = false;this._bushDepth = 0;this._animationId = 0;this._balloonId = 0;this._animationPlaying = false;this._balloonPlaying = false;this._animationCount = 0;this._stopCount = 0;this._jumpCount = 0;this._jumpPeak = 0;this._movementSuccess = true;};Game_CharacterBase.prototype.pos = function(x,y){return this._x === x && this._y === y;};Game_CharacterBase.prototype.posNt = function(x,y){ // No through
return this.pos(x,y) && !this.isThrough();};Game_CharacterBase.prototype.moveSpeed = function(){return this._moveSpeed;};Game_CharacterBase.prototype.setMoveSpeed = function(moveSpeed){this._moveSpeed = moveSpeed;};Game_CharacterBase.prototype.moveFrequency = function(){return this._moveFrequency;};Game_CharacterBase.prototype.setMoveFrequency = function(moveFrequency){this._moveFrequency = moveFrequency;};Game_CharacterBase.prototype.opacity = function(){return this._opacity;};Game_CharacterBase.prototype.setOpacity = function(opacity){this._opacity = opacity;};Game_CharacterBase.prototype.blendMode = function(){return this._blendMode;};Game_CharacterBase.prototype.setBlendMode = function(blendMode){this._blendMode = blendMode;};Game_CharacterBase.prototype.isNormalPriority = function(){return this._priorityType === 1;};Game_CharacterBase.prototype.setPriorityType = function(priorityType){this._priorityType = priorityType;};Game_CharacterBase.prototype.isMoving = function(){return this._realX !== this._x || this._realY !== this._y;};Game_CharacterBase.prototype.isJumping = function(){return this._jumpCount > 0;};Game_CharacterBase.prototype.jumpHeight = function(){return (this._jumpPeak * this._jumpPeak - Math.pow(Math.abs(this._jumpCount - this._jumpPeak),2)) / 2;};Game_CharacterBase.prototype.isStopping = function(){return !this.isMoving() && !this.isJumping();};Game_CharacterBase.prototype.checkStop = function(threshold){return this._stopCount > threshold;};Game_CharacterBase.prototype.resetStopCount = function(){this._stopCount = 0;};Game_CharacterBase.prototype.realMoveSpeed = function(){return this._moveSpeed + (this.isDashing()?1:0);};Game_CharacterBase.prototype.distancePerFrame = function(){return Math.pow(2,this.realMoveSpeed()) / 256;};Game_CharacterBase.prototype.isDashing = function(){return false;};Game_CharacterBase.prototype.isDebugThrough = function(){return false;};Game_CharacterBase.prototype.straighten = function(){if(this.hasWalkAnime() || this.hasStepAnime()){this._pattern = 1;}this._animationCount = 0;};Game_CharacterBase.prototype.reverseDir = function(d){return 10 - d;};Game_CharacterBase.prototype.canPass = function(x,y,d){var x2=$gameMap.roundXWithDirection(x,d);var y2=$gameMap.roundYWithDirection(y,d);if(!$gameMap.isValid(x2,y2)){return false;}if(this.isThrough() || this.isDebugThrough()){return true;}if(!this.isMapPassable(x,y,d)){return false;}if(this.isCollidedWithCharacters(x2,y2)){return false;}return true;};Game_CharacterBase.prototype.canPassDiagonally = function(x,y,horz,vert){var x2=$gameMap.roundXWithDirection(x,horz);var y2=$gameMap.roundYWithDirection(y,vert);if(this.canPass(x,y,vert) && this.canPass(x,y2,horz)){return true;}if(this.canPass(x,y,horz) && this.canPass(x2,y,vert)){return true;}return false;};Game_CharacterBase.prototype.isMapPassable = function(x,y,d){var x2=$gameMap.roundXWithDirection(x,d);var y2=$gameMap.roundYWithDirection(y,d);var d2=this.reverseDir(d);return $gameMap.isPassable(x,y,d) && $gameMap.isPassable(x2,y2,d2);};Game_CharacterBase.prototype.isCollidedWithCharacters = function(x,y){return this.isCollidedWithEvents(x,y) || this.isCollidedWithVehicles(x,y);};Game_CharacterBase.prototype.isCollidedWithEvents = function(x,y){var events=$gameMap.eventsXyNt(x,y);return events.some(function(event){return event.isNormalPriority();});};Game_CharacterBase.prototype.isCollidedWithVehicles = function(x,y){return $gameMap.boat().posNt(x,y) || $gameMap.ship().posNt(x,y);};Game_CharacterBase.prototype.setPosition = function(x,y){this._x = Math.round(x);this._y = Math.round(y);this._realX = x;this._realY = y;};Game_CharacterBase.prototype.copyPosition = function(character){this._x = character._x;this._y = character._y;this._realX = character._realX;this._realY = character._realY;this._direction = character._direction;};Game_CharacterBase.prototype.locate = function(x,y){this.setPosition(x,y);this.straighten();this.refreshBushDepth();};Game_CharacterBase.prototype.direction = function(){return this._direction;};Game_CharacterBase.prototype.setDirection = function(d){if(!this.isDirectionFixed() && d){this._direction = d;}this.resetStopCount();};Game_CharacterBase.prototype.isTile = function(){return this._tileId > 0 && this._priorityType === 0;};Game_CharacterBase.prototype.isObjectCharacter = function(){return this._isObjectCharacter;};Game_CharacterBase.prototype.shiftY = function(){return this.isObjectCharacter()?0:6;};Game_CharacterBase.prototype.scrolledX = function(){return $gameMap.adjustX(this._realX);};Game_CharacterBase.prototype.scrolledY = function(){return $gameMap.adjustY(this._realY);};Game_CharacterBase.prototype.screenX = function(){var tw=$gameMap.tileWidth();return Math.round(this.scrolledX() * tw + tw / 2);};Game_CharacterBase.prototype.screenY = function(){var th=$gameMap.tileHeight();return Math.round(this.scrolledY() * th + th - this.shiftY() - this.jumpHeight());};Game_CharacterBase.prototype.screenZ = function(){return this._priorityType * 2 + 1;};Game_CharacterBase.prototype.isNearTheScreen = function(){var gw=_core.Graphics.width;var gh=_core.Graphics.height;var tw=$gameMap.tileWidth();var th=$gameMap.tileHeight();var px=this.scrolledX() * tw + tw / 2 - gw / 2;var py=this.scrolledY() * th + th / 2 - gh / 2;return px >= -gw && px <= gw && py >= -gh && py <= gh;};Game_CharacterBase.prototype.update = function(){if(this.isStopping()){this.updateStop();}if(this.isJumping()){this.updateJump();}else if(this.isMoving()){this.updateMove();}this.updateAnimation();};Game_CharacterBase.prototype.updateStop = function(){this._stopCount++;};Game_CharacterBase.prototype.updateJump = function(){this._jumpCount--;this._realX = (this._realX * this._jumpCount + this._x) / (this._jumpCount + 1.0);this._realY = (this._realY * this._jumpCount + this._y) / (this._jumpCount + 1.0);this.refreshBushDepth();if(this._jumpCount === 0){this._realX = this._x = $gameMap.roundX(this._x);this._realY = this._y = $gameMap.roundY(this._y);}};Game_CharacterBase.prototype.updateMove = function(){if(this._x < this._realX){this._realX = Math.max(this._realX - this.distancePerFrame(),this._x);}if(this._x > this._realX){this._realX = Math.min(this._realX + this.distancePerFrame(),this._x);}if(this._y < this._realY){this._realY = Math.max(this._realY - this.distancePerFrame(),this._y);}if(this._y > this._realY){this._realY = Math.min(this._realY + this.distancePerFrame(),this._y);}if(!this.isMoving()){this.refreshBushDepth();}};Game_CharacterBase.prototype.updateAnimation = function(){this.updateAnimationCount();if(this._animationCount >= this.animationWait()){this.updatePattern();this._animationCount = 0;}};Game_CharacterBase.prototype.animationWait = function(){return (9 - this.realMoveSpeed()) * 3;};Game_CharacterBase.prototype.updateAnimationCount = function(){if(this.isMoving() && this.hasWalkAnime()){this._animationCount += 1.5;}else if(this.hasStepAnime() || !this.isOriginalPattern()){this._animationCount++;}};Game_CharacterBase.prototype.updatePattern = function(){if(!this.hasStepAnime() && this._stopCount > 0){this.resetPattern();}else {this._pattern = (this._pattern + 1) % this.maxPattern();}};Game_CharacterBase.prototype.maxPattern = function(){return 4;};Game_CharacterBase.prototype.pattern = function(){return this._pattern < 3?this._pattern:1;};Game_CharacterBase.prototype.setPattern = function(pattern){this._pattern = pattern;};Game_CharacterBase.prototype.isOriginalPattern = function(){return this.pattern() === 1;};Game_CharacterBase.prototype.resetPattern = function(){this.setPattern(1);};Game_CharacterBase.prototype.refreshBushDepth = function(){if(this.isNormalPriority() && !this.isObjectCharacter() && this.isOnBush() && !this.isJumping()){if(!this.isMoving()){this._bushDepth = 12;}}else {this._bushDepth = 0;}};Game_CharacterBase.prototype.isOnLadder = function(){return $gameMap.isLadder(this._x,this._y);};Game_CharacterBase.prototype.isOnBush = function(){return $gameMap.isBush(this._x,this._y);};Game_CharacterBase.prototype.terrainTag = function(){return $gameMap.terrainTag(this._x,this._y);};Game_CharacterBase.prototype.regionId = function(){return $gameMap.regionId(this._x,this._y);};Game_CharacterBase.prototype.increaseSteps = function(){if(this.isOnLadder()){this.setDirection(8);}this.resetStopCount();this.refreshBushDepth();};Game_CharacterBase.prototype.tileId = function(){return this._tileId;};Game_CharacterBase.prototype.characterName = function(){return this._characterName;};Game_CharacterBase.prototype.characterIndex = function(){return this._characterIndex;};Game_CharacterBase.prototype.setImage = function(characterName,characterIndex){this._tileId = 0;this._characterName = characterName;this._characterIndex = characterIndex;this._isObjectCharacter = _managers.ImageManager.isObjectCharacter(characterName);};Game_CharacterBase.prototype.setTileImage = function(tileId){this._tileId = tileId;this._characterName = '';this._characterIndex = 0;this._isObjectCharacter = true;};Game_CharacterBase.prototype.checkEventTriggerTouchFront = function(d){var x2=$gameMap.roundXWithDirection(this._x,d);var y2=$gameMap.roundYWithDirection(this._y,d);this.checkEventTriggerTouch(x2,y2);};Game_CharacterBase.prototype.checkEventTriggerTouch = function(x,y){return false;};Game_CharacterBase.prototype.isMovementSucceeded = function(x,y){return this._movementSuccess;};Game_CharacterBase.prototype.setMovementSuccess = function(success){this._movementSuccess = success;};Game_CharacterBase.prototype.moveStraight = function(d){this.setMovementSuccess(this.canPass(this._x,this._y,d));if(this.isMovementSucceeded()){this.setDirection(d);this._x = $gameMap.roundXWithDirection(this._x,d);this._y = $gameMap.roundYWithDirection(this._y,d);this._realX = $gameMap.xWithDirection(this._x,this.reverseDir(d));this._realY = $gameMap.yWithDirection(this._y,this.reverseDir(d));this.increaseSteps();}else {this.setDirection(d);this.checkEventTriggerTouchFront(d);}};Game_CharacterBase.prototype.moveDiagonally = function(horz,vert){this.setMovementSuccess(this.canPassDiagonally(this._x,this._y,horz,vert));if(this.isMovementSucceeded()){this._x = $gameMap.roundXWithDirection(this._x,horz);this._y = $gameMap.roundYWithDirection(this._y,vert);this._realX = $gameMap.xWithDirection(this._x,this.reverseDir(horz));this._realY = $gameMap.yWithDirection(this._y,this.reverseDir(vert));this.increaseSteps();}if(this._direction === this.reverseDir(horz)){this.setDirection(horz);}if(this._direction === this.reverseDir(vert)){this.setDirection(vert);}};Game_CharacterBase.prototype.jump = function(xPlus,yPlus){if(Math.abs(xPlus) > Math.abs(yPlus)){if(xPlus !== 0){this.setDirection(xPlus < 0?4:6);}}else {if(yPlus !== 0){this.setDirection(yPlus < 0?8:2);}}this._x += xPlus;this._y += yPlus;var distance=Math.round(Math.sqrt(xPlus * xPlus + yPlus * yPlus));this._jumpPeak = 10 + distance - this._moveSpeed;this._jumpCount = this._jumpPeak * 2;this.resetStopCount();this.straighten();};Game_CharacterBase.prototype.hasWalkAnime = function(){return this._walkAnime;};Game_CharacterBase.prototype.setWalkAnime = function(walkAnime){this._walkAnime = walkAnime;};Game_CharacterBase.prototype.hasStepAnime = function(){return this._stepAnime;};Game_CharacterBase.prototype.setStepAnime = function(stepAnime){this._stepAnime = stepAnime;};Game_CharacterBase.prototype.isDirectionFixed = function(){return this._directionFix;};Game_CharacterBase.prototype.setDirectionFix = function(directionFix){this._directionFix = directionFix;};Game_CharacterBase.prototype.isThrough = function(){return this._through;};Game_CharacterBase.prototype.setThrough = function(through){this._through = through;};Game_CharacterBase.prototype.isTransparent = function(){return this._transparent;};Game_CharacterBase.prototype.bushDepth = function(){return this._bushDepth;};Game_CharacterBase.prototype.setTransparent = function(transparent){this._transparent = transparent;};Game_CharacterBase.prototype.requestAnimation = function(animationId){this._animationId = animationId;};Game_CharacterBase.prototype.requestBalloon = function(balloonId){this._balloonId = balloonId;};Game_CharacterBase.prototype.animationId = function(){return this._animationId;};Game_CharacterBase.prototype.balloonId = function(){return this._balloonId;};Game_CharacterBase.prototype.startAnimation = function(){this._animationId = 0;this._animationPlaying = true;};Game_CharacterBase.prototype.startBalloon = function(){this._balloonId = 0;this._balloonPlaying = true;};Game_CharacterBase.prototype.isAnimationPlaying = function(){return this._animationId > 0 || this._animationPlaying;};Game_CharacterBase.prototype.isBalloonPlaying = function(){return this._balloonId > 0 || this._balloonPlaying;};Game_CharacterBase.prototype.endAnimation = function(){this._animationPlaying = false;};Game_CharacterBase.prototype.endBalloon = function(){this._balloonPlaying = false;}; //-----------------------------------------------------------------------------
// Game_Character
//
// The superclass of Game_Player, Game_Follower, GameVehicle, and Game_Event.
function Game_Character(){this.initialize.apply(this,arguments);}Game_Character.prototype = Object.create(Game_CharacterBase.prototype);Game_Character.prototype.constructor = Game_Character;Game_Character.ROUTE_END = 0;Game_Character.ROUTE_MOVE_DOWN = 1;Game_Character.ROUTE_MOVE_LEFT = 2;Game_Character.ROUTE_MOVE_RIGHT = 3;Game_Character.ROUTE_MOVE_UP = 4;Game_Character.ROUTE_MOVE_LOWER_L = 5;Game_Character.ROUTE_MOVE_LOWER_R = 6;Game_Character.ROUTE_MOVE_UPPER_L = 7;Game_Character.ROUTE_MOVE_UPPER_R = 8;Game_Character.ROUTE_MOVE_RANDOM = 9;Game_Character.ROUTE_MOVE_TOWARD = 10;Game_Character.ROUTE_MOVE_AWAY = 11;Game_Character.ROUTE_MOVE_FORWARD = 12;Game_Character.ROUTE_MOVE_BACKWARD = 13;Game_Character.ROUTE_JUMP = 14;Game_Character.ROUTE_WAIT = 15;Game_Character.ROUTE_TURN_DOWN = 16;Game_Character.ROUTE_TURN_LEFT = 17;Game_Character.ROUTE_TURN_RIGHT = 18;Game_Character.ROUTE_TURN_UP = 19;Game_Character.ROUTE_TURN_90D_R = 20;Game_Character.ROUTE_TURN_90D_L = 21;Game_Character.ROUTE_TURN_180D = 22;Game_Character.ROUTE_TURN_90D_R_L = 23;Game_Character.ROUTE_TURN_RANDOM = 24;Game_Character.ROUTE_TURN_TOWARD = 25;Game_Character.ROUTE_TURN_AWAY = 26;Game_Character.ROUTE_SWITCH_ON = 27;Game_Character.ROUTE_SWITCH_OFF = 28;Game_Character.ROUTE_CHANGE_SPEED = 29;Game_Character.ROUTE_CHANGE_FREQ = 30;Game_Character.ROUTE_WALK_ANIME_ON = 31;Game_Character.ROUTE_WALK_ANIME_OFF = 32;Game_Character.ROUTE_STEP_ANIME_ON = 33;Game_Character.ROUTE_STEP_ANIME_OFF = 34;Game_Character.ROUTE_DIR_FIX_ON = 35;Game_Character.ROUTE_DIR_FIX_OFF = 36;Game_Character.ROUTE_THROUGH_ON = 37;Game_Character.ROUTE_THROUGH_OFF = 38;Game_Character.ROUTE_TRANSPARENT_ON = 39;Game_Character.ROUTE_TRANSPARENT_OFF = 40;Game_Character.ROUTE_CHANGE_IMAGE = 41;Game_Character.ROUTE_CHANGE_OPACITY = 42;Game_Character.ROUTE_CHANGE_BLEND_MODE = 43;Game_Character.ROUTE_PLAY_SE = 44;Game_Character.ROUTE_SCRIPT = 45;Game_Character.prototype.initialize = function(){Game_CharacterBase.prototype.initialize.call(this);};Game_Character.prototype.initMembers = function(){Game_CharacterBase.prototype.initMembers.call(this);this._moveRouteForcing = false;this._moveRoute = null;this._moveRouteIndex = 0;this._originalMoveRoute = null;this._originalMoveRouteIndex = 0;this._waitCount = 0;};Game_Character.prototype.memorizeMoveRoute = function(){this._originalMoveRoute = this._moveRoute;this._originalMoveRouteIndex = this._moveRouteIndex;};Game_Character.prototype.restoreMoveRoute = function(){this._moveRoute = this._originalMoveRoute;this._moveRouteIndex = this._originalMoveRouteIndex;this._originalMoveRoute = null;};Game_Character.prototype.isMoveRouteForcing = function(){return this._moveRouteForcing;};Game_Character.prototype.setMoveRoute = function(moveRoute){this._moveRoute = moveRoute;this._moveRouteIndex = 0;this._moveRouteForcing = false;};Game_Character.prototype.forceMoveRoute = function(moveRoute){if(!this._originalMoveRoute){this.memorizeMoveRoute();}this._moveRoute = moveRoute;this._moveRouteIndex = 0;this._moveRouteForcing = true;this._waitCount = 0;};Game_Character.prototype.updateStop = function(){Game_CharacterBase.prototype.updateStop.call(this);if(this._moveRouteForcing){this.updateRoutineMove();}};Game_Character.prototype.updateRoutineMove = function(){if(this._waitCount > 0){this._waitCount--;}else {this.setMovementSuccess(true);var command=this._moveRoute.list[this._moveRouteIndex];if(command){this.processMoveCommand(command);this.advanceMoveRouteIndex();}}};Game_Character.prototype.processMoveCommand = function(command){var gc=Game_Character;var params=command.parameters;switch(command.code){case gc.ROUTE_END:this.processRouteEnd();break;case gc.ROUTE_MOVE_DOWN:this.moveStraight(2);break;case gc.ROUTE_MOVE_LEFT:this.moveStraight(4);break;case gc.ROUTE_MOVE_RIGHT:this.moveStraight(6);break;case gc.ROUTE_MOVE_UP:this.moveStraight(8);break;case gc.ROUTE_MOVE_LOWER_L:this.moveDiagonally(4,2);break;case gc.ROUTE_MOVE_LOWER_R:this.moveDiagonally(6,2);break;case gc.ROUTE_MOVE_UPPER_L:this.moveDiagonally(4,8);break;case gc.ROUTE_MOVE_UPPER_R:this.moveDiagonally(6,8);break;case gc.ROUTE_MOVE_RANDOM:this.moveRandom();break;case gc.ROUTE_MOVE_TOWARD:this.moveTowardPlayer();break;case gc.ROUTE_MOVE_AWAY:this.moveAwayFromPlayer();break;case gc.ROUTE_MOVE_FORWARD:this.moveForward();break;case gc.ROUTE_MOVE_BACKWARD:this.moveBackward();break;case gc.ROUTE_JUMP:this.jump(params[0],params[1]);break;case gc.ROUTE_WAIT:this._waitCount = params[0] - 1;break;case gc.ROUTE_TURN_DOWN:this.setDirection(2);break;case gc.ROUTE_TURN_LEFT:this.setDirection(4);break;case gc.ROUTE_TURN_RIGHT:this.setDirection(6);break;case gc.ROUTE_TURN_UP:this.setDirection(8);break;case gc.ROUTE_TURN_90D_R:this.turnRight90();break;case gc.ROUTE_TURN_90D_L:this.turnLeft90();break;case gc.ROUTE_TURN_180D:this.turn180();break;case gc.ROUTE_TURN_90D_R_L:this.turnRightOrLeft90();break;case gc.ROUTE_TURN_RANDOM:this.turnRandom();break;case gc.ROUTE_TURN_TOWARD:this.turnTowardPlayer();break;case gc.ROUTE_TURN_AWAY:this.turnAwayFromPlayer();break;case gc.ROUTE_SWITCH_ON:$gameSwitches.setValue(params[0],true);break;case gc.ROUTE_SWITCH_OFF:$gameSwitches.setValue(params[0],false);break;case gc.ROUTE_CHANGE_SPEED:this.setMoveSpeed(params[0]);break;case gc.ROUTE_CHANGE_FREQ:this.setMoveFrequency(params[0]);break;case gc.ROUTE_WALK_ANIME_ON:this.setWalkAnime(true);break;case gc.ROUTE_WALK_ANIME_OFF:this.setWalkAnime(false);break;case gc.ROUTE_STEP_ANIME_ON:this.setStepAnime(true);break;case gc.ROUTE_STEP_ANIME_OFF:this.setStepAnime(false);break;case gc.ROUTE_DIR_FIX_ON:this.setDirectionFix(true);break;case gc.ROUTE_DIR_FIX_OFF:this.setDirectionFix(false);break;case gc.ROUTE_THROUGH_ON:this.setThrough(true);break;case gc.ROUTE_THROUGH_OFF:this.setThrough(false);break;case gc.ROUTE_TRANSPARENT_ON:this.setTransparent(true);break;case gc.ROUTE_TRANSPARENT_OFF:this.setTransparent(false);break;case gc.ROUTE_CHANGE_IMAGE:this.setImage(params[0],params[1]);break;case gc.ROUTE_CHANGE_OPACITY:this.setOpacity(params[0]);break;case gc.ROUTE_CHANGE_BLEND_MODE:this.setBlendMode(params[0]);break;case gc.ROUTE_PLAY_SE:_managers.AudioManager.playSe(params[0]);break;case gc.ROUTE_SCRIPT:eval(params[0]);break;}};Game_Character.prototype.deltaXFrom = function(x){return $gameMap.deltaX(this.x,x);};Game_Character.prototype.deltaYFrom = function(y){return $gameMap.deltaY(this.y,y);};Game_Character.prototype.moveRandom = function(){var d=2 + Math.randomInt(4) * 2;if(this.canPass(this.x,this.y,d)){this.moveStraight(d);}};Game_Character.prototype.moveTowardCharacter = function(character){var sx=this.deltaXFrom(character.x);var sy=this.deltaYFrom(character.y);if(Math.abs(sx) > Math.abs(sy)){this.moveStraight(sx > 0?4:6);if(!this.isMovementSucceeded() && sy !== 0){this.moveStraight(sy > 0?8:2);}}else if(sy !== 0){this.moveStraight(sy > 0?8:2);if(!this.isMovementSucceeded() && sx !== 0){this.moveStraight(sx > 0?4:6);}}};Game_Character.prototype.moveAwayFromCharacter = function(character){var sx=this.deltaXFrom(character.x);var sy=this.deltaYFrom(character.y);if(Math.abs(sx) > Math.abs(sy)){this.moveStraight(sx > 0?6:4);if(!this.isMovementSucceeded() && sy !== 0){this.moveStraight(sy > 0?2:8);}}else if(sy !== 0){this.moveStraight(sy > 0?2:8);if(!this.isMovementSucceeded() && sx !== 0){this.moveStraight(sx > 0?6:4);}}};Game_Character.prototype.turnTowardCharacter = function(character){var sx=this.deltaXFrom(character.x);var sy=this.deltaYFrom(character.y);if(Math.abs(sx) > Math.abs(sy)){this.setDirection(sx > 0?4:6);}else if(sy !== 0){this.setDirection(sy > 0?8:2);}};Game_Character.prototype.turnAwayFromCharacter = function(character){var sx=this.deltaXFrom(character.x);var sy=this.deltaYFrom(character.y);if(Math.abs(sx) > Math.abs(sy)){this.setDirection(sx > 0?6:4);}else if(sy !== 0){this.setDirection(sy > 0?2:8);}};Game_Character.prototype.turnTowardPlayer = function(){this.turnTowardCharacter($gamePlayer);};Game_Character.prototype.turnAwayFromPlayer = function(){this.turnAwayFromCharacter($gamePlayer);};Game_Character.prototype.moveTowardPlayer = function(){this.moveTowardCharacter($gamePlayer);};Game_Character.prototype.moveAwayFromPlayer = function(){this.moveAwayFromCharacter($gamePlayer);};Game_Character.prototype.moveForward = function(){this.moveStraight(this.direction());};Game_Character.prototype.moveBackward = function(){var lastDirectionFix=this.isDirectionFixed();this.setDirectionFix(true);this.moveStraight(this.reverseDir(this.direction()));this.setDirectionFix(lastDirectionFix);};Game_Character.prototype.processRouteEnd = function(){if(this._moveRoute.repeat){this._moveRouteIndex = -1;}else if(this._moveRouteForcing){this._moveRouteForcing = false;this.restoreMoveRoute();}};Game_Character.prototype.advanceMoveRouteIndex = function(){var moveRoute=this._moveRoute;if(moveRoute && (this.isMovementSucceeded() || moveRoute.skippable)){var numCommands=moveRoute.list.length - 1;this._moveRouteIndex++;if(moveRoute.repeat && this._moveRouteIndex >= numCommands){this._moveRouteIndex = 0;}}};Game_Character.prototype.turnRight90 = function(){switch(this.direction()){case 2:this.setDirection(4);break;case 4:this.setDirection(8);break;case 6:this.setDirection(2);break;case 8:this.setDirection(6);break;}};Game_Character.prototype.turnLeft90 = function(){switch(this.direction()){case 2:this.setDirection(6);break;case 4:this.setDirection(2);break;case 6:this.setDirection(8);break;case 8:this.setDirection(4);break;}};Game_Character.prototype.turn180 = function(){this.setDirection(this.reverseDir(this.direction()));};Game_Character.prototype.turnRightOrLeft90 = function(){switch(Math.randomInt(2)){case 0:this.turnRight90();break;case 1:this.turnLeft90();break;}};Game_Character.prototype.turnRandom = function(){this.setDirection(2 + Math.randomInt(4) * 2);};Game_Character.prototype.swap = function(character){var newX=character.x;var newY=character.y;character.locate(this.x,this.y);this.locate(newX,newY);};Game_Character.prototype.findDirectionTo = function(goalX,goalY){var searchLimit=this.searchLimit();var mapWidth=$gameMap.width();var nodeList=[];var openList=[];var closedList=[];var start={};var best=start;if(this.x === goalX && this.y === goalY){return 0;}start.parent = null;start.x = this.x;start.y = this.y;start.g = 0;start.f = $gameMap.distance(start.x,start.y,goalX,goalY);nodeList.push(start);openList.push(start.y * mapWidth + start.x);while(nodeList.length > 0) {var bestIndex=0;for(var i=0;i < nodeList.length;i++) {if(nodeList[i].f < nodeList[bestIndex].f){bestIndex = i;}}var current=nodeList[bestIndex];var x1=current.x;var y1=current.y;var pos1=y1 * mapWidth + x1;var g1=current.g;nodeList.splice(bestIndex,1);openList.splice(openList.indexOf(pos1),1);closedList.push(pos1);if(current.x === goalX && current.y === goalY){best = current;goaled = true;break;}if(g1 >= searchLimit){continue;}for(var j=0;j < 4;j++) {var direction=2 + j * 2;var x2=$gameMap.roundXWithDirection(x1,direction);var y2=$gameMap.roundYWithDirection(y1,direction);var pos2=y2 * mapWidth + x2;if(closedList.contains(pos2)){continue;}if(!this.canPass(x1,y1,direction)){continue;}var g2=g1 + 1;var index2=openList.indexOf(pos2);if(index2 < 0 || g2 < nodeList[index2].g){var neighbor;if(index2 >= 0){neighbor = nodeList[index2];}else {neighbor = {};nodeList.push(neighbor);openList.push(pos2);}neighbor.parent = current;neighbor.x = x2;neighbor.y = y2;neighbor.g = g2;neighbor.f = g2 + $gameMap.distance(x2,y2,goalX,goalY);if(!best || neighbor.f - neighbor.g < best.f - best.g){best = neighbor;}}}}var node=best;while(node.parent && node.parent !== start) {node = node.parent;}var deltaX1=$gameMap.deltaX(node.x,start.x);var deltaY1=$gameMap.deltaY(node.y,start.y);if(deltaY1 > 0){return 2;}else if(deltaX1 < 0){return 4;}else if(deltaX1 > 0){return 6;}else if(deltaY1 < 0){return 8;}var deltaX2=this.deltaXFrom(goalX);var deltaY2=this.deltaYFrom(goalY);if(Math.abs(deltaX2) > Math.abs(deltaY2)){return deltaX2 > 0?4:6;}else if(deltaY2 !== 0){return deltaY2 > 0?8:2;}return 0;};Game_Character.prototype.searchLimit = function(){return 12;}; //-----------------------------------------------------------------------------
// Game_Player
//
// The game object class for the player. It contains event starting
// determinants and map scrolling functions.
function Game_Player(){this.initialize.apply(this,arguments);}Game_Player.prototype = Object.create(Game_Character.prototype);Game_Player.prototype.constructor = Game_Player;Game_Player.prototype.initialize = function(){Game_Character.prototype.initialize.call(this);this.setTransparent($dataSystem.optTransparent);};Game_Player.prototype.initMembers = function(){Game_Character.prototype.initMembers.call(this);this._vehicleType = 'walk';this._vehicleGettingOn = false;this._vehicleGettingOff = false;this._dashing = false;this._needsMapReload = false;this._transferring = false;this._newMapId = 0;this._newX = 0;this._newY = 0;this._newDirection = 0;this._fadeType = 0;this._followers = new Game_Followers();this._encounterCount = 0;};Game_Player.prototype.clearTransferInfo = function(){this._transferring = false;this._newMapId = 0;this._newX = 0;this._newY = 0;this._newDirection = 0;};Game_Player.prototype.followers = function(){return this._followers;};Game_Player.prototype.refresh = function(){var actor=$gameParty.leader();var characterName=actor?actor.characterName():'';var characterIndex=actor?actor.characterIndex():0;this.setImage(characterName,characterIndex);this._followers.refresh();};Game_Player.prototype.isStopping = function(){if(this._vehicleGettingOn || this._vehicleGettingOff){return false;}return Game_Character.prototype.isStopping.call(this);};Game_Player.prototype.reserveTransfer = function(mapId,x,y,d,fadeType){this._transferring = true;this._newMapId = mapId;this._newX = x;this._newY = y;this._newDirection = d;this._fadeType = fadeType;};Game_Player.prototype.requestMapReload = function(){this._needsMapReload = true;};Game_Player.prototype.isTransferring = function(){return this._transferring;};Game_Player.prototype.newMapId = function(){return this._newMapId;};Game_Player.prototype.fadeType = function(){return this._fadeType;};Game_Player.prototype.performTransfer = function(){if(this.isTransferring()){this.setDirection(this._newDirection);if(this._newMapId !== $gameMap.mapId() || this._needsMapReload){$gameMap.setup(this._newMapId);this._needsMapReload = false;}this.locate(this._newX,this._newY);this.refresh();this.clearTransferInfo();}};Game_Player.prototype.isMapPassable = function(x,y,d){var vehicle=this.vehicle();if(vehicle){return vehicle.isMapPassable(x,y,d);}else {return Game_Character.prototype.isMapPassable.call(this,x,y,d);}};Game_Player.prototype.vehicle = function(){return $gameMap.vehicle(this._vehicleType);};Game_Player.prototype.isInBoat = function(){return this._vehicleType === 'boat';};Game_Player.prototype.isInShip = function(){return this._vehicleType === 'ship';};Game_Player.prototype.isInAirship = function(){return this._vehicleType === 'airship';};Game_Player.prototype.isInVehicle = function(){return this.isInBoat() || this.isInShip() || this.isInAirship();};Game_Player.prototype.isNormal = function(){return this._vehicleType === 'walk' && !this.isMoveRouteForcing();};Game_Player.prototype.isDashing = function(){return this._dashing;};Game_Player.prototype.isDebugThrough = function(){return _core.Input.isPressed('control') && $gameTemp.isPlaytest();};Game_Player.prototype.isCollided = function(x,y){if(this.isThrough()){return false;}else {return this.pos(x,y) || this._followers.isSomeoneCollided(x,y);}};Game_Player.prototype.centerX = function(){return (_core.Graphics.width / $gameMap.tileWidth() - 1) / 2.0;};Game_Player.prototype.centerY = function(){return (_core.Graphics.height / $gameMap.tileHeight() - 1) / 2.0;};Game_Player.prototype.center = function(x,y){return $gameMap.setDisplayPos(x - this.centerX(),y - this.centerY());};Game_Player.prototype.locate = function(x,y){Game_Character.prototype.locate.call(this,x,y);this.center(x,y);this.makeEncounterCount();if(this.isInVehicle()){this.vehicle().refresh();}this._followers.synchronize(x,y,this.direction());};Game_Player.prototype.increaseSteps = function(){Game_Character.prototype.increaseSteps.call(this);if(this.isNormal()){$gameParty.increaseSteps();}};Game_Player.prototype.makeEncounterCount = function(){var n=$gameMap.encounterStep();this._encounterCount = Math.randomInt(n) + Math.randomInt(n) + 1;};Game_Player.prototype.makeEncounterTroopId = function(){var encounterList=[];var weightSum=0;$gameMap.encounterList().forEach(function(encounter){if(this.meetsEncounterConditions(encounter)){encounterList.push(encounter);weightSum += encounter.weight;}},this);if(weightSum > 0){var value=Math.randomInt(weightSum);for(var i=0;i < encounterList.length;i++) {value -= encounterList[i].weight;if(value < 0){return encounterList[i].troopId;}}}return 0;};Game_Player.prototype.meetsEncounterConditions = function(encounter){return encounter.regionSet.length === 0 || encounter.regionSet.contains(this.regionId());};Game_Player.prototype.executeEncounter = function(){if(!$gameMap.isEventRunning() && this._encounterCount <= 0){this.makeEncounterCount();var troopId=this.makeEncounterTroopId();if($dataTroops[troopId]){BattleManager.setup(troopId,true,false);BattleManager.onEncounter();return true;}else {return false;}}else {return false;}};Game_Player.prototype.startMapEvent = function(x,y,triggers,normal){if(!$gameMap.isEventRunning()){$gameMap.eventsXy(x,y).forEach(function(event){if(event.isTriggerIn(triggers) && event.isNormalPriority() === normal){event.start();}});}};Game_Player.prototype.moveByInput = function(){if(!this.isMoving() && this.canMove()){var direction=this.getInputDirection();if(direction > 0){$gameTemp.clearDestination();}else if($gameTemp.isDestinationValid()){var x=$gameTemp.destinationX();var y=$gameTemp.destinationY();direction = this.findDirectionTo(x,y);}if(direction > 0){this.executeMove(direction);}}};Game_Player.prototype.canMove = function(){if($gameMap.isEventRunning() || $gameMessage.isBusy()){return false;}if(this.isMoveRouteForcing() || this.areFollowersGathering()){return false;}if(this._vehicleGettingOn || this._vehicleGettingOff){return false;}if(this.isInVehicle() && !this.vehicle().canMove()){return false;}return true;};Game_Player.prototype.getInputDirection = function(){return _core.Input.dir4;};Game_Player.prototype.executeMove = function(direction){this.moveStraight(direction);};Game_Player.prototype.update = function(sceneActive){var lastScrolledX=this.scrolledX();var lastScrolledY=this.scrolledY();var wasMoving=this.isMoving();this.updateDashing();if(sceneActive){this.moveByInput();}Game_Character.prototype.update.call(this);this.updateScroll(lastScrolledX,lastScrolledY);this.updateVehicle();if(!this.isMoving()){this.updateNonmoving(wasMoving);}this._followers.update();};Game_Player.prototype.updateDashing = function(){if(this.isMoving()){return;}if(this.canMove() && !this.isInVehicle() && !$gameMap.isDashDisabled()){this._dashing = this.isDashButtonPressed() || $gameTemp.isDestinationValid();}else {this._dashing = false;}};Game_Player.prototype.isDashButtonPressed = function(){var shift=_core.Input.isPressed('shift');if(_managers.ConfigManager.alwaysDash){return !shift;}else {return shift;}};Game_Player.prototype.updateScroll = function(lastScrolledX,lastScrolledY){var x1=lastScrolledX;var y1=lastScrolledY;var x2=this.scrolledX();var y2=this.scrolledY();if(y2 > y1 && y2 > this.centerY()){$gameMap.scrollDown(y2 - y1);}if(x2 < x1 && x2 < this.centerX()){$gameMap.scrollLeft(x1 - x2);}if(x2 > x1 && x2 > this.centerX()){$gameMap.scrollRight(x2 - x1);}if(y2 < y1 && y2 < this.centerY()){$gameMap.scrollUp(y1 - y2);}};Game_Player.prototype.updateVehicle = function(){if(this.isInVehicle() && !this.areFollowersGathering()){if(this._vehicleGettingOn){this.updateVehicleGetOn();}else if(this._vehicleGettingOff){this.updateVehicleGetOff();}else {this.vehicle().syncWithPlayer();}}};Game_Player.prototype.updateVehicleGetOn = function(){if(!this.areFollowersGathering() && !this.isMoving()){this.setDirection(this.vehicle().direction());this.setMoveSpeed(this.vehicle().moveSpeed());this._vehicleGettingOn = false;this.setTransparent(true);if(this.isInAirship()){this.setThrough(true);}this.vehicle().getOn();}};Game_Player.prototype.updateVehicleGetOff = function(){if(!this.areFollowersGathering() && this.vehicle().isLowest()){this._vehicleGettingOff = false;this._vehicleType = 'walk';this.setTransparent(false);}};Game_Player.prototype.updateNonmoving = function(wasMoving){if(!$gameMap.isEventRunning()){if(wasMoving){$gameParty.onPlayerWalk();this.checkEventTriggerHere([1,2]);if($gameMap.setupStartingEvent()){return;}}if(this.triggerAction()){return;}if(wasMoving){this.updateEncounterCount();}else {$gameTemp.clearDestination();}}};Game_Player.prototype.triggerAction = function(){if(this.canMove()){if(this.triggerButtonAction()){return true;}if(this.triggerTouchAction()){return true;}}return false;};Game_Player.prototype.triggerButtonAction = function(){if(_core.Input.isTriggered('ok')){if(this.getOnOffVehicle()){return true;}this.checkEventTriggerHere([0]);if($gameMap.setupStartingEvent()){return true;}this.checkEventTriggerThere([0,1,2]);if($gameMap.setupStartingEvent()){return true;}}return false;};Game_Player.prototype.triggerTouchAction = function(){if($gameTemp.isDestinationValid()){var direction=this.direction();var x1=this.x;var y1=this.y;var x2=$gameMap.roundXWithDirection(x1,direction);var y2=$gameMap.roundYWithDirection(y1,direction);var x3=$gameMap.roundXWithDirection(x2,direction);var y3=$gameMap.roundYWithDirection(y2,direction);var destX=$gameTemp.destinationX();var destY=$gameTemp.destinationY();if(destX === x1 && destY === y1){return this.triggerTouchActionD1(x1,y1);}else if(destX === x2 && destY === y2){return this.triggerTouchActionD2(x2,y2);}else if(destX === x3 && destY === y3){return this.triggerTouchActionD3(x2,y2);}}return false;};Game_Player.prototype.triggerTouchActionD1 = function(x1,y1){if($gameMap.airship().pos(x1,y1)){if(TouchInput.isTriggered() && this.getOnOffVehicle()){return true;}}this.checkEventTriggerHere([0]);return $gameMap.setupStartingEvent();};Game_Player.prototype.triggerTouchActionD2 = function(x2,y2){if($gameMap.boat().pos(x2,y2) || $gameMap.ship().pos(x2,y2)){if(TouchInput.isTriggered() && this.getOnVehicle()){return true;}}if(this.isInBoat() || this.isInShip()){if(TouchInput.isTriggered() && this.getOffVehicle()){return true;}}this.checkEventTriggerThere([0,1,2]);return $gameMap.setupStartingEvent();};Game_Player.prototype.triggerTouchActionD3 = function(x2,y2){if($gameMap.isCounter(x2,y2)){this.checkEventTriggerThere([0,1,2]);}return $gameMap.setupStartingEvent();};Game_Player.prototype.updateEncounterCount = function(){if(this.canEncounter()){this._encounterCount -= this.encounterProgressValue();}};Game_Player.prototype.canEncounter = function(){return !$gameParty.hasEncounterNone() && $gameSystem.isEncounterEnabled() && !this.isInAirship() && !this.isMoveRouteForcing() && !this.isDebugThrough();};Game_Player.prototype.encounterProgressValue = function(){var value=$gameMap.isBush(this.x,this.y)?2:1;if($gameParty.hasEncounterHalf()){value *= 0.5;}if(this.isInShip()){value *= 0.5;}return value;};Game_Player.prototype.checkEventTriggerHere = function(triggers){if(this.canStartLocalEvents()){this.startMapEvent(this.x,this.y,triggers,false);}};Game_Player.prototype.checkEventTriggerThere = function(triggers){if(this.canStartLocalEvents()){var direction=this.direction();var x1=this.x;var y1=this.y;var x2=$gameMap.roundXWithDirection(x1,direction);var y2=$gameMap.roundYWithDirection(y1,direction);this.startMapEvent(x2,y2,triggers,true);if(!$gameMap.isAnyEventStarting() && $gameMap.isCounter(x2,y2)){var x3=$gameMap.roundXWithDirection(x2,direction);var y3=$gameMap.roundYWithDirection(y2,direction);this.startMapEvent(x3,y3,triggers,true);}}};Game_Player.prototype.checkEventTriggerTouch = function(x,y){if(this.canStartLocalEvents()){this.startMapEvent(x,y,[1,2],true);}};Game_Player.prototype.canStartLocalEvents = function(){return !this.isInAirship();};Game_Player.prototype.getOnOffVehicle = function(){if(this.isInVehicle()){return this.getOffVehicle();}else {return this.getOnVehicle();}};Game_Player.prototype.getOnVehicle = function(){var direction=this.direction();var x1=this.x;var y1=this.y;var x2=$gameMap.roundXWithDirection(x1,direction);var y2=$gameMap.roundYWithDirection(y1,direction);if($gameMap.airship().pos(x1,y1)){this._vehicleType = 'airship';}else if($gameMap.ship().pos(x2,y2)){this._vehicleType = 'ship';}else if($gameMap.boat().pos(x2,y2)){this._vehicleType = 'boat';}if(this.isInVehicle()){this._vehicleGettingOn = true;if(!this.isInAirship()){this.forceMoveForward();}this.gatherFollowers();}return this._vehicleGettingOn;};Game_Player.prototype.getOffVehicle = function(){if(this.vehicle().isLandOk(this.x,this.y,this.direction())){if(this.isInAirship()){this.setDirection(2);}this._followers.synchronize(this.x,this.y,this.direction());this.vehicle().getOff();if(!this.isInAirship()){this.forceMoveForward();this.setTransparent(false);}this._vehicleGettingOff = true;this.setMoveSpeed(4);this.setThrough(false);this.makeEncounterCount();this.gatherFollowers();}return this._vehicleGettingOff;};Game_Player.prototype.forceMoveForward = function(){this.setThrough(true);this.moveForward();this.setThrough(false);};Game_Player.prototype.isOnDamageFloor = function(){return $gameMap.isDamageFloor(this.x,this.y) && !this.isInAirship();};Game_Player.prototype.moveStraight = function(d){if(this.canPass(this.x,this.y,d)){this._followers.updateMove();}Game_Character.prototype.moveStraight.call(this,d);};Game_Player.prototype.moveDiagonally = function(horz,vert){if(this.canPassDiagonally(this.x,this.y,horz,vert)){this._followers.updateMove();}Game_Character.prototype.moveDiagonally.call(this,horz,vert);};Game_Player.prototype.jump = function(xPlus,yPlus){Game_Character.prototype.jump.call(this,xPlus,yPlus);this._followers.jumpAll();};Game_Player.prototype.showFollowers = function(){this._followers.show();};Game_Player.prototype.hideFollowers = function(){this._followers.hide();};Game_Player.prototype.gatherFollowers = function(){this._followers.gather();};Game_Player.prototype.areFollowersGathering = function(){return this._followers.areGathering();};Game_Player.prototype.areFollowersGathered = function(){return this._followers.areGathered();}; //-----------------------------------------------------------------------------
// Game_Follower
//
// The game object class for a follower. A follower is an allied character,
// other than the front character, displayed in the party.
function Game_Follower(){this.initialize.apply(this,arguments);}Game_Follower.prototype = Object.create(Game_Character.prototype);Game_Follower.prototype.constructor = Game_Follower;Game_Follower.prototype.initialize = function(memberIndex){Game_Character.prototype.initialize.call(this);this._memberIndex = memberIndex;this.setTransparent($dataSystem.optTransparent);this.setThrough(true);};Game_Follower.prototype.refresh = function(){var characterName=this.isVisible()?this.actor().characterName():'';var characterIndex=this.isVisible()?this.actor().characterIndex():0;this.setImage(characterName,characterIndex);};Game_Follower.prototype.actor = function(){return $gameParty.battleMembers()[this._memberIndex];};Game_Follower.prototype.isVisible = function(){return this.actor() && $gamePlayer.followers().isVisible();};Game_Follower.prototype.update = function(){Game_Character.prototype.update.call(this);this.setMoveSpeed($gamePlayer.realMoveSpeed());this.setOpacity($gamePlayer.opacity());this.setBlendMode($gamePlayer.blendMode());this.setWalkAnime($gamePlayer.hasWalkAnime());this.setStepAnime($gamePlayer.hasStepAnime());this.setDirectionFix($gamePlayer.isDirectionFixed());this.setTransparent($gamePlayer.isTransparent());};Game_Follower.prototype.chaseCharacter = function(character){var sx=this.deltaXFrom(character.x);var sy=this.deltaYFrom(character.y);if(sx !== 0 && sy !== 0){this.moveDiagonally(sx > 0?4:6,sy > 0?8:2);}else if(sx !== 0){this.moveStraight(sx > 0?4:6);}else if(sy !== 0){this.moveStraight(sy > 0?8:2);}this.setMoveSpeed($gamePlayer.realMoveSpeed());}; //-----------------------------------------------------------------------------
// Game_Followers
//
// The wrapper class for a follower array.
function Game_Followers(){this.initialize.apply(this,arguments);}Game_Followers.prototype.initialize = function(){this._visible = $dataSystem.optFollowers;this._gathering = false;this._data = [];for(var i=1;i < $gameParty.maxBattleMembers();i++) {this._data.push(new Game_Follower(i));}};Game_Followers.prototype.isVisible = function(){return this._visible;};Game_Followers.prototype.show = function(){this._visible = true;};Game_Followers.prototype.hide = function(){this._visible = false;};Game_Followers.prototype.follower = function(index){return this._data[index];};Game_Followers.prototype.forEach = function(callback,thisObject){this._data.forEach(callback,thisObject);};Game_Followers.prototype.reverseEach = function(callback,thisObject){this._data.reverse();this._data.forEach(callback,thisObject);this._data.reverse();};Game_Followers.prototype.refresh = function(){this.forEach(function(follower){return follower.refresh();},this);};Game_Followers.prototype.update = function(){if(this.areGathering()){if(!this.areMoving()){this.updateMove();}if(this.areGathered()){this._gathering = false;}}this.forEach(function(follower){follower.update();},this);};Game_Followers.prototype.updateMove = function(){for(var i=this._data.length - 1;i >= 0;i--) {var precedingCharacter=i > 0?this._data[i - 1]:$gamePlayer;this._data[i].chaseCharacter(precedingCharacter);}};Game_Followers.prototype.jumpAll = function(){if($gamePlayer.isJumping()){for(var i=0;i < this._data.length;i++) {var follower=this._data[i];var sx=$gamePlayer.deltaXFrom(follower.x);var sy=$gamePlayer.deltaYFrom(follower.y);follower.jump(sx,sy);}}};Game_Followers.prototype.synchronize = function(x,y,d){this.forEach(function(follower){follower.locate(x,y);follower.setDirection(d);},this);};Game_Followers.prototype.gather = function(){this._gathering = true;};Game_Followers.prototype.areGathering = function(){return this._gathering;};Game_Followers.prototype.visibleFollowers = function(){return this._data.filter(function(follower){return follower.isVisible();},this);};Game_Followers.prototype.areMoving = function(){return this.visibleFollowers().some(function(follower){return follower.isMoving();},this);};Game_Followers.prototype.areGathered = function(){return this.visibleFollowers().every(function(follower){return !follower.isMoving() && follower.pos($gamePlayer.x,$gamePlayer.y);},this);};Game_Followers.prototype.isSomeoneCollided = function(x,y){return this.visibleFollowers().some(function(follower){return follower.pos(x,y);},this);}; //-----------------------------------------------------------------------------
// Game_Vehicle
//
// The game object class for a vehicle.
function Game_Vehicle(){this.initialize.apply(this,arguments);}Game_Vehicle.prototype = Object.create(Game_Character.prototype);Game_Vehicle.prototype.constructor = Game_Vehicle;Game_Vehicle.prototype.initialize = function(type){Game_Character.prototype.initialize.call(this);this._type = type;this.resetDirection();this.initMoveSpeed();this.loadSystemSettings();};Game_Vehicle.prototype.initMembers = function(){Game_Character.prototype.initMembers.call(this);this._type = '';this._mapId = 0;this._altitude = 0;this._driving = false;this._bgm = null;};Game_Vehicle.prototype.isBoat = function(){return this._type === 'boat';};Game_Vehicle.prototype.isShip = function(){return this._type === 'ship';};Game_Vehicle.prototype.isAirship = function(){return this._type === 'airship';};Game_Vehicle.prototype.resetDirection = function(){this.setDirection(4);};Game_Vehicle.prototype.initMoveSpeed = function(){if(this.isBoat()){this.setMoveSpeed(4);}else if(this.isShip()){this.setMoveSpeed(5);}else if(this.isAirship()){this.setMoveSpeed(6);}};Game_Vehicle.prototype.vehicle = function(){if(this.isBoat()){return $dataSystem.boat;}else if(this.isShip()){return $dataSystem.ship;}else if(this.isAirship()){return $dataSystem.airship;}else {return null;}};Game_Vehicle.prototype.loadSystemSettings = function(){var vehicle=this.vehicle();this._mapId = vehicle.startMapId;this.setPosition(vehicle.startX,vehicle.startY);this.setImage(vehicle.characterName,vehicle.characterIndex);};Game_Vehicle.prototype.refresh = function(){if(this._driving){this._mapId = $gameMap.mapId();this.syncWithPlayer();}else if(this._mapId === $gameMap.mapId()){this.locate(this.x,this.y);}if(this.isAirship()){this.setPriorityType(this._driving?2:0);}else {this.setPriorityType(1);}this.setWalkAnime(this._driving);this.setStepAnime(this._driving);this.setTransparent(this._mapId !== $gameMap.mapId());};Game_Vehicle.prototype.setLocation = function(mapId,x,y){this._mapId = mapId;this.setPosition(x,y);this.refresh();};Game_Vehicle.prototype.pos = function(x,y){if(this._mapId === $gameMap.mapId()){return Game_Character.prototype.pos.call(this,x,y);}else {return false;}};Game_Vehicle.prototype.isMapPassable = function(x,y,d){var x2=$gameMap.roundXWithDirection(x,d);var y2=$gameMap.roundYWithDirection(y,d);if(this.isBoat()){return $gameMap.isBoatPassable(x2,y2);}else if(this.isShip()){return $gameMap.isShipPassable(x2,y2);}else if(this.isAirship()){return true;}else {return false;}};Game_Vehicle.prototype.getOn = function(){this._driving = true;this.setWalkAnime(true);this.setStepAnime(true);$gameSystem.saveWalkingBgm();this.playBgm();};Game_Vehicle.prototype.getOff = function(){this._driving = false;this.setWalkAnime(false);this.setStepAnime(false);this.resetDirection();$gameSystem.replayWalkingBgm();};Game_Vehicle.prototype.setBgm = function(bgm){this._bgm = bgm;};Game_Vehicle.prototype.playBgm = function(){_managers.AudioManager.playBgm(this._bgm || this.vehicle().bgm);};Game_Vehicle.prototype.syncWithPlayer = function(){this.copyPosition($gamePlayer);this.refreshBushDepth();};Game_Vehicle.prototype.screenY = function(){return Game_Character.prototype.screenY.call(this) - this._altitude;};Game_Vehicle.prototype.shadowX = function(){return this.screenX();};Game_Vehicle.prototype.shadowY = function(){return this.screenY() + this._altitude;};Game_Vehicle.prototype.shadowOpacity = function(){return 255 * this._altitude / this.maxAltitude();};Game_Vehicle.prototype.canMove = function(){if(this.isAirship()){return this.isHighest();}else {return true;}};Game_Vehicle.prototype.update = function(){Game_Character.prototype.update.call(this);if(this.isAirship()){this.updateAirship();}};Game_Vehicle.prototype.updateAirship = function(){this.updateAirshipAltitude();this.setStepAnime(this.isHighest());this.setPriorityType(this.isLowest()?0:2);};Game_Vehicle.prototype.updateAirshipAltitude = function(){if(this._driving && !this.isHighest()){this._altitude++;}if(!this._driving && !this.isLowest()){this._altitude--;}};Game_Vehicle.prototype.maxAltitude = function(){return 48;};Game_Vehicle.prototype.isLowest = function(){return this._altitude <= 0;};Game_Vehicle.prototype.isHighest = function(){return this._altitude >= this.maxAltitude();};Game_Vehicle.prototype.isTakeoffOk = function(){return $gamePlayer.areFollowersGathered();};Game_Vehicle.prototype.isLandOk = function(x,y,d){if(this.isAirship()){if(!$gameMap.isAirshipLandOk(x,y)){return false;}if($gameMap.eventsXy(x,y).length > 0){return false;}}else {var x2=$gameMap.roundXWithDirection(x,d);var y2=$gameMap.roundYWithDirection(y,d);if(!$gameMap.isValid(x2,y2)){return false;}if(!$gameMap.isPassable(x2,y2,this.reverseDir(d))){return false;}if(this.isCollidedWithCharacters(x2,y2)){return false;}}return true;}; //-----------------------------------------------------------------------------
// Game_Event
//
// The game object class for an event. It contains functionality for event page
// switching and running parallel process events.
function Game_Event(){this.initialize.apply(this,arguments);}Game_Event.prototype = Object.create(Game_Character.prototype);Game_Event.prototype.constructor = Game_Event;Game_Event.prototype.initialize = function(mapId,eventId){Game_Character.prototype.initialize.call(this);this._mapId = mapId;this._eventId = eventId;this.locate(this.event().x,this.event().y);this.refresh();};Game_Event.prototype.initMembers = function(){Game_Character.prototype.initMembers.call(this);this._moveType = 0;this._trigger = 0;this._starting = false;this._erased = false;this._pageIndex = -2;this._originalPattern = 1;this._originalDirection = 2;this._prelockDirection = 0;this._locked = false;};Game_Event.prototype.eventId = function(){return this._eventId;};Game_Event.prototype.event = function(){return $dataMap.events[this._eventId];};Game_Event.prototype.page = function(){return this.event().pages[this._pageIndex];};Game_Event.prototype.list = function(){return this.page().list;};Game_Event.prototype.isCollidedWithCharacters = function(x,y){return Game_Character.prototype.isCollidedWithCharacters.call(this,x,y) || this.isCollidedWithPlayerCharacters(x,y);};Game_Event.prototype.isCollidedWithEvents = function(x,y){var events=$gameMap.eventsXyNt(x,y);return events.length > 0;};Game_Event.prototype.isCollidedWithPlayerCharacters = function(x,y){return this.isNormalPriority() && $gamePlayer.isCollided(x,y);};Game_Event.prototype.lock = function(){if(!this._locked){this._prelockDirection = this.direction();this.turnTowardPlayer();this._locked = true;}};Game_Event.prototype.unlock = function(){if(this._locked){this._locked = false;this.setDirection(this._prelockDirection);}};Game_Event.prototype.updateStop = function(){if(this._locked){this.resetStopCount();}Game_Character.prototype.updateStop.call(this);if(!this.isMoveRouteForcing()){this.updateSelfMovement();}};Game_Event.prototype.updateSelfMovement = function(){if(!this._locked && this.isNearTheScreen() && this.checkStop(this.stopCountThreshold())){switch(this._moveType){case 1:this.moveTypeRandom();break;case 2:this.moveTypeTowardPlayer();break;case 3:this.moveTypeCustom();break;}}};Game_Event.prototype.stopCountThreshold = function(){return 30 * (5 - this.moveFrequency());};Game_Event.prototype.moveTypeRandom = function(){switch(Math.randomInt(6)){case 0:case 1:this.moveRandom();break;case 2:case 3:case 4:this.moveForward();break;case 5:this.resetStopCount();break;}};Game_Event.prototype.moveTypeTowardPlayer = function(){if(this.isNearThePlayer()){switch(Math.randomInt(6)){case 0:case 1:case 2:case 3:this.moveTowardPlayer();break;case 4:this.moveRandom();break;case 5:this.moveForward();break;}}else {this.moveRandom();}};Game_Event.prototype.isNearThePlayer = function(){var sx=Math.abs(this.deltaXFrom($gamePlayer.x));var sy=Math.abs(this.deltaYFrom($gamePlayer.y));return sx + sy < 20;};Game_Event.prototype.moveTypeCustom = function(){this.updateRoutineMove();};Game_Event.prototype.isStarting = function(){return this._starting;};Game_Event.prototype.clearStartingFlag = function(){this._starting = false;};Game_Event.prototype.isTriggerIn = function(triggers){return triggers.contains(this._trigger);};Game_Event.prototype.start = function(){var list=this.list();if(list && list.length > 1){this._starting = true;if(this.isTriggerIn([0,1,2])){this.lock();}}};Game_Event.prototype.erase = function(){this._erased = true;this.refresh();};Game_Event.prototype.refresh = function(){var newPageIndex=this._erased?-1:this.findProperPageIndex();if(this._pageIndex !== newPageIndex){this._pageIndex = newPageIndex;this.setupPage();}};Game_Event.prototype.findProperPageIndex = function(){var pages=this.event().pages;for(var i=pages.length - 1;i >= 0;i--) {var page=pages[i];if(this.meetsConditions(page)){return i;}}return -1;};Game_Event.prototype.meetsConditions = function(page){var c=page.conditions;if(c.switch1Valid){if(!$gameSwitches.value(c.switch1Id)){return false;}}if(c.switch2Valid){if(!$gameSwitches.value(c.switch2Id)){return false;}}if(c.variableValid){if($gameVariables.value(c.variableId) < c.variableValue){return false;}}if(c.selfSwitchValid){var key=[this._mapId,this._eventId,c.selfSwitchCh];if($gameSelfSwitches.value(key) !== true){return false;}}if(c.itemValid){var item=$dataItems[c.itemId];if(!$gameParty.hasItem(item)){return false;}}if(c.actorValid){var actor=$gameActors.actor(c.actorId);if(!$gameParty.members().contains(actor)){return false;}}return true;};Game_Event.prototype.setupPage = function(){if(this._pageIndex >= 0){this.setupPageSettings();}else {this.clearPageSettings();}this.refreshBushDepth();this.clearStartingFlag();this.checkEventTriggerAuto();};Game_Event.prototype.clearPageSettings = function(){this.setImage('',0);this._moveType = 0;this._trigger = null;this._interpreter = null;this.setThrough(true);};Game_Event.prototype.setupPageSettings = function(){var page=this.page();var image=page.image;if(image.tileId > 0){this.setTileImage(image.tileId);}else {this.setImage(image.characterName,image.characterIndex);}if(this._originalDirection !== image.direction){this._originalDirection = image.direction;this._prelockDirection = 0;this.setDirectionFix(false);this.setDirection(image.direction);}if(this._originalPattern !== image.pattern){this._originalPattern = image.pattern;this.setPattern(image.pattern);}this.setMoveSpeed(page.moveSpeed);this.setMoveFrequency(page.moveFrequency);this.setPriorityType(page.priorityType);this.setWalkAnime(page.walkAnime);this.setStepAnime(page.stepAnime);this.setDirectionFix(page.directionFix);this.setThrough(page.through);this.setMoveRoute(page.moveRoute);this._moveType = page.moveType;this._trigger = page.trigger;if(this._trigger === 4){this._interpreter = new Game_Interpreter();}else {this._interpreter = null;}};Game_Event.prototype.isOriginalPattern = function(){return this.pattern() === this._originalPattern;};Game_Event.prototype.resetPattern = function(){this.setPattern(this._originalPattern);};Game_Event.prototype.checkEventTriggerTouch = function(x,y){if(!$gameMap.isEventRunning()){if(this._trigger === 2 && $gamePlayer.pos(x,y)){if(!this.isJumping() && this.isNormalPriority()){this.start();}}}};Game_Event.prototype.checkEventTriggerAuto = function(){if(this._trigger === 3){this.start();}};Game_Event.prototype.update = function(){Game_Character.prototype.update.call(this);this.checkEventTriggerAuto();this.updateParallel();};Game_Event.prototype.updateParallel = function(){if(this._interpreter){if(!this._interpreter.isRunning()){this._interpreter.setup(this.list(),this._eventId);}this._interpreter.update();}};Game_Event.prototype.locate = function(x,y){Game_Character.prototype.locate.call(this,x,y);this._prelockDirection = 0;};Game_Event.prototype.forceMoveRoute = function(moveRoute){Game_Character.prototype.forceMoveRoute.call(this,moveRoute);this._prelockDirection = 0;}; //-----------------------------------------------------------------------------
// Game_Interpreter
//
// The interpreter for running event commands.
function Game_Interpreter(){this.initialize.apply(this,arguments);}Game_Interpreter.prototype.initialize = function(depth){this._depth = depth || 0;this.checkOverflow();this.clear();this._branch = {};this._params = [];this._indent = 0;this._frameCount = 0;this._freezeChecker = 0;};Game_Interpreter.prototype.checkOverflow = function(){if(this._depth >= 100){throw new Error('Common event calls exceeded the limit');}};Game_Interpreter.prototype.clear = function(){this._mapId = 0;this._eventId = 0;this._list = null;this._index = 0;this._waitCount = 0;this._waitMode = '';this._comments = '';this._character = null;this._childInterpreter = null;};Game_Interpreter.prototype.setup = function(list,eventId){this.clear();this._mapId = $gameMap.mapId();this._eventId = eventId || 0;this._list = list;};Game_Interpreter.prototype.eventId = function(){return this._eventId;};Game_Interpreter.prototype.isOnCurrentMap = function(){return this._mapId === $gameMap.mapId();};Game_Interpreter.prototype.setupReservedCommonEvent = function(){if($gameTemp.isCommonEventReserved()){this.setup($gameTemp.reservedCommonEvent().list);$gameTemp.clearCommonEvent();return true;}else {return false;}};Game_Interpreter.prototype.isRunning = function(){return !!this._list;};Game_Interpreter.prototype.update = function(){while(this.isRunning()) {if(this.updateChild() || this.updateWait()){break;}if(SceneManager.isSceneChanging()){break;}if(!this.executeCommand()){break;}if(this.checkFreeze()){break;}}};Game_Interpreter.prototype.updateChild = function(){if(this._childInterpreter){this._childInterpreter.update();if(this._childInterpreter.isRunning()){return true;}else {this._childInterpreter = null;}}return false;};Game_Interpreter.prototype.updateWait = function(){return this.updateWaitCount() || this.updateWaitMode();};Game_Interpreter.prototype.updateWaitCount = function(){if(this._waitCount > 0){this._waitCount--;return true;}return false;};Game_Interpreter.prototype.updateWaitMode = function(){var waiting=false;switch(this._waitMode){case 'message':waiting = $gameMessage.isBusy();break;case 'transfer':waiting = $gamePlayer.isTransferring();break;case 'scroll':waiting = $gameMap.isScrolling();break;case 'route':waiting = this._character.isMoveRouteForcing();break;case 'animation':waiting = this._character.isAnimationPlaying();break;case 'balloon':waiting = this._character.isBalloonPlaying();break;case 'gather':waiting = $gamePlayer.areFollowersGathering();break;case 'action':waiting = BattleManager.isActionForced();break;case 'video':waiting = _core.Graphics.isVideoPlaying();break;case 'image':waiting = !_managers.ImageManager.isReady();break;}if(!waiting){this._waitMode = '';}return waiting;};Game_Interpreter.prototype.setWaitMode = function(waitMode){this._waitMode = waitMode;};Game_Interpreter.prototype.wait = function(duration){this._waitCount = duration;};Game_Interpreter.prototype.fadeSpeed = function(){return 24;};Game_Interpreter.prototype.executeCommand = function(){var command=this.currentCommand();if(command){this._params = command.parameters;this._indent = command.indent;var methodName='command' + command.code;if(typeof this[methodName] === 'function'){if(!this[methodName]()){return false;}}this._index++;}else {this.terminate();}return true;};Game_Interpreter.prototype.checkFreeze = function(){if(this._frameCount !== _core.Graphics.frameCount){this._frameCount = _core.Graphics.frameCount;this._freezeChecker = 0;}if(this._freezeChecker++ >= 100000){return true;}else {return false;}};Game_Interpreter.prototype.terminate = function(){this._list = null;this._comments = '';};Game_Interpreter.prototype.skipBranch = function(){while(this._list[this._index + 1].indent > this._indent) {this._index++;}};Game_Interpreter.prototype.currentCommand = function(){return this._list[this._index];};Game_Interpreter.prototype.nextEventCode = function(){var command=this._list[this._index + 1];if(command){return command.code;}else {return 0;}};Game_Interpreter.prototype.iterateActorId = function(param,callback){if(param === 0){$gameParty.members().forEach(callback);}else {var actor=$gameActors.actor(param);if(actor){callback(actor);}}};Game_Interpreter.prototype.iterateActorEx = function(param1,param2,callback){if(param1 === 0){this.iterateActorId(param2,callback);}else {this.iterateActorId($gameVariables.value(param2),callback);}};Game_Interpreter.prototype.iterateActorIndex = function(param,callback){if(param < 0){$gameParty.members().forEach(callback);}else {var actor=$gameParty.members()[param];if(actor){callback(actor);}}};Game_Interpreter.prototype.iterateEnemyIndex = function(param,callback){if(param < 0){$gameTroop.members().forEach(callback);}else {var enemy=$gameTroop.members()[param];if(enemy){callback(enemy);}}};Game_Interpreter.prototype.iterateBattler = function(param1,param2,callback){if($gameParty.inBattle()){if(param1 === 0){this.iterateEnemyIndex(param2,callback);}else {this.iterateActorId(param2,callback);}}};Game_Interpreter.prototype.character = function(param){if($gameParty.inBattle()){return null;}else if(param < 0){return $gamePlayer;}else if(this.isOnCurrentMap()){return $gameMap.event(param > 0?param:this._eventId);}else {return null;}};Game_Interpreter.prototype.operateValue = function(operation,operandType,operand){var value=operandType === 0?operand:$gameVariables.value(operand);return operation === 0?value:-value;};Game_Interpreter.prototype.changeHp = function(target,value,allowDeath){if(target.isAlive()){if(!allowDeath && target.hp <= -value){value = 1 - target.hp;}target.gainHp(value);if(target.isDead()){target.performCollapse();}}}; // Show Text
Game_Interpreter.prototype.command101 = function(){if(!$gameMessage.isBusy()){$gameMessage.setFaceImage(this._params[0],this._params[1]);$gameMessage.setBackground(this._params[2]);$gameMessage.setPositionType(this._params[3]);while(this.nextEventCode() === 401) { // Text data
this._index++;$gameMessage.add(this.currentCommand().parameters[0]);}switch(this.nextEventCode()){case 102: // Show Choices
this._index++;this.setupChoices(this.currentCommand().parameters);break;case 103: // Input Number
this._index++;this.setupNumInput(this.currentCommand().parameters);break;case 104: // Select Item
this._index++;this.setupItemChoice(this.currentCommand().parameters);break;}this._index++;this.setWaitMode('message');}return false;}; // Show Choices
Game_Interpreter.prototype.command102 = function(){if(!$gameMessage.isBusy()){this.setupChoices(this._params);this._index++;this.setWaitMode('message');}return false;};Game_Interpreter.prototype.setupChoices = function(params){var choices=params[0].clone();var cancelType=params[1];var defaultType=params.length > 2?params[2]:0;var positionType=params.length > 3?params[3]:2;var background=params.length > 4?params[4]:0;if(cancelType >= choices.length){cancelType = -2;}$gameMessage.setChoices(choices,defaultType,cancelType);$gameMessage.setChoiceBackground(background);$gameMessage.setChoicePositionType(positionType);$gameMessage.setChoiceCallback((function(n){this._branch[this._indent] = n;}).bind(this));}; // When [**]
Game_Interpreter.prototype.command402 = function(){if(this._branch[this._indent] !== this._params[0]){this.skipBranch();}return true;}; // When Cancel
Game_Interpreter.prototype.command403 = function(){if(this._branch[this._indent] >= 0){this.skipBranch();}return true;}; // Input Number
Game_Interpreter.prototype.command103 = function(){if(!$gameMessage.isBusy()){this.setupNumInput(this._params);this._index++;this.setWaitMode('message');}return false;};Game_Interpreter.prototype.setupNumInput = function(params){$gameMessage.setNumberInput(params[0],params[1]);}; // Select Item
Game_Interpreter.prototype.command104 = function(){if(!$gameMessage.isBusy()){this.setupItemChoice(this._params);this._index++;this.setWaitMode('message');}return false;};Game_Interpreter.prototype.setupItemChoice = function(params){$gameMessage.setItemChoice(params[0],params[1] || 2);}; // Show Scrolling Text
Game_Interpreter.prototype.command105 = function(){if(!$gameMessage.isBusy()){$gameMessage.setScroll(this._params[0],this._params[1]);while(this.nextEventCode() === 405) {this._index++;$gameMessage.add(this.currentCommand().parameters[0]);}this._index++;this.setWaitMode('message');}return false;}; // Comment
Game_Interpreter.prototype.command108 = function(){this._comments = [this._params[0]];while(this.nextEventCode() === 408) {this._index++;this._comments.push(this.currentCommand().parameters[0]);}return true;}; // Conditional Branch
Game_Interpreter.prototype.command111 = function(){var result=false;switch(this._params[0]){case 0: // Switch
result = $gameSwitches.value(this._params[1]) === (this._params[2] === 0);break;case 1: // Variable
var value1=$gameVariables.value(this._params[1]);var value2;if(this._params[2] === 0){value2 = this._params[3];}else {value2 = $gameVariables.value(this._params[3]);}switch(this._params[4]){case 0: // Equal to
result = value1 === value2;break;case 1: // Greater than or Equal to
result = value1 >= value2;break;case 2: // Less than or Equal to
result = value1 <= value2;break;case 3: // Greater than
result = value1 > value2;break;case 4: // Less than
result = value1 < value2;break;case 5: // Not Equal to
result = value1 !== value2;break;}break;case 2: // Self Switch
if(this._eventId > 0){var key=[this._mapId,this._eventId,this._params[1]];result = $gameSelfSwitches.value(key) === (this._params[2] === 0);}break;case 3: // Timer
if($gameTimer.isWorking()){if(this._params[2] === 0){result = $gameTimer.seconds() >= this._params[1];}else {result = $gameTimer.seconds() <= this._params[1];}}break;case 4: // Actor
var actor=$gameActors.actor(this._params[1]);if(actor){var n=this._params[3];switch(this._params[2]){case 0: // In the Party
result = $gameParty.members().contains(actor);break;case 1: // Name
result = actor.name() === n;break;case 2: // Class
result = actor.isClass($dataClasses[n]);break;case 3: // Skill
result = actor.isLearnedSkill(n);break;case 4: // Weapon
result = actor.hasWeapon($dataWeapons[n]);break;case 5: // Armor
result = actor.hasArmor($dataArmors[n]);break;case 6: // State
result = actor.isStateAffected(n);break;}}break;case 5: // Enemy
var enemy=$gameTroop.members()[this._params[1]];if(enemy){switch(this._params[2]){case 0: // Appeared
result = enemy.isAlive();break;case 1: // State
result = enemy.isStateAffected(this._params[3]);break;}}break;case 6: // Character
var character=this.character(this._params[1]);if(character){result = character.direction() === this._params[2];}break;case 7: // Gold
switch(this._params[2]){case 0: // Greater than or equal to
result = $gameParty.gold() >= this._params[1];break;case 1: // Less than or equal to
result = $gameParty.gold() <= this._params[1];break;case 2: // Less than
result = $gameParty.gold() < this._params[1];break;}break;case 8: // Item
result = $gameParty.hasItem($dataItems[this._params[1]]);break;case 9: // Weapon
result = $gameParty.hasItem($dataWeapons[this._params[1]],this._params[2]);break;case 10: // Armor
result = $gameParty.hasItem($dataArmors[this._params[1]],this._params[2]);break;case 11: // Button
result = _core.Input.isPressed(this._params[1]);break;case 12: // Script
result = !!eval(this._params[1]);break;case 13: // Vehicle
result = $gamePlayer.vehicle() === $gameMap.vehicle(this._params[1]);break;}this._branch[this._indent] = result;if(this._branch[this._indent] === false){this.skipBranch();}return true;}; // Else
Game_Interpreter.prototype.command411 = function(){if(this._branch[this._indent] !== false){this.skipBranch();}return true;}; // Loop
Game_Interpreter.prototype.command112 = function(){return true;}; // Repeat Above
Game_Interpreter.prototype.command413 = function(){do {this._index--;}while(this.currentCommand().indent !== this._indent);return true;}; // Break Loop
Game_Interpreter.prototype.command113 = function(){while(this._index < this._list.length - 1) {this._index++;var command=this.currentCommand();if(command.code === 413 && command.indent < this._indent){break;}}return true;}; // Exit Event Processing
Game_Interpreter.prototype.command115 = function(){this._index = this._list.length;return true;}; // Common Event
Game_Interpreter.prototype.command117 = function(){var commonEvent=$dataCommonEvents[this._params[0]];if(commonEvent){var eventId=this.isOnCurrentMap()?this._eventId:0;this.setupChild(commonEvent.list,eventId);}return true;};Game_Interpreter.prototype.setupChild = function(list,eventId){this._childInterpreter = new Game_Interpreter(this._depth + 1);this._childInterpreter.setup(list,eventId);}; // Label
Game_Interpreter.prototype.command118 = function(){return true;}; // Jump to Label
Game_Interpreter.prototype.command119 = function(){var labelName=this._params[0];for(var i=0;i < this._list.length;i++) {var command=this._list[i];if(command.code === 118 && command.parameters[0] === labelName){this.jumpTo(i);return;}}return true;};Game_Interpreter.prototype.jumpTo = function(index){var lastIndex=this._index;var startIndex=Math.min(index,lastIndex);var endIndex=Math.max(index,lastIndex);var indent=this._indent;for(var i=startIndex;i <= endIndex;i++) {var newIndent=this._list[i].indent;if(newIndent !== indent){this._branch[indent] = null;indent = newIndent;}}this._index = index;}; // Control Switches
Game_Interpreter.prototype.command121 = function(){for(var i=this._params[0];i <= this._params[1];i++) {$gameSwitches.setValue(i,this._params[2] === 0);}return true;}; // Control Variables
Game_Interpreter.prototype.command122 = function(){var value=0;switch(this._params[3]){ // Operand
case 0: // Constant
value = this._params[4];break;case 1: // Variable
value = $gameVariables.value(this._params[4]);break;case 2: // Random
value = this._params[4] + Math.randomInt(this._params[5] - this._params[4] + 1);break;case 3: // Game Data
value = this.gameDataOperand(this._params[4],this._params[5],this._params[6]);break;case 4: // Script
value = eval(this._params[4]);break;}for(var i=this._params[0];i <= this._params[1];i++) {this.operateVariable(i,this._params[2],value);}return true;};Game_Interpreter.prototype.gameDataOperand = function(type,param1,param2){switch(type){case 0: // Item
return $gameParty.numItems($dataItems[param1]);case 1: // Weapon
return $gameParty.numItems($dataWeapons[param1]);case 2: // Armor
return $gameParty.numItems($dataArmors[param1]);case 3: // Actor
var actor=$gameActors.actor(param1);if(actor){switch(param2){case 0: // Level
return actor.level;case 1: // EXP
return actor.currentExp();case 2: // HP
return actor.hp;case 3: // MP
return actor.mp;default: // Parameter
if(param2 >= 4 && param2 <= 11){return actor.param(param2 - 4);}}}break;case 4: // Enemy
var enemy=$gameTroop.members()[param1];if(enemy){switch(param2){case 0: // HP
return enemy.hp;case 1: // MP
return enemy.mp;default: // Parameter
if(param2 >= 2 && param2 <= 9){return enemy.param(param2 - 2);}}}break;case 5: // Character
var character=this.character(param1);if(character){switch(param2){case 0: // Map X
return character.x;case 1: // Map Y
return character.y;case 2: // Direction
return character.direction();case 3: // Screen X
return character.screenX();case 4: // Screen Y
return character.screenY();}}break;case 6: // Party
actor = $gameParty.members()[param1];return actor?actor.actorId():0;case 7: // Other
switch(param1){case 0: // Map ID
return $gameMap.mapId();case 1: // Party Members
return $gameParty.size();case 2: // Gold
return $gameParty.gold();case 3: // Steps
return $gameParty.steps();case 4: // Play Time
return $gameSystem.playtime();case 5: // Timer
return $gameTimer.seconds();case 6: // Save Count
return $gameSystem.saveCount();case 7: // Battle Count
return $gameSystem.battleCount();case 8: // Win Count
return $gameSystem.winCount();case 9: // Escape Count
return $gameSystem.escapeCount();}break;}return 0;};Game_Interpreter.prototype.operateVariable = function(variableId,operationType,value){try{var oldValue=$gameVariables.value(variableId);switch(operationType){case 0: // Set
$gameVariables.setValue(variableId,oldValue = value);break;case 1: // Add
$gameVariables.setValue(variableId,oldValue + value);break;case 2: // Sub
$gameVariables.setValue(variableId,oldValue - value);break;case 3: // Mul
$gameVariables.setValue(variableId,oldValue * value);break;case 4: // Div
$gameVariables.setValue(variableId,oldValue / value);break;case 5: // Mod
$gameVariables.setValue(variableId,oldValue % value);break;}}catch(e) {$gameVariables.setValue(variableId,0);}}; // Control Self Switch
Game_Interpreter.prototype.command123 = function(){if(this._eventId > 0){var key=[this._mapId,this._eventId,this._params[0]];$gameSelfSwitches.setValue(key,this._params[1] === 0);}return true;}; // Control Timer
Game_Interpreter.prototype.command124 = function(){if(this._params[0] === 0){ // Start
$gameTimer.start(this._params[1] * 60);}else { // Stop
$gameTimer.stop();}return true;}; // Change Gold
Game_Interpreter.prototype.command125 = function(){var value=this.operateValue(this._params[0],this._params[1],this._params[2]);$gameParty.gainGold(value);return true;}; // Change Items
Game_Interpreter.prototype.command126 = function(){var value=this.operateValue(this._params[1],this._params[2],this._params[3]);$gameParty.gainItem($dataItems[this._params[0]],value);return true;}; // Change Weapons
Game_Interpreter.prototype.command127 = function(){var value=this.operateValue(this._params[1],this._params[2],this._params[3]);$gameParty.gainItem($dataWeapons[this._params[0]],value,this._params[4]);return true;}; // Change Armors
Game_Interpreter.prototype.command128 = function(){var value=this.operateValue(this._params[1],this._params[2],this._params[3]);$gameParty.gainItem($dataArmors[this._params[0]],value,this._params[4]);return true;}; // Change Party Member
Game_Interpreter.prototype.command129 = function(){var actor=$gameActors.actor(this._params[0]);if(actor){if(this._params[1] === 0){ // Add
if(this._params[2]){ // Initialize
$gameActors.actor(this._params[0]).setup(this._params[0]);}$gameParty.addActor(this._params[0]);}else { // Remove
$gameParty.removeActor(this._params[0]);}}return true;}; // Change Battle BGM
Game_Interpreter.prototype.command132 = function(){$gameSystem.setBattleBgm(this._params[0]);return true;}; // Change Victory ME
Game_Interpreter.prototype.command133 = function(){$gameSystem.setVictoryMe(this._params[0]);return true;}; // Change Save Access
Game_Interpreter.prototype.command134 = function(){if(this._params[0] === 0){$gameSystem.disableSave();}else {$gameSystem.enableSave();}return true;}; // Change Menu Access
Game_Interpreter.prototype.command135 = function(){if(this._params[0] === 0){$gameSystem.disableMenu();}else {$gameSystem.enableMenu();}return true;}; // Change Encounter Disable
Game_Interpreter.prototype.command136 = function(){if(this._params[0] === 0){$gameSystem.disableEncounter();}else {$gameSystem.enableEncounter();}$gamePlayer.makeEncounterCount();return true;}; // Change Formation Access
Game_Interpreter.prototype.command137 = function(){if(this._params[0] === 0){$gameSystem.disableFormation();}else {$gameSystem.enableFormation();}return true;}; // Change Window Color
Game_Interpreter.prototype.command138 = function(){$gameSystem.setWindowTone(this._params[0]);return true;}; // Change Defeat ME
Game_Interpreter.prototype.command139 = function(){$gameSystem.setDefeatMe(this._params[0]);return true;}; // Change Vehicle BGM
Game_Interpreter.prototype.command140 = function(){var vehicle=$gameMap.vehicle(this._params[0]);if(vehicle){vehicle.setBgm(this._params[1]);}return true;}; // Transfer Player
Game_Interpreter.prototype.command201 = function(){if(!$gameParty.inBattle() && !$gameMessage.isBusy()){var mapId,x,y;if(this._params[0] === 0){ // Direct designation
mapId = this._params[1];x = this._params[2];y = this._params[3];}else { // Designation with variables
mapId = $gameVariables.value(this._params[1]);x = $gameVariables.value(this._params[2]);y = $gameVariables.value(this._params[3]);}$gamePlayer.reserveTransfer(mapId,x,y,this._params[4],this._params[5]);this.setWaitMode('transfer');this._index++;}return false;}; // Set Vehicle Location
Game_Interpreter.prototype.command202 = function(){var mapId,x,y;if(this._params[1] === 0){ // Direct designation
mapId = this._params[2];x = this._params[3];y = this._params[4];}else { // Designation with variables
mapId = $gameVariables.value(this._params[2]);x = $gameVariables.value(this._params[3]);y = $gameVariables.value(this._params[4]);}var vehicle=$gameMap.vehicle(this._params[0]);if(vehicle){vehicle.setLocation(mapId,x,y);}return true;}; // Set Event Location
Game_Interpreter.prototype.command203 = function(){var character=this.character(this._params[0]);if(character){if(this._params[1] === 0){ // Direct designation
character.locate(this._params[2],this._params[3]);}else if(this._params[1] === 1){ // Designation with variables
var x=$gameVariables.value(this._params[2]);var y=$gameVariables.value(this._params[3]);character.locate(x,y);}else { // Exchange with another event
var character2=this.character(this._params[2]);if(character2){character.swap(character2);}}if(this._params[4] > 0){character.setDirection(this._params[4]);}}return true;}; // Scroll Map
Game_Interpreter.prototype.command204 = function(){if(!$gameParty.inBattle()){if($gameMap.isScrolling()){this.setWaitMode('scroll');return false;}$gameMap.startScroll(this._params[0],this._params[1],this._params[2]);}return true;}; // Set Movement Route
Game_Interpreter.prototype.command205 = function(){$gameMap.refreshIfNeeded();this._character = this.character(this._params[0]);if(this._character){this._character.forceMoveRoute(this._params[1]);if(this._params[1].wait){this.setWaitMode('route');}}return true;}; // Getting On and Off Vehicles
Game_Interpreter.prototype.command206 = function(){$gamePlayer.getOnOffVehicle();return true;}; // Change Transparency
Game_Interpreter.prototype.command211 = function(){$gamePlayer.setTransparent(this._params[0] === 0);return true;}; // Show Animation
Game_Interpreter.prototype.command212 = function(){this._character = this.character(this._params[0]);if(this._character){this._character.requestAnimation(this._params[1]);if(this._params[2]){this.setWaitMode('animation');}}return true;}; // Show Balloon Icon
Game_Interpreter.prototype.command213 = function(){this._character = this.character(this._params[0]);if(this._character){this._character.requestBalloon(this._params[1]);if(this._params[2]){this.setWaitMode('balloon');}}return true;}; // Erase Event
Game_Interpreter.prototype.command214 = function(){if(this.isOnCurrentMap() && this._eventId > 0){$gameMap.eraseEvent(this._eventId);}return true;}; // Change Player Followers
Game_Interpreter.prototype.command216 = function(){if(this._params[0] === 0){$gamePlayer.showFollowers();}else {$gamePlayer.hideFollowers();}$gamePlayer.refresh();return true;}; // Gather Followers
Game_Interpreter.prototype.command217 = function(){if(!$gameParty.inBattle()){$gamePlayer.gatherFollowers();this.setWaitMode('gather');}return true;}; // Fadeout Screen
Game_Interpreter.prototype.command221 = function(){if(!$gameMessage.isBusy()){$gameScreen.startFadeOut(this.fadeSpeed());this.wait(this.fadeSpeed());this._index++;}return false;}; // Fadein Screen
Game_Interpreter.prototype.command222 = function(){if(!$gameMessage.isBusy()){$gameScreen.startFadeIn(this.fadeSpeed());this.wait(this.fadeSpeed());this._index++;}return false;}; // Tint Screen
Game_Interpreter.prototype.command223 = function(){$gameScreen.startTint(this._params[0],this._params[1]);if(this._params[2]){this.wait(this._params[1]);}return true;}; // Flash Screen
Game_Interpreter.prototype.command224 = function(){$gameScreen.startFlash(this._params[0],this._params[1]);if(this._params[2]){this.wait(this._params[1]);}return true;}; // Shake Screen
Game_Interpreter.prototype.command225 = function(){$gameScreen.startShake(this._params[0],this._params[1],this._params[2]);if(this._params[3]){this.wait(this._params[2]);}return true;}; // Wait
Game_Interpreter.prototype.command230 = function(){this.wait(this._params[0]);return true;}; // Show Picture
Game_Interpreter.prototype.command231 = function(){var x,y;if(this._params[3] === 0){ // Direct designation
x = this._params[4];y = this._params[5];}else { // Designation with variables
x = $gameVariables.value(this._params[4]);y = $gameVariables.value(this._params[5]);}$gameScreen.showPicture(this._params[0],this._params[1],this._params[2],x,y,this._params[6],this._params[7],this._params[8],this._params[9]);return true;}; // Move Picture
Game_Interpreter.prototype.command232 = function(){var x,y;if(this._params[3] === 0){ // Direct designation
x = this._params[4];y = this._params[5];}else { // Designation with variables
x = $gameVariables.value(this._params[4]);y = $gameVariables.value(this._params[5]);}$gameScreen.movePicture(this._params[0],this._params[2],x,y,this._params[6],this._params[7],this._params[8],this._params[9],this._params[10]);if(this._params[11]){this.wait(this._params[10]);}return true;}; // Rotate Picture
Game_Interpreter.prototype.command233 = function(){$gameScreen.rotatePicture(this._params[0],this._params[1]);return true;}; // Tint Picture
Game_Interpreter.prototype.command234 = function(){$gameScreen.tintPicture(this._params[0],this._params[1],this._params[2]);if(this._params[3]){this.wait(this._params[2]);}return true;}; // Erase Picture
Game_Interpreter.prototype.command235 = function(){$gameScreen.erasePicture(this._params[0]);return true;}; // Set Weather Effect
Game_Interpreter.prototype.command236 = function(){if(!$gameParty.inBattle()){$gameScreen.changeWeather(this._params[0],this._params[1],this._params[2]);if(this._params[3]){this.wait(this._params[2]);}}return true;}; // Play BGM
Game_Interpreter.prototype.command241 = function(){_managers.AudioManager.playBgm(this._params[0]);return true;}; // Fadeout BGM
Game_Interpreter.prototype.command242 = function(){_managers.AudioManager.fadeOutBgm(this._params[0]);return true;}; // Save BGM
Game_Interpreter.prototype.command243 = function(){$gameSystem.saveBgm();return true;}; // Resume BGM
Game_Interpreter.prototype.command244 = function(){$gameSystem.replayBgm();return true;}; // Play BGS
Game_Interpreter.prototype.command245 = function(){_managers.AudioManager.playBgs(this._params[0]);return true;}; // Fadeout BGS
Game_Interpreter.prototype.command246 = function(){_managers.AudioManager.fadeOutBgs(this._params[0]);return true;}; // Play ME
Game_Interpreter.prototype.command249 = function(){_managers.AudioManager.playMe(this._params[0]);return true;}; // Play SE
Game_Interpreter.prototype.command250 = function(){_managers.AudioManager.playSe(this._params[0]);return true;}; // Stop SE
Game_Interpreter.prototype.command251 = function(){_managers.AudioManager.stopSe();return true;}; // Play Movie
Game_Interpreter.prototype.command261 = function(){if(!$gameMessage.isBusy()){var name=this._params[0];if(name.length > 0){var ext=this.videoFileExt();_core.Graphics.playVideo('movies/' + name + ext);this.setWaitMode('video');}this._index++;}return false;};Game_Interpreter.prototype.videoFileExt = function(){if(_core.Graphics.canPlayVideoType('video/webm') && !_core.Utils.isMobileDevice()){return '.webm';}else {return '.mp4';}}; // Change Map Name Display
Game_Interpreter.prototype.command281 = function(){if(this._params[0] === 0){$gameMap.enableNameDisplay();}else {$gameMap.disableNameDisplay();}return true;}; // Change Tileset
Game_Interpreter.prototype.command282 = function(){var tileset=$dataTilesets[this._params[0]];for(var i=0;i < tileset.tilesetNames.length;i++) {_managers.ImageManager.loadTileset(tileset.tilesetNames[i]);}if(_managers.ImageManager.isReady()){$gameMap.changeTileset(this._params[0]);return true;}else {return false;}}; // Change Battle Back
Game_Interpreter.prototype.command283 = function(){$gameMap.changeBattleback(this._params[0],this._params[1]);return true;}; // Change Parallax
Game_Interpreter.prototype.command284 = function(){$gameMap.changeParallax(this._params[0],this._params[1],this._params[2],this._params[3],this._params[4]);return true;}; // Get Location Info
Game_Interpreter.prototype.command285 = function(){var x,y,value;if(this._params[2] === 0){ // Direct designation
x = this._params[3];y = this._params[4];}else { // Designation with variables
x = $gameVariables.value(this._params[3]);y = $gameVariables.value(this._params[4]);}switch(this._params[1]){case 0: // Terrain Tag
value = $gameMap.terrainTag(x,y);break;case 1: // Event ID
value = $gameMap.eventIdXy(x,y);break;case 2: // Tile ID (Layer 1)
case 3: // Tile ID (Layer 2)
case 4: // Tile ID (Layer 3)
case 5: // Tile ID (Layer 4)
value = $gameMap.tileId(x,y,this._params[1] - 2);break;default: // Region ID
value = $gameMap.regionId(x,y);break;}$gameVariables.setValue(this._params[0],value);return true;}; // Battle Processing
Game_Interpreter.prototype.command301 = function(){if(!$gameParty.inBattle()){var troopId;if(this._params[0] === 0){ // Direct designation
troopId = this._params[1];}else if(this._params[0] === 1){ // Designation with a variable
troopId = $gameVariables.value(this._params[1]);}else { // Same as Random Encounter
troopId = $gamePlayer.makeEncounterTroopId();}if($dataTroops[troopId]){BattleManager.setup(troopId,this._params[2],this._params[3]);BattleManager.setEventCallback((function(n){this._branch[this._indent] = n;}).bind(this));$gamePlayer.makeEncounterCount();SceneManager.push(Scene_Battle);}}return true;}; // If Win
Game_Interpreter.prototype.command601 = function(){if(this._branch[this._indent] !== 0){this.skipBranch();}return true;}; // If Escape
Game_Interpreter.prototype.command602 = function(){if(this._branch[this._indent] !== 1){this.skipBranch();}return true;}; // If Lose
Game_Interpreter.prototype.command603 = function(){if(this._branch[this._indent] !== 2){this.skipBranch();}return true;}; // Shop Processing
Game_Interpreter.prototype.command302 = function(){if(!$gameParty.inBattle()){var goods=[this._params];while(this.nextEventCode() === 605) {this._index++;goods.push(this.currentCommand().parameters);}SceneManager.push(Scene_Shop);SceneManager.prepareNextScene(goods,this._params[4]);}return true;}; // Name Input Processing
Game_Interpreter.prototype.command303 = function(){if(!$gameParty.inBattle()){if($dataActors[this._params[0]]){SceneManager.push(Scene_Name);SceneManager.prepareNextScene(this._params[0],this._params[1]);}}return true;}; // Change HP
Game_Interpreter.prototype.command311 = function(){var value=this.operateValue(this._params[2],this._params[3],this._params[4]);this.iterateActorEx(this._params[0],this._params[1],(function(actor){this.changeHp(actor,value,this._params[5]);}).bind(this));return true;}; // Change MP
Game_Interpreter.prototype.command312 = function(){var value=this.operateValue(this._params[2],this._params[3],this._params[4]);this.iterateActorEx(this._params[0],this._params[1],(function(actor){actor.gainMp(value);}).bind(this));return true;}; // Change TP
Game_Interpreter.prototype.command326 = function(){var value=this.operateValue(this._params[2],this._params[3],this._params[4]);this.iterateActorEx(this._params[0],this._params[1],(function(actor){actor.gainTp(value);}).bind(this));return true;}; // Change State
Game_Interpreter.prototype.command313 = function(){this.iterateActorEx(this._params[0],this._params[1],(function(actor){var alreadyDead=actor.isDead();if(this._params[2] === 0){actor.addState(this._params[3]);}else {actor.removeState(this._params[3]);}if(actor.isDead() && !alreadyDead){actor.performCollapse();}actor.clearResult();}).bind(this));return true;}; // Recover All
Game_Interpreter.prototype.command314 = function(){this.iterateActorEx(this._params[0],this._params[1],(function(actor){actor.recoverAll();}).bind(this));return true;}; // Change EXP
Game_Interpreter.prototype.command315 = function(){var value=this.operateValue(this._params[2],this._params[3],this._params[4]);this.iterateActorEx(this._params[0],this._params[1],(function(actor){actor.changeExp(actor.currentExp() + value,this._params[5]);}).bind(this));return true;}; // Change Level
Game_Interpreter.prototype.command316 = function(){var value=this.operateValue(this._params[2],this._params[3],this._params[4]);this.iterateActorEx(this._params[0],this._params[1],(function(actor){actor.changeLevel(actor.level + value,this._params[5]);}).bind(this));return true;}; // Change Parameter
Game_Interpreter.prototype.command317 = function(){var value=this.operateValue(this._params[3],this._params[4],this._params[5]);this.iterateActorEx(this._params[0],this._params[1],(function(actor){actor.addParam(this._params[2],value);}).bind(this));return true;}; // Change Skill
Game_Interpreter.prototype.command318 = function(){this.iterateActorEx(this._params[0],this._params[1],(function(actor){if(this._params[2] === 0){actor.learnSkill(this._params[3]);}else {actor.forgetSkill(this._params[3]);}}).bind(this));return true;}; // Change Equipment
Game_Interpreter.prototype.command319 = function(){var actor=$gameActors.actor(this._params[0]);if(actor){actor.changeEquipById(this._params[1],this._params[2]);}return true;}; // Change Name
Game_Interpreter.prototype.command320 = function(){var actor=$gameActors.actor(this._params[0]);if(actor){actor.setName(this._params[1]);}return true;}; // Change Class
Game_Interpreter.prototype.command321 = function(){var actor=$gameActors.actor(this._params[0]);if(actor && $dataClasses[this._params[1]]){actor.changeClass(this._params[1],false);}return true;}; // Change Actor Images
Game_Interpreter.prototype.command322 = function(){var actor=$gameActors.actor(this._params[0]);if(actor){actor.setCharacterImage(this._params[1],this._params[2]);actor.setFaceImage(this._params[3],this._params[4]);actor.setBattlerImage(this._params[5]);}$gamePlayer.refresh();return true;}; // Change Vehicle Image
Game_Interpreter.prototype.command323 = function(){var vehicle=$gameMap.vehicle(this._params[0]);if(vehicle){vehicle.setImage(this._params[1],this._params[2]);}return true;}; // Change Nickname
Game_Interpreter.prototype.command324 = function(){var actor=$gameActors.actor(this._params[0]);if(actor){actor.setNickname(this._params[1]);}return true;}; // Change Profile
Game_Interpreter.prototype.command325 = function(){var actor=$gameActors.actor(this._params[0]);if(actor){actor.setProfile(this._params[1]);}return true;}; // Change Enemy HP
Game_Interpreter.prototype.command331 = function(){var value=this.operateValue(this._params[1],this._params[2],this._params[3]);this.iterateEnemyIndex(this._params[0],(function(enemy){this.changeHp(enemy,value,this._params[4]);}).bind(this));return true;}; // Change Enemy MP
Game_Interpreter.prototype.command332 = function(){var value=this.operateValue(this._params[1],this._params[2],this._params[3]);this.iterateEnemyIndex(this._params[0],(function(enemy){enemy.gainMp(value);}).bind(this));return true;}; // Change Enemy TP
Game_Interpreter.prototype.command342 = function(){var value=this.operateValue(this._params[1],this._params[2],this._params[3]);this.iterateEnemyIndex(this._params[0],(function(enemy){enemy.gainTp(value);}).bind(this));return true;}; // Change Enemy State
Game_Interpreter.prototype.command333 = function(){this.iterateEnemyIndex(this._params[0],(function(enemy){var alreadyDead=enemy.isDead();if(this._params[1] === 0){enemy.addState(this._params[2]);}else {enemy.removeState(this._params[2]);}if(enemy.isDead() && !alreadyDead){enemy.performCollapse();}enemy.clearResult();}).bind(this));return true;}; // Enemy Recover All
Game_Interpreter.prototype.command334 = function(){this.iterateEnemyIndex(this._params[0],(function(enemy){enemy.recoverAll();}).bind(this));return true;}; // Enemy Appear
Game_Interpreter.prototype.command335 = function(){this.iterateEnemyIndex(this._params[0],(function(enemy){enemy.appear();$gameTroop.makeUniqueNames();}).bind(this));return true;}; // Enemy Transform
Game_Interpreter.prototype.command336 = function(){this.iterateEnemyIndex(this._params[0],(function(enemy){enemy.transform(this._params[1]);$gameTroop.makeUniqueNames();}).bind(this));return true;}; // Show Battle Animation
Game_Interpreter.prototype.command337 = function(){this.iterateEnemyIndex(this._params[0],(function(enemy){if(enemy.isAlive()){enemy.startAnimation(this._params[1],false,0);}}).bind(this));return true;}; // Force Action
Game_Interpreter.prototype.command339 = function(){this.iterateBattler(this._params[0],this._params[1],(function(battler){if(!battler.isDeathStateAffected()){battler.forceAction(this._params[2],this._params[3]);BattleManager.forceAction(battler);this.setWaitMode('action');}}).bind(this));return true;}; // Abort Battle
Game_Interpreter.prototype.command340 = function(){BattleManager.abort();return true;}; // Open Menu Screen
Game_Interpreter.prototype.command351 = function(){if(!$gameParty.inBattle()){SceneManager.push(Scene_Menu);Window_MenuCommand.initCommandPosition();}return true;}; // Open Save Screen
Game_Interpreter.prototype.command352 = function(){if(!$gameParty.inBattle()){SceneManager.push(Scene_Save);}return true;}; // Game Over
Game_Interpreter.prototype.command353 = function(){SceneManager.goto(Scene_Gameover);return true;}; // Return to Title Screen
Game_Interpreter.prototype.command354 = function(){SceneManager.goto(Scene_Title);return true;}; // Script
Game_Interpreter.prototype.command355 = function(){var script=this.currentCommand().parameters[0] + '\n';while(this.nextEventCode() === 655) {this._index++;script += this.currentCommand().parameters[0] + '\n';}eval(script);return true;}; // Plugin Command
Game_Interpreter.prototype.command356 = function(){var args=this._params[0].split(" ");var command=args.shift();this.pluginCommand(command,args);return true;};Game_Interpreter.prototype.pluginCommand = function(command,args){ // to be overridden by plugins
};

},{"./core":4,"./managers":6}],8:[function(require,module,exports){
// Generated by RPG Maker.
// Do not edit this file directly.
"use strict";

var $plugins = [];

window.$plugins = $plugins;

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.Scene_Base = Scene_Base;
exports.Scene_Boot = Scene_Boot;
exports.Scene_Title = Scene_Title;
exports.Scene_Map = Scene_Map;
exports.Scene_MenuBase = Scene_MenuBase;
exports.Scene_Menu = Scene_Menu;
exports.Scene_ItemBase = Scene_ItemBase;
exports.Scene_Item = Scene_Item;
exports.Scene_Skill = Scene_Skill;
exports.Scene_Equip = Scene_Equip;
exports.Scene_Status = Scene_Status;
exports.Scene_Options = Scene_Options;
exports.Scene_File = Scene_File;
exports.Scene_Save = Scene_Save;
exports.Scene_Load = Scene_Load;
exports.Scene_GameEnd = Scene_GameEnd;
exports.Scene_Shop = Scene_Shop;
exports.Scene_Name = Scene_Name;
exports.Scene_Debug = Scene_Debug;
exports.Scene_Battle = Scene_Battle;
exports.Scene_Gameover = Scene_Gameover;

var _core = require('./core');

var _managers = require('./managers');

var _windows = require('./windows');

var _sprites = require('./sprites');

var _objects = require('./objects');

//=============================================================================
// rpg_scenes.js
//=============================================================================

//-----------------------------------------------------------------------------
// Scene_Base
//
// The superclass of all scenes within the game.

function Scene_Base() {
    this.initialize.apply(this, arguments);
}

Scene_Base.prototype = Object.create(_core.Stage.prototype);
Scene_Base.prototype.constructor = Scene_Base;

Scene_Base.prototype.initialize = function () {
    _core.Stage.prototype.initialize.call(this);
    this._active = false;
    this._fadeSign = 0;
    this._fadeDuration = 0;
    this._fadeSprite = null;
};

Scene_Base.prototype.create = function () {};

Scene_Base.prototype.isActive = function () {
    return this._active;
};

Scene_Base.prototype.isReady = function () {
    return _managers.ImageManager.isReady();
};

Scene_Base.prototype.start = function () {
    this._active = true;
};

Scene_Base.prototype.update = function () {
    this.updateFade();
    this.updateChildren();
    _managers.AudioManager.checkErrors();
};

Scene_Base.prototype.stop = function () {
    this._active = false;
};

Scene_Base.prototype.isBusy = function () {
    return this._fadeDuration > 0;
};

Scene_Base.prototype.terminate = function () {};

Scene_Base.prototype.createWindowLayer = function () {
    var width = _core.Graphics.boxWidth;
    var height = _core.Graphics.boxHeight;
    var x = (_core.Graphics.width - width) / 2;
    var y = (_core.Graphics.height - height) / 2;
    this._windowLayer = new _core.WindowLayer();
    this._windowLayer.move(x, y, width, height);
    this.addChild(this._windowLayer);
};

Scene_Base.prototype.addWindow = function (window) {
    this._windowLayer.addChild(window);
};

Scene_Base.prototype.startFadeIn = function (duration, white) {
    this.createFadeSprite(white);
    this._fadeSign = 1;
    this._fadeDuration = duration || 30;
    this._fadeSprite.opacity = 255;
};

Scene_Base.prototype.startFadeOut = function (duration, white) {
    this.createFadeSprite(white);
    this._fadeSign = -1;
    this._fadeDuration = duration || 30;
    this._fadeSprite.opacity = 0;
};

Scene_Base.prototype.createFadeSprite = function (white) {
    if (!this._fadeSprite) {
        this._fadeSprite = new _core.ScreenSprite();
        this.addChild(this._fadeSprite);
    }
    if (white) {
        this._fadeSprite.setWhite();
    } else {
        this._fadeSprite.setBlack();
    }
};

Scene_Base.prototype.updateFade = function () {
    if (this._fadeDuration > 0) {
        var d = this._fadeDuration;
        if (this._fadeSign > 0) {
            this._fadeSprite.opacity -= this._fadeSprite.opacity / d;
        } else {
            this._fadeSprite.opacity += (255 - this._fadeSprite.opacity) / d;
        }
        this._fadeDuration--;
    }
};

Scene_Base.prototype.updateChildren = function () {
    this.children.forEach(function (child) {
        if (child.update) {
            child.update();
        }
    });
};

Scene_Base.prototype.popScene = function () {
    _managers.SceneManager.pop();
};

Scene_Base.prototype.checkGameover = function () {
    if ($gameParty.isAllDead()) {
        _managers.SceneManager.goto(Scene_Gameover);
    }
};

Scene_Base.prototype.fadeOutAll = function () {
    var time = this.slowFadeSpeed() / 60;
    _managers.AudioManager.fadeOutBgm(time);
    _managers.AudioManager.fadeOutBgs(time);
    _managers.AudioManager.fadeOutMe(time);
    this.startFadeOut(this.slowFadeSpeed());
};

Scene_Base.prototype.fadeSpeed = function () {
    return 24;
};

Scene_Base.prototype.slowFadeSpeed = function () {
    return this.fadeSpeed() * 2;
};

//-----------------------------------------------------------------------------
// Scene_Boot
//
// The scene class for initializing the entire game.

function Scene_Boot() {
    this.initialize.apply(this, arguments);
}

Scene_Boot.prototype = Object.create(Scene_Base.prototype);
Scene_Boot.prototype.constructor = Scene_Boot;

Scene_Boot.prototype.initialize = function () {
    Scene_Base.prototype.initialize.call(this);
    this._startDate = Date.now();
};

Scene_Boot.prototype.create = function () {
    Scene_Base.prototype.create.call(this);
    _managers.DataManager.loadDatabase();
    _managers.ConfigManager.load();
    this.loadSystemImages();
};

Scene_Boot.prototype.loadSystemImages = function () {
    _managers.ImageManager.loadSystem('Window');
    _managers.ImageManager.loadSystem('IconSet');
    _managers.ImageManager.loadSystem('Balloon');
    _managers.ImageManager.loadSystem('Shadow1');
    _managers.ImageManager.loadSystem('Shadow2');
    _managers.ImageManager.loadSystem('Damage');
    _managers.ImageManager.loadSystem('States');
    _managers.ImageManager.loadSystem('Weapons1');
    _managers.ImageManager.loadSystem('Weapons2');
    _managers.ImageManager.loadSystem('Weapons3');
    _managers.ImageManager.loadSystem('ButtonSet');
};

Scene_Boot.prototype.isReady = function () {
    if (Scene_Base.prototype.isReady.call(this)) {
        return _managers.DataManager.isDatabaseLoaded() && this.isGameFontLoaded();
    } else {
        return false;
    }
};

Scene_Boot.prototype.isGameFontLoaded = function () {
    if (_core.Graphics.isFontLoaded('GameFont')) {
        return true;
    } else {
        var elapsed = Date.now() - this._startDate;
        if (elapsed >= 20000) {
            throw new Error('Failed to load GameFont');
        }
    }
};

Scene_Boot.prototype.start = function () {
    Scene_Base.prototype.start.call(this);
    _managers.SoundManager.preloadImportantSounds();
    if (_managers.DataManager.isBattleTest()) {
        _managers.DataManager.setupBattleTest();
        _managers.SceneManager.goto(Scene_Battle);
    } else if (_managers.DataManager.isEventTest()) {
        _managers.DataManager.setupEventTest();
        _managers.SceneManager.goto(Scene_Map);
    } else {
        this.checkPlayerLocation();
        _managers.DataManager.setupNewGame();
        _managers.SceneManager.goto(Scene_Title);
        _windows.Window_TitleCommand.initCommandPosition();
    }
    this.updateDocumentTitle();
};

Scene_Boot.prototype.updateDocumentTitle = function () {
    document.title = $dataSystem.gameTitle;
};

Scene_Boot.prototype.checkPlayerLocation = function () {
    if ($dataSystem.startMapId === 0) {
        throw new Error('Player\'s starting position is not set');
    }
};

//-----------------------------------------------------------------------------
// Scene_Title
//
// The scene class of the title screen.

function Scene_Title() {
    this.initialize.apply(this, arguments);
}

Scene_Title.prototype = Object.create(Scene_Base.prototype);
Scene_Title.prototype.constructor = Scene_Title;

Scene_Title.prototype.initialize = function () {
    Scene_Base.prototype.initialize.call(this);
};

Scene_Title.prototype.create = function () {
    Scene_Base.prototype.create.call(this);
    this.createBackground();
    this.createForeground();
    this.createWindowLayer();
    this.createCommandWindow();
};

Scene_Title.prototype.start = function () {
    Scene_Base.prototype.start.call(this);
    _managers.SceneManager.clearStack();
    this.centerSprite(this._backSprite1);
    this.centerSprite(this._backSprite2);
    this.playTitleMusic();
    this.startFadeIn(this.fadeSpeed(), false);
};

Scene_Title.prototype.update = function () {
    if (!this.isBusy()) {
        this._commandWindow.open();
    }
    Scene_Base.prototype.update.call(this);
};

Scene_Title.prototype.isBusy = function () {
    return this._commandWindow.isClosing() || Scene_Base.prototype.isBusy.call(this);
};

Scene_Title.prototype.terminate = function () {
    Scene_Base.prototype.terminate.call(this);
    _managers.SceneManager.snapForBackground();
};

Scene_Title.prototype.createBackground = function () {
    this._backSprite1 = new _core.Sprite(_managers.ImageManager.loadTitle1($dataSystem.title1Name));
    this._backSprite2 = new _core.Sprite(_managers.ImageManager.loadTitle2($dataSystem.title2Name));
    this.addChild(this._backSprite1);
    this.addChild(this._backSprite2);
};

Scene_Title.prototype.createForeground = function () {
    this._gameTitleSprite = new _core.Sprite(new _core.Bitmap(_core.Graphics.width, _core.Graphics.height));
    this.addChild(this._gameTitleSprite);
    if ($dataSystem.optDrawTitle) {
        this.drawGameTitle();
    }
};

Scene_Title.prototype.drawGameTitle = function () {
    var x = 20;
    var y = _core.Graphics.height / 4;
    var maxWidth = _core.Graphics.width - x * 2;
    var text = $dataSystem.gameTitle;
    this._gameTitleSprite.bitmap.outlineColor = 'black';
    this._gameTitleSprite.bitmap.outlineWidth = 8;
    this._gameTitleSprite.bitmap.fontSize = 72;
    this._gameTitleSprite.bitmap.drawText(text, x, y, maxWidth, 48, 'center');
};

Scene_Title.prototype.centerSprite = function (sprite) {
    sprite.x = _core.Graphics.width / 2;
    sprite.y = _core.Graphics.height / 2;
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
};

Scene_Title.prototype.createCommandWindow = function () {
    this._commandWindow = new _windows.Window_TitleCommand();
    this._commandWindow.setHandler('newGame', this.commandNewGame.bind(this));
    this._commandWindow.setHandler('continue', this.commandContinue.bind(this));
    this._commandWindow.setHandler('options', this.commandOptions.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_Title.prototype.commandNewGame = function () {
    _managers.DataManager.setupNewGame();
    this._commandWindow.close();
    this.fadeOutAll();
    _managers.SceneManager.goto(Scene_Map);
};

Scene_Title.prototype.commandContinue = function () {
    this._commandWindow.close();
    _managers.SceneManager.push(Scene_Load);
};

Scene_Title.prototype.commandOptions = function () {
    this._commandWindow.close();
    _managers.SceneManager.push(Scene_Options);
};

Scene_Title.prototype.playTitleMusic = function () {
    _managers.AudioManager.playBgm($dataSystem.titleBgm);
    _managers.AudioManager.stopBgs();
    _managers.AudioManager.stopMe();
};

//-----------------------------------------------------------------------------
// Scene_Map
//
// The scene class of the map screen.

function Scene_Map() {
    this.initialize.apply(this, arguments);
}

Scene_Map.prototype = Object.create(Scene_Base.prototype);
Scene_Map.prototype.constructor = Scene_Map;

Scene_Map.prototype.initialize = function () {
    Scene_Base.prototype.initialize.call(this);
    this._waitCount = 0;
    this._encounterEffectDuration = 0;
    this._mapLoaded = false;
    this._touchCount = 0;
};

Scene_Map.prototype.create = function () {
    Scene_Base.prototype.create.call(this);
    this._transfer = $gamePlayer.isTransferring();
    var mapId = this._transfer ? $gamePlayer.newMapId() : $gameMap.mapId();
    _managers.DataManager.loadMapData(mapId);
};

Scene_Map.prototype.isReady = function () {
    if (!this._mapLoaded && _managers.DataManager.isMapLoaded()) {
        this.onMapLoaded();
        this._mapLoaded = true;
    }
    return this._mapLoaded && Scene_Base.prototype.isReady.call(this);
};

Scene_Map.prototype.onMapLoaded = function () {
    if (this._transfer) {
        $gamePlayer.performTransfer();
    }
    this.createDisplayObjects();
};

Scene_Map.prototype.start = function () {
    Scene_Base.prototype.start.call(this);
    _managers.SceneManager.clearStack();
    if (this._transfer) {
        this.fadeInForTransfer();
        this._mapNameWindow.open();
        $gameMap.autoplay();
    } else if (this.needsFadeIn()) {
        this.startFadeIn(this.fadeSpeed(), false);
    }
    this.menuCalling = false;
};

Scene_Map.prototype.update = function () {
    this.updateDestination();
    this.updateMainMultiply();
    if (this.isSceneChangeOk()) {
        this.updateScene();
    } else if (_managers.SceneManager.isNextScene(Scene_Battle)) {
        this.updateEncounterEffect();
    }
    this.updateWaitCount();
    Scene_Base.prototype.update.call(this);
};

Scene_Map.prototype.updateMainMultiply = function () {
    this.updateMain();
    if (this.isFastForward()) {
        this.updateMain();
    }
};

Scene_Map.prototype.updateMain = function () {
    var active = this.isActive();
    $gameMap.update(active);
    $gamePlayer.update(active);
    $gameTimer.update(active);
    $gameScreen.update();
};

Scene_Map.prototype.isFastForward = function () {
    return $gameMap.isEventRunning() && !_managers.SceneManager.isSceneChanging() && (_core.Input.isLongPressed('ok') || _core.TouchInput.isLongPressed());
};

Scene_Map.prototype.stop = function () {
    Scene_Base.prototype.stop.call(this);
    $gamePlayer.straighten();
    this._mapNameWindow.close();
    if (this.needsSlowFadeOut()) {
        this.startFadeOut(this.slowFadeSpeed(), false);
    } else if (_managers.SceneManager.isNextScene(Scene_Map)) {
        this.fadeOutForTransfer();
    } else if (_managers.SceneManager.isNextScene(Scene_Battle)) {
        this.launchBattle();
    }
};

Scene_Map.prototype.isBusy = function () {
    return this._messageWindow && this._messageWindow.isClosing() || this._waitCount > 0 || this._encounterEffectDuration > 0 || Scene_Base.prototype.isBusy.call(this);
};

Scene_Map.prototype.terminate = function () {
    Scene_Base.prototype.terminate.call(this);
    if (!_managers.SceneManager.isNextScene(Scene_Battle)) {
        this._spriteset.update();
        this._mapNameWindow.hide();
        _managers.SceneManager.snapForBackground();
    }
    $gameScreen.clearZoom();
};

Scene_Map.prototype.needsFadeIn = function () {
    return _managers.SceneManager.isPreviousScene(Scene_Battle) || _managers.SceneManager.isPreviousScene(Scene_Load);
};

Scene_Map.prototype.needsSlowFadeOut = function () {
    return _managers.SceneManager.isNextScene(Scene_Title) || _managers.SceneManager.isNextScene(Scene_Gameover);
};

Scene_Map.prototype.updateWaitCount = function () {
    if (this._waitCount > 0) {
        this._waitCount--;
        return true;
    }
    return false;
};

Scene_Map.prototype.updateDestination = function () {
    if (this.isMapTouchOk()) {
        this.processMapTouch();
    } else {
        $gameTemp.clearDestination();
        this._touchCount = 0;
    }
};

Scene_Map.prototype.isMapTouchOk = function () {
    return this.isActive() && $gamePlayer.canMove();
};

Scene_Map.prototype.processMapTouch = function () {
    if (_core.TouchInput.isTriggered() || this._touchCount > 0) {
        if (_core.TouchInput.isPressed()) {
            if (this._touchCount === 0 || this._touchCount >= 15) {
                var x = $gameMap.canvasToMapX(_core.TouchInput.x);
                var y = $gameMap.canvasToMapY(_core.TouchInput.y);
                $gameTemp.setDestination(x, y);
            }
            this._touchCount++;
        } else {
            this._touchCount = 0;
        }
    }
};

Scene_Map.prototype.isSceneChangeOk = function () {
    return this.isActive() && !$gameMessage.isBusy();
};

Scene_Map.prototype.updateScene = function () {
    this.checkGameover();
    if (!_managers.SceneManager.isSceneChanging()) {
        this.updateTransferPlayer();
    }
    if (!_managers.SceneManager.isSceneChanging()) {
        this.updateEncounter();
    }
    if (!_managers.SceneManager.isSceneChanging()) {
        this.updateCallMenu();
    }
    if (!_managers.SceneManager.isSceneChanging()) {
        this.updateCallDebug();
    }
};

Scene_Map.prototype.createDisplayObjects = function () {
    this.createSpriteset();
    this.createMapNameWindow();
    this.createWindowLayer();
    this.createAllWindows();
};

Scene_Map.prototype.createSpriteset = function () {
    this._spriteset = new _sprites.Spriteset_Map();
    this.addChild(this._spriteset);
};

Scene_Map.prototype.createAllWindows = function () {
    this.createMessageWindow();
    this.createScrollTextWindow();
};

Scene_Map.prototype.createMapNameWindow = function () {
    this._mapNameWindow = new _windows.Window_MapName();
    this.addChild(this._mapNameWindow);
};

Scene_Map.prototype.createMessageWindow = function () {
    this._messageWindow = new _windows.Window_Message();
    this.addWindow(this._messageWindow);
    this._messageWindow.subWindows().forEach(function (window) {
        this.addWindow(window);
    }, this);
};

Scene_Map.prototype.createScrollTextWindow = function () {
    this._scrollTextWindow = new _windows.Window_ScrollText();
    this.addWindow(this._scrollTextWindow);
};

Scene_Map.prototype.updateTransferPlayer = function () {
    if ($gamePlayer.isTransferring()) {
        _managers.SceneManager.goto(Scene_Map);
    }
};

Scene_Map.prototype.updateEncounter = function () {
    if ($gamePlayer.executeEncounter()) {
        _managers.SceneManager.push(Scene_Battle);
    }
};

Scene_Map.prototype.updateCallMenu = function () {
    if (this.isMenuEnabled()) {
        if (this.isMenuCalled()) {
            this.menuCalling = true;
        }
        if (this.menuCalling && !$gamePlayer.isMoving()) {
            this.callMenu();
        }
    } else {
        this.menuCalling = false;
    }
};

Scene_Map.prototype.isMenuEnabled = function () {
    return $gameSystem.isMenuEnabled() && !$gameMap.isEventRunning();
};

Scene_Map.prototype.isMenuCalled = function () {
    return _core.Input.isTriggered('menu') || _core.TouchInput.isCancelled();
};

Scene_Map.prototype.callMenu = function () {
    _managers.SoundManager.playOk();
    _managers.SceneManager.push(Scene_Menu);
    _windows.Window_MenuCommand.initCommandPosition();
    $gameTemp.clearDestination();
    this._mapNameWindow.hide();
    this._waitCount = 2;
};

Scene_Map.prototype.updateCallDebug = function () {
    if (this.isDebugCalled()) {
        _managers.SceneManager.push(Scene_Debug);
    }
};

Scene_Map.prototype.isDebugCalled = function () {
    return _core.Input.isTriggered('debug') && $gameTemp.isPlaytest();
};

Scene_Map.prototype.fadeInForTransfer = function () {
    var fadeType = $gamePlayer.fadeType();
    switch (fadeType) {
        case 0:case 1:
            this.startFadeIn(this.fadeSpeed(), fadeType === 1);
            break;
    }
};

Scene_Map.prototype.fadeOutForTransfer = function () {
    var fadeType = $gamePlayer.fadeType();
    switch (fadeType) {
        case 0:case 1:
            this.startFadeOut(this.fadeSpeed(), fadeType === 1);
            break;
    }
};

Scene_Map.prototype.launchBattle = function () {
    BattleManager.saveBgmAndBgs();
    this.stopAudioOnBattleStart();
    _managers.SoundManager.playBattleStart();
    this.startEncounterEffect();
    this._mapNameWindow.hide();
};

Scene_Map.prototype.stopAudioOnBattleStart = function () {
    if (!_managers.AudioManager.isCurrentBgm($gameSystem.battleBgm())) {
        _managers.AudioManager.stopBgm();
    }
    _managers.AudioManager.stopBgs();
    _managers.AudioManager.stopMe();
    _managers.AudioManager.stopSe();
};

Scene_Map.prototype.startEncounterEffect = function () {
    this._spriteset.hideCharacters();
    this._encounterEffectDuration = this.encounterEffectSpeed();
};

Scene_Map.prototype.updateEncounterEffect = function () {
    if (this._encounterEffectDuration > 0) {
        this._encounterEffectDuration--;
        var speed = this.encounterEffectSpeed();
        var n = speed - this._encounterEffectDuration;
        var p = n / speed;
        var q = ((p - 1) * 20 * p + 5) * p + 1;
        var zoomX = $gamePlayer.screenX();
        var zoomY = $gamePlayer.screenY() - 24;
        if (n === 2) {
            $gameScreen.setZoom(zoomX, zoomY, 1);
            this.snapForBattleBackground();
            this.startFlashForEncounter(speed / 2);
        }
        $gameScreen.setZoom(zoomX, zoomY, q);
        if (n === Math.floor(speed / 6)) {
            this.startFlashForEncounter(speed / 2);
        }
        if (n === Math.floor(speed / 2)) {
            BattleManager.playBattleBgm();
            this.startFadeOut(this.fadeSpeed());
        }
    }
};

Scene_Map.prototype.snapForBattleBackground = function () {
    this._windowLayer.visible = false;
    _managers.SceneManager.snapForBackground();
    this._windowLayer.visible = true;
};

Scene_Map.prototype.startFlashForEncounter = function (duration) {
    var color = [255, 255, 255, 255];
    $gameScreen.startFlash(color, duration);
};

Scene_Map.prototype.encounterEffectSpeed = function () {
    return 60;
};

//-----------------------------------------------------------------------------
// Scene_MenuBase
//
// The superclass of all the menu-type scenes.

function Scene_MenuBase() {
    this.initialize.apply(this, arguments);
}

Scene_MenuBase.prototype = Object.create(Scene_Base.prototype);
Scene_MenuBase.prototype.constructor = Scene_MenuBase;

Scene_MenuBase.prototype.initialize = function () {
    Scene_Base.prototype.initialize.call(this);
};

Scene_MenuBase.prototype.create = function () {
    Scene_Base.prototype.create.call(this);
    this.createBackground();
    this.updateActor();
    this.createWindowLayer();
};

Scene_MenuBase.prototype.actor = function () {
    return this._actor;
};

Scene_MenuBase.prototype.updateActor = function () {
    this._actor = $gameParty.menuActor();
};

Scene_MenuBase.prototype.createBackground = function () {
    this._backgroundSprite = new _core.Sprite();
    this._backgroundSprite.bitmap = _managers.SceneManager.backgroundBitmap();
    this.addChild(this._backgroundSprite);
};

Scene_MenuBase.prototype.setBackgroundOpacity = function (opacity) {
    this._backgroundSprite.opacity = opacity;
};

Scene_MenuBase.prototype.createHelpWindow = function () {
    this._helpWindow = new _windows.Window_Help();
    this.addWindow(this._helpWindow);
};

Scene_MenuBase.prototype.nextActor = function () {
    $gameParty.makeMenuActorNext();
    this.updateActor();
    this.onActorChange();
};

Scene_MenuBase.prototype.previousActor = function () {
    $gameParty.makeMenuActorPrevious();
    this.updateActor();
    this.onActorChange();
};

Scene_MenuBase.prototype.onActorChange = function () {};

//-----------------------------------------------------------------------------
// Scene_Menu
//
// The scene class of the menu screen.

function Scene_Menu() {
    this.initialize.apply(this, arguments);
}

Scene_Menu.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Menu.prototype.constructor = Scene_Menu;

Scene_Menu.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_Menu.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createCommandWindow();
    this.createGoldWindow();
    this.createStatusWindow();
};

Scene_Menu.prototype.start = function () {
    Scene_MenuBase.prototype.start.call(this);
    this._statusWindow.refresh();
};

Scene_Menu.prototype.createCommandWindow = function () {
    this._commandWindow = new _windows.Window_MenuCommand(0, 0);
    this._commandWindow.setHandler('item', this.commandItem.bind(this));
    this._commandWindow.setHandler('skill', this.commandPersonal.bind(this));
    this._commandWindow.setHandler('equip', this.commandPersonal.bind(this));
    this._commandWindow.setHandler('status', this.commandPersonal.bind(this));
    this._commandWindow.setHandler('formation', this.commandFormation.bind(this));
    this._commandWindow.setHandler('options', this.commandOptions.bind(this));
    this._commandWindow.setHandler('save', this.commandSave.bind(this));
    this._commandWindow.setHandler('gameEnd', this.commandGameEnd.bind(this));
    this._commandWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_Menu.prototype.createGoldWindow = function () {
    this._goldWindow = new _windows.Window_Gold(0, 0);
    this._goldWindow.y = _core.Graphics.boxHeight - this._goldWindow.height;
    this.addWindow(this._goldWindow);
};

Scene_Menu.prototype.createStatusWindow = function () {
    this._statusWindow = new _windows.Window_MenuStatus(this._commandWindow.width, 0);
    this.addWindow(this._statusWindow);
};

Scene_Menu.prototype.commandItem = function () {
    _managers.SceneManager.push(Scene_Item);
};

Scene_Menu.prototype.commandPersonal = function () {
    this._statusWindow.setFormationMode(false);
    this._statusWindow.selectLast();
    this._statusWindow.activate();
    this._statusWindow.setHandler('ok', this.onPersonalOk.bind(this));
    this._statusWindow.setHandler('cancel', this.onPersonalCancel.bind(this));
};

Scene_Menu.prototype.commandFormation = function () {
    this._statusWindow.setFormationMode(true);
    this._statusWindow.selectLast();
    this._statusWindow.activate();
    this._statusWindow.setHandler('ok', this.onFormationOk.bind(this));
    this._statusWindow.setHandler('cancel', this.onFormationCancel.bind(this));
};

Scene_Menu.prototype.commandOptions = function () {
    _managers.SceneManager.push(Scene_Options);
};

Scene_Menu.prototype.commandSave = function () {
    _managers.SceneManager.push(Scene_Save);
};

Scene_Menu.prototype.commandGameEnd = function () {
    _managers.SceneManager.push(Scene_GameEnd);
};

Scene_Menu.prototype.onPersonalOk = function () {
    switch (this._commandWindow.currentSymbol()) {
        case 'skill':
            _managers.SceneManager.push(Scene_Skill);
            break;
        case 'equip':
            _managers.SceneManager.push(Scene_Equip);
            break;
        case 'status':
            _managers.SceneManager.push(Scene_Status);
            break;
    }
};

Scene_Menu.prototype.onPersonalCancel = function () {
    this._statusWindow.deselect();
    this._commandWindow.activate();
};

Scene_Menu.prototype.onFormationOk = function () {
    var index = this._statusWindow.index();
    var actor = $gameParty.members()[index];
    var pendingIndex = this._statusWindow.pendingIndex();
    if (pendingIndex >= 0) {
        $gameParty.swapOrder(index, pendingIndex);
        this._statusWindow.setPendingIndex(-1);
        this._statusWindow.redrawItem(index);
    } else {
        this._statusWindow.setPendingIndex(index);
    }
    this._statusWindow.activate();
};

Scene_Menu.prototype.onFormationCancel = function () {
    if (this._statusWindow.pendingIndex() >= 0) {
        this._statusWindow.setPendingIndex(-1);
        this._statusWindow.activate();
    } else {
        this._statusWindow.deselect();
        this._commandWindow.activate();
    }
};

//-----------------------------------------------------------------------------
// Scene_ItemBase
//
// The superclass of Scene_Item and Scene_Skill.

function Scene_ItemBase() {
    this.initialize.apply(this, arguments);
}

Scene_ItemBase.prototype = Object.create(Scene_MenuBase.prototype);
Scene_ItemBase.prototype.constructor = Scene_ItemBase;

Scene_ItemBase.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_ItemBase.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
};

Scene_ItemBase.prototype.createActorWindow = function () {
    this._actorWindow = new _windows.Window_MenuActor();
    this._actorWindow.setHandler('ok', this.onActorOk.bind(this));
    this._actorWindow.setHandler('cancel', this.onActorCancel.bind(this));
    this.addWindow(this._actorWindow);
};

Scene_ItemBase.prototype.item = function () {
    return this._itemWindow.item();
};

Scene_ItemBase.prototype.user = function () {
    return null;
};

Scene_ItemBase.prototype.isCursorLeft = function () {
    return this._itemWindow.index() % 2 === 0;
};

Scene_ItemBase.prototype.showSubWindow = function (window) {
    window.x = this.isCursorLeft() ? _core.Graphics.boxWidth - window.width : 0;
    window.show();
    window.activate();
};

Scene_ItemBase.prototype.hideSubWindow = function (window) {
    window.hide();
    window.deactivate();
    this.activateItemWindow();
};

Scene_ItemBase.prototype.onActorOk = function () {
    if (this.canUse()) {
        this.useItem();
    } else {
        _managers.SoundManager.playBuzzer();
    }
};

Scene_ItemBase.prototype.onActorCancel = function () {
    this.hideSubWindow(this._actorWindow);
};

Scene_ItemBase.prototype.determineItem = function () {
    var action = new _objects.Game_Action(this.user());
    var item = this.item();
    action.setItemObject(item);
    if (action.isForFriend()) {
        this.showSubWindow(this._actorWindow);
        this._actorWindow.selectForItem(this.item());
    } else {
        this.useItem();
        this.activateItemWindow();
    }
};

Scene_ItemBase.prototype.useItem = function () {
    this.playSeForItem();
    this.user().useItem(this.item());
    this.applyItem();
    this.checkCommonEvent();
    this.checkGameover();
    this._actorWindow.refresh();
};

Scene_ItemBase.prototype.activateItemWindow = function () {
    this._itemWindow.refresh();
    this._itemWindow.activate();
};

Scene_ItemBase.prototype.itemTargetActors = function () {
    var action = new _objects.Game_Action(this.user());
    action.setItemObject(this.item());
    if (!action.isForFriend()) {
        return [];
    } else if (action.isForAll()) {
        return $gameParty.members();
    } else {
        return [$gameParty.members()[this._actorWindow.index()]];
    }
};

Scene_ItemBase.prototype.canUse = function () {
    return this.user().canUse(this.item()) && this.isItemEffectsValid();
};

Scene_ItemBase.prototype.isItemEffectsValid = function () {
    var action = new _objects.Game_Action(this.user());
    action.setItemObject(this.item());
    return this.itemTargetActors().some(function (target) {
        return action.testApply(target);
    }, this);
};

Scene_ItemBase.prototype.applyItem = function () {
    var action = new _objects.Game_Action(this.user());
    action.setItemObject(this.item());
    this.itemTargetActors().forEach(function (target) {
        for (var i = 0; i < action.numRepeats(); i++) {
            action.apply(target);
        }
    }, this);
    action.applyGlobal();
};

Scene_ItemBase.prototype.checkCommonEvent = function () {
    if ($gameTemp.isCommonEventReserved()) {
        _managers.SceneManager.goto(Scene_Map);
    }
};

//-----------------------------------------------------------------------------
// Scene_Item
//
// The scene class of the item screen.

function Scene_Item() {
    this.initialize.apply(this, arguments);
}

Scene_Item.prototype = Object.create(Scene_ItemBase.prototype);
Scene_Item.prototype.constructor = Scene_Item;

Scene_Item.prototype.initialize = function () {
    Scene_ItemBase.prototype.initialize.call(this);
};

Scene_Item.prototype.create = function () {
    Scene_ItemBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createCategoryWindow();
    this.createItemWindow();
    this.createActorWindow();
};

Scene_Item.prototype.createCategoryWindow = function () {
    this._categoryWindow = new _windows.Window_ItemCategory();
    this._categoryWindow.setHelpWindow(this._helpWindow);
    this._categoryWindow.y = this._helpWindow.height;
    this._categoryWindow.setHandler('ok', this.onCategoryOk.bind(this));
    this._categoryWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._categoryWindow);
};

Scene_Item.prototype.createItemWindow = function () {
    var wy = this._categoryWindow.y + this._categoryWindow.height;
    var wh = _core.Graphics.boxHeight - wy;
    this._itemWindow = new _windows.Window_ItemList(0, wy, _core.Graphics.boxWidth, wh);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler('ok', this.onItemOk.bind(this));
    this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
    this.addWindow(this._itemWindow);
    this._categoryWindow.setItemWindow(this._itemWindow);
};

Scene_Item.prototype.user = function () {
    var members = $gameParty.movableMembers();
    var bestActor = members[0];
    var bestPha = 0;
    for (var i = 0; i < members.length; i++) {
        if (members[i].pha > bestPha) {
            bestPha = members[i].pha;
            bestActor = members[i];
        }
    }
    return bestActor;
};

Scene_Item.prototype.onCategoryOk = function () {
    this._itemWindow.activate();
    this._itemWindow.selectLast();
};

Scene_Item.prototype.onItemOk = function () {
    $gameParty.setLastItem(this.item());
    this.determineItem();
};

Scene_Item.prototype.onItemCancel = function () {
    this._itemWindow.deselect();
    this._categoryWindow.activate();
};

Scene_Item.prototype.playSeForItem = function () {
    _managers.SoundManager.playUseItem();
};

Scene_Item.prototype.useItem = function () {
    Scene_ItemBase.prototype.useItem.call(this);
    this._itemWindow.redrawCurrentItem();
};

//-----------------------------------------------------------------------------
// Scene_Skill
//
// The scene class of the skill screen.

function Scene_Skill() {
    this.initialize.apply(this, arguments);
}

Scene_Skill.prototype = Object.create(Scene_ItemBase.prototype);
Scene_Skill.prototype.constructor = Scene_Skill;

Scene_Skill.prototype.initialize = function () {
    Scene_ItemBase.prototype.initialize.call(this);
};

Scene_Skill.prototype.create = function () {
    Scene_ItemBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createSkillTypeWindow();
    this.createStatusWindow();
    this.createItemWindow();
    this.createActorWindow();
    this.refreshActor();
};

Scene_Skill.prototype.createSkillTypeWindow = function () {
    var wy = this._helpWindow.height;
    this._skillTypeWindow = new _windows.Window_SkillType(0, wy);
    this._skillTypeWindow.setHelpWindow(this._helpWindow);
    this._skillTypeWindow.setHandler('skill', this.commandSkill.bind(this));
    this._skillTypeWindow.setHandler('cancel', this.popScene.bind(this));
    this._skillTypeWindow.setHandler('pagedown', this.nextActor.bind(this));
    this._skillTypeWindow.setHandler('pageup', this.previousActor.bind(this));
    this.addWindow(this._skillTypeWindow);
};

Scene_Skill.prototype.createStatusWindow = function () {
    var wx = this._skillTypeWindow.width;
    var wy = this._helpWindow.height;
    var ww = _core.Graphics.boxWidth - wx;
    var wh = this._skillTypeWindow.height;
    this._statusWindow = new _windows.Window_SkillStatus(wx, wy, ww, wh);
    this.addWindow(this._statusWindow);
};

Scene_Skill.prototype.createItemWindow = function () {
    var wx = 0;
    var wy = this._statusWindow.y + this._statusWindow.height;
    var ww = _core.Graphics.boxWidth;
    var wh = _core.Graphics.boxHeight - wy;
    this._itemWindow = new _windows.Window_SkillList(wx, wy, ww, wh);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler('ok', this.onItemOk.bind(this));
    this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
    this._skillTypeWindow.setSkillWindow(this._itemWindow);
    this.addWindow(this._itemWindow);
};

Scene_Skill.prototype.refreshActor = function () {
    var actor = this.actor();
    this._skillTypeWindow.setActor(actor);
    this._statusWindow.setActor(actor);
    this._itemWindow.setActor(actor);
};

Scene_Skill.prototype.user = function () {
    return this.actor();
};

Scene_Skill.prototype.commandSkill = function () {
    this._itemWindow.activate();
    this._itemWindow.selectLast();
};

Scene_Skill.prototype.onItemOk = function () {
    this.actor().setLastMenuSkill(this.item());
    this.determineItem();
};

Scene_Skill.prototype.onItemCancel = function () {
    this._itemWindow.deselect();
    this._skillTypeWindow.activate();
};

Scene_Skill.prototype.playSeForItem = function () {
    _managers.SoundManager.playUseSkill();
};

Scene_Skill.prototype.useItem = function () {
    Scene_ItemBase.prototype.useItem.call(this);
    this._statusWindow.refresh();
    this._itemWindow.refresh();
};

Scene_Skill.prototype.onActorChange = function () {
    this.refreshActor();
    this._skillTypeWindow.activate();
};

//-----------------------------------------------------------------------------
// Scene_Equip
//
// The scene class of the equipment screen.

function Scene_Equip() {
    this.initialize.apply(this, arguments);
}

Scene_Equip.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Equip.prototype.constructor = Scene_Equip;

Scene_Equip.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_Equip.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createStatusWindow();
    this.createCommandWindow();
    this.createSlotWindow();
    this.createItemWindow();
    this.refreshActor();
};

Scene_Equip.prototype.createStatusWindow = function () {
    this._statusWindow = new _windows.Window_EquipStatus(0, this._helpWindow.height);
    this.addWindow(this._statusWindow);
};

Scene_Equip.prototype.createCommandWindow = function () {
    var wx = this._statusWindow.width;
    var wy = this._helpWindow.height;
    var ww = _core.Graphics.boxWidth - this._statusWindow.width;
    this._commandWindow = new _windows.Window_EquipCommand(wx, wy, ww);
    this._commandWindow.setHelpWindow(this._helpWindow);
    this._commandWindow.setHandler('equip', this.commandEquip.bind(this));
    this._commandWindow.setHandler('optimize', this.commandOptimize.bind(this));
    this._commandWindow.setHandler('clear', this.commandClear.bind(this));
    this._commandWindow.setHandler('cancel', this.popScene.bind(this));
    this._commandWindow.setHandler('pagedown', this.nextActor.bind(this));
    this._commandWindow.setHandler('pageup', this.previousActor.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_Equip.prototype.createSlotWindow = function () {
    var wx = this._statusWindow.width;
    var wy = this._commandWindow.y + this._commandWindow.height;
    var ww = _core.Graphics.boxWidth - this._statusWindow.width;
    var wh = this._statusWindow.height - this._commandWindow.height;
    this._slotWindow = new _windows.Window_EquipSlot(wx, wy, ww, wh);
    this._slotWindow.setHelpWindow(this._helpWindow);
    this._slotWindow.setStatusWindow(this._statusWindow);
    this._slotWindow.setHandler('ok', this.onSlotOk.bind(this));
    this._slotWindow.setHandler('cancel', this.onSlotCancel.bind(this));
    this.addWindow(this._slotWindow);
};

Scene_Equip.prototype.createItemWindow = function () {
    var wx = 0;
    var wy = this._statusWindow.y + this._statusWindow.height;
    var ww = _core.Graphics.boxWidth;
    var wh = _core.Graphics.boxHeight - wy;
    this._itemWindow = new _windows.Window_EquipItem(wx, wy, ww, wh);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setStatusWindow(this._statusWindow);
    this._itemWindow.setHandler('ok', this.onItemOk.bind(this));
    this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
    this._slotWindow.setItemWindow(this._itemWindow);
    this.addWindow(this._itemWindow);
};

Scene_Equip.prototype.refreshActor = function () {
    var actor = this.actor();
    this._statusWindow.setActor(actor);
    this._slotWindow.setActor(actor);
    this._itemWindow.setActor(actor);
};

Scene_Equip.prototype.commandEquip = function () {
    this._slotWindow.activate();
    this._slotWindow.select(0);
};

Scene_Equip.prototype.commandOptimize = function () {
    _managers.SoundManager.playEquip();
    this.actor().optimizeEquipments();
    this._statusWindow.refresh();
    this._slotWindow.refresh();
    this._commandWindow.activate();
};

Scene_Equip.prototype.commandClear = function () {
    _managers.SoundManager.playEquip();
    this.actor().clearEquipments();
    this._statusWindow.refresh();
    this._slotWindow.refresh();
    this._commandWindow.activate();
};

Scene_Equip.prototype.onSlotOk = function () {
    this._itemWindow.activate();
    this._itemWindow.select(0);
};

Scene_Equip.prototype.onSlotCancel = function () {
    this._slotWindow.deselect();
    this._commandWindow.activate();
};

Scene_Equip.prototype.onItemOk = function () {
    _managers.SoundManager.playEquip();
    this.actor().changeEquip(this._slotWindow.index(), this._itemWindow.item());
    this._slotWindow.activate();
    this._slotWindow.refresh();
    this._itemWindow.deselect();
    this._itemWindow.refresh();
    this._statusWindow.refresh();
};

Scene_Equip.prototype.onItemCancel = function () {
    this._slotWindow.activate();
    this._itemWindow.deselect();
};

Scene_Equip.prototype.onActorChange = function () {
    this.refreshActor();
    this._commandWindow.activate();
};

//-----------------------------------------------------------------------------
// Scene_Status
//
// The scene class of the status screen.

function Scene_Status() {
    this.initialize.apply(this, arguments);
}

Scene_Status.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Status.prototype.constructor = Scene_Status;

Scene_Status.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_Status.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this._statusWindow = new _windows.Window_Status();
    this._statusWindow.setHandler('cancel', this.popScene.bind(this));
    this._statusWindow.setHandler('pagedown', this.nextActor.bind(this));
    this._statusWindow.setHandler('pageup', this.previousActor.bind(this));
    this.addWindow(this._statusWindow);
    this.refreshActor();
};

Scene_Status.prototype.refreshActor = function () {
    var actor = this.actor();
    this._statusWindow.setActor(actor);
};

Scene_Status.prototype.onActorChange = function () {
    this.refreshActor();
    this._statusWindow.activate();
};

//-----------------------------------------------------------------------------
// Scene_Options
//
// The scene class of the options screen.

function Scene_Options() {
    this.initialize.apply(this, arguments);
}

Scene_Options.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Options.prototype.constructor = Scene_Options;

Scene_Options.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_Options.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createOptionsWindow();
};

Scene_Options.prototype.terminate = function () {
    Scene_MenuBase.prototype.terminate.call(this);
    _managers.ConfigManager.save();
};

Scene_Options.prototype.createOptionsWindow = function () {
    this._optionsWindow = new _windows.Window_Options();
    this._optionsWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._optionsWindow);
};

//-----------------------------------------------------------------------------
// Scene_File
//
// The superclass of Scene_Save and Scene_Load.

function Scene_File() {
    this.initialize.apply(this, arguments);
}

Scene_File.prototype = Object.create(Scene_MenuBase.prototype);
Scene_File.prototype.constructor = Scene_File;

Scene_File.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_File.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    _managers.DataManager.loadAllSavefileImages();
    this.createHelpWindow();
    this.createListWindow();
};

Scene_File.prototype.start = function () {
    Scene_MenuBase.prototype.start.call(this);
    this._listWindow.refresh();
};

Scene_File.prototype.savefileId = function () {
    return this._listWindow.index() + 1;
};

Scene_File.prototype.createHelpWindow = function () {
    this._helpWindow = new _windows.Window_Help(1);
    this._helpWindow.setText(this.helpWindowText());
    this.addWindow(this._helpWindow);
};

Scene_File.prototype.createListWindow = function () {
    var x = 0;
    var y = this._helpWindow.height;
    var width = _core.Graphics.boxWidth;
    var height = _core.Graphics.boxHeight - y;
    this._listWindow = new _windows.Window_SavefileList(x, y, width, height);
    this._listWindow.setHandler('ok', this.onSavefileOk.bind(this));
    this._listWindow.setHandler('cancel', this.popScene.bind(this));
    this._listWindow.select(this.firstSavefileIndex());
    this._listWindow.setTopRow(this.firstSavefileIndex() - 2);
    this._listWindow.setMode(this.mode());
    this._listWindow.refresh();
    this.addWindow(this._listWindow);
};

Scene_File.prototype.mode = function () {
    return null;
};

Scene_File.prototype.activateListWindow = function () {
    this._listWindow.activate();
};

Scene_File.prototype.helpWindowText = function () {
    return '';
};

Scene_File.prototype.firstSavefileIndex = function () {
    return 0;
};

Scene_File.prototype.onSavefileOk = function () {};

//-----------------------------------------------------------------------------
// Scene_Save
//
// The scene class of the save screen.

function Scene_Save() {
    this.initialize.apply(this, arguments);
}

Scene_Save.prototype = Object.create(Scene_File.prototype);
Scene_Save.prototype.constructor = Scene_Save;

Scene_Save.prototype.initialize = function () {
    Scene_File.prototype.initialize.call(this);
};

Scene_Save.prototype.mode = function () {
    return 'save';
};

Scene_Save.prototype.helpWindowText = function () {
    return _managers.TextManager.saveMessage;
};

Scene_Save.prototype.firstSavefileIndex = function () {
    return _managers.DataManager.lastAccessedSavefileId() - 1;
};

Scene_Save.prototype.onSavefileOk = function () {
    Scene_File.prototype.onSavefileOk.call(this);
    $gameSystem.onBeforeSave();
    if (_managers.DataManager.saveGame(this.savefileId())) {
        this.onSaveSuccess();
    } else {
        this.onSaveFailure();
    }
};

Scene_Save.prototype.onSaveSuccess = function () {
    _managers.SoundManager.playSave();
    this.popScene();
};

Scene_Save.prototype.onSaveFailure = function () {
    _managers.SoundManager.playBuzzer();
    this.activateListWindow();
};

//-----------------------------------------------------------------------------
// Scene_Load
//
// The scene class of the load screen.

function Scene_Load() {
    this.initialize.apply(this, arguments);
}

Scene_Load.prototype = Object.create(Scene_File.prototype);
Scene_Load.prototype.constructor = Scene_Load;

Scene_Load.prototype.initialize = function () {
    Scene_File.prototype.initialize.call(this);
    this._loadSuccess = false;
};

Scene_Load.prototype.terminate = function () {
    Scene_File.prototype.terminate.call(this);
    if (this._loadSuccess) {
        $gameSystem.onAfterLoad();
    }
};

Scene_Load.prototype.mode = function () {
    return 'load';
};

Scene_Load.prototype.helpWindowText = function () {
    return _managers.TextManager.loadMessage;
};

Scene_Load.prototype.firstSavefileIndex = function () {
    return _managers.DataManager.latestSavefileId() - 1;
};

Scene_Load.prototype.onSavefileOk = function () {
    Scene_File.prototype.onSavefileOk.call(this);
    if (_managers.DataManager.loadGame(this.savefileId())) {
        this.onLoadSuccess();
    } else {
        this.onLoadFailure();
    }
};

Scene_Load.prototype.onLoadSuccess = function () {
    _managers.SoundManager.playLoad();
    this.fadeOutAll();
    this.reloadMapIfUpdated();
    _managers.SceneManager.goto(Scene_Map);
    this._loadSuccess = true;
};

Scene_Load.prototype.onLoadFailure = function () {
    _managers.SoundManager.playBuzzer();
    this.activateListWindow();
};

Scene_Load.prototype.reloadMapIfUpdated = function () {
    if ($gameSystem.versionId() !== $dataSystem.versionId) {
        $gamePlayer.reserveTransfer($gameMap.mapId(), $gamePlayer.x, $gamePlayer.y);
        $gamePlayer.requestMapReload();
    }
};

//-----------------------------------------------------------------------------
// Scene_GameEnd
//
// The scene class of the game end screen.

function Scene_GameEnd() {
    this.initialize.apply(this, arguments);
}

Scene_GameEnd.prototype = Object.create(Scene_MenuBase.prototype);
Scene_GameEnd.prototype.constructor = Scene_GameEnd;

Scene_GameEnd.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_GameEnd.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createCommandWindow();
};

Scene_GameEnd.prototype.stop = function () {
    Scene_MenuBase.prototype.stop.call(this);
    this._commandWindow.close();
};

Scene_GameEnd.prototype.createBackground = function () {
    Scene_MenuBase.prototype.createBackground.call(this);
    this.setBackgroundOpacity(128);
};

Scene_GameEnd.prototype.createCommandWindow = function () {
    this._commandWindow = new _windows.Window_GameEnd();
    this._commandWindow.setHandler('toTitle', this.commandToTitle.bind(this));
    this._commandWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_GameEnd.prototype.commandToTitle = function () {
    this.fadeOutAll();
    _managers.SceneManager.goto(Scene_Title);
};

//-----------------------------------------------------------------------------
// Scene_Shop
//
// The scene class of the shop screen.

function Scene_Shop() {
    this.initialize.apply(this, arguments);
}

Scene_Shop.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Shop.prototype.constructor = Scene_Shop;

Scene_Shop.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_Shop.prototype.prepare = function (goods, purchaseOnly) {
    this._goods = goods;
    this._purchaseOnly = purchaseOnly;
    this._item = null;
};

Scene_Shop.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createGoldWindow();
    this.createCommandWindow();
    this.createDummyWindow();
    this.createNumberWindow();
    this.createStatusWindow();
    this.createBuyWindow();
    this.createCategoryWindow();
    this.createSellWindow();
};

Scene_Shop.prototype.createGoldWindow = function () {
    this._goldWindow = new _windows.Window_Gold(0, this._helpWindow.height);
    this._goldWindow.x = _core.Graphics.boxWidth - this._goldWindow.width;
    this.addWindow(this._goldWindow);
};

Scene_Shop.prototype.createCommandWindow = function () {
    this._commandWindow = new Window_ShopCommand(this._goldWindow.x, this._purchaseOnly);
    this._commandWindow.y = this._helpWindow.height;
    this._commandWindow.setHandler('buy', this.commandBuy.bind(this));
    this._commandWindow.setHandler('sell', this.commandSell.bind(this));
    this._commandWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_Shop.prototype.createDummyWindow = function () {
    var wy = this._commandWindow.y + this._commandWindow.height;
    var wh = _core.Graphics.boxHeight - wy;
    this._dummyWindow = new Window_Base(0, wy, _core.Graphics.boxWidth, wh);
    this.addWindow(this._dummyWindow);
};

Scene_Shop.prototype.createNumberWindow = function () {
    var wy = this._dummyWindow.y;
    var wh = this._dummyWindow.height;
    this._numberWindow = new Window_ShopNumber(0, wy, wh);
    this._numberWindow.hide();
    this._numberWindow.setHandler('ok', this.onNumberOk.bind(this));
    this._numberWindow.setHandler('cancel', this.onNumberCancel.bind(this));
    this.addWindow(this._numberWindow);
};

Scene_Shop.prototype.createStatusWindow = function () {
    var wx = this._numberWindow.width;
    var wy = this._dummyWindow.y;
    var ww = _core.Graphics.boxWidth - wx;
    var wh = this._dummyWindow.height;
    this._statusWindow = new Window_ShopStatus(wx, wy, ww, wh);
    this._statusWindow.hide();
    this.addWindow(this._statusWindow);
};

Scene_Shop.prototype.createBuyWindow = function () {
    var wy = this._dummyWindow.y;
    var wh = this._dummyWindow.height;
    this._buyWindow = new Window_ShopBuy(0, wy, wh, this._goods);
    this._buyWindow.setHelpWindow(this._helpWindow);
    this._buyWindow.setStatusWindow(this._statusWindow);
    this._buyWindow.hide();
    this._buyWindow.setHandler('ok', this.onBuyOk.bind(this));
    this._buyWindow.setHandler('cancel', this.onBuyCancel.bind(this));
    this.addWindow(this._buyWindow);
};

Scene_Shop.prototype.createCategoryWindow = function () {
    this._categoryWindow = new _windows.Window_ItemCategory();
    this._categoryWindow.setHelpWindow(this._helpWindow);
    this._categoryWindow.y = this._dummyWindow.y;
    this._categoryWindow.hide();
    this._categoryWindow.deactivate();
    this._categoryWindow.setHandler('ok', this.onCategoryOk.bind(this));
    this._categoryWindow.setHandler('cancel', this.onCategoryCancel.bind(this));
    this.addWindow(this._categoryWindow);
};

Scene_Shop.prototype.createSellWindow = function () {
    var wy = this._categoryWindow.y + this._categoryWindow.height;
    var wh = _core.Graphics.boxHeight - wy;
    this._sellWindow = new Window_ShopSell(0, wy, _core.Graphics.boxWidth, wh);
    this._sellWindow.setHelpWindow(this._helpWindow);
    this._sellWindow.hide();
    this._sellWindow.setHandler('ok', this.onSellOk.bind(this));
    this._sellWindow.setHandler('cancel', this.onSellCancel.bind(this));
    this._categoryWindow.setItemWindow(this._sellWindow);
    this.addWindow(this._sellWindow);
};

Scene_Shop.prototype.activateBuyWindow = function () {
    this._buyWindow.setMoney(this.money());
    this._buyWindow.show();
    this._buyWindow.activate();
    this._statusWindow.show();
};

Scene_Shop.prototype.activateSellWindow = function () {
    this._categoryWindow.show();
    this._sellWindow.refresh();
    this._sellWindow.show();
    this._sellWindow.activate();
    this._statusWindow.hide();
};

Scene_Shop.prototype.commandBuy = function () {
    this._dummyWindow.hide();
    this.activateBuyWindow();
};

Scene_Shop.prototype.commandSell = function () {
    this._dummyWindow.hide();
    this._categoryWindow.show();
    this._categoryWindow.activate();
    this._sellWindow.show();
    this._sellWindow.deselect();
    this._sellWindow.refresh();
};

Scene_Shop.prototype.onBuyOk = function () {
    this._item = this._buyWindow.item();
    this._buyWindow.hide();
    this._numberWindow.setup(this._item, this.maxBuy(), this.buyingPrice());
    this._numberWindow.setCurrencyUnit(this.currencyUnit());
    this._numberWindow.show();
    this._numberWindow.activate();
};

Scene_Shop.prototype.onBuyCancel = function () {
    this._commandWindow.activate();
    this._dummyWindow.show();
    this._buyWindow.hide();
    this._statusWindow.hide();
    this._statusWindow.setItem(null);
    this._helpWindow.clear();
};

Scene_Shop.prototype.onCategoryOk = function () {
    this.activateSellWindow();
    this._sellWindow.select(0);
};

Scene_Shop.prototype.onCategoryCancel = function () {
    this._commandWindow.activate();
    this._dummyWindow.show();
    this._categoryWindow.hide();
    this._sellWindow.hide();
};

Scene_Shop.prototype.onSellOk = function () {
    this._item = this._sellWindow.item();
    this._categoryWindow.hide();
    this._sellWindow.hide();
    this._numberWindow.setup(this._item, this.maxSell(), this.sellingPrice());
    this._numberWindow.setCurrencyUnit(this.currencyUnit());
    this._numberWindow.show();
    this._numberWindow.activate();
    this._statusWindow.setItem(this._item);
    this._statusWindow.show();
};

Scene_Shop.prototype.onSellCancel = function () {
    this._sellWindow.deselect();
    this._categoryWindow.activate();
    this._statusWindow.setItem(null);
    this._helpWindow.clear();
};

Scene_Shop.prototype.onNumberOk = function () {
    _managers.SoundManager.playShop();
    switch (this._commandWindow.currentSymbol()) {
        case 'buy':
            this.doBuy(this._numberWindow.number());
            break;
        case 'sell':
            this.doSell(this._numberWindow.number());
            break;
    }
    this.endNumberInput();
    this._goldWindow.refresh();
    this._statusWindow.refresh();
};

Scene_Shop.prototype.onNumberCancel = function () {
    _managers.SoundManager.playCancel();
    this.endNumberInput();
};

Scene_Shop.prototype.doBuy = function (number) {
    $gameParty.loseGold(number * this.buyingPrice());
    $gameParty.gainItem(this._item, number);
};

Scene_Shop.prototype.doSell = function (number) {
    $gameParty.gainGold(number * this.sellingPrice());
    $gameParty.loseItem(this._item, number);
};

Scene_Shop.prototype.endNumberInput = function () {
    this._numberWindow.hide();
    switch (this._commandWindow.currentSymbol()) {
        case 'buy':
            this.activateBuyWindow();
            break;
        case 'sell':
            this.activateSellWindow();
            break;
    }
};

Scene_Shop.prototype.maxBuy = function () {
    var max = $gameParty.maxItems(this._item) - $gameParty.numItems(this._item);
    var price = this.buyingPrice();
    if (price > 0) {
        return Math.min(max, Math.floor(this.money() / price));
    } else {
        return max;
    }
};

Scene_Shop.prototype.maxSell = function () {
    return $gameParty.numItems(this._item);
};

Scene_Shop.prototype.money = function () {
    return this._goldWindow.value();
};

Scene_Shop.prototype.currencyUnit = function () {
    return this._goldWindow.currencyUnit();
};

Scene_Shop.prototype.buyingPrice = function () {
    return this._buyWindow.price(this._item);
};

Scene_Shop.prototype.sellingPrice = function () {
    return Math.floor(this._item.price / 2);
};

//-----------------------------------------------------------------------------
// Scene_Name
//
// The scene class of the name input screen.

function Scene_Name() {
    this.initialize.apply(this, arguments);
}

Scene_Name.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Name.prototype.constructor = Scene_Name;

Scene_Name.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_Name.prototype.prepare = function (actorId, maxLength) {
    this._actorId = actorId;
    this._maxLength = maxLength;
};

Scene_Name.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this._actor = $gameActors.actor(this._actorId);
    this.createEditWindow();
    this.createInputWindow();
};

Scene_Name.prototype.start = function () {
    Scene_MenuBase.prototype.start.call(this);
    this._editWindow.refresh();
};

Scene_Name.prototype.createEditWindow = function () {
    this._editWindow = new Window_NameEdit(this._actor, this._maxLength);
    this.addWindow(this._editWindow);
};

Scene_Name.prototype.createInputWindow = function () {
    this._inputWindow = new Window_NameInput(this._editWindow);
    this._inputWindow.setHandler('ok', this.onInputOk.bind(this));
    this.addWindow(this._inputWindow);
};

Scene_Name.prototype.onInputOk = function () {
    this._actor.setName(this._editWindow.name());
    this.popScene();
};

//-----------------------------------------------------------------------------
// Scene_Debug
//
// The scene class of the debug screen.

function Scene_Debug() {
    this.initialize.apply(this, arguments);
}

Scene_Debug.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Debug.prototype.constructor = Scene_Debug;

Scene_Debug.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_Debug.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createRangeWindow();
    this.createEditWindow();
    this.createDebugHelpWindow();
};

Scene_Debug.prototype.createRangeWindow = function () {
    this._rangeWindow = new Window_DebugRange(0, 0);
    this._rangeWindow.setHandler('ok', this.onRangeOk.bind(this));
    this._rangeWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._rangeWindow);
};

Scene_Debug.prototype.createEditWindow = function () {
    var wx = this._rangeWindow.width;
    var ww = _core.Graphics.boxWidth - wx;
    this._editWindow = new Window_DebugEdit(wx, 0, ww);
    this._editWindow.setHandler('cancel', this.onEditCancel.bind(this));
    this._rangeWindow.setEditWindow(this._editWindow);
    this.addWindow(this._editWindow);
};

Scene_Debug.prototype.createDebugHelpWindow = function () {
    var wx = this._editWindow.x;
    var wy = this._editWindow.height;
    var ww = this._editWindow.width;
    var wh = _core.Graphics.boxHeight - wy;
    this._debugHelpWindow = new Window_Base(wx, wy, ww, wh);
    this.addWindow(this._debugHelpWindow);
};

Scene_Debug.prototype.onRangeOk = function () {
    this._editWindow.activate();
    this._editWindow.select(0);
    this.refreshHelpWindow();
};

Scene_Debug.prototype.onEditCancel = function () {
    this._rangeWindow.activate();
    this._editWindow.deselect();
    this.refreshHelpWindow();
};

Scene_Debug.prototype.refreshHelpWindow = function () {
    this._debugHelpWindow.contents.clear();
    if (this._editWindow.active) {
        this._debugHelpWindow.drawTextEx(this.helpText(), 4, 0);
    }
};

Scene_Debug.prototype.helpText = function () {
    if (this._rangeWindow.mode() === 'switch') {
        return 'Enter : ON / OFF';
    } else {
        return 'Left     :  -1\n' + 'Right    :  +1\n' + 'Pageup   : -10\n' + 'Pagedown : +10';
    }
};

//-----------------------------------------------------------------------------
// Scene_Battle
//
// The scene class of the battle screen.

function Scene_Battle() {
    this.initialize.apply(this, arguments);
}

Scene_Battle.prototype = Object.create(Scene_Base.prototype);
Scene_Battle.prototype.constructor = Scene_Battle;

Scene_Battle.prototype.initialize = function () {
    Scene_Base.prototype.initialize.call(this);
};

Scene_Battle.prototype.create = function () {
    Scene_Base.prototype.create.call(this);
    this.createDisplayObjects();
};

Scene_Battle.prototype.start = function () {
    Scene_Base.prototype.start.call(this);
    this.startFadeIn(this.fadeSpeed(), false);
    BattleManager.playBattleBgm();
    BattleManager.startBattle();
};

Scene_Battle.prototype.update = function () {
    var active = this.isActive();
    $gameTimer.update(active);
    $gameScreen.update();
    this.updateStatusWindow();
    this.updateWindowPositions();
    if (active && !this.isBusy()) {
        this.updateBattleProcess();
    }
    Scene_Base.prototype.update.call(this);
};

Scene_Battle.prototype.updateBattleProcess = function () {
    if (!this.isAnyInputWindowActive() || BattleManager.isAborting() || BattleManager.isBattleEnd()) {
        BattleManager.update();
        this.changeInputWindow();
    }
};

Scene_Battle.prototype.isAnyInputWindowActive = function () {
    return this._partyCommandWindow.active || this._actorCommandWindow.active || this._skillWindow.active || this._itemWindow.active || this._actorWindow.active || this._enemyWindow.active;
};

Scene_Battle.prototype.changeInputWindow = function () {
    if (BattleManager.isInputting()) {
        if (BattleManager.actor()) {
            this.startActorCommandSelection();
        } else {
            this.startPartyCommandSelection();
        }
    } else {
        this.endCommandSelection();
    }
};

Scene_Battle.prototype.stop = function () {
    Scene_Base.prototype.stop.call(this);
    if (this.needsSlowFadeOut()) {
        this.startFadeOut(this.slowFadeSpeed(), false);
    } else {
        this.startFadeOut(this.fadeSpeed(), false);
    }
    this._statusWindow.close();
    this._partyCommandWindow.close();
    this._actorCommandWindow.close();
};

Scene_Battle.prototype.terminate = function () {
    Scene_Base.prototype.terminate.call(this);
    $gameParty.onBattleEnd();
    $gameTroop.onBattleEnd();
    _managers.AudioManager.stopMe();
};

Scene_Battle.prototype.needsSlowFadeOut = function () {
    return _managers.SceneManager.isNextScene(Scene_Title) || _managers.SceneManager.isNextScene(Scene_Gameover);
};

Scene_Battle.prototype.updateStatusWindow = function () {
    if ($gameMessage.isBusy()) {
        this._statusWindow.close();
        this._partyCommandWindow.close();
        this._actorCommandWindow.close();
    } else if (this.isActive() && !this._messageWindow.isClosing()) {
        this._statusWindow.open();
    }
};

Scene_Battle.prototype.updateWindowPositions = function () {
    var statusX = 0;
    if (BattleManager.isInputting()) {
        statusX = this._partyCommandWindow.width;
    } else {
        statusX = this._partyCommandWindow.width / 2;
    }
    if (this._statusWindow.x < statusX) {
        this._statusWindow.x += 16;
        if (this._statusWindow.x > statusX) {
            this._statusWindow.x = statusX;
        }
    }
    if (this._statusWindow.x > statusX) {
        this._statusWindow.x -= 16;
        if (this._statusWindow.x < statusX) {
            this._statusWindow.x = statusX;
        }
    }
};

Scene_Battle.prototype.createDisplayObjects = function () {
    this.createSpriteset();
    this.createWindowLayer();
    this.createAllWindows();
    BattleManager.setLogWindow(this._logWindow);
    BattleManager.setStatusWindow(this._statusWindow);
    BattleManager.setSpriteset(this._spriteset);
    this._logWindow.setSpriteset(this._spriteset);
};

Scene_Battle.prototype.createSpriteset = function () {
    this._spriteset = new Spriteset_Battle();
    this.addChild(this._spriteset);
};

Scene_Battle.prototype.createAllWindows = function () {
    this.createLogWindow();
    this.createStatusWindow();
    this.createPartyCommandWindow();
    this.createActorCommandWindow();
    this.createHelpWindow();
    this.createSkillWindow();
    this.createItemWindow();
    this.createActorWindow();
    this.createEnemyWindow();
    this.createMessageWindow();
    this.createScrollTextWindow();
};

Scene_Battle.prototype.createLogWindow = function () {
    this._logWindow = new Window_BattleLog();
    this.addWindow(this._logWindow);
};

Scene_Battle.prototype.createStatusWindow = function () {
    this._statusWindow = new Window_BattleStatus();
    this.addWindow(this._statusWindow);
};

Scene_Battle.prototype.createPartyCommandWindow = function () {
    this._partyCommandWindow = new Window_PartyCommand();
    this._partyCommandWindow.setHandler('fight', this.commandFight.bind(this));
    this._partyCommandWindow.setHandler('escape', this.commandEscape.bind(this));
    this._partyCommandWindow.deselect();
    this.addWindow(this._partyCommandWindow);
};

Scene_Battle.prototype.createActorCommandWindow = function () {
    this._actorCommandWindow = new Window_ActorCommand();
    this._actorCommandWindow.setHandler('attack', this.commandAttack.bind(this));
    this._actorCommandWindow.setHandler('skill', this.commandSkill.bind(this));
    this._actorCommandWindow.setHandler('guard', this.commandGuard.bind(this));
    this._actorCommandWindow.setHandler('item', this.commandItem.bind(this));
    this._actorCommandWindow.setHandler('cancel', this.selectPreviousCommand.bind(this));
    this.addWindow(this._actorCommandWindow);
};

Scene_Battle.prototype.createHelpWindow = function () {
    this._helpWindow = new _windows.Window_Help();
    this._helpWindow.visible = false;
    this.addWindow(this._helpWindow);
};

Scene_Battle.prototype.createSkillWindow = function () {
    var wy = this._helpWindow.y + this._helpWindow.height;
    var wh = this._statusWindow.y - wy;
    this._skillWindow = new Window_BattleSkill(0, wy, _core.Graphics.boxWidth, wh);
    this._skillWindow.setHelpWindow(this._helpWindow);
    this._skillWindow.setHandler('ok', this.onSkillOk.bind(this));
    this._skillWindow.setHandler('cancel', this.onSkillCancel.bind(this));
    this.addWindow(this._skillWindow);
};

Scene_Battle.prototype.createItemWindow = function () {
    var wy = this._helpWindow.y + this._helpWindow.height;
    var wh = this._statusWindow.y - wy;
    this._itemWindow = new Window_BattleItem(0, wy, _core.Graphics.boxWidth, wh);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler('ok', this.onItemOk.bind(this));
    this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
    this.addWindow(this._itemWindow);
};

Scene_Battle.prototype.createActorWindow = function () {
    this._actorWindow = new Window_BattleActor(0, this._statusWindow.y);
    this._actorWindow.setHandler('ok', this.onActorOk.bind(this));
    this._actorWindow.setHandler('cancel', this.onActorCancel.bind(this));
    this.addWindow(this._actorWindow);
};

Scene_Battle.prototype.createEnemyWindow = function () {
    this._enemyWindow = new Window_BattleEnemy(0, this._statusWindow.y);
    this._enemyWindow.x = _core.Graphics.boxWidth - this._enemyWindow.width;
    this._enemyWindow.setHandler('ok', this.onEnemyOk.bind(this));
    this._enemyWindow.setHandler('cancel', this.onEnemyCancel.bind(this));
    this.addWindow(this._enemyWindow);
};

Scene_Battle.prototype.createMessageWindow = function () {
    this._messageWindow = new _windows.Window_Message();
    this.addWindow(this._messageWindow);
    this._messageWindow.subWindows().forEach(function (window) {
        this.addWindow(window);
    }, this);
};

Scene_Battle.prototype.createScrollTextWindow = function () {
    this._scrollTextWindow = new _windows.Window_ScrollText();
    this.addWindow(this._scrollTextWindow);
};

Scene_Battle.prototype.refreshStatus = function () {
    this._statusWindow.refresh();
};

Scene_Battle.prototype.startPartyCommandSelection = function () {
    this.refreshStatus();
    this._statusWindow.deselect();
    this._statusWindow.open();
    this._actorCommandWindow.close();
    this._partyCommandWindow.setup();
};

Scene_Battle.prototype.commandFight = function () {
    this.selectNextCommand();
};

Scene_Battle.prototype.commandEscape = function () {
    BattleManager.processEscape();
    this.changeInputWindow();
};

Scene_Battle.prototype.startActorCommandSelection = function () {
    this._statusWindow.select(BattleManager.actor().index());
    this._partyCommandWindow.close();
    this._actorCommandWindow.setup(BattleManager.actor());
};

Scene_Battle.prototype.commandAttack = function () {
    BattleManager.inputtingAction().setAttack();
    this.selectEnemySelection();
};

Scene_Battle.prototype.commandSkill = function () {
    this._skillWindow.setActor(BattleManager.actor());
    this._skillWindow.setStypeId(this._actorCommandWindow.currentExt());
    this._skillWindow.refresh();
    this._skillWindow.show();
    this._skillWindow.activate();
};

Scene_Battle.prototype.commandGuard = function () {
    BattleManager.inputtingAction().setGuard();
    this.selectNextCommand();
};

Scene_Battle.prototype.commandItem = function () {
    this._itemWindow.refresh();
    this._itemWindow.show();
    this._itemWindow.activate();
};

Scene_Battle.prototype.selectNextCommand = function () {
    BattleManager.selectNextCommand();
    this.changeInputWindow();
};

Scene_Battle.prototype.selectPreviousCommand = function () {
    BattleManager.selectPreviousCommand();
    this.changeInputWindow();
};

Scene_Battle.prototype.selectActorSelection = function () {
    this._actorWindow.refresh();
    this._actorWindow.show();
    this._actorWindow.activate();
};

Scene_Battle.prototype.onActorOk = function () {
    var action = BattleManager.inputtingAction();
    action.setTarget(this._actorWindow.index());
    this._actorWindow.hide();
    this._skillWindow.hide();
    this._itemWindow.hide();
    this.selectNextCommand();
};

Scene_Battle.prototype.onActorCancel = function () {
    this._actorWindow.hide();
    switch (this._actorCommandWindow.currentSymbol()) {
        case 'skill':
            this._skillWindow.show();
            this._skillWindow.activate();
            break;
        case 'item':
            this._itemWindow.show();
            this._itemWindow.activate();
            break;
    }
};

Scene_Battle.prototype.selectEnemySelection = function () {
    this._enemyWindow.refresh();
    this._enemyWindow.show();
    this._enemyWindow.select(0);
    this._enemyWindow.activate();
};

Scene_Battle.prototype.onEnemyOk = function () {
    var action = BattleManager.inputtingAction();
    action.setTarget(this._enemyWindow.enemyIndex());
    this._enemyWindow.hide();
    this._skillWindow.hide();
    this._itemWindow.hide();
    this.selectNextCommand();
};

Scene_Battle.prototype.onEnemyCancel = function () {
    this._enemyWindow.hide();
    switch (this._actorCommandWindow.currentSymbol()) {
        case 'attack':
            this._actorCommandWindow.activate();
            break;
        case 'skill':
            this._skillWindow.show();
            this._skillWindow.activate();
            break;
        case 'item':
            this._itemWindow.show();
            this._itemWindow.activate();
            break;
    }
};

Scene_Battle.prototype.onSkillOk = function () {
    var skill = this._skillWindow.item();
    var action = BattleManager.inputtingAction();
    action.setSkill(skill.id);
    BattleManager.actor().setLastBattleSkill(skill);
    this.onSelectAction();
};

Scene_Battle.prototype.onSkillCancel = function () {
    this._skillWindow.hide();
    this._actorCommandWindow.activate();
};

Scene_Battle.prototype.onItemOk = function () {
    var item = this._itemWindow.item();
    var action = BattleManager.inputtingAction();
    action.setItem(item.id);
    $gameParty.setLastItem(item);
    this.onSelectAction();
};

Scene_Battle.prototype.onItemCancel = function () {
    this._itemWindow.hide();
    this._actorCommandWindow.activate();
};

Scene_Battle.prototype.onSelectAction = function () {
    var action = BattleManager.inputtingAction();
    this._skillWindow.hide();
    this._itemWindow.hide();
    if (!action.needsSelection()) {
        this.selectNextCommand();
    } else if (action.isForOpponent()) {
        this.selectEnemySelection();
    } else {
        this.selectActorSelection();
    }
};

Scene_Battle.prototype.endCommandSelection = function () {
    this._partyCommandWindow.close();
    this._actorCommandWindow.close();
    this._statusWindow.deselect();
};

//-----------------------------------------------------------------------------
// Scene_Gameover
//
// The scene class of the game over screen.

function Scene_Gameover() {
    this.initialize.apply(this, arguments);
}

Scene_Gameover.prototype = Object.create(Scene_Base.prototype);
Scene_Gameover.prototype.constructor = Scene_Gameover;

Scene_Gameover.prototype.initialize = function () {
    Scene_Base.prototype.initialize.call(this);
};

Scene_Gameover.prototype.create = function () {
    Scene_Base.prototype.create.call(this);
    this.playGameoverMusic();
    this.createBackground();
};

Scene_Gameover.prototype.start = function () {
    Scene_Base.prototype.start.call(this);
    this.startFadeIn(this.slowFadeSpeed(), false);
};

Scene_Gameover.prototype.update = function () {
    if (this.isActive() && !this.isBusy() && this.isTriggered()) {
        this.gotoTitle();
    }
    Scene_Base.prototype.update.call(this);
};

Scene_Gameover.prototype.stop = function () {
    Scene_Base.prototype.stop.call(this);
    this.fadeOutAll();
};

Scene_Gameover.prototype.terminate = function () {
    Scene_Base.prototype.terminate.call(this);
    _managers.AudioManager.stopAll();
};

Scene_Gameover.prototype.playGameoverMusic = function () {
    _managers.AudioManager.stopBgm();
    _managers.AudioManager.stopBgs();
    _managers.AudioManager.playMe($dataSystem.gameoverMe);
};

Scene_Gameover.prototype.createBackground = function () {
    this._backSprite = new _core.Sprite();
    this._backSprite.bitmap = _managers.ImageManager.loadSystem('GameOver');
    this.addChild(this._backSprite);
};

Scene_Gameover.prototype.isTriggered = function () {
    return _core.Input.isTriggered('ok') || _core.TouchInput.isTriggered();
};

Scene_Gameover.prototype.gotoTitle = function () {
    _managers.SceneManager.goto(Scene_Title);
};

},{"./core":4,"./managers":6,"./objects":7,"./sprites":10,"./windows":11}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.Sprite_Base = Sprite_Base;
exports.Sprite_Button = Sprite_Button;
exports.Sprite_Character = Sprite_Character;
exports.Sprite_Battler = Sprite_Battler;
exports.Sprite_Actor = Sprite_Actor;
exports.Sprite_Enemy = Sprite_Enemy;
exports.Sprite_Animation = Sprite_Animation;
exports.Sprite_Damage = Sprite_Damage;
exports.Sprite_StateIcon = Sprite_StateIcon;
exports.Sprite_StateOverlay = Sprite_StateOverlay;
exports.Sprite_Weapon = Sprite_Weapon;
exports.Sprite_Balloon = Sprite_Balloon;
exports.Sprite_Picture = Sprite_Picture;
exports.Sprite_Timer = Sprite_Timer;
exports.Sprite_Destination = Sprite_Destination;
exports.Spriteset_Base = Spriteset_Base;
exports.Spriteset_Map = Spriteset_Map;
exports.Spriteset_Battle = Spriteset_Battle;

var _core = require('./core');

var _managers = require('./managers');

//=============================================================================
// rpg_sprites.js
//=============================================================================

//-----------------------------------------------------------------------------
// Sprite_Base
//
// The sprite class with a feature which displays animations.

function Sprite_Base() {
    this.initialize.apply(this, arguments);
}

Sprite_Base.prototype = Object.create(_core.Sprite.prototype);
Sprite_Base.prototype.constructor = Sprite_Base;

Sprite_Base.prototype.initialize = function () {
    _core.Sprite.prototype.initialize.call(this);
    this._animationSprites = [];
    this._effectTarget = this;
    this._hiding = false;
};

Sprite_Base.prototype.update = function () {
    _core.Sprite.prototype.update.call(this);
    this.updateVisibility();
    this.updateAnimationSprites();
};

Sprite_Base.prototype.hide = function () {
    this._hiding = true;
    this.updateVisibility();
};

Sprite_Base.prototype.show = function () {
    this._hiding = false;
    this.updateVisibility();
};

Sprite_Base.prototype.updateVisibility = function () {
    this.visible = !this._hiding;
};

Sprite_Base.prototype.updateAnimationSprites = function () {
    if (this._animationSprites.length > 0) {
        var sprites = this._animationSprites.clone();
        this._animationSprites = [];
        for (var i = 0; i < sprites.length; i++) {
            var sprite = sprites[i];
            if (sprite.isPlaying()) {
                this._animationSprites.push(sprite);
            } else {
                sprite.remove();
            }
        }
    }
};

Sprite_Base.prototype.startAnimation = function (animation, mirror, delay) {
    var sprite = new Sprite_Animation();
    sprite.setup(this._effectTarget, animation, mirror, delay);
    this.parent.addChild(sprite);
    this._animationSprites.push(sprite);
};

Sprite_Base.prototype.isAnimationPlaying = function () {
    return this._animationSprites.length > 0;
};

//-----------------------------------------------------------------------------
// Sprite_Button
//
// The sprite for displaying a button.

function Sprite_Button() {
    this.initialize.apply(this, arguments);
}

Sprite_Button.prototype = Object.create(_core.Sprite.prototype);
Sprite_Button.prototype.constructor = Sprite_Button;

Sprite_Button.prototype.initialize = function () {
    _core.Sprite.prototype.initialize.call(this);
    this._touching = false;
    this._coldFrame = null;
    this._hotFrame = null;
    this._clickHandler = null;
};

Sprite_Button.prototype.update = function () {
    _core.Sprite.prototype.update.call(this);
    this.updateFrame();
    this.processTouch();
};

Sprite_Button.prototype.updateFrame = function () {
    var frame;
    if (this._touching) {
        frame = this._hotFrame;
    } else {
        frame = this._coldFrame;
    }
    if (frame) {
        this.setFrame(frame.x, frame.y, frame.width, frame.height);
    }
};

Sprite_Button.prototype.setColdFrame = function (x, y, width, height) {
    this._coldFrame = new _core.Rectangle(x, y, width, height);
};

Sprite_Button.prototype.setHotFrame = function (x, y, width, height) {
    this._hotFrame = new _core.Rectangle(x, y, width, height);
};

Sprite_Button.prototype.setClickHandler = function (method) {
    this._clickHandler = method;
};

Sprite_Button.prototype.callClickHandler = function () {
    if (this._clickHandler) {
        this._clickHandler();
    }
};

Sprite_Button.prototype.processTouch = function () {
    if (this.isActive()) {
        if (TouchInput.isTriggered() && this.isButtonTouched()) {
            this._touching = true;
        }
        if (this._touching) {
            if (TouchInput.isReleased() || !this.isButtonTouched()) {
                this._touching = false;
                if (TouchInput.isReleased()) {
                    this.callClickHandler();
                }
            }
        }
    } else {
        this._touching = false;
    }
};

Sprite_Button.prototype.isActive = function () {
    var node = this;
    while (node) {
        if (!node.visible) {
            return false;
        }
        node = node.parent;
    }
    return true;
};

Sprite_Button.prototype.isButtonTouched = function () {
    var x = this.canvasToLocalX(TouchInput.x);
    var y = this.canvasToLocalY(TouchInput.y);
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
};

Sprite_Button.prototype.canvasToLocalX = function (x) {
    var node = this;
    while (node) {
        x -= node.x;
        node = node.parent;
    }
    return x;
};

Sprite_Button.prototype.canvasToLocalY = function (y) {
    var node = this;
    while (node) {
        y -= node.y;
        node = node.parent;
    }
    return y;
};

//-----------------------------------------------------------------------------
// Sprite_Character
//
// The sprite for displaying a character.

function Sprite_Character() {
    this.initialize.apply(this, arguments);
}

Sprite_Character.prototype = Object.create(Sprite_Base.prototype);
Sprite_Character.prototype.constructor = Sprite_Character;

Sprite_Character.prototype.initialize = function (character) {
    Sprite_Base.prototype.initialize.call(this);
    this.initMembers();
    this.setCharacter(character);
};

Sprite_Character.prototype.initMembers = function () {
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this._character = null;
    this._balloonDuration = 0;
    this._tilesetId = 0;
    this._upperBody = null;
    this._lowerBody = null;
};

Sprite_Character.prototype.setCharacter = function (character) {
    this._character = character;
};

Sprite_Character.prototype.update = function () {
    Sprite_Base.prototype.update.call(this);
    this.updateBitmap();
    this.updateFrame();
    this.updatePosition();
    this.updateAnimation();
    this.updateBalloon();
    this.updateOther();
};

Sprite_Character.prototype.updateVisibility = function () {
    Sprite_Base.prototype.updateVisibility.call(this);
    if (this._character.isTransparent()) {
        this.visible = false;
    }
};

Sprite_Character.prototype.isTile = function () {
    return this._character.tileId > 0;
};

Sprite_Character.prototype.tilesetBitmap = function (tileId) {
    var tileset = $gameMap.tileset();
    var setNumber = 5 + Math.floor(tileId / 256);
    return _managers.ImageManager.loadTileset(tileset.tilesetNames[setNumber]);
};

Sprite_Character.prototype.updateBitmap = function () {
    if (this.isImageChanged()) {
        this._tilesetId = $gameMap.tilesetId();
        this._tileId = this._character.tileId();
        this._characterName = this._character.characterName();
        this._characterIndex = this._character.characterIndex();
        if (this._tileId > 0) {
            this.setTileBitmap();
        } else {
            this.setCharacterBitmap();
        }
    }
};

Sprite_Character.prototype.isImageChanged = function () {
    return this._tilesetId !== $gameMap.tilesetId() || this._tileId !== this._character.tileId() || this._characterName !== this._character.characterName() || this._characterIndex !== this._character.characterIndex();
};

Sprite_Character.prototype.setTileBitmap = function () {
    this.bitmap = this.tilesetBitmap(this._tileId);
};

Sprite_Character.prototype.setCharacterBitmap = function () {
    this.bitmap = _managers.ImageManager.loadCharacter(this._characterName);
    this._isBigCharacter = _managers.ImageManager.isBigCharacter(this._characterName);
};

Sprite_Character.prototype.updateFrame = function () {
    if (this._tileId > 0) {
        this.updateTileFrame();
    } else {
        this.updateCharacterFrame();
    }
};

Sprite_Character.prototype.updateTileFrame = function () {
    var pw = this.patternWidth();
    var ph = this.patternHeight();
    var sx = (Math.floor(this._tileId / 128) % 2 * 8 + this._tileId % 8) * pw;
    var sy = Math.floor(this._tileId % 256 / 8) % 16 * ph;
    this.setFrame(sx, sy, pw, ph);
};

Sprite_Character.prototype.updateCharacterFrame = function () {
    var pw = this.patternWidth();
    var ph = this.patternHeight();
    var sx = (this.characterBlockX() + this.characterPatternX()) * pw;
    var sy = (this.characterBlockY() + this.characterPatternY()) * ph;
    this.updateHalfBodySprites();
    if (this._bushDepth > 0) {
        var d = this._bushDepth;
        this._upperBody.setFrame(sx, sy, pw, ph - d);
        this._lowerBody.setFrame(sx, sy + ph - d, pw, d);
        this.setFrame(sx, sy, 0, ph);
    } else {
        this.setFrame(sx, sy, pw, ph);
    }
};

Sprite_Character.prototype.characterBlockX = function () {
    if (this._isBigCharacter) {
        return 0;
    } else {
        var index = this._character.characterIndex();
        return index % 4 * 3;
    }
};

Sprite_Character.prototype.characterBlockY = function () {
    if (this._isBigCharacter) {
        return 0;
    } else {
        var index = this._character.characterIndex();
        return Math.floor(index / 4) * 4;
    }
};

Sprite_Character.prototype.characterPatternX = function () {
    return this._character.pattern();
};

Sprite_Character.prototype.characterPatternY = function () {
    return (this._character.direction() - 2) / 2;
};

Sprite_Character.prototype.patternWidth = function () {
    if (this._tileId > 0) {
        return $gameMap.tileWidth();
    } else if (this._isBigCharacter) {
        return this.bitmap.width / 3;
    } else {
        return this.bitmap.width / 12;
    }
};

Sprite_Character.prototype.patternHeight = function () {
    if (this._tileId > 0) {
        return $gameMap.tileHeight();
    } else if (this._isBigCharacter) {
        return this.bitmap.height / 4;
    } else {
        return this.bitmap.height / 8;
    }
};

Sprite_Character.prototype.updateHalfBodySprites = function () {
    if (this._bushDepth > 0) {
        this.createHalfBodySprites();
        this._upperBody.bitmap = this.bitmap;
        this._upperBody.visible = true;
        this._upperBody.y = -this._bushDepth;
        this._lowerBody.bitmap = this.bitmap;
        this._lowerBody.visible = true;
        this._upperBody.setBlendColor(this.getBlendColor());
        this._lowerBody.setBlendColor(this.getBlendColor());
        this._upperBody.setColorTone(this.getColorTone());
        this._lowerBody.setColorTone(this.getColorTone());
    } else if (this._upperBody) {
        this._upperBody.visible = false;
        this._lowerBody.visible = false;
    }
};

Sprite_Character.prototype.createHalfBodySprites = function () {
    if (!this._upperBody) {
        this._upperBody = new _core.Sprite();
        this._upperBody.anchor.x = 0.5;
        this._upperBody.anchor.y = 1;
        this.addChild(this._upperBody);
    }
    if (!this._lowerBody) {
        this._lowerBody = new _core.Sprite();
        this._lowerBody.anchor.x = 0.5;
        this._lowerBody.anchor.y = 1;
        this._lowerBody.opacity = 128;
        this.addChild(this._lowerBody);
    }
};

Sprite_Character.prototype.updatePosition = function () {
    this.x = this._character.screenX();
    this.y = this._character.screenY();
    this.z = this._character.screenZ();
};

Sprite_Character.prototype.updateAnimation = function () {
    this.setupAnimation();
    if (!this.isAnimationPlaying()) {
        this._character.endAnimation();
    }
    if (!this.isBalloonPlaying()) {
        this._character.endBalloon();
    }
};

Sprite_Character.prototype.updateOther = function () {
    this.opacity = this._character.opacity();
    this.blendMode = this._character.blendMode();
    this._bushDepth = this._character.bushDepth();
};

Sprite_Character.prototype.setupAnimation = function () {
    if (this._character.animationId() > 0) {
        var animation = $dataAnimations[this._character.animationId()];
        this.startAnimation(animation, false, 0);
        this._character.startAnimation();
    }
};

Sprite_Character.prototype.setupBalloon = function () {
    if (this._character.balloonId() > 0) {
        this.startBalloon();
        this._character.startBalloon();
    }
};

Sprite_Character.prototype.startBalloon = function () {
    if (!this._balloonSprite) {
        this._balloonSprite = new Sprite_Balloon();
    }
    this._balloonSprite.setup(this._character.balloonId());
    this.parent.addChild(this._balloonSprite);
};

Sprite_Character.prototype.updateBalloon = function () {
    this.setupBalloon();
    if (this._balloonSprite) {
        this._balloonSprite.x = this.x;
        this._balloonSprite.y = this.y - this.height;
        if (!this._balloonSprite.isPlaying()) {
            this.endBalloon();
        }
    }
};

Sprite_Character.prototype.endBalloon = function () {
    if (this._balloonSprite) {
        this.parent.removeChild(this._balloonSprite);
        this._balloonSprite = null;
    }
};

Sprite_Character.prototype.isBalloonPlaying = function () {
    return !!this._balloonSprite;
};

//-----------------------------------------------------------------------------
// Sprite_Battler
//
// The superclass of Sprite_Actor and Sprite_Enemy.

function Sprite_Battler() {
    this.initialize.apply(this, arguments);
}

Sprite_Battler.prototype = Object.create(Sprite_Base.prototype);
Sprite_Battler.prototype.constructor = Sprite_Battler;

Sprite_Battler.prototype.initialize = function (battler) {
    Sprite_Base.prototype.initialize.call(this);
    this.initMembers();
    this.setBattler(battler);
};

Sprite_Battler.prototype.initMembers = function () {
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this._battler = null;
    this._damages = [];
    this._homeX = 0;
    this._homeY = 0;
    this._offsetX = 0;
    this._offsetY = 0;
    this._targetOffsetX = NaN;
    this._targetOffsetY = NaN;
    this._movementDuration = 0;
    this._selectionEffectCount = 0;
};

Sprite_Battler.prototype.setBattler = function (battler) {
    this._battler = battler;
};

Sprite_Battler.prototype.setHome = function (x, y) {
    this._homeX = x;
    this._homeY = y;
    this.updatePosition();
};

Sprite_Battler.prototype.update = function () {
    Sprite_Base.prototype.update.call(this);
    if (this._battler) {
        this.updateMain();
        this.updateAnimation();
        this.updateDamagePopup();
        this.updateSelectionEffect();
    } else {
        this.bitmap = null;
    }
};

Sprite_Battler.prototype.updateVisibility = function () {
    Sprite_Base.prototype.updateVisibility.call(this);
    if (!this._battler || !this._battler.isSpriteVisible()) {
        this.visible = false;
    }
};

Sprite_Battler.prototype.updateMain = function () {
    if (this._battler.isSpriteVisible()) {
        this.updateBitmap();
        this.updateFrame();
    }
    this.updateMove();
    this.updatePosition();
};

Sprite_Battler.prototype.updateBitmap = function () {};

Sprite_Battler.prototype.updateFrame = function () {};

Sprite_Battler.prototype.updateMove = function () {
    if (this._movementDuration > 0) {
        var d = this._movementDuration;
        this._offsetX = (this._offsetX * (d - 1) + this._targetOffsetX) / d;
        this._offsetY = (this._offsetY * (d - 1) + this._targetOffsetY) / d;
        this._movementDuration--;
        if (this._movementDuration === 0) {
            this.onMoveEnd();
        }
    }
};

Sprite_Battler.prototype.updatePosition = function () {
    this.x = this._homeX + this._offsetX;
    this.y = this._homeY + this._offsetY;
};

Sprite_Battler.prototype.updateAnimation = function () {
    this.setupAnimation();
};

Sprite_Battler.prototype.updateDamagePopup = function () {
    this.setupDamagePopup();
    if (this._damages.length > 0) {
        for (var i = 0; i < this._damages.length; i++) {
            this._damages[i].update();
        }
        if (!this._damages[0].isPlaying()) {
            this.parent.removeChild(this._damages[0]);
            this._damages.shift();
        }
    }
};

Sprite_Battler.prototype.updateSelectionEffect = function () {
    var target = this._effectTarget;
    if (this._battler.isSelected()) {
        this._selectionEffectCount++;
        if (this._selectionEffectCount % 30 < 15) {
            target.setBlendColor([255, 255, 255, 64]);
        } else {
            target.setBlendColor([0, 0, 0, 0]);
        }
    } else if (this._selectionEffectCount > 0) {
        this._selectionEffectCount = 0;
        target.setBlendColor([0, 0, 0, 0]);
    }
};

Sprite_Battler.prototype.setupAnimation = function () {
    while (this._battler.isAnimationRequested()) {
        var data = this._battler.shiftAnimation();
        var animation = $dataAnimations[data.animationId];
        var mirror = data.mirror;
        var delay = animation.position === 3 ? 0 : data.delay;
        this.startAnimation(animation, mirror, delay);
        for (var i = 0; i < this._animationSprites.length; i++) {
            var sprite = this._animationSprites[i];
            sprite.visible = this._battler.isSpriteVisible();
        }
    }
};

Sprite_Battler.prototype.setupDamagePopup = function () {
    if (this._battler.isDamagePopupRequested()) {
        if (this._battler.isSpriteVisible()) {
            var sprite = new Sprite_Damage();
            sprite.x = this.x + this.damageOffsetX();
            sprite.y = this.y + this.damageOffsetY();
            sprite.setup(this._battler);
            this._damages.push(sprite);
            this.parent.addChild(sprite);
        }
        this._battler.clearDamagePopup();
        this._battler.clearResult();
    }
};

Sprite_Battler.prototype.damageOffsetX = function () {
    return 0;
};

Sprite_Battler.prototype.damageOffsetY = function () {
    return 0;
};

Sprite_Battler.prototype.startMove = function (x, y, duration) {
    if (this._targetOffsetX !== x || this._targetOffsetY !== y) {
        this._targetOffsetX = x;
        this._targetOffsetY = y;
        this._movementDuration = duration;
        if (duration === 0) {
            this._offsetX = x;
            this._offsetY = y;
        }
    }
};

Sprite_Battler.prototype.onMoveEnd = function () {};

Sprite_Battler.prototype.isEffecting = function () {
    return false;
};

Sprite_Battler.prototype.isMoving = function () {
    return this._movementDuration > 0;
};

Sprite_Battler.prototype.inHomePosition = function () {
    return this._offsetX === 0 && this._offsetY === 0;
};

//-----------------------------------------------------------------------------
// Sprite_Actor
//
// The sprite for displaying an actor.

function Sprite_Actor() {
    this.initialize.apply(this, arguments);
}

Sprite_Actor.prototype = Object.create(Sprite_Battler.prototype);
Sprite_Actor.prototype.constructor = Sprite_Actor;

Sprite_Actor.MOTIONS = {
    walk: { index: 0, loop: true },
    wait: { index: 1, loop: true },
    chant: { index: 2, loop: true },
    guard: { index: 3, loop: true },
    damage: { index: 4, loop: false },
    evade: { index: 5, loop: false },
    thrust: { index: 6, loop: false },
    swing: { index: 7, loop: false },
    missile: { index: 8, loop: false },
    skill: { index: 9, loop: false },
    spell: { index: 10, loop: false },
    item: { index: 11, loop: false },
    escape: { index: 12, loop: true },
    victory: { index: 13, loop: true },
    dying: { index: 14, loop: true },
    abnormal: { index: 15, loop: true },
    sleep: { index: 16, loop: true },
    dead: { index: 17, loop: true }
};

Sprite_Actor.prototype.initialize = function (battler) {
    Sprite_Battler.prototype.initialize.call(this, battler);
    this.moveToStartPosition();
};

Sprite_Actor.prototype.initMembers = function () {
    Sprite_Battler.prototype.initMembers.call(this);
    this._battlerName = '';
    this._motion = null;
    this._motionCount = 0;
    this._pattern = 0;
    this.createShadowSprite();
    this.createWeaponSprite();
    this.createMainSprite();
    this.createStateSprite();
};

Sprite_Actor.prototype.createMainSprite = function () {
    this._mainSprite = new Sprite_Base();
    this._mainSprite.anchor.x = 0.5;
    this._mainSprite.anchor.y = 1;
    this.addChild(this._mainSprite);
    this._effectTarget = this._mainSprite;
};

Sprite_Actor.prototype.createShadowSprite = function () {
    this._shadowSprite = new _core.Sprite();
    this._shadowSprite.bitmap = _managers.ImageManager.loadSystem('Shadow2');
    this._shadowSprite.anchor.x = 0.5;
    this._shadowSprite.anchor.y = 0.5;
    this._shadowSprite.y = -2;
    this.addChild(this._shadowSprite);
};

Sprite_Actor.prototype.createWeaponSprite = function () {
    this._weaponSprite = new Sprite_Weapon();
    this.addChild(this._weaponSprite);
};

Sprite_Actor.prototype.createStateSprite = function () {
    this._stateSprite = new Sprite_StateOverlay();
    this.addChild(this._stateSprite);
};

Sprite_Actor.prototype.setBattler = function (battler) {
    Sprite_Battler.prototype.setBattler.call(this, battler);
    var changed = battler !== this._actor;
    if (changed) {
        this._actor = battler;
        if (battler) {
            this.setActorHome(battler.index());
        }
        this.startEntryMotion();
        this._stateSprite.setup(battler);
    }
};

Sprite_Actor.prototype.moveToStartPosition = function () {
    this.startMove(300, 0, 0);
};

Sprite_Actor.prototype.setActorHome = function (index) {
    this.setHome(600 + index * 32, 280 + index * 48);
};

Sprite_Actor.prototype.update = function () {
    Sprite_Battler.prototype.update.call(this);
    this.updateShadow();
    if (this._actor) {
        this.updateMotion();
    }
};

Sprite_Actor.prototype.updateShadow = function () {
    this._shadowSprite.visible = !!this._actor;
};

Sprite_Actor.prototype.updateMain = function () {
    Sprite_Battler.prototype.updateMain.call(this);
    if (this._actor.isSpriteVisible() && !this.isMoving()) {
        this.updateTargetPosition();
    }
};

Sprite_Actor.prototype.setupMotion = function () {
    if (this._actor.isMotionRequested()) {
        this.startMotion(this._actor.motionType());
        this._actor.clearMotion();
    }
};

Sprite_Actor.prototype.setupWeaponAnimation = function () {
    if (this._actor.isWeaponAnimationRequested()) {
        this._weaponSprite.setup(this._actor.weaponImageId());
        this._actor.clearWeaponAnimation();
    }
};

Sprite_Actor.prototype.startMotion = function (motionType) {
    var newMotion = Sprite_Actor.MOTIONS[motionType];
    if (this._motion !== newMotion) {
        this._motion = newMotion;
        this._motionCount = 0;
        this._pattern = 0;
    }
};

Sprite_Actor.prototype.updateTargetPosition = function () {
    if (this._actor.isInputting() || this._actor.isActing()) {
        this.stepForward();
    } else if (this._actor.canMove() && BattleManager.isEscaped()) {
        this.retreat();
    } else if (!this.inHomePosition()) {
        this.stepBack();
    }
};

Sprite_Actor.prototype.updateBitmap = function () {
    Sprite_Battler.prototype.updateBitmap.call(this);
    var name = this._actor.battlerName();
    if (this._battlerName !== name) {
        this._battlerName = name;
        this._mainSprite.bitmap = _managers.ImageManager.loadSvActor(name);
    }
};

Sprite_Actor.prototype.updateFrame = function () {
    Sprite_Battler.prototype.updateFrame.call(this);
    var bitmap = this._mainSprite.bitmap;
    if (bitmap) {
        var motionIndex = this._motion ? this._motion.index : 0;
        var pattern = this._pattern < 3 ? this._pattern : 1;
        var cw = bitmap.width / 9;
        var ch = bitmap.height / 6;
        var cx = Math.floor(motionIndex / 6) * 3 + pattern;
        var cy = motionIndex % 6;
        this._mainSprite.setFrame(cx * cw, cy * ch, cw, ch);
    }
};

Sprite_Actor.prototype.updateMove = function () {
    var bitmap = this._mainSprite.bitmap;
    if (!bitmap || bitmap.isReady()) {
        Sprite_Battler.prototype.updateMove.call(this);
    }
};

Sprite_Actor.prototype.updateMotion = function () {
    this.setupMotion();
    this.setupWeaponAnimation();
    if (this._actor.isMotionRefreshRequested()) {
        this.refreshMotion();
        this._actor.clearMotion();
    }
    this.updateMotionCount();
};

Sprite_Actor.prototype.updateMotionCount = function () {
    if (this._motion && ++this._motionCount >= this.motionSpeed()) {
        if (this._motion.loop) {
            this._pattern = (this._pattern + 1) % 4;
        } else if (this._pattern < 2) {
            this._pattern++;
        } else {
            this.refreshMotion();
        }
        this._motionCount = 0;
    }
};

Sprite_Actor.prototype.motionSpeed = function () {
    return 12;
};

Sprite_Actor.prototype.refreshMotion = function () {
    var actor = this._actor;
    if (actor) {
        var stateMotion = actor.stateMotionIndex();
        if (actor.isInputting() || actor.isActing()) {
            this.startMotion('walk');
        } else if (stateMotion === 3) {
            this.startMotion('dead');
        } else if (stateMotion === 2) {
            this.startMotion('sleep');
        } else if (actor.isChanting()) {
            this.startMotion('chant');
        } else if (actor.isGuard() || actor.isGuardWaiting()) {
            this.startMotion('guard');
        } else if (stateMotion === 1) {
            this.startMotion('abnormal');
        } else if (actor.isDying()) {
            this.startMotion('dying');
        } else if (actor.isUndecided()) {
            this.startMotion('walk');
        } else {
            this.startMotion('wait');
        }
    }
};

Sprite_Actor.prototype.startEntryMotion = function () {
    if (this._actor && this._actor.canMove()) {
        this.startMotion('walk');
        this.startMove(0, 0, 30);
    } else if (!this.isMoving()) {
        this.refreshMotion();
        this.startMove(0, 0, 0);
    }
};

Sprite_Actor.prototype.stepForward = function () {
    this.startMove(-48, 0, 12);
};

Sprite_Actor.prototype.stepBack = function () {
    this.startMove(0, 0, 12);
};

Sprite_Actor.prototype.retreat = function () {
    this.startMove(300, 0, 30);
};

Sprite_Actor.prototype.onMoveEnd = function () {
    Sprite_Battler.prototype.onMoveEnd.call(this);
    if (!BattleManager.isBattleEnd()) {
        this.refreshMotion();
    }
};

Sprite_Actor.prototype.damageOffsetX = function () {
    return -32;
};

Sprite_Actor.prototype.damageOffsetY = function () {
    return 0;
};

//-----------------------------------------------------------------------------
// Sprite_Enemy
//
// The sprite for displaying an enemy.

function Sprite_Enemy() {
    this.initialize.apply(this, arguments);
}

Sprite_Enemy.prototype = Object.create(Sprite_Battler.prototype);
Sprite_Enemy.prototype.constructor = Sprite_Enemy;

Sprite_Enemy.prototype.initialize = function (battler) {
    Sprite_Battler.prototype.initialize.call(this, battler);
};

Sprite_Enemy.prototype.initMembers = function () {
    Sprite_Battler.prototype.initMembers.call(this);
    this._enemy = null;
    this._appeared = false;
    this._battlerName = '';
    this._battlerHue = 0;
    this._effectType = null;
    this._effectDuration = 0;
    this._shake = 0;
    this.createStateIconSprite();
};

Sprite_Enemy.prototype.createStateIconSprite = function () {
    this._stateIconSprite = new Sprite_StateIcon();
    this.addChild(this._stateIconSprite);
};

Sprite_Enemy.prototype.setBattler = function (battler) {
    Sprite_Battler.prototype.setBattler.call(this, battler);
    this._enemy = battler;
    this.setHome(battler.screenX(), battler.screenY());
    this._stateIconSprite.setup(battler);
};

Sprite_Enemy.prototype.update = function () {
    Sprite_Battler.prototype.update.call(this);
    if (this._enemy) {
        this.updateEffect();
        this.updateStateSprite();
    }
};

Sprite_Enemy.prototype.updateBitmap = function () {
    Sprite_Battler.prototype.updateBitmap.call(this);
    var name = this._enemy.battlerName();
    var hue = this._enemy.battlerHue();
    if (this._battlerName !== name || this._battlerHue !== hue) {
        this._battlerName = name;
        this._battlerHue = hue;
        this.loadBitmap(name, hue);
        this.initVisibility();
    }
};

Sprite_Enemy.prototype.loadBitmap = function (name, hue) {
    if ($gameSystem.isSideView()) {
        this.bitmap = _managers.ImageManager.loadSvEnemy(name, hue);
    } else {
        this.bitmap = _managers.ImageManager.loadEnemy(name, hue);
    }
};

Sprite_Enemy.prototype.updateFrame = function () {
    Sprite_Battler.prototype.updateFrame.call(this);
    var frameHeight = this.bitmap.height;
    if (this._effectType === 'bossCollapse') {
        frameHeight = this._effectDuration;
    }
    this.setFrame(0, 0, this.bitmap.width, frameHeight);
};

Sprite_Enemy.prototype.updatePosition = function () {
    Sprite_Battler.prototype.updatePosition.call(this);
    this.x += this._shake;
};

Sprite_Enemy.prototype.updateStateSprite = function () {
    this._stateIconSprite.y = -Math.round((this.bitmap.height + 40) * 0.9);
    if (this._stateIconSprite.y < 20 - this.y) {
        this._stateIconSprite.y = 20 - this.y;
    }
};

Sprite_Enemy.prototype.initVisibility = function () {
    this._appeared = this._enemy.isAlive();
    if (!this._appeared) {
        this.opacity = 0;
    }
};

Sprite_Enemy.prototype.setupEffect = function () {
    if (this._appeared && this._enemy.isEffectRequested()) {
        this.startEffect(this._enemy.effectType());
        this._enemy.clearEffect();
    }
    if (!this._appeared && this._enemy.isAlive()) {
        this.startEffect('appear');
    } else if (this._appeared && this._enemy.isHidden()) {
        this.startEffect('disappear');
    }
};

Sprite_Enemy.prototype.startEffect = function (effectType) {
    this._effectType = effectType;
    switch (this._effectType) {
        case 'appear':
            this.startAppear();
            break;
        case 'disappear':
            this.startDisappear();
            break;
        case 'whiten':
            this.startWhiten();
            break;
        case 'blink':
            this.startBlink();
            break;
        case 'collapse':
            this.startCollapse();
            break;
        case 'bossCollapse':
            this.startBossCollapse();
            break;
        case 'instantCollapse':
            this.startInstantCollapse();
            break;
    }
    this.revertToNormal();
};

Sprite_Enemy.prototype.startAppear = function () {
    this._effectDuration = 16;
    this._appeared = true;
};

Sprite_Enemy.prototype.startDisappear = function () {
    this._effectDuration = 32;
    this._appeared = false;
};

Sprite_Enemy.prototype.startWhiten = function () {
    this._effectDuration = 16;
};

Sprite_Enemy.prototype.startBlink = function () {
    this._effectDuration = 20;
};

Sprite_Enemy.prototype.startCollapse = function () {
    this._effectDuration = 32;
    this._appeared = false;
};

Sprite_Enemy.prototype.startBossCollapse = function () {
    this._effectDuration = this.bitmap.height;
    this._appeared = false;
};

Sprite_Enemy.prototype.startInstantCollapse = function () {
    this._effectDuration = 16;
    this._appeared = false;
};

Sprite_Enemy.prototype.updateEffect = function () {
    this.setupEffect();
    if (this._effectDuration > 0) {
        this._effectDuration--;
        switch (this._effectType) {
            case 'whiten':
                this.updateWhiten();
                break;
            case 'blink':
                this.updateBlink();
                break;
            case 'appear':
                this.updateAppear();
                break;
            case 'disappear':
                this.updateDisappear();
                break;
            case 'collapse':
                this.updateCollapse();
                break;
            case 'bossCollapse':
                this.updateBossCollapse();
                break;
            case 'instantCollapse':
                this.updateInstantCollapse();
                break;
        }
        if (this._effectDuration === 0) {
            this._effectType = null;
        }
    }
};

Sprite_Enemy.prototype.isEffecting = function () {
    return this._effectType !== null;
};

Sprite_Enemy.prototype.revertToNormal = function () {
    this._shake = 0;
    this.blendMode = 0;
    this.opacity = 255;
    this.setBlendColor([0, 0, 0, 0]);
};

Sprite_Enemy.prototype.updateWhiten = function () {
    var alpha = 128 - (16 - this._effectDuration) * 10;
    this.setBlendColor([255, 255, 255, alpha]);
};

Sprite_Enemy.prototype.updateBlink = function () {
    this.opacity = this._effectDuration % 10 < 5 ? 255 : 0;
};

Sprite_Enemy.prototype.updateAppear = function () {
    this.opacity = (16 - this._effectDuration) * 16;
};

Sprite_Enemy.prototype.updateDisappear = function () {
    this.opacity = 256 - (32 - this._effectDuration) * 10;
};

Sprite_Enemy.prototype.updateCollapse = function () {
    this.blendMode = _core.Graphics.BLEND_ADD;
    this.setBlendColor([255, 128, 128, 128]);
    this.opacity *= this._effectDuration / (this._effectDuration + 1);
};

Sprite_Enemy.prototype.updateBossCollapse = function () {
    this._shake = this._effectDuration % 2 * 4 - 2;
    this.blendMode = _core.Graphics.BLEND_ADD;
    this.opacity *= this._effectDuration / (this._effectDuration + 1);
    this.setBlendColor([255, 255, 255, 255 - this.opacity]);
    if (this._effectDuration % 20 === 19) {
        SoundManager.playBossCollapse2();
    }
};

Sprite_Enemy.prototype.updateInstantCollapse = function () {
    this.opacity = 0;
};

Sprite_Enemy.prototype.damageOffsetX = function () {
    return 0;
};

Sprite_Enemy.prototype.damageOffsetY = function () {
    return -8;
};

//-----------------------------------------------------------------------------
// Sprite_Animation
//
// The sprite for displaying an animation.

function Sprite_Animation() {
    this.initialize.apply(this, arguments);
}

Sprite_Animation.prototype = Object.create(_core.Sprite.prototype);
Sprite_Animation.prototype.constructor = Sprite_Animation;

Sprite_Animation._checker1 = {};
Sprite_Animation._checker2 = {};

Sprite_Animation.prototype.initialize = function () {
    _core.Sprite.prototype.initialize.call(this);
    this.initMembers();
};

Sprite_Animation.prototype.initMembers = function () {
    this._target = null;
    this._animation = null;
    this._mirror = false;
    this._delay = 0;
    this._rate = 4;
    this._duration = 0;
    this._flashColor = [0, 0, 0, 0];
    this._flashDuration = 0;
    this._screenFlashDuration = 0;
    this._hidingDuration = 0;
    this._bitmap1 = null;
    this._bitmap2 = null;
    this._cellSprites = [];
    this._screenFlashSprite = null;
    this._duplicated = false;
    this.z = 8;
};

Sprite_Animation.prototype.setup = function (target, animation, mirror, delay) {
    this._target = target;
    this._animation = animation;
    this._mirror = mirror;
    this._delay = delay;
    if (this._animation) {
        this.remove();
        this.setupRate();
        this.setupDuration();
        this.loadBitmaps();
        this.createSprites();
    }
};

Sprite_Animation.prototype.remove = function () {
    if (this.parent && this.parent.removeChild(this)) {
        this._target.setBlendColor([0, 0, 0, 0]);
        this._target.show();
    }
};

Sprite_Animation.prototype.setupRate = function () {
    this._rate = 4;
};

Sprite_Animation.prototype.setupDuration = function () {
    this._duration = this._animation.frames.length * this._rate + 1;
};

Sprite_Animation.prototype.update = function () {
    _core.Sprite.prototype.update.call(this);
    this.updateMain();
    this.updateFlash();
    this.updateScreenFlash();
    this.updateHiding();
    Sprite_Animation._checker1 = {};
    Sprite_Animation._checker2 = {};
};

Sprite_Animation.prototype.updateFlash = function () {
    if (this._flashDuration > 0) {
        var d = this._flashDuration--;
        this._flashColor[3] *= (d - 1) / d;
        this._target.setBlendColor(this._flashColor);
    }
};

Sprite_Animation.prototype.updateScreenFlash = function () {
    if (this._screenFlashDuration > 0) {
        var d = this._screenFlashDuration--;
        if (this._screenFlashSprite) {
            this._screenFlashSprite.x = -this.absoluteX();
            this._screenFlashSprite.y = -this.absoluteY();
            this._screenFlashSprite.opacity *= (d - 1) / d;
            this._screenFlashSprite.visible = this._screenFlashDuration > 0;
        }
    }
};

Sprite_Animation.prototype.absoluteX = function () {
    var x = 0;
    var object = this;
    while (object) {
        x += object.x;
        object = object.parent;
    }
    return x;
};

Sprite_Animation.prototype.absoluteY = function () {
    var y = 0;
    var object = this;
    while (object) {
        y += object.y;
        object = object.parent;
    }
    return y;
};

Sprite_Animation.prototype.updateHiding = function () {
    if (this._hidingDuration > 0) {
        this._hidingDuration--;
        if (this._hidingDuration === 0) {
            this._target.show();
        }
    }
};

Sprite_Animation.prototype.isPlaying = function () {
    return this._duration > 0;
};

Sprite_Animation.prototype.loadBitmaps = function () {
    var name1 = this._animation.animation1Name;
    var name2 = this._animation.animation2Name;
    var hue1 = this._animation.animation1Hue;
    var hue2 = this._animation.animation2Hue;
    this._bitmap1 = _managers.ImageManager.loadAnimation(name1, hue1);
    this._bitmap2 = _managers.ImageManager.loadAnimation(name2, hue2);
};

Sprite_Animation.prototype.isReady = function () {
    return _managers.ImageManager.isReady();
};

Sprite_Animation.prototype.createSprites = function () {
    if (!Sprite_Animation._checker2[this._animation]) {
        this.createCellSprites();
        if (this._animation.position === 3) {
            Sprite_Animation._checker2[this._animation] = true;
        }
        this.createScreenFlashSprite();
    }
    if (Sprite_Animation._checker1[this._animation]) {
        this._duplicated = true;
    } else {
        this._duplicated = false;
        if (this._animation.position === 3) {
            Sprite_Animation._checker1[this._animation] = true;
        }
    }
};

Sprite_Animation.prototype.createCellSprites = function () {
    this._cellSprites = [];
    for (var i = 0; i < 16; i++) {
        var sprite = new _core.Sprite();
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        this._cellSprites.push(sprite);
        this.addChild(sprite);
    }
};

Sprite_Animation.prototype.createScreenFlashSprite = function () {
    this._screenFlashSprite = new _core.ScreenSprite();
    this.addChild(this._screenFlashSprite);
};

Sprite_Animation.prototype.updateMain = function () {
    if (this.isPlaying() && this.isReady()) {
        if (this._delay > 0) {
            this._delay--;
        } else {
            this._duration--;
            this.updatePosition();
            if (this._duration % this._rate === 0) {
                this.updateFrame();
            }
        }
    }
};

Sprite_Animation.prototype.updatePosition = function () {
    if (this._animation.position === 3) {
        this.x = this.parent.width / 2;
        this.y = this.parent.height / 2;
    } else {
        var parent = this._target.parent;
        var grandparent = parent ? parent.parent : null;
        this.x = this._target.x;
        this.y = this._target.y;
        if (this.parent === grandparent) {
            this.x += parent.x;
            this.y += parent.y;
        }
        if (this._animation.position === 0) {
            this.y -= this._target.height;
        } else if (this._animation.position === 1) {
            this.y -= this._target.height / 2;
        }
    }
};

Sprite_Animation.prototype.updateFrame = function () {
    if (this._duration > 0) {
        var frameIndex = this.currentFrameIndex();
        this.updateAllCellSprites(this._animation.frames[frameIndex]);
        this._animation.timings.forEach(function (timing) {
            if (timing.frame === frameIndex) {
                this.processTimingData(timing);
            }
        }, this);
    }
};

Sprite_Animation.prototype.currentFrameIndex = function () {
    return this._animation.frames.length - Math.floor((this._duration + this._rate - 1) / this._rate);
};

Sprite_Animation.prototype.updateAllCellSprites = function (frame) {
    for (var i = 0; i < this._cellSprites.length; i++) {
        var sprite = this._cellSprites[i];
        if (i < frame.length) {
            this.updateCellSprite(sprite, frame[i]);
        } else {
            sprite.visible = false;
        }
    }
};

Sprite_Animation.prototype.updateCellSprite = function (sprite, cell) {
    var pattern = cell[0];
    if (pattern >= 0) {
        var sx = pattern % 5 * 192;
        var sy = Math.floor(pattern % 100 / 5) * 192;
        var mirror = this._mirror;
        sprite.bitmap = pattern < 100 ? this._bitmap1 : this._bitmap2;
        sprite.setFrame(sx, sy, 192, 192);
        sprite.x = cell[1];
        sprite.y = cell[2];
        if (this._mirror) {
            sprite.x *= -1;
        }
        sprite.rotation = cell[4] * Math.PI / 180;
        sprite.scale.x = cell[3] / 100;
        if (cell[5] && !mirror || !cell[5] && mirror) {
            sprite.scale.x *= -1;
        }
        sprite.scale.y = cell[3] / 100;
        sprite.opacity = cell[6];
        sprite.blendMode = cell[7];
        sprite.visible = this._target.visible;
    } else {
        sprite.visible = false;
    }
};

Sprite_Animation.prototype.processTimingData = function (timing) {
    var duration = timing.flashDuration * this._rate;
    switch (timing.flashScope) {
        case 1:
            this.startFlash(timing.flashColor, duration);
            break;
        case 2:
            this.startScreenFlash(timing.flashColor, duration);
            break;
        case 3:
            this.startHiding(duration);
            break;
    }
    if (!this._duplicated && timing.se) {
        AudioManager.playSe(timing.se);
    }
};

Sprite_Animation.prototype.startFlash = function (color, duration) {
    this._flashColor = color.clone();
    this._flashDuration = duration;
};

Sprite_Animation.prototype.startScreenFlash = function (color, duration) {
    this._screenFlashDuration = duration;
    if (this._screenFlashSprite) {
        this._screenFlashSprite.setColor(color[0], color[1], color[2]);
        this._screenFlashSprite.opacity = color[3];
    }
};

Sprite_Animation.prototype.startHiding = function (duration) {
    this._hidingDuration = duration;
    this._target.hide();
};

//-----------------------------------------------------------------------------
// Sprite_Damage
//
// The sprite for displaying a popup damage.

function Sprite_Damage() {
    this.initialize.apply(this, arguments);
}

Sprite_Damage.prototype = Object.create(_core.Sprite.prototype);
Sprite_Damage.prototype.constructor = Sprite_Damage;

Sprite_Damage.prototype.initialize = function () {
    _core.Sprite.prototype.initialize.call(this);
    this._duration = 90;
    this._flashColor = [0, 0, 0, 0];
    this._flashDuration = 0;
    this._damageBitmap = _managers.ImageManager.loadSystem('Damage');
};

Sprite_Damage.prototype.setup = function (target) {
    var result = target.result();
    if (result.missed || result.evaded) {
        this.createMiss();
    } else if (result.hpAffected) {
        this.createDigits(0, result.hpDamage);
    } else if (target.isAlive() && result.mpDamage !== 0) {
        this.createDigits(2, result.mpDamage);
    }
    if (result.critical) {
        this.setupCriticalEffect();
    }
};

Sprite_Damage.prototype.setupCriticalEffect = function () {
    this._flashColor = [255, 0, 0, 160];
    this._flashDuration = 60;
};

Sprite_Damage.prototype.digitWidth = function () {
    return this._damageBitmap ? this._damageBitmap.width / 10 : 0;
};

Sprite_Damage.prototype.digitHeight = function () {
    return this._damageBitmap ? this._damageBitmap.height / 5 : 0;
};

Sprite_Damage.prototype.createMiss = function () {
    var w = this.digitWidth();
    var h = this.digitHeight();
    var sprite = this.createChildSprite();
    sprite.setFrame(0, 4 * h, 4 * w, h);
    sprite.dy = 0;
};

Sprite_Damage.prototype.createDigits = function (baseRow, value) {
    var string = Math.abs(value).toString();
    var row = baseRow + (value < 0 ? 1 : 0);
    var w = this.digitWidth();
    var h = this.digitHeight();
    for (var i = 0; i < string.length; i++) {
        var sprite = this.createChildSprite();
        var n = Number(string[i]);
        sprite.setFrame(n * w, row * h, w, h);
        sprite.x = (i - (string.length - 1) / 2) * w;
        sprite.dy = -i;
    }
};

Sprite_Damage.prototype.createChildSprite = function () {
    var sprite = new _core.Sprite();
    sprite.bitmap = this._damageBitmap;
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 1;
    sprite.y = -40;
    sprite.ry = sprite.y;
    this.addChild(sprite);
    return sprite;
};

Sprite_Damage.prototype.update = function () {
    _core.Sprite.prototype.update.call(this);
    if (this._duration > 0) {
        this._duration--;
        for (var i = 0; i < this.children.length; i++) {
            this.updateChild(this.children[i]);
        }
    }
    this.updateFlash();
    this.updateOpacity();
};

Sprite_Damage.prototype.updateChild = function (sprite) {
    sprite.dy += 0.5;
    sprite.ry += sprite.dy;
    if (sprite.ry >= 0) {
        sprite.ry = 0;
        sprite.dy *= -0.6;
    }
    sprite.y = Math.round(sprite.ry);
    sprite.setBlendColor(this._flashColor);
};

Sprite_Damage.prototype.updateFlash = function () {
    if (this._flashDuration > 0) {
        var d = this._flashDuration--;
        this._flashColor[3] *= (d - 1) / d;
    }
};

Sprite_Damage.prototype.updateOpacity = function () {
    if (this._duration < 10) {
        this.opacity = 255 * this._duration / 10;
    }
};

Sprite_Damage.prototype.isPlaying = function () {
    return this._duration > 0;
};

//-----------------------------------------------------------------------------
// Sprite_StateIcon
//
// The sprite for displaying state icons.

function Sprite_StateIcon() {
    this.initialize.apply(this, arguments);
}

Sprite_StateIcon.prototype = Object.create(_core.Sprite.prototype);
Sprite_StateIcon.prototype.constructor = Sprite_StateIcon;

Sprite_StateIcon.prototype.initialize = function () {
    _core.Sprite.prototype.initialize.call(this);
    this.initMembers();
    this.loadBitmap();
};

Sprite_StateIcon._iconWidth = 32;
Sprite_StateIcon._iconHeight = 32;

Sprite_StateIcon.prototype.initMembers = function () {
    this._battler = null;
    this._iconIndex = 0;
    this._animationCount = 0;
    this._animationIndex = 0;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
};

Sprite_StateIcon.prototype.loadBitmap = function () {
    this.bitmap = _managers.ImageManager.loadSystem('IconSet');
    this.setFrame(0, 0, 0, 0);
};

Sprite_StateIcon.prototype.setup = function (battler) {
    this._battler = battler;
};

Sprite_StateIcon.prototype.update = function () {
    _core.Sprite.prototype.update.call(this);
    this._animationCount++;
    if (this._animationCount >= this.animationWait()) {
        this.updateIcon();
        this.updateFrame();
        this._animationCount = 0;
    }
};

Sprite_StateIcon.prototype.animationWait = function () {
    return 40;
};

Sprite_StateIcon.prototype.updateIcon = function () {
    var icons = [];
    if (this._battler && this._battler.isAlive()) {
        icons = this._battler.allIcons();
    }
    if (icons.length > 0) {
        this._animationIndex++;
        if (this._animationIndex >= icons.length) {
            this._animationIndex = 0;
        }
        this._iconIndex = icons[this._animationIndex];
    } else {
        this._animationIndex = 0;
        this._iconIndex = 0;
    }
};

Sprite_StateIcon.prototype.updateFrame = function () {
    var pw = Sprite_StateIcon._iconWidth;
    var ph = Sprite_StateIcon._iconHeight;
    var sx = this._iconIndex % 16 * pw;
    var sy = Math.floor(this._iconIndex / 16) * ph;
    this.setFrame(sx, sy, pw, ph);
};

//-----------------------------------------------------------------------------
// Sprite_StateOverlay
//
// The sprite for displaying an overlay image for a state.

function Sprite_StateOverlay() {
    this.initialize.apply(this, arguments);
}

Sprite_StateOverlay.prototype = Object.create(Sprite_Base.prototype);
Sprite_StateOverlay.prototype.constructor = Sprite_StateOverlay;

Sprite_StateOverlay.prototype.initialize = function () {
    Sprite_Base.prototype.initialize.call(this);
    this.initMembers();
    this.loadBitmap();
};

Sprite_StateOverlay.prototype.initMembers = function () {
    this._battler = null;
    this._overlayIndex = 0;
    this._animationCount = 0;
    this._pattern = 0;
    this.anchor.x = 0.5;
    this.anchor.y = 1;
};

Sprite_StateOverlay.prototype.loadBitmap = function () {
    this.bitmap = _managers.ImageManager.loadSystem('States');
    this.setFrame(0, 0, 0, 0);
};

Sprite_StateOverlay.prototype.setup = function (battler) {
    this._battler = battler;
};

Sprite_StateOverlay.prototype.update = function () {
    Sprite_Base.prototype.update.call(this);
    this._animationCount++;
    if (this._animationCount >= this.animationWait()) {
        this.updatePattern();
        this.updateFrame();
        this._animationCount = 0;
    }
};

Sprite_StateOverlay.prototype.animationWait = function () {
    return 8;
};

Sprite_StateOverlay.prototype.updatePattern = function () {
    this._pattern++;
    this._pattern %= 8;
    if (this._battler) {
        this._overlayIndex = this._battler.stateOverlayIndex();
    }
};

Sprite_StateOverlay.prototype.updateFrame = function () {
    if (this._overlayIndex > 0) {
        var w = 96;
        var h = 96;
        var sx = this._pattern * w;
        var sy = (this._overlayIndex - 1) * h;
        this.setFrame(sx, sy, w, h);
    } else {
        this.setFrame(0, 0, 0, 0);
    }
};

//-----------------------------------------------------------------------------
// Sprite_Weapon
//
// The sprite for displaying a weapon image for attacking.

function Sprite_Weapon() {
    this.initialize.apply(this, arguments);
}

Sprite_Weapon.prototype = Object.create(Sprite_Base.prototype);
Sprite_Weapon.prototype.constructor = Sprite_Weapon;

Sprite_Weapon.prototype.initialize = function () {
    Sprite_Base.prototype.initialize.call(this);
    this.initMembers();
};

Sprite_Weapon.prototype.initMembers = function () {
    this._weaponImageId = 0;
    this._animationCount = 0;
    this._pattern = 0;
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this.x = -16;
};

Sprite_Weapon.prototype.setup = function (weaponImageId) {
    this._weaponImageId = weaponImageId;
    this._animationCount = 0;
    this._pattern = 0;
    this.loadBitmap();
    this.updateFrame();
};

Sprite_Weapon.prototype.update = function () {
    Sprite_Base.prototype.update.call(this);
    this._animationCount++;
    if (this._animationCount >= this.animationWait()) {
        this.updatePattern();
        this.updateFrame();
        this._animationCount = 0;
    }
};

Sprite_Weapon.prototype.animationWait = function () {
    return 12;
};

Sprite_Weapon.prototype.updatePattern = function () {
    this._pattern++;
    if (this._pattern >= 3) {
        this._weaponImageId = 0;
    }
};

Sprite_Weapon.prototype.loadBitmap = function () {
    var pageId = Math.floor((this._weaponImageId - 1) / 12) + 1;
    if (pageId >= 1) {
        this.bitmap = _managers.ImageManager.loadSystem('Weapons' + pageId);
    } else {
        this.bitmap = _managers.ImageManager.loadSystem('');
    }
};

Sprite_Weapon.prototype.updateFrame = function () {
    if (this._weaponImageId > 0) {
        var index = (this._weaponImageId - 1) % 12;
        var w = 96;
        var h = 64;
        var sx = (Math.floor(index / 6) * 3 + this._pattern) * w;
        var sy = Math.floor(index % 6) * h;
        this.setFrame(sx, sy, w, h);
    } else {
        this.setFrame(0, 0, 0, 0);
    }
};

Sprite_Weapon.prototype.isPlaying = function () {
    return this._weaponImageId > 0;
};

//-----------------------------------------------------------------------------
// Sprite_Balloon
//
// The sprite for displaying a balloon icon.

function Sprite_Balloon() {
    this.initialize.apply(this, arguments);
}

Sprite_Balloon.prototype = Object.create(Sprite_Base.prototype);
Sprite_Balloon.prototype.constructor = Sprite_Balloon;

Sprite_Balloon.prototype.initialize = function () {
    Sprite_Base.prototype.initialize.call(this);
    this.initMembers();
    this.loadBitmap();
};

Sprite_Balloon.prototype.initMembers = function () {
    this._balloonId = 0;
    this._duration = 0;
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this.z = 7;
};

Sprite_Balloon.prototype.loadBitmap = function () {
    this.bitmap = _managers.ImageManager.loadSystem('Balloon');
    this.setFrame(0, 0, 0, 0);
};

Sprite_Balloon.prototype.setup = function (balloonId) {
    this._balloonId = balloonId;
    this._duration = 8 * this.speed() + this.waitTime();
};

Sprite_Balloon.prototype.update = function () {
    Sprite_Base.prototype.update.call(this);
    if (this._duration > 0) {
        this._duration--;
        if (this._duration > 0) {
            this.updateFrame();
        }
    }
};

Sprite_Balloon.prototype.updateFrame = function () {
    var w = 48;
    var h = 48;
    var sx = this.frameIndex() * w;
    var sy = (this._balloonId - 1) * h;
    this.setFrame(sx, sy, w, h);
};

Sprite_Balloon.prototype.speed = function () {
    return 8;
};

Sprite_Balloon.prototype.waitTime = function () {
    return 12;
};

Sprite_Balloon.prototype.frameIndex = function () {
    var index = (this._duration - this.waitTime()) / this.speed();
    return 7 - Math.max(Math.floor(index), 0);
};

Sprite_Balloon.prototype.isPlaying = function () {
    return this._duration > 0;
};

//-----------------------------------------------------------------------------
// Sprite_Picture
//
// The sprite for displaying a picture.

function Sprite_Picture() {
    this.initialize.apply(this, arguments);
}

Sprite_Picture.prototype = Object.create(_core.Sprite.prototype);
Sprite_Picture.prototype.constructor = Sprite_Picture;

Sprite_Picture.prototype.initialize = function (pictureId) {
    _core.Sprite.prototype.initialize.call(this);
    this._pictureId = pictureId;
    this._pictureName = '';
    this.update();
};

Sprite_Picture.prototype.picture = function () {
    return $gameScreen.picture(this._pictureId);
};

Sprite_Picture.prototype.update = function () {
    _core.Sprite.prototype.update.call(this);
    this.updateBitmap();
    if (this.visible) {
        this.updateOrigin();
        this.updatePosition();
        this.updateScale();
        this.updateTone();
        this.updateOther();
    }
};

Sprite_Picture.prototype.updateBitmap = function () {
    var picture = this.picture();
    if (picture) {
        var pictureName = picture.name();
        if (this._pictureName !== pictureName) {
            this._pictureName = pictureName;
            this.loadBitmap();
        }
        this.visible = true;
    } else {
        this._pictureName = '';
        this.bitmap = null;
        this.visible = false;
    }
};

Sprite_Picture.prototype.updateOrigin = function () {
    var picture = this.picture();
    if (picture.origin() === 0) {
        this.anchor.x = 0;
        this.anchor.y = 0;
    } else {
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
    }
};

Sprite_Picture.prototype.updatePosition = function () {
    var picture = this.picture();
    this.x = Math.floor(picture.x());
    this.y = Math.floor(picture.y());
};

Sprite_Picture.prototype.updateScale = function () {
    var picture = this.picture();
    this.scale.x = picture.scaleX() / 100;
    this.scale.y = picture.scaleY() / 100;
};

Sprite_Picture.prototype.updateTone = function () {
    var picture = this.picture();
    if (picture.tone()) {
        this.setColorTone(picture.tone());
    } else {
        this.setColorTone([0, 0, 0, 0]);
    }
};

Sprite_Picture.prototype.updateOther = function () {
    var picture = this.picture();
    this.opacity = picture.opacity();
    this.blendMode = picture.blendMode();
    this.rotation = picture.angle() * Math.PI / 180;
};

Sprite_Picture.prototype.loadBitmap = function () {
    this.bitmap = _managers.ImageManager.loadPicture(this._pictureName);
};

//-----------------------------------------------------------------------------
// Sprite_Timer
//
// The sprite for displaying the timer.

function Sprite_Timer() {
    this.initialize.apply(this, arguments);
}

Sprite_Timer.prototype = Object.create(_core.Sprite.prototype);
Sprite_Timer.prototype.constructor = Sprite_Timer;

Sprite_Timer.prototype.initialize = function () {
    _core.Sprite.prototype.initialize.call(this);
    this._seconds = 0;
    this.createBitmap();
    this.update();
};

Sprite_Timer.prototype.createBitmap = function () {
    this.bitmap = new _core.Bitmap(96, 48);
    this.bitmap.fontSize = 32;
};

Sprite_Timer.prototype.update = function () {
    _core.Sprite.prototype.update.call(this);
    this.updateBitmap();
    this.updatePosition();
    this.updateVisibility();
};

Sprite_Timer.prototype.updateBitmap = function () {
    if (this._seconds !== $gameTimer.seconds()) {
        this._seconds = $gameTimer.seconds();
        this.redraw();
    }
};

Sprite_Timer.prototype.redraw = function () {
    var text = this.timerText();
    var width = this.bitmap.width;
    var height = this.bitmap.height;
    this.bitmap.clear();
    this.bitmap.drawText(text, 0, 0, width, height, 'center');
};

Sprite_Timer.prototype.timerText = function () {
    var min = Math.floor(this._seconds / 60) % 60;
    var sec = this._seconds % 60;
    return min.padZero(2) + ':' + sec.padZero(2);
};

Sprite_Timer.prototype.updatePosition = function () {
    this.x = _core.Graphics.width - this.bitmap.width;
    this.y = 0;
};

Sprite_Timer.prototype.updateVisibility = function () {
    this.visible = $gameTimer.isWorking();
};

//-----------------------------------------------------------------------------
// Sprite_Destination
//
// The sprite for displaying the destination place of the touch input.

function Sprite_Destination() {
    this.initialize.apply(this, arguments);
}

Sprite_Destination.prototype = Object.create(_core.Sprite.prototype);
Sprite_Destination.prototype.constructor = Sprite_Destination;

Sprite_Destination.prototype.initialize = function () {
    _core.Sprite.prototype.initialize.call(this);
    this.createBitmap();
    this._frameCount = 0;
};

Sprite_Destination.prototype.update = function () {
    _core.Sprite.prototype.update.call(this);
    if ($gameTemp.isDestinationValid()) {
        this.updatePosition();
        this.updateAnimation();
        this.visible = true;
    } else {
        this._frameCount = 0;
        this.visible = false;
    }
};

Sprite_Destination.prototype.createBitmap = function () {
    var tileWidth = $gameMap.tileWidth();
    var tileHeight = $gameMap.tileHeight();
    this.bitmap = new _core.Bitmap(tileWidth, tileHeight);
    this.bitmap.fillAll('white');
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.blendMode = _core.Graphics.BLEND_ADD;
};

Sprite_Destination.prototype.updatePosition = function () {
    var tileWidth = $gameMap.tileWidth();
    var tileHeight = $gameMap.tileHeight();
    var x = $gameTemp.destinationX();
    var y = $gameTemp.destinationY();
    this.x = ($gameMap.adjustX(x) + 0.5) * tileWidth;
    this.y = ($gameMap.adjustY(y) + 0.5) * tileHeight;
};

Sprite_Destination.prototype.updateAnimation = function () {
    this._frameCount++;
    this._frameCount %= 20;
    this.opacity = (20 - this._frameCount) * 6;
    this.scale.x = 1 + this._frameCount / 20;
    this.scale.y = this.scale.x;
};

//-----------------------------------------------------------------------------
// Spriteset_Base
//
// The superclass of Spriteset_Map and Spriteset_Battle.

function Spriteset_Base() {
    this.initialize.apply(this, arguments);
}

Spriteset_Base.prototype = Object.create(_core.Sprite.prototype);
Spriteset_Base.prototype.constructor = Spriteset_Base;

Spriteset_Base.prototype.initialize = function () {
    _core.Sprite.prototype.initialize.call(this);
    this.setFrame(0, 0, _core.Graphics.width, _core.Graphics.height);
    this._tone = [0, 0, 0, 0];
    this.opaque = true;
    this.createLowerLayer();
    this.createToneChanger();
    this.createUpperLayer();
    this.update();
};

Spriteset_Base.prototype.createLowerLayer = function () {
    this.createBaseSprite();
};

Spriteset_Base.prototype.createUpperLayer = function () {
    this.createPictures();
    this.createTimer();
    this.createScreenSprites();
};

Spriteset_Base.prototype.update = function () {
    _core.Sprite.prototype.update.call(this);
    this.updateScreenSprites();
    this.updateToneChanger();
    this.updatePosition();
};

Spriteset_Base.prototype.createBaseSprite = function () {
    this._baseSprite = new _core.Sprite();
    this._baseSprite.setFrame(0, 0, this.width, this.height);
    this._blackScreen = new _core.ScreenSprite();
    this._blackScreen.opacity = 255;
    this.addChild(this._baseSprite);
    this._baseSprite.addChild(this._blackScreen);
};

Spriteset_Base.prototype.createToneChanger = function () {
    if (_core.Graphics.isWebGL()) {
        this.createWebGLToneChanger();
    } else {
        this.createCanvasToneChanger();
    }
};

Spriteset_Base.prototype.createWebGLToneChanger = function () {
    var margin = 48;
    var width = _core.Graphics.width + margin * 2;
    var height = _core.Graphics.height + margin * 2;
    this._toneFilter = new _core.ToneFilter();
    this._baseSprite.filters = [this._toneFilter];
    this._baseSprite.filterArea = new _core.Rectangle(-margin, -margin, width, height);
};

Spriteset_Base.prototype.createCanvasToneChanger = function () {
    this._toneSprite = new ToneSprite();
    this.addChild(this._toneSprite);
};

Spriteset_Base.prototype.createPictures = function () {
    var width = _core.Graphics.boxWidth;
    var height = _core.Graphics.boxHeight;
    var x = (_core.Graphics.width - width) / 2;
    var y = (_core.Graphics.height - height) / 2;
    this._pictureContainer = new _core.Sprite();
    this._pictureContainer.setFrame(x, y, width, height);
    for (var i = 1; i <= $gameScreen.maxPictures(); i++) {
        this._pictureContainer.addChild(new Sprite_Picture(i));
    }
    this.addChild(this._pictureContainer);
};

Spriteset_Base.prototype.createTimer = function () {
    this._timerSprite = new Sprite_Timer();
    this.addChild(this._timerSprite);
};

Spriteset_Base.prototype.createScreenSprites = function () {
    this._flashSprite = new _core.ScreenSprite();
    this._fadeSprite = new _core.ScreenSprite();
    this.addChild(this._flashSprite);
    this.addChild(this._fadeSprite);
};

Spriteset_Base.prototype.updateScreenSprites = function () {
    var color = $gameScreen.flashColor();
    this._flashSprite.setColor(color[0], color[1], color[2]);
    this._flashSprite.opacity = color[3];
    this._fadeSprite.opacity = 255 - $gameScreen.brightness();
};

Spriteset_Base.prototype.updateToneChanger = function () {
    var tone = $gameScreen.tone();
    if (!this._tone.equals(tone)) {
        this._tone = tone.clone();
        if (_core.Graphics.isWebGL()) {
            this.updateWebGLToneChanger();
        } else {
            this.updateCanvasToneChanger();
        }
    }
};

Spriteset_Base.prototype.updateWebGLToneChanger = function () {
    var tone = this._tone;
    this._toneFilter.reset();
    this._toneFilter.adjustTone(tone[0], tone[1], tone[2]);
    this._toneFilter.adjustSaturation(-tone[3]);
};

Spriteset_Base.prototype.updateCanvasToneChanger = function () {
    var tone = this._tone;
    this._toneSprite.setTone(tone[0], tone[1], tone[2], tone[3]);
};

Spriteset_Base.prototype.updatePosition = function () {
    var screen = $gameScreen;
    var scale = screen.zoomScale();
    this.scale.x = scale;
    this.scale.y = scale;
    this.x = Math.round(-screen.zoomX() * (scale - 1));
    this.y = Math.round(-screen.zoomY() * (scale - 1));
    this.x += Math.round(screen.shake());
};

//-----------------------------------------------------------------------------
// Spriteset_Map
//
// The set of sprites on the map screen.

function Spriteset_Map() {
    this.initialize.apply(this, arguments);
}

Spriteset_Map.prototype = Object.create(Spriteset_Base.prototype);
Spriteset_Map.prototype.constructor = Spriteset_Map;

Spriteset_Map.prototype.initialize = function () {
    Spriteset_Base.prototype.initialize.call(this);
};

Spriteset_Map.prototype.createLowerLayer = function () {
    Spriteset_Base.prototype.createLowerLayer.call(this);
    this.createParallax();
    this.createTilemap();
    this.createCharacters();
    this.createShadow();
    this.createDestination();
    this.createWeather();
};

Spriteset_Map.prototype.update = function () {
    Spriteset_Base.prototype.update.call(this);
    this.updateTileset();
    this.updateParallax();
    this.updateTilemap();
    this.updateShadow();
    this.updateWeather();
};

Spriteset_Map.prototype.hideCharacters = function () {
    for (var i = 0; i < this._characterSprites.length; i++) {
        var sprite = this._characterSprites[i];
        if (!sprite.isTile()) {
            sprite.hide();
        }
    }
};

Spriteset_Map.prototype.createParallax = function () {
    this._parallax = new _core.TilingSprite();
    this._parallax.move(0, 0, _core.Graphics.width, _core.Graphics.height);
    this._baseSprite.addChild(this._parallax);
};

Spriteset_Map.prototype.createTilemap = function () {
    this._tilemap = new _core.Tilemap();
    this._tilemap.tileWidth = $gameMap.tileWidth();
    this._tilemap.tileHeight = $gameMap.tileHeight();
    this._tilemap.setData($gameMap.width(), $gameMap.height(), $gameMap.data());
    this._tilemap.horizontalWrap = $gameMap.isLoopHorizontal();
    this._tilemap.verticalWrap = $gameMap.isLoopVertical();
    this.loadTileset();
    this._baseSprite.addChild(this._tilemap);
};

Spriteset_Map.prototype.loadTileset = function () {
    this._tileset = $gameMap.tileset();
    if (this._tileset) {
        var tilesetNames = this._tileset.tilesetNames;
        for (var i = 0; i < tilesetNames.length; i++) {
            this._tilemap.bitmaps[i] = _managers.ImageManager.loadTileset(tilesetNames[i]);
        }
        this._tilemap.flags = $gameMap.tilesetFlags();
        this._tilemap.refresh();
    }
};

Spriteset_Map.prototype.createCharacters = function () {
    this._characterSprites = [];
    $gameMap.events().forEach(function (event) {
        this._characterSprites.push(new Sprite_Character(event));
    }, this);
    $gameMap.vehicles().forEach(function (vehicle) {
        this._characterSprites.push(new Sprite_Character(vehicle));
    }, this);
    $gamePlayer.followers().reverseEach(function (follower) {
        this._characterSprites.push(new Sprite_Character(follower));
    }, this);
    this._characterSprites.push(new Sprite_Character($gamePlayer));
    for (var i = 0; i < this._characterSprites.length; i++) {
        this._tilemap.addChild(this._characterSprites[i]);
    }
};

Spriteset_Map.prototype.createShadow = function () {
    this._shadowSprite = new _core.Sprite();
    this._shadowSprite.bitmap = _managers.ImageManager.loadSystem('Shadow1');
    this._shadowSprite.anchor.x = 0.5;
    this._shadowSprite.anchor.y = 1;
    this._shadowSprite.z = 6;
    this._tilemap.addChild(this._shadowSprite);
};

Spriteset_Map.prototype.createDestination = function () {
    this._destinationSprite = new Sprite_Destination();
    this._destinationSprite.z = 9;
    this._tilemap.addChild(this._destinationSprite);
};

Spriteset_Map.prototype.createWeather = function () {
    this._weather = new _core.Weather();
    this.addChild(this._weather);
};

Spriteset_Map.prototype.updateTileset = function () {
    if (this._tileset !== $gameMap.tileset()) {
        this.loadTileset();
    }
};

Spriteset_Map.prototype.updateParallax = function () {
    if (this._parallaxName !== $gameMap.parallaxName()) {
        this._parallaxName = $gameMap.parallaxName();
        this._parallax.bitmap = _managers.ImageManager.loadParallax(this._parallaxName);
    }
    if (this._parallax.bitmap) {
        this._parallax.origin.x = $gameMap.parallaxOx();
        this._parallax.origin.y = $gameMap.parallaxOy();
    }
};

Spriteset_Map.prototype.updateTilemap = function () {
    this._tilemap.origin.x = $gameMap.displayX() * $gameMap.tileWidth();
    this._tilemap.origin.y = $gameMap.displayY() * $gameMap.tileHeight();
};

Spriteset_Map.prototype.updateShadow = function () {
    var airship = $gameMap.airship();
    this._shadowSprite.x = airship.shadowX();
    this._shadowSprite.y = airship.shadowY();
    this._shadowSprite.opacity = airship.shadowOpacity();
};

Spriteset_Map.prototype.updateWeather = function () {
    this._weather.type = $gameScreen.weatherType();
    this._weather.power = $gameScreen.weatherPower();
    this._weather.origin.x = $gameMap.displayX() * $gameMap.tileWidth();
    this._weather.origin.y = $gameMap.displayY() * $gameMap.tileHeight();
};

//-----------------------------------------------------------------------------
// Spriteset_Battle
//
// The set of sprites on the battle screen.

function Spriteset_Battle() {
    this.initialize.apply(this, arguments);
}

Spriteset_Battle.prototype = Object.create(Spriteset_Base.prototype);
Spriteset_Battle.prototype.constructor = Spriteset_Battle;

Spriteset_Battle.prototype.initialize = function () {
    Spriteset_Base.prototype.initialize.call(this);
    this._battlebackLocated = false;
};

Spriteset_Battle.prototype.createLowerLayer = function () {
    Spriteset_Base.prototype.createLowerLayer.call(this);
    this.createBackground();
    this.createBattleField();
    this.createBattleback();
    this.createEnemies();
    this.createActors();
};

Spriteset_Battle.prototype.createBackground = function () {
    this._backgroundSprite = new _core.Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    this._baseSprite.addChild(this._backgroundSprite);
};

Spriteset_Battle.prototype.update = function () {
    Spriteset_Base.prototype.update.call(this);
    this.updateActors();
    this.updateBattleback();
};

Spriteset_Battle.prototype.createBattleField = function () {
    var width = _core.Graphics.boxWidth;
    var height = _core.Graphics.boxHeight;
    var x = (_core.Graphics.width - width) / 2;
    var y = (_core.Graphics.height - height) / 2;
    this._battleField = new _core.Sprite();
    this._battleField.setFrame(x, y, width, height);
    this._battleField.x = x;
    this._battleField.y = y;
    this._baseSprite.addChild(this._battleField);
};

Spriteset_Battle.prototype.createBattleback = function () {
    var margin = 32;
    var x = -this._battleField.x - margin;
    var y = -this._battleField.y - margin;
    var width = _core.Graphics.width + margin * 2;
    var height = _core.Graphics.height + margin * 2;
    this._back1Sprite = new _core.TilingSprite();
    this._back2Sprite = new _core.TilingSprite();
    this._back1Sprite.bitmap = this.battleback1Bitmap();
    this._back2Sprite.bitmap = this.battleback2Bitmap();
    this._back1Sprite.move(x, y, width, height);
    this._back2Sprite.move(x, y, width, height);
    this._battleField.addChild(this._back1Sprite);
    this._battleField.addChild(this._back2Sprite);
};

Spriteset_Battle.prototype.updateBattleback = function () {
    if (!this._battlebackLocated) {
        this.locateBattleback();
        this._battlebackLocated = true;
    }
};

Spriteset_Battle.prototype.locateBattleback = function () {
    var width = this._battleField.width;
    var height = this._battleField.height;
    var sprite1 = this._back1Sprite;
    var sprite2 = this._back2Sprite;
    sprite1.origin.x = sprite1.x + (sprite1.bitmap.width - width) / 2;
    sprite2.origin.x = sprite1.y + (sprite2.bitmap.width - width) / 2;
    if ($gameSystem.isSideView()) {
        sprite1.origin.y = sprite1.x + sprite1.bitmap.height - height;
        sprite2.origin.y = sprite1.y + sprite2.bitmap.height - height;
    }
};

Spriteset_Battle.prototype.battleback1Bitmap = function () {
    return _managers.ImageManager.loadBattleback1(this.battleback1Name());
};

Spriteset_Battle.prototype.battleback2Bitmap = function () {
    return _managers.ImageManager.loadBattleback2(this.battleback2Name());
};

Spriteset_Battle.prototype.battleback1Name = function () {
    if (BattleManager.isBattleTest()) {
        return $dataSystem.battleback1Name;
    } else if ($gameMap.battleback1Name()) {
        return $gameMap.battleback1Name();
    } else if ($gameMap.isOverworld()) {
        return this.overworldBattleback1Name();
    } else {
        return '';
    }
};

Spriteset_Battle.prototype.battleback2Name = function () {
    if (BattleManager.isBattleTest()) {
        return $dataSystem.battleback2Name;
    } else if ($gameMap.battleback2Name()) {
        return $gameMap.battleback2Name();
    } else if ($gameMap.isOverworld()) {
        return this.overworldBattleback2Name();
    } else {
        return '';
    }
};

Spriteset_Battle.prototype.overworldBattleback1Name = function () {
    if ($gamePlayer.isInVehicle()) {
        return this.shipBattleback1Name();
    } else {
        return this.normalBattleback1Name();
    }
};

Spriteset_Battle.prototype.overworldBattleback2Name = function () {
    if ($gamePlayer.isInVehicle()) {
        return this.shipBattleback2Name();
    } else {
        return this.normalBattleback2Name();
    }
};

Spriteset_Battle.prototype.normalBattleback1Name = function () {
    return this.terrainBattleback1Name(this.autotileType(1)) || this.terrainBattleback1Name(this.autotileType(0)) || this.defaultBattleback1Name();
};

Spriteset_Battle.prototype.normalBattleback2Name = function () {
    return this.terrainBattleback2Name(this.autotileType(1)) || this.terrainBattleback2Name(this.autotileType(0)) || this.defaultBattleback2Name();
};

Spriteset_Battle.prototype.terrainBattleback1Name = function (type) {
    switch (type) {
        case 24:case 25:
            return 'Wasteland';
        case 26:case 27:
            return 'DirtField';
        case 32:case 33:
            return 'Desert';
        case 34:
            return 'Lava1';
        case 35:
            return 'Lava2';
        case 40:case 41:
            return 'Snowfield';
        case 42:
            return 'Clouds';
        case 4:case 5:
            return 'PoisonSwamp';
        default:
            return null;
    }
};

Spriteset_Battle.prototype.terrainBattleback2Name = function (type) {
    switch (type) {
        case 20:case 21:
            return 'Forest';
        case 22:case 30:case 38:
            return 'Cliff';
        case 24:case 25:case 26:case 27:
            return 'Wasteland';
        case 32:case 33:
            return 'Desert';
        case 34:case 35:
            return 'Lava';
        case 40:case 41:
            return 'Snowfield';
        case 42:
            return 'Clouds';
        case 4:case 5:
            return 'PoisonSwamp';
    }
};

Spriteset_Battle.prototype.defaultBattleback1Name = function () {
    return 'Grassland';
};

Spriteset_Battle.prototype.defaultBattleback2Name = function () {
    return 'Grassland';
};

Spriteset_Battle.prototype.shipBattleback1Name = function () {
    return 'Ship';
};

Spriteset_Battle.prototype.shipBattleback2Name = function () {
    return 'Ship';
};

Spriteset_Battle.prototype.autotileType = function (z) {
    return $gameMap.autotileType($gamePlayer.x, $gamePlayer.y, z);
};

Spriteset_Battle.prototype.createEnemies = function () {
    var enemies = $gameTroop.members();
    var sprites = [];
    for (var i = 0; i < enemies.length; i++) {
        sprites[i] = new Sprite_Enemy(enemies[i]);
    }
    sprites.sort(this.compareEnemySprite.bind(this));
    for (var j = 0; j < sprites.length; j++) {
        this._battleField.addChild(sprites[j]);
    }
    this._enemySprites = sprites;
};

Spriteset_Battle.prototype.compareEnemySprite = function (a, b) {
    if (a.y !== b.y) {
        return a.y - b.y;
    } else {
        return b.spriteId - a.spriteId;
    }
};

Spriteset_Battle.prototype.createActors = function () {
    this._actorSprites = [];
    for (var i = 0; i < $gameParty.maxBattleMembers(); i++) {
        this._actorSprites[i] = new Sprite_Actor();
        this._battleField.addChild(this._actorSprites[i]);
    }
};

Spriteset_Battle.prototype.updateActors = function () {
    var members = $gameParty.battleMembers();
    for (var i = 0; i < this._actorSprites.length; i++) {
        this._actorSprites[i].setBattler(members[i]);
    }
};

Spriteset_Battle.prototype.battlerSprites = function () {
    return this._enemySprites.concat(this._actorSprites);
};

Spriteset_Battle.prototype.isAnimationPlaying = function () {
    return this.battlerSprites().some(function (sprite) {
        return sprite.isAnimationPlaying();
    });
};

Spriteset_Battle.prototype.isEffecting = function () {
    return this.battlerSprites().some(function (sprite) {
        return sprite.isEffecting();
    });
};

Spriteset_Battle.prototype.isAnyoneMoving = function () {
    return this.battlerSprites().some(function (sprite) {
        return sprite.isMoving();
    });
};

Spriteset_Battle.prototype.isBusy = function () {
    return this.isAnimationPlaying() || this.isAnyoneMoving();
};

},{"./core":4,"./managers":6}],11:[function(require,module,exports){
'use strict';Object.defineProperty(exports,'__esModule',{value:true});exports.Window_Base = Window_Base;exports.Window_Selectable = Window_Selectable;exports.Window_Command = Window_Command;exports.Window_HorzCommand = Window_HorzCommand;exports.Window_Help = Window_Help;exports.Window_Gold = Window_Gold;exports.Window_MenuCommand = Window_MenuCommand;exports.Window_MenuStatus = Window_MenuStatus;exports.Window_MenuActor = Window_MenuActor;exports.Window_ItemCategory = Window_ItemCategory;exports.Window_ItemList = Window_ItemList;exports.Window_SkillType = Window_SkillType;exports.Window_SkillStatus = Window_SkillStatus;exports.Window_SkillList = Window_SkillList;exports.Window_EquipStatus = Window_EquipStatus;exports.Window_EquipCommand = Window_EquipCommand;exports.Window_EquipSlot = Window_EquipSlot;exports.Window_EquipItem = Window_EquipItem;exports.Window_Status = Window_Status;exports.Window_Options = Window_Options;exports.Window_SavefileList = Window_SavefileList;exports.Window_ShopCommand = Window_ShopCommand;exports.Window_ShopBuy = Window_ShopBuy;exports.Window_ShopSell = Window_ShopSell;exports.Window_ShopNumber = Window_ShopNumber;exports.Window_ShopStatus = Window_ShopStatus;exports.Window_NameEdit = Window_NameEdit;exports.Window_NameInput = Window_NameInput;exports.Window_ChoiceList = Window_ChoiceList;exports.Window_NumberInput = Window_NumberInput;exports.Window_EventItem = Window_EventItem;exports.Window_Message = Window_Message;exports.Window_ScrollText = Window_ScrollText;exports.Window_MapName = Window_MapName;exports.Window_BattleLog = Window_BattleLog;exports.Window_PartyCommand = Window_PartyCommand;exports.Window_ActorCommand = Window_ActorCommand;exports.Window_BattleStatus = Window_BattleStatus;exports.Window_BattleActor = Window_BattleActor;exports.Window_BattleEnemy = Window_BattleEnemy;exports.Window_BattleSkill = Window_BattleSkill;exports.Window_BattleItem = Window_BattleItem;exports.Window_TitleCommand = Window_TitleCommand;exports.Window_GameEnd = Window_GameEnd;exports.Window_DebugRange = Window_DebugRange;exports.Window_DebugEdit = Window_DebugEdit;function _interopRequireDefault(obj){return obj && obj.__esModule?obj:{'default':obj};}var _core=require('./core');var _managers=require('./managers');var _sprites=require('./sprites');var _objects=require('./objects'); //=============================================================================
// rpg_windows.js
//=============================================================================
//-----------------------------------------------------------------------------
// Window_Base
//
// The superclass of all windows within the game.
var _lodashClonedeep=require('lodash.clonedeep');var _lodashClonedeep2=_interopRequireDefault(_lodashClonedeep);function Window_Base(){this.initialize.apply(this,arguments);}Window_Base.prototype = Object.create(_core.Window.prototype);Window_Base.prototype.constructor = Window_Base;Window_Base.prototype.initialize = function(x,y,width,height){_core.Window.prototype.initialize.call(this);this.loadWindowskin();this.move(x,y,width,height);this.updatePadding();this.updateBackOpacity();this.updateTone();this.createContents();this._opening = false;this._closing = false;this._dimmerSprite = null;};Window_Base._iconWidth = 32;Window_Base._iconHeight = 32;Window_Base._faceWidth = 144;Window_Base._faceHeight = 144;Window_Base.prototype.lineHeight = function(){return 36;};Window_Base.prototype.standardFontFace = function(){if($gameSystem.isChinese()){return 'SimHei, Heiti TC, sans-serif';}else if($gameSystem.isKorean()){return 'Dotum, AppleGothic, sans-serif';}else {return 'GameFont';}};Window_Base.prototype.standardFontSize = function(){return 28;};Window_Base.prototype.standardPadding = function(){return 18;};Window_Base.prototype.textPadding = function(){return 6;};Window_Base.prototype.standardBackOpacity = function(){return 192;};Window_Base.prototype.loadWindowskin = function(){this.windowskin = _managers.ImageManager.loadSystem('Window');};Window_Base.prototype.updatePadding = function(){this.padding = this.standardPadding();};Window_Base.prototype.updateBackOpacity = function(){this.backOpacity = this.standardBackOpacity();};Window_Base.prototype.contentsWidth = function(){return this.width - this.standardPadding() * 2;};Window_Base.prototype.contentsHeight = function(){return this.height - this.standardPadding() * 2;};Window_Base.prototype.fittingHeight = function(numLines){return numLines * this.lineHeight() + this.standardPadding() * 2;};Window_Base.prototype.updateTone = function(){var tone=$gameSystem.windowTone();this.setTone(tone[0],tone[1],tone[2]);};Window_Base.prototype.createContents = function(){this.contents = new _core.Bitmap(this.contentsWidth(),this.contentsHeight());this.resetFontSettings();};Window_Base.prototype.resetFontSettings = function(){this.contents.fontFace = this.standardFontFace();this.contents.fontSize = this.standardFontSize();this.resetTextColor();};Window_Base.prototype.resetTextColor = function(){this.changeTextColor(this.normalColor());};Window_Base.prototype.update = function(){_core.Window.prototype.update.call(this);this.updateTone();this.updateOpen();this.updateClose();this.updateBackgroundDimmer();};Window_Base.prototype.updateOpen = function(){if(this._opening){this.openness += 32;if(this.isOpen()){this._opening = false;}}};Window_Base.prototype.updateClose = function(){if(this._closing){this.openness -= 32;if(this.isClosed()){this._closing = false;}}};Window_Base.prototype.open = function(){if(!this.isOpen()){this._opening = true;}this._closing = false;};Window_Base.prototype.close = function(){if(!this.isClosed()){this._closing = true;}this._opening = false;};Window_Base.prototype.isOpening = function(){return this._opening;};Window_Base.prototype.isClosing = function(){return this._closing;};Window_Base.prototype.show = function(){this.visible = true;};Window_Base.prototype.hide = function(){this.visible = false;};Window_Base.prototype.activate = function(){this.active = true;};Window_Base.prototype.deactivate = function(){this.active = false;};Window_Base.prototype.textColor = function(n){var px=96 + n % 8 * 12 + 6;var py=144 + Math.floor(n / 8) * 12 + 6;return this.windowskin.getPixel(px,py);};Window_Base.prototype.normalColor = function(){return this.textColor(0);};Window_Base.prototype.systemColor = function(){return this.textColor(16);};Window_Base.prototype.crisisColor = function(){return this.textColor(17);};Window_Base.prototype.deathColor = function(){return this.textColor(18);};Window_Base.prototype.gaugeBackColor = function(){return this.textColor(19);};Window_Base.prototype.hpGaugeColor1 = function(){return this.textColor(20);};Window_Base.prototype.hpGaugeColor2 = function(){return this.textColor(21);};Window_Base.prototype.mpGaugeColor1 = function(){return this.textColor(22);};Window_Base.prototype.mpGaugeColor2 = function(){return this.textColor(23);};Window_Base.prototype.mpCostColor = function(){return this.textColor(23);};Window_Base.prototype.powerUpColor = function(){return this.textColor(24);};Window_Base.prototype.powerDownColor = function(){return this.textColor(25);};Window_Base.prototype.tpGaugeColor1 = function(){return this.textColor(28);};Window_Base.prototype.tpGaugeColor2 = function(){return this.textColor(29);};Window_Base.prototype.tpCostColor = function(){return this.textColor(29);};Window_Base.prototype.pendingColor = function(){return this.windowskin.getPixel(120,120);};Window_Base.prototype.translucentOpacity = function(){return 160;};Window_Base.prototype.changeTextColor = function(color){this.contents.textColor = color;};Window_Base.prototype.changePaintOpacity = function(enabled){this.contents.paintOpacity = enabled?255:this.translucentOpacity();};Window_Base.prototype.drawText = function(text,x,y,maxWidth,align){this.contents.drawText(text,x,y,maxWidth,this.lineHeight(),align);};Window_Base.prototype.textWidth = function(text){return this.contents.measureTextWidth(text);};Window_Base.prototype.drawTextEx = function(text,x,y){if(text){var textState={index:0,x:x,y:y,left:x};textState.text = this.convertEscapeCharacters(text);textState.height = this.calcTextHeight(textState,false);this.resetFontSettings();while(textState.index < textState.text.length) {this.processCharacter(textState);}return textState.x - x;}else {return 0;}};Window_Base.prototype.convertEscapeCharacters = function(text){text = text.replace(/\\/g,'\x1b');text = text.replace(/\x1b\x1b/g,'\\');text = text.replace(/\x1bV\[(\d+)\]/gi,(function(){return $gameVariables.value(parseInt(arguments[1]));}).bind(this));text = text.replace(/\x1bV\[(\d+)\]/gi,(function(){return $gameVariables.value(parseInt(arguments[1]));}).bind(this));text = text.replace(/\x1bN\[(\d+)\]/gi,(function(){return this.actorName(parseInt(arguments[1]));}).bind(this));text = text.replace(/\x1bP\[(\d+)\]/gi,(function(){return this.partyMemberName(parseInt(arguments[1]));}).bind(this));text = text.replace(/\x1bG/gi,_managers.TextManager.currencyUnit);return text;};Window_Base.prototype.actorName = function(n){var actor=n >= 1?$gameActors.actor(n):null;return actor?actor.name():'';};Window_Base.prototype.partyMemberName = function(n){var actor=n >= 1?$gameParty.members()[n - 1]:null;return actor?actor.name():'';};Window_Base.prototype.processCharacter = function(textState){switch(textState.text[textState.index]){case '\n':this.processNewLine(textState);break;case '\f':this.processNewPage(textState);break;case '\x1b':this.processEscapeCharacter(this.obtainEscapeCode(textState),textState);break;default:this.processNormalCharacter(textState);break;}};Window_Base.prototype.processNormalCharacter = function(textState){var c=textState.text[textState.index++];var w=this.textWidth(c);this.contents.drawText(c,textState.x,textState.y,w * 2,textState.height);textState.x += w;};Window_Base.prototype.processNewLine = function(textState){textState.x = textState.left;textState.y += textState.height;textState.height = this.calcTextHeight(textState,false);textState.index++;};Window_Base.prototype.processNewPage = function(textState){textState.index++;};Window_Base.prototype.obtainEscapeCode = function(textState){textState.index++;var regExp=/^[\$\.\|\^!><\{\}\\]|^[A-Z]+/i;var arr=regExp.exec(textState.text.slice(textState.index));if(arr){textState.index += arr[0].length;return arr[0].toUpperCase();}else {return '';}};Window_Base.prototype.obtainEscapeParam = function(textState){var arr=/^\[\d+\]/.exec(textState.text.slice(textState.index));if(arr){textState.index += arr[0].length;return parseInt(arr[0].slice(1));}else {return '';}};Window_Base.prototype.processEscapeCharacter = function(code,textState){switch(code){case 'C':this.changeTextColor(this.textColor(this.obtainEscapeParam(textState)));break;case 'I':this.processDrawIcon(this.obtainEscapeParam(textState),textState);break;case '{':this.makeFontBigger();break;case '}':this.makeFontSmaller();break;}};Window_Base.prototype.processDrawIcon = function(iconIndex,textState){this.drawIcon(iconIndex,textState.x + 2,textState.y + 2);textState.x += Window_Base._iconWidth + 4;};Window_Base.prototype.makeFontBigger = function(){if(this.contents.fontSize <= 96){this.contents.fontSize += 12;}};Window_Base.prototype.makeFontSmaller = function(){if(this.contents.fontSize >= 24){this.contents.fontSize -= 12;}};Window_Base.prototype.calcTextHeight = function(textState,all){var lastFontSize=this.contents.fontSize;var textHeight=0;var lines=textState.text.slice(textState.index).split('\n');var maxLines=all?lines.length:1;for(var i=0;i < maxLines;i++) {var maxFontSize=this.contents.fontSize;var regExp=/\x1b[\{\}]/g;for(;;) {var array=regExp.exec(lines[i]);if(array){if(array[0] === '\x1b{'){this.makeFontBigger();}if(array[0] === '\x1b}'){this.makeFontSmaller();}if(maxFontSize < this.contents.fontSize){maxFontSize = this.contents.fontSize;}}else {break;}}textHeight += maxFontSize + 8;}this.contents.fontSize = lastFontSize;return textHeight;};Window_Base.prototype.drawIcon = function(iconIndex,x,y){var bitmap=_managers.ImageManager.loadSystem('IconSet');var pw=Window_Base._iconWidth;var ph=Window_Base._iconHeight;var sx=iconIndex % 16 * pw;var sy=Math.floor(iconIndex / 16) * ph;this.contents.blt(bitmap,sx,sy,pw,ph,x,y);};Window_Base.prototype.drawFace = function(faceName,faceIndex,x,y,width,height){width = width || Window_Base._faceWidth;height = height || Window_Base._faceHeight;var bitmap=_managers.ImageManager.loadFace(faceName);var pw=Window_Base._faceWidth;var ph=Window_Base._faceHeight;var sw=Math.min(width,pw);var sh=Math.min(height,ph);var dx=Math.floor(x + Math.max(width - pw,0) / 2);var dy=Math.floor(y + Math.max(height - ph,0) / 2);var sx=faceIndex % 4 * pw + (pw - sw) / 2;var sy=Math.floor(faceIndex / 4) * ph + (ph - sh) / 2;this.contents.blt(bitmap,sx,sy,sw,sh,dx,dy);};Window_Base.prototype.drawCharacter = function(characterName,characterIndex,x,y){var bitmap=_managers.ImageManager.loadCharacter(characterName);var big=_managers.ImageManager.isBigCharacter(characterName);var pw=bitmap.width / (big?3:12);var ph=bitmap.height / (big?4:8);var n=characterIndex;var sx=(n % 4 * 3 + 1) * pw;var sy=Math.floor(n / 4) * 4 * ph;this.contents.blt(bitmap,sx,sy,pw,ph,x - pw / 2,y - ph);};Window_Base.prototype.drawGauge = function(x,y,width,rate,color1,color2){var fillW=Math.floor(width * rate);var gaugeY=y + this.lineHeight() - 8;this.contents.fillRect(x,gaugeY,width,6,this.gaugeBackColor());this.contents.gradientFillRect(x,gaugeY,fillW,6,color1,color2);};Window_Base.prototype.hpColor = function(actor){if(actor.isDead()){return this.deathColor();}else if(actor.isDying()){return this.crisisColor();}else {return this.normalColor();}};Window_Base.prototype.mpColor = function(actor){return this.normalColor();};Window_Base.prototype.tpColor = function(actor){return this.normalColor();};Window_Base.prototype.drawActorCharacter = function(actor,x,y){this.drawCharacter(actor.characterName(),actor.characterIndex(),x,y);};Window_Base.prototype.drawActorFace = function(actor,x,y,width,height){this.drawFace(actor.faceName(),actor.faceIndex(),x,y,width,height);};Window_Base.prototype.drawActorName = function(actor,x,y,width){width = width || 168;this.changeTextColor(this.hpColor(actor));this.drawText(actor.name(),x,y,width);};Window_Base.prototype.drawActorClass = function(actor,x,y,width){width = width || 168;this.resetTextColor();this.drawText(actor.currentClass().name,x,y,width);};Window_Base.prototype.drawActorNickname = function(actor,x,y,width){width = width || 270;this.resetTextColor();this.drawText(actor.nickname(),x,y,width);};Window_Base.prototype.drawActorLevel = function(actor,x,y){this.changeTextColor(this.systemColor());this.drawText(_managers.TextManager.levelA,x,y,48);this.resetTextColor();this.drawText(actor.level,x + 84,y,36,'right');};Window_Base.prototype.drawActorIcons = function(actor,x,y,width){width = width || 144;var icons=actor.allIcons().slice(0,Math.floor(width / Window_Base._iconWidth));for(var i=0;i < icons.length;i++) {this.drawIcon(icons[i],x + Window_Base._iconWidth * i,y + 2);}};Window_Base.prototype.drawCurrentAndMax = function(current,max,x,y,width,color1,color2){var labelWidth=this.textWidth('HP');var valueWidth=this.textWidth('0000');var slashWidth=this.textWidth('/');var x1=x + width - valueWidth;var x2=x1 - slashWidth;var x3=x2 - valueWidth;if(x3 >= x + labelWidth){this.changeTextColor(color1);this.drawText(current,x3,y,valueWidth,'right');this.changeTextColor(color2);this.drawText('/',x2,y,slashWidth,'right');this.drawText(max,x1,y,valueWidth,'right');}else {this.changeTextColor(color1);this.drawText(current,x1,y,valueWidth,'right');}};Window_Base.prototype.drawActorHp = function(actor,x,y,width){width = width || 186;var color1=this.hpGaugeColor1();var color2=this.hpGaugeColor2();this.drawGauge(x,y,width,actor.hpRate(),color1,color2);this.changeTextColor(this.systemColor());this.drawText(_managers.TextManager.hpA,x,y,44);this.drawCurrentAndMax(actor.hp,actor.mhp,x,y,width,this.hpColor(actor),this.normalColor());};Window_Base.prototype.drawActorMp = function(actor,x,y,width){width = width || 186;var color1=this.mpGaugeColor1();var color2=this.mpGaugeColor2();this.drawGauge(x,y,width,actor.mpRate(),color1,color2);this.changeTextColor(this.systemColor());this.drawText(_managers.TextManager.mpA,x,y,44);this.drawCurrentAndMax(actor.mp,actor.mmp,x,y,width,this.mpColor(actor),this.normalColor());};Window_Base.prototype.drawActorTp = function(actor,x,y,width){width = width || 96;var color1=this.tpGaugeColor1();var color2=this.tpGaugeColor2();this.drawGauge(x,y,width,actor.tpRate(),color1,color2);this.changeTextColor(this.systemColor());this.drawText(_managers.TextManager.tpA,x,y,44);this.changeTextColor(this.tpColor(actor));this.drawText(actor.tp,x + width - 64,y,64,'right');};Window_Base.prototype.drawActorSimpleStatus = function(actor,x,y,width){var lineHeight=this.lineHeight();var x2=x + 180;var width2=Math.min(200,width - 180 - this.textPadding());this.drawActorName(actor,x,y);this.drawActorLevel(actor,x,y + lineHeight * 1);this.drawActorIcons(actor,x,y + lineHeight * 2);this.drawActorClass(actor,x2,y);this.drawActorHp(actor,x2,y + lineHeight * 1,width2);this.drawActorMp(actor,x2,y + lineHeight * 2,width2);};Window_Base.prototype.drawItemName = function(item,x,y,width){width = width || 312;if(item){var iconBoxWidth=Window_Base._iconWidth + 4;this.resetTextColor();this.drawIcon(item.iconIndex,x + 2,y + 2);this.drawText(item.name,x + iconBoxWidth,y,width - iconBoxWidth);}};Window_Base.prototype.drawCurrencyValue = function(value,unit,x,y,width){var unitWidth=Math.min(80,this.textWidth(unit));this.resetTextColor();this.drawText(value,x,y,width - unitWidth - 6,'right');this.changeTextColor(this.systemColor());this.drawText(unit,x + width - unitWidth,y,unitWidth,'right');};Window_Base.prototype.paramchangeTextColor = function(change){if(change > 0){return this.powerUpColor();}else if(change < 0){return this.powerDownColor();}else {return this.normalColor();}};Window_Base.prototype.setBackgroundType = function(type){if(type === 0){this.opacity = 255;}else {this.opacity = 0;}if(type === 1){this.showBackgroundDimmer();}else {this.hideBackgroundDimmer();}};Window_Base.prototype.showBackgroundDimmer = function(){if(!this._dimmerSprite){this._dimmerSprite = new Sprite();this._dimmerSprite.bitmap = new _core.Bitmap(0,0);this.addChildToBack(this._dimmerSprite);}var bitmap=this._dimmerSprite.bitmap;if(bitmap.width !== this.width || bitmap.height !== this.height){this.refreshDimmerBitmap();}this._dimmerSprite.visible = true;this.updateBackgroundDimmer();};Window_Base.prototype.hideBackgroundDimmer = function(){if(this._dimmerSprite){this._dimmerSprite.visible = false;}};Window_Base.prototype.updateBackgroundDimmer = function(){if(this._dimmerSprite){this._dimmerSprite.opacity = this.openness;}};Window_Base.prototype.refreshDimmerBitmap = function(){if(this._dimmerSprite){var bitmap=this._dimmerSprite.bitmap;var w=this.width;var h=this.height;var m=this.padding;var c1=this.dimColor1();var c2=this.dimColor2();bitmap.resize(w,h);bitmap.gradientFillRect(0,0,w,m,c2,c1,true);bitmap.fillRect(0,m,w,h - m * 2,c1);bitmap.gradientFillRect(0,h - m,w,m,c1,c2,true);this._dimmerSprite.setFrame(0,0,w,h);}};Window_Base.prototype.dimColor1 = function(){return 'rgba(0, 0, 0, 0.6)';};Window_Base.prototype.dimColor2 = function(){return 'rgba(0, 0, 0, 0)';};Window_Base.prototype.canvasToLocalX = function(x){var node=this;while(node) {x -= node.x;node = node.parent;}return x;};Window_Base.prototype.canvasToLocalY = function(y){var node=this;while(node) {y -= node.y;node = node.parent;}return y;}; //-----------------------------------------------------------------------------
// Window_Selectable
//
// The window class with cursor movement and scroll functions.
function Window_Selectable(){this.initialize.apply(this,arguments);}Window_Selectable.prototype = Object.create(Window_Base.prototype);Window_Selectable.prototype.constructor = Window_Selectable;Window_Selectable.prototype.initialize = function(x,y,width,height){Window_Base.prototype.initialize.call(this,x,y,width,height);this._index = -1;this._cursorFixed = false;this._cursorAll = false;this._stayCount = 0;this._helpWindow = null;this._handlers = {};this._touching = false;this._scrollX = 0;this._scrollY = 0;this.deactivate();};Window_Selectable.prototype.index = function(){return this._index;};Window_Selectable.prototype.cursorFixed = function(){return this._cursorFixed;};Window_Selectable.prototype.setCursorFixed = function(cursorFixed){this._cursorFixed = cursorFixed;};Window_Selectable.prototype.cursorAll = function(){return this._cursorAll;};Window_Selectable.prototype.setCursorAll = function(cursorAll){this._cursorAll = cursorAll;};Window_Selectable.prototype.maxCols = function(){return 1;};Window_Selectable.prototype.maxItems = function(){return 0;};Window_Selectable.prototype.spacing = function(){return 12;};Window_Selectable.prototype.itemWidth = function(){return Math.floor((this.width - this.padding * 2 + this.spacing()) / this.maxCols() - this.spacing());};Window_Selectable.prototype.itemHeight = function(){return this.lineHeight();};Window_Selectable.prototype.maxRows = function(){return Math.max(Math.ceil(this.maxItems() / this.maxCols()),1);};Window_Selectable.prototype.activate = function(){Window_Base.prototype.activate.call(this);this.reselect();};Window_Selectable.prototype.deactivate = function(){Window_Base.prototype.deactivate.call(this);this.reselect();};Window_Selectable.prototype.select = function(index){this._index = index;this._stayCount = 0;this.ensureCursorVisible();this.updateCursor();this.callUpdateHelp();};Window_Selectable.prototype.deselect = function(){this.select(-1);};Window_Selectable.prototype.reselect = function(){this.select(this._index);};Window_Selectable.prototype.row = function(){return Math.floor(this.index() / this.maxCols());};Window_Selectable.prototype.topRow = function(){return Math.floor(this._scrollY / this.itemHeight());};Window_Selectable.prototype.maxTopRow = function(){return Math.max(0,this.maxRows() - this.maxPageRows());};Window_Selectable.prototype.setTopRow = function(row){var scrollY=row.clamp(0,this.maxTopRow()) * this.itemHeight();if(this._scrollY !== scrollY){this._scrollY = scrollY;this.refresh();this.updateCursor();}};Window_Selectable.prototype.resetScroll = function(){this.setTopRow(0);};Window_Selectable.prototype.maxPageRows = function(){var pageHeight=this.height - this.padding * 2;return Math.floor(pageHeight / this.itemHeight());};Window_Selectable.prototype.maxPageItems = function(){return this.maxPageRows() * this.maxCols();};Window_Selectable.prototype.isHorizontal = function(){return this.maxPageRows() === 1;};Window_Selectable.prototype.bottomRow = function(){return Math.max(0,this.topRow() + this.maxPageRows() - 1);};Window_Selectable.prototype.setBottomRow = function(row){this.setTopRow(row - (this.maxPageRows() - 1));};Window_Selectable.prototype.topIndex = function(){return this.topRow() * this.maxCols();};Window_Selectable.prototype.itemRect = function(index){var rect=new _core.Rectangle();var maxCols=this.maxCols();rect.width = this.itemWidth();rect.height = this.itemHeight();rect.x = index % maxCols * (rect.width + this.spacing()) - this._scrollX;rect.y = Math.floor(index / maxCols) * rect.height - this._scrollY;return rect;};Window_Selectable.prototype.itemRectForText = function(index){var rect=this.itemRect(index);rect.x += this.textPadding();rect.width -= this.textPadding() * 2;return rect;};Window_Selectable.prototype.setHelpWindow = function(helpWindow){this._helpWindow = helpWindow;this.callUpdateHelp();};Window_Selectable.prototype.showHelpWindow = function(){if(this._helpWindow){this._helpWindow.show();}};Window_Selectable.prototype.hideHelpWindow = function(){if(this._helpWindow){this._helpWindow.hide();}};Window_Selectable.prototype.setHandler = function(symbol,method){this._handlers[symbol] = method;};Window_Selectable.prototype.isHandled = function(symbol){return !!this._handlers[symbol];};Window_Selectable.prototype.callHandler = function(symbol){if(this.isHandled(symbol)){this._handlers[symbol]();}};Window_Selectable.prototype.isOpenAndActive = function(){return this.isOpen() && this.active;};Window_Selectable.prototype.isCursorMovable = function(){return this.isOpenAndActive() && !this._cursorFixed && !this._cursorAll && this.maxItems() > 0;};Window_Selectable.prototype.cursorDown = function(wrap){var index=this.index();var maxItems=this.maxItems();var maxCols=this.maxCols();if(index < maxItems - maxCols || wrap && maxCols === 1){this.select((index + maxCols) % maxItems);}};Window_Selectable.prototype.cursorUp = function(wrap){var index=this.index();var maxItems=this.maxItems();var maxCols=this.maxCols();if(index >= maxCols || wrap && maxCols === 1){this.select((index - maxCols + maxItems) % maxItems);}};Window_Selectable.prototype.cursorRight = function(wrap){var index=this.index();var maxItems=this.maxItems();var maxCols=this.maxCols();if(maxCols >= 2 && (index < maxItems - 1 || wrap && this.isHorizontal())){this.select((index + 1) % maxItems);}};Window_Selectable.prototype.cursorLeft = function(wrap){var index=this.index();var maxItems=this.maxItems();var maxCols=this.maxCols();if(maxCols >= 2 && (index > 0 || wrap && this.isHorizontal())){this.select((index - 1 + maxItems) % maxItems);}};Window_Selectable.prototype.cursorPagedown = function(){var index=this.index();var maxItems=this.maxItems();if(this.topRow() + this.maxPageRows() < this.maxRows()){this.setTopRow(this.topRow() + this.maxPageRows());this.select(Math.min(index + this.maxPageItems(),maxItems - 1));}};Window_Selectable.prototype.cursorPageup = function(){var index=this.index();if(this.topRow() > 0){this.setTopRow(this.topRow() - this.maxPageRows());this.select(Math.max(index - this.maxPageItems(),0));}};Window_Selectable.prototype.scrollDown = function(){if(this.topRow() + 1 < this.maxRows()){this.setTopRow(this.topRow() + 1);}};Window_Selectable.prototype.scrollUp = function(){if(this.topRow() > 0){this.setTopRow(this.topRow() - 1);}};Window_Selectable.prototype.update = function(){Window_Base.prototype.update.call(this);this.updateArrows();this.processCursorMove();this.processHandling();this.processWheel();this.processTouch();this._stayCount++;};Window_Selectable.prototype.updateArrows = function(){var topRow=this.topRow();var maxTopRow=this.maxTopRow();this.downArrowVisible = maxTopRow > 0 && topRow < maxTopRow;this.upArrowVisible = topRow > 0;};Window_Selectable.prototype.processCursorMove = function(){if(this.isCursorMovable()){var lastIndex=this.index();if(_core.Input.isRepeated('down')){this.cursorDown(_core.Input.isTriggered('down'));}if(_core.Input.isRepeated('up')){this.cursorUp(_core.Input.isTriggered('up'));}if(_core.Input.isRepeated('right')){this.cursorRight(_core.Input.isTriggered('right'));}if(_core.Input.isRepeated('left')){this.cursorLeft(_core.Input.isTriggered('left'));}if(!this.isHandled('pagedown') && _core.Input.isTriggered('pagedown')){this.cursorPagedown();}if(!this.isHandled('pageup') && _core.Input.isTriggered('pageup')){this.cursorPageup();}if(this.index() !== lastIndex){_managers.SoundManager.playCursor();}}};Window_Selectable.prototype.processHandling = function(){if(this.isOpenAndActive()){if(this.isOkEnabled() && this.isOkTriggered()){this.processOk();}else if(this.isCancelEnabled() && this.isCancelTriggered()){this.processCancel();}else if(this.isHandled('pagedown') && _core.Input.isTriggered('pagedown')){this.processPagedown();}else if(this.isHandled('pageup') && _core.Input.isTriggered('pageup')){this.processPageup();}}};Window_Selectable.prototype.processWheel = function(){if(this.isOpenAndActive()){var threshold=20;if(_core.TouchInput.wheelY >= threshold){this.scrollDown();}if(_core.TouchInput.wheelY <= -threshold){this.scrollUp();}}};Window_Selectable.prototype.processTouch = function(){if(this.isOpenAndActive()){if(_core.TouchInput.isTriggered() && this.isTouchedInsideFrame()){this._touching = true;this.onTouch(true);}else if(_core.TouchInput.isCancelled()){if(this.isCancelEnabled()){this.processCancel();}}if(this._touching){if(_core.TouchInput.isPressed()){this.onTouch(false);}else {this._touching = false;}}}else {this._touching = false;}};Window_Selectable.prototype.isTouchedInsideFrame = function(){var x=this.canvasToLocalX(_core.TouchInput.x);var y=this.canvasToLocalY(_core.TouchInput.y);return x >= 0 && y >= 0 && x < this.width && y < this.height;};Window_Selectable.prototype.onTouch = function(triggered){var lastIndex=this.index();var x=this.canvasToLocalX(_core.TouchInput.x);var y=this.canvasToLocalY(_core.TouchInput.y);var hitIndex=this.hitTest(x,y);if(hitIndex >= 0){if(hitIndex === this.index()){if(triggered && this.isTouchOkEnabled()){this.processOk();}}else if(this.isCursorMovable()){this.select(hitIndex);}}else if(this._stayCount >= 10){if(y < this.padding){this.cursorUp();}else if(y >= this.height - this.padding){this.cursorDown();}}if(this.index() !== lastIndex){_managers.SoundManager.playCursor();}};Window_Selectable.prototype.hitTest = function(x,y){if(this.isContentsArea(x,y)){var cx=x - this.padding;var cy=y - this.padding;var topIndex=this.topIndex();for(var i=0;i < this.maxPageItems();i++) {var index=topIndex + i;if(index < this.maxItems()){var rect=this.itemRect(index);var right=rect.x + rect.width;var bottom=rect.y + rect.height;if(cx >= rect.x && cy >= rect.y && cx < right && cy < bottom){return index;}}}}return -1;};Window_Selectable.prototype.isContentsArea = function(x,y){var left=this.padding;var top=this.padding;var right=this.width - this.padding;var bottom=this.height - this.padding;return x >= left && y >= top && x < right && y < bottom;};Window_Selectable.prototype.isTouchOkEnabled = function(){return this.isOkEnabled();};Window_Selectable.prototype.isOkEnabled = function(){return this.isHandled('ok');};Window_Selectable.prototype.isCancelEnabled = function(){return this.isHandled('cancel');};Window_Selectable.prototype.isOkTriggered = function(){return _core.Input.isRepeated('ok');};Window_Selectable.prototype.isCancelTriggered = function(){return _core.Input.isRepeated('cancel');};Window_Selectable.prototype.processOk = function(){if(this.isCurrentItemEnabled()){this.playOkSound();this.updateInputData();this.deactivate();this.callOkHandler();}else {this.playBuzzerSound();}};Window_Selectable.prototype.playOkSound = function(){_managers.SoundManager.playOk();};Window_Selectable.prototype.playBuzzerSound = function(){_managers.SoundManager.playBuzzer();};Window_Selectable.prototype.callOkHandler = function(){this.callHandler('ok');};Window_Selectable.prototype.processCancel = function(){_managers.SoundManager.playCancel();this.updateInputData();this.deactivate();this.callCancelHandler();};Window_Selectable.prototype.callCancelHandler = function(){this.callHandler('cancel');};Window_Selectable.prototype.processPageup = function(){_managers.SoundManager.playCursor();this.updateInputData();this.deactivate();this.callHandler('pageup');};Window_Selectable.prototype.processPagedown = function(){_managers.SoundManager.playCursor();this.updateInputData();this.deactivate();this.callHandler('pagedown');};Window_Selectable.prototype.updateInputData = function(){_core.Input.update();_core.TouchInput.update();};Window_Selectable.prototype.updateCursor = function(){if(this._cursorAll){var allRowsHeight=this.maxRows() * this.itemHeight();this.setCursorRect(0,0,this.contents.width,allRowsHeight);this.setTopRow(0);}else if(this.isCursorVisible()){var rect=this.itemRect(this.index());this.setCursorRect(rect.x,rect.y,rect.width,rect.height);}else {this.setCursorRect(0,0,0,0);}};Window_Selectable.prototype.isCursorVisible = function(){var row=this.row();return row >= this.topRow() && row <= this.bottomRow();};Window_Selectable.prototype.ensureCursorVisible = function(){var row=this.row();if(row < this.topRow()){this.setTopRow(row);}else if(row > this.bottomRow()){this.setBottomRow(row);}};Window_Selectable.prototype.callUpdateHelp = function(){if(this.active && this._helpWindow){this.updateHelp();}};Window_Selectable.prototype.updateHelp = function(){this._helpWindow.clear();};Window_Selectable.prototype.setHelpWindowItem = function(item){if(this._helpWindow){this._helpWindow.setItem(item);}};Window_Selectable.prototype.isCurrentItemEnabled = function(){return true;};Window_Selectable.prototype.drawAllItems = function(){var topIndex=this.topIndex();for(var i=0;i < this.maxPageItems();i++) {var index=topIndex + i;if(index < this.maxItems()){this.drawItem(index);}}};Window_Selectable.prototype.drawItem = function(index){};Window_Selectable.prototype.clearItem = function(index){var rect=this.itemRect(index);this.contents.clearRect(rect.x,rect.y,rect.width,rect.height);};Window_Selectable.prototype.redrawItem = function(index){if(index >= 0){this.clearItem(index);this.drawItem(index);}};Window_Selectable.prototype.redrawCurrentItem = function(){this.redrawItem(this.index());};Window_Selectable.prototype.refresh = function(){if(this.contents){this.contents.clear();this.drawAllItems();}}; //-----------------------------------------------------------------------------
// Window_Command
//
// The superclass of windows for selecting a command.
function Window_Command(){this.initialize.apply(this,arguments);}Window_Command.prototype = Object.create(Window_Selectable.prototype);Window_Command.prototype.constructor = Window_Command;Window_Command.prototype.initialize = function(x,y){this.clearCommandList();this.makeCommandList();var width=this.windowWidth();var height=this.windowHeight();Window_Selectable.prototype.initialize.call(this,x,y,width,height);this.refresh();this.select(0);this.activate();};Window_Command.prototype.windowWidth = function(){return 240;};Window_Command.prototype.windowHeight = function(){return this.fittingHeight(this.numVisibleRows());};Window_Command.prototype.numVisibleRows = function(){return Math.ceil(this.maxItems() / this.maxCols());};Window_Command.prototype.maxItems = function(){return this._list.length;};Window_Command.prototype.clearCommandList = function(){this._list = [];};Window_Command.prototype.makeCommandList = function(){};Window_Command.prototype.addCommand = function(name,symbol,enabled,ext){if(enabled === undefined){enabled = true;}if(ext === undefined){ext = null;}this._list.push({name:name,symbol:symbol,enabled:enabled,ext:ext});};Window_Command.prototype.commandName = function(index){return this._list[index].name;};Window_Command.prototype.commandSymbol = function(index){return this._list[index].symbol;};Window_Command.prototype.isCommandEnabled = function(index){return this._list[index].enabled;};Window_Command.prototype.currentData = function(){return this.index() >= 0?this._list[this.index()]:null;};Window_Command.prototype.isCurrentItemEnabled = function(){return this.currentData()?this.currentData().enabled:false;};Window_Command.prototype.currentSymbol = function(){return this.currentData()?this.currentData().symbol:null;};Window_Command.prototype.currentExt = function(){return this.currentData()?this.currentData().ext:null;};Window_Command.prototype.findSymbol = function(symbol){for(var i=0;i < this._list.length;i++) {if(this._list[i].symbol === symbol){return i;}}return -1;};Window_Command.prototype.selectSymbol = function(symbol){var index=this.findSymbol(symbol);if(index >= 0){this.select(index);}else {this.select(0);}};Window_Command.prototype.findExt = function(ext){for(var i=0;i < this._list.length;i++) {if(this._list[i].ext === ext){return i;}}return -1;};Window_Command.prototype.selectExt = function(ext){var index=this.findExt(ext);if(index >= 0){this.select(index);}else {this.select(0);}};Window_Command.prototype.drawItem = function(index){var rect=this.itemRectForText(index);var align=this.itemTextAlign();this.resetTextColor();this.changePaintOpacity(this.isCommandEnabled(index));this.drawText(this.commandName(index),rect.x,rect.y,rect.width,align);};Window_Command.prototype.itemTextAlign = function(){return 'left';};Window_Command.prototype.isOkEnabled = function(){return true;};Window_Command.prototype.callOkHandler = function(){var symbol=this.currentSymbol();if(this.isHandled(symbol)){this.callHandler(symbol);}else if(this.isHandled('ok')){Window_Selectable.prototype.callOkHandler.call(this);}else {this.activate();}};Window_Command.prototype.refresh = function(){this.clearCommandList();this.makeCommandList();this.createContents();Window_Selectable.prototype.refresh.call(this);}; //-----------------------------------------------------------------------------
// Window_HorzCommand
//
// The command window for the horizontal selection format.
function Window_HorzCommand(){this.initialize.apply(this,arguments);}Window_HorzCommand.prototype = Object.create(Window_Command.prototype);Window_HorzCommand.prototype.constructor = Window_HorzCommand;Window_HorzCommand.prototype.initialize = function(x,y){Window_Command.prototype.initialize.call(this,x,y);};Window_HorzCommand.prototype.numVisibleRows = function(){return 1;};Window_HorzCommand.prototype.maxCols = function(){return 4;};Window_HorzCommand.prototype.itemTextAlign = function(){return 'center';}; //-----------------------------------------------------------------------------
// Window_Help
//
// The window for displaying the description of the selected item.
function Window_Help(){this.initialize.apply(this,arguments);}Window_Help.prototype = Object.create(Window_Base.prototype);Window_Help.prototype.constructor = Window_Help;Window_Help.prototype.initialize = function(numLines){var width=_core.Graphics.boxWidth;var height=this.fittingHeight(numLines || 2);Window_Base.prototype.initialize.call(this,0,0,width,height);this._text = '';};Window_Help.prototype.setText = function(text){if(this._text !== text){this._text = text;this.refresh();}};Window_Help.prototype.clear = function(){this.setText('');};Window_Help.prototype.setItem = function(item){this.setText(item?item.description:'');};Window_Help.prototype.refresh = function(){this.contents.clear();this.drawTextEx(this._text,this.textPadding(),0);}; //-----------------------------------------------------------------------------
// Window_Gold
//
// The window for displaying the party's gold.
function Window_Gold(){this.initialize.apply(this,arguments);}Window_Gold.prototype = Object.create(Window_Base.prototype);Window_Gold.prototype.constructor = Window_Gold;Window_Gold.prototype.initialize = function(x,y){var width=this.windowWidth();var height=this.windowHeight();Window_Base.prototype.initialize.call(this,x,y,width,height);this.refresh();};Window_Gold.prototype.windowWidth = function(){return 240;};Window_Gold.prototype.windowHeight = function(){return this.fittingHeight(1);};Window_Gold.prototype.refresh = function(){var x=this.textPadding();var width=this.contents.width - this.textPadding() * 2;this.contents.clear();this.drawCurrencyValue(this.value(),this.currencyUnit(),x,0,width);};Window_Gold.prototype.value = function(){return $gameParty.gold();};Window_Gold.prototype.currencyUnit = function(){return _managers.TextManager.currencyUnit;};Window_Gold.prototype.open = function(){this.refresh();Window_Base.prototype.open.call(this);}; //-----------------------------------------------------------------------------
// Window_MenuCommand
//
// The window for selecting a command on the menu screen.
function Window_MenuCommand(){this.initialize.apply(this,arguments);}Window_MenuCommand.prototype = Object.create(Window_Command.prototype);Window_MenuCommand.prototype.constructor = Window_MenuCommand;Window_MenuCommand.prototype.initialize = function(x,y){Window_Command.prototype.initialize.call(this,x,y);this.selectLast();};Window_MenuCommand._lastCommandSymbol = null;Window_MenuCommand.initCommandPosition = function(){this._lastCommandSymbol = null;};Window_MenuCommand.prototype.windowWidth = function(){return 240;};Window_MenuCommand.prototype.numVisibleRows = function(){return this.maxItems();};Window_MenuCommand.prototype.makeCommandList = function(){this.addMainCommands();this.addFormationCommand();this.addOriginalCommands();this.addOptionsCommand();this.addSaveCommand();this.addGameEndCommand();};Window_MenuCommand.prototype.addMainCommands = function(){var enabled=this.areMainCommandsEnabled();if(this.needsCommand('item')){this.addCommand(_managers.TextManager.item,'item',enabled);}if(this.needsCommand('skill')){this.addCommand(_managers.TextManager.skill,'skill',enabled);}if(this.needsCommand('equip')){this.addCommand(_managers.TextManager.equip,'equip',enabled);}if(this.needsCommand('status')){this.addCommand(_managers.TextManager.status,'status',enabled);}};Window_MenuCommand.prototype.addFormationCommand = function(){if(this.needsCommand('formation')){var enabled=this.isFormationEnabled();this.addCommand(_managers.TextManager.formation,'formation',enabled);}};Window_MenuCommand.prototype.addOriginalCommands = function(){};Window_MenuCommand.prototype.addOptionsCommand = function(){if(this.needsCommand('options')){var enabled=this.isOptionsEnabled();this.addCommand(_managers.TextManager.options,'options',enabled);}};Window_MenuCommand.prototype.addSaveCommand = function(){if(this.needsCommand('save')){var enabled=this.isSaveEnabled();this.addCommand(_managers.TextManager.save,'save',enabled);}};Window_MenuCommand.prototype.addGameEndCommand = function(){var enabled=this.isGameEndEnabled();this.addCommand(_managers.TextManager.gameEnd,'gameEnd',enabled);};Window_MenuCommand.prototype.needsCommand = function(name){var flags=$dataSystem.menuCommands;if(flags){switch(name){case 'item':return flags[0];case 'skill':return flags[1];case 'equip':return flags[2];case 'status':return flags[3];case 'formation':return flags[4];case 'save':return flags[5];}}return true;};Window_MenuCommand.prototype.areMainCommandsEnabled = function(){return $gameParty.exists();};Window_MenuCommand.prototype.isFormationEnabled = function(){return $gameParty.size() >= 2 && $gameSystem.isFormationEnabled();};Window_MenuCommand.prototype.isOptionsEnabled = function(){return true;};Window_MenuCommand.prototype.isSaveEnabled = function(){return !_managers.DataManager.isEventTest() && $gameSystem.isSaveEnabled();};Window_MenuCommand.prototype.isGameEndEnabled = function(){return true;};Window_MenuCommand.prototype.processOk = function(){Window_MenuCommand._lastCommandSymbol = this.currentSymbol();Window_Command.prototype.processOk.call(this);};Window_MenuCommand.prototype.selectLast = function(){this.selectSymbol(Window_MenuCommand._lastCommandSymbol);}; //-----------------------------------------------------------------------------
// Window_MenuStatus
//
// The window for displaying party member status on the menu screen.
function Window_MenuStatus(){this.initialize.apply(this,arguments);}Window_MenuStatus.prototype = Object.create(Window_Selectable.prototype);Window_MenuStatus.prototype.constructor = Window_MenuStatus;Window_MenuStatus.prototype.initialize = function(x,y){var width=this.windowWidth();var height=this.windowHeight();Window_Selectable.prototype.initialize.call(this,x,y,width,height);this._formationMode = false;this._pendingIndex = -1;this.loadImages();this.refresh();};Window_MenuStatus.prototype.windowWidth = function(){return _core.Graphics.boxWidth - 240;};Window_MenuStatus.prototype.windowHeight = function(){return _core.Graphics.boxHeight;};Window_MenuStatus.prototype.maxItems = function(){return $gameParty.size();};Window_MenuStatus.prototype.itemHeight = function(){var clientHeight=this.height - this.padding * 2;return Math.floor(clientHeight / this.numVisibleRows());};Window_MenuStatus.prototype.numVisibleRows = function(){return 4;};Window_MenuStatus.prototype.loadImages = function(){$gameParty.members().forEach(function(actor){_managers.ImageManager.loadFace(actor.faceName());},this);};Window_MenuStatus.prototype.drawItem = function(index){this.drawItemBackground(index);this.drawItemImage(index);this.drawItemStatus(index);};Window_MenuStatus.prototype.drawItemBackground = function(index){if(index === this._pendingIndex){var rect=this.itemRect(index);var color=this.pendingColor();this.changePaintOpacity(false);this.contents.fillRect(rect.x,rect.y,rect.width,rect.height,color);this.changePaintOpacity(true);}};Window_MenuStatus.prototype.drawItemImage = function(index){var actor=$gameParty.members()[index];var rect=this.itemRect(index);this.changePaintOpacity(actor.isBattleMember());this.drawActorFace(actor,rect.x + 1,rect.y + 1,144,rect.height - 2);this.changePaintOpacity(true);};Window_MenuStatus.prototype.drawItemStatus = function(index){var actor=$gameParty.members()[index];var rect=this.itemRect(index);var x=rect.x + 162;var y=rect.y + rect.height / 2 - this.lineHeight() * 1.5;var width=rect.width - x - this.textPadding();this.drawActorSimpleStatus(actor,x,y,width);};Window_MenuStatus.prototype.processOk = function(){Window_Selectable.prototype.processOk.call(this);$gameParty.setMenuActor($gameParty.members()[this.index()]);};Window_MenuStatus.prototype.isCurrentItemEnabled = function(){if(this._formationMode){var actor=$gameParty.members()[this.index()];return actor && actor.isFormationChangeOk();}else {return true;}};Window_MenuStatus.prototype.selectLast = function(){this.select($gameParty.menuActor().index() || 0);};Window_MenuStatus.prototype.formationMode = function(){return this._formationMode;};Window_MenuStatus.prototype.setFormationMode = function(formationMode){this._formationMode = formationMode;};Window_MenuStatus.prototype.pendingIndex = function(){return this._pendingIndex;};Window_MenuStatus.prototype.setPendingIndex = function(index){var lastPendingIndex=this._pendingIndex;this._pendingIndex = index;this.redrawItem(this._pendingIndex);this.redrawItem(lastPendingIndex);}; //-----------------------------------------------------------------------------
// Window_MenuActor
//
// The window for selecting a target actor on the item and skill screens.
function Window_MenuActor(){this.initialize.apply(this,arguments);}Window_MenuActor.prototype = Object.create(Window_MenuStatus.prototype);Window_MenuActor.prototype.constructor = Window_MenuActor;Window_MenuActor.prototype.initialize = function(){Window_MenuStatus.prototype.initialize.call(this,0,0);this.hide();};Window_MenuActor.prototype.processOk = function(){if(!this.cursorAll()){$gameParty.setTargetActor($gameParty.members()[this.index()]);}this.callOkHandler();};Window_MenuActor.prototype.selectLast = function(){this.select($gameParty.targetActor().index() || 0);};Window_MenuActor.prototype.selectForItem = function(item){var actor=$gameParty.menuActor();var action=new _objects.Game_Action(actor);action.setItemObject(item);this.setCursorFixed(false);this.setCursorAll(false);if(action.isForUser()){if(_managers.DataManager.isSkill(item)){this.setCursorFixed(true);this.select(actor.index());}else {this.selectLast();}}else if(action.isForAll()){this.setCursorAll(true);this.select(0);}else {this.selectLast();}}; //-----------------------------------------------------------------------------
// Window_ItemCategory
//
// The window for selecting a category of items on the item and shop screens.
function Window_ItemCategory(){this.initialize.apply(this,arguments);}Window_ItemCategory.prototype = Object.create(Window_HorzCommand.prototype);Window_ItemCategory.prototype.constructor = Window_ItemCategory;Window_ItemCategory.prototype.initialize = function(){Window_HorzCommand.prototype.initialize.call(this,0,0);};Window_ItemCategory.prototype.windowWidth = function(){return _core.Graphics.boxWidth;};Window_ItemCategory.prototype.maxCols = function(){return 4;};Window_ItemCategory.prototype.update = function(){Window_HorzCommand.prototype.update.call(this);if(this._itemWindow){this._itemWindow.setCategory(this.currentSymbol());}};Window_ItemCategory.prototype.makeCommandList = function(){this.addCommand(_managers.TextManager.item,'item');this.addCommand(_managers.TextManager.weapon,'weapon');this.addCommand(_managers.TextManager.armor,'armor');this.addCommand(_managers.TextManager.keyItem,'keyItem');};Window_ItemCategory.prototype.setItemWindow = function(itemWindow){this._itemWindow = itemWindow;this.update();}; //-----------------------------------------------------------------------------
// Window_ItemList
//
// The window for selecting an item on the item screen.
function Window_ItemList(){this.initialize.apply(this,arguments);}Window_ItemList.prototype = Object.create(Window_Selectable.prototype);Window_ItemList.prototype.constructor = Window_ItemList;Window_ItemList.prototype.initialize = function(x,y,width,height){Window_Selectable.prototype.initialize.call(this,x,y,width,height);this._category = 'none';this._data = [];};Window_ItemList.prototype.setCategory = function(category){if(this._category !== category){this._category = category;this.refresh();this.resetScroll();}};Window_ItemList.prototype.maxCols = function(){return 2;};Window_ItemList.prototype.spacing = function(){return 48;};Window_ItemList.prototype.maxItems = function(){return this._data?this._data.length:1;};Window_ItemList.prototype.item = function(){var index=this.index();return this._data && index >= 0?this._data[index]:null;};Window_ItemList.prototype.isCurrentItemEnabled = function(){return this.isEnabled(this.item());};Window_ItemList.prototype.includes = function(item){switch(this._category){case 'item':return _managers.DataManager.isItem(item) && item.itypeId === 1;case 'weapon':return _managers.DataManager.isWeapon(item);case 'armor':return _managers.DataManager.isArmor(item);case 'keyItem':return _managers.DataManager.isItem(item) && item.itypeId === 2;default:return false;}};Window_ItemList.prototype.needsNumber = function(){return true;};Window_ItemList.prototype.isEnabled = function(item){return $gameParty.canUse(item);};Window_ItemList.prototype.makeItemList = function(){this._data = $gameParty.allItems().filter(function(item){return this.includes(item);},this);if(this.includes(null)){this._data.push(null);}};Window_ItemList.prototype.selectLast = function(){var index=this._data.indexOf($gameParty.lastItem());this.select(index >= 0?index:0);};Window_ItemList.prototype.drawItem = function(index){var item=this._data[index];if(item){var numberWidth=this.numberWidth();var rect=this.itemRect(index);rect.width -= this.textPadding();this.changePaintOpacity(this.isEnabled(item));this.drawItemName(item,rect.x,rect.y,rect.width - numberWidth);this.drawItemNumber(item,rect.x,rect.y,rect.width);this.changePaintOpacity(1);}};Window_ItemList.prototype.numberWidth = function(){return this.textWidth('000');};Window_ItemList.prototype.drawItemNumber = function(item,x,y,width){if(this.needsNumber()){this.drawText(':',x,y,width - this.textWidth('00'),'right');this.drawText($gameParty.numItems(item),x,y,width,'right');}};Window_ItemList.prototype.updateHelp = function(){this.setHelpWindowItem(this.item());};Window_ItemList.prototype.refresh = function(){this.makeItemList();this.createContents();this.drawAllItems();}; //-----------------------------------------------------------------------------
// Window_SkillType
//
// The window for selecting a skill type on the skill screen.
function Window_SkillType(){this.initialize.apply(this,arguments);}Window_SkillType.prototype = Object.create(Window_Command.prototype);Window_SkillType.prototype.constructor = Window_SkillType;Window_SkillType.prototype.initialize = function(x,y){Window_Command.prototype.initialize.call(this,x,y);this._actor = null;};Window_SkillType.prototype.windowWidth = function(){return 240;};Window_SkillType.prototype.setActor = function(actor){if(this._actor !== actor){this._actor = actor;this.refresh();this.selectLast();}};Window_SkillType.prototype.numVisibleRows = function(){return 4;};Window_SkillType.prototype.makeCommandList = function(){if(this._actor){var skillTypes=this._actor.addedSkillTypes();skillTypes.sort(function(a,b){return a - b;});skillTypes.forEach(function(stypeId){var name=$dataSystem.skillTypes[stypeId];this.addCommand(name,'skill',true,stypeId);},this);}};Window_SkillType.prototype.update = function(){Window_Command.prototype.update.call(this);if(this._skillWindow){this._skillWindow.setStypeId(this.currentExt());}};Window_SkillType.prototype.setSkillWindow = function(skillWindow){this._skillWindow = skillWindow;this.update();};Window_SkillType.prototype.selectLast = function(){var skill=this._actor.lastMenuSkill();if(skill){this.selectExt(skill.stypeId);}else {this.select(0);}}; //-----------------------------------------------------------------------------
// Window_SkillStatus
//
// The window for displaying the skill user's status on the skill screen.
function Window_SkillStatus(){this.initialize.apply(this,arguments);}Window_SkillStatus.prototype = Object.create(Window_Base.prototype);Window_SkillStatus.prototype.constructor = Window_SkillStatus;Window_SkillStatus.prototype.initialize = function(x,y,width,height){Window_Base.prototype.initialize.call(this,x,y,width,height);this._actor = null;};Window_SkillStatus.prototype.setActor = function(actor){if(this._actor !== actor){this._actor = actor;this.refresh();}};Window_SkillStatus.prototype.refresh = function(){this.contents.clear();if(this._actor){var w=this.width - this.padding * 2;var h=this.height - this.padding * 2;var y=h / 2 - this.lineHeight() * 1.5;var width=w - 162 - this.textPadding();this.drawActorFace(this._actor,0,0,144,h);this.drawActorSimpleStatus(this._actor,162,y,width);}}; //-----------------------------------------------------------------------------
// Window_SkillList
//
// The window for selecting a skill on the skill screen.
function Window_SkillList(){this.initialize.apply(this,arguments);}Window_SkillList.prototype = Object.create(Window_Selectable.prototype);Window_SkillList.prototype.constructor = Window_SkillList;Window_SkillList.prototype.initialize = function(x,y,width,height){Window_Selectable.prototype.initialize.call(this,x,y,width,height);this._actor = null;this._stypeId = 0;this._data = [];};Window_SkillList.prototype.setActor = function(actor){if(this._actor !== actor){this._actor = actor;this.refresh();this.resetScroll();}};Window_SkillList.prototype.setStypeId = function(stypeId){if(this._stypeId !== stypeId){this._stypeId = stypeId;this.refresh();this.resetScroll();}};Window_SkillList.prototype.maxCols = function(){return 2;};Window_SkillList.prototype.spacing = function(){return 48;};Window_SkillList.prototype.maxItems = function(){return this._data?this._data.length:1;};Window_SkillList.prototype.item = function(){return this._data && this.index() >= 0?this._data[this.index()]:null;};Window_SkillList.prototype.isCurrentItemEnabled = function(){return this.isEnabled(this._data[this.index()]);};Window_SkillList.prototype.includes = function(item){return item && item.stypeId === this._stypeId;};Window_SkillList.prototype.isEnabled = function(item){return this._actor && this._actor.canUse(item);};Window_SkillList.prototype.makeItemList = function(){if(this._actor){this._data = this._actor.skills().filter(function(item){return this.includes(item);},this);}else {this._data = [];}};Window_SkillList.prototype.selectLast = function(){var skill;if($gameParty.inBattle()){skill = this._actor.lastBattleSkill();}else {skill = this._actor.lastMenuSkill();}var index=this._data.indexOf(skill);this.select(index >= 0?index:0);};Window_SkillList.prototype.drawItem = function(index){var skill=this._data[index];if(skill){var costWidth=this.costWidth();var rect=this.itemRect(index);rect.width -= this.textPadding();this.changePaintOpacity(this.isEnabled(skill));this.drawItemName(skill,rect.x,rect.y,rect.width - costWidth);this.drawSkillCost(skill,rect.x,rect.y,rect.width);this.changePaintOpacity(1);}};Window_SkillList.prototype.costWidth = function(){return this.textWidth('000');};Window_SkillList.prototype.drawSkillCost = function(skill,x,y,width){if(this._actor.skillTpCost(skill) > 0){this.changeTextColor(this.tpCostColor());this.drawText(this._actor.skillTpCost(skill),x,y,width,'right');}else if(this._actor.skillMpCost(skill) > 0){this.changeTextColor(this.mpCostColor());this.drawText(this._actor.skillMpCost(skill),x,y,width,'right');}};Window_SkillList.prototype.updateHelp = function(){this.setHelpWindowItem(this.item());};Window_SkillList.prototype.refresh = function(){this.makeItemList();this.createContents();this.drawAllItems();}; //-----------------------------------------------------------------------------
// Window_EquipStatus
//
// The window for displaying parameter changes on the equipment screen.
function Window_EquipStatus(){this.initialize.apply(this,arguments);}Window_EquipStatus.prototype = Object.create(Window_Base.prototype);Window_EquipStatus.prototype.constructor = Window_EquipStatus;Window_EquipStatus.prototype.initialize = function(x,y){var width=this.windowWidth();var height=this.windowHeight();Window_Base.prototype.initialize.call(this,x,y,width,height);this._actor = null;this._tempActor = null;this.refresh();};Window_EquipStatus.prototype.windowWidth = function(){return 312;};Window_EquipStatus.prototype.windowHeight = function(){return this.fittingHeight(this.numVisibleRows());};Window_EquipStatus.prototype.numVisibleRows = function(){return 7;};Window_EquipStatus.prototype.setActor = function(actor){if(this._actor !== actor){this._actor = actor;this.refresh();}};Window_EquipStatus.prototype.refresh = function(){this.contents.clear();if(this._actor){this.drawActorName(this._actor,this.textPadding(),0);for(var i=0;i < 6;i++) {this.drawItem(0,this.lineHeight() * (1 + i),2 + i);}}};Window_EquipStatus.prototype.setTempActor = function(tempActor){if(this._tempActor !== tempActor){this._tempActor = tempActor;this.refresh();}};Window_EquipStatus.prototype.drawItem = function(x,y,paramId){this.drawParamName(x + this.textPadding(),y,paramId);if(this._actor){this.drawCurrentParam(x + 140,y,paramId);}this.drawRightArrow(x + 188,y);if(this._tempActor){this.drawNewParam(x + 222,y,paramId);}};Window_EquipStatus.prototype.drawParamName = function(x,y,paramId){this.changeTextColor(this.systemColor());this.drawText(_managers.TextManager.param(paramId),x,y,120);};Window_EquipStatus.prototype.drawCurrentParam = function(x,y,paramId){this.resetTextColor();this.drawText(this._actor.param(paramId),x,y,48,'right');};Window_EquipStatus.prototype.drawRightArrow = function(x,y){this.changeTextColor(this.systemColor());this.drawText('→',x,y,32,'center');};Window_EquipStatus.prototype.drawNewParam = function(x,y,paramId){var newValue=this._tempActor.param(paramId);var diffvalue=newValue - this._actor.param(paramId);this.changeTextColor(this.paramchangeTextColor(diffvalue));this.drawText(newValue,x,y,48,'right');}; //-----------------------------------------------------------------------------
// Window_EquipCommand
//
// The window for selecting a command on the equipment screen.
function Window_EquipCommand(){this.initialize.apply(this,arguments);}Window_EquipCommand.prototype = Object.create(Window_HorzCommand.prototype);Window_EquipCommand.prototype.constructor = Window_EquipCommand;Window_EquipCommand.prototype.initialize = function(x,y,width){this._windowWidth = width;Window_HorzCommand.prototype.initialize.call(this,x,y);};Window_EquipCommand.prototype.windowWidth = function(){return this._windowWidth;};Window_EquipCommand.prototype.maxCols = function(){return 3;};Window_EquipCommand.prototype.makeCommandList = function(){this.addCommand(_managers.TextManager.equip2,'equip');this.addCommand(_managers.TextManager.optimize,'optimize');this.addCommand(_managers.TextManager.clear,'clear');}; //-----------------------------------------------------------------------------
// Window_EquipSlot
//
// The window for selecting an equipment slot on the equipment screen.
function Window_EquipSlot(){this.initialize.apply(this,arguments);}Window_EquipSlot.prototype = Object.create(Window_Selectable.prototype);Window_EquipSlot.prototype.constructor = Window_EquipSlot;Window_EquipSlot.prototype.initialize = function(x,y,width,height){Window_Selectable.prototype.initialize.call(this,x,y,width,height);this._actor = null;this.refresh();};Window_EquipSlot.prototype.setActor = function(actor){if(this._actor !== actor){this._actor = actor;this.refresh();}};Window_EquipSlot.prototype.update = function(){Window_Selectable.prototype.update.call(this);if(this._itemWindow){this._itemWindow.setSlotId(this.index());}};Window_EquipSlot.prototype.maxItems = function(){return this._actor?this._actor.equipSlots().length:0;};Window_EquipSlot.prototype.item = function(){return this._actor?this._actor.equips()[this.index()]:null;};Window_EquipSlot.prototype.drawItem = function(index){if(this._actor){var rect=this.itemRectForText(index);this.changeTextColor(this.systemColor());this.changePaintOpacity(this.isEnabled(index));this.drawText(this.slotName(index),rect.x,rect.y,138,this.lineHeight());this.drawItemName(this._actor.equips()[index],rect.x + 138,rect.y);this.changePaintOpacity(true);}};Window_EquipSlot.prototype.slotName = function(index){var slots=this._actor.equipSlots();return this._actor?$dataSystem.equipTypes[slots[index]]:'';};Window_EquipSlot.prototype.isEnabled = function(index){return this._actor?this._actor.isEquipChangeOk(index):false;};Window_EquipSlot.prototype.isCurrentItemEnabled = function(){return this.isEnabled(this.index());};Window_EquipSlot.prototype.setStatusWindow = function(statusWindow){this._statusWindow = statusWindow;this.callUpdateHelp();};Window_EquipSlot.prototype.setItemWindow = function(itemWindow){this._itemWindow = itemWindow;this.update();};Window_EquipSlot.prototype.updateHelp = function(){Window_Selectable.prototype.updateHelp.call(this);this.setHelpWindowItem(this.item());if(this._statusWindow){this._statusWindow.setTempActor(null);}}; //-----------------------------------------------------------------------------
// Window_EquipItem
//
// The window for selecting an equipment item on the equipment screen.
function Window_EquipItem(){this.initialize.apply(this,arguments);}Window_EquipItem.prototype = Object.create(Window_ItemList.prototype);Window_EquipItem.prototype.constructor = Window_EquipItem;Window_EquipItem.prototype.initialize = function(x,y,width,height){Window_ItemList.prototype.initialize.call(this,x,y,width,height);this._actor = null;this._slotId = 0;};Window_EquipItem.prototype.setActor = function(actor){if(this._actor !== actor){this._actor = actor;this.refresh();this.resetScroll();}};Window_EquipItem.prototype.setSlotId = function(slotId){if(this._slotId !== slotId){this._slotId = slotId;this.refresh();this.resetScroll();}};Window_EquipItem.prototype.includes = function(item){if(item === null){return true;}if(this._slotId < 0 || item.etypeId !== this._actor.equipSlots()[this._slotId]){return false;}return this._actor.canEquip(item);};Window_EquipItem.prototype.isEnabled = function(item){return true;};Window_EquipItem.prototype.selectLast = function(){};Window_EquipItem.prototype.setStatusWindow = function(statusWindow){this._statusWindow = statusWindow;this.callUpdateHelp();};Window_EquipItem.prototype.updateHelp = function(){Window_ItemList.prototype.updateHelp.call(this);if(this._actor && this._statusWindow){var actor=_core.JsonEx.makeDeepCopy(this._actor); // TODO actor.forceChangeEquip is not function
// JsonEx doesnt work correctly
actor.forceChangeEquip(this._slotId,this.item());this._statusWindow.setTempActor(actor);}};Window_EquipItem.prototype.playOkSound = function(){}; //-----------------------------------------------------------------------------
// Window_Status
//
// The window for displaying full status on the status screen.
function Window_Status(){this.initialize.apply(this,arguments);}Window_Status.prototype = Object.create(Window_Selectable.prototype);Window_Status.prototype.constructor = Window_Status;Window_Status.prototype.initialize = function(){var width=_core.Graphics.boxWidth;var height=_core.Graphics.boxHeight;Window_Selectable.prototype.initialize.call(this,0,0,width,height);this.refresh();this.activate();};Window_Status.prototype.setActor = function(actor){if(this._actor !== actor){this._actor = actor;this.refresh();}};Window_Status.prototype.refresh = function(){this.contents.clear();if(this._actor){var lineHeight=this.lineHeight();this.drawBlock1(lineHeight * 0);this.drawHorzLine(lineHeight * 1);this.drawBlock2(lineHeight * 2);this.drawHorzLine(lineHeight * 6);this.drawBlock3(lineHeight * 7);this.drawHorzLine(lineHeight * 13);this.drawBlock4(lineHeight * 14);}};Window_Status.prototype.drawBlock1 = function(y){this.drawActorName(this._actor,6,y);this.drawActorClass(this._actor,192,y);this.drawActorNickname(this._actor,432,y);};Window_Status.prototype.drawBlock2 = function(y){this.drawActorFace(this._actor,12,y);this.drawBasicInfo(204,y);this.drawExpInfo(456,y);};Window_Status.prototype.drawBlock3 = function(y){this.drawParameters(48,y);this.drawEquipments(432,y);};Window_Status.prototype.drawBlock4 = function(y){this.drawProfile(6,y);};Window_Status.prototype.drawHorzLine = function(y){var lineY=y + this.lineHeight() / 2 - 1;this.contents.paintOpacity = 48;this.contents.fillRect(0,lineY,this.contentsWidth(),2,this.lineColor());this.contents.paintOpacity = 255;};Window_Status.prototype.lineColor = function(){return this.normalColor();};Window_Status.prototype.drawBasicInfo = function(x,y){var lineHeight=this.lineHeight();this.drawActorLevel(this._actor,x,y + lineHeight * 0);this.drawActorIcons(this._actor,x,y + lineHeight * 1);this.drawActorHp(this._actor,x,y + lineHeight * 2);this.drawActorMp(this._actor,x,y + lineHeight * 3);};Window_Status.prototype.drawParameters = function(x,y){var lineHeight=this.lineHeight();for(var i=0;i < 6;i++) {var paramId=i + 2;var y2=y + lineHeight * i;this.changeTextColor(this.systemColor());this.drawText(_managers.TextManager.param(paramId),x,y2,160);this.resetTextColor();this.drawText(this._actor.param(paramId),x + 160,y2,60,'right');}};Window_Status.prototype.drawExpInfo = function(x,y){var lineHeight=this.lineHeight();var expTotal=_managers.TextManager.expTotal.format(_managers.TextManager.exp);var expNext=_managers.TextManager.expNext.format(_managers.TextManager.level);var value1=this._actor.currentExp();var value2=this._actor.nextRequiredExp();if(this._actor.isMaxLevel()){value1 = '-------';value2 = '-------';}this.changeTextColor(this.systemColor());this.drawText(expTotal,x,y + lineHeight * 0,270);this.drawText(expNext,x,y + lineHeight * 2,270);this.resetTextColor();this.drawText(value1,x,y + lineHeight * 1,270,'right');this.drawText(value2,x,y + lineHeight * 3,270,'right');};Window_Status.prototype.drawEquipments = function(x,y){var equips=this._actor.equips();var count=Math.min(equips.length,this.maxEquipmentLines());for(var i=0;i < count;i++) {this.drawItemName(equips[i],x,y + this.lineHeight() * i);}};Window_Status.prototype.drawProfile = function(x,y){this.drawTextEx(this._actor.profile(),x,y);};Window_Status.prototype.maxEquipmentLines = function(){return 6;}; //-----------------------------------------------------------------------------
// Window_Options
//
// The window for changing various settings on the options screen.
function Window_Options(){this.initialize.apply(this,arguments);}Window_Options.prototype = Object.create(Window_Command.prototype);Window_Options.prototype.constructor = Window_Options;Window_Options.prototype.initialize = function(){Window_Command.prototype.initialize.call(this,0,0);this.updatePlacement();};Window_Options.prototype.windowWidth = function(){return 400;};Window_Options.prototype.windowHeight = function(){return this.fittingHeight(Math.min(this.numVisibleRows(),12));};Window_Options.prototype.updatePlacement = function(){this.x = (_core.Graphics.boxWidth - this.width) / 2;this.y = (_core.Graphics.boxHeight - this.height) / 2;};Window_Options.prototype.makeCommandList = function(){this.addGeneralOptions();this.addVolumeOptions();};Window_Options.prototype.addGeneralOptions = function(){this.addCommand(_managers.TextManager.alwaysDash,'alwaysDash');this.addCommand(_managers.TextManager.commandRemember,'commandRemember');};Window_Options.prototype.addVolumeOptions = function(){this.addCommand(_managers.TextManager.bgmVolume,'bgmVolume');this.addCommand(_managers.TextManager.bgsVolume,'bgsVolume');this.addCommand(_managers.TextManager.meVolume,'meVolume');this.addCommand(_managers.TextManager.seVolume,'seVolume');};Window_Options.prototype.drawItem = function(index){var rect=this.itemRectForText(index);var statusWidth=this.statusWidth();var titleWidth=rect.width - statusWidth;this.resetTextColor();this.changePaintOpacity(this.isCommandEnabled(index));this.drawText(this.commandName(index),rect.x,rect.y,titleWidth,'left');this.drawText(this.statusText(index),titleWidth,rect.y,statusWidth,'right');};Window_Options.prototype.statusWidth = function(){return 120;};Window_Options.prototype.statusText = function(index){var symbol=this.commandSymbol(index);var value=this.getConfigValue(symbol);if(this.isVolumeSymbol(symbol)){return this.volumeStatusText(value);}else {return this.booleanStatusText(value);}};Window_Options.prototype.isVolumeSymbol = function(symbol){return symbol.contains('Volume');};Window_Options.prototype.booleanStatusText = function(value){return value?'ON':'OFF';};Window_Options.prototype.volumeStatusText = function(value){return value + '%';};Window_Options.prototype.processOk = function(){var index=this.index();var symbol=this.commandSymbol(index);var value=this.getConfigValue(symbol);if(this.isVolumeSymbol(symbol)){value += this.volumeOffset();if(value > 100){value = 0;}value = value.clamp(0,100);this.changeValue(symbol,value);}else {this.changeValue(symbol,!value);}};Window_Options.prototype.cursorRight = function(wrap){var index=this.index();var symbol=this.commandSymbol(index);var value=this.getConfigValue(symbol);if(this.isVolumeSymbol(symbol)){value += this.volumeOffset();value = value.clamp(0,100);this.changeValue(symbol,value);}else {this.changeValue(symbol,true);}};Window_Options.prototype.cursorLeft = function(wrap){var index=this.index();var symbol=this.commandSymbol(index);var value=this.getConfigValue(symbol);if(this.isVolumeSymbol(symbol)){value -= this.volumeOffset();value = value.clamp(0,100);this.changeValue(symbol,value);}else {this.changeValue(symbol,false);}};Window_Options.prototype.volumeOffset = function(){return 20;};Window_Options.prototype.changeValue = function(symbol,value){var lastValue=this.getConfigValue(symbol);if(lastValue !== value){this.setConfigValue(symbol,value);this.redrawItem(this.findSymbol(symbol));_managers.SoundManager.playCursor();}};Window_Options.prototype.getConfigValue = function(symbol){return _managers.ConfigManager[symbol];};Window_Options.prototype.setConfigValue = function(symbol,volume){_managers.ConfigManager[symbol] = volume;}; //-----------------------------------------------------------------------------
// Window_SavefileList
//
// The window for selecting a save file on the save and load screens.
function Window_SavefileList(){this.initialize.apply(this,arguments);}Window_SavefileList.prototype = Object.create(Window_Selectable.prototype);Window_SavefileList.prototype.constructor = Window_SavefileList;Window_SavefileList.prototype.initialize = function(x,y,width,height){Window_Selectable.prototype.initialize.call(this,x,y,width,height);this.activate();this._mode = null;};Window_SavefileList.prototype.setMode = function(mode){this._mode = mode;};Window_SavefileList.prototype.maxItems = function(){return _managers.DataManager.maxSavefiles();};Window_SavefileList.prototype.maxVisibleItems = function(){return 5;};Window_SavefileList.prototype.itemHeight = function(){var innerHeight=this.height - this.padding * 2;return Math.floor(innerHeight / this.maxVisibleItems());};Window_SavefileList.prototype.drawItem = function(index){var id=index + 1;var valid=_managers.DataManager.isThisGameFile(id);var info=_managers.DataManager.loadSavefileInfo(id);var rect=this.itemRectForText(index);this.resetTextColor();if(this._mode === 'load'){this.changePaintOpacity(valid);}this.drawFileId(id,rect.x,rect.y);if(info){this.changePaintOpacity(valid);this.drawContents(info,rect,valid);this.changePaintOpacity(true);}};Window_SavefileList.prototype.drawFileId = function(id,x,y){this.drawText(_managers.TextManager.file + ' ' + id,x,y,180);};Window_SavefileList.prototype.drawContents = function(info,rect,valid){var bottom=rect.y + rect.height;if(rect.width >= 420){this.drawGameTitle(info,rect.x + 192,rect.y,rect.width - 192);if(valid){this.drawPartyCharacters(info,rect.x + 220,bottom - 4);}}var lineHeight=this.lineHeight();var y2=bottom - lineHeight;if(y2 >= lineHeight){this.drawPlaytime(info,rect.x,y2,rect.width);}};Window_SavefileList.prototype.drawGameTitle = function(info,x,y,width){if(info.title){this.drawText(info.title,x,y,width);}};Window_SavefileList.prototype.drawPartyCharacters = function(info,x,y){if(info.characters){for(var i=0;i < info.characters.length;i++) {var data=info.characters[i];this.drawCharacter(data[0],data[1],x + i * 48,y);}}};Window_SavefileList.prototype.drawPlaytime = function(info,x,y,width){if(info.playtime){this.drawText(info.playtime,x,y,width,'right');}};Window_SavefileList.prototype.playOkSound = function(){}; //-----------------------------------------------------------------------------
// Window_ShopCommand
//
// The window for selecting buy/sell on the shop screen.
function Window_ShopCommand(){this.initialize.apply(this,arguments);}Window_ShopCommand.prototype = Object.create(Window_HorzCommand.prototype);Window_ShopCommand.prototype.constructor = Window_ShopCommand;Window_ShopCommand.prototype.initialize = function(width,purchaseOnly){this._windowWidth = width;this._purchaseOnly = purchaseOnly;Window_HorzCommand.prototype.initialize.call(this,0,0);};Window_ShopCommand.prototype.windowWidth = function(){return this._windowWidth;};Window_ShopCommand.prototype.maxCols = function(){return 3;};Window_ShopCommand.prototype.makeCommandList = function(){this.addCommand(_managers.TextManager.buy,'buy');this.addCommand(_managers.TextManager.sell,'sell',!this._purchaseOnly);this.addCommand(_managers.TextManager.cancel,'cancel');}; //-----------------------------------------------------------------------------
// Window_ShopBuy
//
// The window for selecting an item to buy on the shop screen.
function Window_ShopBuy(){this.initialize.apply(this,arguments);}Window_ShopBuy.prototype = Object.create(Window_Selectable.prototype);Window_ShopBuy.prototype.constructor = Window_ShopBuy;Window_ShopBuy.prototype.initialize = function(x,y,height,shopGoods){var width=this.windowWidth();Window_Selectable.prototype.initialize.call(this,x,y,width,height);this._shopGoods = shopGoods;this._money = 0;this.refresh();this.select(0);};Window_ShopBuy.prototype.windowWidth = function(){return 456;};Window_ShopBuy.prototype.maxItems = function(){return this._data?this._data.length:1;};Window_ShopBuy.prototype.item = function(){return this._data[this.index()];};Window_ShopBuy.prototype.setMoney = function(money){this._money = money;this.refresh();};Window_ShopBuy.prototype.isCurrentItemEnabled = function(){return this.isEnabled(this._data[this.index()]);};Window_ShopBuy.prototype.price = function(item){return this._price[this._data.indexOf(item)] || 0;};Window_ShopBuy.prototype.isEnabled = function(item){return item && this.price(item) <= this._money && !$gameParty.hasMaxItems(item);};Window_ShopBuy.prototype.refresh = function(){this.makeItemList();this.createContents();this.drawAllItems();};Window_ShopBuy.prototype.makeItemList = function(){this._data = [];this._price = [];this._shopGoods.forEach(function(goods){var item=null;switch(goods[0]){case 0:item = $dataItems[goods[1]];break;case 1:item = $dataWeapons[goods[1]];break;case 2:item = $dataArmors[goods[1]];break;}if(item){this._data.push(item);this._price.push(goods[2] === 0?item.price:goods[3]);}},this);};Window_ShopBuy.prototype.drawItem = function(index){var item=this._data[index];var rect=this.itemRect(index);var priceWidth=96;rect.width -= this.textPadding();this.changePaintOpacity(this.isEnabled(item));this.drawItemName(item,rect.x,rect.y,rect.width - priceWidth);this.drawText(this.price(item),rect.x + rect.width - priceWidth,rect.y,priceWidth,'right');this.changePaintOpacity(true);};Window_ShopBuy.prototype.setStatusWindow = function(statusWindow){this._statusWindow = statusWindow;this.callUpdateHelp();};Window_ShopBuy.prototype.updateHelp = function(){this.setHelpWindowItem(this.item());if(this._statusWindow){this._statusWindow.setItem(this.item());}}; //-----------------------------------------------------------------------------
// Window_ShopSell
//
// The window for selecting an item to sell on the shop screen.
function Window_ShopSell(){this.initialize.apply(this,arguments);}Window_ShopSell.prototype = Object.create(Window_ItemList.prototype);Window_ShopSell.prototype.constructor = Window_ShopSell;Window_ShopSell.prototype.initialize = function(x,y,width,height){Window_ItemList.prototype.initialize.call(this,x,y,width,height);};Window_ShopSell.prototype.isEnabled = function(item){return item && item.price > 0;}; //-----------------------------------------------------------------------------
// Window_ShopNumber
//
// The window for inputting quantity of items to buy or sell on the shop
// screen.
function Window_ShopNumber(){this.initialize.apply(this,arguments);}Window_ShopNumber.prototype = Object.create(Window_Selectable.prototype);Window_ShopNumber.prototype.constructor = Window_ShopNumber;Window_ShopNumber.prototype.initialize = function(x,y,height){var width=this.windowWidth();Window_Selectable.prototype.initialize.call(this,x,y,width,height);this._item = null;this._max = 1;this._price = 0;this._number = 1;this._currencyUnit = _managers.TextManager.currencyUnit;this.createButtons();};Window_ShopNumber.prototype.windowWidth = function(){return 456;};Window_ShopNumber.prototype.number = function(){return this._number;};Window_ShopNumber.prototype.setup = function(item,max,price){this._item = item;this._max = Math.floor(max);this._price = price;this._number = 1;this.placeButtons();this.updateButtonsVisiblity();this.refresh();};Window_ShopNumber.prototype.setCurrencyUnit = function(currencyUnit){this._currencyUnit = currencyUnit;this.refresh();};Window_ShopNumber.prototype.createButtons = function(){var bitmap=_managers.ImageManager.loadSystem('ButtonSet');var buttonWidth=48;var buttonHeight=48;this._buttons = [];for(var i=0;i < 5;i++) {var button=new _sprites.Sprite_Button();var x=buttonWidth * i;var w=buttonWidth * (i === 4?2:1);button.bitmap = bitmap;button.setColdFrame(x,0,w,buttonHeight);button.setHotFrame(x,buttonHeight,w,buttonHeight);button.visible = false;this._buttons.push(button);this.addChild(button);}this._buttons[0].setClickHandler(this.onButtonDown2.bind(this));this._buttons[1].setClickHandler(this.onButtonDown.bind(this));this._buttons[2].setClickHandler(this.onButtonUp.bind(this));this._buttons[3].setClickHandler(this.onButtonUp2.bind(this));this._buttons[4].setClickHandler(this.onButtonOk.bind(this));};Window_ShopNumber.prototype.placeButtons = function(){var numButtons=this._buttons.length;var spacing=16;var totalWidth=-spacing;for(var i=0;i < numButtons;i++) {totalWidth += this._buttons[i].width + spacing;}var x=(this.width - totalWidth) / 2;for(var j=0;j < numButtons;j++) {var button=this._buttons[j];button.x = x;button.y = this.buttonY();x += button.width + spacing;}};Window_ShopNumber.prototype.updateButtonsVisiblity = function(){if(_core.TouchInput.date > _core.Input.date){this.showButtons();}else {this.hideButtons();}};Window_ShopNumber.prototype.showButtons = function(){for(var i=0;i < this._buttons.length;i++) {this._buttons[i].visible = true;}};Window_ShopNumber.prototype.hideButtons = function(){for(var i=0;i < this._buttons.length;i++) {this._buttons[i].visible = false;}};Window_ShopNumber.prototype.refresh = function(){this.contents.clear();this.drawItemName(this._item,0,this.itemY());this.drawMultiplicationSign();this.drawNumber();this.drawTotalPrice();};Window_ShopNumber.prototype.drawMultiplicationSign = function(){var sign='×';var width=this.textWidth(sign);var x=this.cursorX() - width * 2;var y=this.itemY();this.resetTextColor();this.drawText(sign,x,y,width);};Window_ShopNumber.prototype.drawNumber = function(){var x=this.cursorX();var y=this.itemY();var width=this.cursorWidth() - this.textPadding();this.resetTextColor();this.drawText(this._number,x,y,width,'right');};Window_ShopNumber.prototype.drawTotalPrice = function(){var total=this._price * this._number;var width=this.contentsWidth() - this.textPadding();this.drawCurrencyValue(total,this._currencyUnit,0,this.priceY(),width);};Window_ShopNumber.prototype.itemY = function(){return Math.round(this.contentsHeight() / 2 - this.lineHeight() * 1.5);};Window_ShopNumber.prototype.priceY = function(){return Math.round(this.contentsHeight() / 2 + this.lineHeight() / 2);};Window_ShopNumber.prototype.buttonY = function(){return Math.round(this.priceY() + this.lineHeight() * 2.5);};Window_ShopNumber.prototype.cursorWidth = function(){var digitWidth=this.textWidth('0');return this.maxDigits() * digitWidth + this.textPadding() * 2;};Window_ShopNumber.prototype.cursorX = function(){return this.contentsWidth() - this.cursorWidth() - this.textPadding();};Window_ShopNumber.prototype.maxDigits = function(){return 2;};Window_ShopNumber.prototype.update = function(){Window_Selectable.prototype.update.call(this);this.processNumberChange();};Window_ShopNumber.prototype.isOkTriggered = function(){return _core.Input.isTriggered('ok');};Window_ShopNumber.prototype.playOkSound = function(){};Window_ShopNumber.prototype.processNumberChange = function(){if(this.isOpenAndActive()){if(_core.Input.isRepeated('right')){this.changeNumber(1);}if(_core.Input.isRepeated('left')){this.changeNumber(-1);}if(_core.Input.isRepeated('up')){this.changeNumber(10);}if(_core.Input.isRepeated('down')){this.changeNumber(-10);}}};Window_ShopNumber.prototype.changeNumber = function(amount){var lastNumber=this._number;this._number = (this._number + amount).clamp(1,this._max);if(this._number !== lastNumber){_managers.SoundManager.playCursor();this.refresh();}};Window_ShopNumber.prototype.updateCursor = function(){this.setCursorRect(this.cursorX(),this.itemY(),this.cursorWidth(),this.lineHeight());};Window_ShopNumber.prototype.onButtonUp = function(){this.changeNumber(1);};Window_ShopNumber.prototype.onButtonUp2 = function(){this.changeNumber(10);};Window_ShopNumber.prototype.onButtonDown = function(){this.changeNumber(-1);};Window_ShopNumber.prototype.onButtonDown2 = function(){this.changeNumber(-10);};Window_ShopNumber.prototype.onButtonOk = function(){this.processOk();}; //-----------------------------------------------------------------------------
// Window_ShopStatus
//
// The window for displaying number of items in possession and the actor's
// equipment on the shop screen.
function Window_ShopStatus(){this.initialize.apply(this,arguments);}Window_ShopStatus.prototype = Object.create(Window_Base.prototype);Window_ShopStatus.prototype.constructor = Window_ShopStatus;Window_ShopStatus.prototype.initialize = function(x,y,width,height){Window_Base.prototype.initialize.call(this,x,y,width,height);this._item = null;this._pageIndex = 0;this.refresh();};Window_ShopStatus.prototype.refresh = function(){this.contents.clear();if(this._item){var x=this.textPadding();this.drawPossession(x,0);if(this.isEquipItem()){this.drawEquipInfo(x,this.lineHeight() * 2);}}};Window_ShopStatus.prototype.setItem = function(item){this._item = item;this.refresh();};Window_ShopStatus.prototype.isEquipItem = function(){return _managers.DataManager.isWeapon(this._item) || _managers.DataManager.isArmor(this._item);};Window_ShopStatus.prototype.drawPossession = function(x,y){var width=this.contents.width - this.textPadding() - x;var possessionWidth=this.textWidth('0000');this.changeTextColor(this.systemColor());this.drawText(_managers.TextManager.possession,x,y,width - possessionWidth);this.resetTextColor();this.drawText($gameParty.numItems(this._item),x,y,width,'right');};Window_ShopStatus.prototype.drawEquipInfo = function(x,y){var members=this.statusMembers();for(var i=0;i < members.length;i++) {this.drawActorEquipInfo(x,y + this.lineHeight() * (i * 2.4),members[i]);}};Window_ShopStatus.prototype.statusMembers = function(){var start=this._pageIndex * this.pageSize();var end=start + this.pageSize();return $gameParty.members().slice(start,end);};Window_ShopStatus.prototype.pageSize = function(){return 4;};Window_ShopStatus.prototype.maxPages = function(){return Math.floor(($gameParty.size() + this.pageSize() - 1) / this.pageSize());};Window_ShopStatus.prototype.drawActorEquipInfo = function(x,y,actor){var enabled=actor.canEquip(this._item);this.changePaintOpacity(enabled);this.resetTextColor();this.drawText(actor.name(),x,y,168);var item1=this.currentEquippedItem(actor,this._item.etypeId);if(enabled){this.drawActorParamChange(x,y,actor,item1);}this.drawItemName(item1,x,y + this.lineHeight());this.changePaintOpacity(true);};Window_ShopStatus.prototype.drawActorParamChange = function(x,y,actor,item1){var width=this.contents.width - this.textPadding() - x;var paramId=this.paramId();var change=this._item.params[paramId] - (item1?item1.params[paramId]:0);this.changeTextColor(this.paramchangeTextColor(change));this.drawText((change > 0?'+':'') + change,x,y,width,'right');};Window_ShopStatus.prototype.paramId = function(){return _managers.DataManager.isWeapon(this._item)?2:3;};Window_ShopStatus.prototype.currentEquippedItem = function(actor,etypeId){var list=[];var equips=actor.equips();var slots=actor.equipSlots();for(var i=0;i < slots.length;i++) {if(slots[i] === etypeId){list.push(equips[i]);}}var paramId=this.paramId();var worstParam=Number.MAX_VALUE;var worstItem=null;for(var j=0;j < list.length;j++) {if(list[j] && list[j].params[paramId] < worstParam){worstParam = list[j].params[paramId];worstItem = list[j];}}return worstItem;};Window_ShopStatus.prototype.update = function(){Window_Base.prototype.update.call(this);this.updatePage();};Window_ShopStatus.prototype.updatePage = function(){if(this.isPageChangeEnabled() && this.isPageChangeRequested()){this.changePage();}};Window_ShopStatus.prototype.isPageChangeEnabled = function(){return this.visible && this.maxPages() >= 2;};Window_ShopStatus.prototype.isPageChangeRequested = function(){if(_core.Input.isTriggered('shift')){return true;}if(_core.TouchInput.isTriggered() && this.isTouchedInsideFrame()){return true;}return false;};Window_ShopStatus.prototype.isTouchedInsideFrame = function(){var x=this.canvasToLocalX(_core.TouchInput.x);var y=this.canvasToLocalY(_core.TouchInput.y);return x >= 0 && y >= 0 && x < this.width && y < this.height;};Window_ShopStatus.prototype.changePage = function(){this._pageIndex = (this._pageIndex + 1) % this.maxPages();this.refresh();_managers.SoundManager.playCursor();}; //-----------------------------------------------------------------------------
// Window_NameEdit
//
// The window for editing an actor's name on the name input screen.
function Window_NameEdit(){this.initialize.apply(this,arguments);}Window_NameEdit.prototype = Object.create(Window_Base.prototype);Window_NameEdit.prototype.constructor = Window_NameEdit;Window_NameEdit.prototype.initialize = function(actor,maxLength){var width=this.windowWidth();var height=this.windowHeight();var x=(_core.Graphics.boxWidth - width) / 2;var y=(_core.Graphics.boxHeight - (height + this.fittingHeight(9) + 8)) / 2;Window_Base.prototype.initialize.call(this,x,y,width,height);this._actor = actor;this._name = actor.name().slice(0,this._maxLength);this._index = this._name.length;this._maxLength = maxLength;this._defaultName = this._name;this.deactivate();this.refresh();_managers.ImageManager.loadFace(actor.faceName());};Window_NameEdit.prototype.windowWidth = function(){return 480;};Window_NameEdit.prototype.windowHeight = function(){return this.fittingHeight(4);};Window_NameEdit.prototype.name = function(){return this._name;};Window_NameEdit.prototype.restoreDefault = function(){this._name = this._defaultName;this._index = this._name.length;this.refresh();return this._name.length > 0;};Window_NameEdit.prototype.add = function(ch){if(this._index < this._maxLength){this._name += ch;this._index++;this.refresh();return true;}else {return false;}};Window_NameEdit.prototype.back = function(){if(this._index > 0){this._index--;this._name = this._name.slice(0,this._index);this.refresh();return true;}else {return false;}};Window_NameEdit.prototype.faceWidth = function(){return 144;};Window_NameEdit.prototype.charWidth = function(){var text=$gameSystem.isJapanese()?'Ａ':'A';return this.textWidth(text);};Window_NameEdit.prototype.left = function(){var nameCenter=(this.contentsWidth() + this.faceWidth()) / 2;var nameWidth=(this._maxLength + 1) * this.charWidth();return Math.min(nameCenter - nameWidth / 2,this.contentsWidth() - nameWidth);};Window_NameEdit.prototype.itemRect = function(index){return {x:this.left() + index * this.charWidth(),y:54,width:this.charWidth(),height:this.lineHeight()};};Window_NameEdit.prototype.underlineRect = function(index){var rect=this.itemRect(index);rect.x++;rect.y += rect.height - 4;rect.width -= 2;rect.height = 2;return rect;};Window_NameEdit.prototype.underlineColor = function(){return this.normalColor();};Window_NameEdit.prototype.drawUnderline = function(index){var rect=this.underlineRect(index);var color=this.underlineColor();this.contents.paintOpacity = 48;this.contents.fillRect(rect.x,rect.y,rect.width,rect.height,color);this.contents.paintOpacity = 255;};Window_NameEdit.prototype.drawChar = function(index){var rect=this.itemRect(index);this.resetTextColor();this.drawText(this._name[index] || '',rect.x,rect.y);};Window_NameEdit.prototype.refresh = function(){this.contents.clear();this.drawActorFace(this._actor,0,0);for(var i=0;i < this._maxLength;i++) {this.drawUnderline(i);}for(var j=0;j < this._name.length;j++) {this.drawChar(j);}var rect=this.itemRect(this._index);this.setCursorRect(rect.x,rect.y,rect.width,rect.height);}; //-----------------------------------------------------------------------------
// Window_NameInput
//
// The window for selecting text characters on the name input screen.
function Window_NameInput(){this.initialize.apply(this,arguments);}Window_NameInput.prototype = Object.create(Window_Selectable.prototype);Window_NameInput.prototype.constructor = Window_NameInput;Window_NameInput.LATIN1 = ['A','B','C','D','E','a','b','c','d','e','F','G','H','I','J','f','g','h','i','j','K','L','M','N','O','k','l','m','n','o','P','Q','R','S','T','p','q','r','s','t','U','V','W','X','Y','u','v','w','x','y','Z','[',']','^','_','z','{','}','|','~','0','1','2','3','4','!','#','$','%','&','5','6','7','8','9','(',')','*','+','-','/','=','@','<','>',':',';',' ','Page','OK'];Window_NameInput.LATIN2 = ['Á','É','Í','Ó','Ú','á','é','í','ó','ú','À','È','Ì','Ò','Ù','à','è','ì','ò','ù','Â','Ê','Î','Ô','Û','â','ê','î','ô','û','Ä','Ë','Ï','Ö','Ü','ä','ë','ï','ö','ü','Ā','Ē','Ī','Ō','Ū','ā','ē','ī','ō','ū','Ã','Å','Æ','Ç','Ð','ã','å','æ','ç','ð','Ñ','Õ','Ø','Š','Ŵ','ñ','õ','ø','š','ŵ','Ý','Ŷ','Ÿ','Ž','Þ','ý','ÿ','ŷ','ž','þ','Ĳ','Œ','ĳ','œ','ß','«','»',' ','Page','OK'];Window_NameInput.RUSSIA = ['А','Б','В','Г','Д','а','б','в','г','д','Е','Ё','Ж','З','И','е','ё','ж','з','и','Й','К','Л','М','Н','й','к','л','м','н','О','П','Р','С','Т','о','п','р','с','т','У','Ф','Х','Ц','Ч','у','ф','х','ц','ч','Ш','Щ','Ъ','Ы','Ь','ш','щ','ъ','ы','ь','Э','Ю','Я','^','_','э','ю','я','%','&','0','1','2','3','4','(',')','*','+','-','5','6','7','8','9',':',';',' ','','OK'];Window_NameInput.JAPAN1 = ['あ','い','う','え','お','が','ぎ','ぐ','げ','ご','か','き','く','け','こ','ざ','じ','ず','ぜ','ぞ','さ','し','す','せ','そ','だ','ぢ','づ','で','ど','た','ち','つ','て','と','ば','び','ぶ','べ','ぼ','な','に','ぬ','ね','の','ぱ','ぴ','ぷ','ぺ','ぽ','は','ひ','ふ','へ','ほ','ぁ','ぃ','ぅ','ぇ','ぉ','ま','み','む','め','も','っ','ゃ','ゅ','ょ','ゎ','や','ゆ','よ','わ','ん','ー','～','・','＝','☆','ら','り','る','れ','ろ','ゔ','を','　','カナ','決定'];Window_NameInput.JAPAN2 = ['ア','イ','ウ','エ','オ','ガ','ギ','グ','ゲ','ゴ','カ','キ','ク','ケ','コ','ザ','ジ','ズ','ゼ','ゾ','サ','シ','ス','セ','ソ','ダ','ヂ','ヅ','デ','ド','タ','チ','ツ','テ','ト','バ','ビ','ブ','ベ','ボ','ナ','ニ','ヌ','ネ','ノ','パ','ピ','プ','ペ','ポ','ハ','ヒ','フ','ヘ','ホ','ァ','ィ','ゥ','ェ','ォ','マ','ミ','ム','メ','モ','ッ','ャ','ュ','ョ','ヮ','ヤ','ユ','ヨ','ワ','ン','ー','～','・','＝','☆','ラ','リ','ル','レ','ロ','ヴ','ヲ','　','英数','決定'];Window_NameInput.JAPAN3 = ['Ａ','Ｂ','Ｃ','Ｄ','Ｅ','ａ','ｂ','ｃ','ｄ','ｅ','Ｆ','Ｇ','Ｈ','Ｉ','Ｊ','ｆ','ｇ','ｈ','ｉ','ｊ','Ｋ','Ｌ','Ｍ','Ｎ','Ｏ','ｋ','ｌ','ｍ','ｎ','ｏ','Ｐ','Ｑ','Ｒ','Ｓ','Ｔ','ｐ','ｑ','ｒ','ｓ','ｔ','Ｕ','Ｖ','Ｗ','Ｘ','Ｙ','ｕ','ｖ','ｗ','ｘ','ｙ','Ｚ','［','］','＾','＿','ｚ','｛','｝','｜','～','０','１','２','３','４','！','＃','＄','％','＆','５','６','７','８','９','（','）','＊','＋','－','／','＝','＠','＜','＞','：','；','　','かな','決定'];Window_NameInput.prototype.initialize = function(editWindow){var x=editWindow.x;var y=editWindow.y + editWindow.height + 8;var width=editWindow.width;var height=this.windowHeight();Window_Selectable.prototype.initialize.call(this,x,y,width,height);this._editWindow = editWindow;this._page = 0;this._index = 0;this.refresh();this.updateCursor();this.activate();};Window_NameInput.prototype.windowHeight = function(){return this.fittingHeight(9);};Window_NameInput.prototype.table = function(){if($gameSystem.isJapanese()){return [Window_NameInput.JAPAN1,Window_NameInput.JAPAN2,Window_NameInput.JAPAN3];}else if($gameSystem.isRussian()){return [Window_NameInput.RUSSIA];}else {return [Window_NameInput.LATIN1,Window_NameInput.LATIN2];}};Window_NameInput.prototype.maxCols = function(){return 10;};Window_NameInput.prototype.maxItems = function(){return 90;};Window_NameInput.prototype.character = function(){return this._index < 88?this.table()[this._page][this._index]:'';};Window_NameInput.prototype.isPageChange = function(){return this._index === 88;};Window_NameInput.prototype.isOk = function(){return this._index === 89;};Window_NameInput.prototype.itemRect = function(index){return {x:index % 10 * 42 + Math.floor(index % 10 / 5) * 24,y:Math.floor(index / 10) * this.lineHeight(),width:42,height:this.lineHeight()};};Window_NameInput.prototype.refresh = function(){var table=this.table();this.contents.clear();this.resetTextColor();for(var i=0;i < 90;i++) {var rect=this.itemRect(i);rect.x += 3;rect.width -= 6;this.drawText(table[this._page][i],rect.x,rect.y,rect.width,'center');}};Window_NameInput.prototype.updateCursor = function(){var rect=this.itemRect(this._index);this.setCursorRect(rect.x,rect.y,rect.width,rect.height);};Window_NameInput.prototype.isCursorMovable = function(){return this.active;};Window_NameInput.prototype.cursorDown = function(wrap){if(this._index < 80 || wrap){this._index = (this._index + 10) % 90;}};Window_NameInput.prototype.cursorUp = function(wrap){if(this._index >= 10 || wrap){this._index = (this._index + 80) % 90;}};Window_NameInput.prototype.cursorRight = function(wrap){if(this._index % 10 < 9){this._index++;}else if(wrap){this._index -= 9;}};Window_NameInput.prototype.cursorLeft = function(wrap){if(this._index % 10 > 0){this._index--;}else if(wrap){this._index += 9;}};Window_NameInput.prototype.cursorPagedown = function(){this._page = (this._page + 1) % this.table().length;this.refresh();};Window_NameInput.prototype.cursorPageup = function(){this._page = (this._page + this.table().length - 1) % this.table().length;this.refresh();};Window_NameInput.prototype.processCursorMove = function(){var lastPage=this._page;Window_Selectable.prototype.processCursorMove.call(this);this.updateCursor();if(this._page !== lastPage){_managers.SoundManager.playCursor();}};Window_NameInput.prototype.processHandling = function(){if(this.isOpen() && this.active){if(_core.Input.isTriggered('shift')){this.processJump();}if(_core.Input.isRepeated('cancel')){this.processBack();}if(_core.Input.isRepeated('ok')){this.processOk();}}};Window_NameInput.prototype.isCancelEnabled = function(){return true;};Window_NameInput.prototype.processCancel = function(){this.processBack();};Window_NameInput.prototype.processJump = function(){if(this._index !== 89){this._index = 89;_managers.SoundManager.playCursor();}};Window_NameInput.prototype.processBack = function(){if(this._editWindow.back()){_managers.SoundManager.playCancel();}};Window_NameInput.prototype.processOk = function(){if(this.character()){this.onNameAdd();}else if(this.isPageChange()){_managers.SoundManager.playOk();this.cursorPagedown();}else if(this.isOk()){this.onNameOk();}};Window_NameInput.prototype.onNameAdd = function(){if(this._editWindow.add(this.character())){_managers.SoundManager.playOk();}else {_managers.SoundManager.playBuzzer();}};Window_NameInput.prototype.onNameOk = function(){if(this._editWindow.name() === ''){if(this._editWindow.restoreDefault()){_managers.SoundManager.playOk();}else {_managers.SoundManager.playBuzzer();}}else {_managers.SoundManager.playOk();this.callOkHandler();}}; //-----------------------------------------------------------------------------
// Window_ChoiceList
//
// The window used for the event command [Show Choices].
function Window_ChoiceList(){this.initialize.apply(this,arguments);}Window_ChoiceList.prototype = Object.create(Window_Command.prototype);Window_ChoiceList.prototype.constructor = Window_ChoiceList;Window_ChoiceList.prototype.initialize = function(messageWindow){this._messageWindow = messageWindow;Window_Command.prototype.initialize.call(this,0,0);this.openness = 0;this.deactivate();this._background = 0;};Window_ChoiceList.prototype.start = function(){this.updatePlacement();this.updateBackground();this.refresh();this.selectDefault();this.open();this.activate();};Window_ChoiceList.prototype.selectDefault = function(){this.select($gameMessage.choiceDefaultType());};Window_ChoiceList.prototype.updatePlacement = function(){var positionType=$gameMessage.choicePositionType();var messageY=this._messageWindow.y;this.width = this.windowWidth();this.height = this.windowHeight();switch(positionType){case 0:this.x = 0;break;case 1:this.x = (_core.Graphics.boxWidth - this.width) / 2;break;case 2:this.x = _core.Graphics.boxWidth - this.width;break;}if(messageY >= _core.Graphics.boxHeight / 2){this.y = messageY - this.height;}else {this.y = messageY + this._messageWindow.height;}};Window_ChoiceList.prototype.updateBackground = function(){this._background = $gameMessage.choiceBackground();this.setBackgroundType(this._background);};Window_ChoiceList.prototype.windowWidth = function(){var width=this.maxChoiceWidth() + this.padding * 2;return Math.min(width,_core.Graphics.boxWidth);};Window_ChoiceList.prototype.numVisibleRows = function(){var messageY=this._messageWindow.y;var messageHeight=this._messageWindow.height;var centerY=_core.Graphics.boxHeight / 2;var choices=$gameMessage.choices();var numLines=choices.length;var maxLines=8;if(messageY < centerY && messageY + messageHeight > centerY){maxLines = 4;}if(numLines > maxLines){numLines = maxLines;}return numLines;};Window_ChoiceList.prototype.maxChoiceWidth = function(){var maxWidth=96;var choices=$gameMessage.choices();for(var i=0;i < choices.length;i++) {var choiceWidth=this.textWidthEx(choices[i]) + this.textPadding() * 2;if(maxWidth < choiceWidth){maxWidth = choiceWidth;}}return maxWidth;};Window_ChoiceList.prototype.textWidthEx = function(text){return this.drawTextEx(text,0,this.contents.height);};Window_ChoiceList.prototype.contentsHeight = function(){return this.maxItems() * this.itemHeight();};Window_ChoiceList.prototype.makeCommandList = function(){var choices=$gameMessage.choices();for(var i=0;i < choices.length;i++) {this.addCommand(choices[i],'choice');}};Window_ChoiceList.prototype.drawItem = function(index){var rect=this.itemRectForText(index);this.drawTextEx(this.commandName(index),rect.x,rect.y);};Window_ChoiceList.prototype.isCancelEnabled = function(){return $gameMessage.choiceCancelType() !== -1;};Window_ChoiceList.prototype.isOkTriggered = function(){return _core.Input.isTriggered('ok');};Window_ChoiceList.prototype.callOkHandler = function(){$gameMessage.onChoice(this.index());this._messageWindow.terminateMessage();this.close();};Window_ChoiceList.prototype.callCancelHandler = function(){$gameMessage.onChoice($gameMessage.choiceCancelType());this._messageWindow.terminateMessage();this.close();}; //-----------------------------------------------------------------------------
// Window_NumberInput
//
// The window used for the event command [Input Number].
function Window_NumberInput(){this.initialize.apply(this,arguments);}Window_NumberInput.prototype = Object.create(Window_Selectable.prototype);Window_NumberInput.prototype.constructor = Window_NumberInput;Window_NumberInput.prototype.initialize = function(messageWindow){this._messageWindow = messageWindow;Window_Selectable.prototype.initialize.call(this,0,0,0,0);this._number = 0;this._maxDigits = 1;this.openness = 0;this.createButtons();this.deactivate();};Window_NumberInput.prototype.start = function(){this._maxDigits = $gameMessage.numInputMaxDigits();this._number = $gameVariables.value($gameMessage.numInputVariableId());this._number = this._number.clamp(0,Math.pow(10,this._maxDigits) - 1);this.updatePlacement();this.placeButtons();this.updateButtonsVisiblity();this.createContents();this.refresh();this.open();this.activate();this.select(0);};Window_NumberInput.prototype.updatePlacement = function(){var messageY=this._messageWindow.y;var spacing=8;this.width = this.windowWidth();this.height = this.windowHeight();this.x = (_core.Graphics.boxWidth - this.width) / 2;if(messageY >= _core.Graphics.boxHeight / 2){this.y = messageY - this.height - spacing;}else {this.y = messageY + this._messageWindow.height + spacing;}};Window_NumberInput.prototype.windowWidth = function(){return this.maxCols() * this.itemWidth() + this.padding * 2;};Window_NumberInput.prototype.windowHeight = function(){return this.fittingHeight(1);};Window_NumberInput.prototype.maxCols = function(){return this._maxDigits;};Window_NumberInput.prototype.maxItems = function(){return this._maxDigits;};Window_NumberInput.prototype.spacing = function(){return 0;};Window_NumberInput.prototype.itemWidth = function(){return 32;};Window_NumberInput.prototype.createButtons = function(){var bitmap=_managers.ImageManager.loadSystem('ButtonSet');var buttonWidth=48;var buttonHeight=48;this._buttons = [];for(var i=0;i < 3;i++) {var button=new _sprites.Sprite_Button();var x=buttonWidth * [1,2,4][i];var w=buttonWidth * (i === 2?2:1);button.bitmap = bitmap;button.setColdFrame(x,0,w,buttonHeight);button.setHotFrame(x,buttonHeight,w,buttonHeight);button.visible = false;this._buttons.push(button);this.addChild(button);}this._buttons[0].setClickHandler(this.onButtonDown.bind(this));this._buttons[1].setClickHandler(this.onButtonUp.bind(this));this._buttons[2].setClickHandler(this.onButtonOk.bind(this));};Window_NumberInput.prototype.placeButtons = function(){var numButtons=this._buttons.length;var spacing=16;var totalWidth=-spacing;for(var i=0;i < numButtons;i++) {totalWidth += this._buttons[i].width + spacing;}var x=(this.width - totalWidth) / 2;for(var j=0;j < numButtons;j++) {var button=this._buttons[j];button.x = x;button.y = this.buttonY();x += button.width + spacing;}};Window_NumberInput.prototype.updateButtonsVisiblity = function(){if(_core.TouchInput.date > _core.Input.date){this.showButtons();}else {this.hideButtons();}};Window_NumberInput.prototype.showButtons = function(){for(var i=0;i < this._buttons.length;i++) {this._buttons[i].visible = true;}};Window_NumberInput.prototype.hideButtons = function(){for(var i=0;i < this._buttons.length;i++) {this._buttons[i].visible = false;}};Window_NumberInput.prototype.buttonY = function(){var spacing=8;if(this._messageWindow.y >= _core.Graphics.boxHeight / 2){return 0 - this._buttons[0].height - spacing;}else {return this.height + spacing;}};Window_NumberInput.prototype.update = function(){Window_Selectable.prototype.update.call(this);this.processDigitChange();};Window_NumberInput.prototype.processDigitChange = function(){if(this.isOpenAndActive()){if(_core.Input.isRepeated('up')){this.changeDigit(true);}else if(_core.Input.isRepeated('down')){this.changeDigit(false);}}};Window_NumberInput.prototype.changeDigit = function(up){var index=this.index();var place=Math.pow(10,this._maxDigits - 1 - index);var n=Math.floor(this._number / place) % 10;this._number -= n * place;if(up){n = (n + 1) % 10;}else {n = (n + 9) % 10;}this._number += n * place;this.refresh();_managers.SoundManager.playCursor();};Window_NumberInput.prototype.isTouchOkEnabled = function(){return false;};Window_NumberInput.prototype.isOkEnabled = function(){return true;};Window_NumberInput.prototype.isCancelEnabled = function(){return false;};Window_NumberInput.prototype.isOkTriggered = function(){return _core.Input.isTriggered('ok');};Window_NumberInput.prototype.processOk = function(){_managers.SoundManager.playOk();$gameVariables.setValue($gameMessage.numInputVariableId(),this._number);this._messageWindow.terminateMessage();this.updateInputData();this.deactivate();this.close();};Window_NumberInput.prototype.drawItem = function(index){var rect=this.itemRect(index);var align='center';var s=this._number.padZero(this._maxDigits);var c=s.slice(index,index + 1);this.resetTextColor();this.drawText(c,rect.x,rect.y,rect.width,align);};Window_NumberInput.prototype.onButtonUp = function(){this.changeDigit(true);};Window_NumberInput.prototype.onButtonDown = function(){this.changeDigit(false);};Window_NumberInput.prototype.onButtonOk = function(){this.processOk();this.hideButtons();}; //-----------------------------------------------------------------------------
// Window_EventItem
//
// The window used for the event command [Select Item].
function Window_EventItem(){this.initialize.apply(this,arguments);}Window_EventItem.prototype = Object.create(Window_ItemList.prototype);Window_EventItem.prototype.constructor = Window_EventItem;Window_EventItem.prototype.initialize = function(messageWindow){this._messageWindow = messageWindow;var width=_core.Graphics.boxWidth;var height=this.windowHeight();Window_ItemList.prototype.initialize.call(this,0,0,width,height);this.openness = 0;this.deactivate();this.setHandler('ok',this.onOk.bind(this));this.setHandler('cancel',this.onCancel.bind(this));};Window_EventItem.prototype.windowHeight = function(){return this.fittingHeight(this.numVisibleRows());};Window_EventItem.prototype.numVisibleRows = function(){return 4;};Window_EventItem.prototype.start = function(){this.refresh();this.updatePlacement();this.select(0);this.open();this.activate();};Window_EventItem.prototype.updatePlacement = function(){if(this._messageWindow.y >= _core.Graphics.boxHeight / 2){this.y = 0;}else {this.y = _core.Graphics.boxHeight - this.height;}};Window_EventItem.prototype.includes = function(item){var itypeId=$gameMessage.itemChoiceItypeId();return _managers.DataManager.isItem(item) && item.itypeId === itypeId;};Window_EventItem.prototype.isEnabled = function(item){return true;};Window_EventItem.prototype.onOk = function(){var item=this.item();var itemId=item?item.id:0;$gameVariables.setValue($gameMessage.itemChoiceVariableId(),itemId);this._messageWindow.terminateMessage();this.close();};Window_EventItem.prototype.onCancel = function(){$gameVariables.setValue($gameMessage.itemChoiceVariableId(),0);this._messageWindow.terminateMessage();this.close();}; //-----------------------------------------------------------------------------
// Window_Message
//
// The window for displaying text messages.
function Window_Message(){this.initialize.apply(this,arguments);}Window_Message.prototype = Object.create(Window_Base.prototype);Window_Message.prototype.constructor = Window_Message;Window_Message.prototype.initialize = function(){var width=this.windowWidth();var height=this.windowHeight();var x=(_core.Graphics.boxWidth - width) / 2;Window_Base.prototype.initialize.call(this,x,0,width,height);this.openness = 0;this.initMembers();this.createSubWindows();this.updatePlacement();};Window_Message.prototype.initMembers = function(){this._background = 0;this._positionType = 2;this._waitCount = 0;this._faceBitmap = null;this._textState = null;this.clearFlags();};Window_Message.prototype.subWindows = function(){return [this._goldWindow,this._choiceWindow,this._numberWindow,this._itemWindow];};Window_Message.prototype.createSubWindows = function(){this._goldWindow = new Window_Gold(0,0);this._goldWindow.x = _core.Graphics.boxWidth - this._goldWindow.width;this._goldWindow.openness = 0;this._choiceWindow = new Window_ChoiceList(this);this._numberWindow = new Window_NumberInput(this);this._itemWindow = new Window_EventItem(this);};Window_Message.prototype.windowWidth = function(){return _core.Graphics.boxWidth;};Window_Message.prototype.windowHeight = function(){return this.fittingHeight(this.numVisibleRows());};Window_Message.prototype.clearFlags = function(){this._showFast = false;this._lineShowFast = false;this._pauseSkip = false;};Window_Message.prototype.numVisibleRows = function(){return 4;};Window_Message.prototype.update = function(){this.checkToNotClose();Window_Base.prototype.update.call(this);while(!this.isOpening() && !this.isClosing()) {if(this.updateWait()){return;}else if(this.updateLoading()){return;}else if(this.updateInput()){return;}else if(this.updateMessage()){return;}else if(this.canStart()){this.startMessage();}else {this.startInput();return;}}};Window_Message.prototype.checkToNotClose = function(){if(this.isClosing() && this.isOpen()){if(this.doesContinue()){this.open();}}};Window_Message.prototype.canStart = function(){return $gameMessage.hasText() && !$gameMessage.scrollMode();};Window_Message.prototype.startMessage = function(){this._textState = {};this._textState.index = 0;this._textState.text = this.convertEscapeCharacters($gameMessage.allText());this.newPage(this._textState);this.updatePlacement();this.updateBackground();this.open();};Window_Message.prototype.updatePlacement = function(){this._positionType = $gameMessage.positionType();this.y = this._positionType * (_core.Graphics.boxHeight - this.height) / 2;this._goldWindow.y = this.y > 0?0:_core.Graphics.boxHeight - this._goldWindow.height;};Window_Message.prototype.updateBackground = function(){this._background = $gameMessage.background();this.setBackgroundType(this._background);};Window_Message.prototype.terminateMessage = function(){this.close();this._goldWindow.close();$gameMessage.clear();};Window_Message.prototype.updateWait = function(){if(this._waitCount > 0){this._waitCount--;return true;}else {return false;}};Window_Message.prototype.updateLoading = function(){if(this._faceBitmap){if(_managers.ImageManager.isReady()){this.drawMessageFace();this._faceBitmap = null;return false;}else {return true;}}else {return false;}};Window_Message.prototype.updateInput = function(){if(this.isAnySubWindowActive()){return true;}if(this.pause){if(this.isTriggered()){_core.Input.update();this.pause = false;if(!this._textState){this.terminateMessage();}}return true;}return false;};Window_Message.prototype.isAnySubWindowActive = function(){return this._choiceWindow.active || this._numberWindow.active || this._itemWindow.active;};Window_Message.prototype.updateMessage = function(){if(this._textState){while(!this.isEndOfText(this._textState)) {if(this.needsNewPage(this._textState)){this.newPage(this._textState);}this.updateShowFast();this.processCharacter(this._textState);if(!this._showFast && !this._lineShowFast){break;}if(this.pause || this._waitCount > 0){break;}}if(this.isEndOfText(this._textState)){this.onEndOfText();}return true;}else {return false;}};Window_Message.prototype.onEndOfText = function(){if(!this.startInput()){if(!this._pauseSkip){this.startPause();}else {this.terminateMessage();}}this._textState = null;};Window_Message.prototype.startInput = function(){if($gameMessage.isChoice()){this._choiceWindow.start();return true;}else if($gameMessage.isNumberInput()){this._numberWindow.start();return true;}else if($gameMessage.isItemChoice()){this._itemWindow.start();return true;}else {return false;}};Window_Message.prototype.isTriggered = function(){return _core.Input.isRepeated('ok') || _core.Input.isRepeated('cancel') || _core.TouchInput.isRepeated();};Window_Message.prototype.doesContinue = function(){return $gameMessage.hasText() && !$gameMessage.scrollMode() && !this.areSettingsChanged();};Window_Message.prototype.areSettingsChanged = function(){return this._background !== $gameMessage.background() || this._positionType !== $gameMessage.positionType();};Window_Message.prototype.updateShowFast = function(){if(this.isTriggered()){this._showFast = true;}};Window_Message.prototype.newPage = function(textState){this.contents.clear();this.resetFontSettings();this.clearFlags();this.loadMessageFace();textState.x = this.newLineX();textState.y = 0;textState.left = this.newLineX();textState.height = this.calcTextHeight(textState,false);};Window_Message.prototype.loadMessageFace = function(){this._faceBitmap = _managers.ImageManager.loadFace($gameMessage.faceName());};Window_Message.prototype.drawMessageFace = function(){this.drawFace($gameMessage.faceName(),$gameMessage.faceIndex(),0,0);};Window_Message.prototype.newLineX = function(){return $gameMessage.faceName() === ''?0:168;};Window_Message.prototype.processNewLine = function(textState){this._lineShowFast = false;Window_Base.prototype.processNewLine.call(this,textState);if(this.needsNewPage(textState)){this.startPause();}};Window_Message.prototype.processNewPage = function(textState){Window_Base.prototype.processNewPage.call(this,textState);if(textState.text[textState.index] === '\n'){textState.index++;}textState.y = this.contents.height;this.startPause();};Window_Message.prototype.isEndOfText = function(textState){return textState.index >= textState.text.length;};Window_Message.prototype.needsNewPage = function(textState){return !this.isEndOfText(textState) && textState.y + textState.height > this.contents.height;};Window_Message.prototype.processEscapeCharacter = function(code,textState){switch(code){case '$':this._goldWindow.open();break;case '.':this.startWait(15);break;case '|':this.startWait(60);break;case '!':this.startPause();break;case '>':this._lineShowFast = true;break;case '<':this._lineShowFast = false;break;case '^':this._pauseSkip = true;break;default:Window_Base.prototype.processEscapeCharacter.call(this,code,textState);break;}};Window_Message.prototype.startWait = function(count){this._waitCount = count;};Window_Message.prototype.startPause = function(){this.startWait(10);this.pause = true;}; //-----------------------------------------------------------------------------
// Window_ScrollText
//
// The window for displaying scrolling text. No frame is displayed, but it
// is handled as a window for convenience.
function Window_ScrollText(){this.initialize.apply(this,arguments);}Window_ScrollText.prototype = Object.create(Window_Base.prototype);Window_ScrollText.prototype.constructor = Window_ScrollText;Window_ScrollText.prototype.initialize = function(){var width=_core.Graphics.boxWidth;var height=_core.Graphics.boxHeight;Window_Base.prototype.initialize.call(this,0,0,width,height);this.opacity = 0;this.hide();this._text = '';this._allTextHeight = 0;};Window_ScrollText.prototype.update = function(){Window_Base.prototype.update.call(this);if($gameMessage.scrollMode()){if(this._text){this.updateMessage();}if(!this._text && $gameMessage.hasText()){this.startMessage();}}};Window_ScrollText.prototype.startMessage = function(){this._text = $gameMessage.allText();this.refresh();this.show();};Window_ScrollText.prototype.refresh = function(){var textState={index:0};textState.text = this.convertEscapeCharacters(this._text);this.resetFontSettings();this._allTextHeight = this.calcTextHeight(textState,true);this.createContents();this.origin.y = -this.height;this.drawTextEx(this._text,this.textPadding(),1);};Window_ScrollText.prototype.contentsHeight = function(){return Math.max(this._allTextHeight,1);};Window_ScrollText.prototype.updateMessage = function(){this.origin.y += this.scrollSpeed();if(this.origin.y >= this.contents.height){this.terminateMessage();}};Window_ScrollText.prototype.scrollSpeed = function(){var speed=$gameMessage.scrollSpeed() / 2;if(this.isFastForward()){speed *= this.fastForwardRate();}return speed;};Window_ScrollText.prototype.isFastForward = function(){if($gameMessage.scrollNoFast()){return false;}else {return _core.Input.isPressed('ok') || _core.Input.isPressed('shift') || _core.TouchInput.isPressed();}};Window_ScrollText.prototype.fastForwardRate = function(){return 3;};Window_ScrollText.prototype.terminateMessage = function(){this._text = null;$gameMessage.clear();this.hide();}; //-----------------------------------------------------------------------------
// Window_MapName
//
// The window for displaying the map name on the map screen.
function Window_MapName(){this.initialize.apply(this,arguments);}Window_MapName.prototype = Object.create(Window_Base.prototype);Window_MapName.prototype.constructor = Window_MapName;Window_MapName.prototype.initialize = function(){var wight=this.windowWidth();var height=this.windowHeight();Window_Base.prototype.initialize.call(this,0,0,wight,height);this.opacity = 0;this.contentsOpacity = 0;this._showCount = 0;this.refresh();};Window_MapName.prototype.windowWidth = function(){return 360;};Window_MapName.prototype.windowHeight = function(){return this.fittingHeight(1);};Window_MapName.prototype.update = function(){Window_Base.prototype.update.call(this);if(this._showCount > 0 && $gameMap.isNameDisplayEnabled()){this.updateFadeIn();this._showCount--;}else {this.updateFadeOut();}};Window_MapName.prototype.updateFadeIn = function(){this.contentsOpacity += 16;};Window_MapName.prototype.updateFadeOut = function(){this.contentsOpacity -= 16;};Window_MapName.prototype.open = function(){this.refresh();this._showCount = 150;};Window_MapName.prototype.close = function(){this._showCount = 0;};Window_MapName.prototype.refresh = function(){this.contents.clear();if($gameMap.displayName()){var width=this.contentsWidth();this.drawBackground(0,0,width,this.lineHeight());this.drawText($gameMap.displayName(),0,0,width,'center');}};Window_MapName.prototype.drawBackground = function(x,y,width,height){var color1=this.dimColor1();var color2=this.dimColor2();this.contents.gradientFillRect(x,y,width / 2,height,color2,color1);this.contents.gradientFillRect(x + width / 2,y,width / 2,height,color1,color2);}; //-----------------------------------------------------------------------------
// Window_BattleLog
//
// The window for displaying battle progress. No frame is displayed, but it is
// handled as a window for convenience.
function Window_BattleLog(){this.initialize.apply(this,arguments);}Window_BattleLog.prototype = Object.create(Window_Selectable.prototype);Window_BattleLog.prototype.constructor = Window_BattleLog;Window_BattleLog.prototype.initialize = function(){var width=this.windowWidth();var height=this.windowHeight();Window_Selectable.prototype.initialize.call(this,0,0,width,height);this.opacity = 0;this._lines = [];this._methods = [];this._waitCount = 0;this._waitMode = '';this._baseLineStack = [];this._spriteset = null;this.createBackBitmap();this.createBackSprite();this.refresh();};Window_BattleLog.prototype.setSpriteset = function(spriteset){this._spriteset = spriteset;};Window_BattleLog.prototype.windowWidth = function(){return _core.Graphics.boxWidth;};Window_BattleLog.prototype.windowHeight = function(){return this.fittingHeight(this.maxLines());};Window_BattleLog.prototype.maxLines = function(){return 10;};Window_BattleLog.prototype.createBackBitmap = function(){this._backBitmap = new _core.Bitmap(this.width,this.height);};Window_BattleLog.prototype.createBackSprite = function(){this._backSprite = new Sprite();this._backSprite.bitmap = this._backBitmap;this._backSprite.y = this.y;this.addChildToBack(this._backSprite);};Window_BattleLog.prototype.numLines = function(){return this._lines.length;};Window_BattleLog.prototype.messageSpeed = function(){return 16;};Window_BattleLog.prototype.isBusy = function(){return this._waitCount > 0 || this._waitMode || this._methods.length > 0;};Window_BattleLog.prototype.update = function(){if(!this.updateWait()){this.callNextMethod();}};Window_BattleLog.prototype.updateWait = function(){return this.updateWaitCount() || this.updateWaitMode();};Window_BattleLog.prototype.updateWaitCount = function(){if(this._waitCount > 0){this._waitCount -= this.isFastForward()?3:1;if(this._waitCount < 0){this._waitCount = 0;}return true;}return false;};Window_BattleLog.prototype.updateWaitMode = function(){var waiting=false;switch(this._waitMode){case 'effect':waiting = this._spriteset.isEffecting();break;case 'movement':waiting = this._spriteset.isAnyoneMoving();break;}if(!waiting){this._waitMode = '';}return waiting;};Window_BattleLog.prototype.setWaitMode = function(waitMode){this._waitMode = waitMode;};Window_BattleLog.prototype.callNextMethod = function(){if(this._methods.length > 0){var method=this._methods.shift();if(method.name && this[method.name]){this[method.name].apply(this,method.params);}else {throw new Error('Method not found: ' + method.name);}}};Window_BattleLog.prototype.isFastForward = function(){return _core.Input.isLongPressed('ok') || _core.Input.isPressed('shift') || _core.TouchInput.isLongPressed();};Window_BattleLog.prototype.push = function(methodName){var methodArgs=Array.prototype.slice.call(arguments,1);this._methods.push({name:methodName,params:methodArgs});};Window_BattleLog.prototype.clear = function(){this._lines = [];this._baseLineStack = [];this.refresh();};Window_BattleLog.prototype.wait = function(){this._waitCount = this.messageSpeed();};Window_BattleLog.prototype.waitForEffect = function(){this.setWaitMode('effect');};Window_BattleLog.prototype.waitForMovement = function(){this.setWaitMode('movement');};Window_BattleLog.prototype.addText = function(text){this._lines.push(text);this.refresh();this.wait();};Window_BattleLog.prototype.pushBaseLine = function(){this._baseLineStack.push(this._lines.length);};Window_BattleLog.prototype.popBaseLine = function(){var baseLine=this._baseLineStack.pop();while(this._lines.length > baseLine) {this._lines.pop();}};Window_BattleLog.prototype.waitForNewLine = function(){var baseLine=0;if(this._baseLineStack.length > 0){baseLine = this._baseLineStack[this._baseLineStack.length - 1];}if(this._lines.length > baseLine){this.wait();}};Window_BattleLog.prototype.popupDamage = function(target){target.startDamagePopup();};Window_BattleLog.prototype.performActionStart = function(subject,action){subject.performActionStart(action);};Window_BattleLog.prototype.performAction = function(subject,action){subject.performAction(action);};Window_BattleLog.prototype.performActionEnd = function(subject){subject.performActionEnd();};Window_BattleLog.prototype.performDamage = function(target){target.performDamage();};Window_BattleLog.prototype.performMiss = function(target){target.performMiss();};Window_BattleLog.prototype.performRecovery = function(target){target.performRecovery();};Window_BattleLog.prototype.performEvasion = function(target){target.performEvasion();};Window_BattleLog.prototype.performMagicEvasion = function(target){target.performMagicEvasion();};Window_BattleLog.prototype.performCounter = function(target){target.performCounter();};Window_BattleLog.prototype.performReflection = function(target){target.performReflection();};Window_BattleLog.prototype.performSubstitute = function(substitute,target){substitute.performSubstitute(target);};Window_BattleLog.prototype.performCollapse = function(target){target.performCollapse();};Window_BattleLog.prototype.showAnimation = function(subject,targets,animationId){if(animationId < 0){this.showAttackAnimation(subject,targets);}else {this.showNormalAnimation(targets,animationId);}};Window_BattleLog.prototype.showAttackAnimation = function(subject,targets){if(subject.isActor()){this.showActorAttackAnimation(subject,targets);}else {this.showEnemyAttackAnimation(subject,targets);}};Window_BattleLog.prototype.showActorAttackAnimation = function(subject,targets){this.showNormalAnimation(targets,subject.attackAnimationId1(),false);this.showNormalAnimation(targets,subject.attackAnimationId2(),true);};Window_BattleLog.prototype.showEnemyAttackAnimation = function(subject,targets){_managers.SoundManager.playEnemyAttack();};Window_BattleLog.prototype.showNormalAnimation = function(targets,animationId,mirror){var animation=$dataAnimations[animationId];if(animation){var delay=this.animationBaseDelay();var nextDelay=this.animationNextDelay();targets.forEach(function(target){target.startAnimation(animationId,mirror,delay);delay += nextDelay;});}};Window_BattleLog.prototype.animationBaseDelay = function(){return 8;};Window_BattleLog.prototype.animationNextDelay = function(){return 12;};Window_BattleLog.prototype.refresh = function(){this.drawBackground();this.contents.clear();for(var i=0;i < this._lines.length;i++) {this.drawLineText(i);}};Window_BattleLog.prototype.drawBackground = function(){var rect=this.backRect();var color=this.backColor();this._backBitmap.clear();this._backBitmap.paintOpacity = this.backPaintOpacity();this._backBitmap.fillRect(rect.x,rect.y,rect.width,rect.height,color);this._backBitmap.paintOpacity = 255;};Window_BattleLog.prototype.backRect = function(){return {x:0,y:this.padding,width:this.width,height:this.numLines() * this.lineHeight()};};Window_BattleLog.prototype.backColor = function(){return '#000000';};Window_BattleLog.prototype.backPaintOpacity = function(){return 64;};Window_BattleLog.prototype.drawLineText = function(index){var rect=this.itemRectForText(index);this.contents.clearRect(rect.x,rect.y,rect.width,rect.height);this.drawTextEx(this._lines[index],rect.x,rect.y,rect.width);};Window_BattleLog.prototype.startTurn = function(){this.push('wait');};Window_BattleLog.prototype.startAction = function(subject,action,targets){var item=action.item();this.push('performActionStart',subject,action);this.push('waitForMovement');this.push('performAction',subject,action);this.push('showAnimation',subject,targets.clone(),item.animationId);this.displayAction(subject,item);};Window_BattleLog.prototype.endAction = function(subject){this.push('waitForNewLine');this.push('clear');this.push('performActionEnd',subject);};Window_BattleLog.prototype.displayCurrentState = function(subject){var stateText=subject.mostImportantStateText();if(stateText){this.push('addText',subject.name() + stateText);this.push('wait');this.push('clear');}};Window_BattleLog.prototype.displayRegeneration = function(subject){this.push('popupDamage',subject);};Window_BattleLog.prototype.displayAction = function(subject,item){var numMethods=this._methods.length;if(_managers.DataManager.isSkill(item)){if(item.message1){this.push('addText',subject.name() + item.message1.format(item.name));}if(item.message2){this.push('addText',item.message2.format(item.name));}}else {this.push('addText',_managers.TextManager.useItem.format(subject.name(),item.name));}if(this._methods.length === numMethods){this.push('wait');}};Window_BattleLog.prototype.displayCounter = function(target){this.push('performCounter',target);this.push('addText',_managers.TextManager.counterAttack.format(target.name()));};Window_BattleLog.prototype.displayReflection = function(target){this.push('performReflection',target);this.push('addText',_managers.TextManager.magicReflection.format(target.name()));};Window_BattleLog.prototype.displaySubstitute = function(substitute,target){var substName=substitute.name();this.push('performSubstitute',substitute,target);this.push('addText',_managers.TextManager.substitute.format(substName,target.name()));};Window_BattleLog.prototype.displayActionResults = function(subject,target){if(target.result().used){this.push('pushBaseLine');this.displayCritical(target);this.push('popupDamage',target);this.push('popupDamage',subject);this.displayDamage(target);this.displayAffectedStatus(target);this.displayFailure(target);this.push('waitForNewLine');this.push('popBaseLine');}};Window_BattleLog.prototype.displayFailure = function(target){if(target.result().isHit() && !target.result().success){this.push('addText',_managers.TextManager.actionFailure.format(target.name()));}};Window_BattleLog.prototype.displayCritical = function(target){if(target.result().critical){if(target.isActor()){this.push('addText',_managers.TextManager.criticalToActor);}else {this.push('addText',_managers.TextManager.criticalToEnemy);}}};Window_BattleLog.prototype.displayDamage = function(target){if(target.result().missed){this.displayMiss(target);}else if(target.result().evaded){this.displayEvasion(target);}else {this.displayHpDamage(target);this.displayMpDamage(target);this.displayTpDamage(target);}};Window_BattleLog.prototype.displayMiss = function(target){var fmt;if(target.result().physical){fmt = target.isActor()?_managers.TextManager.actorNoHit:_managers.TextManager.enemyNoHit;this.push('performMiss',target);}else {fmt = _managers.TextManager.actionFailure;}this.push('addText',fmt.format(target.name()));};Window_BattleLog.prototype.displayEvasion = function(target){var fmt;if(target.result().physical){fmt = _managers.TextManager.evasion;this.push('performEvasion',target);}else {fmt = _managers.TextManager.magicEvasion;this.push('performMagicEvasion',target);}this.push('addText',fmt.format(target.name()));};Window_BattleLog.prototype.displayHpDamage = function(target){if(target.result().hpAffected){if(target.result().hpDamage > 0 && !target.result().drain){this.push('performDamage',target);}if(target.result().hpDamage < 0){this.push('performRecovery',target);}this.push('addText',this.makeHpDamageText(target));}};Window_BattleLog.prototype.displayMpDamage = function(target){if(target.isAlive() && target.result().mpDamage !== 0){if(target.result().mpDamage < 0){this.push('performRecovery',target);}this.push('addText',this.makeMpDamageText(target));}};Window_BattleLog.prototype.displayTpDamage = function(target){if(target.isAlive() && target.result().tpDamage !== 0){if(target.result().tpDamage < 0){this.push('performRecovery',target);}this.push('addText',this.makeTpDamageText(target));}};Window_BattleLog.prototype.displayAffectedStatus = function(target){if(target.result().isStatusAffected()){this.push('pushBaseLine');this.displayChangedStates(target);this.displayChangedBuffs(target);this.push('waitForNewLine');this.push('popBaseLine');}};Window_BattleLog.prototype.displayAutoAffectedStatus = function(target){if(target.result().isStatusAffected()){this.displayAffectedStatus(target,null);this.push('clear');}};Window_BattleLog.prototype.displayChangedStates = function(target){this.displayAddedStates(target);this.displayRemovedStates(target);};Window_BattleLog.prototype.displayAddedStates = function(target){target.result().addedStateObjects().forEach(function(state){var stateMsg=target.isActor()?state.message1:state.message2;if(state.id === target.deathStateId()){this.push('performCollapse',target);}if(stateMsg){this.push('popBaseLine');this.push('pushBaseLine');this.push('addText',target.name() + stateMsg);this.push('waitForEffect');}},this);};Window_BattleLog.prototype.displayRemovedStates = function(target){target.result().removedStateObjects().forEach(function(state){if(state.message4){this.push('popBaseLine');this.push('pushBaseLine');this.push('addText',target.name() + state.message4);}},this);};Window_BattleLog.prototype.displayChangedBuffs = function(target){var result=target.result();this.displayBuffs(target,result.addedBuffs,_managers.TextManager.buffAdd);this.displayBuffs(target,result.addedDebuffs,_managers.TextManager.debuffAdd);this.displayBuffs(target,result.removedBuffs,_managers.TextManager.buffRemove);};Window_BattleLog.prototype.displayBuffs = function(target,buffs,fmt){buffs.forEach(function(paramId){this.push('popBaseLine');this.push('pushBaseLine');this.push('addText',fmt.format(target.name(),_managers.TextManager.param(paramId)));},this);};Window_BattleLog.prototype.makeHpDamageText = function(target){var result=target.result();var damage=result.hpDamage;var isActor=target.isActor();var fmt;if(damage > 0 && result.drain){fmt = isActor?_managers.TextManager.actorDrain:_managers.TextManager.enemyDrain;return fmt.format(target.name(),_managers.TextManager.hp,damage);}else if(damage > 0){fmt = isActor?_managers.TextManager.actorDamage:_managers.TextManager.enemyDamage;return fmt.format(target.name(),damage);}else if(damage < 0){fmt = isActor?_managers.TextManager.actorRecovery:_managers.TextManager.enemyRecovery;return fmt.format(target.name(),_managers.TextManager.hp,-damage);}else {fmt = isActor?_managers.TextManager.actorNoDamage:_managers.TextManager.enemyNoDamage;return fmt.format(target.name());}};Window_BattleLog.prototype.makeMpDamageText = function(target){var result=target.result();var damage=result.mpDamage;var isActor=target.isActor();var fmt;if(damage > 0 && result.drain){fmt = isActor?_managers.TextManager.actorDrain:_managers.TextManager.enemyDrain;return fmt.format(target.name(),_managers.TextManager.mp,damage);}else if(damage > 0){fmt = isActor?_managers.TextManager.actorLoss:_managers.TextManager.enemyLoss;return fmt.format(target.name(),_managers.TextManager.mp,damage);}else if(damage < 0){fmt = isActor?_managers.TextManager.actorRecovery:_managers.TextManager.enemyRecovery;return fmt.format(target.name(),_managers.TextManager.mp,-damage);}else {return '';}};Window_BattleLog.prototype.makeTpDamageText = function(target){var result=target.result();var damage=result.tpDamage;var isActor=target.isActor();var fmt;if(damage > 0){fmt = isActor?_managers.TextManager.actorLoss:_managers.TextManager.enemyLoss;return fmt.format(target.name(),_managers.TextManager.tp,damage);}else if(damage < 0){fmt = isActor?_managers.TextManager.actorGain:_managers.TextManager.enemyGain;return fmt.format(target.name(),_managers.TextManager.tp,-damage);}else {return '';}}; //-----------------------------------------------------------------------------
// Window_PartyCommand
//
// The window for selecting whether to fight or escape on the battle screen.
function Window_PartyCommand(){this.initialize.apply(this,arguments);}Window_PartyCommand.prototype = Object.create(Window_Command.prototype);Window_PartyCommand.prototype.constructor = Window_PartyCommand;Window_PartyCommand.prototype.initialize = function(){var y=_core.Graphics.boxHeight - this.windowHeight();Window_Command.prototype.initialize.call(this,0,y);this.openness = 0;this.deactivate();};Window_PartyCommand.prototype.windowWidth = function(){return 192;};Window_PartyCommand.prototype.numVisibleRows = function(){return 4;};Window_PartyCommand.prototype.makeCommandList = function(){this.addCommand(_managers.TextManager.fight,'fight');this.addCommand(_managers.TextManager.escape,'escape',BattleManager.canEscape());};Window_PartyCommand.prototype.setup = function(){this.clearCommandList();this.makeCommandList();this.refresh();this.select(0);this.activate();this.open();}; //-----------------------------------------------------------------------------
// Window_ActorCommand
//
// The window for selecting an actor's action on the battle screen.
function Window_ActorCommand(){this.initialize.apply(this,arguments);}Window_ActorCommand.prototype = Object.create(Window_Command.prototype);Window_ActorCommand.prototype.constructor = Window_ActorCommand;Window_ActorCommand.prototype.initialize = function(){var y=_core.Graphics.boxHeight - this.windowHeight();Window_Command.prototype.initialize.call(this,0,y);this.openness = 0;this.deactivate();this._actor = null;};Window_ActorCommand.prototype.windowWidth = function(){return 192;};Window_ActorCommand.prototype.numVisibleRows = function(){return 4;};Window_ActorCommand.prototype.makeCommandList = function(){if(this._actor){this.addAttackCommand();this.addSkillCommands();this.addGuardCommand();this.addItemCommand();}};Window_ActorCommand.prototype.addAttackCommand = function(){this.addCommand(_managers.TextManager.attack,'attack',this._actor.canAttack());};Window_ActorCommand.prototype.addSkillCommands = function(){var skillTypes=this._actor.addedSkillTypes();skillTypes.sort(function(a,b){return a - b;});skillTypes.forEach(function(stypeId){var name=$dataSystem.skillTypes[stypeId];this.addCommand(name,'skill',true,stypeId);},this);};Window_ActorCommand.prototype.addGuardCommand = function(){this.addCommand(_managers.TextManager.guard,'guard',this._actor.canGuard());};Window_ActorCommand.prototype.addItemCommand = function(){this.addCommand(_managers.TextManager.item,'item');};Window_ActorCommand.prototype.setup = function(actor){this._actor = actor;this.clearCommandList();this.makeCommandList();this.refresh();this.selectLast();this.activate();this.open();};Window_ActorCommand.prototype.processOk = function(){if(this._actor){if(_managers.ConfigManager.commandRemember){this._actor.setLastCommandSymbol(this.currentSymbol());}else {this._actor.setLastCommandSymbol('');}}Window_Command.prototype.processOk.call(this);};Window_ActorCommand.prototype.selectLast = function(){this.select(0);if(this._actor && _managers.ConfigManager.commandRemember){this.selectSymbol(this._actor.lastCommandSymbol());}}; //-----------------------------------------------------------------------------
// Window_BattleStatus
//
// The window for displaying the status of party members on the battle screen.
function Window_BattleStatus(){this.initialize.apply(this,arguments);}Window_BattleStatus.prototype = Object.create(Window_Selectable.prototype);Window_BattleStatus.prototype.constructor = Window_BattleStatus;Window_BattleStatus.prototype.initialize = function(){var width=this.windowWidth();var height=this.windowHeight();var x=_core.Graphics.boxWidth - width;var y=_core.Graphics.boxHeight - height;Window_Selectable.prototype.initialize.call(this,x,y,width,height);this.refresh();this.openness = 0;};Window_BattleStatus.prototype.windowWidth = function(){return _core.Graphics.boxWidth - 192;};Window_BattleStatus.prototype.windowHeight = function(){return this.fittingHeight(this.numVisibleRows());};Window_BattleStatus.prototype.numVisibleRows = function(){return 4;};Window_BattleStatus.prototype.maxItems = function(){return $gameParty.battleMembers().length;};Window_BattleStatus.prototype.refresh = function(){this.contents.clear();this.drawAllItems();};Window_BattleStatus.prototype.drawItem = function(index){var actor=$gameParty.battleMembers()[index];this.drawBasicArea(this.basicAreaRect(index),actor);this.drawGaugeArea(this.gaugeAreaRect(index),actor);};Window_BattleStatus.prototype.basicAreaRect = function(index){var rect=this.itemRectForText(index);rect.width -= this.gaugeAreaWidth() + 15;return rect;};Window_BattleStatus.prototype.gaugeAreaRect = function(index){var rect=this.itemRectForText(index);rect.x += rect.width - this.gaugeAreaWidth();rect.width = this.gaugeAreaWidth();return rect;};Window_BattleStatus.prototype.gaugeAreaWidth = function(){return 330;};Window_BattleStatus.prototype.drawBasicArea = function(rect,actor){this.drawActorName(actor,rect.x + 0,rect.y,150);this.drawActorIcons(actor,rect.x + 156,rect.y,rect.width - 156);};Window_BattleStatus.prototype.drawGaugeArea = function(rect,actor){if($dataSystem.optDisplayTp){this.drawGaugeAreaWithTp(rect,actor);}else {this.drawGaugeAreaWithoutTp(rect,actor);}};Window_BattleStatus.prototype.drawGaugeAreaWithTp = function(rect,actor){this.drawActorHp(actor,rect.x + 0,rect.y,108);this.drawActorMp(actor,rect.x + 123,rect.y,96);this.drawActorTp(actor,rect.x + 234,rect.y,96);};Window_BattleStatus.prototype.drawGaugeAreaWithoutTp = function(rect,actor){this.drawActorHp(actor,rect.x + 0,rect.y,201);this.drawActorMp(actor,rect.x + 216,rect.y,114);}; //-----------------------------------------------------------------------------
// Window_BattleActor
//
// The window for selecting a target actor on the battle screen.
function Window_BattleActor(){this.initialize.apply(this,arguments);}Window_BattleActor.prototype = Object.create(Window_BattleStatus.prototype);Window_BattleActor.prototype.constructor = Window_BattleActor;Window_BattleActor.prototype.initialize = function(x,y){Window_BattleStatus.prototype.initialize.call(this);this.x = x;this.y = y;this.openness = 255;this.hide();};Window_BattleActor.prototype.show = function(){this.select(0);Window_BattleStatus.prototype.show.call(this);};Window_BattleActor.prototype.hide = function(){Window_BattleStatus.prototype.hide.call(this);$gameParty.select(null);};Window_BattleActor.prototype.select = function(index){Window_BattleStatus.prototype.select.call(this,index);$gameParty.select(this.actor());};Window_BattleActor.prototype.actor = function(){return $gameParty.members()[this.index()];}; //-----------------------------------------------------------------------------
// Window_BattleEnemy
//
// The window for selecting a target enemy on the battle screen.
function Window_BattleEnemy(){this.initialize.apply(this,arguments);}Window_BattleEnemy.prototype = Object.create(Window_Selectable.prototype);Window_BattleEnemy.prototype.constructor = Window_BattleEnemy;Window_BattleEnemy.prototype.initialize = function(x,y){this._enemies = [];var width=this.windowWidth();var height=this.windowHeight();Window_Selectable.prototype.initialize.call(this,x,y,width,height);this.refresh();this.hide();};Window_BattleEnemy.prototype.windowWidth = function(){return _core.Graphics.boxWidth - 192;};Window_BattleEnemy.prototype.windowHeight = function(){return this.fittingHeight(this.numVisibleRows());};Window_BattleEnemy.prototype.numVisibleRows = function(){return 4;};Window_BattleEnemy.prototype.maxCols = function(){return 2;};Window_BattleEnemy.prototype.maxItems = function(){return this._enemies.length;};Window_BattleEnemy.prototype.enemy = function(){return this._enemies[this.index()];};Window_BattleEnemy.prototype.enemyIndex = function(){var enemy=this.enemy();return enemy?enemy.index():-1;};Window_BattleEnemy.prototype.drawItem = function(index){this.resetTextColor();var name=this._enemies[index].name();var rect=this.itemRectForText(index);this.drawText(name,rect.x,rect.y,rect.width);};Window_BattleEnemy.prototype.show = function(){this.refresh();this.select(0);Window_Selectable.prototype.show.call(this);};Window_BattleEnemy.prototype.hide = function(){Window_Selectable.prototype.hide.call(this);$gameTroop.select(null);};Window_BattleEnemy.prototype.refresh = function(){this._enemies = $gameTroop.aliveMembers();Window_Selectable.prototype.refresh.call(this);};Window_BattleEnemy.prototype.select = function(index){Window_Selectable.prototype.select.call(this,index);$gameTroop.select(this.enemy());}; //-----------------------------------------------------------------------------
// Window_BattleSkill
//
// The window for selecting a skill to use on the battle screen.
function Window_BattleSkill(){this.initialize.apply(this,arguments);}Window_BattleSkill.prototype = Object.create(Window_SkillList.prototype);Window_BattleSkill.prototype.constructor = Window_BattleSkill;Window_BattleSkill.prototype.initialize = function(x,y,width,height){Window_SkillList.prototype.initialize.call(this,x,y,width,height);this.hide();};Window_BattleSkill.prototype.show = function(){this.selectLast();this.showHelpWindow();Window_SkillList.prototype.show.call(this);};Window_BattleSkill.prototype.hide = function(){this.hideHelpWindow();Window_SkillList.prototype.hide.call(this);}; //-----------------------------------------------------------------------------
// Window_BattleItem
//
// The window for selecting an item to use on the battle screen.
function Window_BattleItem(){this.initialize.apply(this,arguments);}Window_BattleItem.prototype = Object.create(Window_ItemList.prototype);Window_BattleItem.prototype.constructor = Window_BattleItem;Window_BattleItem.prototype.initialize = function(x,y,width,height){Window_ItemList.prototype.initialize.call(this,x,y,width,height);this.hide();};Window_BattleItem.prototype.includes = function(item){return $gameParty.canUse(item);};Window_BattleItem.prototype.show = function(){this.selectLast();this.showHelpWindow();Window_ItemList.prototype.show.call(this);};Window_BattleItem.prototype.hide = function(){this.hideHelpWindow();Window_ItemList.prototype.hide.call(this);}; //-----------------------------------------------------------------------------
// Window_TitleCommand
//
// The window for selecting New Game/Continue on the title screen.
function Window_TitleCommand(){this.initialize.apply(this,arguments);}Window_TitleCommand.prototype = Object.create(Window_Command.prototype);Window_TitleCommand.prototype.constructor = Window_TitleCommand;Window_TitleCommand.prototype.initialize = function(){Window_Command.prototype.initialize.call(this,0,0);this.updatePlacement();this.openness = 0;this.selectLast();};Window_TitleCommand._lastCommandSymbol = null;Window_TitleCommand.initCommandPosition = function(){this._lastCommandSymbol = null;};Window_TitleCommand.prototype.windowWidth = function(){return 240;};Window_TitleCommand.prototype.updatePlacement = function(){this.x = (_core.Graphics.boxWidth - this.width) / 2;this.y = _core.Graphics.boxHeight - this.height - 96;};Window_TitleCommand.prototype.makeCommandList = function(){this.addCommand(_managers.TextManager.newGame,'newGame');this.addCommand(_managers.TextManager.continue_,'continue',this.isContinueEnabled());this.addCommand(_managers.TextManager.options,'options');};Window_TitleCommand.prototype.isContinueEnabled = function(){return _managers.DataManager.isAnySavefileExists();};Window_TitleCommand.prototype.processOk = function(){Window_TitleCommand._lastCommandSymbol = this.currentSymbol();Window_Command.prototype.processOk.call(this);};Window_TitleCommand.prototype.selectLast = function(){if(Window_TitleCommand._lastCommandSymbol){this.selectSymbol(Window_TitleCommand._lastCommandSymbol);}else if(this.isContinueEnabled()){this.selectSymbol('continue');}}; //-----------------------------------------------------------------------------
// Window_GameEnd
//
// The window for selecting "Go to Title" on the game end screen.
function Window_GameEnd(){this.initialize.apply(this,arguments);}Window_GameEnd.prototype = Object.create(Window_Command.prototype);Window_GameEnd.prototype.constructor = Window_GameEnd;Window_GameEnd.prototype.initialize = function(){Window_Command.prototype.initialize.call(this,0,0);this.updatePlacement();this.openness = 0;this.open();};Window_GameEnd.prototype.windowWidth = function(){return 240;};Window_GameEnd.prototype.updatePlacement = function(){this.x = (_core.Graphics.boxWidth - this.width) / 2;this.y = (_core.Graphics.boxHeight - this.height) / 2;};Window_GameEnd.prototype.makeCommandList = function(){this.addCommand(_managers.TextManager.toTitle,'toTitle');this.addCommand(_managers.TextManager.cancel,'cancel');}; //-----------------------------------------------------------------------------
// Window_DebugRange
//
// The window for selecting a block of switches/variables on the debug screen.
function Window_DebugRange(){this.initialize.apply(this,arguments);}Window_DebugRange.prototype = Object.create(Window_Selectable.prototype);Window_DebugRange.prototype.constructor = Window_DebugRange;Window_DebugRange.lastTopRow = 0;Window_DebugRange.lastIndex = 0;Window_DebugRange.prototype.initialize = function(x,y){this._maxSwitches = Math.ceil(($dataSystem.switches.length - 1) / 10);this._maxVariables = Math.ceil(($dataSystem.variables.length - 1) / 10);var width=this.windowWidth();var height=this.windowHeight();Window_Selectable.prototype.initialize.call(this,x,y,width,height);this.refresh();this.setTopRow(Window_DebugRange.lastTopRow);this.select(Window_DebugRange.lastIndex);this.activate();};Window_DebugRange.prototype.windowWidth = function(){return 246;};Window_DebugRange.prototype.windowHeight = function(){return _core.Graphics.boxHeight;};Window_DebugRange.prototype.maxItems = function(){return this._maxSwitches + this._maxVariables;};Window_DebugRange.prototype.update = function(){Window_Selectable.prototype.update.call(this);if(this._editWindow){this._editWindow.setMode(this.mode());this._editWindow.setTopId(this.topId());}};Window_DebugRange.prototype.mode = function(){return this.index() < this._maxSwitches?'switch':'variable';};Window_DebugRange.prototype.topId = function(){var index=this.index();if(index < this._maxSwitches){return index * 10 + 1;}else {return (index - this._maxSwitches) * 10 + 1;}};Window_DebugRange.prototype.refresh = function(){this.createContents();this.drawAllItems();};Window_DebugRange.prototype.drawItem = function(index){var rect=this.itemRectForText(index);var start;var text;if(index < this._maxSwitches){start = index * 10 + 1;text = 'S';}else {start = (index - this._maxSwitches) * 10 + 1;text = 'V';}var end=start + 9;text += ' [' + start.padZero(4) + '-' + end.padZero(4) + ']';this.drawText(text,rect.x,rect.y,rect.width);};Window_DebugRange.prototype.isCancelTriggered = function(){return Window_Selectable.prototype.isCancelTriggered() || _core.Input.isTriggered('debug');};Window_DebugRange.prototype.processCancel = function(){Window_Selectable.prototype.processCancel.call(this);Window_DebugRange.lastTopRow = this.topRow();Window_DebugRange.lastIndex = this.index();};Window_DebugRange.prototype.setEditWindow = function(editWindow){this._editWindow = editWindow;this.update();}; //-----------------------------------------------------------------------------
// Window_DebugEdit
//
// The window for displaying switches and variables on the debug screen.
function Window_DebugEdit(){this.initialize.apply(this,arguments);}Window_DebugEdit.prototype = Object.create(Window_Selectable.prototype);Window_DebugEdit.prototype.constructor = Window_DebugEdit;Window_DebugEdit.prototype.initialize = function(x,y,width){var height=this.fittingHeight(10);Window_Selectable.prototype.initialize.call(this,x,y,width,height);this._mode = 'switch';this._topId = 1;this.refresh();};Window_DebugEdit.prototype.maxItems = function(){return 10;};Window_DebugEdit.prototype.refresh = function(){this.contents.clear();this.drawAllItems();};Window_DebugEdit.prototype.drawItem = function(index){var dataId=this._topId + index;var idText=dataId.padZero(4) + ':';var idWidth=this.textWidth(idText);var statusWidth=this.textWidth('-00000000');var name=this.itemName(dataId);var status=this.itemStatus(dataId);var rect=this.itemRectForText(index);this.resetTextColor();this.drawText(idText,rect.x,rect.y,rect.width);rect.x += idWidth;rect.width -= idWidth + statusWidth;this.drawText(name,rect.x,rect.y,rect.width);this.drawText(status,rect.x + rect.width,rect.y,statusWidth,'right');};Window_DebugEdit.prototype.itemName = function(dataId){if(this._mode === 'switch'){return $dataSystem.switches[dataId];}else {return $dataSystem.variables[dataId];}};Window_DebugEdit.prototype.itemStatus = function(dataId){if(this._mode === 'switch'){return $gameSwitches.value(dataId)?'[ON]':'[OFF]';}else {return String($gameVariables.value(dataId));}};Window_DebugEdit.prototype.setMode = function(mode){if(this._mode !== mode){this._mode = mode;this.refresh();}};Window_DebugEdit.prototype.setTopId = function(id){if(this._topId !== id){this._topId = id;this.refresh();}};Window_DebugEdit.prototype.currentId = function(){return this._topId + this.index();};Window_DebugEdit.prototype.update = function(){Window_Selectable.prototype.update.call(this);if(this.active){if(this._mode === 'switch'){this.updateSwitch();}else {this.updateVariable();}}};Window_DebugEdit.prototype.updateSwitch = function(){if(_core.Input.isRepeated('ok')){var switchId=this.currentId();_managers.SoundManager.playCursor();$gameSwitches.setValue(switchId,!$gameSwitches.value(switchId));this.redrawCurrentItem();}};Window_DebugEdit.prototype.updateVariable = function(){var variableId=this.currentId();var value=$gameVariables.value(variableId);if(typeof value === 'number'){if(_core.Input.isRepeated('right')){value++;}if(_core.Input.isRepeated('left')){value--;}if(_core.Input.isRepeated('pagedown')){value += 10;}if(_core.Input.isRepeated('pageup')){value -= 10;}if($gameVariables.value(variableId) !== value){$gameVariables.setValue(variableId,value);_managers.SoundManager.playCursor();this.redrawCurrentItem();}}};

},{"./core":4,"./managers":6,"./objects":7,"./sprites":10,"lodash.clonedeep":12}],12:[function(require,module,exports){
/**
 * lodash 3.0.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseClone = require('lodash._baseclone'),
    bindCallback = require('lodash._bindcallback');

/**
 * Creates a deep clone of `value`. If `customizer` is provided it's invoked
 * to produce the cloned values. If `customizer` returns `undefined` cloning
 * is handled by the method instead. The `customizer` is bound to `thisArg`
 * and invoked with up to three argument; (value [, index|key, object]).
 *
 * **Note:** This method is loosely based on the
 * [structured clone algorithm](http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm).
 * The enumerable properties of `arguments` objects and objects created by
 * constructors other than `Object` are cloned to plain `Object` objects. An
 * empty object is returned for uncloneable values such as functions, DOM nodes,
 * Maps, Sets, and WeakMaps.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to deep clone.
 * @param {Function} [customizer] The function to customize cloning values.
 * @param {*} [thisArg] The `this` binding of `customizer`.
 * @returns {*} Returns the deep cloned value.
 * @example
 *
 * var users = [
 *   { 'user': 'barney' },
 *   { 'user': 'fred' }
 * ];
 *
 * var deep = _.cloneDeep(users);
 * deep[0] === users[0];
 * // => false
 *
 * // using a customizer callback
 * var el = _.cloneDeep(document.body, function(value) {
 *   if (_.isElement(value)) {
 *     return value.cloneNode(true);
 *   }
 * });
 *
 * el === document.body
 * // => false
 * el.nodeName
 * // => BODY
 * el.childNodes.length;
 * // => 20
 */
function cloneDeep(value, customizer, thisArg) {
  return typeof customizer == 'function'
    ? baseClone(value, true, bindCallback(customizer, thisArg, 3))
    : baseClone(value, true);
}

module.exports = cloneDeep;

},{"lodash._baseclone":13,"lodash._bindcallback":23}],13:[function(require,module,exports){
(function (global){
/**
 * lodash 3.3.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var arrayCopy = require('lodash._arraycopy'),
    arrayEach = require('lodash._arrayeach'),
    baseAssign = require('lodash._baseassign'),
    baseFor = require('lodash._basefor'),
    isArray = require('lodash.isarray'),
    keys = require('lodash.keys');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[boolTag] =
cloneableTags[dateTag] = cloneableTags[float32Tag] =
cloneableTags[float64Tag] = cloneableTags[int8Tag] =
cloneableTags[int16Tag] = cloneableTags[int32Tag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[stringTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[mapTag] = cloneableTags[setTag] =
cloneableTags[weakMapTag] = false;

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/** Native method references. */
var ArrayBuffer = global.ArrayBuffer,
    Uint8Array = global.Uint8Array;

/**
 * The base implementation of `_.clone` without support for argument juggling
 * and `this` binding `customizer` functions.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @param {Function} [customizer] The function to customize cloning values.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The object `value` belongs to.
 * @param {Array} [stackA=[]] Tracks traversed source objects.
 * @param {Array} [stackB=[]] Associates clones with source counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, isDeep, customizer, key, object, stackA, stackB) {
  var result;
  if (customizer) {
    result = object ? customizer(value, key, object) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return arrayCopy(value, result);
    }
  } else {
    var tag = objToString.call(value),
        isFunc = tag == funcTag;

    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      result = initCloneObject(isFunc ? {} : value);
      if (!isDeep) {
        return baseAssign(result, value);
      }
    } else {
      return cloneableTags[tag]
        ? initCloneByTag(value, tag, isDeep)
        : (object ? value : {});
    }
  }
  // Check for circular references and return its corresponding clone.
  stackA || (stackA = []);
  stackB || (stackB = []);

  var length = stackA.length;
  while (length--) {
    if (stackA[length] == value) {
      return stackB[length];
    }
  }
  // Add the source value to the stack of traversed objects and associate it with its clone.
  stackA.push(value);
  stackB.push(result);

  // Recursively populate clone (susceptible to call stack limits).
  (isArr ? arrayEach : baseForOwn)(value, function(subValue, key) {
    result[key] = baseClone(subValue, isDeep, customizer, key, value, stackA, stackB);
  });
  return result;
}

/**
 * The base implementation of `_.forOwn` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return baseFor(object, iteratee, keys);
}

/**
 * Creates a clone of the given array buffer.
 *
 * @private
 * @param {ArrayBuffer} buffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function bufferClone(buffer) {
  var result = new ArrayBuffer(buffer.byteLength),
      view = new Uint8Array(result);

  view.set(new Uint8Array(buffer));
  return result;
}

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = new array.constructor(length);

  // Add array properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  var Ctor = object.constructor;
  if (!(typeof Ctor == 'function' && Ctor instanceof Ctor)) {
    Ctor = Object;
  }
  return new Ctor;
}

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return bufferClone(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      var buffer = object.buffer;
      return new Ctor(isDeep ? bufferClone(buffer) : buffer, object.byteOffset, object.length);

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      var result = new Ctor(object.source, reFlags.exec(object));
      result.lastIndex = object.lastIndex;
  }
  return result;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

module.exports = baseClone;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"lodash._arraycopy":14,"lodash._arrayeach":15,"lodash._baseassign":16,"lodash._basefor":18,"lodash.isarray":19,"lodash.keys":20}],14:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function arrayCopy(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = arrayCopy;

},{}],15:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * A specialized version of `_.forEach` for arrays without support for callback
 * shorthands or `this` binding.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;

},{}],16:[function(require,module,exports){
/**
 * lodash 3.2.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseCopy = require('lodash._basecopy'),
    keys = require('lodash.keys');

/**
 * The base implementation of `_.assign` without support for argument juggling,
 * multiple sources, and `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return source == null
    ? object
    : baseCopy(source, keys(source), object);
}

module.exports = baseAssign;

},{"lodash._basecopy":17,"lodash.keys":20}],17:[function(require,module,exports){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property names to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @returns {Object} Returns `object`.
 */
function baseCopy(source, props, object) {
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];
    object[key] = source[key];
  }
  return object;
}

module.exports = baseCopy;

},{}],18:[function(require,module,exports){
/**
 * lodash 3.0.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * The base implementation of `baseForIn` and `baseForOwn` which iterates
 * over `object` properties returned by `keysFunc` invoking `iteratee` for
 * each property. Iteratee functions may exit iteration early by explicitly
 * returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

/**
 * Creates a base function for `_.forIn` or `_.forInRight`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var iterable = toObject(object),
        props = keysFunc(object),
        length = props.length,
        index = fromRight ? length : -1;

    while ((fromRight ? index-- : ++index < length)) {
      var key = props[index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

/**
 * Converts `value` to an object if it's not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Object} Returns the object.
 */
function toObject(value) {
  return isObject(value) ? value : Object(value);
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

module.exports = baseFor;

},{}],19:[function(require,module,exports){
/**
 * lodash 3.0.4 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var arrayTag = '[object Array]',
    funcTag = '[object Function]';

/** Used to detect host constructors (Safari > 5). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var fnToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/* Native method references for those with the same name as other `lodash` methods. */
var nativeIsArray = getNative(Array, 'isArray');

/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = object == null ? undefined : object[key];
  return isNative(value) ? value : undefined;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(function() { return arguments; }());
 * // => false
 */
var isArray = nativeIsArray || function(value) {
  return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
};

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in older versions of Chrome and Safari which return 'function' for regexes
  // and Safari 8 equivalents which return 'object' for typed array constructors.
  return isObject(value) && objToString.call(value) == funcTag;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (value == null) {
    return false;
  }
  if (isFunction(value)) {
    return reIsNative.test(fnToString.call(value));
  }
  return isObjectLike(value) && reIsHostCtor.test(value);
}

module.exports = isArray;

},{}],20:[function(require,module,exports){
/**
 * lodash 3.1.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var getNative = require('lodash._getnative'),
    isArguments = require('lodash.isarguments'),
    isArray = require('lodash.isarray');

/** Used to detect unsigned integer values. */
var reIsUint = /^\d+$/;

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/* Native method references for those with the same name as other `lodash` methods. */
var nativeKeys = getNative(Object, 'keys');

/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
 * that affects Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

/**
 * Checks if `value` is array-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value));
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * A fallback implementation of `Object.keys` which creates an array of the
 * own enumerable property names of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function shimKeys(object) {
  var props = keysIn(object),
      propsLength = props.length,
      length = propsLength && object.length;

  var allowIndexes = !!length && isLength(length) &&
    (isArray(object) || isArguments(object));

  var index = -1,
      result = [];

  while (++index < propsLength) {
    var key = props[index];
    if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
var keys = !nativeKeys ? shimKeys : function(object) {
  var Ctor = object == null ? undefined : object.constructor;
  if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
      (typeof object != 'function' && isArrayLike(object))) {
    return shimKeys(object);
  }
  return isObject(object) ? nativeKeys(object) : [];
};

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  if (object == null) {
    return [];
  }
  if (!isObject(object)) {
    object = Object(object);
  }
  var length = object.length;
  length = (length && isLength(length) &&
    (isArray(object) || isArguments(object)) && length) || 0;

  var Ctor = object.constructor,
      index = -1,
      isProto = typeof Ctor == 'function' && Ctor.prototype === object,
      result = Array(length),
      skipIndexes = length > 0;

  while (++index < length) {
    result[index] = (index + '');
  }
  for (var key in object) {
    if (!(skipIndexes && isIndex(key, length)) &&
        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = keys;

},{"lodash._getnative":21,"lodash.isarguments":22,"lodash.isarray":19}],21:[function(require,module,exports){
/**
 * lodash 3.9.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var funcTag = '[object Function]';

/** Used to detect host constructors (Safari > 5). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var fnToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = object == null ? undefined : object[key];
  return isNative(value) ? value : undefined;
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in older versions of Chrome and Safari which return 'function' for regexes
  // and Safari 8 equivalents which return 'object' for typed array constructors.
  return isObject(value) && objToString.call(value) == funcTag;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (value == null) {
    return false;
  }
  if (isFunction(value)) {
    return reIsNative.test(fnToString.call(value));
  }
  return isObjectLike(value) && reIsHostCtor.test(value);
}

module.exports = getNative;

},{}],22:[function(require,module,exports){
/**
 * lodash 3.0.4 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Native method references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
 * that affects Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

/**
 * Checks if `value` is array-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value));
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is classified as an `arguments` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  return isObjectLike(value) && isArrayLike(value) &&
    hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
}

module.exports = isArguments;

},{}],23:[function(require,module,exports){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * A specialized version of `baseCallback` which only supports `this` binding
 * and specifying the number of arguments to provide to `func`.
 *
 * @private
 * @param {Function} func The function to bind.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {number} [argCount] The number of arguments to provide to `func`.
 * @returns {Function} Returns the callback.
 */
function bindCallback(func, thisArg, argCount) {
  if (typeof func != 'function') {
    return identity;
  }
  if (thisArg === undefined) {
    return func;
  }
  switch (argCount) {
    case 1: return function(value) {
      return func.call(thisArg, value);
    };
    case 3: return function(value, index, collection) {
      return func.call(thisArg, value, index, collection);
    };
    case 4: return function(accumulator, value, index, collection) {
      return func.call(thisArg, accumulator, value, index, collection);
    };
    case 5: return function(value, other, key, object, source) {
      return func.call(thisArg, value, other, key, object, source);
    };
  }
  return function() {
    return func.apply(thisArg, arguments);
  };
}

/**
 * This method returns the first argument provided to it.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'user': 'fred' };
 *
 * _.identity(object) === object;
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = bindCallback;

},{}]},{},[3]);
