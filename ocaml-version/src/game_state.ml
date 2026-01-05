(* Core game state initialization and board setup *)
open Game_types
open Club_facts

let empty_property_state = {
  owner = None;
  youth_players = 0;
  has_star = false;
}

let create_board () : space array =
  [|
    { position = 0; space_type = Start; property_state = empty_property_state };

    { position = 1; space_type = Property {
        name = "Aston Villa"; price = 60;
        rent = [|2; 10; 30; 90; 160; 250|];
        color = Red;
        facts = aston_villa_facts;
      }; property_state = empty_property_state };

    { position = 2; space_type = TransferMarket; property_state = empty_property_state };

    { position = 3; space_type = Property {
        name = "Newcastle"; price = 60;
        rent = [|4; 20; 60; 180; 320; 450|];
        color = Red;
        facts = newcastle_facts;
      }; property_state = empty_property_state };

    { position = 4; space_type = Tax { name = "Agent Fees"; amount = 200 };
      property_state = empty_property_state };

    { position = 5; space_type = Broadcasting { name = "Sky Sports"; price = 200 };
      property_state = empty_property_state };

    { position = 6; space_type = Property {
        name = "Napoli"; price = 100;
        rent = [|6; 30; 90; 270; 400; 550|];
        color = LightBlue;
        facts = napoli_facts;
      }; property_state = empty_property_state };

    { position = 7; space_type = MatchDay; property_state = empty_property_state };

    { position = 8; space_type = Property {
        name = "AS Roma"; price = 100;
        rent = [|6; 30; 90; 270; 400; 550|];
        color = LightBlue;
        facts = as_roma_facts;
      }; property_state = empty_property_state };

    { position = 9; space_type = Property {
        name = "Lazio"; price = 120;
        rent = [|8; 40; 100; 300; 450; 600|];
        color = LightBlue;
        facts = lazio_facts;
      }; property_state = empty_property_state };

    { position = 10; space_type = Corner "Transfer Window"; property_state = empty_property_state };

    { position = 11; space_type = Property {
        name = "AC Milan"; price = 140;
        rent = [|10; 50; 150; 450; 625; 750|];
        color = Pink;
        facts = ac_milan_facts;
      }; property_state = empty_property_state };

    { position = 12; space_type = Utility { name = "Training Ground"; price = 150 };
      property_state = empty_property_state };

    { position = 13; space_type = Property {
        name = "Inter Milan"; price = 140;
        rent = [|10; 50; 150; 450; 625; 750|];
        color = Pink;
        facts = inter_milan_facts;
      }; property_state = empty_property_state };

    { position = 14; space_type = Property {
        name = "Ajax"; price = 160;
        rent = [|12; 60; 180; 500; 700; 900|];
        color = Pink;
        facts = ajax_facts;
      }; property_state = empty_property_state };

    { position = 15; space_type = Broadcasting { name = "ESPN"; price = 200 };
      property_state = empty_property_state };

    { position = 16; space_type = Property {
        name = "Atletico Madrid"; price = 180;
        rent = [|14; 70; 200; 550; 750; 950|];
        color = Orange;
        facts = atletico_madrid_facts;
      }; property_state = empty_property_state };

    { position = 17; space_type = TransferMarket; property_state = empty_property_state };

    { position = 18; space_type = Property {
        name = "Borussia Dortmund"; price = 180;
        rent = [|14; 70; 200; 550; 750; 950|];
        color = Orange;
        facts = borussia_dortmund_facts;
      }; property_state = empty_property_state };

    { position = 19; space_type = Property {
        name = "Porto"; price = 200;
        rent = [|16; 80; 220; 600; 800; 1000|];
        color = Orange;
        facts = porto_facts;
      }; property_state = empty_property_state };

    { position = 20; space_type = Corner "Int'l Break"; property_state = empty_property_state };

    { position = 21; space_type = Property {
        name = "Tottenham"; price = 220;
        rent = [|18; 90; 250; 700; 875; 1050|];
        color = Yellow;
        facts = tottenham_facts;
      }; property_state = empty_property_state };

    { position = 22; space_type = MatchDay; property_state = empty_property_state };

    { position = 23; space_type = Property {
        name = "Juventus"; price = 220;
        rent = [|18; 90; 250; 700; 875; 1050|];
        color = Yellow;
        facts = juventus_facts;
      }; property_state = empty_property_state };

    { position = 24; space_type = Property {
        name = "Arsenal"; price = 240;
        rent = [|20; 100; 300; 750; 925; 1100|];
        color = Yellow;
        facts = arsenal_facts;
      }; property_state = empty_property_state };

    { position = 25; space_type = Broadcasting { name = "DAZN"; price = 200 };
      property_state = empty_property_state };

    { position = 26; space_type = Property {
        name = "PSG"; price = 260;
        rent = [|22; 110; 330; 800; 975; 1150|];
        color = Green;
        facts = psg_facts;
      }; property_state = empty_property_state };

    { position = 27; space_type = Property {
        name = "Chelsea"; price = 260;
        rent = [|22; 110; 330; 800; 975; 1150|];
        color = Green;
        facts = chelsea_facts;
      }; property_state = empty_property_state };

    { position = 28; space_type = Utility { name = "Medical Center"; price = 150 };
      property_state = empty_property_state };

    { position = 29; space_type = Property {
        name = "Man City"; price = 280;
        rent = [|24; 120; 360; 850; 1025; 1200|];
        color = Green;
        facts = man_city_facts;
      }; property_state = empty_property_state };

    { position = 30; space_type = Corner "Relegation"; property_state = empty_property_state };

    { position = 31; space_type = Property {
        name = "Liverpool FC"; price = 300;
        rent = [|26; 130; 390; 900; 1100; 1275|];
        color = DarkBlue;
        facts = liverpool_facts;
      }; property_state = empty_property_state };

    { position = 32; space_type = Property {
        name = "Bayern Munich"; price = 300;
        rent = [|26; 130; 390; 900; 1100; 1275|];
        color = DarkBlue;
        facts = bayern_munich_facts;
      }; property_state = empty_property_state };

    { position = 33; space_type = TransferMarket; property_state = empty_property_state };

    { position = 34; space_type = Property {
        name = "Man United"; price = 320;
        rent = [|28; 150; 450; 1000; 1200; 1400|];
        color = DarkBlue;
        facts = man_united_facts;
      }; property_state = empty_property_state };

    { position = 35; space_type = Broadcasting { name = "BT Sport"; price = 200 };
      property_state = empty_property_state };

    { position = 36; space_type = MatchDay; property_state = empty_property_state };

    { position = 37; space_type = Property {
        name = "Real Madrid"; price = 350;
        rent = [|35; 175; 500; 1100; 1300; 1500|];
        color = Purple;
        facts = real_madrid_facts;
      }; property_state = empty_property_state };

    { position = 38; space_type = Tax { name = "FFP Fine"; amount = 100 };
      property_state = empty_property_state };

    { position = 39; space_type = Property {
        name = "Barcelona"; price = 400;
        rent = [|50; 200; 600; 1400; 1700; 2000|];
        color = Purple;
        facts = barcelona_facts;
      }; property_state = empty_property_state };
  |]

let transfer_market_cards : card array = [|
  { text = "Youth academy produces talent! Collect 150 FC"; action = Collect 150 };
  { text = "Shirt sales boom! Collect 100 FC"; action = Collect 100 };
  { text = "Champions League qualification! Collect 200 FC"; action = Collect 200 };
  { text = "Player sold to rival! Collect 250 FC"; action = Collect 250 };
  { text = "Manager bonus awarded! Collect 100 FC"; action = Collect 100 };
  { text = "Stadium naming rights! Collect 150 FC"; action = Collect 150 };
  { text = "Failed transfer! Pay 50 FC"; action = Pay 50 };
  { text = "Overpaid for player! Pay 100 FC"; action = Pay 100 };
  { text = "Agent demands extra fee! Pay 75 FC"; action = Pay 75 };
  { text = "Luxury tax on spending! Pay 150 FC"; action = Pay 150 };
|]

let match_day_cards : card array = [|
  { text = "Win! Collect 100 FC from each player"; action = CollectFromAll 100 };
  { text = "Draw. Nothing happens."; action = Nothing };
  { text = "Victory! Collect 150 FC"; action = Collect 150 };
  { text = "Sponsorship deal! Collect 200 FC"; action = Collect 200 };
  { text = "Loss. Pay 50 FC to each player"; action = PayToAll 50 };
  { text = "Injury crisis! Pay 100 FC"; action = Pay 100 };
  { text = "Fan protest! Pay 75 FC"; action = Pay 75 };
  { text = "Stadium maintenance! Pay 50 FC"; action = Pay 50 };
|]

let create_initial_state () : game_state = {
  players = [];
  board = create_board ();
  current_player_idx = 0;
  started = false;
  turn_count = 0;
  action_history = [];
  rng_seed = None;
  last_card = None;
}

let create_player id name : player = {
  id;
  name;
  money = starting_money;
  position = 0;
  properties = [];
  bankrupt = false;
}
