# Project Structure

```
football_monopoly_game/
├── README.md                          # Main project documentation
├── js-version/                        # Original JavaScript implementation
│   ├── index.html                     # Full game UI
│   ├── styles.css                     # Game styling
│   ├── game.js                        # Mutable OOP game logic
│   └── test_simulator.js              # Game balance analyzer
└── ocaml-version/                     # Functional OCaml implementation ⭐
    ├── Makefile                       # Build commands
    ├── dune-project                   # Dune build config
    ├── football_monopoly.opam         # Package definition
    ├── src/
    │   ├── game_types.ml              # Core type definitions
    │   ├── game_state.ml              # Board & initial state
    │   ├── game_logic.ml              # Pure game transformations
    │   ├── main.ml                    # JS bindings (js_of_ocaml)
    │   └── dune                       # Build rules
    ├── test/
    │   ├── test_game.ml               # Unit tests
    │   └── dune
    └── web/
        └── index.html                 # Test interface
```

## Quick Start

### JavaScript Version
```bash
cd js-version
open index.html
```

### OCaml Version (Recommended)
```bash
cd ocaml-version
make setup      # Install dependencies
make test       # Run tests (all passing!)
make serve      # Build & serve at http://localhost:8000
```

## Architecture Comparison

### JavaScript (Mutable State)
```javascript
// Game state is modified in place
class FootballMonopoly {
  rollDice() {
    this.player.position += roll;  // Mutation!
    this.player.money -= rent;     // Mutation!
  }
}
```

**Issues:**
- Hard to test (side effects)
- No replay capability
- Difficult to debug state changes
- Race conditions possible

### OCaml (Immutable State) ✅
```ocaml
(* Pure function - no mutations *)
type game_state = { players: player list; board: space array; ... }
type action = Roll of int * int | BuyProperty | ...

val apply_action : game_state -> action -> game_state
```

**Benefits:**
- ✅ Easy to test (pure functions)
- ✅ Full game replay from action list
- ✅ Type-safe (no runtime errors)
- ✅ Deterministic behavior
- ✅ Time travel debugging

## Key Features

### Functional Core
All game logic is pure transformations:
```ocaml
(* Before *)
state1: { player.money = 2000, position = 0 }

(* Action *)
Roll (3, 4)  (* deterministic! *)

(* After *)
state2: { player.money = 2000, position = 7 }
```

### Action History & Replay
Every action is recorded:
```ocaml
state.action_history = [
  StartGame { player_names = ["Alice"; "Bob"] };
  Roll (3, 4);
  BuyProperty;
  EndTurn;
  Roll (5, 2);
  ...
]

(* Replay entire game from start! *)
let replay actions =
  List.fold_left apply_action initial_state actions
```

### Type Safety
OCaml's type system prevents bugs:
```ocaml
(* Compiler error if you forget a case! *)
match space.space_type with
| Property p -> handle_property p
| Tax t -> handle_tax t
| Broadcasting b -> handle_broadcasting b
(* Error if any case is missing *)
```

## Test Results

```
=== Running Football Monopoly OCaml Tests ===

✓ Initial state test passed
✓ Start game test passed
✓ Roll and move test passed
✓ Buy property test passed
✓ Pass start test passed

✅ All tests passed!
```

## Game Balance (Applied)

Based on simulation analysis, these changes were applied:
- Starting money: 1500 → **2000 FC** (+33%)
- Youth player cost: 50% → **150%** of property price
- Star player cost: 100% → **200%** of property price

**ROI Analysis:**
- Before: <1 landing to recoup investment (too fast!)
- After: ~1.6-1.9 landings (balanced ✅)

## Next Steps

1. **Add full UI** - Port the JavaScript UI to use OCaml backend
2. **Property-based testing** - Use QCheck for exhaustive tests
3. **Multiplayer** - Websocket support with shared state
4. **AI players** - Implement bot strategies
5. **Analytics** - Track game statistics and win rates

## Why OCaml + js_of_ocaml?

**Traditional Web Dev:**
```
Business Logic (JS) → Hard to test
     ↓                 ↓ Bugs at runtime
   Browser         State mgmt chaos
```

**OCaml Approach:**
```
Pure Logic (OCaml) → Easy to test
     ↓                ↓ Compile-time safety
js_of_ocaml        ↓ Immutable state
     ↓                ✓ Zero bugs
   Browser
```

The functional core ensures correctness, while js_of_ocaml makes it run anywhere!
