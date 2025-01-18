function Window_CustomMessage() {
    this.initialize(...arguments);
}

Window_CustomMessage.prototype = Object.create(Window_Message.prototype);
Window_CustomMessage.prototype.constructor = Window_CustomMessage;

// Инициализация окна
Window_CustomMessage.prototype.initialize = function() {
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Base.prototype.initialize.call(this, this.positionX(), this.positionY(), width, height);
    this.openness = 0;
    this.initMembers();
    this.createSubWindows();
    this.updatePlacement();
};

Window_CustomMessage.prototype.updatePlacement = function() {
    // Устанавливаем кастомное положение
    this.x = this.positionX(); // Ваше значение X
    this.y = this.positionY(); // Ваше значение Y
};

Window_CustomMessage.prototype.positionX = function() {
    return 550;
}

Window_CustomMessage.prototype.positionY = function() {
    return 150;
}

// Устанавливаем ширину окна
Window_CustomMessage.prototype.windowWidth = function() {
    return 1296; // Ширина окна
};

// Устанавливаем ширину окна
Window_CustomMessage.prototype.windowHeight = function() {
    return 187; // Ширина окна
};

// Переопределяем фон
Window_CustomMessage.prototype._refreshBack = function() {
    const margin = this._margin;
    const width = this._width - margin * 2;
    const height = this._height - margin * 2;

    // Чёрный фон с 80% прозрачности
    this._windowBackSprite.bitmap = new Bitmap(width, height);
    this._windowBackSprite.bitmap.fillRect(0, 0, width, height, 'rgba(0, 0, 0, 0.8)');
};

// Переопределяем рамку
Window_CustomMessage.prototype._refreshFrame = function() {
    const w = this._width;
    const h = this._height;

    this._windowFrameSprite.bitmap = new Bitmap(w, h);
    const color = '#FFFFFF'; // Белый цвет рамки
    const thickness = 4; // Толщина рамки

    this._windowFrameSprite.bitmap.fillRect(0, 0, w, thickness, color); // Верхняя граница
    this._windowFrameSprite.bitmap.fillRect(0, 0, thickness, h, color); // Левая граница
    this._windowFrameSprite.bitmap.fillRect(w - thickness, 0, thickness, h, color); // Правая граница
    this._windowFrameSprite.bitmap.fillRect(0, h - thickness, w, thickness, color); // Нижняя граница
};

(function() {
    Scene_Battle.prototype.createMessageWindow = function() {
        this._messageWindow = new Window_CustomMessage();
        this.addWindow(this._messageWindow);
        this._messageWindow.subWindows().forEach(function(window) {
            this.addWindow(window);
        }, this);
    };
})();