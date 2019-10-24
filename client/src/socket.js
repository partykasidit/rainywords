import openSocket from "socket.io-client";

const url = "https://rainy-words-server.herokuapp.com/game";
// https://rainy-words-server.herokuapp.com/game
export const socket = openSocket(url);
