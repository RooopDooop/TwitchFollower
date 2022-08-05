const http = require('http');
const tmi = require('tmi.js');
const mysql = require('mysql2');
const moment = require('moment');
const fs = require('fs');
const { getPriority } = require('os');
const { Console } = require('console');


var client = null
var StreamerName = /*InsertURLUSERNAMEHERE*/
var con = null

const hostname = '127.0.0.1';
const port = 8000;

const server = http.createServer((req, res) => {
    fs.readFile('index.html', function (err, html) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.write(html);

    res.end();
  });
});

client = new tmi.Client({
  connection: {
    secure: true,
    reconnect: true
  },
  channels: [ StreamerName ]
});

client.connect();

const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:8000",
    methods: ["GET", "POST"]
  }
});

io.sockets.on('connection', function (socket) {
  client.on('message', (channel, tags, message, self) => {

    socket.emit('for_client', { someData: tags['display-name'] + ": " + message });

  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);

  //connectToDatabase();
  connectToTwitch();
});

function connectToTwitch() {
    client = new tmi.Client({
        connection: {
          secure: true,
          reconnect: true
        },
        channels: [ StreamerName ]
      });
    
    client.connect();

    /*client.on('message', (channel, tags, message, self) => {
    
        var sanitizedMessage = message.replace(/'/g, " ").replace(/\\/g, " ")
        var sanitizedStreamer = channel.replace(/#/g, "")
    
        var sqlMessage = "INSERT INTO Messages (streamerName, userName, inputDate, messageContent) " +
                         "VALUES ('" + sanitizedStreamer + "', '" +
                                    tags['display-name'] + "', '" +
                                    moment(Date.now()).format('YYYY-MM-DD HH:mm:ss') + "', '" +
                                    sanitizedMessage + "');"
    
        con.query(sqlMessage)
    
        console.log(tags['display-name'] + " - has commented: " + sanitizedMessage);
    });*/
}

function connectToDatabase() {

    con = mysql.createConnection({
        host: "192.168.0.4",
        user: "root",
        password: /*REMOVED*/,
        database: "TwitchDatabase"
    });

    /*con.connect(function(err) {
        if(err) throw err;
    
        console.log("Connected to database");
    
        var sqlTable = "CREATE TABLE IF NOT EXISTS Messages (" +
            "messageID INT AUTO_INCREMENT PRIMARY KEY, " +
            "streamerName Varchar(30) NOT NULL, " +
            "userName Varchar(30) NOT NULL, " +
            "inputDate DATETIME NOT NULL, " +
            "messageContent Varchar(512) NOT NULL)"
    
        con.query(sqlTable)
    
        console.log("Created the table: Messages");
    });*/

}