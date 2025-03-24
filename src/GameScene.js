class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.turnos = 0;
        this.puntos = 0;
        this.startTime = 0;
        this.cards = [];
        this.selectedCards = [];
        this.CARD_WIDTH = 768;
        this.CARD_HEIGHT = 1063;
        this.SCALE = 0.14;
        this.CARD_SPACING = 40;
        this.CARD_DISPLAY_WIDTH = this.CARD_WIDTH * this.SCALE;
        this.START_Y = 300;
        this.NUM_CARDS = 5;
    }

    init(data) {
        this.playerName = data.playerName;
    }

    preload() {
        if (this.textures.exists('background')) {
            return;
        }
        this.load.image('cardBack', 'assets/cardBack.png');
        this.load.image('plus', 'assets/plus.png');
        this.load.image('minus', 'assets/minus.png');
        this.load.image('background', 'assets/background.png');

        for (let i = 1; i <= 10; i++) {
            this.load.image(`card${i}`, `assets/card${i}.png`);
        }

        this.load.audio('correctSound', 'assets/correct.wav');
        this.load.audio('wrongSound', 'assets/wrong.ogg');
    }

    create() {
        this.turnos = 0;
        this.puntos = 0;
        this.turnosText = this.add.text(20, 20, "Turnos: " + this.turnos, { fontSize: '24px', fill: '#fff' });
        this.turnosText.setDepth(10);

        this.puntosText = this.add.text(780, 20, "Puntos: " + this.puntos, { fontSize: '24px', fill: '#fff' }).setOrigin(1, 0);
        this.puntosText.setDepth(10);

        this.startTime = Date.now();

        this.add.image(400, 300, 'background').setScale(1).setDepth(0);

        const totalCardsWidth = this.CARD_DISPLAY_WIDTH * this.NUM_CARDS;
        const totalSpacing = this.CARD_SPACING * (this.NUM_CARDS - 1);
        const totalWidth = totalCardsWidth + totalSpacing;
        const startX = (800 - totalWidth) / 2 + this.CARD_DISPLAY_WIDTH / 2;

        this.operation = (Math.random() < 0.5) ? 'plus' : 'minus';
        this.add.image(400, 100, this.operation).setScale(1.2).setDepth(1).setName('operationImage');

        this.resultText = this.add.text(400, 50, "", { fontSize: '32px', fill: '#fff' }).setOrigin(0.5).setDepth(1);
        this.newRound(); // Simplificado: no necesita startX como argumento
    }

    generateCards() {
        let cards = [];
        let availableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        for (let i = 0; i < this.NUM_CARDS; i++) {
            let randomIndex = Phaser.Math.Between(0, availableNumbers.length - 1);
            let value = availableNumbers[randomIndex];
            Phaser.Utils.Array.RemoveAt(availableNumbers, randomIndex);
            cards.push({
                value: value,
                sprite: null,
                isSelected: false,
                text: null // Añadido: buena práctica inicializar text
            });
        }
        Phaser.Utils.Array.Shuffle(cards);

        let index1 = Phaser.Math.Between(0, this.NUM_CARDS - 1);
        let index2 = Phaser.Math.Between(0, this.NUM_CARDS - 1);
        while (index2 === index1) {
            index2 = Phaser.Math.Between(0, this.NUM_CARDS - 1);
        }

        let num1 = cards[index1].value;
        let num2 = cards[index2].value;

        if (this.operation === 'minus') {
            this.correctResult = Math.max(num1, num2) - Math.min(num1, num2);
        } else {
            this.correctResult = num1 + num2;
        }

        return cards;
    }

    cleanCards() {
        for (let card of this.cards) {
            if (card.sprite) {
                card.sprite.destroy();
                card.sprite = null; // Buena práctica
            }
            if (card.text) {
                card.text.destroy();
                card.text = null; // Buena práctica
            }
        }
        this.cards = []; //  Vacía el array DESPUÉS de destruir los objetos.
    }

    drawCards() {
        const totalCardsWidth = this.CARD_DISPLAY_WIDTH * this.NUM_CARDS;
        const totalSpacing = this.CARD_SPACING * (this.NUM_CARDS - 1);
        const totalWidth = totalCardsWidth + totalSpacing;
        const startX = (800 - totalWidth) / 2 + this.CARD_DISPLAY_WIDTH / 2; //Calculamos el startX

        for (let i = 0; i < this.NUM_CARDS; i++) {
            const card = this.cards[i];
            const cardSprite = this.add.sprite(startX + (i * (this.CARD_DISPLAY_WIDTH + this.CARD_SPACING)), this.START_Y, 'card' + card.value).setInteractive();
            cardSprite.setScale(this.SCALE);
            card.sprite = cardSprite;
            cardSprite.setDepth(1);

            cardSprite.on('pointerdown', () => this.selectCard(card));

            const numberText = this.add.text(0, 0, card.value, {
                fontSize: '48px',
                fill: '#000',
                fontFamily: 'Arial',
                fontWeight: 'bold'
            }).setOrigin(0.5);

            card.text = numberText;
            numberText.setDepth(2);
            Phaser.Display.Align.In.Center(numberText, cardSprite);
        }
    }

    selectCard(card) {
        if (this.isProcessing) {
            return;
        }
        if (card.isSelected) {
            card.isSelected = false;
            card.sprite.clearTint();
            Phaser.Utils.Array.Remove(this.selectedCards, card);
        } else if (this.selectedCards.length < 2) {
            card.isSelected = true;
            card.sprite.setTint(0x00ff00);
            this.selectedCards.push(card);

            if (this.selectedCards.length === 2) {
                this.checkSolution();
            }
        }
    }

    checkSolution() {
        this.isProcessing = true;
        let result;
        if (this.operation === 'plus') {
            result = this.selectedCards[0].value + this.selectedCards[1].value;
        } else {
            result = Math.max(this.selectedCards[0].value, this.selectedCards[1].value) - Math.min(this.selectedCards[0].value, this.selectedCards[1].value);
        }

        if (result === this.correctResult) {
            console.log("¡Correcto!");
            this.sound.play('correctSound');
            this.puntos += 1;
            this.puntosText.setText("Puntos: " + this.puntos);

            this.selectedCards.forEach(card => {
                this.tweens.add({
                    targets: card.sprite,
                    scale: card.sprite.scale * 1.2,
                    duration: 100,
                    yoyo: true,
                    ease: 'Sine.easeInOut'
                });
            });

        } else {
            console.log("Incorrecto");
            this.sound.play('wrongSound');
            this.turnos += 1;
            this.turnosText.setText("Turnos: " + this.turnos);
            this.puntos -= 3;
            this.puntosText.setText("Puntos: " + this.puntos);
            this.selectedCards.forEach(card => {
                card.sprite.setTint(0xff0000);
            });
        }

        setTimeout(() => {
            this.selectedCards.forEach(card => {
                card.isSelected = false;
                card.sprite.clearTint();
            });
            this.selectedCards = [];

            if (this.puntos < 0) {
                this.scene.start('GameOverScene');
            } else if (this.puntos >= 10) {
                const elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
                this.scene.start('WinScene', { time: elapsedTime, score: this.puntos, playerName: this.playerName });
            } else {
                this.newRound();
            }
            this.isProcessing = false;
        }, 1000);
    }


    newRound() {
        this.operation = (Math.random() < 0.5) ? 'plus' : 'minus';
        let operacion = this.children.getByName('operationImage'); //Busca un elemento en la escena por su nombre
        if (operacion) {
            operacion.setTexture(this.operation); //Establece la nueva textura
        }
        else{
            this.add.image(400, 100, this.operation).setScale(1.2).setDepth(1).setName('operationImage'); // Operación
        }
        this.cleanCards(); // Primero, destruye las cartas antiguas
        this.cards = this.generateCards(); // Genera nuevas cartas
        this.drawCards(); // Dibuja las nuevas cartas
        this.updateResultText();
        this.selectedCards = [];
    }

    updateResultText() {
        this.resultText.setText("Resultado: " + this.correctResult);
    }
}

export default GameScene;
