class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    create() {
        this.add.rectangle(0, 0, 800, 600, 0x000000).setOrigin(0); //Fondo negro
        const gameOverText = this.add.text(400, 200, 'Game Over', { fontSize: '64px', fill: '#f00' }).setOrigin(0.5).setDepth(2);
        const retryText = this.add.text(400, 300, '¡Inténtalo de nuevo!', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5).setDepth(2);
        const playAgainButton = this.add.text(400, 400, 'Jugar Otra Vez', { fontSize: '24px', fill: '#fff', backgroundColor: '#000' }).setOrigin(0.5).setDepth(2).setInteractive();

        playAgainButton.on('pointerdown', () => {
            this.scene.start('InitScene'); // Volver a la escena de inicio
        });
    }
}

export default GameOverScene;