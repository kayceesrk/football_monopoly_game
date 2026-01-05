// Game Balance Test Simulator for Football Monopoly

class GameSimulator {
    constructor() {
        this.spaces = this.initializeSpaces();
    }

    initializeSpaces() {
        return [
            { pos: 0, type: 'start', name: 'START' },
            { pos: 1, type: 'property', name: 'Aston Villa', price: 60, rent: [2, 10, 30, 90, 160, 250], color: 'red' },
            { pos: 2, type: 'transferMarket', name: 'Transfer Market' },
            { pos: 3, type: 'property', name: 'Newcastle', price: 60, rent: [4, 20, 60, 180, 320, 450], color: 'red' },
            { pos: 4, type: 'tax', name: 'Agent Fees', amount: 200 },
            { pos: 5, type: 'broadcasting', name: 'Sky Sports', price: 200 },
            { pos: 6, type: 'property', name: 'Napoli', price: 100, rent: [6, 30, 90, 270, 400, 550], color: 'lightblue' },
            { pos: 7, type: 'matchDay', name: 'Match Day' },
            { pos: 8, type: 'property', name: 'AS Roma', price: 100, rent: [6, 30, 90, 270, 400, 550], color: 'lightblue' },
            { pos: 9, type: 'property', name: 'Lazio', price: 120, rent: [8, 40, 100, 300, 450, 600], color: 'lightblue' },
            { pos: 10, type: 'corner', name: 'Transfer Window' },
            { pos: 11, type: 'property', name: 'AC Milan', price: 140, rent: [10, 50, 150, 450, 625, 750], color: 'pink' },
            { pos: 12, type: 'utility', name: 'Training Ground', price: 150 },
            { pos: 13, type: 'property', name: 'Inter Milan', price: 140, rent: [10, 50, 150, 450, 625, 750], color: 'pink' },
            { pos: 14, type: 'property', name: 'Ajax', price: 160, rent: [12, 60, 180, 500, 700, 900], color: 'pink' },
            { pos: 15, type: 'broadcasting', name: 'ESPN', price: 200 },
            { pos: 16, type: 'property', name: 'Atletico Madrid', price: 180, rent: [14, 70, 200, 550, 750, 950], color: 'orange' },
            { pos: 17, type: 'transferMarket', name: 'Transfer Market' },
            { pos: 18, type: 'property', name: 'Borussia Dortmund', price: 180, rent: [14, 70, 200, 550, 750, 950], color: 'orange' },
            { pos: 19, type: 'property', name: 'Porto', price: 200, rent: [16, 80, 220, 600, 800, 1000], color: 'orange' },
            { pos: 20, type: 'corner', name: "Int'l Break" },
            { pos: 21, type: 'property', name: 'Tottenham', price: 220, rent: [18, 90, 250, 700, 875, 1050], color: 'yellow' },
            { pos: 22, type: 'matchDay', name: 'Match Day' },
            { pos: 23, type: 'property', name: 'Juventus', price: 220, rent: [18, 90, 250, 700, 875, 1050], color: 'yellow' },
            { pos: 24, type: 'property', name: 'Arsenal', price: 240, rent: [20, 100, 300, 750, 925, 1100], color: 'yellow' },
            { pos: 25, type: 'broadcasting', name: 'DAZN', price: 200 },
            { pos: 26, type: 'property', name: 'PSG', price: 260, rent: [22, 110, 330, 800, 975, 1150], color: 'green' },
            { pos: 27, type: 'property', name: 'Chelsea', price: 260, rent: [22, 110, 330, 800, 975, 1150], color: 'green' },
            { pos: 28, type: 'utility', name: 'Medical Center', price: 150 },
            { pos: 29, type: 'property', name: 'Man City', price: 280, rent: [24, 120, 360, 850, 1025, 1200], color: 'green' },
            { pos: 30, type: 'corner', name: 'Relegation', amount: 200 },
            { pos: 31, type: 'property', name: 'Liverpool FC', price: 300, rent: [26, 130, 390, 900, 1100, 1275], color: 'darkblue' },
            { pos: 32, type: 'property', name: 'Bayern Munich', price: 300, rent: [26, 130, 390, 900, 1100, 1275], color: 'darkblue' },
            { pos: 33, type: 'transferMarket', name: 'Transfer Market' },
            { pos: 34, type: 'property', name: 'Man United', price: 320, rent: [28, 150, 450, 1000, 1200, 1400], color: 'darkblue' },
            { pos: 35, type: 'broadcasting', name: 'BT Sport', price: 200 },
            { pos: 36, type: 'matchDay', name: 'Match Day' },
            { pos: 37, type: 'property', name: 'Real Madrid', price: 350, rent: [35, 175, 500, 1100, 1300, 1500], color: 'purple' },
            { pos: 38, type: 'tax', name: 'FFP Fine', amount: 100 },
            { pos: 39, type: 'property', name: 'Barcelona', price: 400, rent: [50, 200, 600, 1400, 1700, 2000], color: 'purple' }
        ];
    }

    analyzeEconomy() {
        console.log("=== FOOTBALL MONOPOLY - ECONOMIC ANALYSIS ===\n");

        // Property analysis
        const properties = this.spaces.filter(s => s.type === 'property');
        const totalPropertyCost = properties.reduce((sum, p) => sum + p.price, 0);
        const avgPropertyPrice = totalPropertyCost / properties.length;

        console.log("PROPERTY ECONOMICS:");
        console.log(`- Total properties: ${properties.length}`);
        console.log(`- Total cost to buy all: ${totalPropertyCost} FC`);
        console.log(`- Average property price: ${avgPropertyPrice.toFixed(0)} FC`);
        console.log(`- Cheapest: ${properties[0].name} (${properties[0].price} FC)`);
        console.log(`- Most expensive: Barcelona (400 FC)`);
        console.log(`- Starting money: 1500 FC`);
        console.log(`- Can afford ${Math.floor(1500 / avgPropertyPrice)} average properties at start\n`);

        // Color groups
        const colorGroups = {};
        properties.forEach(p => {
            if (!colorGroups[p.color]) colorGroups[p.color] = [];
            colorGroups[p.color].push(p);
        });

        console.log("COLOR GROUP ANALYSIS:");
        Object.entries(colorGroups).forEach(([color, props]) => {
            const totalCost = props.reduce((sum, p) => sum + p.price, 0);
            const totalDevelopment = props.reduce((sum, p) => sum + (p.price * 0.5 * 4) + p.price, 0); // 4 youth + 1 star
            console.log(`${color.toUpperCase()}: ${props.length} clubs, ${totalCost} FC to monopolize, ${totalDevelopment.toFixed(0)} FC fully developed`);
        });

        console.log("\nRENT PROGRESSION (examples):");
        const examples = [properties[0], properties[10], properties[21]];
        examples.forEach(p => {
            console.log(`\n${p.name} (${p.price} FC):`);
            console.log(`  Base rent: ${p.rent[0]} FC (${(p.rent[0]/p.price*100).toFixed(1)}% of price)`);
            console.log(`  1 Youth: ${p.rent[1]} FC (${(p.rent[1]/p.rent[0]).toFixed(1)}x base)`);
            console.log(`  4 Youth: ${p.rent[4]} FC (${(p.rent[4]/p.rent[0]).toFixed(1)}x base)`);
            console.log(`  Star: ${p.rent[5]} FC (${(p.rent[5]/p.rent[0]).toFixed(1)}x base)`);
            const devCost = (p.price * 0.5 * 4) + p.price;
            console.log(`  Full dev cost: ${devCost} FC, ROI after ${Math.ceil(devCost/p.rent[5])} landings`);
        });

        console.log("\n\nEXPECTED INCOME PER BOARD CIRCUIT:");
        console.log(`- Pass START: 200 FC guaranteed`);
        console.log(`- Average dice roll: 7 spaces per turn`);
        console.log(`- Full circuit: ~40/7 = 5.7 turns`);
        console.log(`- Circuit time: ~17 minutes (@ 3 min/turn)`);

        // Special spaces
        const broadcasting = this.spaces.filter(s => s.type === 'broadcasting');
        const utilities = this.spaces.filter(s => s.type === 'utility');
        const taxes = this.spaces.filter(s => s.type === 'tax');

        console.log("\n\nSPECIAL PROPERTIES:");
        console.log(`Broadcasting rights: ${broadcasting.length} × 200 FC = ${broadcasting.length * 200} FC total`);
        console.log(`Utilities: ${utilities.length} × 150 FC = ${utilities.length * 150} FC total`);
        console.log(`Taxes on board: ${taxes.reduce((s, t) => s + t.amount, 0)} FC potential loss per circuit\n`);
    }

    simulateEarlyGame() {
        console.log("\n=== SIMULATING EARLY GAME (10 ROUNDS) ===\n");

        const players = [
            { id: 1, name: 'Player 1', money: 1500, position: 0, properties: [] },
            { id: 2, name: 'Player 2', money: 1500, position: 0, properties: [] }
        ];

        let currentPlayer = 0;

        for (let round = 1; round <= 10; round++) {
            const player = players[currentPlayer];
            const roll = Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;
            const oldPos = player.position;
            player.position = (player.position + roll) % 40;

            // Pass START bonus
            if (player.position < oldPos) {
                player.money += 200;
            }

            const space = this.spaces[player.position];
            let action = `rolled ${roll}, landed on ${space.name}`;

            // Simulate simple actions
            if (space.type === 'property' && !space.owner && player.money >= space.price) {
                player.money -= space.price;
                space.owner = player.id;
                player.properties.push(space.name);
                action += ` - BOUGHT for ${space.price} FC`;
            } else if (space.type === 'property' && space.owner && space.owner !== player.id) {
                const rent = space.rent[0]; // base rent
                player.money -= rent;
                action += ` - paid ${rent} FC rent`;
            } else if (space.type === 'tax') {
                player.money -= space.amount;
                action += ` - paid ${space.amount} FC tax`;
            }

            console.log(`R${round} ${player.name}: ${action} (Balance: ${player.money} FC)`);

            currentPlayer = (currentPlayer + 1) % players.length;
        }

        console.log("\n--- RESULTS AFTER 10 ROUNDS ---");
        players.forEach(p => {
            console.log(`${p.name}: ${p.money} FC, ${p.properties.length} properties`);
            console.log(`  Owns: ${p.properties.join(', ') || 'none'}`);
        });
    }

    identifyIssues() {
        console.log("\n\n=== POTENTIAL GAME BALANCE ISSUES ===\n");

        const properties = this.spaces.filter(s => s.type === 'property');

        // Issue 1: Rent ratios
        console.log("1. RENT PROGRESSION:");
        const lowPriceRent = properties[0].rent[0] / properties[0].price;
        const highPriceRent = properties[properties.length-1].rent[0] / properties[properties.length-1].price;
        console.log(`   Low-end rent ratio: ${(lowPriceRent*100).toFixed(2)}%`);
        console.log(`   High-end rent ratio: ${(highPriceRent*100).toFixed(2)}%`);
        if (highPriceRent < lowPriceRent * 1.5) {
            console.log("   ⚠️  Expensive properties may not be worth it!");
        }

        // Issue 2: Development costs
        console.log("\n2. DEVELOPMENT ROI:");
        const cheapProp = properties[0];
        const expensiveProp = properties[properties.length-1];
        const cheapROI = ((cheapProp.price * 0.5 * 4) + cheapProp.price) / cheapProp.rent[5];
        const expensiveROI = ((expensiveProp.price * 0.5 * 4) + expensiveProp.price) / expensiveProp.rent[5];
        console.log(`   Cheap property full dev ROI: ${cheapROI.toFixed(1)} landings`);
        console.log(`   Expensive property full dev ROI: ${expensiveROI.toFixed(1)} landings`);
        if (Math.abs(cheapROI - expensiveROI) > 5) {
            console.log("   ⚠️  ROI imbalance - some properties much better investment!");
        }

        // Issue 3: Monopoly difficulty
        console.log("\n3. MONOPOLY FORMATION:");
        const colorGroups = {};
        properties.forEach(p => {
            if (!colorGroups[p.color]) colorGroups[p.color] = { count: 0, total: 0 };
            colorGroups[p.color].count++;
            colorGroups[p.color].total += p.price;
        });
        Object.entries(colorGroups).forEach(([color, data]) => {
            if (data.count === 2) {
                console.log(`   ${color}: 2 properties, ${data.total} FC - easier monopoly`);
            } else if (data.count === 3) {
                console.log(`   ${color}: 3 properties, ${data.total} FC - harder monopoly`);
            }
        });

        // Issue 4: Starting money
        console.log("\n4. STARTING MONEY:");
        const avgFirstRoundBuy = properties.slice(0, 7).reduce((s, p) => s + p.price, 0) / 7;
        console.log(`   Starting: 1500 FC`);
        console.log(`   Average early property: ${avgFirstRoundBuy.toFixed(0)} FC`);
        console.log(`   Can buy ~${Math.floor(1500 / avgFirstRoundBuy)} before broke`);
        if (Math.floor(1500 / avgFirstRoundBuy) < 3) {
            console.log("   ⚠️  May run out of money too quickly!");
        }

        // Issue 5: Tax burden
        console.log("\n5. TAX BURDEN:");
        const totalTax = this.spaces.filter(s => s.type === 'tax').reduce((s, t) => s + t.amount, 0);
        console.log(`   Total tax on board: ${totalTax} FC`);
        console.log(`   Expected per circuit: ${(totalTax / 40 * 40).toFixed(0)} FC if hit all`);
        console.log(`   Actual expected (2/40 chance): ${(totalTax * 2/40 * 40).toFixed(0)} FC per circuit`);
    }
}

// Run simulation
const sim = new GameSimulator();
sim.analyzeEconomy();
sim.simulateEarlyGame();
sim.identifyIssues();

console.log("\n\n=== RECOMMENDATIONS ===");
console.log("1. Consider adjusting rent on expensive properties for better ROI");
console.log("2. May want to increase starting money to 2000 FC");
console.log("3. Test with 3-4 players for balance");
console.log("4. Consider adding more strategic card effects");
console.log("5. Monitor if games end too quickly or drag on");
