const Game = (() =>
{
    //DOM attributes
    let prompt = document.querySelector(".winner-prompt");
    let overlay = document.querySelector(".overlay");

    overlay.addEventListener("click", event =>
    {
        prompt.classList.remove("winner-prompt-active");
        overlay.classList.remove("overlay-active");
    });

    //Inner factory functions.
    const Player = (playerName, playerMark) =>
    {
        let mark = playerMark;
        let name = playerName;

        return {name, mark};
    };
    
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
                    spots[i] = currentPlayer.mark;
                    markers[i].classList.add("marker-container-active");
                    checkAndUpdate(i);
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

        const checkPossibleCases = (...possibleCases) =>
        {
            let result = false;
            let marker = '';
            //c stands for case
            for(let c of possibleCases)
            {
                result = (spots[c[0]] == spots[c[1]] && spots[c[1]] == spots[c[2]]);
                if(result == true)
                {
                    marker = spots[c[0]];
                }
            }

            return [result, marker];
        };

        const checkAndUpdate = (index) =>
        {
            let possibleCases = [];
            for(let singleCase of cases)
            {
                if(singleCase.includes(index))
                {
                    possibleCases.push(singleCase);
                }
            }

            let [result, marker] = checkPossibleCases(...possibleCases);

            if(result)
            {
                prompt.textContent = `The winner is: ${marker.toUpperCase()}.`;
                prompt.classList.add("winner-prompt-active");
                overlay.classList.add("overlay-active");
                reInitialize();
            }
            updateDisplay()
            updatePlayers();
        };

        const reInitialize = () =>
        {
            spots = ['', '', '', '', '', '', '', '', ''];

            for(let marker of markers)
            {
                marker.classList.remove("marker-container-active");
            }
            updateDisplay();
        };

        return {spots, updateDisplay, reInitialize};
    })();


    //attributes
    const player1 = Player("Thoalfeqar", "x");
    const player2 = Player("Other", "o");
    let currentPlayer = player1;
    
    //methods
    const start = () =>
    {
        GameBoard.reInitialize();
    };

    const updatePlayers = () =>
    {
        if(currentPlayer == player1)
        {
            currentPlayer = player2;
        }
        else
        {
            currentPlayer = player1;
        }
    }

    const update = () =>
    {
        
    };

    const run = () =>
    {
        start();
    };

    return {run};
})();

Game.run();