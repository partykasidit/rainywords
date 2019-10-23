import React from "react";
import { socket } from "./socket";

function Winner({ players }) {
    // const listItems = players.map(player => (
    //     <li key={player.username}>{players.score}</li>

    // ));
    let winner = findWinner(players);

    return (
        <div className="Winnner">
            <div>{winner}</div>
        </div>
    );
}
export default Winner;

function findWinner(players) {
    let max = 0;
    let winner = "Nobody";
    Object.values(players).forEach(player => {
        if (player.score > max) {
            max = player.score;
            winner = player.username;
        }
    });

    const showListofWinner = (
        <div>
            The Winner is {winner} with score: {max} !!!!!
        </div>
    );

    return (
        <div>
            The Winner is {winner} with score: {max} !!!!!
        </div>
    );
}

// <h1>
//                 {players !== null &&
//                     `${players.name}: ${players[userId].score}`}
//             </h1>

// let arraywinner = [];
// Object.values(players).forEach(player => {
//     if (player.score=== max) {
//         arraywinner.push(player.username);

//     }
// });
// let list = (arraywinner.map((win,index)=> {<p key={index}>{win}</p>});

// if(arraywinner.length>1){

//     showListofWinner =( <div>{list}</div>
//     <div>With Score of {max} </div> );

// };
