// Test owner lookup bug - Run with Node.js

console.log('=== Testing Owner Lookup Bug ===\n');

// Simulate the bug and fix
const players = [
    { id: 1, name: 'Manager 1' },
    { id: 2, name: 'Manager 2' }
];

const space = {
    name: 'Aston Villa',
    owner: 1  // Player ID = 1 (Manager 1)
};

console.log('Players array:', JSON.stringify(players, null, 2));
console.log('Space owner ID:', space.owner);
console.log();

// BUG: Using array index
console.log('❌ BUGGY CODE: getPlayers()[space.owner]');
const buggyOwner = players[space.owner];
console.log('  Result:', buggyOwner);
console.log('  Owner name:', buggyOwner ? buggyOwner.name : 'undefined');
console.log('  WRONG! Array index 1 = second player (Manager 2)');
console.log();

// FIX: Find by player ID
console.log('✅ FIXED CODE: getPlayers().find(p => p.id === space.owner)');
const correctOwner = players.find(p => p.id === space.owner);
console.log('  Result:', correctOwner);
console.log('  Owner name:', correctOwner.name);
console.log('  CORRECT! Player with ID 1 = Manager 1');
console.log();

// Test with multiple scenarios
console.log('=== Testing Multiple Scenarios ===\n');

let passed = 0;
let failed = 0;

function testOwnerLookup(ownerId, expectedName) {
    const buggy = players[ownerId];
    const fixed = players.find(p => p.id === ownerId);
    
    const buggyCorrect = buggy && buggy.name === expectedName;
    const fixedCorrect = fixed && fixed.name === expectedName;
    
    console.log(`Owner ID ${ownerId}:`);
    console.log(`  Buggy: ${buggy ? buggy.name : 'undefined'} - ${buggyCorrect ? '✓' : '✗'}`);
    console.log(`  Fixed: ${fixed.name} - ${fixedCorrect ? '✓' : '✗'}`);
    
    if (fixedCorrect) passed++; else failed++;
}

testOwnerLookup(1, 'Manager 1');
testOwnerLookup(2, 'Manager 2');

console.log(`\n=== SUMMARY ===`);
console.log(`Tests passed: ${passed}`);
console.log(`Tests failed: ${failed}`);

if (failed === 0) {
    console.log('\n🎉 OWNER LOOKUP FIX VERIFIED!');
    console.log('\nThe bug: Using array index instead of player ID');
    console.log('The fix: Use .find(p => p.id === space.owner)');
} else {
    console.log(`\n❌ ${failed} TEST(S) FAILED!`);
    process.exit(1);
}
