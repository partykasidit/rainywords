import openSocket from "socket.io-client";

const url = "localhost:4000/game";
//https://rainy-words-server.herokuapp.com/admin/
// https://rainy-words-server.herokuapp.com/game
//https://rainy-words-server.herokuapp.com/admin/
export const socket = openSocket(url);
