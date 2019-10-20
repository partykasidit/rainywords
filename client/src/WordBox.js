import React, { useState, useEffect, forwardRef } from 'react';
import './App.css';
import posed,{ PoseGroup } from 'react-pose'; 
import { interpolate } from '@popmotion/popcorn';

const WordBox = forwardRef((props, ref) => {
    return <div ref={ref} {...props}>{props.word}</div>
    
})
//export const CoolBox = ({word, idx}) => {
export const CoolBox = ({word,idx}) => {
    var loca = Math.floor(Math.random()*60) + 20 + "vw";
    const [ pose, setPose ] = useState("top");
    useEffect(() => {
       setPose("bottom");
    }, [])
    return  <MovingWordBox className="thebox" style={{ left:loca }} pose={pose} word={word} idx={idx} loca={loca}></MovingWordBox> 
} //key={idx}



export const MovingWordBox = posed(WordBox)({
   
  
  top: { y: "0vh"},
  bottom: { y: "80vh",  transition: {
      y: {
        type: "tween",
        ease: "linear",
        duration: 2000
        
      }
    },  

  
  },
  
  


  invisible: { opacity: 0},

  passive: {
      opacity: ['y', interpolate(
        ["0vh", "70vh", "80vh","90vh"],
        [1, 1, 0,0]
      )]
  },
    
})


export default WordBox; 