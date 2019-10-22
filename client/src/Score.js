import React from "react";

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

            <h1>
                {players !== null &&
                    `${players[userId].name}: ${players[userId].score}`}
            </h1>
            {/* <h1>{players[oppId].username}: {players[oppId].score}</h1> */}
        </div>
    );
}
export default Score;
