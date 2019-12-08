const Discord = require('discord.js');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const fs = require("fs");


const adapter = new FileSync('database.json');
const db = low(adapter);

db.defaults({ game: [], gamep: [], channelSelected: [], tickets: [], pendu: [], chasse: [], morpion: [] }).write()

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





bot.on('message', message => {

    var msgauthorid = message.author.id
    var morpiondb = db.get("morpion").find('0').value()
    var morpion = Object.values(morpiondb);

    if (message.content == prefix + "1") {
        if (message.author.bot) return;
        if (message.channel.type === 'dm') return;
        if (morpion[10] == "none") {
            if (morpion[11] == msgauthorid) {
                message.reply("Vous ne pouvez pas jouer contre vous même..")
            } else {
                message.reply("Tu es le joueur 1 !")
                db.get("morpion").find("p1").assign({
                    p1: morpion = msgauthorid
                }).write();
            }
        }
    }
    if (message.content == prefix + "2") {
        if (message.author.bot) return;
        if (message.channel.type === 'dm') return;
        if (morpion[11] == "none") {
            if (morpion[10] == msgauthorid) {
                message.reply("Vous ne pouvez pas jouer contre vous même..")
            } else {
                message.reply("Tu es le joueur 2 !")
                db.get("morpion").find("p2").assign({
                    p2: morpion = msgauthorid
                }).write();
            }
        }
    }

    if (message.content == prefix + "start") {
        if (message.author.bot) return;

        if (morpion[10] == "none" || morpion[11] == "none") {
            message.reply("Il manque un/des joueur(s).")
        } else {
            var ticket_embed = new Discord.RichEmbed()
                .setColor("#590599")
                .setTitle("☆-—————Morpion—————-☆")
                .setDescription(`${morpion[1]}${morpion[2]}${morpion[3]}\n${morpion[4]}${morpion[5]}${morpion[6]}\n${morpion[7]}${morpion[8]}${morpion[9]}`)
                .setFooter("★━━━━━━━━━━━━━━━━━━━★")
            message.channel.send({ embed: ticket_embed }).then(function (message) {

                message.react('↖️')
                    .then(() => message.react('⬆️'))
                    .then(() => message.react('↗️'))
                    .then(() => message.react('⬅️'))
                    .then(() => message.react('⏺️'))
                    .then(() => message.react('➡️'))
                    .then(() => message.react('↙️'))
                    .then(() => message.react('⬇️'))
                    .then(() => message.react('↘️'))
                    .catch(() => console.error('One of the emojis failed to react.'));
            })
        }
    }

if (message.content == prefix + "restart") {

    db.get("morpion").find("p1").assign({
        1: morpion = "⚪",
        2: morpion = "⚪",
        3: morpion = "⚪",
        4: morpion = "⚪",
        5: morpion = "⚪",
        6: morpion = "⚪",
        7: morpion = "⚪",
        8: morpion = "⚪",
        9: morpion = "⚪",
        p1: morpion = "none",
        p2: morpion = "none",
        pTour: morpion = "j1"
    }).write();
}



    if (
        (morpion[1] == "🔴" && morpion[2] == "🔴" && morpion[3] == "🔴") ||
        (morpion[1] == "🟡" && morpion[2] == "🟡" && morpion[3] == "🟡") ||
        (morpion[4] == "🔴" && morpion[5] == "🔴" && morpion[6] == "🔴") ||
        (morpion[4] == "🟡" && morpion[5] == "🟡" && morpion[6] == "🟡") ||
        (morpion[7] == "🔴" && morpion[8] == "🔴" && morpion[9] == "🔴") ||
        (morpion[7] == "🟡" && morpion[8] == "🟡" && morpion[9] == "🟡") ||
        (morpion[1] == "🔴" && morpion[4] == "🔴" && morpion[7] == "🔴") ||
        (morpion[1] == "🟡" && morpion[4] == "🟡" && morpion[7] == "🟡") ||
        (morpion[2] == "🔴" && morpion[5] == "🔴" && morpion[8] == "🔴") ||
        (morpion[2] == "🟡" && morpion[5] == "🟡" && morpion[8] == "🟡") ||
        (morpion[3] == "🔴" && morpion[6] == "🔴" && morpion[9] == "🔴") ||
        (morpion[3] == "🟡" && morpion[6] == "🟡" && morpion[9] == "🟡") ||
        (morpion[1] == "🔴" && morpion[5] == "🔴" && morpion[9] == "🔴") ||
        (morpion[1] == "🟡" && morpion[5] == "🟡" && morpion[9] == "🟡") ||
        (morpion[3] == "🔴" && morpion[5] == "🔴" && morpion[7] == "🔴") ||
        (morpion[3] == "🟡" && morpion[5] == "🟡" && morpion[7] == "🟡")
    ) {
        message.channel.send("Un joueur a gagné !")
        db.get("morpion").find("p1").assign({
            1: morpion = "⚪",
            2: morpion = "⚪",
            3: morpion = "⚪",
            4: morpion = "⚪",
            5: morpion = "⚪",
            6: morpion = "⚪",
            7: morpion = "⚪",
            8: morpion = "⚪",
            9: morpion = "⚪",
            p1: morpion = "none",
            p2: morpion = "none",
            pTour: morpion = "j1"
        }).write();
    }
    
//     if (
//         morpion[1] == "🔴" || morpion[1] == "🟡" &&
//         morpion[2] == "🔴" || morpion[2] == "🟡" &&
//         morpion[3] == "🔴" || morpion[3] == "🟡" &&
//         morpion[4] == "🔴" || morpion[4] == "🟡" &&
//         morpion[5] == "🔴" || morpion[5] == "🟡" &&
//         morpion[6] == "🔴" || morpion[6] == "🟡" &&
//         morpion[7] == "🔴" || morpion[7] == "🟡" &&
//         morpion[8] == "🔴" || morpion[8] == "🟡" &&
//         morpion[9] == "🔴" || morpion[9] == "🟡"
//     ) {
//         message.reply("Egalité !")
//         db.get("morpion").find("p1").assign({
//             1: morpion = "⚪",
//             2: morpion = "⚪",
//             3: morpion = "⚪",
//             4: morpion = "⚪",
//             5: morpion = "⚪",
//             6: morpion = "⚪",
//             7: morpion = "⚪",
//             8: morpion = "⚪",
//             9: morpion = "⚪",
//             p1: morpion = "none",
//             p2: morpion = "none",
//             pTour: morpion = "j1"
//         }).write();

//     }
})

bot.on('messageReactionAdd', (reaction, user) => {

    var msgauthorid = user.id
    var morpiondb = db.get("morpion").filter({ 0: "weee" }).find('0').value()
    var morpion = Object.values(morpiondb);



    function rep(message) {
        var msgauthorid = user.id
        var morpiondb = db.get("morpion").filter({ 0: "weee" }).find('0').value()
        var morpion = Object.values(morpiondb);
        var relou = new Discord.RichEmbed()
            .setColor("#590599")
            .setTitle("☆-—————Morpion—————-☆")
            .setDescription(`${morpion[1]}${morpion[2]}${morpion[3]}\n${morpion[4]}${morpion[5]}${morpion[6]}\n${morpion[7]}${morpion[8]}${morpion[9]}`)
            .setFooter("★━━━━━━━━━━━━━━━━━━━★")


        message.channel.send({ embed: relou }).then(function (message) {

            message.react('↖️')
                .then(() => message.react('⬆️'))
                .then(() => message.react('↗️'))
                .then(() => message.react('⬅️'))
                .then(() => message.react('⏺️'))
                .then(() => message.react('➡️'))
                .then(() => message.react('↙️'))
                .then(() => message.react('⬇️'))
                .then(() => message.react('↘️'))
                .catch(() => console.error('One of the emojis failed to react.'));
        })
    }

    if (reaction.emoji.name === '↖️' && morpion[12] == "j1" && user.id == morpion[10] && morpion[1] == "⚪") {
        db.get("morpion").find("p2").assign({ 1: morpion = "🔴", pTour: morpion = "j2" }).write();
        reaction.message.channel.send(`C'est au **JOUEUR 2** de jouer`).then(rep)
    }
    if (reaction.emoji.name === '⬆️' && morpion[12] == "j1" && user.id == morpion[10] && morpion[2] == "⚪") {
        db.get("morpion").find("p2").assign({ 2: morpion = "🔴", pTour: morpion = "j2" }).write();
        reaction.message.channel.send(`C'est au **JOUEUR 2** de jouer`).then(rep)
    }
    if (reaction.emoji.name === '↗️' && morpion[12] == "j1" && user.id == morpion[10] && morpion[3] == "⚪") {
        db.get("morpion").find("p2").assign({ 3: morpion = "🔴", pTour: morpion = "j2" }).write();
        reaction.message.channel.send(`C'est au **JOUEUR 2** de jouer`).then(rep)
    }
    if (reaction.emoji.name === '⬅️' && morpion[12] == "j1" && user.id == morpion[10] && morpion[4] == "⚪") {
        db.get("morpion").find("p2").assign({ 4: morpion = "🔴", pTour: morpion = "j2" }).write();
        reaction.message.channel.send(`C'est au **JOUEUR 2** de jouer`).then(rep)
    }
    if (reaction.emoji.name === '⏺️' && morpion[12] == "j1" && user.id == morpion[10] && morpion[5] == "⚪") {
        db.get("morpion").find("p2").assign({ 5: morpion = "🔴", pTour: morpion = "j2" }).write();
        reaction.message.channel.send(`C'est au **JOUEUR 2** de jouer`).then(rep)
    }
    if (reaction.emoji.name === '➡️' && morpion[12] == "j1" && user.id == morpion[10] && morpion[6] == "⚪") {
        db.get("morpion").find("p2").assign({ 6: morpion = "🔴", pTour: morpion = "j2" }).write();
        reaction.message.channel.send(`C'est au **JOUEUR 2** de jouer`).then(rep)
    }
    if (reaction.emoji.name === '↙️' && morpion[12] == "j1" && user.id == morpion[10] && morpion[7] == "⚪") {
        db.get("morpion").find("p2").assign({ 7: morpion = "🔴", pTour: morpion = "j2" }).write();
        reaction.message.channel.send(`C'est au **JOUEUR 2** de jouer`).then(rep)
    }
    if (reaction.emoji.name === '⬇️' && morpion[12] == "j1" && user.id == morpion[10] && morpion[8] == "⚪") {
        db.get("morpion").find("p2").assign({ 8: morpion = "🔴", pTour: morpion = "j2" }).write();
        reaction.message.channel.send(`C'est au **JOUEUR 2** de jouer`).then(rep)
    }
    if (reaction.emoji.name === '↘️' && morpion[12] == "j1" && user.id == morpion[10] && morpion[9] == "⚪") {
        db.get("morpion").find("p2").assign({ 9: morpion = "🔴", pTour: morpion = "j2" }).write();
        reaction.message.channel.send(`C'est au **JOUEUR 2** de jouer`).then(rep)
    }



    if (reaction.emoji.name === '↖️' && morpion[12] == "j2" && user.id == morpion[11] && morpion[1] == "⚪") {
        db.get("morpion").find("p2").assign({ 1: morpion = "🟡", pTour: morpion = "j1" }).write();
        reaction.message.channel.send(`C'est au **JOUEUR 1** de jouer`).then(rep)
    }
    if (reaction.emoji.name === '⬆️' && morpion[12] == "j2" && user.id == morpion[11] && morpion[2] == "⚪") {
        db.get("morpion").find("p2").assign({ 2: morpion = "🟡", pTour: morpion = "j1" }).write();
        reaction.message.channel.send(`C'est au **JOUEUR 1** de jouer`).then(rep)
    }
    if (reaction.emoji.name === '↗️' && morpion[12] == "j2" && user.id == morpion[11] && morpion[3] == "⚪") {
        db.get("morpion").find("p2").assign({ 3: morpion = "🟡", pTour: morpion = "j1" }).write();
        reaction.message.channel.send(`C'est au **JOUEUR 1** de jouer`).then(rep)
    }
    if (reaction.emoji.name === '⬅️' && morpion[12] == "j2" && user.id == morpion[11] && morpion[4] == "⚪") {
        db.get("morpion").find("p2").assign({ 4: morpion = "🟡", pTour: morpion = "j1" }).write();
        reaction.message.channel.send(`C'est au **JOUEUR 1** de jouer`).then(rep)
    }
    if (reaction.emoji.name === '⏺️' && morpion[12] == "j2" && user.id == morpion[11] && morpion[5] == "⚪") {
        db.get("morpion").find("p2").assign({ 5: morpion = "🟡", pTour: morpion = "j1" }).write();
        reaction.message.channel.send(`C'est au **JOUEUR 1** de jouer`).then(rep)
    }
    if (reaction.emoji.name === '➡️' && morpion[12] == "j2" && user.id == morpion[11] && morpion[6] == "⚪") {
        db.get("morpion").find("p2").assign({ 6: morpion = "🟡", pTour: morpion = "j1" }).write();
        reaction.message.channel.send(`C'est au **JOUEUR 1** de jouer`).then(rep)
    }
    if (reaction.emoji.name === '↙️' && morpion[12] == "j2" && user.id == morpion[11] && morpion[7] == "⚪") {
        db.get("morpion").find("p2").assign({ 7: morpion = "🟡", pTour: morpion = "j1" }).write();
        reaction.message.channel.send(`C'est au **JOUEUR 1** de jouer`).then(rep)
    }
    if (reaction.emoji.name === '⬇️' && morpion[12] == "j2" && user.id == morpion[11] && morpion[8] == "⚪") {
        db.get("morpion").find("p2").assign({ 8: morpion = "🟡", pTour: morpion = "j1" }).write();
        reaction.message.channel.send(`C'est au **JOUEUR 1** de jouer`).then(rep)
    }
    if (reaction.emoji.name === '↘️' && morpion[12] == "j2" && user.id == morpion[11] && morpion[9] == "⚪") {
        db.get("morpion").find("p2").assign({ 9: morpion = "🟡", pTour: morpion = "j1" }).write();
        reaction.message.channel.send(`C'est au **JOUEUR 1** de jouer`).then(rep)
    }
})
