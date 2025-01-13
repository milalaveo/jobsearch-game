const ENEMY_HORIZONTAL_BG_PADDING = 82;
const ENEMY_VERTICAL_BOTTOM_OFFSET = 120;

(function() {
    // Добавляем рамки к врагам
    const _Spriteset_Battle_createEnemies = Spriteset_Battle.prototype.createEnemies;
    Spriteset_Battle.prototype.createEnemies = function() {
        this._enemySprites = [];
        const enemies = $gameTroop.members();

        enemies.forEach((enemy) => {
            const sprite = new Sprite_Enemy(enemy);
            let isLoaded = false;

            // Устанавливаем позицию в центр
            sprite.x = Graphics.boxWidth / 2;
            sprite.y = Graphics.boxHeight - ENEMY_VERTICAL_BOTTOM_OFFSET;

            const originalUpdate = sprite.update;
            sprite.update = function () {
                originalUpdate.call(this);

                if (isLoaded) return;

                if (this.bitmap && this.bitmap.width > 0 && this.bitmap.height > 0) {
                    isLoaded = true;
                    this.setFrame(0, 0, this.bitmap.width, this.bitmap.height);

                    const scaleX = (Graphics.boxWidth - ENEMY_HORIZONTAL_BG_PADDING * 2) / this.bitmap.width;
                    const scaleY = (Graphics.boxHeight - ENEMY_VERTICAL_BOTTOM_OFFSET / 2) / this.bitmap.height;
                    this.scale.set(scaleX, scaleY);
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

            // Расположим героя в нижнем правом углу
            sprite.x = screenWidth - 150 * (index + 1); // Отступ от правого края
            sprite.y = screenHeight - 150; // Отступ от нижнего края
            sprite.scale.x = 1; // Уменьшаем размер окна
            sprite.scale.y = 1;

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
    const _Sprite_Battler_updatePosition = Sprite_Battler.prototype.updatePosition;
    Sprite_Battler.prototype.updatePosition = function() {
        // Отключаем стандартное позиционирование
    };
})();
