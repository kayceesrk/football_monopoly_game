(* Game Balance Simulator for Football Monopoly *)
open Football_monopoly

type game_stats = {
  mutable total_games: int;
  mutable total_turns: int;
  mutable player1_wins: int;
  mutable player2_wins: int;
  mutable max_turns: int;
  mutable min_turns: int;
  mutable turn_counts: int list;
  mutable property_purchases: int;
  mutable youth_purchases: int;
  mutable star_purchases: int;
  mutable total_rent_scenarios: int;
  mutable derby_scenarios: int;
}

let create_stats () = {
  total_games = 0;
  total_turns = 0;
  player1_wins = 0;
  player2_wins = 0;
  max_turns = 0;
  min_turns = max_int;
  turn_counts = [];
  property_purchases = 0;
  youth_purchases = 0;
  star_purchases = 0;
  total_rent_scenarios = 0;
  derby_scenarios = 0;
}

(* Simple bot AI: buy property if affordable, develop if owned *)
let bot_play state =
  let current_player = List.nth state.Game_types.players state.current_player_idx in
  let current_space = state.board.(current_player.position) in

  (* Try to buy property if available *)
  let state =
    match current_space.space_type with
    | Game_types.Property p when current_space.property_state.owner = None ->
        if current_player.money >= p.price then
          match Game_logic.buy_property state with
          | Game_types.Continue new_state -> new_state
          | _ -> state
        else
          state
    | _ -> state
  in

  (* Try to develop owned properties *)
  let current_player = List.nth state.players state.current_player_idx in
  let current_space = state.board.(current_player.position) in
  let state =
    match current_space.property_state.owner with
    | Some owner_id when owner_id = current_player.id ->
        if current_space.property_state.youth_players < 4 then
          match current_space.space_type with
          | Game_types.Property p ->
              let youth_cost = int_of_float (float_of_int p.price *. 1.5) in
              if current_player.money >= youth_cost then
                match Game_logic.buy_youth state with
                | Game_types.Continue new_state -> new_state
                | _ -> state
              else
                state
          | _ -> state
        else if not current_space.property_state.has_star then
          match current_space.space_type with
          | Game_types.Property p ->
              let star_cost = p.price * 2 in
              if current_player.money >= star_cost then
                match Game_logic.buy_star state with
                | Game_types.Continue new_state -> new_state
                | _ -> state
              else
                state
          | _ -> state
        else
          state
    | _ -> state
  in
  state

(* Check if player owns property in color group *)
let owns_property_in_color state player_id color =
  let player = List.find (fun p -> p.Game_types.id = player_id) state.Game_types.players in
  List.exists (fun prop_idx ->
    match state.board.(prop_idx).space_type with
    | Game_types.Property prop -> prop.color = color
    | _ -> false
  ) player.properties

(* Analyze derby match scenarios in a game state *)
let analyze_derby_scenarios state =
  let rent_scenarios = ref 0 in
  let derby_count = ref 0 in

  Array.iter (fun space ->
    match space.Game_types.space_type with
    | Game_types.Property prop ->
        (match space.property_state.owner with
        | Some owner_id ->
            (* Check each other player for potential derby *)
            List.iter (fun player ->
              if player.Game_types.id <> owner_id then begin
                incr rent_scenarios;
                if owns_property_in_color state player.id prop.color then
                  incr derby_count
              end
            ) state.players
        | None -> ())
    | _ -> ()
  ) state.board;

  (!rent_scenarios, !derby_count)

(* Simulate a single game *)
let simulate_game () =
  let initial_state = Game_state.create_initial_state () in
  let state = match Game_logic.apply_action initial_state
    (Game_types.StartGame { num_players = 2; player_names = ["Bot 1"; "Bot 2"] }) with
    | Game_types.Continue s -> s
    | _ -> initial_state
  in

  let rec play_turns state turn_count max_turns properties youths stars rent_scenarios derbys =
    if turn_count >= max_turns then
      (None, turn_count, properties, youths, stars, rent_scenarios, derbys)
    else
      (* Roll dice *)
      let d1 = 1 + Random.int 6 in
      let d2 = 1 + Random.int 6 in

      match Game_logic.apply_action state (Game_types.Roll (d1, d2)) with
      | Game_types.Winner winner ->
          let (rents, derbys_in_game) = analyze_derby_scenarios state in
          (Some winner.Game_types.name, turn_count + 1, properties, youths, stars, rent_scenarios + rents, derbys + derbys_in_game)
      | Game_types.Continue new_state ->
          let props_before =
            new_state.Game_types.players
            |> List.fold_left (fun acc (p : Game_types.player) -> acc + List.length p.properties) 0
          in

          (* Bot makes decisions *)
          let new_state = bot_play new_state in

          let props_after =
            new_state.Game_types.players
            |> List.fold_left (fun acc (p : Game_types.player) -> acc + List.length p.properties) 0
          in

          let youth_count =
            Array.fold_left (fun acc space ->
              acc + space.Game_types.property_state.youth_players
            ) 0 new_state.board
          in

          let star_count =
            Array.fold_left (fun acc space ->
              acc + (if space.Game_types.property_state.has_star then 1 else 0)
            ) 0 new_state.board
          in

          let new_properties = properties + (props_after - props_before) in
          let new_youths = if youth_count > youths then youths + 1 else youths in
          let new_stars = if star_count > stars then stars + 1 else stars in

          (* End turn *)
          (match Game_logic.apply_action new_state Game_types.EndTurn with
          | Game_types.Winner winner ->
              let (rents, derbys_in_game) = analyze_derby_scenarios new_state in
              (Some winner.Game_types.name, turn_count + 1, new_properties, new_youths, new_stars, rent_scenarios + rents, derbys + derbys_in_game)
          | Game_types.Continue next_state ->
              play_turns next_state (turn_count + 1) max_turns new_properties new_youths new_stars rent_scenarios derbys
          | Game_types.Error _ ->
              (None, turn_count, new_properties, new_youths, new_stars, rent_scenarios, derbys))
      | Game_types.Error _ ->
          (None, turn_count, properties, youths, stars, rent_scenarios, derbys)
  in

  play_turns state 0 1000 0 0 0 0 0

(* Run multiple simulations *)
let run_simulations num_games =
  let stats = create_stats () in

  Printf.printf "\n=== RUNNING %d GAME SIMULATIONS ===\n\n" num_games;

  for game_num = 1 to num_games do
    let (winner, turns, props, youths, stars, rents, derbys) = simulate_game () in

    match winner with
    | Some winner_name ->
        stats.total_games <- stats.total_games + 1;
        stats.total_turns <- stats.total_turns + turns;
        stats.turn_counts <- turns :: stats.turn_counts;
        stats.max_turns <- max stats.max_turns turns;
        stats.min_turns <- min stats.min_turns turns;
        stats.property_purchases <- stats.property_purchases + props;
        stats.youth_purchases <- stats.youth_purchases + youths;
        stats.star_purchases <- stats.star_purchases + stars;
        stats.total_rent_scenarios <- stats.total_rent_scenarios + rents;
        stats.derby_scenarios <- stats.derby_scenarios + derbys;

        if winner_name = "Bot 1" then
          stats.player1_wins <- stats.player1_wins + 1
        else
          stats.player2_wins <- stats.player2_wins + 1;

        if game_num mod 10 = 0 || game_num = num_games then
          Printf.printf "Completed %d/%d games...\n%!" game_num num_games
    | None ->
        Printf.printf "Game %d did not complete\n%!" game_num
  done;

  stats

(* Calculate median *)
let median lst =
  let sorted = List.sort compare lst in
  let len = List.length sorted in
  if len = 0 then 0.0
  else if len mod 2 = 1 then
    float_of_int (List.nth sorted (len / 2))
  else
    let mid1 = List.nth sorted (len / 2 - 1) in
    let mid2 = List.nth sorted (len / 2) in
    float_of_int (mid1 + mid2) /. 2.0

(* Analyze results with derby match stats *)
let analyze_stats stats derby_stats =
  Printf.printf "\n=== SIMULATION RESULTS ===\n";
  Printf.printf "Total games: %d\n\n" stats.total_games;

  Printf.printf "Win Distribution:\n";
  Printf.printf "  Bot 1: %d (%.1f%%)\n"
    stats.player1_wins
    (float_of_int stats.player1_wins /. float_of_int stats.total_games *. 100.0);
  Printf.printf "  Bot 2: %d (%.1f%%)\n\n"
    stats.player2_wins
    (float_of_int stats.player2_wins /. float_of_int stats.total_games *. 100.0);

  let avg_turns = float_of_int stats.total_turns /. float_of_int stats.total_games in
  Printf.printf "Game Length:\n";
  Printf.printf "  Average turns: %.1f\n" avg_turns;
  Printf.printf "  Min turns: %d\n" stats.min_turns;
  Printf.printf "  Max turns: %d\n" stats.max_turns;
  Printf.printf "  Median turns: %.1f\n\n" (median stats.turn_counts);

  Printf.printf "Economic Activity:\n";
  Printf.printf "  Avg properties per game: %.1f\n"
    (float_of_int stats.property_purchases /. float_of_int stats.total_games);
  Printf.printf "  Avg youth players per game: %.1f\n"
    (float_of_int stats.youth_purchases /. float_of_int stats.total_games);
  Printf.printf "  Avg star players per game: %.1f\n\n"
    (float_of_int stats.star_purchases /. float_of_int stats.total_games);

  Printf.printf "Derby Matches:\n";
  Printf.printf "  Total rent scenarios: %d\n" derby_stats.total_rent_scenarios;
  Printf.printf "  Derby matches (2x rent): %d (%.1f%%)\n\n"
    derby_stats.derby_scenarios
    (if derby_stats.total_rent_scenarios > 0 then
      float_of_int derby_stats.derby_scenarios /. float_of_int derby_stats.total_rent_scenarios *. 100.0
    else 0.0);

  (* Balance analysis *)
  Printf.printf "=== BALANCE ANALYSIS ===\n";
  let win_diff = abs (stats.player1_wins - stats.player2_wins) in
  let balance_score = (1.0 -. float_of_int win_diff /. float_of_int stats.total_games) *. 100.0 in
  let balance_status =
    if balance_score > 95.0 then "EXCELLENT"
    else if balance_score > 90.0 then "GOOD"
    else if balance_score > 80.0 then "OK"
    else "NEEDS WORK"
  in
  Printf.printf "Balance Score: %.1f%% (%s)\n" balance_score balance_status;

  if avg_turns < 30.0 then
    Printf.printf "⚠ Games are very short - may need to increase starting money or reduce costs\n"
  else if avg_turns > 200.0 then
    Printf.printf "⚠ Games are very long - may need to increase rents or reduce starting money\n"
  else
    Printf.printf "✓ Game length is well-balanced\n";

  Printf.printf "\n=== RECOMMENDATIONS ===\n";

  if balance_score < 85.0 then
    Printf.printf "- First player advantage detected - consider adjusting turn order rules\n";

  if avg_turns < 50.0 then
    Printf.printf "- Consider increasing starting money (currently 2000 FC)\n";

  if avg_turns > 150.0 then
    Printf.printf "- Consider increasing base rents or reducing development costs\n";

  let avg_properties = float_of_int stats.property_purchases /. float_of_int stats.total_games in
  if avg_properties < 10.0 then
    Printf.printf "- Not enough property trading - consider reducing property costs\n"
  else if avg_properties > 18.0 then
    Printf.printf "- Too many properties being purchased - consider increasing costs\n";

  Printf.printf "\n"

(* Main simulation entry point *)
let () =
  Random.self_init ();
  Printf.printf "⚽ FOOTBALL MONOPOLY - OCaml Simulation\n";
  Printf.printf "======================================\n";

  let num_games =
    if Array.length Sys.argv > 1 then
      int_of_string Sys.argv.(1)
    else
      100
  in

  let stats = run_simulations num_games in
  analyze_stats stats stats
