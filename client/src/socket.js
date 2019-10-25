import openSocket from "socket.io-client";

const url = "http://localhost:4000/game";
// const url = "https://rainy-words-server.herokuapp.com/game";
//https://rainy-words-server.herokuapp.com/admin/
// https://rainy-words-server.herokuapp.com/game
//https://rainy-words-server.herokuapp.com/admin/
// const url = "http://localhost:4000/game";	const url = "https://rainy-words-server.herokuapp.com/game";
// //172.20.10.4:4000/game
export const socket = openSocket(url);
