// Football Monopoly Game
class FootballMonopoly {
    constructor() {
        this.players = [];
        this.currentPlayerIndex = 0;
        this.gameStarted = false;
        this.spaces = this.initializeSpaces();
        this.transferMarketCards = this.initializeTransferCards();
        this.matchDayCards = this.initializeMatchDayCards();

        this.initializeEventListeners();
    }

    initializeSpaces() {
        return [
            { type: 'start', name: '⚽ START', action: 'collect' },
            { type: 'property', name: 'Aston Villa', price: 60, rent: [2, 10, 30, 90, 160, 250], color: 'red', owner: null, youthPlayers: 0, starPlayer: false },
            { type: 'transferMarket', name: '⚡ Transfer Market' },
            { type: 'property', name: 'Newcastle', price: 60, rent: [4, 20, 60, 180, 320, 450], color: 'red', owner: null, youthPlayers: 0, starPlayer: false },
            { type: 'tax', name: '💰 Agent Fees', amount: 200 },
            { type: 'broadcasting', name: '📺 Sky Sports', price: 200, owner: null },
            { type: 'property', name: 'Napoli', price: 100, rent: [6, 30, 90, 270, 400, 550], color: 'lightblue', owner: null, youthPlayers: 0, starPlayer: false },
            { type: 'matchDay', name: '🎲 Match Day' },
            { type: 'property', name: 'AS Roma', price: 100, rent: [6, 30, 90, 270, 400, 550], color: 'lightblue', owner: null, youthPlayers: 0, starPlayer: false },
            { type: 'property', name: 'Lazio', price: 120, rent: [8, 40, 100, 300, 450, 600], color: 'lightblue', owner: null, youthPlayers: 0, starPlayer: false },
            { type: 'corner', name: '🔄 TRANSFER WINDOW' },
            { type: 'property', name: 'AC Milan', price: 140, rent: [10, 50, 150, 450, 625, 750], color: 'pink', owner: null, youthPlayers: 0, starPlayer: false },
            { type: 'utility', name: '🏋️ Training Ground', price: 150, owner: null },
            { type: 'property', name: 'Inter Milan', price: 140, rent: [10, 50, 150, 450, 625, 750], color: 'pink', owner: null, youthPlayers: 0, starPlayer: false },
            { type: 'property', name: 'Ajax', price: 160, rent: [12, 60, 180, 500, 700, 900], color: 'pink', owner: null, youthPlayers: 0, starPlayer: false },
            { type: 'broadcasting', name: '📺 ESPN', price: 200, owner: null },
            { type: 'property', name: 'Atletico Madrid', price: 180, rent: [14, 70, 200, 550, 750, 950], color: 'orange', owner: null, youthPlayers: 0, starPlayer: false },
            { type: 'transferMarket', name: '⚡ Transfer Market' },
            { type: 'property', name: 'Borussia Dortmund', price: 180, rent: [14, 70, 200, 550, 750, 950], color: 'orange', owner: null, youthPlayers: 0, starPlayer: false },
            { type: 'property', name: 'Porto', price: 200, rent: [16, 80, 220, 600, 800, 1000], color: 'orange', owner: null, youthPlayers: 0, starPlayer: false },
            { type: 'corner', name: '✈️ INT\'L BREAK' },
            { type: 'property', name: 'Tottenham', price: 220, rent: [18, 90, 250, 700, 875, 1050], color: 'yellow', owner: null, youthPlayers: 0, starPlayer: false },
            { type: 'matchDay', name: '🎲 Match Day' },
            { type: 'property', name: 'Juventus', price: 220, rent: [18, 90, 250, 700, 875, 1050], color: 'yellow', owner: null, youthPlayers: 0, starPlayer: false },
            { type: 'property', name: 'Arsenal', price: 240, rent: [20, 100, 300, 750, 925, 1100], color: 'yellow', owner: null, youthPlayers: 0, starPlayer: false },
            { type: 'broadcasting', name: '📺 DAZN', price: 200, owner: null },
            { type: 'property', name: 'PSG', price: 260, rent: [22, 110, 330, 800, 975, 1150], color: 'green', owner: null, youthPlayers: 0, starPlayer: false },
            { type: 'property', name: 'Chelsea', price: 260, rent: [22, 110, 330, 800, 975, 1150], color: 'green', owner: null, youthPlayers: 0, starPlayer: false },
            { type: 'utility', name: '🏥 Medical Center', price: 150, owner: null },
            { type: 'property', name: 'Man City', price: 280, rent: [24, 120, 360, 850, 1025, 1200], color: 'green', owner: null, youthPlayers: 0, starPlayer: false },
            { type: 'corner', name: '⚠️ RELEGATION', amount: 200 },
            { type: 'property', name: 'Liverpool FC', price: 300, rent: [26, 130, 390, 900, 1100, 1275], color: 'darkblue', owner: null, youthPlayers: 0, starPlayer: false },
            { type: 'property', name: 'Bayern Munich', price: 300, rent: [26, 130, 390, 900, 1100, 1275], color: 'darkblue', owner: null, youthPlayers: 0, starPlayer: false },
            { type: 'transferMarket', name: '⚡ Transfer Market' },
            { type: 'property', name: 'Man United', price: 320, rent: [28, 150, 450, 1000, 1200, 1400], color: 'darkblue', owner: null, youthPlayers: 0, starPlayer: false },
            { type: 'broadcasting', name: '📺 BT Sport', price: 200, owner: null },
            { type: 'matchDay', name: '🎲 Match Day' },
            { type: 'property', name: 'Real Madrid', price: 350, rent: [35, 175, 500, 1100, 1300, 1500], color: 'purple', owner: null, youthPlayers: 0, starPlayer: false },
            { type: 'tax', name: '⚖️ FFP Fine', amount: 100 },
            { type: 'property', name: 'Barcelona', price: 400, rent: [50, 200, 600, 1400, 1700, 2000], color: 'purple', owner: null, youthPlayers: 0, starPlayer: false }
        ];
    }

    initializeTransferCards() {
        return [
            { text: "Youth academy produces talent! Collect 150 FC", action: 'collect', amount: 150 },
            { text: "Shirt sales boom! Collect 100 FC", action: 'collect', amount: 100 },
            { text: "Champions League qualification! Collect 200 FC", action: 'collect', amount: 200 },
            { text: "Player sold to rival! Collect 250 FC", action: 'collect', amount: 250 },
            { text: "Manager bonus awarded! Collect 100 FC", action: 'collect', amount: 100 },
            { text: "Stadium naming rights! Collect 150 FC", action: 'collect', amount: 150 },
            { text: "Failed transfer! Pay 50 FC", action: 'pay', amount: 50 },
            { text: "Overpaid for player! Pay 100 FC", action: 'pay', amount: 100 },
            { text: "Agent demands extra fee! Pay 75 FC", action: 'pay', amount: 75 },
            { text: "Luxury tax on spending! Pay 150 FC", action: 'pay', amount: 150 }
        ];
    }

    initializeMatchDayCards() {
        return [
            { text: "Win! Collect 100 FC from each player", action: 'collectFromAll', amount: 100 },
            { text: "Draw. Nothing happens.", action: 'nothing' },
            { text: "Victory! Collect 150 FC", action: 'collect', amount: 150 },
            { text: "Sponsorship deal! Collect 200 FC", action: 'collect', amount: 200 },
            { text: "Loss. Pay 50 FC to each player", action: 'payToAll', amount: 50 },
            { text: "Injury crisis! Pay 100 FC", action: 'pay', amount: 100 },
            { text: "Fan protest! Pay 75 FC", action: 'pay', amount: 75 },
            { text: "Stadium maintenance! Pay 50 FC", action: 'pay', amount: 50 }
        ];
    }

    initializeEventListeners() {
        document.getElementById('startGameBtn').addEventListener('click', () => this.startGame());
        document.getElementById('rollDiceBtn').addEventListener('click', () => this.rollDice());
        document.getElementById('buyPropertyBtn').addEventListener('click', () => this.buyProperty());
        document.getElementById('buyYouthBtn').addEventListener('click', () => this.buyYouthPlayer());
        document.getElementById('buyStarBtn').addEventListener('click', () => this.buyStarPlayer());
        document.getElementById('endTurnBtn').addEventListener('click', () => this.endTurn());

        // Click on spaces to view details
        document.querySelectorAll('.space.property, .space.broadcasting, .space.utility').forEach(space => {
            space.addEventListener('click', (e) => {
                const position = parseInt(e.currentTarget.dataset.position);
                this.showPropertyDetails(position);
            });
        });
    }

    startGame() {
        const numPlayers = prompt("How many managers? (2-4)", "2");
        const num = parseInt(numPlayers);

        if (!num || num < 2 || num > 4) {
            alert("Please enter a number between 2 and 4");
            return;
        }

        this.players = [];
        for (let i = 1; i <= num; i++) {
            const name = prompt(`Manager ${i} name:`, `Manager ${i}`);
            this.players.push({
                id: i,
                name: name || `Manager ${i}`,
                money: 2000,
                position: 0,
                properties: [],
                inJail: false,
                bankrupt: false
            });
        }

        this.currentPlayerIndex = 0;
        this.gameStarted = true;

        this.renderPlayers();
        this.renderPlayerTokens();
        document.getElementById('rollDiceBtn').disabled = false;
        this.updateUI();
        this.showMessage(`${this.getCurrentPlayer().name}'s turn! Roll the dice!`);
    }

    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }

    rollDice() {
        if (!this.gameStarted) return;

        // Disable roll button to prevent multiple rolls
        document.getElementById('rollDiceBtn').disabled = true;

        const die1 = Math.floor(Math.random() * 6) + 1;
        const die2 = Math.floor(Math.random() * 6) + 1;
        const total = die1 + die2;

        document.getElementById('die1').textContent = die1;
        document.getElementById('die2').textContent = die2;

        const player = this.getCurrentPlayer();
        const oldPosition = player.position;
        
        // Show dice roll message
        this.showMessage(`${player.name} rolled ${die1} + ${die2} = ${total}!`);
        
        // Animate the movement
        setTimeout(() => {
            player.position = (player.position + total) % 40;
            
            // Check if passed START
            if (player.position < oldPosition) {
                player.money += 200;
            }
            
            // Render tokens with animation
            this.renderPlayerTokens(true);
            
            // Highlight landing space
            this.highlightLandingSpace(player.position);
            
            // Show movement message
            const passedStart = player.position < oldPosition;
            this.showMessage(
                `${player.name} moved to ${this.spaces[player.position].name}!` +
                (passedStart ? ' Passed START! Collected 200 FC' : '')
            );
            
            // Handle landing after animation
            setTimeout(() => {
                this.handleLandedSpace(player);
                this.updateUI();
            }, 800);
        }, 600);
    }

    handleLandedSpace(player) {
        const space = this.spaces[player.position];

        setTimeout(() => {
            switch(space.type) {
                case 'start':
                    this.showMessage(`${player.name} is at START!`);
                    break;
                case 'property':
                    this.handleProperty(player, space);
                    break;
                case 'broadcasting':
                case 'utility':
                    this.handleSpecialProperty(player, space);
                    break;
                case 'tax':
                    player.money -= space.amount;
                    this.showMessage(`${player.name} paid ${space.amount} FC for ${space.name}`);
                    this.updateUI();
                    break;
                case 'transferMarket':
                    this.handleTransferMarket(player);
                    break;
                case 'matchDay':
                    this.handleMatchDay(player);
                    break;
                case 'corner':
                    if (player.position === 30) { // Relegation
                        player.money -= 200;
                        this.showMessage(`${player.name} in relegation zone! Paid 200 FC`);
                        this.updateUI();
                    } else {
                        this.showMessage(`${player.name} is at ${space.name}`);
                    }
                    break;
            }
        }, 500);
    }

    handleProperty(player, space) {
        if (!space.owner) {
            this.showMessage(`${space.name} is available for ${space.price} FC`);
            document.getElementById('buyPropertyBtn').disabled = false;
        } else if (space.owner === player.id) {
            this.showMessage(`You own ${space.name}`);
            this.updateDevelopmentButtons();
        } else {
            const rent = this.calculateRent(space);
            const owner = this.players.find(p => p.id === space.owner);
            player.money -= rent;
            owner.money += rent;
            this.showMessage(`${player.name} paid ${rent} FC rent to ${owner.name}!`);
            this.updateUI();
        }
    }

    handleSpecialProperty(player, space) {
        if (!space.owner) {
            this.showMessage(`${space.name} is available for ${space.price} FC`);
            document.getElementById('buyPropertyBtn').disabled = false;
        } else if (space.owner === player.id) {
            this.showMessage(`You own ${space.name}`);
        } else {
            let rent = 0;
            if (space.type === 'utility') {
                const die1 = parseInt(document.getElementById('die1').textContent);
                const die2 = parseInt(document.getElementById('die2').textContent);
                const diceTotal = die1 + die2;
                const utilitiesOwned = this.spaces.filter(s => s.type === 'utility' && s.owner === space.owner).length;
                rent = diceTotal * (utilitiesOwned === 1 ? 4 : 10);
            } else if (space.type === 'broadcasting') {
                const broadcastingOwned = this.spaces.filter(s => s.type === 'broadcasting' && s.owner === space.owner).length;
                rent = 25 * Math.pow(2, broadcastingOwned - 1);
            }

            const owner = this.players.find(p => p.id === space.owner);
            player.money -= rent;
            owner.money += rent;
            this.showMessage(`${player.name} paid ${rent} FC to ${owner.name}!`);
            this.updateUI();
        }
    }

    calculateRent(space) {
        if (!space.rent) return 0;

        let rentIndex = 0;
        if (space.youthPlayers > 0) {
            rentIndex = space.youthPlayers;
        }
        if (space.starPlayer) {
            rentIndex = 5;
        }

        let rent = space.rent[rentIndex];

        // Check if owner has monopoly (all properties of same color)
        const colorGroup = this.spaces.filter(s => s.color === space.color);
        const ownsAll = colorGroup.every(s => s.owner === space.owner);

        if (ownsAll && rentIndex === 0) {
            rent *= 2; // Double rent for monopoly without development
        }

        return rent;
    }

    handleTransferMarket(player) {
        const card = this.transferMarketCards[Math.floor(Math.random() * this.transferMarketCards.length)];

        this.showModal('⚡ Transfer Market', card.text, [
            { text: 'OK', class: 'primary', action: () => {
                if (card.action === 'collect') {
                    player.money += card.amount;
                } else if (card.action === 'pay') {
                    player.money -= card.amount;
                }
                this.updateUI();
                this.closeModal();
            }}
        ]);
    }

    handleMatchDay(player) {
        const card = this.matchDayCards[Math.floor(Math.random() * this.matchDayCards.length)];

        this.showModal('🎲 Match Day', card.text, [
            { text: 'OK', class: 'primary', action: () => {
                if (card.action === 'collect') {
                    player.money += card.amount;
                } else if (card.action === 'pay') {
                    player.money -= card.amount;
                } else if (card.action === 'collectFromAll') {
                    this.players.forEach(p => {
                        if (p.id !== player.id) {
                            p.money -= card.amount;
                            player.money += card.amount;
                        }
                    });
                } else if (card.action === 'payToAll') {
                    this.players.forEach(p => {
                        if (p.id !== player.id) {
                            p.money += card.amount;
                            player.money -= card.amount;
                        }
                    });
                }
                this.updateUI();
                this.closeModal();
            }}
        ]);
    }

    buyProperty() {
        const player = this.getCurrentPlayer();
        const space = this.spaces[player.position];

        if (player.money >= space.price) {
            player.money -= space.price;
            space.owner = player.id;
            player.properties.push(player.position);

            this.showMessage(`${player.name} bought ${space.name}!`);
            this.renderSpaceOwnership();
            this.updateUI();
            document.getElementById('buyPropertyBtn').disabled = true;
        } else {
            alert("Not enough money!");
        }
    }

    buyYouthPlayer() {
        const player = this.getCurrentPlayer();
        const space = this.spaces[player.position];

        if (space.type !== 'property') return;

        const cost = Math.floor(space.price * 1.5);

        if (space.youthPlayers >= 4) {
            alert("Maximum youth players reached! Buy a star player instead.");
            return;
        }

        if (player.money >= cost) {
            player.money -= cost;
            space.youthPlayers++;

            this.showMessage(`${player.name} signed a youth player for ${space.name}!`);
            this.renderDevelopment(true); // Animate new addition
            this.updateUI();
        } else {
            alert("Not enough money!");
        }
    }

    buyStarPlayer() {
        const player = this.getCurrentPlayer();
        const space = this.spaces[player.position];

        if (space.type !== 'property') return;

        if (space.youthPlayers < 4) {
            alert("You need 4 youth players before buying a star player!");
            return;
        }

        if (space.starPlayer) {
            alert("You already have a star player here!");
            return;
        }

        const cost = space.price * 2;
        if (player.money >= cost) {
            player.money -= cost;
            space.starPlayer = true;

            this.showMessage(`${player.name} signed a STAR PLAYER for ${space.name}!`);
            this.renderDevelopment(true); // Animate new addition
            this.updateUI();
        } else {
            alert("Not enough money!");
        }
    }

    updateDevelopmentButtons() {
        const player = this.getCurrentPlayer();
        const space = this.spaces[player.position];

        if (space.type === 'property' && space.owner === player.id) {
            const youthCost = Math.floor(space.price * 1.5);
            const starCost = space.price * 2;
            document.getElementById('buyYouthBtn').disabled = space.youthPlayers >= 4 || player.money < youthCost;
            document.getElementById('buyStarBtn').disabled = space.youthPlayers < 4 || space.starPlayer || player.money < starCost;
        } else {
            document.getElementById('buyYouthBtn').disabled = true;
            document.getElementById('buyStarBtn').disabled = true;
        }
    }

    endTurn() {
        // Check for bankruptcy
        if (this.getCurrentPlayer().money < 0) {
            this.handleBankruptcy();
            return;
        }

        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;

        // Skip bankrupt players
        while (this.players[this.currentPlayerIndex].bankrupt) {
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        }

        // Check for winner
        const activePlayers = this.players.filter(p => !p.bankrupt);
        if (activePlayers.length === 1) {
            this.showModal('🏆 GAME OVER!',
                `${activePlayers[0].name} wins with ${activePlayers[0].money} FC!`,
                [{ text: 'New Game', class: 'primary', action: () => location.reload() }]
            );
            return;
        }

        this.showMessage(`${this.getCurrentPlayer().name}'s turn! Roll the dice!`);
        // Enable roll dice button for new turn
        document.getElementById('rollDiceBtn').disabled = false;
        this.updateUI();
    }

    handleBankruptcy() {
        const player = this.getCurrentPlayer();
        player.bankrupt = true;

        // Release all properties
        this.spaces.forEach(space => {
            if (space.owner === player.id) {
                space.owner = null;
                space.youthPlayers = 0;
                space.starPlayer = false;
            }
        });

        this.showModal('💸 BANKRUPT!',
            `${player.name} is bankrupt and out of the game!`,
            [{ text: 'Continue', class: 'primary', action: () => {
                this.closeModal();
                this.endTurn();
            }}]
        );
    }

    highlightLandingSpace(position) {
        // Remove any existing highlights
        document.querySelectorAll('.space.landing').forEach(el => {
            el.classList.remove('landing');
        });
        
        // Add highlight to landing space
        const landingSpace = document.querySelector(`[data-position="${position}"]`);
        if (landingSpace) {
            landingSpace.classList.add('landing');
            // Remove highlight after animation
            setTimeout(() => {
                landingSpace.classList.remove('landing');
            }, 1000);
        }
    }

    showPropertyDetails(position) {
        const space = this.spaces[position];
        if (!space.price) return;

        let details = `<strong>${space.name}</strong><br>`;
        details += `Price: ${space.price} FC<br>`;

        if (space.owner) {
            const owner = this.players.find(p => p.id === space.owner);
            details += `Owner: ${owner.name}<br>`;
        } else {
            details += `Owner: None<br>`;
        }

        if (space.type === 'property' && space.rent) {
            details += `<br><strong>Rent:</strong><br>`;
            details += `Base: ${space.rent[0]} FC<br>`;
            details += `1 Youth: ${space.rent[1]} FC<br>`;
            details += `2 Youth: ${space.rent[2]} FC<br>`;
            details += `3 Youth: ${space.rent[3]} FC<br>`;
            details += `4 Youth: ${space.rent[4]} FC<br>`;
            details += `Star Player: ${space.rent[5]} FC<br>`;
            details += `<br>Youth Cost: ${Math.floor(space.price * 1.5)} FC<br>`;
            details += `Star Cost: ${space.price * 2} FC<br>`;

            if (space.youthPlayers > 0 || space.starPlayer) {
                details += `<br><strong>Development:</strong><br>`;
                details += `Youth Players: ${space.youthPlayers}<br>`;
                details += `Star Player: ${space.starPlayer ? 'Yes' : 'No'}`;
            }
        }

        document.getElementById('propertyDetails').innerHTML = details;
    }

    renderPlayers() {
        const container = document.getElementById('playersList');
        container.innerHTML = '';

        this.players.forEach(player => {
            const card = document.createElement('div');
            card.className = `player-card player-${player.id} ${this.currentPlayerIndex === player.id - 1 && !player.bankrupt ? 'active' : ''}`;
            card.innerHTML = `
                <div class="player-name">${player.name}</div>
                <div class="player-money">💰 ${player.money} FC</div>
                <div class="player-properties">Properties: ${player.properties.length}</div>
                ${player.bankrupt ? '<div style="color: red; font-weight: bold;">BANKRUPT</div>' : ''}
            `;
            container.appendChild(card);
        });
    }

renderPlayerTokens(animate = false) {
        // Remove all existing tokens
        document.querySelectorAll('.player-token').forEach(token => token.remove());

        // Add tokens at current positions
        this.players.forEach(player => {
            if (player.bankrupt) return;
            
            const space = document.querySelector(`[data-position="${player.position}"]`);
            if (space) {
                const token = document.createElement('div');
                token.className = `player-token player-token-${player.id}`;
                
                // Add animation class if moving
                if (animate && player.id === this.getCurrentPlayer().id) {
                    token.classList.add('moving');
                    // Remove animation class after it completes
                    setTimeout(() => token.classList.remove('moving'), 600);
                }
                
                space.appendChild(token);
            }
        });
    }

    renderSpaceOwnership() {
        this.spaces.forEach((space, index) => {
            const element = document.querySelector(`[data-position="${index}"]`);
            if (!element) return;

            element.classList.remove('owned', 'owned-by-1', 'owned-by-2', 'owned-by-3', 'owned-by-4');

            if (space.owner) {
                element.classList.add('owned', `owned-by-${space.owner}`);
            }
        });
    }

    renderDevelopment(animateNew = false) {
        this.spaces.forEach((space, index) => {
            if (space.type !== 'property') return;

            const element = document.querySelector(`[data-position="${index}"]`);
            if (!element) return;

            // Remove existing indicators
            const existing = element.querySelector('.development-indicators');
            if (existing) existing.remove();

            // Add new indicators
            if (space.youthPlayers > 0 || space.starPlayer) {
                const indicators = document.createElement('div');
                indicators.className = 'development-indicators';

                for (let i = 0; i < space.youthPlayers; i++) {
                    const indicator = document.createElement('div');
                    indicator.className = 'dev-indicator';
                    indicator.title = 'Youth Player';
                    
                    // Animate the last added youth player
                    if (animateNew && i === space.youthPlayers - 1) {
                        indicator.classList.add('new');
                    }
                    
                    indicators.appendChild(indicator);
                }

                if (space.starPlayer) {
                    const star = document.createElement('div');
                    star.className = 'dev-indicator star';
                    star.title = 'Star Player';
                    
                    // Animate if newly added
                    if (animateNew) {
                        star.classList.add('new');
                    }
                    
                    indicators.appendChild(star);
                }

                element.appendChild(indicators);
            }
        });
    }

    updateUI() {
        this.renderPlayers();
        this.renderSpaceOwnership();
        this.renderDevelopment();

        const player = this.getCurrentPlayer();
        document.getElementById('currentPlayerName').textContent = player.name;

        // Don't enable roll dice here - it should only be enabled at start of turn
        document.getElementById('endTurnBtn').disabled = false;
        document.getElementById('buyPropertyBtn').disabled = true;

        this.updateDevelopmentButtons();
    }

    showMessage(message) {
        document.getElementById('gameMessage').textContent = message;
    }

    showModal(title, message, actions) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalMessage').textContent = message;

        const actionsContainer = document.getElementById('modalActions');
        actionsContainer.innerHTML = '';

        actions.forEach(action => {
            const btn = document.createElement('button');
            btn.textContent = action.text;
            btn.className = `modal-btn ${action.class}`;
            btn.addEventListener('click', action.action);
            actionsContainer.appendChild(btn);
        });

        document.getElementById('modal').classList.add('show');
    }

    closeModal() {
        document.getElementById('modal').classList.remove('show');
    }
}

// Initialize game
const game = new FootballMonopoly();
