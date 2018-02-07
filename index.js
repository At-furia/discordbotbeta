
const Discord = require('discord.js');
const low = require('lowdb')
const FileSync = require ('lowdb/adapters/FileSync')
const fs = require("fs");

const adapter = new FileSync('database.json');
const db = low(adapter);

db.defaults({xp: [], sugg: [], story: [], perso: [], lul:[], blagues:[], kill:[]}).write()



var bot = new Discord.Client();
var prefix = ("<");
var randnum = 0;
var storynumber = db.get('blagues').size().value();
var lul = db.get('lul').size().value();
var storynumber = db.get('perso').size().value();
var rlul = db.get('lul').size().value();
var rkill = db.get('kill').size().value();

bot.on('ready', () => {
    bot.user.setPresence({ game: { name: 'SNK - <help', type: 3}})
    console.log("Bot Ready !");

    })


bot.login('NDA0Nzk3OTU4MzIwNTUzOTg1.DU50AA.N-XoQG5wNI9n-lQGDgt9Lv_WlFA');


bot.on("guildMemberAdd", member => {
    let role = member.guild.roles.find("name", "brigade d'entrainement");
    var bienvenue_embed = new Discord.RichEmbed()

    
    .addField(`Présentation`,`
    Vous venez d'integrer le monde de Shingeki No Kyojin - FR,
    nous vous félicitions pour votre intégrations au brigades d'entraînements.
    
    *Vous devez désormais choisir un corps d'armée entre :
    -La Garnison
    -Le Bataillon d'Exploration
    -Les Brigades Spéciales

    SNK-FR vous expliquera le fonctionnement plus bas dans vos messages :ok_hand:

    Soyez poli et courtois, un français correct est demandé au minimum.
    Le respect est de vigueur, les propos rascistes, injure ou autre ne seront pas toléré.`)
    .setFooter( `*Ne vous inquietez pas, la faction c'est juste pour le RP, histoire de s'amuser, vous aurez les même droits sur le 
    serveur quel que soit votre faction.
    Aussi, nous vous demandons de jouer le jeu et de choisir un pseudo de personnage en lien avec SNK`)
    .addBlankField()
    member.sendMessage(bienvenue_embed);

    var bienvenue2_embed = new Discord.RichEmbed()
    .addField(`Présentation de SNK-FR`,`
    Bonjour je me présente : SNK-FR, je suis votre "guide" dans cette ville !
    Nous allons commencer par choisir votre corps d'armée !
    Pour cela il vous suffit de taper <garnison OU <bataillon OU <b-spéciales
    
    Une fois votre corps d'armée choisit, vous avez a disposition plusieurs commandes
    qui vous seront détaillées en tapant <help !
    Il vous sera aussi possible de gagner des titres grâce a des "jeux" !`)
    member.sendMessage(bienvenue2_embed);
    member.addRole(role)
});

    
bot.on('message', message => {

    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;
  
  let guild = message.member.guild;
  let Role = guild.roles.find('name', 'exploration');
  let Roleremovegarnison = guild.roles.find('name', 'garnison');
  let Roleremovespéciale = guild.roles.find('name', 'spéciale');

  
  if(!message.content.startsWith(prefix)) return;
  
  if (message.content.startsWith(prefix + 'exploration') || message.content.startsWith(prefix + 'ex') ) {
    if (message.member.roles.has(Role.id)) {
        message.channel.sendMessage('tu possède déjà ce rôle !');
        console.log(`${message.author.username} possède déjà ce rôle !`);
   }
    else {
    message.member.addRole(Role);
    message.channel.sendMessage("Tu as rejoint le bataillon d'exploration !");
    message.member.removeRole(Roleremovegarnison);
    message.member.removeRole(Roleremovespéciale);
    console.log(`${message.author.username} got a role`);
  };}});

  

  let points = JSON.parse(fs.readFileSync('./points.json', 'utf8'));

  bot.on('message', message => {

    var msgauthor = message.author.username;
    if(message.author.bot) return;
  if(!points[message.author.id]) points[message.author.id] = {points: 0, level: 0};
  let userData = points[message.author.id];
  userData.points++;
  let curLevel = Math.floor(0.1 * Math.sqrt(userData.points));
  if(curLevel > userData.level) {
  // Level up!
  userData.level = curLevel;
  message.reply(`Vous avait passer un niveau **${curLevel}**! ça fait quoi de vieillir?`);
  }
  if(message.content.startsWith(prefix + "level")) {
  message.reply(`Vous êtes actuellement niveau ${userData.level}, avec ${userData.points}
  expériences.`);
  }
  if(!db.get("xp").find({username: msgauthor}).value()){
    db.get("xp").push({username: msgauthor, xp: 1}).write();
}else
  fs.writeFile('./points.json', JSON.stringify(points), (err) => {if(err) console.error(err)});
  });



  bot.on('message', message => {

    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;
  
  let guild = message.member.guild;
  let Role = guild.roles.find('name', 'garnison');
  let Roleremoveexploration = guild.roles.find('name', 'exploration');
  let Roleremovespéciale = guild.roles.find('name', 'spéciale');
  
  if(!message.content.startsWith(prefix)) return;
  
  if (message.content.startsWith(prefix + 'garnison') || message.content.startsWith(prefix + 'ga') ) {
    if (message.member.roles.has(Role.id)) {
        message.channel.sendMessage('tu possède déjà ce rôle !');
        console.log(`${message.author.username} possède déjà ce rôle !`);
   }
    else {
    message.member.addRole(Role);
    message.channel.sendMessage('Tu as rejoint la Garnison !');
    message.member.removeRole(Roleremoveexploration);
    message.member.removeRole(Roleremovespéciale);
    console.log(`${message.author.username} got a role`);
  };}});

  bot.on('message', message => {

    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;
  
  let guild = message.member.guild;
  let Role = guild.roles.find('name', 'spéciale');
  let Roleremoveexploration = guild.roles.find('name', 'exploration');
  let Roleremovegarnison = guild.roles.find('name', 'garnison');
  
  if(!message.content.startsWith(prefix)) return;
  
  if (message.content.startsWith(prefix + 'spéciale') || message.content.startsWith(prefix + 'bs') ) {
    if (message.member.roles.has(Role.id)) {
        message.channel.sendMessage('tu possède déjà ce rôle !');
        console.log(`${message.author.username} possède déjà ce rôle !`);
   }
    else {
    message.member.addRole(Role);
    message.channel.sendMessage('Tu as rejoint la brigade Spéciale !');
    message.member.removeRole(Roleremoveexploration);
    message.member.removeRole(Roleremovegarnison);
    console.log(`${message.author.username} got a role`);
  };}});


bot.on('message', message => {

    var msgauthor = message.author.username;

    if(message.author.bot)return;

    if(!db.get("xp").find({username: msgauthor}).value()){
        db.get("xp").push({username: msgauthor, xp: 1}).write();
    }else{
        var userxpdb = db.get("xp").filter({username: msgauthor}).find('xp').value();
        console.log(userxpdb);
        var userxp = Object.values(userxpdb)
        console.log(userxp);
        console.log(`Nombre d'xp : ${userxp[1]}`)

        db.get("xp").find({username: msgauthor}).assign({username: msgauthor, xp: userxp[1] += 1}).write();

    }

   

   
    
   

    if (!message.content.startsWith(prefix)) return;
    var args = message.content.substring(prefix.length).split(" ");

    switch (args[0].toLowerCase()){


        case "newblague":
        var value = message.content.substr(10);
        var author = message.author.username.toString();
        var number = db.get('blagues').map('id').value();
        console.log(value);
        message.reply("Ajout de la blague a la base de données")

        db.get('blagues')
            .push({ story_value: value, story_author: author})
            .write();
        break;

        case "blagues" :

        story_random();
        console.log(randnum);

        var story = db.get(`blagues[${randnum}].story_value`).toString().value();
        var author_story = db.get(`blagues[${randnum}].story_author`).toString().value();
        console.log(story);

        message.channel.send(`${story} (Blague de ${author_story})`)
        break;

        case "rdm" :

        story_random();
        console.log(randnum);

        var story = db.get(`perso[${randnum}].perso_value`).toString().value();
        console.log(story);

        message.channel.send(`${story}`)

        case "rdm" :

        story_random();
        message.channel.send(`est en train de...`)

        case "rdm" :

        randomlul();
        console.log(randnum);

        var lul = db.get(`lul[${randnum}].lul_value`).toString().value();
        console.log(story);

        message.channel.send(`${lul}`)

        break;


        case "kill" :

            randomkill();

            var titankill = Math.floor(Math.random() * 101);
            var kill = db.get(`kill[${randnum}].kill_value`).toString().value();
            message.reply("a tué " + titankill + " Titans" + `${kill}`)
            
        break;

        case  "kick":

    if (!message.channel.permissionsFor(message.member).hasPermission("KICK_MEMBERS")){
        message.reply("Tu n'as pas le droit de kick ! ;)")
    }else{
        var memberkick = message.mentions.users.first();
        console.log(memberkick)
        console.log(message.guild.member(memberkick).kickable)
        if(!memberkick){
            message.reply("L'utilisateur n'existe pas !");
        }else{
            if(!message.guild.member(memberkick).kickable){
                message.reply("Utilisateur impossible a kick !");
            }else{
                message.guild.member(memberkick).kick().then((member) => {
                message.channel.send(`${member.displayName}a été kick du serveur !`);
            }).catch(() => {
                message.channel.send("Kick Refusé!")
            })
        }
    }}

        break;

        case  "ban":

        if (!message.channel.permissionsFor(message.member).hasPermission("BAN_MEMBERS")){
            message.reply("Tu n'as pas le droit de ban ! ;)")
        }else{
            var memberban = message.mentions.users.first();
            console.log(memberban)
            console.log(message.guild.member(memberban).bannable)
            if(!memberban){
                message.reply("L'utilisateur n'existe pas !");
            }else{
                if(!message.guild.member(memberban).bannable){
                    message.reply("Utilisateur impossible a ban !");
                }else{
                    message.guild.member(memberban).ban().then((member) => {
                    message.channel.send(`${member.displayName}a été ban du serveur !`);
                }).catch(() => {
                    message.channel.send("Ban Refusé!")
                })
            }
        }}

    break;

    case "sugg":

    var value = message.content.substr(6);
        var author = message.author.username.toString();
        var number = db.get('sugg').map('id').value();
        console.log(value);
        message.reply("La suggestion a bien été prise ajoutée dans les demandes !")

        db.get('sugg')
            .push({ story_value: value, story_author: author})
            .write();
        break;

        case "stats" : 

        var userMessageDB = db.get("xp").filter({username: msgauthor}).find("xp").value();
        var userXP = Object.values(userxpdb);
        var stats_embed = new Discord.RichEmbed()
            .setTitle(`Nombre de messages de : ${message.author.username}`)
            .addField("Messages", `${userXP[1]} messages`, true)
            .addField("Nom du membre", msgauthor, true)

            message.channel.send({embed: stats_embed})
    }
    

    if (message.content === prefix + "help"){
    var help_embed = new Discord.RichEmbed()
            .setColor('#D9F200')
            .addField("Fonctionnement des commandes", "Chaque membre possède les commande de son grade sur le discord ainsi que les commandes des grades inférieurs ")
            .addField("Commandes Brigade d'entrainement", "<réseaux Affiche les différents réseaux sociaux de la communauté SNK - FR")
            .addField("Commandes Bataillon d'exploration, Garnison et Brigades Spéciales ", "<sugg Envoyer une suggestion d'amélioration du serveur Discord.\n<stats Voir son nombre de messages sur le serveur. ")
            .addField("Commandes Esquade Livaï", "<admin Affiche les commandes Admin.")
            .setFooter("Crée par Alex_ et Eren Jäger")
        message.channel.sendEmbed(help_embed);
        console.log("Commande Help demandée"); 

    }

    if (message.content.startsWith( prefix + "réseaux") || message.content.startsWith(prefix + "reseau") || message.content.startsWith(prefix + "twitter") || message.content.startsWith(prefix + "rs")){
        var réseaux_embed = new Discord.RichEmbed()
                .setColor('#D9F200')
                .setTimestamp()
                .addField("Site", "En construction")
                .setDescription("Nos réseaux sociaux !","https://vignette.wikia.nocookie.net/shingekinokyojin/images/2/2e/Eren_anime_character_image.png")
                .setThumbnail("http://i.imgur.com/p2qNFag.png")
                .setURL("https://discord.js.org/#/docs/main/indev/class/RichEmbed")
                .addField("Twitter", "https://twitter.com/FR_SNK")
                .addField("Facebook", "https://www.facebook.com/Shingeki-no-kyojin-3-147624222254357/ \nhttps://www.facebook.com/SNKFrance/")
                .addField("Youtube", "https://www.youtube.com/channel/UCKzU9176ms-0z6Kmjpz2Onw")
                .addField("Partenaires", "https://twitter.com/BlaBla_Manga \nhttps://www.youtube.com/channel/UCMj7bG6yzvJAn1rfGN-kE9g")
                .setFooter("Crée par Alex_ et Eren Jäger","https://vignette.wikia.nocookie.net/shingekinokyojin/images/2/2e/Eren_anime_character_image.png")
            message.channel.sendEmbed(réseaux_embed);
            console.log("Commande réseaux demandée"); 
    
        }

        if (message.content === prefix + "admin"){
            if(!message.member.roles.some(r=>["Escuade Livaï","test"].includes(r.name)) )
            return message.reply("Vous n'êtes pas assez gradé pour utiliser cette commande !");
            
            var admin_embed = new Discord.RichEmbed()
                    .setColor('#D9F200')
                    .addField("Commandes Modération", "/kick @PseudoDuMembre\n/ban @PseudoDuMembre")
                    .setFooter("Crée par Alex_ et Eren Jäger")
                message.author.sendMessage(admin_embed);
                console.log("Commande Admin demandée"); 
        
        
    }

    if (message.content === prefix + "maj"){        
        var maj_embed = new Discord.RichEmbed()
                .setColor('#D2F200')
                .addField("Mise à jour","Serveur de test")
                .addField(":tools: Commandes ajoutées :tools: ", "31/01/2018 10:00")
                .addField("<rdm", "Ajout de la commande <rdm qui donne un personnage + un evenement aléatoire :x:")               
                .addField("Etat des commandes", ":punch: = pas encore sur le discord SNK.\n:ok_hand:  =  Ok sur le discord SNK.\n:x: = Ne marche pas correctement.")
                .setFooter("Crée par Alex_")
            message.author.sendMessage(maj_embed);
            console.log("Commande maj demandée"); 
    
    
}
if (message.content === prefix + "majp"){        
    var majp_embed = new Discord.RichEmbed()
            .setColor('#D2F200')
            .addField("Mise à jour","Serveur de test")
            .addField(":tools: Commandes ajoutées :tools: ", "31/01/2018 10:00")
            .addField("Message de bienvenue", "Amélioration du message de bienvenue lorsqu'un nouveau membre arrive sur le serveur :ok_hand: ")
            .addField("Weebhooks", "Création d'un Weebhooks qui poste automatiquement les vidéos Youtube. :punch:")
            .addField("<pfc", "Ajout de la commande <pfc qui est totalement inutile mais j'avais envie, c'est pour un pierre feuille ciseau ! :x:")
            .addField("<pf", "Ajout de la commande <pf qui est totalement inutile mais j'avais envie, c'est pour un pile ou face ! :x:")  
            .addField("Etat des commandes", ":punch: = pas encore sur le discord SNK.\n:ok_hand:  =  Ok sur le discord SNK.\n:x: = Ne marche pas correctement.")
            .setFooter("Crée par Alex_")
            message.channel.sendEmbed(majp_embed);
        console.log("Commande majp demandée"); 
}
           

    

    if (message.content === prefix + "msgstat"){
        var xp = db.get("xp").filter({username: msgauthor}).find('xp').value()
        var xpfinal = Object.values(xp);
        var xp_embed = new Discord.RichEmbed()
            .addField("Nombre de messages postés sur le Discord :", `${message.author.username} : ${xpfinal[1]} messages` )
        message.channel.send({embed: xp_embed});
        
    }

    if (message.content === prefix + "pf"){
        random_pf();
           
            if (randnum == 1){
                message.reply("face");
                console.log(randnum);
            }

            if (randnum == 0){
                message.reply("pile");
                console.log(randnum);
}}






});


function story_random(min, max) {
    min =Math.ceil(0);
    max = Math.floor(storynumber);
    randnum = Math.floor(Math.random() * (max - min) + min);
}


function random(min, max) {
    min = Math.ceil(0);
    max = Math.floor(2);
    randnum = Math.floor(Math.random() * (max - min +1) + min);

}

function random_pf(min, max) {
    min = Math.ceil(0);
    max = Math.floor(1);
    randnum = Math.floor(Math.random() * (max - min +1) + min);

}
function randomperso(min, max) {
    min = Math.ceil(0);
    max = Math.floor(11);
    randnum = Math.floor(Math.random() * (max - min +1) + min);

}
function randomlul(min, max) {
    min = Math.ceil(0);
    max = Math.floor(rlul);
    randnum = Math.floor(Math.random() * (max - min) + min);

}

function randomkill(min, max) {
    min = Math.ceil(0);
    max = Math.floor(rkill);
    randnum = Math.floor(Math.random() * (max - min) + min);

}


    

    var number_random = 0;

var party_launch = false;

bot.on('message', function(message){
    if(message.content == prefix + "chasse start"){

        message.reply("Chasse lancée ! :telescope: Je vois des Titans au loin, essaye de les compter ! tu as juste me dire combien tu vois et je te dirais si j'en vois autant ou pas ");
        

        party_launch = true;

        number_random = Math.floor(Math.random() * (500 - 0) + 0)

        console.log(number_random);

    }
        if(party_launch && message.content != null){

            if(Number.isInteger(parseInt(message.content))){
    

            
            if(message.content > number_random){

                message.reply("Il y'a moins de Titans !")
            }
            else if (message.content < number_random){

                message.reply("Il y'a plus de Titans !")
            }
            else if (message.content = number_random + "/"){

                message.reply()
            }else{

                message.reply('à trouvé le bon nombre de Titans !');
                party_launch = false;
            }
        }
        
    }

    if(message.content == prefix + "chasse stop"){

        if(party_launch = true){

            message.reply("Les Titans sont partis...")

            party_launch = false;

        }else{

            message.reply("Il n'y a pas de Titans dans les environs")
        }

    }
})



