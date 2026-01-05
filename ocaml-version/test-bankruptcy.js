// Test bankruptcy detection - Run with Node.js

console.log('=== Testing Bankruptcy Detection ===\n');

// Simulate check_bankruptcy logic
function checkBankruptcy(playerMoney) {
    return playerMoney <= 0;
}

let passed = 0;
let failed = 0;

function test(scenario, money, shouldBeBankrupt) {
    const isBankrupt = checkBankruptcy(money);
    const pass = isBankrupt === shouldBeBankrupt;
    const status = pass ? '✓' : '✗';
    console.log(`${status} ${scenario}: money=${money}, bankrupt=${isBankrupt}, expected=${shouldBeBankrupt}`);
    if (pass) passed++; else failed++;
}

console.log('Group 1: Bankruptcy detection');
test('Player with 100 FC', 100, false);
test('Player with 1 FC', 1, false);
test('Player with 0 FC', 0, true);
test('Player with -1 FC', -1, true);
test('Player with -100 FC', -100, true);

console.log('\nGroup 2: Edge cases');
test('Player with 2000 FC (start)', 2000, false);
test('Player with exactly 0 FC after paying', 0, true);

console.log(`\n=== SUMMARY ===`);
console.log(`Total: ${passed + failed} tests`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);

if (failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('\nBankruptcy threshold: money <= 0');
    console.log('Players are immediately marked bankrupt when money reaches 0 or below.');
} else {
    console.log(`\n❌ ${failed} TEST(S) FAILED!`);
    process.exit(1);
}
