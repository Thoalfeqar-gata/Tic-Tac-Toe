const Game = (() =>
{
    //Inner factory functions.    
    const GameBoard = (() =>
    {
        //attrs
        let spots = [];
        const markers = document.querySelectorAll(".marker-container");
        
        //this map should help visualize the 'cases' array.
        /*
            0 | 1 | 2
          -------------
            3 | 4 | 5
          -------------
            6 | 7 | 8
        */
        const cases = [
                        [0, 4, 8], 
                        [2, 4, 6], 
                        [0, 1, 2], 
                        [3, 4, 5], 
                        [6, 7, 8], 
                        [0, 3, 6], 
                        [1, 4, 7], 
                        [2, 5, 8]];

        //setup
        for(let i = 0; i < markers.length; i++)
        {
            markers[i].addEventListener("click", event =>
            {
                if(markers[i].textContent == '')
                {
                    spots[i] = currentPlayer.marker;
                    markers[i].classList.add("marker-container-active");
                    let [result, winnerName] = checkWinner(i);

                    if(result != null)
                    {
                        displayWinner(winnerName);
                    }
                    else if(isTie())
                    {
                        displayWinner(null);
                        return;
                    }
                    else
                    {               
                        if(secondPlayer.type == "normal")
                        {
                            if(currentPlayer == secondPlayer)
                                updateCurrent(firstPlayer);
                            else
                                updateCurrent(secondPlayer);
                        }
                        else if(secondPlayer.type == "random")
                        {
                            randomPlay();
                        }
                        else if(secondPlayer.type == "smart")
                        {
                            smartPlay();
                        }
                    }
                    updateDisplay();
                }
            });
        }

        //methods

        const isTie = () =>
        {
            return !spots.includes('');
        };

        const updateDisplay = () =>
        {
            for(let i = 0; i < spots.length; i++)
            {
                markers[i].textContent = spots[i];
            }
        };

        const checkWinner = (index) =>
        {
            let possibleCases = [];
            for(let singleCase of cases)
            {
                if(singleCase.includes(index))
                {
                    possibleCases.push(singleCase);
                }
            }

            let result = null;
            let winnerName = '';

            for(let c of possibleCases)
            {
                result = (spots[c[0]] == spots[c[1]] && spots[c[1]] == spots[c[2]]) ? spots[c[0]] : null;
                if(result != null)
                {
                    if(result == firstPlayer.marker)
                    {
                        winnerName = firstPlayer.name;
                        return [result, winnerName];
                    }
                    else
                    {
                        winnerName = secondPlayer.name;
                        return [result, winnerName];
                    }
                }
            }

            return [result, winnerName];
        };

        const displayWinner = (winnerName) =>
        {
            if(winnerName == null)
            {
                winnerPrompt.textContent = "A tie!";
            }
            else
            {
                winnerPrompt.textContent = `The winner is: ${winnerName}.`;
            }

            winnerPrompt.classList.add("winner-prompt-active");
            overlay.classList.add("overlay-active");
        }

        const reInitialize = () =>
        {
            spots = ['', '', '', '', '', '', '', '', ''];

            for(let marker of markers)
            {
                marker.classList.remove("marker-container-active");
            }
            updateDisplay();
        };


        const minimax = (isMaximizing, place) =>
        {
            let result = checkWinner(place)[0];
            
            if(result != null)
            {
                if(result == secondPlayer.marker)
                {
                    return 10;
                }
                else if(result == firstPlayer.marker)
                {
                    return -10;
                }
            }
            else if(isTie())
            {
                return 0;
            }

            if(isMaximizing)
            {
                let bestScore = -Infinity;
                for(let i = 0; i < spots.length; i++)
                {
                    if(spots[i] == '')
                    {
                        spots[i] = secondPlayer.marker;
                        let score = minimax(false, i);
                        spots[i] = '';
                        bestScore = Math.max(bestScore, score);
                    }
                }
                return bestScore;
            }
            else
            {
                let bestScore = Infinity;
                for(let i = 0; i < spots.length; i++)
                {
                    if(spots[i] == '')
                    {
                        spots[i] = firstPlayer.marker;
                        let score = minimax(true, i);
                        spots[i] = '';
                        bestScore = Math.min(bestScore, score);
                    }
                }
                return bestScore;
            }
        };

        const smartMove = () =>
        {
            let bestScore = -Infinity;
            let move;
            for(let i = 0; i < spots.length; i++)
            {
                if(spots[i] == '')
                {
                    spots[i] = secondPlayer.marker;
                    let score = minimax(false, i);
                    spots[i] = '';
                    if(score > bestScore)
                    {
                        bestScore = score;
                        move = i;
                    }
                }
            }

            spots[move] = secondPlayer.marker;
            markers[move].classList.add("marker-container-active");
            updateDisplay();
            return move;
        };

        const randomMove = (marker) =>
        {
            let validSpots = [];
            for(let i = 0; i < spots.length; i++)
            {
                if(spots[i] == '')
                {
                    validSpots.push(i);
                }
            }

            let randSpot = validSpots[Math.floor(Math.random() * validSpots.length)];
            spots[randSpot] = marker;
            markers[randSpot].classList.add("marker-container-active");
            updateDisplay();
            return randSpot;
        };

        return {reInitialize, randomMove, smartMove, checkWinner, displayWinner, isTie};
    })();

    
    const Player = (playerName, playerMark) =>
    {
        let marker = playerMark;
        let name = playerName;
        let type = "normal";
        return {name, marker, type};
    };

    const RandomPlayer = (playerName, playerMark) =>
    {
        let player = Player(playerName, playerMark);
        let type = "random";
        let obj = Object.assign({}, player, {type});

        return obj;
    };

    const SmartPlayer = (playerName, playerMark) => 
    {
        let player = Player(playerName, playerMark);
        let type = "smart";
        let obj = Object.assign({}, player, {type});
        return obj;
    };

    //attributes
    let firstPlayer = Player("X", "X");
    let secondPlayer = Player("O", "O");

    //current player will be used if 2 players are playing against each other (humans).
    let currentPlayer = firstPlayer;


    let markerChoice = 0;
    let opponentChoice = 0;
    
    //DOM elements
    const welcomeScreen = document.querySelector(".welcome-screen");
    const start = document.querySelector(".start");
    const options = document.querySelector(".options");
    const winnerPrompt = document.querySelector(".winner-prompt");
    const overlay = document.querySelector(".overlay");
    const optionsScreen = document.querySelector(".options-screen");
    const markerChoiceX = document.querySelector(".marker-choice-X");
    const markerChoiceO = document.querySelector(".marker-choice-O");
    const opponentOther = document.querySelector(".second-player-opponent");
    const opponentRandom = document.querySelector(".randomAI-opponent");
    const opponentSmart = document.querySelector(".smartAI-opponent");
    const firstPlayerName = document.querySelector(".first-player-name");
    const secondPlayerName = document.querySelector(".second-player-name");
    const startButton = document.querySelector(".start-button");
    const board = document.querySelector(".board-container");


    start.addEventListener("click", event =>
    {
        welcomeScreen.style.display = "none";
        board.style.display = "flex";
    });

    options.addEventListener("click", event =>
    {
        welcomeScreen.style.display = "none";
        optionsScreen.style.display = "flex";
    });

    markerChoiceX.addEventListener("click", event =>
    {
        event.target.classList.add("marker-hover");
        markerChoiceO.classList.remove("marker-hover");
        markerChoice = 'X';
    });

    markerChoiceO.addEventListener("click", event =>
    {
        event.target.classList.add("marker-hover");
        markerChoiceX.classList.remove("marker-hover");
        markerChoice = 'O';
    });

    opponentOther.addEventListener("click", event =>
    {
        event.target.classList.add("opponent-selected");
        opponentSmart.classList.remove("opponent-selected");
        opponentRandom.classList.remove("opponent-selected");
        opponentChoice = "normal";
    });

    opponentRandom.addEventListener("click", event =>
    {
        event.target.classList.add("opponent-selected");
        opponentSmart.classList.remove("opponent-selected");
        opponentOther.classList.remove("opponent-selected");
        opponentChoice = "random";
    });

    opponentSmart.addEventListener("click", event =>
    {
        event.target.classList.add("opponent-selected");
        opponentRandom.classList.remove("opponent-selected");
        opponentOther.classList.remove("opponent-selected");
        opponentChoice = "smart";
    });

    firstPlayerName.addEventListener("change", event =>
    {
        firstPlayer.name = event.target.value;
    });

    secondPlayerName.addEventListener("change", event => 
    {
        secondPlayer.name = event.target.value;
    });

    startButton.addEventListener("click", event =>
    {
        if(opponentChoice != 0)
        {
            if(opponentChoice == "normal")
            {
                if(markerChoice == "X")
                {
                    if(secondPlayerName.value == '')
                        secondPlayer = Player("O", "O");
                    else
                        secondPlayer = Player(secondPlayerName.value, "O");
                }
                else if(markerChoice == "O")
                {
                    if(secondPlayerName.value == '')
                        secondPlayer = Player("X", "X");
                    else
                        secondPlayer = Player(secondPlayerName.value, "X");
                    
                    if(firstPlayerName.value == '')
                        firstPlayer = Player("O", "O");
                    else
                        firstPlayer = Player(firstPlayerName.value, "O");
                }
               
            }

            else if(opponentChoice == "random")
            {
                if(markerChoice == "X")
                {
                    if(secondPlayerName.value == '')
                        secondPlayer = RandomPlayer("Random AI", "O");
                    else
                        secondPlayer = RandomPlayer(secondPlayerName.value, "O");    
                }
                else if(markerChoice == "O")
                {
                    if(secondPlayerName.value == '')
                        secondPlayer = RandomPlayer("Random AI", "X");
                    else
                        secondPlayer = RandomPlayer(secondPlayerName.value, "X");    
            
                    if(firstPlayerName.value == '')
                        firstPlayer = Player("O", "O");
                    else
                        firstPlayer = Player(firstPlayerName.value, "O");

                    randomPlay();
                }
            }

            else if(opponentChoice == "smart")
            {
                if(markerChoice == "X")
                {
                    if(secondPlayerName.value == '')
                        secondPlayer = SmartPlayer("Smart AI", "O");
                    else
                        secondPlayer = SmartPlayer(secondPlayerName.value, "O");    
                }
                else if(markerChoice == "O")
                {
                    if(secondPlayerName.value == '')
                        secondPlayer = SmartPlayer("Smart AI", "X");
                    else
                        secondPlayer = SmartPlayer(secondPlayerName.value, "X");    
            
                    if(firstPlayerName.value == '')
                        firstPlayer = Player("O", "O");
                    else
                        firstPlayer = Player(firstPlayerName.value, "O");

                    smartPlay();
                }
            }
        }

        currentPlayer = firstPlayer;
        optionsScreen.style.display = "none";
        board.style.display = "flex";
    });

    winnerPrompt.addEventListener("click", event =>
    {
        overlay.click();    
    });

    overlay.addEventListener("click", event =>
    {
        winnerPrompt.classList.remove("winner-prompt-active");
        overlay.classList.remove("overlay-active");
        GameBoard.reInitialize();
        updateCurrent(firstPlayer);

        if(firstPlayer.marker == "O")
        {
            if(secondPlayer.type == "random")
                randomPlay();
            else if(secondPlayer.type == "smart")
                smartPlay();
        }
    });


    //methods
    const randomPlay = () =>
    {
        let place = GameBoard.randomMove(secondPlayer.marker);
        let [result, winnerName] = GameBoard.checkWinner(place);
        
        if(result != null)
        {
            GameBoard.displayWinner(winnerName);
        }
        else if(GameBoard.isTie())
        {
                GameBoard.displayWinner(null);
        }
    };

    const smartPlay = () =>
    {
        let place = GameBoard.smartMove(secondPlayer.marker);
        let [result, winnerName] = GameBoard.checkWinner(place);

        if(result != null)
        {
            GameBoard.displayWinner(winnerName);
        }
        else if(GameBoard.isTie())
        {
                GameBoard.displayWinner(null);
        }
    };

    const updateCurrent = (to) =>
    {
        currentPlayer = to;
    }

    const run = () =>
    {
        GameBoard.reInitialize();
    };

    return {run};
})();

Game.run();