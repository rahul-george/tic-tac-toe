// This project uses module pattern
// displayController() - handles screen updates.
// gameBoard() - handles the core game.

const create_player = function (name, playerMarker) {
  const playerName = name;
  const choices = [];
  const marker = playerMarker;

  const set_choice = function (choice) {
    choices.push(choice);
  };
  const get_choices = function () {
    return choices;
  };
  const get_marker = function () {
    return marker;
  };
  return {
    playerName,
    get_choices,
    set_choice,
    get_marker,
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

  const win_conditions = [];
  let player_1 = create_player("player_1", "x");
  let player_2 = create_player("player_2", "o");
  let current_player = player_1;

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

  const toggle_next_player = function () {
    current_player = current_player === player_1 ? player_2 : player_1;
  };

  const get_current_player = function () {
    return current_player;
  };

  const record_player_choice = function (choice) {
    if (!empty_spaces.has(choice)) {
      return;
    }

    current_player.set_choice(choice);
    empty_spaces.delete(choice);
  };

  const evaluate_winner = function () {
    const player = current_player;
    for (let winning_set of win_conditions) {
      if (winning_set.intersection(new Set(player.get_choices())).size === 3) {
        return {
          status: "win",
          winner: player,
          message: `${player.playerName} wins!`,
        };
      }
    }

    if (empty_spaces.size === 0) {
      return { status: "tie", message: "Match tied!" };
    }

    return { status: null };
  };

  const reset = function () {
    empty_spaces = new Set(["1", "2", "3", "4", "5", "6", "7", "8", "9"]);
    player_1 = create_player("player_1", "x");
    player_2 = create_player("player_2", "o");
    current_player = player_1;
  };

  return {
    evaluate_winner,
    record_player_choice,
    toggle_next_player,
    get_current_player,
    reset,
  };
})();

const displayController = (function (document, gameBoard) {
  const game = gameBoard;

  const gameResult = document.querySelector(".gameResult");

  const playRound = function (event) {
    game.record_player_choice(event.target.dataset.choice);
    event.target.textContent = game.get_current_player().get_marker();
    const result = game.evaluate_winner();
    game.toggle_next_player();
    if (result.status === "win") {
      gameResult.textContent = result.message;
      disableButtons();
    } else if (result.status === "tie") {
      gameResult.textContent = result.message;
      disableButtons();
    } else {
      console.log("Continue game");
    }
  };

  const restartGame = function (event) {
    gameResult.textContent = "";
    gameBoard.reset();
    buttons.forEach((cell) => (cell.textContent = ""));
    buttons.forEach((cell) => cell.addEventListener("click", playRound));
  };

  const buttons = document.querySelectorAll(".gameCell");
  buttons.forEach((cell) => cell.addEventListener("click", playRound));

  const disableButtons = function () {
    buttons.forEach((cell) => cell.removeEventListener("click", playRound));
  };

  const restart = document.querySelector(".restart");
  restart.addEventListener("click", restartGame);
})(document, gameBoard);

// gameBoard.play();

// Create Player 1
// Create Player 2
// Player 1 chooses
// evaluateWinner
// Player 2 chooses
// evaluateWinner
// Player 1 chooses
// ...
