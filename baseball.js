/*
Baseball Pitching Simulation Game
by Devlin from SiteRaw, visit us https://www.siteraw.com
*/

const canvas = document.getElementById('strikeZone');
const ctx = canvas.getContext('2d');
const TILE_WIDTH = 100;
const TILE_HEIGHT = 125;
const BB_SIZE = TILE_WIDTH / 6;
const drawZones = 0; // Visual aid, disabled by default

        // Adjust canvas size to include a buffer area
        canvas.width = TILE_WIDTH * 4.6;
        canvas.height = TILE_HEIGHT * 4.6;

        // Game state
        let gameState = {
            last: '',
            strikes: 0,
            balls: 0,
            outs: 0,
	          onbase: 0,
            pitcherScore: 9,
            opponentScore: 7,
            currentBatter: 0,
            gameOver: false
        };
	let totalscore = [0, 0, 0]; // Hit, Walk, ER
	let apitches = []; // Array to hold pitch data

	function addPitch(x, y, color) {
    	    apitches.push({ x, y, color });
	}
	function clearPitches() {
    	    apitches = []; redrawCanvas(); // Clear all pitches
	}
function drawPitches() {
    apitches.forEach(pitch => {
        ctx.fillStyle = pitch.color;
        ctx.beginPath();
        ctx.arc(pitch.x, pitch.y, BB_SIZE, 0, Math.PI * 2);
        ctx.fill();
    });
}

        // Batting order with positions
        const battingOrder = [
            { name: "Batter 1", position: "2B" },
            { name: "Batter 2", position: "SS" },
            { name: "Batter 3", position: "1B" },
            { name: "Batter 4", position: "DH" },
            { name: "Batter 5", position: "RF" },
            { name: "Batter 6", position: "LF" },
            { name: "Batter 7", position: "C" },
            { name: "Batter 8", position: "3B" },
            { name: "Batter 9", position: "CF" }
        ];

        // Pitch types with movement ranges
        const pitches = {
            fastball: { hMin: -30, hMax: 70, vMin: 15, vMax: -155 },
            cutter: { hMin: -105, hMax: 10, vMin: 55, vMax: -87 },
            sweeper: { hMin: -180, hMax: 15, vMin: 150, vMax: -55 },
            curveball: { hMin: -125, hMax: 11, vMin: 345, vMax: 58 },
            splitter: { hMin: 10, hMax: 115, vMin: 250, vMax: -33 }
        };

        // Draw strike zone grid
        function drawGrid() {
            ctx.strokeStyle = "#5af";
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    ctx.strokeRect(col * TILE_WIDTH + TILE_WIDTH * 0.8, row * TILE_HEIGHT + TILE_HEIGHT * 0.8, TILE_WIDTH, TILE_HEIGHT);
                }
            }
        }

        // Draw homerun zone (center 50%)
        function drawHomeRunZone() {
            ctx.fillStyle = "rgba(255, 100, 100, 0.4)";
            ctx.fillRect((TILE_WIDTH * 4.6 - TILE_WIDTH * 1.5) / 2, (TILE_HEIGHT * 4.6 - TILE_HEIGHT * 1.5) / 2, TILE_WIDTH * 1.5, TILE_HEIGHT * 1.5);
        }

        // Draw expanded homerun zone (2 strikes)
        function drawEHomeRunZone() {
            ctx.fillStyle = "rgba(255, 100, 100, 0.2)";
            ctx.fillRect((TILE_WIDTH * 4.6 - TILE_WIDTH * 1.5 * 1.4) / 2, (TILE_HEIGHT * 4.6 - TILE_HEIGHT * 1.5 * 1.4) / 2, TILE_WIDTH * 1.5 * 1.4, TILE_HEIGHT * 1.5 * 1.4);
        }

        // Draw foul ball zone (center 65%)
        function drawFoulZone() {
            ctx.fillStyle = "rgba(250, 200, 230, 0.3)";
            ctx.fillRect((TILE_WIDTH * 4.6 - TILE_WIDTH * 1.95) / 2, (TILE_HEIGHT * 4.6 - TILE_HEIGHT * 1.95) / 2, TILE_WIDTH * 1.95, TILE_HEIGHT * 1.95);
        }

        // Draw expanded foul ball zone (2 strikes)
        function drawEFoulZone() {
            ctx.fillStyle = "rgba(200, 250, 200, 0.3)";
            ctx.fillRect((TILE_WIDTH * 4.6 - TILE_WIDTH * 1.95 * 1.4) / 2, (TILE_HEIGHT * 4.6 - TILE_HEIGHT * 1.95 * 1.4) / 2, TILE_WIDTH * 1.95 * 1.4, TILE_HEIGHT * 1.95 * 1.4);
        }

        // Draw foul swing zone (center 110%)
        function drawSwingZone() {
            ctx.fillStyle = "rgba(200, 250, 200, 0.2)";
            ctx.fillRect((TILE_WIDTH * 4.6 - TILE_WIDTH * 4) / 2, (TILE_HEIGHT * 4.6 - TILE_HEIGHT * 3.9) / 2, TILE_WIDTH * 4, TILE_HEIGHT * 3.9);
        }

        function redrawCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawGrid();
            if (drawZones) {
		drawFoulZone();
		drawSwingZone();
		drawHomeRunZone();
		drawEFoulZone();
		drawEHomeRunZone();
	    }
        }

        redrawCanvas();
	let baseText = ["No runners", "Runner on 1B", "1B and 2B", "Bases Loaded! Be careful!"];

        // Update game display
        function updateDisplay() {
	    document.getElementById("last").textContent = gameState.last;
            document.getElementById("cstrike").textContent = gameState.strikes;
            document.getElementById("cball").textContent = gameState.balls;
            document.getElementById("outs").textContent = gameState.outs;
	    document.getElementById("onbase").textContent = baseText[gameState.onbase];
            document.getElementById("pscore").textContent = gameState.pitcherScore;
            document.getElementById("oscore").textContent = gameState.opponentScore;
            document.getElementById("batter").textContent = `${battingOrder[gameState.currentBatter].name} (${battingOrder[gameState.currentBatter].position})`;
            document.getElementById("status").textContent = gameState.gameOver ? "Game Over!" : "In Progress";
        }

        // Reset count for new batter
        function resetCount() {
            gameState.strikes = 0;
            gameState.balls = 0;
            updateDisplay();
        }

function bWalk() {
    gameState.onbase++; totalscore[1]++;
    
    // Check if bases are loaded (4 or more runners on base)
    if (gameState.onbase > 3) {
        gameState.opponentScore++; // Score +1
        gameState.onbase--; // Adjust baserunners
    }
}

        // Move to next batter
        function nextBatter() {
            gameState.currentBatter = (gameState.currentBatter + 1) % battingOrder.length;
            resetCount();
        }

        // Check if pitch is in zones
        function isInHomeRunZone(x, y) {
	    let fmult = (gameState.strikes == 2) ? 1.4 : 1; // expand the foul zone
            const homeRunX = (TILE_WIDTH * 4.6 - TILE_WIDTH * 1.5 * fmult) / 2; // X-coordinate of top-left corner
            const homeRunY = (TILE_HEIGHT * 4.6 - TILE_HEIGHT * 1.5 * fmult) / 2; // Y-coordinate of top-left corner
            const homeRunWidth = TILE_WIDTH * 1.5 * fmult; // Width of rectangle
            const homeRunHeight = TILE_HEIGHT * 1.5 * fmult; // Height of rectangle

            return x >= homeRunX && x <= homeRunX + homeRunWidth &&
                   y >= homeRunY && y <= homeRunY + homeRunHeight;
        }

        function isInFoulZone(x, y) {
	    let fmult = (gameState.strikes == 2) ? 1.4 : 1; // expand the foul zone
            const foulZoneX = (TILE_WIDTH * 4.6 - TILE_WIDTH * 1.95 * fmult) / 2; // X-coordinate of top-left corner
            const foulZoneY = (TILE_HEIGHT * 4.6 - TILE_HEIGHT * 1.95 * fmult) / 2; // Y-coordinate of top-left corner
            const foulZoneWidth = TILE_WIDTH * 1.95 * fmult; // Width of rectangle
            const foulZoneHeight = TILE_HEIGHT * 1.95 * fmult; // Height of rectangle

            return x >= foulZoneX && x <= foulZoneX + foulZoneWidth &&
                   y >= foulZoneY && y <= foulZoneY + foulZoneHeight;
        }

        function isInSwingZone(x, y) {
            const swingZoneX = (TILE_WIDTH * 4.6 - TILE_WIDTH * 4) / 2; // X-coordinate of top-left corner
            const swingZoneY = (TILE_HEIGHT * 4.6 - TILE_HEIGHT * 3.9) / 2; // Y-coordinate of top-left corner
            const swingZoneWidth = TILE_WIDTH * 4; // Width of rectangle
            const swingZoneHeight = TILE_HEIGHT * 3.9; // Height of rectangle

            return x >= swingZoneX && x <= swingZoneX + swingZoneWidth &&
                   y >= swingZoneY && y <= swingZoneY + swingZoneHeight;
        }

        function isInStrikeZone(x, y) {
            return x >= TILE_WIDTH * 0.8 && x <= TILE_WIDTH * 3.8 &&
                   y >= TILE_HEIGHT * 0.8 && y <= TILE_HEIGHT * 3.8;
        }

        // Handle pitch logic
        let pitchType = 'fastball';

        document.getElementById('fastball').addEventListener('click', () => pitchType = 'fastball');
        document.getElementById('cutter').addEventListener('click', () => pitchType = 'cutter');
        document.getElementById('sweeper').addEventListener('click', () => pitchType = 'sweeper');
        document.getElementById('curveball').addEventListener('click', () => pitchType = 'curveball');
        document.getElementById('splitter').addEventListener('click', () => pitchType = 'splitter');

        canvas.addEventListener('click', (event) => {
            if (gameState.gameOver) return;

            const rect = canvas.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const clickY = event.clientY - rect.top;

            throwPitch(clickX, clickY);
        });

        function throwPitch(clickX, clickY) {
            let horizontal, vertical;

            // Calculate pitch movement
            switch (pitchType) {
                case 'fastball':
                    horizontal = Math.random() * (pitches.fastball.hMax - pitches.fastball.hMin) + pitches.fastball.hMin;
                    vertical = Math.random() * (pitches.fastball.vMax - pitches.fastball.vMin) + pitches.fastball.vMin;
                    break;
                case 'cutter':
                    horizontal = Math.random() * (pitches.cutter.hMax - pitches.cutter.hMin) + pitches.cutter.hMin;
                    vertical = Math.random() * (pitches.cutter.vMax - pitches.cutter.vMin) + pitches.cutter.vMin;
                    break;
                case 'sweeper':
                    horizontal = Math.random() * (pitches.sweeper.hMax - pitches.sweeper.hMin) + pitches.sweeper.hMin;
                    vertical = Math.random() * (pitches.sweeper.vMax - pitches.sweeper.vMin) + pitches.sweeper.vMin;
                    break;
                case 'curveball':
                    horizontal = Math.random() * (pitches.curveball.hMax - pitches.curveball.hMin) + pitches.curveball.hMin;
                    vertical = Math.random() * (pitches.curveball.vMax - pitches.curveball.vMin) + pitches.curveball.vMin;
                    break;
                case 'splitter':
                    horizontal = Math.random() * (pitches.splitter.hMax - pitches.splitter.hMin) + pitches.splitter.hMin;
                    vertical = Math.random() * (pitches.splitter.vMax - pitches.splitter.vMin) + pitches.splitter.vMin;
                    break;
            }

    if (gameState.strikes === 0 && gameState.balls === 0) {
        clearPitches(); // Clear the pitch circles
    }

            // Calculate final position
            const finalX = Math.min(Math.max(clickX + horizontal, 0), canvas.width);
            const finalY = Math.min(Math.max(clickY + vertical, 0), canvas.height);

            // Draw pitch
            /*ctx.fillStyle = '#ffbbbb';
            ctx.beginPath();
            ctx.arc(clickX, clickY, BB_SIZE, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#66bb77';
            ctx.beginPath();
            ctx.arc(finalX, finalY, BB_SIZE, 0, Math.PI * 2);
            ctx.fill();*/
	    addPitch(clickX, clickY, '#ffbbbb'); addPitch(finalX, finalY, '#66bb77');

	    drawPitches();

	/*apitches.forEach(pitch => {
        ctx.fillStyle = pitch.color;
        ctx.beginPath();
        ctx.arc(pitch.x, pitch.y, BB_SIZE, 0, Math.PI * 2);
        ctx.fill();
    });*/

            // Update display
            document.getElementById("th").textContent = clickX.toFixed(1);
            document.getElementById("tv").textContent = clickY.toFixed(1);
            document.getElementById("rh").textContent = finalX.toFixed(1);
            document.getElementById("rv").textContent = finalY.toFixed(1);

            // Check pitch outcome
            if (isInHomeRunZone(finalX, finalY)) {
		totalscore[0]++;
                gameState.opponentScore += gameState.onbase + 1;
		gameState.onbase = 0; // clear the bases
		gameState.last = "Home Run!";
                nextBatter();
            } else if (isInFoulZone(finalX, finalY)) {
		gameState.last = "Foul!";
                if (gameState.strikes < 2) gameState.strikes++; // Foul can't cause strikeout
            } else if (isInStrikeZone(finalX, finalY)) {
		gameState.last = "Strike!";
                gameState.strikes++;
            } else {
                if(isInSwingZone(finalX, finalY) && isInStrikeZone(clickX, clickY) && gameState.strikes >= 2) {
                    gameState.last = "Swinging Strike!";
                    gameState.strikes++;
                } else {
                    gameState.last = "Ball!";
                    gameState.balls++;
                }
            }

            // Check for walk or strikeout
            if (gameState.balls >= 4) {
		//gameState.opponentScore++;
		bWalk();
                nextBatter();
            } else if (gameState.strikes >= 3) {
                gameState.outs++;
                //gameState.pitcherScore++;
                nextBatter();
            }

            // Check for game over
            if (gameState.outs >= 3) {
                gameState.gameOver = true;
		totalscore[2] = gameState.opponentScore - 7;
	let victext = ["Victory!", 'S'];
	document.getElementById('totalbb').innerHTML = totalscore[1];
	document.getElementById('totalhits').innerHTML = totalscore[0];
	document.getElementById('totalr').innerHTML = totalscore[2];
	document.getElementById('totaler').innerHTML = totalscore[2];
	document.getElementById('totalera').innerHTML = totalscore[2]*9;
		if(totalscore[2] > 2) { victext[0] = "Defeat!"; victext[1] = 'L, BS'; } else if (totalscore[2] == 2) { victext[0] = "Tie!"; victext[1] = 'BS'; }
		document.getElementById('totalsave').innerHTML = victext[1];
		document.getElementById('boxscore').style.display = "block";
            }

            updateDisplay();
        }

        updateDisplay();
