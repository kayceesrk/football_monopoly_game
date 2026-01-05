// UI Controller for OCaml Football Monopoly
class GameUI {
    constructor() {
        this.game = null;
        this.gameStarted = false;
        this.numPlayers = 2;
        this.playerNames = ['Manager 1', 'Manager 2'];
        this.hasRolled = false; // Track if player has rolled this turn
    }

    init() {
        // Wait for OCaml to load
        if (!window.FootballMonopolyOCaml) {
            console.error('FootballMonopolyOCaml not loaded!');
            return;
        }
        this.game = window.FootballMonopolyOCaml;
        this.setupEventListeners();
        this.updateUI();
    }

    setupEventListeners() {
        document.getElementById('startGameBtn').addEventListener('click', () => this.showGameSetup());
        document.getElementById('startGameSubmit').addEventListener('click', () => this.startGame());
        document.getElementById('cancelGameSetup').addEventListener('click', () => this.hideGameSetup());
        document.getElementById('numPlayers').addEventListener('change', () => this.updatePlayerNameInputs());
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

    showGameSetup() {
        document.getElementById('gameSetupForm').style.display = 'block';
        document.getElementById('startGameBtn').style.display = 'none';
        this.updatePlayerNameInputs();
    }

    hideGameSetup() {
        document.getElementById('gameSetupForm').style.display = 'none';
        document.getElementById('startGameBtn').style.display = 'inline-block';
    }

    updatePlayerNameInputs() {
        const numPlayers = parseInt(document.getElementById('numPlayers').value);
        const container = document.getElementById('playerNamesContainer');
        container.innerHTML = '';
        container.className = 'player-names active';

        for (let i = 1; i <= numPlayers; i++) {
            const formGroup = document.createElement('div');
            formGroup.className = 'form-group';
            formGroup.innerHTML = `
                <label for="player${i}Name">Manager ${i} Name:</label>
                <input type="text" id="player${i}Name" value="Manager ${i}" placeholder="Manager ${i}">
            `;
            container.appendChild(formGroup);
        }
    }

    startGame() {
        const numPlayers = parseInt(document.getElementById('numPlayers').value);
        const playerNames = [];

        for (let i = 1; i <= numPlayers; i++) {
            const nameInput = document.getElementById(`player${i}Name`);
            playerNames.push(nameInput.value || `Manager ${i}`);
        }

        console.log('Starting game with:', numPlayers, 'players:', playerNames);
        this.numPlayers = numPlayers;
        this.playerNames = playerNames;

        const success = this.game.startGame(this.numPlayers, this.playerNames);
        console.log('startGame result:', success);
        if (success) {
            this.gameStarted = true;
            document.getElementById('rollDiceBtn').disabled = false;
            document.getElementById('startGameBtn').disabled = true;
            this.hideGameSetup();
            this.showMessage('Game started! Roll the dice to begin.', 'success');
            this.updateUI();
        }
    }

    rollDice() {
        if (!this.gameStarted) return;

        // Generate dice rolls
        const die1 = Math.floor(Math.random() * 6) + 1;
        const die2 = Math.floor(Math.random() * 6) + 1;

        // Pass dice values to OCaml
        const result = this.game.rollDice(die1, die2);
        console.log('rollDice result:', result);
        if (result.success) {
            // Disable roll button until turn ends
            this.hasRolled = true;
            document.getElementById('rollDiceBtn').disabled = true;
            document.getElementById('endTurnBtn').disabled = false;

            // Show dice
            document.getElementById('die1').textContent = die1;
            document.getElementById('die2').textContent = die2;

            let message = `Rolled ${die1} + ${die2} = ${die1 + die2}. Landed on ${result.spaceName}`;

            // Add details based on what happened
            if (result.event && result.cardText) {
                // Show card text for Transfer Market or Match Day
                const cardIcon = result.event === 'transferMarket' ? '⚡' : '🎲';
                message += `\n${cardIcon} ${result.cardText}`;
            } else if (result.canBuy) {
                message += ' - Available to buy!';
                document.getElementById('buyPropertyBtn').disabled = false;
            } else if (result.rentPaid) {
                message += ` - Paid ${result.rentPaid.amount} FC rent to ${result.rentPaid.ownerName}`;
            } else if (result.taxPaid) {
                message += ` - Paid ${result.taxPaid.amount} FC tax`;
            }

            // Show club fact in separate box if available
            if (result.spaceFact) {
                this.showClubFact(result.spaceFact);
            } else {
                this.hideClubFact();
            }

            this.showMessage(message, 'info');

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
            this.hasRolled = false;
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
        if (!this.gameStarted || !this.game) return;

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

        // Update property details to show current position
        this.showPropertyDetails(player.position);
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

        // All actions require having rolled first
        if (!this.hasRolled) {
            document.getElementById('buyPropertyBtn').disabled = true;
            document.getElementById('buyYouthBtn').disabled = true;
            document.getElementById('buyStarBtn').disabled = true;
            return;
        }

        // Enable buy property if on unowned property/utility/broadcasting
        const buyableTypes = ['Property', 'Broadcasting', 'Utility'];
        const canBuyProperty = currentSpace &&
                               currentSpace.owner === null &&
                               buyableTypes.includes(currentSpace.spaceType) &&
                               player.money >= currentSpace.price;

        document.getElementById('buyPropertyBtn').disabled = !canBuyProperty;

        // Enable buy youth/star only on owned Property (not Broadcasting or Utility)
        const canDevelop = currentSpace &&
                          currentSpace.owner === player.id &&
                          currentSpace.spaceType === 'Property';

        // Check if player has enough money for youth (150% of base price)
        const youthCost = currentSpace && currentSpace.price ? Math.floor(currentSpace.price * 1.5) : 0;
        const canAffordYouth = player.money >= youthCost;

        // Check if player has enough money for star (200% of base price)
        const starCost = currentSpace && currentSpace.price ? currentSpace.price * 2 : 0;
        const canAffordStar = player.money >= starCost;

        document.getElementById('buyYouthBtn').disabled = !canDevelop || currentSpace.youthPlayers >= 4 || !canAffordYouth;
        document.getElementById('buyStarBtn').disabled = !canDevelop || currentSpace.hasStar || currentSpace.youthPlayers < 4 || !canAffordStar;
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
            const owner = this.game.getPlayers().find(p => p.id === space.owner);
            html += `<p><strong>Owner:</strong> ${owner.name}</p>`;
            html += `<p><strong>Youth Players:</strong> ${'⚽'.repeat(space.youthPlayers)}</p>`;
            if (space.hasStar) html += `<p><strong>Star Player:</strong> ⭐</p>`;
        } else if (space.price && space.price > 0) {
            html += `<p>Available for purchase</p>`;
            html += `<p><strong>Price:</strong> ${space.price} FC</p>`;
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

    showClubFact(fact) {
        const factBox = document.getElementById('clubFactBox');
        const factText = document.getElementById('clubFactText');
        factText.textContent = fact;
        factBox.style.display = 'block';
    }

    hideClubFact() {
        const factBox = document.getElementById('clubFactBox');
        factBox.style.display = 'none';
    }

    endGame() {
        document.getElementById('rollDiceBtn').disabled = true;
        document.getElementById('endTurnBtn').disabled = true;
        document.getElementById('buyPropertyBtn').disabled = true;
        document.getElementById('buyYouthBtn').disabled = true;
        document.getElementById('buyStarBtn').disabled = true;
        document.getElementById('startGameBtn').disabled = false;
        this.gameStarted = false;
        this.hideClubFact();
    }
}

// Initialize when page loads
window.addEventListener('load', () => {
    // Wait for OCaml module to be available
    const initUI = () => {
        if (window.FootballMonopolyOCaml) {
            console.log('OCaml module found, initializing UI...');
            const ui = new GameUI();
            ui.init();
            console.log('✓ OCaml Football Monopoly UI loaded!');
        } else {
            console.log('Waiting for OCaml module...');
            setTimeout(initUI, 100);
        }
    };
    initUI();
});
