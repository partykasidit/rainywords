import React, { useState, useEffect, Component } from 'react';
import logo from './logo.svg';
import WordBox, {MovingWordBox, CoolBox} from './WordBox';
import './App.css';
import Timer from './Timer';

function App() {
  const [count, setCount] = useState(0);
  const [words, setWords] = useState([]);
  
  const [input,setInput] = useState('')
  const handleInput = e => {
    setInput(e.target.value)
  }
  const handleSubmit = e => {
    //setWords(old => old.filter(w => w !== input))
    setWords(oldWords => {
      const newWords = []
      for(const word of oldWords) {
        if(word !== input) {
          // generate x value with word remove word from old array
          newWords.push(word)
        }else{
          setCount(c => c+1)
        }
      }
      return newWords
    })
    setInput('')
    e.preventDefault()
  }
  const randomWords = ['asd','asdfg','hheksdf','kkkkk','Ronaldo']
  useEffect(() => {
    let index = 0
    const size = randomWords.length
    setInterval(() => {
      setWords(old => [...old, randomWords[(index++%size)]])
      console.log(words);
    },5000);
  }, [])

  return (
    <div className="App">
      <header className="App-header">
      <Timer startCount ='30'/>
      <p>{count}</p>
        {/* <p>
          You learn React {count} time
        </p>
        <a
          className="App-link"
          href="#"
          onClick={() => setCount(count+1) }
        >
          Learn React
        </a> */}
        {
          words.map((word, idx) =>  
            <CoolBox className="thebox" word={word} key={idx}></CoolBox> 
          )
        }
        
      </header> 
      <form  onSubmit={handleSubmit}>
     <input onChange={handleInput} value={input}/>
      </form>
    </div>
  );
}

export default App;
