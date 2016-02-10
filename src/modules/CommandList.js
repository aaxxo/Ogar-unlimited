// Imports
var Teams = require('../gamemodes/Teams.js');
var GameMode = require('../gamemodes');
var Entity = require('../entity');
var EjectedMass = require('../entity/EjectedMass');

function Commands() {
    this.list = {}; // Empty
}

module.exports = Commands;

// Utils
var fillChar = function(data, char, fieldLength, rTL) {
    var result = data.toString();
    if (rTL === true) {
        for (var i = result.length; i < fieldLength; i++)
            result = char.concat(result);
    } else {
        for (var i = result.length; i < fieldLength; i++)
            result = result.concat(char);
    }
    return result;
};

// Commands

Commands.list = {
    ophelp: function(gameServer, split) {
        console.log("[Console] ======================= OP HELP =====================");
        console.log("You use OP by first setting who has op by doing op [id] in console. Then, that player can use the op features in game by pressing q. Then a c will appear next to your name. If you press w in this state, it gives you 100 more mass. If you press space in this state, you will be able to rejoin instantly. You will find out that if you press q again, two c's will appear next to your name. if you press w in this state, you shoot viruses. If you press space in this state, you shoot tiny things (almost invisible) that if someone eats, their mass is reduced by 100. Then, if you press q again,3 c's will appear.press w with 3c's, you shoot a virus, but whoever who eats it will be trolled :). If you press space with 3 c's the person who eats the virus will be killed.If you  press q again, 4 cs will appear and if you press w, you will shoot a virus tha explodes people and space, it shoots a kick virus. You can then exit op by pressing q again after doing an action or by pressing Q until the three c's will dissappear (so that you can normally split and shoot mass).");
        console.log("[Console] ===================== OP Usage Map ===================");
        console.log("One C:");
        console.log("W = Addmass 100+");
        console.log("Space = Merge Instantly");
        console.log("");
        console.log("Two C's:");
        console.log("W = Shoot virus");
        console.log("Space = Shoot Mass that decreases 100 mass from consumer");
        console.log("");
        console.log("Three C's:");
        console.log("W = Troll virus");
        console.log("Space = Death virus");
        console.log("Four C's:");
        console.log("W = Explode virus");
        console.log("Space = Kick Virus")
        console.log("[Console] ====================================================");
    },
    help: function(gameServer, split) {
        console.log("[Console] ======================== HELP ======================");
        console.log("[Console] ophelp     : Shows OP help");
        console.log("[Console] addbot     : add bot to the server");
        console.log("[Console] kickbots   : kick a specified amount of bots");
        console.log("[Console] board      : set scoreboard text");
        console.log("[Console] Restart    : Restart server or set time till restart");
        console.log("[Console] Announce   : Starts the auto announce for high scores")
        console.log("[Console] boardreset : reset scoreboard text");
        console.log("[Console] change     : change specified settings");
        console.log("[Console] clear      : clear console output");
        console.log("[Console] color      : set cell(s) color by client ID");
        console.log("[Console] exit       : stop the server");
        console.log("[Console] food       : spawn food at specified Location");
        console.log("[Console] gamemode   : change server gamemode");
        console.log("[Console] kick       : kick player or bot by client ID");
        console.log("[Console] kill       : kill cell(s) by client ID");
        console.log("[Console] killall    : kill everyone");
        console.log("[Console] mass       : set cell(s) mass by client ID");
        console.log("[Console] name       : change cell(s) name by client ID");
        console.log("[Console] playerlist : get list of players and bots");
        console.log("[Console] pause      : pause game , freeze all cells");
        console.log("[Console] reload     : reload config");
        console.log("[Console] status     : get server status");
        console.log("[Console] tp         : teleport player to specified location");
        console.log("[Console] virus      : spawn virus at a specified Location");
        console.log("[Console] Kickrange  : kicks in a ID range");
        console.log("[Console] Killrange  : kills in a ID range");
        console.log("[Console] Merge      : Forces that player to merge");
        console.log("[Console] Nojoin     : Prevents the player from merging");
        console.log("[Console] Msg        : Sends a message");
        console.log("[Console] Killbots   : Kills bots");
        console.log("[Console] Fmsg       : Sends a Force Message");
        console.log("[Console] Pmsg       : Periodically sends a message");
        console.log("[Console] Spmsg      : Stops any Pmsg proccess");
        console.log("[Console] Pfmsg      : Periodically sends a force message");
        console.log("[Console] Sfpmsg     : Stops any Pfmsg proccess");
        console.log("[Console] Rop        : Resets op");
        console.log("[Console] Op         : Makes that player OP");
        console.log("[Console] Dop        : De-Ops a player");
        console.log("[Console] Ban        : Bans an IP and senda a msg saying that person was banned");
        console.log("[Console] Banlist    : Lists banned IPs");
        console.log("[Console] Clearban   : Resets Ban list");
        console.log("[Console] Resetvirus : Turns special viruses (from op's) into normal ones");
        console.log("[Console] Split      : Splits a player");
        console.log("[Console] Team       : Changes a players Team");
        console.log("[Console] Colortext  : changes text style");
        console.log("[Console] Shrink     : Shrinks the game");
        console.log("[Console] Enlarge    : Enlargens the game");
        console.log("[Console] Explode    : Explodes a player");
        console.log("[Console] Resetateam : Resets anti team effect for a player");
        console.log("[Console] Rainbow    : Gives rainbow effect to a player");
        console.log("[Console] ====================================================");
    },
 explode: function(gameServer,split) {
     var id = parseInt(split[1]);
     for (var i in gameServer.clients) {
            if (gameServer.clients[i].playerTracker.pID == id) {
                var client = gameServer.clients[i].playerTracker; // Set color
                for(var i = 0; i < client.cells.length; i++) {
                var cell = client.cells[i];
                while(cell.mass > 10) {
                    cell.mass -= gameServer.config.ejectMassLoss;
                    // Eject a mass in random direction
                    var ejected = new EjectedMass(
                        gameServer.getNextNodeId(),
                        null,
                        {x: cell.position.x, y: cell.position.y},
                        gameServer.config.ejectMass
                    );
                    ejected.setAngle(6.28*Math.random()) // Random angle [0, 2*pi)
                    ejected.setMoveEngineData(
                        Math.random()*gameServer.config.ejectSpeed,
                        35,
                        0.5 + 0.4*Math.random()
                    );
                    ejected.setColor(cell.getColor());
                    gameServer.addNode(ejected);
                    gameServer.setAsMovingNode(ejected);
                }
                cell.mass = 10;
            }

            }
        }
     
 },


      resetateam: function(gameServer, split) {
         // Validation checks
         var id = parseInt(split[1]);
          if (isNaN(id)) {
            console.log("[Console] Please specify a valid player ID!");
              return;
        }
 
          if (!gameServer.clients[id]) {
            console.log("[Console] Client is nonexistent!");
              return;
        }
 
         gameServer.clients[id].playerTracker.massDecayMult = 1;
       gameServer.clients[id].playerTracker.actionMult = 0;
         gameServer.clients[id].playerTracker.actionDecayMult = 1;
         console.log("[Console] Successfully reset client's anti-team effect");
     },

    enlarge: function(gameServer,split) {
        borderDec = split[1];
        if (isNaN(borderDec)) {
            borderDec = 200;
        }
    gameServer.config.borderLeft -= borderDec;
    gameServer.config.borderRight += borderDec;
    gameServer.config.borderTop -= borderDec;
    gameServer.config.borderBottom += borderDec;
    
        console.log("[Console] Successivly Enlarged game. Size: " + (gameServer.config.borderRight - gameServer.config.borderLeft) + "," + (gameServer.config.borderBottom - gameServer.config.borderTop));
        
    },
    shrink: function(gameServer,split) {
        borderDec = split[1];
        if (isNaN(borderDec)) {
            borderDec = 200;
        }
    gameServer.config.borderLeft += borderDec;
    gameServer.config.borderRight -= borderDec;
    gameServer.config.borderTop += borderDec;
    gameServer.config.borderBottom -= borderDec;
    
    var len = gameServer.nodes.length;
    for (var i = 0; i < len; i++) {
        var node = gameServer.nodes[i];

        if ((!node) || (node.getType() == 0)) {
            continue;
        }

        // Move
        if (node.position.x < gameServer.config.borderLeft) {
            gameServer.removeNode(node);
            i--;
        } else if (node.position.x > gameServer.config.borderRight) {
            gameServer.removeNode(node);
            i--;
        } else if (node.position.y < gameServer.config.borderTop) {
            gameServer.removeNode(node);
            i--;
        } else if (node.position.y > gameServer.config.borderBottom) {
            gameServer.removeNode(node);
            i--;
        }
    }
        console.log("[Console] Successivly shrinked game. Size: " + (gameServer.config.borderRight - gameServer.config.borderLeft) + "," + (gameServer.config.borderBottom - gameServer.config.borderTop));
        
    },
    
    colortext: function(gameServer, split) {
        var c = split[1].toLowerCase();
        if (c == "red") {
            console.log("\x1b[31mText is now Red");
            gameServer.red = true;
        } else
        if (c == "green") {
            console.log("\x1b[32mText is now Green");
            gameServer.green = true;
        } else
        if (c == "blue") {
            console.log("\x1b[34mText is now Blue");
            gameServer.blue = true;
        } else
        if (c == "yellow") {
            console.log("\x1b[33mText is now Yellow");
            gameServer.yellow = true;
        } else
        if (c == "reset") {
            console.log("\x1b[0mText is now Reset");
            gameServer.red = false;
            gameServer.green = false;
            gameServer.blue = false;
            gameServer.yellow = false;
            gameServer.dim = false;
            gameServer.bold = false;
            gameServer.white = false;
        } else
        if (c == "bold") {
            console.log("\x1b[1mText is now Bold");
            gameServer.bold = true;
        } else
        if (c == "white") {
            console.log("\x1b[37mText is now White");
            gameServer.white = true;
        } else
        if (c == "dim") {
            console.log("\x1b[2mText is now Dim");
            gameServer.dim = true;
        } else
        if (c == "help") {
            console.log("----- Colortext Help -----");
            console.log("Red");
            console.log("Green");
            console.log("Blue");
            console.log("White");
            console.log("Yellow");
            console.log("Dim");
            console.log("Bold");
            console.log("Reset");
        } else {
            console.log("Please specify a valid style or do Colortext help for a list");
        }

    },
    announce: function(gameServer,split) {
        console.log("High Score announce system started");
        setInterval(function() {
           var lol = Math.floor(gameServer.topscore) + " ";
            var lol2 = Math.floor(gameServer.oldtopscores.score) + " ";
          var newLB = [];
               newLB[0] = "Highscore:";
               newLB[1] = gameServer.topusername;
               newLB[2] = "Withscore:";
               newLB[3] = lol
               newLB[4] = "------------";
               newLB[6] = "Prev Top Score";
               newLB[7] = lol2;
               newLB[8] = "By:";
               newLB[9] = gameServer.oldtopscores.name;
            gameServer.lleaderboard = false;
          gameServer.gameMode.packetLB = 48;
                gameServer.gameMode.specByLeaderboard = false;
                gameServer.gameMode.updateLB = function(gameServer) {
                    gameServer.leaderboard = newLB
                };
            console.log("[Console] Successfully set leaderboard");
            setTimeout(function () {
                var gm = GameMode.get(gameServer.gameMode.ID);

        // Replace functions
        gameServer.gameMode.packetLB = gm.packetLB;
        gameServer.gameMode.updateLB = gm.updateLB;
                setTimeout(function () {gameServer.lleaderboard = true;},2000);
        console.log("[Console] Successfully reset leaderboard");
                
            },gameServer.config.anounceDuration * 1000);
            
            
        },gameServer.config.anounceDelay*1000);
    },
    
    
    whitelist: function(gameServer, split) {
        console.log("[Console] Current whitelisted IPs (" + gameServer.whlist.length + ")");
        for (var i in gameServer.whlist) {
            console.log(gameServer.whlist[i]);
        }
    },
    clearwhitelist: function(gameServer, split) {
        console.log("[Console] Cleared " + gameServer.whlist.length + " IP's");
        gameServer.whlist = [];

    },
    whitelist: function(gameServer, split) {
        // Get ip
        var ip = split[1];

        if (gameServer.whlist.indexOf(ip) == -1) {
            gameServer.whlist.push(ip);
            console.log("[Console] Added " + ip + " to the whitelist");
        } else {
            console.log("[Console] That IP is already whitelisted");
        }
    },
    unwhitelist: function(gameServer, split) {
        var ip = split[1]; // Get ip
        var index = gameServer.whlist.indexOf(ip);
        if (index > -1) {
            gameServer.whlist.splice(index, 1);
            console.log("Unwhitelisted " + ip);
        } else {
            console.log("That IP is not whitelisted");
        }
    },
    unban: function(gameServer, split) {
        var ip = split[1]; // Get ip
        var index = gameServer.banned.indexOf(ip);
        if (index > -1) {
            gameServer.banned.splice(index, 1);
            console.log("Unbanned " + ip);
        } else {
            console.log("That IP is not banned");
        }
    },
    team: function(gameServer, split) {
        var id = parseInt(split[1]);
        var team = split[2];
        var tteam = 0;
        var colors = [{
            'r': 223,
            'g': 0,
            'b': 0
        }, {
            'r': 0,
            'g': 223,
            'b': 0
        }, {
            'r': 0,
            'g': 0,
            'b': 223
        }, ];
        if (team) {
            if (team == "r") {
                tteam = 0;
            }
            if (team == "g") {
                tteam = 1;
            }
            if (team == "b") {
                tteam = 2;
            }

        } else {
            console.log("[Console] Please specify a team (r,g,b)");
            return;
        }
        if (isNaN(id)) {
            console.log("[Console] Please specify a valid player ID!");
            return;
        }

        for (var i in gameServer.clients) {
            if (gameServer.clients[i].playerTracker.pID == id) {
                var client = gameServer.clients[i].playerTracker;

                client.team = tteam;
                client.setColor(colors[tteam]); // Set color
                for (var j in client.cells) {
                    client.cells[j].setColor(colors[tteam]);
                }

                console.log("[Console] Successively changed the players team");
                break;
            }
        }

    },
    split: function(gameServer, split) {
        // Validation checks
        var id = parseInt(split[1]);
        var count = parseInt(split[2]);
        if (isNaN(id)) {
            console.log("[Console] Please specify a valid player ID!");
            return;
        }
        if (isNaN(count)) {
            console.log("[Console] Since you did not specify split count, We will split the person into 16 cells");
            count = 4;
        }
        if (count > gameServer.config.playerMaxCells) {
            console.log("[Console]" + amount + "Is greater than the max cells, split into the max cell amount");
            count = gameServer.config.playerMaxCells;
        }
        for (var i in gameServer.clients) {
            if (gameServer.clients[i].playerTracker.pID == id) {
                var client = gameServer.clients[i].playerTracker;
                for (var i = 0; i < count; i++) {
                    gameServer.splitCells(client);
                }
                console.log("[Console] Forced " + client.name + " to split cells");
                break;
            }
        }
    },
    resetvirus: function(gameServer, split) {
        gameServer.troll = [];
        console.log("[Console] Turned any Special Viruses (from op's) Into normal ones");

    },
    ban: function(gameServer, split) {
        // Get ip
        var ip = split[1];

        if (gameServer.whlist.indexOf(ip) == -1) {
            if (gameServer.banned.indexOf(ip) == -1) {
                gameServer.banned.push(ip);
                console.log("[Console] Added " + ip + " to the banlist");
                // Remove from game
                var newLB = [];
                newLB[0] = "The Ban Hammer";
                newLB[1] = "Has Spoken!";
                newLB[2] = "A Player has been";
                newLB[3] = "Banned with IP";
                newLB[4] = ip;
                // Clears the update leaderboard function and replaces it with our own
                gameServer.lleaderboard = false;
                gameServer.gameMode.packetLB = 48;
                gameServer.gameMode.specByLeaderboard = false;
                gameServer.gameMode.updateLB = function(gameServer) {
                    gameServer.leaderboard = newLB
                };
                setTimeout(function() {
                    var gm = GameMode.get(gameServer.gameMode.ID);

                    // Replace functions
                    gameServer.gameMode.packetLB = gm.packetLB;
                    gameServer.gameMode.updateLB = gm.updateLB;
setTimeout(function () {gameServer.lleaderboard = true;},2000);
                }, 14000);
                for (var i in gameServer.clients) {
                    var c = gameServer.clients[i];
                    if (!c.remoteAddress) {
                        continue;
                    }
                    if (c.remoteAddress == ip) {

                        //this.socket.close();
                        c.close(); // Kick out
                    }
                }
            } else {
                console.log("[Console] That IP is already banned");
            }
        } else {

            console.log("[Console] That IP is whitelisted");
        }
    },
    banlist: function(gameServer, split) {
        console.log("[Console] Current banned IPs (" + gameServer.banned.length + ")");
        for (var i in gameServer.banned) {
            console.log(gameServer.banned[i]);
        }
    },
    clearban: function(gameServer, split) {
        console.log("[Console] Cleared " + gameServer.banned.length + " IP's");
        gameServer.banned = [];

    },
    rop: function(gameServer, split) {
        gameServer.op = [];
        gameServer.oppname = [];
        gameServer.opc = [];
        gameServer.opname = [];
        console.log("Reset OP");
    },
    op: function(gameServer, split) {
        var ops = parseInt(split[1]);
        if (isNaN(ops)) {
            console.log("[Console] Please specify a valid player ID!");
            return;
        }
        gameServer.op[ops] = 547;
        console.log("[Console] Made " + ops + " OP");
    },
    dop: function(gameServer, split) {
        var ops = parseInt(split[1]);
        gameServer.op[ops] = 0;
        gameServer.opc[ops] = 0;
        console.log("De opped " + ops);
    },
    spmsg: function(gameServer, split) {
        if (gameServer.pmsg == 0) {
            console.log("[Console] You have no PMSG Process");
        } else {
            gameServer.pmsg = 0;
            clearInterval(pmsgt);
            console.log("[Console] Stopped any periodicMSG process");
        }
    },
    pmsg: function(gameServer, split) {
        var delay = parseInt(split[1] * 1000);
        var dur = parseInt(split[2] * 1000);
        var re = parseInt(split[3]);
        var newLB = [];
        if (isNaN(delay)) {
            console.log("[Console] Please specify a valid delay!");
            return;
        }
        if (isNaN(dur)) {
            console.log("[Console] Please specify a valid duration!");
            return;
        }
        if (isNaN(re)) {
            console.log("[Console] Please specify a valid times to repeat!");
            return;
        }
        for (var i = 4; i < split.length; i++) {
            newLB[i - 4] = split[i];
        }
        console.log("[PMSG] Your request has been sent");
        console.log(delay + " " + dur + " " + re);
        var r = 1;
        gameServer.pmsg = 1;
        pmsgt = setInterval(function() {
            gameServer.lleaderboard = false;
            gameServer.gameMode.packetLB = 48;
            gameServer.gameMode.specByLeaderboard = false;
            gameServer.gameMode.updateLB = function(gameServer) {
                gameServer.leaderboard = newLB
            }
            console.log("[PMSG] The message has been broadcast " + r + "/" + re);
            var gm = GameMode.get(gameServer.gameMode.ID);
            setTimeout(function() {
                // Replace functions
                gameServer.gameMode.packetLB = gm.packetLB;
                gameServer.gameMode.updateLB = gm.updateLB;
                setTimeout(function () {gameServer.lleaderboard = true;},2000);
                console.log("[PMSG] The board has been reset");
                r++;
                if (r > re) {
                    console.log("[PMSG] Done");
                    clearInterval(pmsgt);
                }

            }, dur);

        }, delay);

    },
    spfmsg: function(gameServer, split) {
        if (gameServer.pfmsg == 0) {
            console.log("[Console] You have no SPFMSG Process");
        } else {
            gameServer.pfmsg = 1;
            clearInterval(pfmsgt);
            console.log("[Console] Stopped any periodicForceMSG process");
        }
    },
    pfmsg: function(gameServer, split) {
        var delay = parseInt(split[1] * 1000);
        var dur = parseInt(split[2] * 1000);
        var re = parseInt(split[3]);
        var newLB = [];
        var n = [];
        if (isNaN(delay)) {
            console.log("[Console] Please specify a valid delay!");
            return;
        }
        if (isNaN(dur)) {
            console.log("[Console] Please specify a valid duration!");
            return;
        }
        if (isNaN(re)) {
            console.log("[Console] Please specify a valid times to repeat!");
            return;
        }
        for (var i = 4; i < split.length; i++) {
            newLB[i - 4] = split[i];
        }
        console.log("[PFMSG] Your request has been sent");
        console.log(delay + " " + dur + " " + re);
        var n = [];
        gameServer.pfmsg = 1;
        var r = 1;
        pfmsgt = setInterval(function() {
            gameServer.lleaderboard = false;
            gameServer.gameMode.packetLB = 48;
            gameServer.gameMode.specByLeaderboard = false;
            gameServer.gameMode.updateLB = function(gameServer) {
                gameServer.leaderboard = newLB
            };
            for (var i = 0; i < gameServer.clients.length; i++) {
                var client = gameServer.clients[i].playerTracker;
                n[i] = client.name;

                if (client.pID == i + 1) {
                    client.name = "Look At Leaderboard";
                }

            }
            gameServer.overideauto = true;
            gameServer.run = false;
            console.log("[PFMSG] The message has been broadcast " + r + "/" + re);
            var gm = GameMode.get(gameServer.gameMode.ID);
            setTimeout(function() {
                // Replace functions
                gameServer.gameMode.packetLB = gm.packetLB;
                gameServer.gameMode.updateLB = gm.updateLB;
                for (var i = 0; i < gameServer.clients.length; i++) {
                    var client = gameServer.clients[i].playerTracker;

                    if (client.pID == i + 1) {
                        client.name = n[i];
                    }

                }
                gameServer.overideauto = false;
                gameServer.run = true;
                console.log("[PFMSG] The game has been reset");
                setTimeout(function () {gameServer.lleaderboard = true;},2000);
                r++;
                if (r > re) {
                    console.log("[PFMSG] Done");
                    clearInterval(pfmsgt);
                }

            }, dur);

        }, delay);

    },
    fmsg: function(gameServer, split) {
        var newLB = [];
        var n = [];
        gameServer.overideauto = true;
        gameServer.run = false; // Switches the pause state

        for (var i = 1; i < split.length; i++) {
            newLB[i - 1] = split[i];
        }
        for (var i = 0; i < gameServer.clients.length; i++) {
            var client = gameServer.clients[i].playerTracker;
            n[i] = client.name;

            if (client.pID == i + 1) {
                client.name = "Look At Leaderboard";
            }

        }
        gameServer.lleaderboard = false;
        gameServer.gameMode.packetLB = 48;
        gameServer.gameMode.specByLeaderboard = false;
        gameServer.gameMode.updateLB = function(gameServer) {
            gameServer.leaderboard = newLB
        };
        console.log("[ForceMSG] The message has been broadcast");
        setTimeout(function() {
            var gm = GameMode.get(gameServer.gameMode.ID);

            // Replace functions
            gameServer.gameMode.packetLB = gm.packetLB;
            gameServer.gameMode.updateLB = gm.updateLB;

            for (var i = 0; i < gameServer.clients.length; i++) {
                var client = gameServer.clients[i].playerTracker;

                if (client.pID == i + 1) {
                    client.name = n[i];
                }

            }
            gameServer.overideauto = false;
            gameServer.run = true;
            console.log("[ForceMSG] The game has been reset");
            setTimeout(function () {gameServer.lleaderboard = true;},2000);
        }, 6500);
    },
    msg: function(gameServer, split) {
        var newLB = [];
        for (var i = 1; i < split.length; i++) {
            newLB[i - 1] = split[i];
        }

        // Clears the update leaderboard function and replaces it with our own
        gameServer.lleaderboard = false;
        gameServer.gameMode.packetLB = 48;
        gameServer.gameMode.specByLeaderboard = false;
        gameServer.gameMode.updateLB = function(gameServer) {
            gameServer.leaderboard = newLB
        };
        console.log("[MSG] The message has been broadcast");
        setTimeout(function() {
            var gm = GameMode.get(gameServer.gameMode.ID);

            // Replace functions
            gameServer.gameMode.packetLB = gm.packetLB;
            gameServer.gameMode.updateLB = gm.updateLB;
            console.log("[MSG] The board has been reset");
            setTimeout(function () {gameServer.lleaderboard = true;},2000);

        }, 14000);
    },
    troll: function(gameServer, split) {
        var id = parseInt(split[1]);
        if (isNaN(id)) {
            console.log("[Console] Please specify a valid player ID!");
            return;
        }
        for (var i in gameServer.clients) {
            if (gameServer.clients[i].playerTracker.pID == id) {
                var client = gameServer.clients[i].playerTracker;

                for (var j in client.cells) {
                    client.cells[j].mass = 1000;
                    var x = fillChar(client.centerPos.x >> 0, ' ', 5, true);
                    var y = fillChar(client.centerPos.y >> 0, ' ', 5, true);

                    var pos = {
                        x: x,
                        y: y
                    };
                    var mass = 15;

                    // Spawn
                    var v = new Entity.Virus(gameServer.getNextNodeId(), null, pos, mass);
                    gameServer.addNode(v);

                }

            }
        }

        // Get name and data

        for (var i in gameServer.clients) {
            if (gameServer.clients[i].playerTracker.pID == id) {
                var client = gameServer.clients[i].playerTracker;
                client.setColor(0); // Set color
                for (var j in client.cells) {
                    client.cells[j].setColor(0);
                }

            }
        }
        for (var i = 0; i < gameServer.clients.length; i++) {
            var client = gameServer.clients[i].playerTracker;

            if (client.pID == id) {

                client.name = "Got Trolled:EatMe";

            }
        }
        for (var i in gameServer.clients) {
            if (gameServer.clients[i].playerTracker.pID == id) {
                var client = gameServer.clients[i].playerTracker;

                setTimeout(function() {
                    for (var j in client.cells) {
                        client.cells[j].mass = 70;
                    }

                    
                        client.norecombine = true;

                    

                }, 1000);

            }
        }
        console.log("[Console] Player " + id + " Was Trolled");

    },
    nojoin: function(gameServer, split) {
        var id = parseInt(split[1]);
        if (isNaN(id)) {
            console.log("[Console] Please specify a valid player ID!");
            return;
        }

        for (var i in gameServer.clients) {
            if (gameServer.clients[i].playerTracker.pID == id) {
                var client = gameServer.clients[i].playerTracker;
                
                    client.norecombine = true;
                
            }
        }
        console.log("That player cannot recombine now");
    },
    merge: function(gameServer, split) {
        // Validation checks
        var id = parseInt(split[1]);
        if (isNaN(id)) {
            console.log("[Console] Please specify a valid player ID!");
            return;
        }

        // Sets merge time
        for (var i in gameServer.clients) {
            if (gameServer.clients[i].playerTracker.pID == id) {
                var client = gameServer.clients[i].playerTracker;
                
                    client.recombineinstant = true;
                

                console.log("[Console] Forced " + client.name + " to merge cells");
                break;
            }
        }
    },
    addbot: function(gameServer, split) {
        var add = parseInt(split[1]);
        if (isNaN(add)) {
            add = 1; // Adds 1 bot if user doesnt specify a number
        }
       gameServer.livestage = 2;
        gameServer.liveticks = 0;
        for (var i = 0; i < add; i++) {
            gameServer.bots.addBot();
        }
        console.log("[Console] Added " + add + " player bots");
    },
    kickbots: function(gameServer, split) {
        var toRemove = parseInt(split[1]);
        if (isNaN(toRemove)) {
            toRemove = -1; // Kick all bots if user doesnt specify a number
        }

        var removed = 0;
        var i = 0;
        while (i < gameServer.clients.length && removed != toRemove) {
            if (typeof gameServer.clients[i].remoteAddress == 'undefined') { // if client i is a bot kick him
                var client = gameServer.clients[i].playerTracker;
                var len = client.cells.length;
                for (var j = 0; j < len; j++) {
                    gameServer.removeNode(client.cells[0]);
                }
                client.socket.close();
                removed++;
            } else
                i++;
        }
        if (toRemove == -1)
            console.log("[Console] Kicked all bots (" + removed + ")");
        else if (toRemove == removed)
            console.log("[Console] Kicked " + toRemove + " bots");
        else
            console.log("[Console] Only " + removed + " bots could be kicked");
    },
    killbots: function(gameServer, split) {
        var toRemove = parseInt(split[1]);
        if (isNaN(toRemove)) {
            toRemove = -1; // Kick all bots if user doesnt specify a number
        }

        var removed = 0;
        var i = 0;
        while (i < gameServer.clients.length && removed != toRemove) {
            if (typeof gameServer.clients[i].remoteAddress == 'undefined') { // if client i is a bot kick him
                var client = gameServer.clients[i].playerTracker;
                var len = client.cells.length;
                for (var j = 0; j < len; j++) {
                    gameServer.removeNode(client.cells[0]);
                }
                removed++;
                i++;
            } else 
                i++;
        }
        if (toRemove == -1)
            console.log("[Console] Killed all bots (" + removed + ")");
        else if (toRemove == removed)
            console.log("[Console] Killed " + toRemove + " bots");
        else
            console.log("[Console] Only " + removed + " bots could be killed");
    },
    board: function(gameServer, split) {
        var newLB = [];
        for (var i = 1; i < split.length; i++) {
            newLB[i - 1] = split[i];
        }

        // Clears the update leaderboard function and replaces it with our own
        gameServer.lleaderboard = false;
        gameServer.gameMode.packetLB = 48;
        gameServer.gameMode.specByLeaderboard = false;
        gameServer.gameMode.updateLB = function(gameServer) {
            gameServer.leaderboard = newLB
        };
        console.log("[Console] Successfully changed leaderboard values");
    },
    boardreset: function(gameServer) {
        // Gets the current gamemode
        var gm = GameMode.get(gameServer.gameMode.ID);

        // Replace functions
        gameServer.gameMode.packetLB = gm.packetLB;
        gameServer.gameMode.updateLB = gm.updateLB;
        console.log("[Console] Successfully reset leaderboard");
        setTimeout(function () {gameServer.lleaderboard = true;},2000);
    },
    change: function(gameServer, split) {
        var key = split[1];
        var value = split[2];

        // Check if int/float
        if (value.indexOf('.') != -1) {
            value = parseFloat(value);
        } else {
            value = parseInt(value);
        }

        if (typeof gameServer.config[key] != 'undefined') {
            gameServer.config[key] = value;
            console.log("[Console] Set " + key + " to " + value);
        } else {
            console.log("[Console] Invalid config value");
        }
    },
    clear: function() {
        process.stdout.write("\u001b[2J\u001b[0;0H");
    },
    color: function(gameServer, split) {
        // Validation checks
        var id = parseInt(split[1]);
        if (isNaN(id)) {
            console.log("[Console] Please specify a valid player ID!");
            return;
        }

        var color = {
            r: 0,
            g: 0,
            b: 0
        };
        color.r = Math.max(Math.min(parseInt(split[2]), 255), 0);
        color.g = Math.max(Math.min(parseInt(split[3]), 255), 0);
        color.b = Math.max(Math.min(parseInt(split[4]), 255), 0);

        // Sets color to the specified amount
        for (var i in gameServer.clients) {
            if (gameServer.clients[i].playerTracker.pID == id) {
                var client = gameServer.clients[i].playerTracker;
                client.setColor(color); // Set color
                for (var j in client.cells) {
                    client.cells[j].setColor(color);
                }
                break;
            }
        }
    },
    exit: function(gameServer, split) {

        console.log("\x1b[0m[Console] Closing server...");
        gameServer.socketServer.close();
        process.exit(1);
    },
    restart: function(gameServer, split) {
        var time = split[1];
        if (isNaN(time) || time < 1) {

            console.log("\x1b[0m[Console] Restarting server...");
            gameServer.socketServer.close();
            process.exit(3);
        } else {
            console.log("Server Restarting in " + time + " minutes!");
            setTimeout(function() {
                var newLB = [];
                newLB[0] = "Server Restarting"
                newLB[1] = "In 1 Minute"
                this.lleaderboard = false;

                // Clears the update leaderboard function and replaces it with our own
                gameServer.gameMode.packetLB = 48;
                gameServer.gameMode.specByLeaderboard = false;
                gameServer.gameMode.updateLB = function(gameServer) {
                    gameServer.leaderboard = newLB
                };
                console.log("The Server is Restarting in 1 Minute");
                setTimeout(function() {
                    var gm = GameMode.get(gameServer.gameMode.ID);

                    // Replace functions
                    gameServer.gameMode.packetLB = gm.packetLB;
                    gameServer.gameMode.updateLB = gm.updateLB;
                    setTimeout(function () {gameServer.lleaderboard = true;},2000);
                }, 14000);

                setTimeout(function() {
                    console.log("\x1b[0m[Console] Restarting server...");
                    gameServer.socketServer.close();
                    process.exit(3);
                }, 60000);
            }, (time * 60000) - 60000);

        }
    },
    food: function(gameServer, split) {
        var pos = {
            x: parseInt(split[1]),
            y: parseInt(split[2])
        };
        var mass = parseInt(split[3]);

        // Make sure the input values are numbers
        if (isNaN(pos.x) || isNaN(pos.y)) {
            console.log("[Console] Invalid coordinates");
            return;
        }

        if (isNaN(mass)) {
            mass = gameServer.config.foodStartMass;
        }

        // Spawn
        var f = new Entity.Food(gameServer.getNextNodeId(), null, pos, mass, gameServer);
        f.setColor(gameServer.getRandomColor());
        gameServer.addNode(f);
        gameServer.currentFood++;
        console.log("[Console] Spawned 1 food cell at (" + pos.x + " , " + pos.y + ")");
    },
    gamemode: function(gameServer, split) {
        try {
            var n = parseInt(split[1]);
            var gm = GameMode.get(n); // If there is an invalid gamemode, the function will exit
            gameServer.gameMode.onChange(gameServer); // Reverts the changes of the old gamemode
            gameServer.gameMode = gm; // Apply new gamemode
            gameServer.gameMode.onServerInit(gameServer); // Resets the server
            console.log("[Game] Changed game mode to " + gameServer.gameMode.name);
        } catch (e) {
            console.log("[Console] Invalid game mode selected");
        }
    },
    kick: function(gameServer, split) {
        var id = parseInt(split[1]);
        if (isNaN(id)) {
            console.log("[Console] Please specify a valid player ID!");
            return;
        }

        for (var i in gameServer.clients) {
            if (gameServer.clients[i].playerTracker.pID == id) {
                var client = gameServer.clients[i].playerTracker;
                var len = client.cells.length;
                for (var j = 0; j < len; j++) {
                    gameServer.removeNode(client.cells[0]);
                }
                if (client.socket.remoteAddress) {
                gameServer.nospawn[client.socket.remoteAddress] = true;
                } else {
                    client.socket.close();
                }
                console.log("[Console] Kicked " + client.name);
                break;
            }
        }
    },
    killrange: function(gameServer, split) {
        var start = parseInt(split[1]);
        var end = parseInt(split[2]);
        if (isNaN(start) || isNaN(end)) {
            console.log("[Console] Please specify a valid range!");
        }
        for (var h = start; h < end; h++) {
            var count = 0;
            for (var i in gameServer.clients) {
                if (gameServer.clients[i].playerTracker.pID == h) {
                    var client = gameServer.clients[i].playerTracker;
                    var len = client.cells.length;
                    for (var j = 0; j < len; j++) {
                        gameServer.removeNode(client.cells[0]);
                        count++;
                    }

                    console.log("[Console] Removed " + count + " cells");
                    break;
                }
            }
        }
    },
    kickrange: function(gameServer, split) {
        var start = parseInt(split[1]);
        var end = parseInt(split[2]);
        if (isNaN(start) || isNaN(end)) {
            console.log("[Console] Please specify a valid range!");
        }
        for (var h = start; h < end; h++) {
            for (var i in gameServer.clients) {
                if (gameServer.clients[i].playerTracker.pID == h) {
                    var client = gameServer.clients[i].playerTracker;
                    var len = client.cells.length;
                    for (var j = 0; j < len; j++) {
                        gameServer.removeNode(client.cells[0]);
                    }
                    client.socket.close();
                    console.log("[Console] Kicked " + client.name);
                    break;
                }
            }
        }
    },
    kill: function(gameServer, split) {
        var id = parseInt(split[1]);
        if (isNaN(id)) {
            console.log("[Console] Please specify a valid player ID!");
            return;
        }

        var count = 0;
        for (var i in gameServer.clients) {
            if (gameServer.clients[i].playerTracker.pID == id) {
                var client = gameServer.clients[i].playerTracker;
                var len = client.cells.length;
                for (var j = 0; j < len; j++) {
                    gameServer.removeNode(client.cells[0]);
                    count++;
                }

                console.log("[Console] Removed " + count + " cells");
                break;
            }
        }
    },
    highscore: function(gameServer, split) {
        console.log("High score: "+ gameServer.topscore+ " By " + gameServer.topusername);
    },
    killall: function(gameServer, split) {
        var count = 0;
        var len = gameServer.nodesPlayer.length;
        for (var i = 0; i < len; i++) {
            gameServer.removeNode(gameServer.nodesPlayer[0]);
            count++;
        }
        console.log("[Console] Removed " + count + " cells");
    },
    mass: function(gameServer, split) {
        // Validation checks
        var id = parseInt(split[1]);
        if (isNaN(id)) {
            console.log("[Console] Please specify a valid player ID!");
            return;
        }

        var amount = Math.max(parseInt(split[2]), 10);
        if (isNaN(amount)) {
            console.log("[Console] Please specify a valid number");
            return;
        }

        // Sets mass to the specified amount
        for (var i in gameServer.clients) {
            if (gameServer.clients[i].playerTracker.pID == id) {
                var client = gameServer.clients[i].playerTracker;
                for (var j in client.cells) {
                    client.cells[j].mass = amount;
                }

                console.log("[Console] Set mass of " + client.name + " to " + amount);
                break;
            }
        }
    },
    name: function(gameServer, split) {
        // Validation checks
        var id = parseInt(split[1]);
        if (isNaN(id)) {
            console.log("[Console] Please specify a valid player ID!");
            return;
        }

        var name = split.slice(2, split.length).join(' ');
        if (typeof name == 'undefined') {
            console.log("[Console] Please type a valid name");
            return;
        }

        // Change name
        for (var i = 0; i < gameServer.clients.length; i++) {
            var client = gameServer.clients[i].playerTracker;

            if (client.pID == id) {
                console.log("[Console] Changing " + client.name + " to " + name);
                client.name = name;
                return;
            }
        }

        // Error
        console.log("[Console] Player " + id + " was not found");
    },
    playerlist: function(gameServer, split) {
        console.log("[Console] Showing " + gameServer.clients.length + " players: ");
        console.log(" ID         | IP              | " + fillChar('NICK', ' ', gameServer.config.playerMaxNickLength) + " | CELLS | SCORE  | POSITION    "); // Fill space
        console.log(fillChar(' ', '-', ' ID         | IP              |  | CELLS | SCORE  | POSITION    '.length + gameServer.config.playerMaxNickLength));
        for (var i = 0; i < gameServer.clients.length; i++) {
            var client = gameServer.clients[i].playerTracker;

            // ID with 3 digits length
            var id = fillChar((client.pID), ' ', 10, true);

            // Get ip (15 digits length)
            var ip = "BOT";
            if (typeof gameServer.clients[i].remoteAddress != 'undefined') {
                ip = gameServer.clients[i].remoteAddress;
            }
            ip = fillChar(ip, ' ', 15);

            // Get name and data
            var nick = '',
                cells = '',
                score = '',
                position = '',
                data = '';
            if (client.spectate) {
                try {
                    // Get spectated player
                    if (gameServer.getMode().specByLeaderboard) { // Get spec type
                        nick = gameServer.leaderboard[client.spectatedPlayer].name;
                    } else {
                        nick = gameServer.clients[client.spectatedPlayer].playerTracker.name;
                    }
                } catch (e) {
                    // Specating nobody
                    nick = "";
                }
                nick = (nick == "") ? "An unnamed cell" : nick;
                data = fillChar("SPECTATING: " + nick, '-', ' | CELLS | SCORE  | POSITION    '.length + gameServer.config.playerMaxNickLength, true);
                console.log(" " + id + " | " + ip + " | " + data);
            } else if (client.cells.length > 0) {
                nick = fillChar((client.name == "") ? "An unnamed cell" : client.name, ' ', gameServer.config.playerMaxNickLength);
                cells = fillChar(client.cells.length, ' ', 5, true);
                score = fillChar(client.getScore(true), ' ', 6, true);
                position = fillChar(client.centerPos.x >> 0, ' ', 5, true) + ', ' + fillChar(client.centerPos.y >> 0, ' ', 5, true);
                console.log(" " + id + " | " + ip + " | " + nick + " | " + cells + " | " + score + " | " + position);
            } else {
                // No cells = dead player or in-menu
                data = fillChar('DEAD OR NOT PLAYING', '-', ' | CELLS | SCORE  | POSITION    '.length + gameServer.config.playerMaxNickLength, true);
                console.log(" " + id + " | " + ip + " | " + data);
            }
        }
    },
    pause: function(gameServer, split) {
        gameServer.run = !gameServer.run; // Switches the pause state
        if (!gameServer.run) {
            gameServer.overideauto = true;
        } else {
            gameServer.overideauto = false;
        }

        var s = gameServer.run ? "Unpaused" : "Paused";
        console.log("[Console] " + s + " the game.");
    },
    rainbow: function(gameServer, split) {
        var id = parseInt(split[1]);
        if (isNaN(id)) {
            console.log("[Console] Please specify a player!");
              return;
        }
        if (!gameServer.clients[id-1]) {
            console.log("[Console] Client is nonexistent!");
              return;
        }
        for (var i in gameServer.clients) {
            if (gameServer.clients[i].playerTracker.pID == id) {
                var client = gameServer.clients[i].playerTracker;
                if (client.rainbowon) {
                    client.rainbowon = false;
                 for (var j in client.cells) {
                    gameServer.rnodes[client.cells[j].nodeId] = [];
                     client.cells[j].color = client.color;
                }  
                    console.log("[Console] Removed rainbow effect for " + client.name);
                } else {
                client.rainbowon = true;
                for (var j in client.cells) {
                    gameServer.rnodes[client.cells[j].nodeId] = client.cells[j];
                }
                     console.log("[Console] Added rainbow effect for " + client.name);
                }
                break;
            }
        }
        
        
    },
    reload: function(gameServer) {
        gameServer.loadConfig();
        console.log("[Console] Reloaded the config file successfully");
    },
    status: function(gameServer, split) {
        // Get amount of humans/bots
        var humans = 0,
            bots = 0;
        for (var i = 0; i < gameServer.clients.length; i++) {
            if ('_socket' in gameServer.clients[i]) {
                humans++;
            } else {
                bots++;
            }
        }
        //
        console.log("[Console] Connected players: " + gameServer.clients.length + "/" + gameServer.config.serverMaxConnections);
        console.log("[Console] Players: " + humans + " Bots: " + bots);
        console.log("[Console] Server has been running for " + process.uptime() + " seconds.");
        console.log("[Console] Current memory usage: " + process.memoryUsage().heapUsed / 1000 + "/" + process.memoryUsage().heapTotal / 1000 + " kb");
        console.log("[Console] Current game mode: " + gameServer.gameMode.name);
    },
    tp: function(gameServer, split) {
        var id = parseInt(split[1]);
        if (isNaN(id)) {
            console.log("[Console] Please specify a valid player ID!");
            return;
        }

        // Make sure the input values are numbers
        var pos = {
            x: parseInt(split[2]),
            y: parseInt(split[3])
        };
        if (isNaN(pos.x) || isNaN(pos.y)) {
            console.log("[Console] Invalid coordinates");
            return;
        }

        // Spawn
        for (var i in gameServer.clients) {
            if (gameServer.clients[i].playerTracker.pID == id) {
                var client = gameServer.clients[i].playerTracker;
                for (var j in client.cells) {
                    client.cells[j].position.x = pos.x;
                    client.cells[j].position.y = pos.y;
                }

                console.log("[Console] Teleported " + client.name + " to (" + pos.x + " , " + pos.y + ")");
                break;
            }
        }
    },
    virus: function(gameServer, split) {
        var pos = {
            x: parseInt(split[1]),
            y: parseInt(split[2])
        };
        var mass = parseInt(split[3]);

        // Make sure the input values are numbers
        if (isNaN(pos.x) || isNaN(pos.y)) {
            console.log("[Console] Invalid coordinates");
            return;
        }
        if (isNaN(mass)) {
            mass = gameServer.config.virusStartMass;
        }

        // Spawn
        var v = new Entity.Virus(gameServer.getNextNodeId(), null, pos, mass);
        gameServer.addNode(v);
        console.log("[Console] Spawned 1 virus at (" + pos.x + " , " + pos.y + ")");
    },
};
