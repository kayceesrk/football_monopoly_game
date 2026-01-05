(* Main entry point - JS bindings for browser *)
open Js_of_ocaml
open Football_monopoly

(* Global mutable state for JS interop - wrapped around pure core *)
let current_state = ref (Game_state.create_initial_state ())

(* JS-exposed functions *)
let () =
  (* Initialize game *)
  Js.export "FootballMonopolyOCaml"
    (object%js
       method startGame num_players player_names_js =
         let player_names =
           Js.to_array player_names_js
           |> Array.to_list
           |> List.map Js.to_string
         in
         let action = Game_types.StartGame {
           num_players = num_players;
           player_names = player_names;
         } in
         match Game_logic.apply_action !current_state action with
         | Continue new_state ->
             current_state := new_state;
             Js._true
         | Error msg ->
             let () = Js.Unsafe.fun_call
               (Js.Unsafe.js_expr "console.log")
               [|Js.Unsafe.inject (Js.string msg)|] in
             Js._false
         | Winner _ -> Js._false

       method rollDice die1 die2 =
         let action = Game_types.Roll (die1, die2) in
         match Game_logic.apply_action !current_state action with
         | Continue new_state ->
             current_state := new_state;
             let curr_player = Game_logic.get_current_player new_state in
             let space = new_state.board.(curr_player.position) in

             (* Determine space name *)
             let space_name = match space.space_type with
               | Game_types.Start -> "START"
               | Game_types.Property p -> p.name
               | Game_types.Broadcasting b -> b.name
               | Game_types.Utility u -> u.name
               | Game_types.Tax t -> t.name
               | Game_types.TransferMarket -> "Transfer Market"
               | Game_types.MatchDay -> "Match Day"
               | Game_types.Corner s -> s
             in

             (* Determine event type and details *)
             let (event_type, can_buy, rent_info, tax_info) = match space.space_type with
               | Game_types.TransferMarket ->
                   (Js.some (Js.string "transferMarket"), Js._false, Js.null, Js.null)
               | Game_types.MatchDay ->
                   (Js.some (Js.string "matchDay"), Js._false, Js.null, Js.null)
               | Game_types.Tax t ->
                   (Js.null, Js._false, Js.null, Js.some (Js.Unsafe.obj [|("amount", Js.Unsafe.inject t.amount)|]))
               | Game_types.Property _ when space.property_state.owner = None ->
                   (Js.null, Js._true, Js.null, Js.null)
               | Game_types.Property _ when space.property_state.owner = Some curr_player.id ->
                   (Js.null, Js._false, Js.null, Js.null)
               | Game_types.Property _ ->
                   (match space.property_state.owner with
                    | Some owner_id ->
                        let rent = Game_logic.calculate_rent new_state space owner_id in
                        let owner = List.find (fun player -> player.Game_types.id = owner_id) new_state.players in
                        let rent_obj = Js.Unsafe.obj [|
                          ("amount", Js.Unsafe.inject rent);
                          ("ownerName", Js.Unsafe.inject (Js.string owner.Game_types.name))
                        |] in
                        (Js.null, Js._false, Js.some rent_obj, Js.null)
                    | None -> (Js.null, Js._false, Js.null, Js.null))
               | Game_types.Broadcasting _ | Game_types.Utility _ when space.property_state.owner = None ->
                   (Js.null, Js._true, Js.null, Js.null)
               | Game_types.Broadcasting _ | Game_types.Utility _ ->
                   (Js.null, Js._false, Js.null, Js.null)
               | _ -> (Js.null, Js._false, Js.null, Js.null)
             in

             object%js
               val success = Js._true
               val position = curr_player.position
               val spaceName = Js.string space_name
               val event = event_type
               val canBuy = can_buy
               val rentPaid = rent_info
               val taxPaid = tax_info
               val winner = Js.null
             end
         | Error _msg ->
             object%js
               val success = Js._false
               val position = 0
               val spaceName = Js.string ""
               val event = Js.null
               val canBuy = Js._false
               val rentPaid = Js.null
               val taxPaid = Js.null
               val winner = Js.null
             end
         | Winner player ->
             object%js
               val success = Js._true
               val position = 0
               val spaceName = Js.string ""
               val event = Js.null
               val canBuy = Js._false
               val rentPaid = Js.null
               val taxPaid = Js.null
               val winner = Js.some (Js.string player.name)
             end

       method buyProperty =
         match Game_logic.apply_action !current_state BuyProperty with
         | Continue new_state ->
             current_state := new_state;
             object%js
               val success = Js._true
             end
         | _ ->
             object%js
               val success = Js._false
             end

       method buyYouth =
         match Game_logic.apply_action !current_state BuyYouth with
         | Continue new_state ->
             current_state := new_state;
             object%js
               val success = Js._true
             end
         | _ ->
             object%js
               val success = Js._false
             end

       method buyStar =
         match Game_logic.apply_action !current_state BuyStar with
         | Continue new_state ->
             current_state := new_state;
             object%js
               val success = Js._true
             end
         | _ ->
             object%js
               val success = Js._false
             end

       method endTurn =
         match Game_logic.apply_action !current_state EndTurn with
         | Continue new_state ->
             current_state := new_state;
             object%js
               val success = Js._true
               val gameOver = Js._false
               val winner = Js.null
             end
         | Winner player ->
             object%js
               val success = Js._true
               val gameOver = Js._true
               val winner = Js.some (Js.string player.name)
             end
         | Error _ ->
             object%js
               val success = Js._false
               val gameOver = Js._false
               val winner = Js.null
             end

       method getCurrentPlayer =
         let player = Game_logic.get_current_player !current_state in
         object%js
           val id = player.id
           val name = Js.string player.name
           val money = player.money
           val position = player.position
           val properties = Js.array (Array.of_list player.properties)
         end

       method getPlayers =
         Js.array (Array.of_list (List.map (fun (player : Game_types.player) ->
           object%js
             val id = player.id
             val name = Js.string player.name
             val money = player.money
             val position = player.position
             val properties = Js.array (Array.of_list player.properties)
             val bankrupt = Js.bool player.bankrupt
           end
         ) !current_state.players))

       method getBoard =
         let spaces = Array.to_list !current_state.board in
         Js.array (Array.of_list (List.map (fun (space : Game_types.space) ->
           let (space_name, price, space_type_str) = match space.space_type with
             | Game_types.Property p -> (p.name, p.price, "Property")
             | Game_types.Broadcasting b -> (b.name, b.price, "Broadcasting")
             | Game_types.Utility u -> (u.name, u.price, "Utility")
             | Game_types.Tax t -> (t.name, 0, "Tax")
             | Game_types.TransferMarket -> ("Transfer Market", 0, "TransferMarket")
             | Game_types.MatchDay -> ("Match Day", 0, "MatchDay")
             | Game_types.Corner s -> (s, 0, "Corner")
             | Game_types.Start -> ("START", 0, "Start")
           in
           object%js
             val position = space.position
             val name = Js.string space_name
             val spaceType = Js.string space_type_str
             val price = price
             val owner = Js.Opt.option (space.property_state.owner)
             val youthPlayers = space.property_state.youth_players
             val hasStar = Js.bool space.property_state.has_star
           end
         ) spaces))

       method getActionHistory =
         let history_strings = List.map (function
           | Game_types.Roll (d1, d2) -> Printf.sprintf "Roll(%d,%d)" d1 d2
           | Game_types.BuyProperty -> "BuyProperty"
           | Game_types.BuyYouth -> "BuyYouth"
           | Game_types.BuyStar -> "BuyStar"
           | Game_types.EndTurn -> "EndTurn"
           | _ -> "Other"
         ) !current_state.action_history in
         Js.array (Array.of_list (List.map Js.string history_strings))

       method replay actions_js =
         let initial = Game_state.create_initial_state () in
         (* Replay all actions from history *)
         let actions =
           Js.to_array actions_js
           |> Array.to_list
         in
         let rec replay_loop state = function
           | [] -> state
           | action :: rest ->
               match Game_logic.apply_action state action with
               | Continue new_state -> replay_loop new_state rest
               | Winner _ | Error _ -> state
         in
         current_state := replay_loop initial actions;
         Js._true
     end)

let () =
  Js.Unsafe.global##.console##log (Js.string "Football Monopoly OCaml loaded!")
