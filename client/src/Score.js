import React from "react";
import { socket } from "./socket";

function Score({ players, userId }) {
    return (
        <div className="Score">
            {/* {userId} */}
            {/* <li>
                {Object.values(players).map(val => {
                    return (
                        <div>
                            {val.id} + {val.name} + {val.score}
                        </div>
                    );
                })}
            </li> */}

            <h1>{players !== null && `${players.name}: ${players.score}`}</h1>
            {/* <h1>{players[oppId].username}: {players[oppId].score}</h1> */}
        </div>
    );
}
export default Score;

// <h1>
//                 {players !== null &&
//                     `${players.name}: ${players[userId].score}`}
//             </h1>
