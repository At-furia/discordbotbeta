const Discord = require('discord.js');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const fs = require("fs");
require('events').EventEmitter.prototype._maxListeners = 250;
require('events').EventEmitter.defaultMaxListeners = 250;


const adapter = new FileSync('database.json');
const db = low(adapter);
var cartes = db.get('cartes').size().value();

db.defaults({ game: [], gamep: [], chasse: [], playergame: [], money: [], lvl: [], xp: [], pt: [1], pendu: [], devine: [] }).write()

var prefix = "<"
var bot = new Discord.Client();
var randnum = 0;

bot.on('ready', () => {
    bot.user.setPresence({ game: { name: 'Malik ton café', type: 3 } });
    bot.user.setStatus("idle");
    console.log("Bot Ready !");

})

bot.login(process.env.TOKEN);


// bot.on('message', message => {

//     const valeurcartes = ["0",
//     "0b","1b","2b","3b","4b","5b","6b","7b","8b","9b",
//     "0v","1v","2v","3v","4v","5v","6v","7v","8v","9v",
//     "0j","1j","2j","3j","4j","5j","6j","7j","8j","9j",
//     "0r","1r","2r","3r","4r","5r","6r","7r","8r","9r",
//     "return","+2","interdiction","+4","joker"]
//     if (message.author.bot) return;
//     if (message.channel.type === 'dm') return;

//     random = Math.ceil(Math.random() * 41);
//     random1 = Math.ceil(Math.random() * 41);
//     random2 = Math.ceil(Math.random() * 41);
//     random3 = Math.ceil(Math.random() * 41);
//     random4 = Math.ceil(Math.random() * 41);
//     random5 = Math.ceil(Math.random() * 41);
//     random6 = Math.ceil(Math.random() * 41);

//     var cartesaleatoire = valeurcartes[random];
//     var cartesaleatoire1 = valeurcartes[random1];
//     var cartesaleatoire2 = valeurcartes[random2];
//     var cartesaleatoire3 = valeurcartes[random3];
//     var cartesaleatoire4 = valeurcartes[random4];
//     var cartesaleatoire5 = valeurcartes[random5];
//     var cartesaleatoire6 = valeurcartes[random6];

//     if (message.content == prefix + "tirer") {
//         // message.reply(`${cartesaleatoire} ` + `${cartesaleatoire1} `  + `${cartesaleatoire2} ` + `${cartesaleatoire3} ` + `${cartesaleatoire4} ` + `${cartesaleatoire5} ` + `${cartesaleatoire6} `)
//         if(!db.get("cartes").find({cartes: valeurcartes}).value()){
//             db.get("cartes").push({cartes: valeurcartes}).write();   
//     }
//         db.get("cartes").push({ cartes: valeurcartes[1]}).write();
// }
// })


bot.on('message', message => {

    if (message.author.bot) return;
    var msgauthor = message.author.username;
    var msgauthorid = message.author.id;
    var vieedb = db.get("game").filter({ game1: "ok" }).find('player2').value();
    var viee = Object.values(vieedb)

    if (message.content == prefix + "?") {
        var r_embed = new Discord.RichEmbed()
            .setTitle("Règles/fonctionnement du jeu")
            .setDescription("Le jeu nécessite 2 joueurs, il est basé sur de la chance et un peu de stratégie.")
            .addField("Début du jeu", "Les deux joueurs doivent faire <p1 ou <p2")
            .addField("Tirage des cartes", "Les deux joueurs doivent faire la commande <tirer pour recevoir leurs tirages en mp")
            .addField("Vote", "Les deux joueurs doivent voter avec <win ou <loose EN MP AVEC LE BOT si vous pensez gagner ou perdre avec vos tirages (si vous pronostiquez bien, vous gagner des points, si non, vous en perdez)")
            .addField("Fin de la partie", "Un des deux joueurs doit faire <result SUR LE CANAL GENERAL pour voir le résultat de la partie")
            .addField("Statistiques", "Faire la commande <stat pour voir ses stats, ou <stat +mention pour voir les stats d'un membre précis")
        message.channel.send({ embed: r_embed });

    }
    if (message.content == prefix + "p1") {
        if (message.channel.type === 'dm') return;

        if (!db.get("gamep").find({ id: msgauthorid }).value()) {
            db.get("gamep").push({ username: msgauthor, points: 1501, victoires: 1, défaites: 1, total: 1, id: msgauthorid, egalite: 1 }).write();
        }
        var pointsdb = db.get("gamep").filter({ id: msgauthorid }).find('points').value()
        var points = Object.values(pointsdb);
        db.get("gamep").find({ id: msgauthorid }).assign({ id: msgauthorid, points: points[1] += 0 }).write();
        if (viee[2] == 1) {
            if (viee[3] == msgauthor) {
                message.reply("Vous ne pouvez pas jouer contre vous même..")
            } else {
                message.reply("Participation validée")
                db.get("game").find({ game1: "ok" }).assign({ player1: viee[1] = msgauthor, player1ok: viee[2] = 2, player1id: viee[18] = msgauthorid }).write();

                if (viee[4] == 2) {
                    var points1db = db.get("gamep").filter({ id: viee[18] }).find(`points`).value();
                    var points1 = Object.values(points1db)
                    var points2db = db.get("gamep").filter({ id: viee[19] }).find(`points`).value();
                    var points2 = Object.values(points2db)
                    var percent1 = Math.floor(100 * `${points1[2] -= 1}` / `${points1[4] -= 1}`) + '%';
                    var percent2 = Math.floor(100 * `${points2[2] -= 1}` / `${points2[4] -= 1}`) + '%';
                    var xp_embed = new Discord.RichEmbed()
                        .setColor("#590599")
                        .setTitle("●▬▬▬▬๑۩★۩๑▬▬▬▬● Bᴀᴛᴀɪʟʟᴇ Tɪᴛᴀɴᴇsϙᴜᴇ ●▬▬▬▬๑۩★۩๑▬▬▬▬●")
                        .addField(`Joueur 1 (${viee[1]}) :`, `◄[🥇]► Victoires : ${points1[2]}\n◄[🥈]► Défaites : ${points1[3] += -1}\n◄[󠀽🤔]► Egalités : ${points1[6] += -1}\n◄[🏆]► Points cumulés : ${points1[1] += -1}\n◄[⚔️]► Nombre de parties jouées : ${points1[4]}\n◄[⚖️]► ${percent1} de victoires`)
                        .addField(`Joueur 2 (${viee[3]}) :`, `◄[🥇]► Victoires : ${points2[2]}\n◄[🥈]► Défaites : ${points2[3] += -1}\n◄[󠀽🤔]► Egalités : ${points2[6] += -1}\n◄[🏆]► Points cumulés : ${points2[1] += -1}\n◄[⚔️]► Nombre de parties jouées : ${points2[4]}\n◄[⚖️]► ${percent2} de victoires`)
                        .setFooter("★━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━★")

                    message.channel.send({ embed: xp_embed });
                    db.get("game").find({ game1: "ok" }).assign({ gamego: viee[5] = "tirage" }).write();
                    message.reply("La partie commence !\nTirez 2 cartes ! (<tirer)")
                }
            }
        }
    }
    if (message.content == prefix + "p2") {
        if (message.channel.type === 'dm') return;

        if (!db.get("gamep").find({ id: msgauthorid }).value()) {
            db.get("gamep").push({ username: msgauthor, points: 1501, victoires: 1, défaites: 1, total: 1, id: msgauthorid, egalite: 1 }).write();
        }
        if (viee[4] == 1) {
            if (viee[1] == msgauthor) {
                message.reply("Vous ne pouvez pas jouer contre vous même..")
            } else {
                message.reply("Participation validée")

                db.get("game").find({ game1: "ok" }).assign({ player2ok: viee[4] = 2, player2: viee[3] = msgauthor, player2id: viee[19] = msgauthorid }).write();

                if (viee[2] == 2) {
                    var points1db = db.get("gamep").filter({ id: viee[18] }).find(`points`).value();
                    var points1 = Object.values(points1db)
                    var points2db = db.get("gamep").filter({ id: viee[19] }).find(`points`).value();
                    var points2 = Object.values(points2db)
                    var percent1 = Math.floor(100 * `${points1[2] -= 1}` / `${points1[4] -= 1}`) + '%';
                    var percent2 = Math.floor(100 * `${points2[2] -= 1}` / `${points2[4] -= 1}`) + '%';
                    var xp_embed = new Discord.RichEmbed()
                        .setColor("#590599")
                        .setTitle("●▬▬▬▬๑۩★۩๑▬▬▬▬● Bᴀᴛᴀɪʟʟᴇ Tɪᴛᴀɴᴇsϙᴜᴇ ●▬▬▬▬๑۩★۩๑▬▬▬▬●")
                        .addField(`Joueur 1 (${viee[1]}) :`, `◄[🥇]► Victoires : ${points1[2]}\n◄[🥈]► Défaites : ${points1[3] += -1}\n◄[󠀽🤔]► Egalités : ${points1[6] += -1}\n◄[🏆]► Points cumulés : ${points1[1] += -1}\n◄[⚔️]► Nombre de parties jouées : ${points1[4]}\n◄[⚖️]► ${percent1} de victoires`)
                        .addField(`Joueur 2 (${viee[3]}) :`, `◄[🥇]► Victoires : ${points2[2]}\n◄[🥈]► Défaites : ${points2[3] += -1}\n◄[🤔]► Egalités : ${points2[6] += -1}\n◄[🏆]► Points cumulés : ${points2[1] += -1}\n◄[⚔️]► Nombre de parties jouées : ${points2[4]}\n◄[⚖️]► ${percent2} de victoires`)
                        .setFooter("★━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━★")
                    message.channel.send({ embed: xp_embed });
                    db.get("game").find({ game1: "ok" }).assign({ gamego: viee[5] = "tirage" }).write();
                    message.channel.send("La partie commence !\nTirez 2 cartes ! (<tirer)")
                }
            }
        }
    }

    var valeurcartes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    random = Math.ceil(Math.random() * 9);
    randome = Math.ceil(Math.random() * 9);
    var cartesaleatoire = valeurcartes[random];
    var cartesaleatoired = valeurcartes[randome];
    //var bonus = ["", "patates 🥔", "pains 🥖", "barres de survie 🍫", "bouteilles de champagne 🍾", "badges du Bataillon d'Exploration " + bot.emojis.find("name", "bataillon"), "badges des Brigades Spéciales " + bot.emojis.find("name", "brigadespeciale"), "badges de la Garnison " + bot.emojis.find("name", "garnison")]
    randomb = Math.ceil(Math.random() * 7);
    randombe = Math.ceil(Math.random() * 7);

    //var bonusrandom = bonus[randomb];
    //var bonusrandome = bonus[randombe];

    var tirageobjet = new Discord.RichEmbed()
        .setTitle("◄[⏳]► Recherche en cours ! ◄[⌛]►")
        //.setDescription("Comptage des objets en cours !")
        //.addField("◄[🔎]► Objets trouvés :", `${cartesaleatoire} ${bonusrandome}\n${cartesaleatoired} ${bonusrandom}`)
        .setDescription("Tirage des cartes en cours !")
        .addField("◄[🔎]► Cartes tirées :", `${cartesaleatoire} \n${cartesaleatoired} `)
        .setFooter("★━━━━━━━━━━━━━━━━━━━━★")


    if (message.content == prefix + "tirer") {
        if (viee[5] == "tirage") {
            if (viee[1] == `${message.author.username}`) {
                if (viee[2] == 2) {

                    message.reply("Tirage effectué en mp !")
                    db.get("game").find({ game1: "ok" }).assign({ player1ok: viee[2] = "vote" }).write();
                    message.author.send(tirageobjet);
                    db.get("game").find({ game1: "ok" }).assign({ player1carte1: viee[8] = cartesaleatoire, player1carte2: viee[9] = cartesaleatoired }).write();
                    db.get("game").find({ game1: "ok" }).assign({ player1total: viee[12] = cartesaleatoire + cartesaleatoired }).write();
                    message.author.send("En attente du joueur 2")
                    if (viee[4] == "vote") {
                        db.get("game").find({ game1: "ok" }).assign({ gamego: viee[5] = "vote" }).write();
                        message.channel.send("Faite votre pronostic en MESSAGE PRIVE avec le bot ! (<win si vous pensez gagner et <lose si vous pensez perdre.)")
                    }
                }
            }
            if (viee[3] == `${message.author.username}`) {
                if (viee[4] == 2) {

                    message.reply("Tirage effectué en mp !")
                    db.get("game").find({ game1: "ok" }).assign({ player2ok: viee[4] = "vote" }).write();
                    message.author.send(tirageobjet);
                    db.get("game").find({ game1: "ok" }).assign({ player2carte1: viee[10] = cartesaleatoire, player2carte2: viee[11] = cartesaleatoired }).write();
                    db.get("game").find({ game1: "ok" }).assign({ player2total: viee[13] = cartesaleatoire + cartesaleatoired }).write();
                    message.author.send("En attente du joueur 1")
                    if (viee[2] == "vote") {
                        db.get("game").find({ game1: "ok" }).assign({ gamego: viee[5] = "vote" }).write();
                        message.channel.send("Faite votre pronostic en MESSAGE PRIVE avec le bot ! (<win si vous pensez gagner et <lose si vous pensez perdre.)")
                    }
                }
            }
        }
    }



    var result = new Discord.RichEmbed()
        .setColor("#590599")
        .setTitle("◄[🏆]► Tableau des scores ◄[🥇]► ◄[🥈]►")
        .addField(`Joueur 1 (${viee[1]}) :`, ` ${viee[8]} + ${viee[9]} = ${viee[12]} points`)
        .addField(`Joueur 2 (${viee[3]}) :`, ` ${viee[10]} + ${viee[11]} = ${viee[13]} points`)
        .setFooter("★━━━━━━━━━━━━━━━━━━━━━━━━━━━★")
        .setDescription(`${viee[14]} gagne la partie et gagne les ${viee[15]} points !`)

    if (message.content == prefix + "win" || message.content == prefix + "w") {
        if (message.channel.type === 'dm') {
            if (viee[12] > viee[13]) {
                db.get("game").find({ game1: "ok" }).assign({ playerwin: viee[14] = viee[1], playerwinid: viee[20] = viee[18] }).write();
                db.get("game").find({ game1: "ok" }).assign({ playerloose: viee[16] = viee[3], playerlooseid: viee[21] = viee[19] }).write();
                db.get("game").find({ game1: "ok" }).assign({ winner: viee[15] = viee[8] + viee[9] }).write();
                db.get("game").find({ game1: "ok" }).assign({ looser: viee[17] = viee[10] + viee[11] }).write();
            }
            if (viee[12] < viee[13]) {
                db.get("game").find({ game1: "ok" }).assign({ playerwin: viee[14] = viee[3], playerwinid: viee[20] = viee[19] }).write();
                db.get("game").find({ game1: "ok" }).assign({ playerloose: viee[16] = viee[1], playerlooseid: viee[21] = viee[18] }).write();
                db.get("game").find({ game1: "ok" }).assign({ winner: viee[15] = viee[10] + viee[11] }).write();
                db.get("game").find({ game1: "ok" }).assign({ looser: viee[17] = viee[8] + viee[9] }).write();
            }
            if (viee[12] == viee[13]) {
                db.get("game").find({ game1: "ok" }).assign({ playerwin: viee[14] = "Égalité ! Personne ne ", winner: viee[15] = viee[10] + viee[11] }).write();
            }
            if (viee[5] == "vote") {

                if (viee[1] == `${message.author.username}`) {
                    if (viee[6] == "nop") {
                        message.reply("Vote validé !")
                        db.get("game").find({ game1: "ok" }).assign({ player1vote: viee[6] = "win" }).write();
                        if (viee[7] == "win" || viee[7] == "loose") {

                            bot.channels.get("631878952767717377").send("Les 2 joueurs ont voté, les résultats sont disponible avec la commande <result")

                        }
                    }
                }
                if (viee[3] == `${message.author.username}`) {
                    if (viee[7] == "nop") {
                        message.reply("Vote validé !")
                        db.get("game").find({ game1: "ok" }).assign({ player2vote: viee[7] = "win" }).write();
                        if (viee[6] == "win" || viee[6] == "loose") {

                            bot.channels.get("631878952767717377").send("Les 2 joueurs ont voté, les résultats sont disponible avec la commande <result")

                        }
                    }
                }
            }
        }
    }
    if (message.content == prefix + "loose" || message.content == prefix + "lose" || message.content == prefix + "l") {
        if (message.channel.type === 'dm') {
            if (viee[12] > viee[13]) {
                db.get("game").find({ game1: "ok" }).assign({ playerwin: viee[14] = viee[1], playerwinid: viee[20] = viee[18] }).write();
                db.get("game").find({ game1: "ok" }).assign({ playerloose: viee[16] = viee[3], playerlooseid: viee[21] = viee[19] }).write();
                db.get("game").find({ game1: "ok" }).assign({ winner: viee[15] = viee[8] + viee[9] }).write();
                db.get("game").find({ game1: "ok" }).assign({ looser: viee[17] = viee[10] + viee[11] }).write();
            }
            if (viee[12] < viee[13]) {
                db.get("game").find({ game1: "ok" }).assign({ playerwin: viee[14] = viee[3], playerwinid: viee[20] = viee[19] }).write();
                db.get("game").find({ game1: "ok" }).assign({ playerloose: viee[16] = viee[1], playerlooseid: viee[21] = viee[18] }).write();
                db.get("game").find({ game1: "ok" }).assign({ winner: viee[15] = viee[10] + viee[11] }).write();
                db.get("game").find({ game1: "ok" }).assign({ looser: viee[17] = viee[8] + viee[9] }).write();
            }
            if (viee[12] == viee[13]) {
                db.get("game").find({ game1: "ok" }).assign({ playerwin: viee[14] = "Égalité ! Personne ne " }).write();
            }
            if (viee[5] == "vote") {
                if (viee[1] == `${message.author.username}`) {
                    if (viee[6] == "nop") {
                        message.reply("Vote validé !")
                        db.get("game").find({ game1: "ok" }).assign({ player1vote: viee[6] = "loose" }).write();
                        if (viee[7] == "win" || viee[7] == "loose") {
                            //  message.channel.send("Les résultats sont disponible avec la commande <result")
                            bot.channels.get("631878952767717377").send("Les 2 joueurs ont voté, les résultats sont disponible avec la commande <result")
                        }
                    }
                }
                if (viee[3] == `${message.author.username}`) {
                    if (viee[7] == "nop") {
                        message.reply("Vote validé !")
                        db.get("game").find({ game1: "ok" }).assign({ player2vote: viee[7] = "loose" }).write();
                        if (viee[6] == "win" || viee[6] == "loose") {
                            bot.channels.get("631878952767717377").send("Les 2 joueurs ont voté, les résultats sont disponible avec la commande <result")


                        }
                    }
                }
            }
        }
    }
    if (message.content == prefix + "result") {
        if (message.channel.type === 'dm') return;

        var userpldb = db.get("gamep").filter({ id: viee[21] }).find(`points`).value();
        var userpl = Object.values(userpldb)
        var userpdb = db.get("gamep").filter({ id: viee[20] }).find(`points`).value();
        var userp = Object.values(userpdb)
        if (viee[6] && viee[7] != "nop") {

            if (viee[12] === viee[13]) {
                db.get("gamep").find({ id: viee[20] }).assign({ egalite: userp[6] += 1, total: userp[4] += 1 }).write();
                db.get("gamep").find({ id: viee[21] }).assign({ egalite: userpl[6] += 1, total: userpl[4] += 1 }).write();
            }
            if (viee[12] < viee[13] || viee[12] > viee[13]) {

                db.get("gamep").find({ id: viee[20] }).assign({ id: viee[20], points: userp[1] += viee[15], victoires: userp[2] += 1, total: userp[4] += 1 }).write();
                db.get("gamep").find({ id: viee[21] }).assign({ id: viee[21], défaites: userpl[3] += 1, total: userpl[4] += 1, points: userpl[1] -= viee[17] }).write();

                if (viee[14] == viee[1]) { // vérifie si le joueur 1 gagne la partie
                    if (viee[6] == "win") { // 
                        db.get("gamep").find({ id: viee[20] }).assign({ points: userp[1] += 7 }).write();
                    }
                    if (viee[6] == "loose") { // perd des points si il gagne mais vote qu'il perd
                        db.get("gamep").find({ id: viee[20] }).assign({ points: userp[1] -= 3 }).write();
                    }
                }
                if (viee[16] == viee[1]) { // vérifie si le joueur 1 perd  la partie
                    if (viee[6] == "win") { // mauvais vote + perd
                        db.get("gamep").find({ id: viee[21] }).assign({ points: userpl[1] -= 7 }).write();
                    }
                    if (viee[6] == "loose") { // bon vote mais perd
                        db.get("gamep").find({ id: viee[21] }).assign({ points: userpl[1] += 3 }).write();
                    }
                }
                if (viee[14] == viee[3]) { // vérifie si le joueur 2 gagne la partie
                    if (viee[7] == "win") { // 
                        db.get("gamep").find({ id: viee[20] }).assign({ points: userp[1] += 7 }).write();
                    }
                    if (viee[7] == "loose") { // perd des points si il gagne mais vote qu'il perd
                        db.get("gamep").find({ id: viee[20] }).assign({ points: userp[1] -= 3 }).write();
                    }
                }
                if (viee[16] == viee[3]) { // vérifie si le joueur 2 perd  la partie
                    if (viee[7] == "win") { // mauvais vote + perd
                        db.get("gamep").find({ id: viee[21] }).assign({ points: userpl[1] -= 7 }).write();
                    }
                    if (viee[7] == "loose") { // bon vote mais perd
                        db.get("gamep").find({ id: viee[21] }).assign({ points: userpl[1] += 3 }).write();
                    }
                }
            }
            message.channel.send({ embed: result });
            db.get("game").find({ game1: "ok" }).assign({
                player1ok: viee[2] = 1,
                player2ok: viee[4] = 1,
                gamego: viee[5] = 1,
                player1vote: viee[6] = "nop",
                player2vote: viee[7] = "nop",
                player1: viee[1] = "fdgvd",
                player2: viee[3] = "frfd"
            }).write();
        }
    }
    if (message.content === prefix + "stat") {
        if (!db.get("gamep").find({ id: msgauthorid }).value()) {
            db.get("gamep").push({ username: msgauthor, points: 1501, victoires: 1, défaites: 1, total: 1, id: msgauthorid, egalite: 1 }).write();
        }
        var pointsdb = db.get("gamep").filter({ id: msgauthorid }).find('points').value()
        var points = Object.values(pointsdb);
        db.get("gamep").find({ id: msgauthorid }).assign({ username: msgauthor, points: points[1] += 0 }).write();
        var percent = Math.floor(100 * `${points[2] -= 1}` / `${points[4] -= 1}`) + '%';
        var xp_embed = new Discord.RichEmbed()
            .setColor("#590599")
            .setTitle("☆-—————STATISTIQUES—————-☆")
            .addField(`${message.author.username} :`, `◄[🏆]► Points : ${points[1] += -1}\n◄[🥇]► Victoires : ${points[2]}\n◄[🥈]► Défaites : ${points[3] -= 1}\n◄[🤔]► Egalités : ${points[6] -= 1}\n◄[⚔️]► Nombre de parties jouées : ${points[4]}\n◄[⚖️]► ${percent} de victoires`)
            .setFooter("★━━━━━━━━━━━━━━━━━━━★")
        message.channel.send({ embed: xp_embed });
    }


    if (message.content === "test") {

        const ayy = bot.emojis.find("name", "nazig");
        message.reply(`${ayy}`);

    }
    let pUser = message.mentions.users.first()

    if (message.content.startsWith(prefix + "stat")) {
        if (!pUser) {
        }
        else {
            if (!db.get("gamep").find({ id: pUser.id }).value()) {
                db.get("gamep").push({ username: pUser.username, points: 1501, victoires: 1, défaites: 1, total: 1, id: pUser.id, egalite: 1 }).write();
            }
            var pointsusedb = db.get("gamep").filter({ id: pUser.id }).find('points').value()
            var pointsuser = Object.values(pointsusedb);
            db.get("gamep").find({ id: pUser }).assign({ username: pUser, points: pointsuser[1] += 0 }).write();
            var percent = Math.floor(100 * `${pointsuser[2] -= 1}` / `${pointsuser[4] -= 1}`) + '%';
            var xp_embeduser = new Discord.RichEmbed()
                .setColor("#590599")
                .setTitle("☆-—————STATISTIQUES—————-☆")
                .addField(`${pUser.username} :`, `◄[🏆]► Points : ${pointsuser[1] += -1}\n◄[🥇]► Victoires : ${pointsuser[2]}\n◄[🥈]► Défaites : ${pointsuser[3] -= 1}\n◄[🤔]► Egalités : ${pointsuser[6] -= 1}\n◄[⚔️]► Nombre de parties jouées : ${pointsuser[4]}\n◄[⚖️]► ${percent} de victoires`)
                .setFooter("★━━━━━━━━━━━━━━━━━━━★")
            message.channel.send({ embed: xp_embeduser });
        }
    }

if (message.content = prefix + "resetalex") {
    db.get("game").find({ game1: "ok" }).assign({
        player1ok: viee[2] = 1,
        player2ok: viee[4] = 1,
        gamego: viee[5] = 1,
        player1vote: viee[6] = "nop",
        player2vote: viee[7] = "nop",
        player1: viee[1] = "fdgvd",
        player2: viee[3] = "frfd"
    }).write();
}
    // let sald = message.guild.channels.find(channels => channels.name ===  "test");
    // if (message.channel === sald) { 

    //  if(message.content.startsWith("")){
    // bot.channels.get("631878952767717377").send(message.content.slice(0, message.content.length));
    //  }
    // }
})


bot.on('guildMemberAdd', member => {
    let oui = member.guild.roles.find(role => role.name === "Oui");

    var bienvenue_embed = new Discord.RichEmbed()
        .addField("Discord Bot Alex", "BIENVENUE SUR CE SERVEUR DE MALADE WAOUUUH")
        .setFooter("Je vous aime bien, sauf si vous vous appelez Victor")
    member.sendMessage(bienvenue_embed);

    member.addRole(oui);
})


bot.on('message', function (message) {
    if (message.channel.type === 'dm') return;
    if (message.author.bot) return;
    var chassedb = db.get("chasse").find('nombre').value()
    var nombre = Object.values(chassedb);
    let chs = message.guild.channels.find(channels => channels.name === "plus-ou-moins");
    if (message.channel === chs) {
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
    }
})
