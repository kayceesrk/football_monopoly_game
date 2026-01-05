(* Pure game logic - all functions are deterministic transformations *)
open Game_types
open Game_state

(* Helper: Get current player *)
let get_current_player state =
  List.nth state.players state.current_player_idx

(* Helper: Update player in list *)
let update_player players player =
  List.map (fun p -> if p.id = player.id then player else p) players

(* Helper: Check if player owns all properties of a color *)
let owns_monopoly state player color =
  let color_properties =
    Array.to_list state.board
    |> List.filter_map (fun space ->
        match space.space_type with
        | Property p when p.color = color -> Some space.position
        | _ -> None)
  in
  List.for_all (fun pos ->
    let space = state.board.(pos) in
    space.property_state.owner = Some player.id
  ) color_properties

(* Calculate rent for a property *)
let calculate_rent state space player_id =
  match space.space_type with
  | Property prop ->
      let dev_level =
        if space.property_state.has_star then 5
        else space.property_state.youth_players
      in
      let base_rent = prop.rent.(dev_level) in
      (* Double rent for monopoly without development *)
      if dev_level = 0 && owns_monopoly state { id = player_id; name = ""; money = 0; position = 0; properties = []; bankrupt = false } prop.color
      then base_rent * 2
      else base_rent
  | _ -> 0

(* Apply a roll action *)
let apply_roll state die1 die2 =
  let player = get_current_player state in
  let total = die1 + die2 in
  let old_pos = player.position in
  let new_pos = (old_pos + total) mod num_spaces in

  (* Check if passed start *)
  let passed_start = new_pos < old_pos in
  let bonus = if passed_start then pass_start_bonus else 0 in

  let updated_player = {
    player with
    position = new_pos;
    money = player.money + bonus;
  } in

  { state with
    players = update_player state.players updated_player;
    action_history = Roll (die1, die2) :: state.action_history;
  }

(* Apply card effect *)
let apply_card state card =
  let player = get_current_player state in
  match card.action with
  | Collect amount ->
      let updated_player = { player with money = player.money + amount } in
      Continue { state with players = update_player state.players updated_player }

  | Pay amount ->
      let updated_player = { player with money = player.money - amount } in
      Continue { state with players = update_player state.players updated_player }

  | CollectFromAll amount ->
      let other_players = List.filter (fun p -> p.id <> player.id) state.players in
      let num_others = List.length other_players in
      let total_collected = amount * num_others in
      let updated_player = { player with money = player.money + total_collected } in
      let new_players =
        List.map (fun p ->
          if p.id = player.id then updated_player
          else { p with money = p.money - amount }
        ) state.players
      in
      Continue { state with players = new_players }

  | PayToAll amount ->
      let other_players = List.filter (fun p -> p.id <> player.id) state.players in
      let num_others = List.length other_players in
      let total_paid = amount * num_others in
      let updated_player = { player with money = player.money - total_paid } in
      let new_players =
        List.map (fun p ->
          if p.id = player.id then updated_player
          else { p with money = p.money + amount }
        ) state.players
      in
      Continue { state with players = new_players }

  | Nothing -> Continue state

(* Handle landing on a space *)
let handle_landing state =
  let player = get_current_player state in
  let space = state.board.(player.position) in

  match space.space_type with
  | Tax t ->
      let updated_player = { player with money = player.money - t.amount } in
      Continue { state with players = update_player state.players updated_player }

  | Property _ when space.property_state.owner = Some player.id ->
      Continue state (* Own property, nothing happens *)

  | Property _ when space.property_state.owner = None ->
      Continue state (* Unowned, can buy *)

  | Property _ ->
      (* Pay rent *)
      (match space.property_state.owner with
       | Some owner_id ->
           let rent = calculate_rent state space owner_id in
           let updated_player = { player with money = player.money - rent } in
           let owner = List.find (fun p -> p.id = owner_id) state.players in
           let updated_owner = { owner with money = owner.money + rent } in
           let new_players =
             update_player state.players updated_player
             |> (fun ps -> update_player ps updated_owner)
           in
           Continue { state with players = new_players }
       | None -> Continue state)

  | Broadcasting _ when space.property_state.owner = Some player.id ->
      Continue state (* Own broadcasting, nothing happens *)

  | Broadcasting _ when space.property_state.owner = None ->
      Continue state (* Unowned, can buy *)

  | Broadcasting _ ->
      (* Pay broadcasting rent: 25 * 2^(num_owned - 1) *)
      (match space.property_state.owner with
       | Some owner_id ->
           let num_broadcasting = Array.fold_left (fun count s ->
             match s.space_type with
             | Broadcasting _ when s.property_state.owner = Some owner_id -> count + 1
             | _ -> count
           ) 0 state.board in
           let rent = 25 * (1 lsl (num_broadcasting - 1)) in (* bit shift for power of 2 *)
           let updated_player = { player with money = player.money - rent } in
           let owner = List.find (fun p -> p.id = owner_id) state.players in
           let updated_owner = { owner with money = owner.money + rent } in
           let new_players =
             update_player state.players updated_player
             |> (fun ps -> update_player ps updated_owner)
           in
           Continue { state with players = new_players }
       | None -> Continue state)

  | Utility _ when space.property_state.owner = Some player.id ->
      Continue state (* Own utility, nothing happens *)

  | Utility _ when space.property_state.owner = None ->
      Continue state (* Unowned, can buy *)

  | Utility _ ->
      (* Pay utility rent: dice_total * (4 if 1 utility, 10 if 2 utilities) *)
      (* Note: We need the dice roll from history *)
      (match space.property_state.owner with
       | Some owner_id ->
           let num_utilities = Array.fold_left (fun count s ->
             match s.space_type with
             | Utility _ when s.property_state.owner = Some owner_id -> count + 1
             | _ -> count
           ) 0 state.board in
           let multiplier = if num_utilities = 1 then 4 else 10 in
           (* Get last dice roll from history *)
           let dice_total = match state.action_history with
             | Roll (d1, d2) :: _ -> d1 + d2
             | _ -> 0
           in
           let rent = dice_total * multiplier in
           let updated_player = { player with money = player.money - rent } in
           let owner = List.find (fun p -> p.id = owner_id) state.players in
           let updated_owner = { owner with money = owner.money + rent } in
           let new_players =
             update_player state.players updated_player
             |> (fun ps -> update_player ps updated_owner)
           in
           Continue { state with players = new_players }
       | None -> Continue state)

  | TransferMarket ->
      (* Draw a random transfer market card *)
      let idx = Random.int (Array.length transfer_market_cards) in
      let card = transfer_market_cards.(idx) in
      apply_card state card

  | MatchDay ->
      (* Draw a random match day card *)
      let idx = Random.int (Array.length match_day_cards) in
      let card = match_day_cards.(idx) in
      apply_card state card

  | _ -> Continue state

(* Buy property *)
let buy_property state =
  let player = get_current_player state in
  let space = state.board.(player.position) in

  match space.space_type with
  | Property prop when space.property_state.owner = None ->
      if player.money >= prop.price then
        let updated_player = {
          player with
          money = player.money - prop.price;
          properties = player.position :: player.properties;
        } in
        let updated_space = {
          space with
          property_state = { space.property_state with owner = Some player.id };
        } in
        let new_board = Array.copy state.board in
        new_board.(player.position) <- updated_space;
        Continue {
          state with
          players = update_player state.players updated_player;
          board = new_board;
          action_history = BuyProperty :: state.action_history;
        }
      else
        Error "Not enough money to buy property"
  | Broadcasting b when space.property_state.owner = None ->
      if player.money >= b.price then
        let updated_player = {
          player with
          money = player.money - b.price;
          properties = player.position :: player.properties;
        } in
        let updated_space = {
          space with
          property_state = { space.property_state with owner = Some player.id };
        } in
        let new_board = Array.copy state.board in
        new_board.(player.position) <- updated_space;
        Continue {
          state with
          players = update_player state.players updated_player;
          board = new_board;
          action_history = BuyProperty :: state.action_history;
        }
      else
        Error "Not enough money to buy broadcasting"
  | Utility u when space.property_state.owner = None ->
      if player.money >= u.price then
        let updated_player = {
          player with
          money = player.money - u.price;
          properties = player.position :: player.properties;
        } in
        let updated_space = {
          space with
          property_state = { space.property_state with owner = Some player.id };
        } in
        let new_board = Array.copy state.board in
        new_board.(player.position) <- updated_space;
        Continue {
          state with
          players = update_player state.players updated_player;
          board = new_board;
          action_history = BuyProperty :: state.action_history;
        }
      else
        Error "Not enough money to buy utility"
  | _ -> Error "Cannot buy this space"

(* Buy youth player *)
let buy_youth state =
  let player = get_current_player state in
  let space = state.board.(player.position) in

  match space.space_type with
  | Property prop when space.property_state.owner = Some player.id ->
      let cost = youth_cost prop.price in
      if space.property_state.youth_players >= 4 then
        Error "Maximum youth players reached"
      else if player.money < cost then
        Error "Not enough money"
      else
        let updated_player = { player with money = player.money - cost } in
        let updated_space = {
          space with
          property_state = {
            space.property_state with
            youth_players = space.property_state.youth_players + 1;
          };
        } in
        let new_board = Array.copy state.board in
        new_board.(player.position) <- updated_space;
        Continue {
          state with
          players = update_player state.players updated_player;
          board = new_board;
          action_history = BuyYouth :: state.action_history;
        }
  | _ -> Error "Cannot buy youth player here"

(* Buy star player *)
let buy_star state =
  let player = get_current_player state in
  let space = state.board.(player.position) in

  match space.space_type with
  | Property prop when space.property_state.owner = Some player.id ->
      let cost = star_cost prop.price in
      if space.property_state.youth_players < 4 then
        Error "Need 4 youth players first"
      else if space.property_state.has_star then
        Error "Already has star player"
      else if player.money < cost then
        Error "Not enough money"
      else
        let updated_player = { player with money = player.money - cost } in
        let updated_space = {
          space with
          property_state = {
            space.property_state with
            has_star = true;
          };
        } in
        let new_board = Array.copy state.board in
        new_board.(player.position) <- updated_space;
        Continue {
          state with
          players = update_player state.players updated_player;
          board = new_board;
          action_history = BuyStar :: state.action_history;
        }
  | _ -> Error "Cannot buy star player here"

(* End turn *)
let end_turn state =
  let player = get_current_player state in

  (* Check bankruptcy *)
  if player.money < 0 then
    let bankrupt_player = { player with bankrupt = true } in
    (* Release all properties *)
    let new_board =
      Array.map (fun space ->
        if space.property_state.owner = Some player.id then
          { space with property_state = empty_property_state }
        else space
      ) state.board
    in
    let new_players = update_player state.players bankrupt_player in
    let active_players = List.filter (fun p -> not p.bankrupt) new_players in

    (* Check for winner *)
    if List.length active_players = 1 then
      Winner (List.hd active_players)
    else
      let next_idx = (state.current_player_idx + 1) mod List.length state.players in
      Continue {
        state with
        players = new_players;
        board = new_board;
        current_player_idx = next_idx;
        turn_count = state.turn_count + 1;
        action_history = EndTurn :: state.action_history;
      }
  else
    (* Normal turn end *)
    let next_idx = (state.current_player_idx + 1) mod List.length state.players in
    Continue {
      state with
      current_player_idx = next_idx;
      turn_count = state.turn_count + 1;
      action_history = EndTurn :: state.action_history;
    }

(* Main action dispatcher *)
let apply_action state action =
  match action with
  | StartGame { num_players = _; player_names } ->
      let players = List.mapi (fun i name -> create_player (i + 1) name) player_names in
      Continue {
        state with
        players;
        started = true;
        action_history = action :: state.action_history;
      }

  | Roll (die1, die2) ->
      let new_state = apply_roll state die1 die2 in
      handle_landing new_state

  | BuyProperty -> buy_property state
  | BuyYouth -> buy_youth state
  | BuyStar -> buy_star state

  | DrawTransferCard idx ->
      let card = transfer_market_cards.(idx mod Array.length transfer_market_cards) in
      apply_card state card

  | DrawMatchDayCard idx ->
      let card = match_day_cards.(idx mod Array.length match_day_cards) in
      apply_card state card

  | EndTurn -> end_turn state
