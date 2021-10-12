const Game = (() =>{







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
        const cases = [[0, 4, 8],
                       [2, 4, 6],
                       [0, 1, 2],
                       [3, 4, 5],
                       [6, 7, 8],
                       [0, 3, 6], 
                       [1, 4, 7], 
                       [2, 5, 8]];
// ////////////////////////////////////////////
// ////////////////////////////////////////////

        //setup
        for(let i = 0; i < markers.length; i++){
            markers[i].addEventListener("click", event =>{
                




                if(markers[i].textContent == ''){
                    spots[i] = currentPlayer.marker;
                    markers[i].classList.add("marker-container-active");
                    let [result, winnerName] = checkWinner(i);

                    if(result != null)
                    {
                        displayWinner(winnerName);
                    }
                    else
                    {               
                        if(isTie())
                        {
                            displayWinner(null);
                            return;
                        }

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
                input.textContent = "A tie!";
            }
            else
            {
                input.textContent = `The winner is: ${winnerName}`;
            }

            input.classList.add("winner-input-active");
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


        const minimax = (depth, isMaximizing, place) =>
        {
            let [result, winnerName] = checkWinner(place);
            
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
            else
            {
                if(isTie())
                {
                    return 0;
                }
            }

            if(isMaximizing)
            {
                let bestScore = -Infinity;
                for(let i = 0; i < spots.length; i++)
                {
                    if(spots[i] == '')
                    {
                        spots[i] = secondPlayer.marker;
                        let score = minimax(depth + 1, false, i);
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
                        let score = minimax(depth + 1, true, i);
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
                    let score = minimax(0, false, i);
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
    // const start = document.querySelector(".start");
    const options = document.querySelector(".options");
    const input = document.querySelector(".winner-input");
    const overlay = document.querySelector(".overlay");
    const optionsScreen = document.querySelector(".options-screen");
    const firstPlayerName = document.querySelector(".first-player-name");
    const secondPlayerName = document.querySelector(".second-player-name");
    const startButton = document.querySelector(".start-button");
    const board = document.querySelector(".board-container");
    markerChoice = 'X';
    markerChoice = 'O';

    const secondplayer = document.querySelector(".second-player")

    secondplayer.addEventListener('change', (e)=>{
        opponentChoice = secondplayer.value
    })

    // start.addEventListener("click", event =>{
    //     welcomeScreen.style.display = "none";
    //     board.style.display = "flex";
    // });


    options.addEventListener("click", event =>{
        welcomeScreen.style.display = "none";
        optionsScreen.style.display = "grid";
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

            switch(opponentChoice){
                case 'normal' :
                    secondPlayer = Player(secondPlayerName.value, "O");
                break;

                case 'random':
                    if(markerChoice == "X")
                    {
                        if(secondPlayerName.value == '')
                            secondPlayer = RandomPlayer("Random AI", "O");
                        else
                            secondPlayer = RandomPlayer(secondPlayerName.value, "O");
                    }
                    else
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
                break;
                


                case "smart":
                        if(markerChoice == "X")
                    {
                        if(secondPlayerName.value == '')
                            secondPlayer = SmartPlayer("Smart AI", "O");
                        else
                            secondPlayer = SmartPlayer(secondPlayerName.value, "O");    
                    }
                    else
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
                break;
            }
        }

        currentPlayer = firstPlayer;
        optionsScreen.style.display = "none";
        board.style.display = "flex";
    });

    overlay.addEventListener("click", event =>
    {
        input.classList.remove("winner-input-active");
        overlay.classList.remove("overlay-active");
        GameBoard.reInitialize();
        updateCurrent(firstPlayer);

        if(firstPlayer.marker == "O")
            randomPlay();
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
        else
        {
            if(GameBoard.isTie())
            {
                GameBoard.displayWinner(null);
            }
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
        else
        {
            if(GameBoard.isTie())
            {
                GameBoard.displayWinner(null);
            }
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




    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////

    // adding firebase
    const multiplayer = document.querySelector('.multiplayer')
    const multiplayerScreen = document.querySelector(".multiplayer-screen")


    // delete later
    // welcomeScreen.style='display:none;'
    // multiplayerScreen.style='display:grid;'
    // delete later


    multiplayer.addEventListener('click', ()=>{
        // var myName = prompt("enter your name please : ")
        var myName = 'omar'

        welcomeScreen.style='display:none;'
        multiplayerScreen.style='display:grid;'


        db.collection('players').get().then((snapshot) =>{
            snapshot.forEach((player) =>{
                
                document.querySelector('.players-pannel').innerHTML+=`
                        <div class="player" >
                        <div class="player-name">${player.data().name}</div>
                             <button id="${player.id}" class="challange-btn">challange</button>
                         </div>
                         `
            })
        })


        opponentChoice = 'multiplayer'
        const challangeBtn = document.querySelectorAll('.challange-btn')
        challangeBtn.forEach((btn) =>{
            btn.addEventListener('click', () =>{
                console.log('s');
            })
        })
    })




    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////

    
    


    


    // end game
    return {run};
})();

Game.run();






