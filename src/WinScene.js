class WinScene extends Phaser.Scene {
    constructor() {
        super('WinScene');
    }

    init(data) {
        this.elapsedTime = data.time;
        this.score = data.score; // Aunque no lo uses directamente, podría ser útil tenerlo.
        this.playerName = data.playerName;
    }

    create() {
        this.add.rectangle(0, 0, 800, 600, 0x000000).setOrigin(0); // Fondo

        // --- Título ---
        this.add.text(400, 50, 'Mejores Puntuaciones', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5).setDepth(2);

        // --- Cargar y Actualizar Puntuaciones ---
        this.loadHighScores();
        this.updateHighScores(this.playerName, this.elapsedTime, this.score); // Añade la nueva puntuación

        // --- Mostrar Puntuaciones ---
        this.displayHighScores();

        // --- Botón para Volver a Jugar ---
        const playAgainButton = this.add.text(400, 550, 'Volver al Inicio', { fontSize: '24px', fill: '#fff', backgroundColor: '#228B22' }).setOrigin(0.5).setDepth(2).setInteractive(); //Más abajo

        playAgainButton.on('pointerdown', () => {
            this.scene.start('InitScene'); // Volver a la escena de inicio
        });
    }
    loadHighScores() {
        // 1. Cargar puntuaciones existentes (o inicializar si no hay)
        this.highScores = JSON.parse(localStorage.getItem('highScores')) || [];

        // 2. Si no hay puntuaciones, o hay menos de 10, crear las iniciales.
        if (this.highScores.length < 10) {
            this.initializeHighScores();
        }
    }

    initializeHighScores() {
        // Usamos una fecha fija: 23 de marzo de 2025
        const formattedDate = '2025-03-23 00:00:00'; // Puedes poner la hora que quieras
    
        // Puntuaciones por defecto (si no hay guardadas)
        const defaultScores = [];
        for (let i = 0; i < 10; i++) {
            defaultScores.push({
                name: 'La Urraca Paca',
                time: 100 + (i * 10),
                score: 10,
                date: formattedDate  // ¡Usar la fecha fija!
            });
        }
    
        this.highScores = defaultScores;
        localStorage.setItem('highScores', JSON.stringify(this.highScores));
    }


    updateHighScores(playerName, time, score) {
        const now = new Date();
        const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

        // Añadir la nueva puntuación
        this.highScores.push({ name: playerName, time: time, score: score, date: formattedDate });

        // Ordenar por tiempo (menor a mayor)
        this.highScores.sort((a, b) => a.time - b.time);

        // Mantener solo las 10 mejores
        this.highScores = this.highScores.slice(0, 10);

        // Guardar en localStorage
        localStorage.setItem('highScores', JSON.stringify(this.highScores));
    }

    displayHighScores() {
        let y = 100; // Posición Y inicial
        for (let i = 0; i < this.highScores.length; i++) {
            const score = this.highScores[i];
            let textColor = '#fff'; // Color por defecto (blanco)

            // Resaltar la puntuación del jugador actual
            if (score.name === this.playerName && score.time === this.elapsedTime) {
                textColor = '#0f0'; // Verde para la puntuación del jugador
            }

            const text = `${i + 1}. ${score.name}: ${score.time}s Puntos: ${score.score} Fecha: ${score.date}`;
            this.add.text(100, y, text, { fontSize: '20px', fill: textColor }).setDepth(2);
            y += 40; // Espacio entre líneas
        }
    }
}

export default WinScene;