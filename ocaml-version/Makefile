.PHONY: build test clean run install

# Build the project
build:
	dune build

# Build JavaScript version
js:
	dune build src/main.bc.js
	@echo "✓ JavaScript built at _build/default/src/main.bc.js"

# Run tests
test:
	dune exec test/test_game.exe

# Clean build artifacts
clean:
	dune clean

# Install dependencies
install:
	opam install . --deps-only --with-test

# Serve the web version locally
serve: js
	@echo "🚀 Starting local server at http://localhost:8000"
	@echo "   Open http://localhost:8000/web/ in your browser"
	cd _build/default && python3 -m http.server 8000

# Full setup from scratch
setup:
	opam install dune js_of_ocaml js_of_ocaml-ppx alcotest qcheck
	@echo "✓ Dependencies installed"

# Show project structure
tree:
	@echo "📁 Project Structure:"
	@tree -I '_build|node_modules' -L 3

help:
	@echo "Football Monopoly OCaml - Available Commands:"
	@echo ""
	@echo "  make setup    - Install OCaml dependencies"
	@echo "  make build    - Build the OCaml project"
	@echo "  make js       - Compile to JavaScript"
	@echo "  make test     - Run pure functional tests"
	@echo "  make serve    - Build and serve web version"
	@echo "  make clean    - Remove build artifacts"
	@echo ""
	@echo "Quick start:"
	@echo "  make setup && make serve"
