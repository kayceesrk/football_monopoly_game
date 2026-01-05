# Football Monopoly

A browser-based football-themed monopoly game built with functional programming principles.

## 🎮 Versions

### OCaml Version (`ocaml-version/`) ⭐ **PRIMARY VERSION**
The canonical implementation with robust functional architecture:
- **Pure functional core**: Immutable game state, no side effects
- **Type-safe**: OCaml's type system prevents runtime errors
- **Deterministic replay**: Full game history via action trace
- **Thoroughly tested**: Unit tests + 500-game simulations (98% balance score)
- **Compiled to JS**: Runs in browser via js_of_ocaml
- **Active development**: All new features go here

### JavaScript Version (`js-version/`) 📚 **REFERENCE ONLY**
Original prototype - kept for documentation and accessibility:
- **Reference implementation**: Shows game design clearly
- **Mutable state**: Traditional OOP approach
- **No compilation needed**: Easy to read and understand
- **Not maintained**: Use OCaml version for actual play
- **Historical value**: Contains balance testing simulator

## 🚀 Quick Start

### Play the Game (OCaml Version)
```bash
cd ocaml-version
# Install dependencies (one time)
opam install . --deps-only

# Build
make js

# Start local server
make serve

# Open browser
open http://localhost:8080
```

### Run Simulations
```bash
cd ocaml-version
dune build test/test_simulator.exe
./_build/default/test/test_simulator.exe 100  # Run 100 games
```

### Reference Only: JavaScript Version
```bash
cd js-version
open index.html  # No compilation needed
```

## 🎯 Game Rules

- **Starting Money**: 2000 FC per manager
- **Properties**: 22 football clubs organized by value
- **Development**:
  - Youth Players: 150% of club price (max 4)
  - Star Players: 200% of club price (requires 4 youth)
- **Monopoly Bonus**: Own all clubs in a league = 2x rent
- **Special Spaces**: Transfer Market cards, Match Day events
- **Win Condition**: Last manager with money wins

## 🏗️ Architecture Comparison

### JavaScript (Mutable)
```javascript
class FootballMonopoly {
  rollDice() {
    this.player.position += roll;
    this.player.money -= rent;
  }
}
```

### OCaml (Immutable)
```ocaml
type game_state = { players: player list; board: space array; ... }
type action = Roll of int * int | BuyProperty | ...

val apply_action : game_state -> action -> game_state
```

## 🧪 Testing & Simulation

The OCaml version includes comprehensive testing:

### Unit Tests
```bash
cd ocaml-version
dune test  # Run all unit tests
```

### Game Balance Simulations
```bash
cd ocaml-version
./_build/default/test/test_simulator.exe 500
```

**Latest Simulation Results (500 games):**
- Balance Score: 98.0% (EXCELLENT)
- Win Distribution: 49% / 51% (perfectly balanced)
- Average game length: 46 turns (~25-30 minutes)
- Properties purchased: 11.5 per game (52% of board)
- Development activity: 10.6 youth players per game

## 📊 Game Balance

Carefully tuned through simulation analysis:
- **Starting money**: 2000 FC (supports 4-6 property purchases)
- **Development costs**: Youth 150%, Star 200% of property price
- **ROI**: 8-12 landings for full development payback
- **Game length**: Well-balanced at ~45 turns median
- **Strategic depth**: Monopoly formation and timing are key to victory
