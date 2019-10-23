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
    const myRandomWords = [
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
    useEffect(() => {
        let index = 0;
        const size = myRandomWords.length;
        console.log(size);

        setInterval(() => {
            console.log(myRandomWords);
            setWords(old => [
                ...old,
                {
                    id: index,
                    word: myRandomWords[index++ % size],
                    location: Math.floor(Math.random() * 60) + 20 + "vw"
                }
            ]);
            // console.log(words);
        }, 3000);

        if (inputRef) {
            inputRef.focus();
        }
    }, [myRandomWords, setShowGame]);
    // console.log(data);

    useEffect(() => {
        if (timeLeft === 0) {
            setShowWinner(true);
        }
    }, [timeLeft]);

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
                }
            }
            return newWords;
        });
        setInput("");
        e.preventDefault();
    };

    useEffect(() => {
        if (!timeLeft) return;

        const intervalId = setInterval(() => {
            setTimeLeft(timeLeft => timeLeft - 1);
        }, 5000);

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

            <form className = "d" onSubmit={handleSubmit}>
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
                    className="e"
                    word={word}
                    location={location}
                    key={idx}
                    onDropped={() =>
                        setWords(old => old.filter(w => w.id !== id))
                    }
                ></CoolBox>
            ))}
        </header>
    );
}
export default SinglePlayer;
