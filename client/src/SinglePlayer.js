import React, { useState, useEffect } from "react";
import { CoolBox } from "./WordBox";
import "./SinglePlayer.css";
import Timer from "./Timer";
import Welcome from "./welcome";
import { socket } from "./socket";
import Score from "./Score";
import Winner from "./Winner";

function SinglePlayer() {
    const [count, setCount] = useState(0);
    const [words, setWords] = useState([]);
    // console.log(data);
    const [input, setInput] = useState("");
    const [players, setPlayers] = useState({});
    //  const [oppId, setOppId] = useState("");
    const [playerId, setPlayerId] = useState("");
    // const [myRandomWords, setmyRandomWords] = useState([]);
    const [morePlayer, setMorePlayer] = useState(0);
    // initialize timeLeft with the seconds prop
    const [timeLeft, setTimeLeft] = useState(300);
    const [showWelcome, setShowWelcome] = useState(true);
    const [showGame, setShowGame] = useState(false);
    const [showWaiting, setShowWaiting] = useState(false);
    const [lobbyPlayers, setLobbyPlayer] = useState(0);
    const [showWinner, setShowWinner] = useState(false);
    const [arrayReceived, setArrayReceived] = useState(false);
    // const listItems = players.map(player => (
    //     <li key={player.username}>{players.score}</li>

    // ));
    var duration = 300;
    const randomWords = [
        "Gareth",
        "Ronaldo",
        "Falcao",
        "Ronaldo",
        "BigC",
        "Batman",
        "Grid",
        "Party",
        "Tee",
        "Moomin",
        "Jelly",
        "Pond",
        "Pat",
        "Muang",
        "Totee",
        "Messi",
        "Bale",
        "Robben",
        "Neuer",
        "Rooney",
        "Paul"
    ];

    const resetGame = () => {
        setTimeLeft(duration);
        setShowGame(true);
        setCount(count => 0);
        setShowWinner(false);
        setShowWaiting(false);
        setShowGame(true);
    };

    let inputRef;
    let counter = 0;
    useEffect(() => {
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
                        location: Math.floor(Math.random() * 60) + 20 + "vw",
                        destroyed: false
                    }
                ]);
            }, delay);
            // console.log(words);
        }, 50); // Spam Rate

        if (inputRef) {
            inputRef.focus();
        }
        return () => clearInterval(loop);
    }, [showWinner]);

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
                    newWords.push({ ...word, destroyed: true });
                    setCount(c => c + 1);
                    socket.emit("increase_point", 1);
                }
            }
            return newWords;
        });
        setInput("");

        e.preventDefault();
    };

    useEffect(() => {
        if (timeLeft === 0) {
            setShowWinner(true);
        }
    }, [timeLeft]);

    useEffect(() => {
        if (!timeLeft) return;

        const intervalId = setInterval(() => {
            setTimeLeft(timeLeft => timeLeft - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timeLeft]); //showGame

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

    return (
        <header className="a">
            <div style={{ display: "flex-inline" }}>
                {showWinner ? (
                    <div className="b">
                        <h1>GameOver</h1>
                        <button onClick={resetGame}>Play Again</button>
                    </div>
                ) : (
                    <h1 className="c">{timer(timeLeft)}</h1>
                )}
            </div>
            <div>
                <p>{count}</p>
            </div>

            <form className="d" onSubmit={handleSubmit}>
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
    );
}
export default SinglePlayer;
