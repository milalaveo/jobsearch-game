const BOSS_ZOOM_WINDOW_OFFSET_TOP = 150;
const BOSS_ZOOM_WINDOW_OFFSET_LEFT = -80;

const ACTOR_ZOOM_WINDOW_OFFSET_BOTTOM = 121;
const ACTOR_ZOOM_WINDOW_OFFSET_RIGHT = 521;

const ACTOR_HP_WIDTH = 150;
const ACTOR_HP_HEIGHT = 30;

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
            sprite.x = Graphics.boxWidth / 2 + BOSS_ZOOM_WINDOW_OFFSET_LEFT;
            sprite.y = Graphics.boxHeight / 2 + BOSS_ZOOM_WINDOW_OFFSET_TOP;

            const originalUpdate = sprite.update;
            sprite.update = function () {
                originalUpdate.call(this);

                if (isLoaded) return;

                if (this.bitmap && this.bitmap.width > 0 && this.bitmap.height > 0) {
                    isLoaded = true;
                    // добавление плашек и прочего
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
        this._hpSprites = []; // Очищаем массив перед созданием
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
            this._hpSprites.push({ sprite: hpSprite, actor: actor }); // Храним спрайт и героя
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
        this._hpSprites.forEach(entry => {
            const { sprite, actor } = entry;
            const hpText = `${actor.hp}/${actor.mhp}`;
            sprite.bitmap.clear(); // Очищаем предыдущее значение
            sprite.bitmap.drawText(hpText, 0, 0, ACTOR_HP_WIDTH, ACTOR_HP_HEIGHT, 'right');
        });
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
})();
