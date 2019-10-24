//Create socket
var socket = io.connect("http://localhost:4000/game");

//DOM
var resetButton = document.getElementById("reset_button");
var numberOfPlayersSpan = document.getElementsByTagName("span")[0];
var scoresDiv = document.getElementById("scores");

resetButton.addEventListener("click", () => {
    socket.emit("reset_game");
});

//Get number of players
socket.emit("get_number_of_players");

//Listen for changes in number of players
socket.on("number_of_players_changed", value => {
    numberOfPlayersSpan.textContent = value;
});

//Get players
socket.emit("get_players");

//Listen for changes in scores/players
socket.on("players_changed", players => {
    updateTable(players);
});

function updateTable(players) {
    const keys = Object.keys(players);
    if (keys.length > 0) {
        var string = '<table style="width=100%">';
        string += "<tr><th>Player</th><th>Score</th><tr>";
        for (const key of keys) {
            var player = players[key];
            string +=
                "<tr><td>" +
                player.username +
                "</td><td>" +
                player.score +
                "</td></tr>";
        }
        string += "</table>";
        scoresDiv.innerHTML = string;
    } else {
        scoresDiv.innerHTML = "";
    }
}
