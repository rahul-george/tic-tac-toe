// This project uses module pattern
// displayController() - handles screen updates.
// gameBoard() - handles the core game.

const create_player = function (name) {
  const playerName = name;
  const choices = [];

  const set_choice = function (choice) {
    choices.push(choice);
  };
  const get_choices = function () {
    return choices;
  };
  return {
    playerName,
    get_choices,
    set_choice,
  };
};

const gameBoard = (function () {
  /*
        1 2 3
        4 5 6
        7 8 9

        win_conditions = 123, 456, 789, 147, 258, 369, 159, 357
    */
  let empty_spaces = new Set(["1", "2", "3", "4", "5", "6", "7", "8", "9"]);
  let next_chance = 0;
  const win_conditions = [];
  const player_1 = create_player("player_1");
  const player_2 = create_player("player_2");

  const add_win_consition_sets = function (arr) {
    arr.forEach((element) => {
      win_conditions.push(new Set(element.split("")));
    });
  };
  add_win_consition_sets([
    "123",
    "456",
    "789",
    "147",
    "258",
    "369",
    "159",
    "357",
  ]);

  const set_player_1_choice = function (choice) {
    player_1.set_choice(choice);
    empty_spaces.delete(choice);
  };

  const set_player_2_choice = function (choice) {
    player_2.set_choice(choice);
    empty_spaces.delete(choice);
  };

  const evaluate_winner = function (player) {
    for (let winning_set of win_conditions) {
      if (winning_set.intersection(new Set(player.get_choices())).size === 3) {
        return { state: true, player };
      }
    }
    return { state: false };
  };

  const play = function () {
    let choice = null;
    let result = { state: false };
    while (empty_spaces.size > 0 && result.state === false) {
      switch (next_chance) {
        case 0:
          choice = prompt("Player 1 chooses");
          set_player_1_choice(choice);
          next_chance = 1;
          result = evaluate_winner(player_1);
          break;
        case 1:
          choice = prompt("Player 2 chooses");
          set_player_2_choice(choice);
          next_chance = 0;
          result = evaluate_winner(player_2);
          break;

        default:
          break;
      }
    }

    if (result.state === true) {
      alert(`${result.player.playerName} is the winner!`);
    } else if (empty_spaces.size === 0) {
      alert("Game is a tie");
    }
  };

  return {
    set_player_1_choice,
    evaluate_winner,
    play,
  };
})();

// gameBoard.play();

// Create Player 1
// Create Player 2
// Player 1 chooses
// evaluateWinner
// Player 2 chooses
// evaluateWinner
// Player 1 chooses
// ...
