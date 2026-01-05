// UI Controller for OCaml Football Monopoly
class GameUI {
    constructor() {
        this.game = window.FootballMonopolyOCaml;
        this.gameStarted = false;
        this.numPlayers = 2;
        this.playerNames = ['Manager 1', 'Manager 2'];
    }

    init() {
        this.setupEventListeners();
        this.updateUI();
    }

    setupEventListeners() {
        document.getElementById('startGameBtn').addEventListener('click', () => this.startGame());
        document.getElementById('rollDiceBtn').addEventListener('click', () => this.rollDice());
        document.getElementById('buyPropertyBtn').addEventListener('click', () => this.buyProperty());
        document.getElementById('buyYouthBtn').addEventListener('click', () => this.buyYouth());
        document.getElementById('buyStarBtn').addEventListener('click', () => this.buyStar());
        document.getElementById('endTurnBtn').addEventListener('click', () => this.endTurn());

        // Click on spaces to view details
        document.querySelectorAll('.space').forEach(space => {
            space.addEventListener('click', () => {
                const position = parseInt(space.dataset.position);
                this.showPropertyDetails(position);
            });
        });
    }

    startGame() {
        const success = this.game.startGame(this.numPlayers, this.playerNames);
        if (success) {
            this.gameStarted = true;
            document.getElementById('rollDiceBtn').disabled = false;
            document.getElementById('startGameBtn').disabled = true;
            this.showMessage('Game started! Roll the dice to begin.', 'success');
            this.updateUI();
        }
    }

    rollDice() {
        if (!this.gameStarted) return;

        const result = this.game.rollDice();
        if (result.success) {
            // Disable roll button until turn ends
            document.getElementById('rollDiceBtn').disabled = true;
            document.getElementById('endTurnBtn').disabled = false;

            // Show dice animation
            const die1 = Math.floor(Math.random() * 6) + 1;
            const die2 = Math.floor(Math.random() * 6) + 1;
            document.getElementById('die1').textContent = die1;
            document.getElementById('die2').textContent = die2;

            this.showMessage(`Rolled ${die1} + ${die2} = ${die1 + die2}`, 'info');

            // Highlight landing space
            setTimeout(() => {
                this.highlightSpace(result.position);
                this.updateUI();
            }, 500);

            // Check for winner
            if (result.winner) {
                this.showMessage(`🏆 ${result.winner} wins the game!`, 'success');
                this.endGame();
            }
        }
    }

    buyProperty() {
        if (!this.gameStarted) return;

        const result = this.game.buyProperty();
        if (result.success) {
            this.showMessage('Club purchased successfully!', 'success');
            document.getElementById('buyPropertyBtn').disabled = true;
            this.updateUI();
        } else {
            this.showMessage('Cannot buy this property', 'error');
        }
    }

    buyYouth() {
        if (!this.gameStarted) return;

        const result = this.game.buyYouth();
        if (result.success) {
            this.showMessage('Youth player signed!', 'success');
            this.updateUI();
        } else {
            this.showMessage('Cannot buy youth player', 'error');
        }
    }

    buyStar() {
        if (!this.gameStarted) return;

        const result = this.game.buyStar();
        if (result.success) {
            this.showMessage('Star player signed! ⭐', 'success');
            this.updateUI();
        } else {
            this.showMessage('Cannot buy star player', 'error');
        }
    }

    endTurn() {
        if (!this.gameStarted) return;

        const result = this.game.endTurn();
        if (result.success) {
            // Re-enable roll button for next player
            document.getElementById('rollDiceBtn').disabled = false;
            document.getElementById('endTurnBtn').disabled = true;
            document.getElementById('buyPropertyBtn').disabled = true;
            document.getElementById('buyYouthBtn').disabled = true;
            document.getElementById('buyStarBtn').disabled = true;

            this.updateUI();

            const player = this.game.getCurrentPlayer();
            this.showMessage(`${player.name}'s turn`, 'info');
        }
    }

    updateUI() {
        if (!this.gameStarted) return;

        // Update current player
        const player = this.game.getCurrentPlayer();
        document.getElementById('currentPlayerName').textContent = player.name;

        // Update players list
        this.updatePlayersList();

        // Update board spaces
        this.updateBoard();

        // Update player tokens
        this.updateTokens();

        // Update action buttons
        this.updateActionButtons();
    }

    updatePlayersList() {
        const players = this.game.getPlayers();
        const list = document.getElementById('playersList');
        list.innerHTML = players.map((p, i) => {
            const isCurrent = p.id === this.game.getCurrentPlayer().id;
            return `
                <div class="player-card ${isCurrent ? 'active' : ''} ${p.bankrupt ? 'bankrupt' : ''}">
                    <div class="player-name">${p.name} ${isCurrent ? '👈' : ''}</div>
                    <div class="player-money">💰 ${p.money} FC</div>
                    <div class="player-properties">🏟️ ${p.properties.length} clubs</div>
                    ${p.bankrupt ? '<div class="player-status">💔 BANKRUPT</div>' : ''}
                </div>
            `;
        }).join('');
    }

    updateBoard() {
        const board = this.game.getBoard();
        board.forEach(space => {
            const element = document.querySelector(`[data-position="${space.position}"]`);
            if (element && space.owner !== null && space.owner !== undefined) {
                element.classList.add('owned');
                element.dataset.owner = space.owner;

                // Update development indicators
                const indicators = element.querySelector('.dev-indicators') || this.createIndicators(element);
                indicators.innerHTML = '';

                // Show youth players
                for (let i = 0; i < space.youthPlayers; i++) {
                    const youth = document.createElement('span');
                    youth.className = 'youth-indicator';
                    youth.textContent = '⚽';
                    indicators.appendChild(youth);
                }

                // Show star player
                if (space.hasStar) {
                    const star = document.createElement('span');
                    star.className = 'star-indicator';
                    star.textContent = '⭐';
                    indicators.appendChild(star);
                }
            }
        });
    }

    createIndicators(element) {
        const indicators = document.createElement('div');
        indicators.className = 'dev-indicators';
        element.appendChild(indicators);
        return indicators;
    }

    updateTokens() {
        // Remove old tokens
        document.querySelectorAll('.player-token').forEach(t => t.remove());

        // Add new tokens
        const players = this.game.getPlayers();
        players.forEach((player, index) => {
            if (player.bankrupt) return;

            const space = document.querySelector(`[data-position="${player.position}"]`);
            if (space) {
                const token = document.createElement('div');
                token.className = `player-token player-${index + 1}`;
                token.textContent = ['🔴', '🔵', '🟢', '🟡'][index] || '⚫';
                space.appendChild(token);
            }
        });
    }

    updateActionButtons() {
        const player = this.game.getCurrentPlayer();
        const board = this.game.getBoard();
        const currentSpace = board.find(s => s.position === player.position);

        // Enable buy property if on unowned property
        const canBuyProperty = currentSpace &&
                               currentSpace.owner === null &&
                               currentSpace.name !== 'START' &&
                               !currentSpace.name.includes('Transfer') &&
                               !currentSpace.name.includes('Match Day') &&
                               !currentSpace.name.includes('WINDOW');

        document.getElementById('buyPropertyBtn').disabled = !canBuyProperty;

        // Enable buy youth/star if on owned property
        const canDevelop = currentSpace && currentSpace.owner === player.id;
        document.getElementById('buyYouthBtn').disabled = !canDevelop || currentSpace.youthPlayers >= 4;
        document.getElementById('buyStarBtn').disabled = !canDevelop || currentSpace.hasStar || currentSpace.youthPlayers < 4;
    }

    highlightSpace(position) {
        document.querySelectorAll('.space').forEach(s => s.classList.remove('landing'));
        const space = document.querySelector(`[data-position="${position}"]`);
        if (space) {
            space.classList.add('landing');
            setTimeout(() => space.classList.remove('landing'), 1000);
        }
    }

    showPropertyDetails(position) {
        const board = this.game.getBoard();
        const space = board.find(s => s.position === position);
        if (!space) return;

        const details = document.getElementById('propertyDetails');
        let html = `<h4>${space.name}</h4>`;

        if (space.owner !== null) {
            const owner = this.game.getPlayers()[space.owner];
            html += `<p><strong>Owner:</strong> ${owner.name}</p>`;
            html += `<p><strong>Youth Players:</strong> ${'⚽'.repeat(space.youthPlayers)}</p>`;
            if (space.hasStar) html += `<p><strong>Star Player:</strong> ⭐</p>`;
        } else if (space.name !== 'START') {
            html += `<p>Available for purchase</p>`;
        }

        details.innerHTML = html;
    }

    showMessage(message, type = 'info') {
        const messageEl = document.getElementById('gameMessage');
        messageEl.textContent = message;
        messageEl.className = `game-message ${type}`;

        setTimeout(() => {
            messageEl.className = 'game-message';
        }, 3000);
    }

    endGame() {
        document.getElementById('rollDiceBtn').disabled = true;
        document.getElementById('endTurnBtn').disabled = true;
        document.getElementById('buyPropertyBtn').disabled = true;
        document.getElementById('buyYouthBtn').disabled = true;
        document.getElementById('buyStarBtn').disabled = true;
        document.getElementById('startGameBtn').disabled = false;
        this.gameStarted = false;
    }
}

// Initialize when page loads
window.addEventListener('load', () => {
    const ui = new GameUI();
    ui.init();
    console.log('✓ OCaml Football Monopoly UI loaded!');
});
