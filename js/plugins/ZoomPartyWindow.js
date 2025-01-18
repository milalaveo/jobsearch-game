function Window_CustomPartyCommand() {
    this.initialize.apply(this, arguments);
}

Window_CustomPartyCommand.prototype = Object.create(Window_Command.prototype);
Window_CustomPartyCommand.prototype.constructor = Window_CustomPartyCommand;

// Инициализация окна
Window_CustomPartyCommand.prototype.initialize = function() {
    Window_Command.prototype.initialize.call(this, 76, 64);
    this.openness = 0; // Окно начинается закрытым
    this.deactivate();
};

// Создание списка команд
Window_CustomPartyCommand.prototype.makeCommandList = function() {
    this.addCommand('Interrupt', 'interrupt');
    this.addCommand('Action', 'action');
    this.addCommand('Items', 'item');
    this.addCommand('Leave', 'leave');
};

// Устанавливаем ширину окна
// Window_CustomPartyCommand.prototype.textPadding = function() {
//     return 20; // Ширина окна
// };

// Устанавливаем ширину окна
Window_CustomPartyCommand.prototype.windowWidth = function() {
    return 361; // Ширина окна
};

// Устанавливаем ширину окна
Window_CustomPartyCommand.prototype.windowHeight = function() {
    return 657; // Ширина окна
};

Window_CustomPartyCommand.prototype.setup = function(actor) {
    this._actor = actor;
    this.clearCommandList();
    this.makeCommandList();
    this.refresh();
    this.select(0);
    this.activate();
    this.open();
};

Window_CustomPartyCommand.prototype.itemWidth = function() {
    return 322;
};

Window_CustomPartyCommand.prototype.itemHeight = function() {
    return 90;
};

Window_CustomPartyCommand.prototype.spacing = function() {
    return 12;
};

Window_CustomPartyCommand.prototype.innerPadding = function() {
    return 10;
};

Window_CustomPartyCommand.prototype.textPadding = function() {
    return 6;
};

Window_CustomPartyCommand.prototype.lineHeight = function() {
    return this.itemHeight();
};

Window_CustomPartyCommand.prototype.topPadding = function() {
    return 47;
};

Window_CustomPartyCommand.prototype.itemRect = function(index) {
    const rect = new Rectangle();
    rect.width = this.itemWidth();
    rect.height = this.itemHeight();
    rect.x = this.innerPadding();
    rect.y = index * (rect.height + this.spacing()) + this.innerPadding() + this.topPadding();

    if (index === 3) {
        rect.y = this.windowHeight() - rect.height - this.innerPadding() * 3 - 1;
    }

    return rect;
};

// Кастомная отрисовка команды с выделением
Window_CustomPartyCommand.prototype.drawItem = function(index) {
    const rect = this.itemRectForText(index);
    const text = this.commandName(index);

    let backgroundColor, fontColor;

    if (index === 3) {
        backgroundColor = '#FF4444';
        fontColor = '#FFFFFF';
    } else {
        backgroundColor = '#FFFFFF';
        fontColor = '#00000';
    }

    // Рисуем фон команды
    this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, backgroundColor); // С отступом от выделения

    // Настраиваем стиль текста
    this.resetTextColor();
    this.contents.fontSize = 52;
    this.changeTextColor(fontColor); // Белый текст

    // Рисуем текст
    this.drawText(text, rect.x, rect.y, rect.width, 'center'); // Отступы внутри кнопок
};

Window_CustomPartyCommand.prototype._createAllParts = function() {
    this._windowSpriteContainer = new PIXI.Container();
    this._windowBackSprite = new Sprite();
    this._windowCursorSprite = new Sprite();
    this._windowFrameSprite = new Sprite();
    this._windowContentsSprite = new Sprite();
    this._downArrowSprite = new Sprite();
    this._upArrowSprite = new Sprite();
    this._windowPauseSignSprite = new Sprite();
    this._windowBackSprite.bitmap = new Bitmap(1, 1);
    this._windowBackSprite.alpha = 192 / 255;
    this.addChild(this._windowSpriteContainer);
    this._windowSpriteContainer.addChild(this._windowBackSprite);
    this._windowSpriteContainer.addChild(this._windowFrameSprite);
    this.addChild(this._windowContentsSprite);
    this.addChild(this._windowCursorSprite); // change cursor and content places so cursor will be above content
    this.addChild(this._downArrowSprite);
    this.addChild(this._upArrowSprite);
    this.addChild(this._windowPauseSignSprite);
};

Window_CustomPartyCommand.prototype._refreshBack = function() {
    const width = this._width;
    const height = this._height;

    // Создаём чёрный полупрозрачный фон
    this._windowBackSprite.bitmap = new Bitmap(width, height);
    this._windowBackSprite.bitmap.fillRect(0, 0, width, height, '#181818'); // Чёрный фон с 80% прозрачности
};

Window_CustomPartyCommand.prototype._refreshFrame = function() {
    const w = this._width;
    const h = this._height;

    // Создаём рамку с пользовательским цветом
    this._windowFrameSprite.bitmap = new Bitmap(w, h);
    const color = 'rgba(255, 255, 255, 0.37)'; // Белый цвет рамки
    const thickness = 1; // Толщина рамки

    // Рисуем рамку вокруг окна
    this._windowFrameSprite.bitmap.fillRect(0, 0, w, thickness, color); // Верхняя граница
    this._windowFrameSprite.bitmap.fillRect(0, 0, thickness, h, color); // Левая граница
    this._windowFrameSprite.bitmap.fillRect(w - thickness, 0, thickness, h, color); // Правая граница
    this._windowFrameSprite.bitmap.fillRect(0, h - thickness, w, thickness, color); // Нижняя граница
    this._windowFrameSprite.bitmap.fillRect(thickness, thickness, w - thickness * 2, this.topPadding() - thickness * 2, "#3D3D3D");
    this._windowFrameSprite.bitmap.outlineWidth = 0;
    this._windowFrameSprite.bitmap.fontSize = 32;
    this._windowFrameSprite.bitmap.textColor = '#FFFFFF';
    this._windowFrameSprite.bitmap.drawText("Actions", 15, 0, w - 15, this.topPadding(), 'left');
};


Window_CustomPartyCommand.prototype._refreshCursor = function() {
    const index = this.index();
    const rect = this.itemRectForText(index);
    const bitmap = new Bitmap(rect.width, rect.height);

    bitmap.fillRect(0, 0, rect.width, rect.height, '#FFFFFF'); // Белое выделение
    bitmap.fillRect(2, 2, rect.width - 4, rect.height - 4, '#000000'); // Белое выделение

    if (this._list[index]) {
        const text = this.commandName(index);
        bitmap.fontSize = 52;
        bitmap.textColor = '#FFFFFF'; // Белый текст
        // Рисуем текст
        bitmap.drawText(text, 20, 0, rect.width - 40, rect.height, 'center'); // Отступы внутри кнопок
    }

    this._windowCursorSprite.bitmap = bitmap;
    this._windowCursorSprite.setFrame(0, 0, rect.width, rect.height);
    this._windowCursorSprite.move(rect.x + this.standardPadding(), rect.y + this.standardPadding());
};

// Убираем стандартные рамки
Window_CustomPartyCommand.prototype.standardPadding = function() {
    return 10; // Уменьшаем отступы
};

(function() {
    Scene_Battle.prototype.createPartyCommandWindow = function() {
        this._partyCommandWindow = new Window_CustomPartyCommand();

        // Привязываем обработчики команд
        this._partyCommandWindow.setHandler('interrupt', this.commandInterrupt.bind(this));
        this._partyCommandWindow.setHandler('action', this.commandAction.bind(this));
        this._partyCommandWindow.setHandler('item', this.commandItem.bind(this));
        this._partyCommandWindow.setHandler('leave', this.commandLeave.bind(this));
        this.addWindow(this._partyCommandWindow);
    };

    Scene_Battle.prototype.partyCommandWindowRect = function() {
        return new Rectangle(10, 10, 200, 200); // Задаём размеры окна
    };

// Примеры методов для обработки команд
    Scene_Battle.prototype.commandInterrupt = function() {
        console.log('Interrupt command selected');
        BattleManager.selectNextCommand();
        BattleManager.inputtingAction().setAttack();
        this.onEnemyOk();
        this.endCommandSelection();
    };

    Scene_Battle.prototype.commandAction = function() {
        console.log('Action command selected');
        this.endCommandSelection();
    };

    Scene_Battle.prototype.commandItem = function() {
        console.log('Item command selected');
        this.endCommandSelection();
    };

    Scene_Battle.prototype.commandLeave = function() {
        console.log('Leave command selected');
        BattleManager.processAbort();
    };
})();