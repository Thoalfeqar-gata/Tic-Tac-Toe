const Game = (() =>
{
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
        const blocks = document.querySelectorAll(".board-block");
        let cases = [];

        //setup

        //this map should help visualize the 'cases' array.
        /*
            0   1   2
            3   4   5
            6   7   8
        */
        cases = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8]];

        for(let i = 0; i < blocks.length; i++)
        {
            blocks[i].addEventListener("click", event =>
            {
                if(blocks[i].textContent == '')
                {
                    spots[i] = currentPlayer.mark;
                    checkAndUpdate(i);
                }
            });
        }

        //methods
        const updateDisplay = () =>
        {
            for(let i = 0; i < spots.length; i++)
            {
                blocks[i].textContent = spots[i];
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



            updateDisplay()
            updatePlayers();
        };

        const reInitialize = () =>
        {
            spots = ['', '', '', '', '', '', '', '', ''];
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