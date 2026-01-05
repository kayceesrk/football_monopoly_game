(* Tests for game logic *)
open Football_monopoly

let test_initial_state () =
  let state = Game_state.create_initial_state () in
  assert (Array.length state.board = 40);
  assert (state.current_player_idx = 0);
  assert (not state.started);
  print_endline "✓ Initial state test passed"

let test_start_game () =
  let state = Game_state.create_initial_state () in
  let action = Game_types.StartGame {
    num_players = 2;
    player_names = ["Alice"; "Bob"]
  } in
  match Game_logic.apply_action state action with
  | Continue new_state ->
      assert (List.length new_state.players = 2);
      assert ((List.hd new_state.players).money = 2000);
      assert new_state.started;
      print_endline "✓ Start game test passed"
  | _ -> failwith "Start game failed"

let test_roll_and_move () =
  let state = Game_state.create_initial_state () in
  let action = Game_types.StartGame {
    num_players = 2;
    player_names = ["Alice"; "Bob"]
  } in
  match Game_logic.apply_action state action with
  | Continue state1 ->
      let roll_action = Game_types.Roll (3, 4) in
      (match Game_logic.apply_action state1 roll_action with
       | Continue state2 ->
           let player = List.hd state2.players in
           assert (player.position = 7);
           print_endline "✓ Roll and move test passed"
       | _ -> failwith "Roll failed")
  | _ -> failwith "Setup failed"

let test_buy_property () =
  let state = Game_state.create_initial_state () in
  let action = Game_types.StartGame {
    num_players = 1;
    player_names = ["Alice"]
  } in
  match Game_logic.apply_action state action with
  | Continue state1 ->
      (* Move to property *)
      let roll_action = Game_types.Roll (1, 0) in
      (match Game_logic.apply_action state1 roll_action with
       | Continue state2 ->
           (* Buy property *)
           (match Game_logic.apply_action state2 Game_types.BuyProperty with
            | Continue state3 ->
                let player = List.hd state3.players in
                let space = state3.board.(1) in
                assert (player.money = 2000 - 60); (* Aston Villa costs 60 *)
                assert (space.property_state.owner = Some 1);
                assert (List.mem 1 player.properties);
                print_endline "✓ Buy property test passed"
            | Error msg -> Printf.printf "Buy failed: %s\n" msg; failwith "Buy failed"
            | _ -> failwith "Buy unexpected result")
       | _ -> failwith "Roll failed")
  | _ -> failwith "Setup failed"

let test_pass_start () =
  let state = Game_state.create_initial_state () in
  let action = Game_types.StartGame {
    num_players = 1;
    player_names = ["Alice"]
  } in
  match Game_logic.apply_action state action with
  | Continue state1 ->
      let player_before = List.hd state1.players in
      (* Move 39 spaces (almost full circle) *)
      let state2 = ref state1 in
      for _ = 1 to 6 do
        match Game_logic.apply_action !state2 (Game_types.Roll (3, 4)) with
        | Continue s -> state2 := s
        | _ -> ()
      done;
      let player_after = List.hd (!state2).players in
      (* Should have passed start at least once *)
      assert (player_after.money > player_before.money);
      print_endline "✓ Pass start test passed"
  | _ -> failwith "Setup failed"

let () =
  print_endline "\n=== Running Football Monopoly OCaml Tests ===\n";
  test_initial_state ();
  test_start_game ();
  test_roll_and_move ();
  test_buy_property ();
  test_pass_start ();
  print_endline "\n✅ All tests passed!\n"
