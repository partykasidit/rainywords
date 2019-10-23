import React, { useState, useEffect } from "react";
import { CoolBox } from "./WordBox";
import "./App.css";
import Timer from "./Timer";
import Welcome from "./welcome";
import { socket } from "./socket";
import Score from "./Score";
import { pathToFileURL } from "url";
import Winner from "./Winner";

// const url = "localhost:4000"
// const socket = socketIOClient(url)
function App() {
    const [count, setCount] = useState(0);
    const [words, setWords] = useState([]);
    const [input, setInput] = useState("");
    const [players, setPlayers] = useState({});
    //  const [oppId, setOppId] = useState("");
    const [playerId, setPlayerId] = useState("");
    const [randomWords, setRandomWords] = useState([]);
    const [morePlayer, setMorePlayer] = useState(0);

    var duration = 10;
    // initialize timeLeft with the seconds prop
    const [timeLeft, setTimeLeft] = useState(duration);
    const [showWelcome, setShowWelcome] = useState(true);
    const [showGame, setShowGame] = useState(false);
    const [showWaiting, setShowWaiting] = useState(false);
    const [lobbyPlayers, setLobbyPlayer] = useState(0);
    const [showWinner, setShowWinner] = useState(false);
    const [arrayReceived, setArrayReceived] = useState(0);

    const resetGame = () => {
        socket.emit("reset_game");

        //setTimeLeft(duration);
    };

    const handlePlayGame = e => {
        socket.emit("clickPlay");
    };

    useEffect(() => {
        socket.on("reset_game", () => {
            console.log("reset the game");
            setTimeLeft(duration);
            setShowGame(true);
            setCount(count => 0);
            setShowWinner(false);
            setShowWaiting(false);
            setShowGame(true);
        });

        socket.on("players_changed", players => {
            // every change of players state
            setPlayers(players);
            console.log(players);
        });

        socket.on("setPlayerId", playerId => {
            setPlayerId(playerId);
            console.log(playerId);
            setShowWelcome(false);
            setShowWaiting(true);

            // console.log(players[playerId].id);
        });

        socket.on("number_of_players_changed", lobbyPlayer => {
            setLobbyPlayer(lobbyPlayer);
            console.log("loby player :" + lobbyPlayer);
        });

        socket.on("startGame", () => {
            console.log("StartGame");
            // setShowWaiting(false);
            // setShowGame(true);
            // so get word
            // socket on word
            socket.emit("get_words", {
                duration: 50, //sec
                rate: 6 //words per sec
            });
            // setTimeLeft(duration);

            socket.on("words", data => {
                // console.log(data);
                if (arrayReceived < 1) {
                    setRandomWords(() => {
                        console.log("mapping data");
                        return data.map(obj => {
                            console.log(obj.word);
                            return obj.word;
                        });
                    });
                    setArrayReceived(c => c + 1);
                }
                console.log(setRandomWords);
                setTimeLeft(duration);
                setShowWaiting(false);
                setShowGame(true);
            });
        });

    }, []);

    // useEffect(()=>{

    // })

    let inputRef;
    useEffect(() => {
        let index = 0;
        const size = randomWords.length;
        console.log(size);

        setInterval(() => {
            console.log(randomWords);
            setWords(old => [
                ...old,
                {
                    id: index,
                    word: randomWords[index++ % size],
                    location: Math.floor(Math.random() * 60) + 20 + "vw"
                }
            ]);
            // console.log(words);
        }, 5000);

        if (inputRef) {
            inputRef.focus();
        }
    }, [setShowGame]);
    //randomWords

    //for timer
    useEffect(() => {
        if (!timeLeft) return;

        const intervalId = setInterval(() => {
            setTimeLeft(timeLeft => timeLeft - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timeLeft, showGame]);

    useEffect(() => {
        if (timeLeft === 0) {
            setShowWinner(true);
        }
    }, [timeLeft]);

    // showGame
    const handleInput = e => {
        setInput(e.target.value);
    };

    const handleSubmit = e => {
        setWords(oldWords => {
            const newWords = [];
            for (const word of oldWords) {
                if (word.word !== input) {
                    newWords.push(word);
                } else {
                    setCount(c => c + 1);
                    // socket.emit("increase_point");
                    socket.emit("increase_point", 1);
                }
            }
            return newWords;
        });
        setInput("");
        e.preventDefault();
    };

    // if (timeLeft === 0) {
    //     setShowWinner(true);
    // }

    return (
        <div className="App">
            Hello{randomWords}
            <div>
                {showWaiting && (
                    <div>
                        <div>
                            Welcome,
                            {playerId !== "" && players[playerId].username}
                        </div>
                        <h1>
                            {lobbyPlayers < 2 ? (
                                <div> Waiting for more players...</div>
                            ) : (
                                <button type="button" onClick={handlePlayGame}>
                                    Play
                                </button>
                            )}
                        </h1>
                    </div>
                )}
            </div>
            {showGame && (
                <header className="App-header">
                    <div style={{ display: "flex-inline" }}>
                        <Score players={players} playerId={playerId} />
                        {/* <div>{timers}</div> */}

                        {showWinner ? (
                            <div>
                                <h1>GameOver</h1>
                                <Winner players={players} />
                                <button onClick={resetGame}>Play Again</button>
                            </div>
                        ) : (
                            <h1>Timer: {timeLeft}</h1>
                        )}

                        {/* <Score players={players} userId={oppId} /> */}
                    </div>
                    <div>
                        <p>
                            {playerId !== "" && players[playerId].username}'s
                            score: {count}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <input
                            onChange={handleInput}
                            value={input}
                            ref={input => {
                                inputRef = input;
                            }}
                        />
                    </form>

                    {words.map(({ word, location, id }, idx) => (
                        <CoolBox
                            className="thebox"
                            word={word}
                            location={location}
                            key={idx}
                            onDropped={() =>
                                setWords(old => old.filter(w => w.id !== id))
                            }
                        ></CoolBox>
                    ))}
                </header>
            )}
            <div></div>
            {showWelcome && <Welcome />}
        </div>
    );
}

export default App;

{
    /* <p>
          You learn React {count} time
        </p>
        <a
          className="App-link"
          href="#"
          onClick={() => setCount(count+1) }
        >
          Learn React
        </a> */
}

// 1 page welcome
// game
// input
// play no socket page
// when get name

// send name to second page

// 2 page use app.js
// socket app player
// welcome "name"
// add socket
// in useeffect socket.on to

// show game now
// if player.size>2 changing waiting to start
// if start then get words

// word falling down game start
//show players
//timer stop restart

// socket.on("updatePlayers", players => {
//     console.log("UpdatePlayers");
//     console.log(players);
//     setPlayers(players);
// });
// socket.on("startGame", oppId => {
//     console.log("StartGame");
//     console.log(`OppId: ${oppId}`);
//     setOppId(oppId);
//     setShowGame(true);
//     setTimeLeft(duration);
// });

// socket.on("setPlayerId", playerId => {
//     // console.log("SetPlayerId");
//     // console.log(`PlayerId: ${playerId}`);
//assume we habe NAME FROM WELCOME
//  socket.emit("add_player",name);

// const randomWords = [
//     "Gareth",
//     "Ronaldo",
//     "Falcao",
//     "kkkkk",
//     "Ronaldo",
//     "BigC"
// ];
//let inputRef;

// useEffect(() => {

//     let index = 0;
//     const size = randomWords.length;

//     setInterval(() => {
//         setWords(old => [
//             ...old,
//             {
//                 id: index,
//                 word: randomWords[index++ % size],
//                 location: Math.floor(Math.random() * 60) + 20 + "vw"
//             }
//         ]);
//         // console.log(words);
//     }, 3000);

//     if (inputRef) {
//         inputRef.focus();
//     }
// }, []);

  // socket.on("words", data => {
        //     // console.log(data);
        //     setRandomWords(() => {
        //         console.log("mapping data");
        //         return data.map(obj => {
        //             console.log(obj.word);
        //             return obj.word;
        //         });
        //     });
        //     console.log(setRandomWords);
        //     setTimeLeft(duration);
        //     setShowWaiting(false);
        //     setShowGame(true);
        // });
