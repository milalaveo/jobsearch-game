function Window_CustomBattleLog() {
    this.initialize(...arguments);
}

Window_CustomBattleLog.prototype = Object.create(Window_BattleLog.prototype);
Window_CustomBattleLog.prototype.constructor = Window_CustomBattleLog;

Window_CustomBattleLog.prototype.initialize = function() {
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Selectable.prototype.initialize.call(this, 76, 764, width, height);
    // this.opacity = 0;
    this._lines = [];
    this._methods = [];
    this._waitCount = 0;
    this._waitMode = '';
    this._baseLineStack = [];
    this._spriteset = null;
    this.createBackBitmap();
    this.createBackSprite();
    this.refresh();
};

Window_CustomBattleLog.prototype.itemRect = function(index) {
    var rect = new Rectangle();
    var maxCols = this.maxCols();
    rect.width = this.itemWidth();
    rect.height = this.itemHeight();
    rect.x = index % maxCols * (rect.width + this.spacing()) - this._scrollX;
    rect.y = Math.floor(index / maxCols) * rect.height - this._scrollY +  + this.topPadding() / 2;
    return rect;
};

// Window_CustomBattleLog.prototype.isBusy = function() {
//     return this._waitCount > 0 || this._waitMode;
// };
//
// Window_CustomBattleLog.prototype.endAction = function(subject) {
//     this.push('waitForNewLine');
//     this.push('performActionEnd', subject);
// };

// Устанавливаем ширину окна
Window_CustomBattleLog.prototype.windowWidth = function() {
    return 361; // Ширина окна
};

// Устанавливаем ширину окна
Window_CustomBattleLog.prototype.windowHeight = function() {
    return 276; // Ширина окна
};

Window_CustomBattleLog.prototype.topPadding = function() {
    return 47;
};

// Кастомизация фона
Window_CustomBattleLog.prototype._refreshBack = function() {
    const margin = this._margin;
    const width = this._width - margin * 2;
    const height = this._height - margin * 2;

    this._windowBackSprite.bitmap = new Bitmap(width, height);
    this._windowBackSprite.bitmap.fillRect(0, 0, width, height, '#2C2A2A'); // Чёрный полупрозрачный фон
};

// Кастомизация рамки
Window_CustomBattleLog.prototype._refreshFrame = function() {
    const w = this._width;
    const h = this._height;

    this._windowFrameSprite.bitmap = new Bitmap(w, h);
    const color = '#FFFFFF'; // Белая рамка
    const thickness = 4;

    this._windowFrameSprite.bitmap.fillRect(0, 0, w, thickness, color); // Верхняя граница
    this._windowFrameSprite.bitmap.fillRect(0, 0, thickness, h, color); // Левая граница
    this._windowFrameSprite.bitmap.fillRect(w - thickness, 0, thickness, h, color); // Правая граница
    this._windowFrameSprite.bitmap.fillRect(0, h - thickness, w, thickness, color); // Нижняя граница
    this._windowFrameSprite.bitmap.fillRect(thickness, thickness, w - thickness * 2, this.topPadding() - thickness * 2, "#3D3D3D");
    this._windowFrameSprite.bitmap.outlineWidth = 0;
    this._windowFrameSprite.bitmap.fontSize = 32;
    this._windowFrameSprite.bitmap.textColor = '#FFFFFF';
    this._windowFrameSprite.bitmap.drawText("Chat", 15, 0, w - 15, this.topPadding(), 'left');
};

(function () {
    Scene_Battle.prototype.createLogWindow = function() {
        this._logWindow = new Window_CustomBattleLog();
        this.addWindow(this._logWindow);
    };
})();
