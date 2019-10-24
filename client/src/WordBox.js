import React, { useState, useEffect, forwardRef } from "react";
import "./App.css";
import posed, { PoseGroup } from "react-pose";
import { interpolate } from "@popmotion/popcorn";

const DURATION = 3000;
const WordBox = forwardRef((props, ref) => {
    return (
        <div ref={ref} {...props}>
            {props.word}
        </div>
    );
});
//export const CoolBox = ({word, idx}) => {
export const CoolBox = ({ word, idx, location, onDropped, destroyed }) => {
    const [pose, setPose] = useState("top");
    let timeout;
    useEffect(() => {
        setPose("bottom");
        timeout = setTimeout(() => onDropped(), DURATION);
    }, []);

    useEffect(() => {
        if (destroyed) {
            clearTimeout(timeout);
            setPose("destroyed");
            setTimeout(() => onDropped(), 1000);
        }
    }, [destroyed]);
    return (
        <MovingWordBox
            className="thebox"
            style={{ left: location }}
            pose={pose}
            word={word}
            idx={idx}
        ></MovingWordBox>
    );
}; //key={idx}

export const MovingWordBox = posed(WordBox)({
    top: { y: "0vh" },
    bottom: {
        y: "90vh",
        //y 94vh
        transition: {
            y: {
                type: "tween",
                ease: "linear",
                duration: DURATION
            }
        }
    },
    destroyed: {
        color: "#FFFF00",
        fontSize: "100px",
        transition: {
            fontSize: {
                type: "tween",
                ease: "linear",
                duration: 1000
            }
        }
    },

    invisible: { opacity: 0 },

    passive: {
        opacity: [
            "y",
            interpolate(["0vh", "70vh", "80vh", "90vh"], [1, 1, 0, 0])
        ]
    }
});

export default WordBox;
