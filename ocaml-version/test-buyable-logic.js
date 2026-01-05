// Test verification script - Run with Node.js to see expected test results
// This simulates the exact logic from game-ui.js

function testButtonLogic(spaceType, owner, playerMoney, price, expectedBuyable, spaceName) {
    const hasRolled = true;

    // This is the EXACT logic from game-ui.js updateActionButtons()
    const canBuyProperty = hasRolled &&
                           owner === null &&
                           (spaceType === 'Property' || spaceType === 'Broadcasting' || spaceType === 'Utility') &&
                           playerMoney >= price;

    const pass = canBuyProperty === expectedBuyable;
    const status = pass ? '✓' : '✗';
    console.log(`${status} ${spaceName} (${spaceType}): canBuy=${canBuyProperty}, expected=${expectedBuyable}`);
    return pass;
}

console.log('=== Testing Buyable Space Logic ===\n');

let passed = 0;
let failed = 0;

console.log('Group 1: Properties (SHOULD be buyable)');
if (testButtonLogic('Property', null, 2000, 100, true, 'Aston Villa')) passed++; else failed++;
if (testButtonLogic('Property', null, 2000, 200, true, 'Liverpool')) passed++; else failed++;

console.log('\nGroup 2: Broadcasting (SHOULD be buyable)');
if (testButtonLogic('Broadcasting', null, 2000, 200, true, 'Sky Sports')) passed++; else failed++;
if (testButtonLogic('Broadcasting', null, 2000, 200, true, 'ESPN')) passed++; else failed++;

console.log('\nGroup 3: Utilities (SHOULD be buyable)');
if (testButtonLogic('Utility', null, 2000, 150, true, 'Training Ground')) passed++; else failed++;
if (testButtonLogic('Utility', null, 2000, 150, true, 'Medical Center')) passed++; else failed++;

console.log('\nGroup 4: Tax (should NOT be buyable)');
if (testButtonLogic('Tax', null, 2000, 0, false, 'Agent Fees')) passed++; else failed++;
if (testButtonLogic('Tax', null, 2000, 0, false, 'FFP Fine')) passed++; else failed++;

console.log('\nGroup 5: Special Spaces (should NOT be buyable)');
if (testButtonLogic('TransferMarket', null, 2000, 0, false, 'Transfer Market')) passed++; else failed++;
if (testButtonLogic('MatchDay', null, 2000, 0, false, 'Match Day')) passed++; else failed++;
if (testButtonLogic('Corner', null, 2000, 0, false, "Int'l Break")) passed++; else failed++;
if (testButtonLogic('Start', null, 2000, 0, false, 'START')) passed++; else failed++;

console.log('\nGroup 6: Owned Spaces (should NOT be buyable)');
if (testButtonLogic('Property', 1, 2000, 100, false, 'Owned Property')) passed++; else failed++;
if (testButtonLogic('Broadcasting', 1, 2000, 200, false, 'Owned Broadcasting')) passed++; else failed++;

console.log('\nGroup 7: Insufficient Funds (should NOT be buyable)');
if (testButtonLogic('Property', null, 50, 100, false, 'Property - cant afford')) passed++; else failed++;
if (testButtonLogic('Utility', null, 100, 150, false, 'Utility - cant afford')) passed++; else failed++;

console.log(`\n=== SUMMARY ===`);
console.log(`Total: ${passed + failed} tests`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);

if (failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED!');
} else {
    console.log(`\n❌ ${failed} TEST(S) FAILED!`);
    process.exit(1);
}
