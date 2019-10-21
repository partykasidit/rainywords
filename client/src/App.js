import React, { useState, useEffect } from "react";
import { CoolBox } from "./WordBox";
import "./App.css";
import Timer from "./Timer";
import Welcome from "./welcome";
import { socket } from "./socket";
import Score from "./Score";

// const url = "localhost:4000"
// const socket = socketIOClient(url)

function App() {
    const [count, setCount] = useState(0);
    const [words, setWords] = useState([]);
    const [input, setInput] = useState("");
    const [players, setPlayers] = useState({});
    const [oppId, setOppId] = useState("");
    const [playerId, setPlayerId] = useState("");
    const [randomWord, setRandomWord] = useState([]);
    var duration = 10;

    // initialize timeLeft with the seconds prop
    const [timeLeft, setTimeLeft] = useState(duration);

    const [showGame, setShowGame] = useState(false);

    const resetGame = () => {
        setShowGame(true);
        setTimeLeft(duration);
        setCount(count => 0);
    };

    useEffect(() => {
        socket.on("setPlayerId", playerId => {
            console.log("SetPlayerId");
            console.log(`PlayerId: ${playerId}`);
            setPlayerId(playerId);
        });
        socket.on("updatePlayers", players => {
            console.log("UpdatePlayers");
            console.log(players);
            setPlayers(players);
        });
        socket.on("startGame", oppId => {
            console.log("StartGame");
            console.log(`OppId: ${oppId}`);
            setOppId(oppId);
            setShowGame(true);
            setTimeLeft(duration);
        });
    }, []);

    useEffect(() => {
        if (!timeLeft) return;
        const intervalId = setInterval(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);
        return () => clearInterval(intervalId);
    }, [timeLeft, showGame]);

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
                    socket.emit("increaseScore", oppId);
                }
            }
            return newWords;
        });
        setInput("");
        e.preventDefault();
    };
    const randomWords = [
        "Gareth",
        "Ronaldo",
        "Falcao",
        "kkkkk",
        "Ronaldo",
        "BigC"
    ];
    let inputRef;
    useEffect(() => {
        let index = 0;
        const size = randomWords.length;
        setInterval(() => {
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
    }, []);

    let timers = <h1>Timer: {timeLeft}</h1>;
    if (timeLeft === 0) {
        timers = (
            <div>
                <h1>GameOver</h1>
                <button onClick={resetGame}>Play Again</button>
            </div>
        );
    }

    return (
        <div className="App">
            {/* {!showGame && <button onClick={openGame}>Login Already</button>} */}
            {/* {players !== null && Object.values(players).map(x => {
        return (<div>Username = {x.username} Score = {x.score}</div>)
      })} */}
            {showGame && (
                <header className="App-header">
                    <div style={{ display: "flex-inline" }}>
                        <Score players={players} userId={playerId} />
                        <div>{timers}</div>
                        <Score players={players} userId={oppId} />
                    </div>
                    <p>{count}</p>
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
            {!showGame && <Welcome />}
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
