import React, { useState, useEffect, Component } from "react";
import logo from "./logo.svg";
import WordBox, { MovingWordBox, CoolBox } from "./WordBox";
import "./App.css";
import Timer from "./Timer";
import socketIOClient from "socket.io-client";
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
  const [userId, setUserId] = useState("");
  const [randomWord, setRandomWord] = useState([]);
  var duration = 10;

  // initialize timeLeft with the seconds prop
  const [timeLeft, setTimeLeft] = useState(duration);

  const [showGame, setShowGame] = useState(false);

  const openGame = () => {
    setShowGame(true);
    setTimeLeft(duration);
  };

  const resetGame = () => {
    setShowGame(true);
    setTimeLeft(duration);
    setCount(count => 0);
  };

  useEffect(() => {
    socket.on("players_changed", payload => {
      console.log("Player_changed");
      console.log(payload);
      setPlayers(payload.updatedPlayers);
      if (userId !== undefined) {
        setUserId(payload.userId);
      }
    });
    socket.on("startGame", returnedOppId => {
      console.log("StartGame");
      console.log(returnedOppId);
      setOppId(returnedOppId);
      setShowGame(true);
      setTimeLeft(duration);
    });
  }, []);

  useEffect(() => {
    // exit early when we reach 0
    if (!timeLeft) return;

    // save intervalId to clear the interval when the
    // component re-renders
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
    // add timeLeft as a dependency to re-rerun the effect
    // when we update it
  }, [timeLeft, showGame]);

  const handleInput = e => {
    setInput(e.target.value);
  };

  const handleSubmit = e => {
    // setWords(old => old.filter(w => {
    //   if (w.word !== input) {
    //     return true;
    //   } else {
    //     setCount(c => c + 1)
    //     return false;
    //   }
    // }))
    setWords(oldWords => {
      const newWords = [];
      for (const word of oldWords) {
        if (word.word !== input) {
          newWords.push(word);
        } else {
          setCount(c => c + 1);
          socket.emit("increase_point", 1);
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
            <Score players={players} userId={userId} />
            <div>{timers}</div>
            <Score players={players} userId={oppId} />
          </div>
          {/* <Timer startCount="30" /> */}
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
              onDropped={() => setWords(old => old.filter(w => w.id !== id))}
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
