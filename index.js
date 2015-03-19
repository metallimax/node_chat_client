// ********** CHAT CLIENT **********

var WebSocket = require('ws');
var chalk = require('chalk');
var program = require('commander');

program
  .version('0.0.1')
  .option('-u --username <username>', 'Username')
  .option('-c --color <color>', 'Color', /^(black|blue|red|pink|green)$/i, 'black')
  .parse(process.argv);

var color_palette = {
    black: 'gray',
    blue: 'cyan',
    red: 'red',
    pink: 'magenta',
    green: 'green'
}

program.color = color_palette[program.color];

var wsUrl = "ws://localhost:3000/";
var socket = null;

var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);

rl.on('line', function (line) {
    var payload = {
        type: 'message',
        data: {
            username: program.username,
            color: program.color,
            message: line
        }
    };
    
    socket.send(JSON.stringify(payload));
    rl.prompt(true);
});

function initSocket() {
    socket = new WebSocket(wsUrl);
    
    socket.onopen = function(evt) {
        var payload = {
            type: 'connect',
            data: {
                username: program.username
            }
        };

        this.send(JSON.stringify(payload));
    };
    
    socket.onmessage = function(message) {
        var payload = JSON.parse(message.data);
        if (payload.type == 'connect') {
            console.log(chalk.italic('User ' + chalk.bold(payload.data.username) + ' has joined the chat'));
        }
        else if (payload.type == 'message') {
            payload.data.color = color_palette[payload.data.color];
            console.log(chalk[payload.data.color](chalk.bold(payload.data.username + '>') + ' ' + payload.data.message));
        }
        else if (payload.type == 'disconnect') {
            console.log(chalk.italic('User ' + chalk.bold(payload.data.username) + ' has left the chat'));
        }
        else {
            // unsupported type
        }
    };
    
    socket.onclose = function() {
        console.log("Disconnected");
        setTimeout(function(){
            console.log("Trying reconnection ...");
            initSocket();
        }, 3000);
    };
}

initSocket();
