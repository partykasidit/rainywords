import React from "react";
import { socket } from "./socket";

function Score({ players, playerId }) {
    // const listItems = players.map(player => (
    //     <li key={player.username}>{players.score}</li>

    // ));
    return (
        <div className="Score">
            <div>
                {Object.values(players).map(player => {
                    return (
                        <div key={player.id}>
                            <li>
                                {player.username}:{player.score}
                            </li>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
export default Score;

// <h1>
//                 {players !== null &&
//                     `${players.name}: ${players[userId].score}`}
//             </h1>

{
    /* {userId} */
}
{
    /* <li>
                {Object.values(players).map(val => {
                    return (
                        <div>
                            {val.id} + {val.name} + {val.score}
                        </div>
                    );
                })}
            </li> */
}

{
    /* <h1>{players !== null && `${players.name}: ${players.score}`}</h1> */
}
{
    /* <h1>{players[oppId].username}: {players[oppId].score}</h1> */
}
