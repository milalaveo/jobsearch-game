(function() {
    // Добавляем рамки к врагам
    const _Spriteset_Battle_createEnemies = Spriteset_Battle.prototype.createEnemies;
    Spriteset_Battle.prototype.createEnemies = function() {
        this._enemySprites = [];
        const enemies = $gameTroop.members();
        const screenWidth = Graphics.boxWidth;
        const screenHeight = Graphics.boxHeight;
        const windowWidth = screenWidth / Math.min(enemies.length, 3); // Максимум 3 врага в ряду
        const windowHeight = screenHeight / 1; // Верхняя половина экрана

        enemies.forEach((enemy, index) => {
            const sprite = new Sprite_Enemy(enemy);
            const row = Math.floor(index / 3); // Ограничиваем количество в одном ряду
            const col = index % 3;

            sprite.x = col * windowWidth + windowWidth / 2;
            sprite.y = row * windowHeight + windowHeight / 2;
            sprite.scale.x = 1; // Уменьшаем размер спрайта
            sprite.scale.y = 1;

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
