(* Core game state initialization and board setup *)
open Game_types

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
        fact = "Founded in 1874, Aston Villa won the European Cup in 1982 and has 7 league titles.";
      }; property_state = empty_property_state };

    { position = 2; space_type = TransferMarket; property_state = empty_property_state };

    { position = 3; space_type = Property {
        name = "Newcastle"; price = 60;
        rent = [|4; 20; 60; 180; 320; 450|];
        color = Red;
        fact = "Newcastle United holds the record for the largest sports sponsorship deal in history.";
      }; property_state = empty_property_state };

    { position = 4; space_type = Tax { name = "Agent Fees"; amount = 200 };
      property_state = empty_property_state };

    { position = 5; space_type = Broadcasting { name = "Sky Sports"; price = 200 };
      property_state = empty_property_state };

    { position = 6; space_type = Property {
        name = "Napoli"; price = 100;
        rent = [|6; 30; 90; 270; 400; 550|];
        color = LightBlue;
        fact = "Napoli's stadium is named after Diego Maradona, who led them to their only 2 Serie A titles.";
      }; property_state = empty_property_state };

    { position = 7; space_type = MatchDay; property_state = empty_property_state };

    { position = 8; space_type = Property {
        name = "AS Roma"; price = 100;
        rent = [|6; 30; 90; 270; 400; 550|];
        color = LightBlue;
        fact = "AS Roma's mascot is a she-wolf, referencing the legend of Rome's founding by Romulus and Remus.";
      }; property_state = empty_property_state };

    { position = 9; space_type = Property {
        name = "Lazio"; price = 120;
        rent = [|8; 40; 100; 300; 450; 600|];
        color = LightBlue;
        fact = "Lazio won both the Serie A title and Coppa Italia in 2000, plus reached the UEFA Cup final.";
      }; property_state = empty_property_state };

    { position = 10; space_type = Corner "Transfer Window"; property_state = empty_property_state };

    { position = 11; space_type = Property {
        name = "AC Milan"; price = 140;
        rent = [|10; 50; 150; 450; 625; 750|];
        color = Pink;
        fact = "AC Milan has won 7 Champions League titles, second only to Real Madrid's 14.";
      }; property_state = empty_property_state };

    { position = 12; space_type = Utility { name = "Training Ground"; price = 150 };
      property_state = empty_property_state };

    { position = 13; space_type = Property {
        name = "Inter Milan"; price = 140;
        rent = [|10; 50; 150; 450; 625; 750|];
        color = Pink;
        fact = "Inter won an unprecedented treble in 2010: Serie A, Coppa Italia, and Champions League.";
      }; property_state = empty_property_state };

    { position = 14; space_type = Property {
        name = "Ajax"; price = 160;
        rent = [|12; 60; 180; 500; 700; 900|];
        color = Pink;
        fact = "Ajax's youth academy has produced Cruyff, Van Basten, Bergkamp, De Jong, and De Ligt.";
      }; property_state = empty_property_state };

    { position = 15; space_type = Broadcasting { name = "ESPN"; price = 200 };
      property_state = empty_property_state };

    { position = 16; space_type = Property {
        name = "Atletico Madrid"; price = 180;
        rent = [|14; 70; 200; 550; 750; 950|];
        color = Orange;
        fact = "Atletico Madrid beat Barcelona and Real Madrid to win La Liga in 2014 and 2021.";
      }; property_state = empty_property_state };

    { position = 17; space_type = TransferMarket; property_state = empty_property_state };

    { position = 18; space_type = Property {
        name = "Borussia Dortmund"; price = 180;
        rent = [|14; 70; 200; 550; 750; 950|];
        color = Orange;
        fact = "Dortmund's 'Yellow Wall' is the largest terrace for standing spectators in European football.";
      }; property_state = empty_property_state };

    { position = 19; space_type = Property {
        name = "Porto"; price = 200;
        rent = [|16; 80; 220; 600; 800; 1000|];
        color = Orange;
        fact = "Porto won the Champions League in 2004 under José Mourinho with an unbeaten run.";
      }; property_state = empty_property_state };

    { position = 20; space_type = Corner "Int'l Break"; property_state = empty_property_state };

    { position = 21; space_type = Property {
        name = "Tottenham"; price = 220;
        rent = [|18; 90; 250; 700; 875; 1050|];
        color = Yellow;
        fact = "Tottenham became the first British club to win a European trophy, the Cup Winners' Cup in 1963.";
      }; property_state = empty_property_state };

    { position = 22; space_type = MatchDay; property_state = empty_property_state };

    { position = 23; space_type = Property {
        name = "Juventus"; price = 220;
        rent = [|18; 90; 250; 700; 875; 1050|];
        color = Yellow;
        fact = "Juventus holds the record for most consecutive Serie A titles with 9 straight (2012-2020).";
      }; property_state = empty_property_state };

    { position = 24; space_type = Property {
        name = "Arsenal"; price = 240;
        rent = [|20; 100; 300; 750; 925; 1100|];
        color = Yellow;
        fact = "Arsenal's 'Invincibles' went unbeaten for the entire 2003-04 Premier League season (38 games).";
      }; property_state = empty_property_state };

    { position = 25; space_type = Broadcasting { name = "DAZN"; price = 200 };
      property_state = empty_property_state };

    { position = 26; space_type = Property {
        name = "PSG"; price = 260;
        rent = [|22; 110; 330; 800; 975; 1150|];
        color = Green;
        fact = "PSG's record signing Neymar (€222M in 2017) remains the most expensive transfer in history.";
      }; property_state = empty_property_state };

    { position = 27; space_type = Property {
        name = "Chelsea"; price = 260;
        rent = [|22; 110; 330; 800; 975; 1150|];
        color = Green;
        fact = "Chelsea won the Champions League in 2021 after finishing 4th in the Premier League.";
      }; property_state = empty_property_state };

    { position = 28; space_type = Utility { name = "Medical Center"; price = 150 };
      property_state = empty_property_state };

    { position = 29; space_type = Property {
        name = "Man City"; price = 280;
        rent = [|24; 120; 360; 850; 1025; 1200|];
        color = Green;
        fact = "Man City won 4 consecutive Premier League titles (2021-2024) and the treble in 2023.";
      }; property_state = empty_property_state };

    { position = 30; space_type = Corner "Relegation"; property_state = empty_property_state };

    { position = 31; space_type = Property {
        name = "Liverpool FC"; price = 300;
        rent = [|26; 130; 390; 900; 1100; 1275|];
        color = DarkBlue;
        fact = "Liverpool won 6 Champions League titles and holds the record for most European trophies by an English club.";
      }; property_state = empty_property_state };

    { position = 32; space_type = Property {
        name = "Bayern Munich"; price = 300;
        rent = [|26; 130; 390; 900; 1100; 1275|];
        color = DarkBlue;
        fact = "Bayern Munich has won 11 consecutive Bundesliga titles (2013-2023) and 6 Champions League titles.";
      }; property_state = empty_property_state };

    { position = 33; space_type = TransferMarket; property_state = empty_property_state };

    { position = 34; space_type = Property {
        name = "Man United"; price = 320;
        rent = [|28; 150; 450; 1000; 1200; 1400|];
        color = DarkBlue;
        fact = "Man United's treble-winning 1999 season included a dramatic Champions League final comeback.";
      }; property_state = empty_property_state };

    { position = 35; space_type = Broadcasting { name = "BT Sport"; price = 200 };
      property_state = empty_property_state };

    { position = 36; space_type = MatchDay; property_state = empty_property_state };

    { position = 37; space_type = Property {
        name = "Real Madrid"; price = 350;
        rent = [|35; 175; 500; 1100; 1300; 1500|];
        color = Purple;
        fact = "Real Madrid has won a record 14 Champions League titles, including 5 in the last decade.";
      }; property_state = empty_property_state };

    { position = 38; space_type = Tax { name = "FFP Fine"; amount = 100 };
      property_state = empty_property_state };

    { position = 39; space_type = Property {
        name = "Barcelona"; price = 400;
        rent = [|50; 200; 600; 1400; 1700; 2000|];
        color = Purple;
        fact = "Barcelona's tiki-taka style under Guardiola led to 6 trophies in 2009, including the treble.";
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
