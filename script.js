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
        const cases = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8]];

        //setup
        for(let i = 0; i < markers.length; i++)
        {
            markers[i].addEventListener("click", event =>
            {
                if(markers[i].textContent == '')
                {
                    spots[i] = currentPlayer.marker;
                    markers[i].classList.add("marker-container-active");
                    let [result, marker] = checkWinner(i);

                    if(result == true)
                    {
                        displayWinner(marker);
                    }
                    else
                    {               
                        if(!spots.includes(''))
                        {
                            displayWinner('tie');
                            return;
                        }

                        if(secondPlayer.type == "random")
                        {
                            randomPlay();
                        }
                        else if(secondPlayer.type == "normal")
                        {
                            if(currentPlayer == secondPlayer)
                                updateCurrent(firstPlayer);
                            else
                                updateCurrent(secondPlayer);
                        }
                    }
                    updateDisplay();
                }
            });
        }

        //methods

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

            let result = false;
            let p = '';
            
            for(let c of possibleCases)
            {
                result = (spots[c[0]] == spots[c[1]] && spots[c[1]] == spots[c[2]]);
                if(result == true)
                {
                    if(spots[c[0]] == firstPlayer.marker)
                    {
                        p = firstPlayer.name;
                        return [result, p];
                    }
                    else
                    {
                        p = secondPlayer.name;
                        return [result, p];
                    }
                }
            }

            return [result, p];
        };

        const displayWinner = (marker) =>
        {
            if(marker == 'tie')
            {
                prompt.textContent = "A tie!";
            }
            else
            {
                prompt.textContent = `The winner is: ${marker}`;
            }

            prompt.classList.add("winner-prompt-active");
            overlay.classList.add("overlay-active");
            reInitialize();
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

        const randomMove = (marker) =>
        {
            let validSpots = [];
            for(let i = 0; i < spots.length; i++)
            {
                if(spots[i] == '')
                {
                    validSpots.push(i);

                    // spots[i] = marker;
                    // markers[i].classList.add("marker-container-active");
                    // updateDisplay();
                    // return i;
                }
            }

            let randSpot = validSpots[Math.floor(Math.random() * validSpots.length)];
            spots[randSpot] = marker;
            markers[randSpot].classList.add("marker-container-active");
            updateDisplay();
            return randSpot;
        };

        return {reInitialize, randomMove, checkWinner, displayWinner};
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

    //attributes
    let firstPlayer = Player("first", "O");
    let secondPlayer = Player("second", "X");

    //current player will be used if 2 players are playing against each other (humans).
    let currentPlayer;


    let markerChoice = 0;
    let opponentChoice = 0;
    
    //DOM elements
    const prompt = document.querySelector(".winner-prompt");
    const overlay = document.querySelector(".overlay");
    const welcomeScreen = document.querySelector(".welcome-screen");
    const markerChoiceX = document.querySelector(".marker-choice-X");
    const markerChoiceO = document.querySelector(".marker-choice-O");
    const opponentOther = document.querySelector(".second-player-opponent");
    const opponentRandom = document.querySelector(".randomAI-opponent");
    const firstPlayerName = document.querySelector(".first-player-name");
    const secondPlayerName = document.querySelector(".second-player-name");
    const startButton = document.querySelector(".start-button");
    const board = document.querySelector(".board-container");

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
        event.target.classList.add("opponent-hover");
        opponentRandom.classList.remove("opponent-hover");
        opponentChoice = "normal";
    });

    opponentRandom.addEventListener("click", event =>
    {
        event.target.classList.add("opponent-hover");
        opponentOther.classList.remove("opponent-hover");
        opponentChoice = "random";
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
        if(markerChoice != 0)
        {
            firstPlayer.marker = markerChoice;
        }
        if(opponentChoice != 0)
        {
            if(opponentChoice == "random")
            {
                secondPlayer = RandomPlayer("random AI");
                if(firstPlayer.marker == 'X')
                {
                    secondPlayer.marker = 'O';
                }
                else
                {
                    secondPlayer.marker = 'X';
                }
            }
        }

        currentPlayer = firstPlayer;
        welcomeScreen.style.display = "none";
        board.style.display = "flex";
    });

    overlay.addEventListener("click", event =>
    {
        prompt.classList.remove("winner-prompt-active");
        overlay.classList.remove("overlay-active");
    });


    //methods
    const randomPlay = () =>
    {
        let place = GameBoard.randomMove(secondPlayer.marker);
        let [result, marker] = GameBoard.checkWinner(place);
        
        if(result == true)
        {
            GameBoard.displayWinner(marker);
        }
    }

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