const ACTOR_ZOOM_WINDOW_OFFSET_BOTTOM = 121;
const ACTOR_ZOOM_WINDOW_OFFSET_RIGHT = 521;

const ACTOR_HP_WIDTH = 150;
const ACTOR_HP_HEIGHT = 30;

const OVERLAY_HEIGHT = 50;

(function() {
    const generateBossStatusBar = function(width) {
        const bossStatusSprite = new Sprite(new Bitmap(width, 50)); // Размер плашки
        bossStatusSprite.x = 10; // Позиция X
        bossStatusSprite.y = 10; // Позиция Y
        bossStatusSprite.bitmap.fontSize = 20; // Размер шрифта

        return bossStatusSprite;
    }

    // Добавляем рамки к врагам
    const _Spriteset_Battle_createEnemies = Spriteset_Battle.prototype.createEnemies;
    Spriteset_Battle.prototype.createEnemies = function() {
        this._enemySprites = [];
        const enemies = $gameTroop.members();

        enemies.forEach((enemy) => {
            const sprite = new Sprite_Enemy(enemy);
            let isLoaded = false;

            const originalUpdate = sprite.update;
            const self = this;
            sprite.update = function () {
                originalUpdate.call(this);

                if (isLoaded) return;

                if (this.bitmap && this.bitmap.width > 0 && this.bitmap.height > 0) {
                    isLoaded = true;
                    // добавление плашек и прочего
                    this.x = Graphics.boxWidth - this.bitmap.width / 2 - OVERLAY_HEIGHT;
                    this.y = this.bitmap.height + OVERLAY_HEIGHT;
                    const overlayBitmap = new Bitmap(this.bitmap.width, OVERLAY_HEIGHT);
                    const overlaySprite = new Sprite(overlayBitmap); // Спрайт для наложения

                    overlayBitmap.fontSize = 62;
                    overlaySprite.x = -this.bitmap.width / 2;
                    overlaySprite.y = -OVERLAY_HEIGHT;

                    const updateEnemyOverlay = () => {
                        const hpText = `${enemy.hp}/${enemy.mhp}`;
                        overlayBitmap.clear(); // Очищаем предыдущее значение
                        overlayBitmap.paintOpacity = 185; // Устанавливаем прозрачность (72%)
                        overlayBitmap.fillRect(0, 0, this.bitmap.width, OVERLAY_HEIGHT, '#000000');
                        overlayBitmap.paintOpacity = 255; // Возвращаем непрозрачность для содержимого
                        overlayBitmap.drawText(enemy.name(), 0, 0, this.bitmap.width / 2, 50, 'left');
                        overlayBitmap.drawText(hpText, 0, 0, this.bitmap.width / 2, 50, 'right');
                    }

                    updateEnemyOverlay();

                    self._hpSprites.push(updateEnemyOverlay); // Храним спрайт и героя

                    this.addChild(overlaySprite);
                }
            }

            this._enemySprites.push(sprite);

            this._battleField.addChild(sprite);
        });
    };

    // Добавляем рамки к герою
    const _Spriteset_Battle_createActors = Spriteset_Battle.prototype.createActors;
    Spriteset_Battle.prototype.createActors = function() {
        this._actorSprites = [];
        const screenWidth = Graphics.boxWidth;
        const screenHeight = Graphics.boxHeight;

        $gameParty.members().forEach((actor, index) => {
            const sprite = new Sprite_Actor(actor);
            let isLoaded = false;

            // Расположим героя в нижнем правом углу
            sprite.x = screenWidth - ACTOR_ZOOM_WINDOW_OFFSET_RIGHT * (index + 1); // Отступ от правого края
            sprite.y = screenHeight - ACTOR_ZOOM_WINDOW_OFFSET_BOTTOM; // Отступ от нижнего края

            // Создаём спрайт для здоровья
            const hpSprite = new Sprite(new Bitmap(ACTOR_HP_WIDTH, ACTOR_HP_HEIGHT));
            hpSprite.bitmap.fontSize = 30;
            hpSprite.x = sprite.x - ACTOR_HP_HEIGHT;
            hpSprite.y = sprite.y - ACTOR_HP_WIDTH;

            const originalUpdate = sprite.update;
            sprite.update = function () {
                originalUpdate.call(this);

                if (isLoaded) return;

                if (this.bitmap && this.bitmap.width > 0 && this.bitmap.height > 0) {
                    isLoaded = true;
                    // добавление плашек и прочего
                }
            }

            this._actorSprites.push(sprite);
            this._battleField.addChild(sprite);
            this._hpSprites.push(() => {
                const hpText = `${actor.hp}/${actor.mhp}`;
                hpSprite.bitmap.clear(); // Очищаем предыдущее значение
                hpSprite.bitmap.drawText(hpText, 0, 0, ACTOR_HP_WIDTH, ACTOR_HP_HEIGHT, 'right');
            }); // Храним спрайт и героя
            this._battleField.addChild(hpSprite);
        });
    };

    // Настраиваем поле боя
    const _Spriteset_Battle_createBattleField = Spriteset_Battle.prototype.createBattleField;
    Spriteset_Battle.prototype.createBattleField = function() {
        _Spriteset_Battle_createBattleField.call(this);
        this._battleField.x = 0;
        this._battleField.y = 0;
    };

    // Массив для хранения спрайтов здоровья
    Spriteset_Battle.prototype._hpSprites = [];

    // Блокируем стандартное позиционирование спрайтов
    const _Sprite_Battler_updatePosition = Sprite_Battler.prototype.updatePosition;
    Sprite_Battler.prototype.updatePosition = function() {
        // Отключаем стандартное позиционирование
    };

    // Метод для обновления всех спрайтов здоровья
    Spriteset_Battle.prototype.updateHealthSprites = function() {
        this._hpSprites.forEach(entry => entry());
    };

    // Вызываем обновление здоровья в нужных местах
    const _Window_BattleStatus_drawItem = Window_BattleStatus.prototype.drawItem;
    Window_BattleStatus.prototype.drawItem = function(index) {
        _Window_BattleStatus_drawItem.call(this, index);

        // Обновляем спрайты здоровья при вызове drawItem
        if (SceneManager._scene._spriteset) {
            SceneManager._scene._spriteset.updateHealthSprites();
        }
    };

    Window_PartyCommand.prototype.initialize = function() {
        Window_Command.prototype.initialize.call(this, 0, 15);
        this.openness = 0;
        this.deactivate();
    };
})();
