(* Core type definitions for Football Monopoly *)

type player_id = int

type money = int

type position = int

type color =
  | Red | LightBlue | Pink | Orange
  | Yellow | Green | DarkBlue | Purple

type space_type =
  | Start
  | Property of {
      name: string;
      price: money;
      rent: money array; (* [base; 1youth; 2youth; 3youth; 4youth; star] *)
      color: color;
      facts: string array; (* Multiple interesting facts about the club *)
    }
  | Broadcasting of { name: string; price: money }
  | Utility of { name: string; price: money }
  | Tax of { name: string; amount: money }
  | TransferMarket
  | MatchDay
  | Corner of string

type property_state = {
  owner: player_id option;
  youth_players: int;
  has_star: bool;
}

type space = {
  position: position;
  space_type: space_type;
  property_state: property_state;
}

type player = {
  id: player_id;
  name: string;
  money: money;
  position: position;
  properties: position list;
  bankrupt: bool;
}

type card_action =
  | Collect of money
  | Pay of money
  | CollectFromAll of money
  | PayToAll of money
  | Nothing

type card = {
  text: string;
  action: card_action;
}

type game_action =
  | StartGame of { num_players: int; player_names: string list }
  | Roll of int * int
  | BuyProperty
  | BuyYouth
  | BuyStar
  | DrawTransferCard of int (* card index *)
  | DrawMatchDayCard of int
  | EndTurn

type game_state = {
  players: player list;
  board: space array;
  current_player_idx: int;
  started: bool;
  turn_count: int;
  action_history: game_action list; (* For replay *)
  rng_seed: int option; (* For deterministic simulation *)
  last_card: card option; (* Last drawn card for UI display *)
}

type game_result =
  | Continue of game_state
  | Winner of player
  | Error of string

(* Helper functions *)
let starting_money = 2000

let num_spaces = 40

let pass_start_bonus = 200

let colors_list = [Red; LightBlue; Pink; Orange; Yellow; Green; DarkBlue; Purple]

let color_to_string = function
  | Red -> "red"
  | LightBlue -> "lightblue"
  | Pink -> "pink"
  | Orange -> "orange"
  | Yellow -> "yellow"
  | Green -> "green"
  | DarkBlue -> "darkblue"
  | Purple -> "purple"

let youth_cost price = price * 3 / 2  (* 150% *)
let star_cost price = price * 2       (* 200% *)
