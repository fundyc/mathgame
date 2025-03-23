class InitScene extends Phaser.Scene {
    constructor() {
        super('InitScene');
    }

    create() {
        // --- Título ---
        const titleText = this.add.text(400, 100, 'Ultimate Math Game', {
            fontSize: '64px',
            fill: '#FFD700',
            fontFamily: '"Arial Black", Gadget, sans-serif',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // --- Botón de Jugar (Directamente, sin campo de entrada) ---
        const playButton = this.add.text(400, 250, 'Jugar', { // Ajusta la posición 'y'
            fontSize: '32px',
            fill: '#fff',
            backgroundColor: '#4CAF50',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        playButton.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);

        playButton.on('pointerdown', () => {
            let playerName = prompt("Introduce tu nombre:", "Cool Player");
            if (playerName === null || playerName.trim() === "") {
                playerName = "Cool Player";
            }
            else{
              playerName = playerName.substring(0, 14); // Limitar a 14 caracteres
            }
      
            this.scene.start('GameScene', { playerName: playerName });
        });
    }
}

export default InitScene;