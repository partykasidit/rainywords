import React, { useState, useEffect } from "react";
import { CoolBox } from "./WordBox";
import "./App.css";
import Timer from "./Timer";
import Welcome from "./welcome";
import { socket } from "./socket";
import Score from "./Score";
import Winner from "./Winner";
import SinglePlayer from "./SinglePlayer";

// const url = "localhost:4000"
// const socket = socketIOClient(url)
function App() {
    const [count, setCount] = useState(0);
    const [words, setWords] = useState([]);
    // console.log(data);
    const [input, setInput] = useState("");
    const [players, setPlayers] = useState({});
    //  const [oppId, setOppId] = useState("");
    const [playerId, setPlayerId] = useState("");
    const [randomWords, setRandomWords] = useState([]);
    const [morePlayer, setMorePlayer] = useState(0);

    var duration = 10;
    // initialize timeLeft with the seconds prop
    const [timeLeft, setTimeLeft] = useState(-1);
    const [showWelcome, setShowWelcome] = useState(true);
    const [showGame, setShowGame] = useState(false);
    const [showWaiting, setShowWaiting] = useState(false);
    const [lobbyPlayers, setLobbyPlayer] = useState(0);
    const [showWinner, setShowWinner] = useState(false);
    const [arrayReceived, setArrayReceived] = useState(false);
    const [showSinglePlayer, setShowSinglePlayer] = useState(false);
    const [alternating, setAlternating] = useState(0);

    const playSinglePlayer = () => {
        setShowSinglePlayer(true);
        setShowWelcome(false);
        setTimeLeft(duration);
    };

    const resetGame = () => {
        socket.emit("reset_game");
        //setTimeLeft(duration);
    };

    const handlePlayGame = e => {
        socket.emit("clickPlay");
    };

    useEffect(() => {
        socket.on("1sec", () => {
            setTimeLeft(timeLeft => timeLeft - 1);
            if (!showWaiting) {
                setAlternating(alternating => alternating + 1);
            }
            console.log("1sec");
        });

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

            socket.emit("get_words", {
                duration: 60, //sec
                rate: 5 //words per sec
            });

            socket.on("words", data => {
                // console.log(data);
                if (words.length === 0) {
                    setRandomWords(() => {
                        console.log("mapping data");
                        return data.map(obj => {
                            return obj.word;
                        });
                    });
                }
                // setShowWaiting(false);
                // setShowGame(true);
                // so get word
                // socket on word
                // socket.emit("get_words", {
                //     duration: 50, //sec
                //     rate: 6 //words per sec
                // });
                // setTimeLeft(duration);
            });

            setTimeLeft(duration);
            setShowWaiting(false);
            setShowGame(true);
        });
    }, []);

    // useEffect(()=>{

    // })

    let inputRef;
    let counter = 0;
    useEffect(() => {
        if (showGame && !showWinner) {
            const size = randomWords.length;

            const loop = setInterval(() => {
                const delay = Math.floor(Math.random() * 100) + 100; //Random delay
                const n = counter++;
                console.log(n);
                setTimeout(() => {
                    setWords(old => [
                        ...old,
                        {
                            id: n,
                            word: randomWords[n % size],
                            location:
                                Math.floor(Math.random() * 60) + 20 + "vw",
                            destroyed: false
                        }
                    ]);
                }, delay);
                // console.log(words);
            }, 200); // Spam Rate

            if (inputRef) {
                inputRef.focus();
            }
            return () => clearInterval(loop);
        }
    }, [randomWords, showWinner, showGame]);
    // console.log(data);

    //for timer
    // useEffect(() => {
    //     if (!timeLeft) return;
    // }, [timeLeft]); //showGame

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
        if (!showWinner && showGame) {
            setWords(oldWords => {
                const newWords = [];
                for (const word of oldWords) {
                    if (word.word !== input) {
                        newWords.push(word);
                    } else {
                        newWords.push({ ...word, destroyed: true });
                        setCount(c => c + 1);
                        socket.emit("increase_point", 1);
                    }
                }
                return newWords;
            });
            setInput("");
        }
        e.preventDefault();
    };

    const timer = timeLeft => {
        var minutes = Math.floor(timeLeft / 60);
        var second = timeLeft % 60;

        if (second < 10) {
            second = "0" + second;
        }
        return (
            <h1>
                Timer: {minutes}:{second}
            </h1>
        );
    };

    // if (timeLeft === 0) {
    //     setShowWinner(true);
    // }

    let mystyle = {};
    let style2 = {};

    if (alternating % 4 === 0) {
        mystyle = {
            color: "purple",
            backgroundColor: "pink",
            padding: "5px"
        };
        style2 = {
            color: "green"
        };
    } else if (alternating % 3 === 0) {
        mystyle = {
            color: "black",
            backgroundColor: "DodgerBlue",
            padding: "10px"
        };
        style2 = {
            color: "yellow"
        };
    } else if (alternating % 2 === 0) {
        mystyle = {
            color: "green",
            backgroundColor: "yellow",
            padding: "15px"
        };
        style2 = {
            color: "purple"
        };
    } else {
        mystyle = {
            color: "orange",
            backgroundColor: "red",
            padding: "20px"
        };
        style2 = {
            color: "red"
        };
    }

    return (
        <div className="App">
            {/* Hello{randomWords} */}
            {showSinglePlayer && <SinglePlayer />}
            {showWaiting && (
                <>
                    <div className="welcomePlayer">
                        <div>
                            {" "}
                            Welcome,
                            {playerId !== "" && players[playerId].username}
                        </div>
                    </div>
                    <h1>
                        {lobbyPlayers < 2 ? (
                            <div className="Waiting">
                                Waiting for more players...
                                <div>
                                    <img src="/cat.gif" alt="loading..." />
                                </div>
                            </div>
                        ) : (
                            <button
                                id="play"
                                type="button"
                                onClick={handlePlayGame}
                            >
                                Play
                            </button>
                        )}
                    </h1>
                </>
            )}
            {showGame && (
                <header className="App-header">
                    <div style={{ display: "flex-inline" }}>
                        <Score
                            className="showScore"
                            players={players}
                            playerId={playerId}
                            style={{ justifyContent: "flex-end" }}
                        />
                        {/* <div>{timers}</div> */}

                        {showWinner ? (
                            <div className="EndGame">
                                <h1>GameOver</h1>
                                <Winner players={players} />
                                <button onClick={resetGame}>Play Again</button>
                            </div>
                        ) : (
                            // <h1>Timer: {timeLeft}</h1>
                            <h1>{timer(timeLeft)}</h1>
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

                    {words.map(({ word, location, id, destroyed }, idx) => (
                        <CoolBox
                            className="thebox"
                            word={word}
                            location={location}
                            key={id}
                            destroyed={destroyed}
                            onDropped={() =>
                                setWords(old => old.filter(w => w.id !== id))
                            }
                        ></CoolBox>
                    ))}
                </header>
            )}
            {showWelcome && (
                <>
                    {" "}
                    <Welcome />
                    <div className="singlePlayer ">
                        <button
                            style={mystyle}
                            id="singlePlayer"
                            type="button"
                            onClick={playSinglePlayer}
                        >
                            Play SinglePlayer
                        </button>
                        <div id="singlePlayerMessage" style={style2}>
                            Single Player is very Hardcore and have alot of bugs
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default App;
