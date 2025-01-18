const OVERLAY_HEIGHT = 50;

function EmptyStatusWindow() {
    this.initialize(...arguments);
}

EmptyStatusWindow.prototype = Object.create(Window_Base.prototype);
EmptyStatusWindow.prototype.constructor = EmptyStatusWindow;

// Пустая инициализация
EmptyStatusWindow.prototype.initialize = function(rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.hide(); // Скрываем окно
};

// Отключаем все методы рисования
EmptyStatusWindow.prototype.refresh = function() {};
EmptyStatusWindow.prototype.drawItem = function() {};
EmptyStatusWindow.prototype.update = function() {};
EmptyStatusWindow.prototype.select = function() {};
EmptyStatusWindow.prototype.deselect = function() {};


class BossInterface extends Sprite_Enemy {
    constructor(enemy) {
        super(enemy);
    }

    initialize(battler) {
        super.initialize(battler);
        this.createBossImage();
        this.createStatusBar();
    }

    get width() {
        return 1380;
    }

    get height() {
        return 980;
    }

    get frameWidth() {
        return 15;
    }

    get frameHeader() {
        return 64;
    }

    get statusBarHeight() {
        return 78;
    }

    loadBitmap() {
        this.bitmap = new Bitmap(this.width, this.height);

        // Рисуем синий фон и белую рамку
        this.bitmap.fillRect(0, 0, this.width, this.height, '#002F72');
        this.bitmap.textColor = '#1A40D6';
        this.bitmap.outlineWidth = 0;

        // Добавляем заголовок "Zoom"
        this.bitmap.fontSize = 48;
        this.bitmap.textColor = '#FFFFFF';
        this.bitmap.drawText('Zoom', this.frameWidth, 0, 200, this.frameHeader, 'left');
        this.anchor.set(0, 0);
    }

    // Создаём изображение босса
    createBossImage() {
        const bitmap = ImageManager.loadSvEnemy(this._enemy.battlerName());

        this._bossImage = new Sprite(bitmap); // Загрузка изображения босса
        this._bossImage.x = this.frameWidth;
        this._bossImage.y = this.frameHeader;

        // Добавляем изображение как дочерний спрайт
        this.addChild(this._bossImage);
    }

    createStatusBar() {
        const statusBarBitmap = new Bitmap(this.width - this.frameWidth * 2, this.statusBarHeight);

        // Рисуем полупрозрачный фон
        statusBarBitmap.paintOpacity = 185;
        statusBarBitmap.fillRect(0, 0, this.width - this.frameWidth * 2, this.statusBarHeight, '#000000'); // Чёрный фон
        statusBarBitmap.paintOpacity = 255;

        // Настраиваем шрифт для статуса имени босса
        statusBarBitmap.fontSize = 64;
        statusBarBitmap.textColor = '#FFFFFF'; // Белый текст
        statusBarBitmap.outlineColor = 'rgba(0, 0, 0, 0)'; // Убираем обводку
        statusBarBitmap.outlineWidth = 0; // Убираем ширину обводки
        statusBarBitmap.drawText(this._enemy.name(), 10, 0, 200, this.statusBarHeight, 'left'); // Имя босса

        // Создаём статусбар как фоновый спрайт
        this._statusBar = new Sprite(statusBarBitmap);
        this._statusBar.x = this.frameWidth;
        this._statusBar.y = this.height - this.statusBarHeight - this.frameWidth; // Располагаем статусбар внизу рамки
        this.addChild(this._statusBar);

        // Создаём отдельный спрайт для текста здоровья
        this._hpTextSprite = new Sprite(new Bitmap(200, this.statusBarHeight)); // Задаём размеры под текст здоровья
        this._hpTextSprite.bitmap.fontSize = 64; // Размер шрифта
        this._hpTextSprite.bitmap.textColor = '#FFFFFF'; // Цвет текста
        this._hpTextSprite.bitmap.outlineColor = 'rgba(0, 0, 0, 0)'; // Убираем обводку
        this._hpTextSprite.bitmap.outlineWidth = 0; // Убираем ширину обводки

        // Расположение текста здоровья
        this._hpTextSprite.x = this.width / 2 - 200; // Отступ от правого края статусбара
        this._hpTextSprite.y = 0; // Сместить ниже внутри статусбара

        this._statusBar.addChild(this._hpTextSprite);

        // Инициализируем текст здоровья
        this.updateHealthText();
    }

    updateHealthText() {
        const bitmap = this._hpTextSprite.bitmap;
        bitmap.clear(); // Очищаем только область текста здоровья
        const hpText = `${this._enemy.hp}/${this._enemy.mhp}`;
        bitmap.drawText(hpText, 0, 0, 200, this.statusBarHeight, 'right'); // Рисуем здоровье
    }

    updateBitmap() {
        super.updateBitmap();
        if (this._bossImage && this.bitmap && this.bitmap.width && this.bitmap.height) {
            // Размеры рамки
            const frameWidth = this.width - this.frameWidth * 2;
            const frameHeight = this.height - this.frameWidth - this.frameHeader;

            const scaleX = frameWidth / this.bitmap.width;
            const scaleY = frameHeight / this.bitmap.height;

            // Применяем масштабирование
            this._bossImage.scale.x = scaleX;
            this._bossImage.scale.y = scaleY;
        }
    }

    update() {
        super.update();
        this.updateHealthText();
    }
}

class ActorInterface extends Sprite_Actor {
    constructor(actor) {
        super(actor);
    }

    initialize(battler) {
        super.initialize(battler);
        // this.createActorImage();
        this.createFrame();
        this.createStatusBar();
    }

    get width() {
        return 550;
    }

    get height() {
        return 374;
    }

    get frameThickness() {
        return 1;
    }

    get statusBarHeight() {
        return 78;
    }

    createFrame() {
        const bitmap = new Bitmap(this.width, this.height);

        bitmap.fillRect(0, 0, this.width, this.height, '#002F72');

        this.anchor.set(0, 0);

        this.bitmap = bitmap;
    }

    createMainSprite() {
        super.createMainSprite();

        this._mainSprite.x = this.frameThickness;
        this._mainSprite.y = this.frameThickness;
        this._mainSprite.anchor.set(0, 0);
    }

    createStatusBar() {
        const statusBarBitmap = new Bitmap(this.width - this.frameThickness * 2, this.statusBarHeight);

        // Рисуем полупрозрачный фон
        statusBarBitmap.paintOpacity = 185;
        statusBarBitmap.fillRect(0, 0, this.width - this.frameThickness * 2, this.statusBarHeight, '#000000'); // Чёрный фон
        statusBarBitmap.paintOpacity = 255;

        // Настраиваем шрифт для статуса имени босса
        statusBarBitmap.fontSize = 64;
        statusBarBitmap.textColor = '#FFFFFF'; // Белый текст
        statusBarBitmap.outlineColor = 'rgba(0, 0, 0, 0)'; // Убираем обводку
        statusBarBitmap.outlineWidth = 0; // Убираем ширину обводки
        statusBarBitmap.drawText('You', 10, 0, 200, this.statusBarHeight, 'left'); // Имя босса

        // Создаём статусбар как фоновый спрайт
        this._statusBar = new Sprite(statusBarBitmap);
        this._statusBar.x = this.frameThickness;
        this._statusBar.y = this.frameThickness; // Располагаем статусбар внизу рамки
        this.addChild(this._statusBar);

        // Создаём отдельный спрайт для текста здоровья
        this._hpTextSprite = new Sprite(new Bitmap(this.width - this.frameThickness * 2, this.statusBarHeight)); // Задаём размеры под текст здоровья
        this._hpTextSprite.bitmap.fontSize = 64; // Размер шрифта
        this._hpTextSprite.bitmap.textColor = '#FFFFFF'; // Цвет текста
        this._hpTextSprite.bitmap.outlineColor = 'rgba(0, 0, 0, 0)'; // Убираем обводку
        this._hpTextSprite.bitmap.outlineWidth = 0; // Убираем ширину обводки

        // Расположение текста здоровья
        this._hpTextSprite.x = -10; // Отступ от правого края статусбара
        this._hpTextSprite.y = 0; // Сместить ниже внутри статусбара

        this._statusBar.addChild(this._hpTextSprite);

        // Инициализируем текст здоровья
        this.updateHealthText();
    }

    updateBitmap() {
        // Sprite_Battler.prototype.updateBitmap.call(this);
        super.updateBitmap();

        if (this._mainSprite && this._mainSprite.bitmap && this._mainSprite.bitmap.width && this._mainSprite.bitmap.height) {
            // Размеры рамки
            const frameWidth = this.width - this.frameThickness * 2;
            const frameHeight = this.height - this.frameThickness * 2;

            const scaleX = frameWidth / this._mainSprite.bitmap.width;
            const scaleY = frameHeight / this._mainSprite.bitmap.height;

            // Применяем масштабирование
            this._mainSprite.scale.x = scaleX * 9; // since it's animation
            this._mainSprite.scale.y = scaleY * 6;
        }
    }

    updateHealthText() {
        const bitmap = this._hpTextSprite.bitmap;
        bitmap.clear(); // Очищаем только область текста здоровья
        const hpText = `${this._actor.hp}/${this._actor.mhp}`;
        bitmap.drawText(hpText, 0, 0, this.width - this.frameThickness * 2, this.statusBarHeight, 'right'); // Рисуем здоровье
    }

    update() {
        super.update();
        this.updateHealthText();
    }
}

(function() {
    const _Spriteset_Battle_createEnemies = Spriteset_Battle.prototype.createEnemies;
    Spriteset_Battle.prototype.createEnemies = function() {
        this._enemySprites = [];
        const enemies = $gameTroop.members();

        enemies.forEach((enemy) => {
            const sprite = new BossInterface(enemy);

            sprite._homeX = Graphics.width - sprite.width - OVERLAY_HEIGHT + 15;
            sprite._homeY = OVERLAY_HEIGHT + 15;

            this._enemySprites.push(sprite);
            this._battleField.addChild(sprite);
        });
    };

    // Добавляем рамки к герою
    const _Spriteset_Battle_createActors = Spriteset_Battle.prototype.createActors;
    Spriteset_Battle.prototype.createActors = function() {
        this._actorSprites = [];

        $gameParty.members().forEach((actor, index) => {
            const sprite = new ActorInterface(actor);

            // Расположим героя в нижнем правом углу
            sprite._homeX = Graphics.boxWidth - (sprite.width + 50) * (index + 1); // Отступ от правого края
            sprite._homeY = Graphics.boxHeight - sprite.height - 50; // Отступ от нижнего края

            this._actorSprites.push(sprite);
            this._battleField.addChild(sprite);
        });
    };

    // Настраиваем поле боя
    const _Spriteset_Battle_createBattleField = Spriteset_Battle.prototype.createBattleField;
    Spriteset_Battle.prototype.createBattleField = function() {
        _Spriteset_Battle_createBattleField.call(this);
        this._battleField.x = 0;
        this._battleField.y = 0;
    };

    // Блокируем стандартное позиционирование спрайтов
    // const _Sprite_Battler_updatePosition = Sprite_Battler.prototype.updatePosition;
    // Sprite_Battler.prototype.updatePosition = function() {
    //     // Отключаем стандартное позиционирование
    // };

    Window_ActorCommand.prototype.initialize = function() {
        Window_Command.prototype.initialize.call(this, 0, 15);
        this.openness = 0;
        this.deactivate();
        this._actor = null;
    }

    Scene_Battle.prototype.createStatusWindow = function() {
        this._statusWindow = new EmptyStatusWindow(); // Используем заглушку
        this.addWindow(this._statusWindow);
    };
})();
