const Discord = require('discord.js');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const fs = require("fs");


const adapter = new FileSync('database.json');
const db = low(adapter);

db.defaults({ game: [], gamep: [], channelSelected: [], tickets: [], pendu: [], chasse: [] }).write()

var prefix = "!"
var bot = new Discord.Client();

bot.on('ready', () => {
    bot.user.setPresence({ game: { name: 'Draguer Stewens', type: 1 } });
    bot.user.setStatus("idle");
    console.log("Bot Ready !");
})

bot.login(process.env.TOKEN);

bot.on('message', function (message) {
    if (message.channel.type === 'dm') return;
    if (message.author.bot) return;
    var chassedb = db.get("chasse").find('nombre').value()
    var nombre = Object.values(chassedb);
        if (message.content == prefix + "justenombre") {
            message.reply("test")
            if (nombre[3] <= 4) {
                if (nombre[0] == "azertyuiop") {
                    message.reply("Tirage aléatoire effectué, essayez de trouver le bon nombre entre 0 et 500 !")
                    number_random = Math.floor(Math.random() * (500 - 0) + 0)
                    console.log(number_random);
                    db.get("chasse").find({ partieetat: "attente" }).assign({ partieetat: nombre[1] = "start", nombre: nombre[0] = number_random, essaisold: nombre[4] = 0 }).write();
                } else {
                    message.reply("Une partie est déjà en cours !")
                }
            }

        }
        if (nombre[1] == "start") {
            if (message.content > nombre[0]) {
                message.reply("C'est moins !")
                db.get("chasse").find("nombre").assign({ essais: nombre[2] += 1 }).write();
            }
            else if (message.content < nombre[0]) {
                message.reply("C'est plus !")
                db.get("chasse").find("nombre").assign({ essais: nombre[2] += 1 }).write();
            }
            if (message.content == nombre[0]) {
                if (nombre[3] <= 4) {
                    var msgauthor = message.author.username;
                    message.reply(`à trouvé le bon nombre, félicitation ! (en ` + `${nombre[2]}` + ` essais)`);
                    db.get("chasse").find("nombre").assign({
                        nombre: nombre[0] = "azertyuiop",
                        partieetat: nombre[1] = "attente",
                        essaisold: nombre[4] = nombre[2],
                        essais: nombre[2] = 1,

                    }).write();
                }
            }
        }
})
