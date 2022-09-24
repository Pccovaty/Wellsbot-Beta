const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const fs = require("fs");
const moment = require('moment');
const bot = new Discord.Client({disableEveryone: true});
moment.locale('PL');
bot.commands = new Discord.Collection();
bot.mutes = [];

var coins = require("./coins.json");
var messages = require("./messages.json");








fs.readdir("./komendy/", (err, files) => {

  if (err) console.log(err);
  const jsfile = files.filter(f => f.split(".").pop() === "js");
  if (jsfile.length <= 0) {
    console.log("Nie znaleziono komendy");
    return;
  }

  jsfile.forEach((f, i) => {
    const props = require(`./komendy/${f}`);
    console.log(`${f} loaded!`);
    bot.commands.set(props.help.name, props);
  });
});

bot.on("message", async message => {
  if (message.content === "<@500362006751084595>") {
    return message.channel.send("<:Info:484996951515856906> | mój prefix to ``b<``.");
  }

});

bot.on("ready", async() => {
      setInterval(async () => {
    const statuslist = [
      `BOT by Kociak#6365`,
      `Użyj b<help`,
      `Dzisiaj jest ${moment().format('DD.MM.YYYY')}r`,
      `Bot aktualnie w Budowie`,
      `60% Complete!`,
      ``
    ];
    const random = Math.floor(Math.random() * statuslist.length);

    try {
      await bot.user.setPresence({
        game: {
          name: `${statuslist[random]}`,
          type: "WATCHING"
          //url: 'https://www.twitch.tv/spokloo'
        },
        status: "dnd"
      });
    } catch (error) {
      console.error(error);
    }
  }, 10000);

 });
 bot.on("message", async message => {

  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  const prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));
  if (!prefixes[message.guild.id]) {
    prefixes[message.guild.id] = {
      prefixes: botconfig.prefix
    };
  
  }
  if (!coins[message.author.id]) {
    coins[message.author.id] = {
      coins: 0
    };
  }
  if (!messages[message.author.id]) {
    messages[message.author.id] = {
      messages: 0 
    };
  }

  const coinAmt = Math.floor(Math.random(5)) + 5;
  const baseAmt = Math.floor(Math.random(5)) + 5;
  console.log(`${coinAmt} ; ${baseAmt}`);

  if (coinAmt === baseAmt) {
    coins[message.author.id] = {
      coins: coins[message.author.id].coins + coinAmt
    };
    fs.writeFile("coins.json", JSON.stringify(coins), (err) => {
      if (err) console.log(err);
    });

  }
  //messages
  {
messages[message.author.id] = {
  messages: messages[message.author.id].messages + 1
};
fs.writeFile("messages.json", JSON.stringify(messages), (err) => {
  if (err) console.log(err);
});
  }
  const prefix = prefixes[message.guild.id].prefixes;

  const messageArray = message.content.split(" ");
  const cmd = messageArray[0];
  const args = messageArray.slice(1);
  if(cmd.substring(0, prefix.length) != prefix){
    return;
  }
  const commandfile = bot.commands.get(cmd.slice(prefix.length));	
  if (commandfile) commandfile.run(bot, message, args);

});

bot.login(process.env.BOT_TOKEN);
