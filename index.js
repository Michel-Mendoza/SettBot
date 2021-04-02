const Discord = require('discord.js');
const MeowDB = require('meowdb');
const client = new Discord.Client();
const fs = require('fs');

const database = new MeowDB({
    dir: __dirname,
    name: 'database'
}); 
client.database = database
client.functions = require('../functions.js');

const events = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of events) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	};
};

const token = process.env.TOKEN
client.login(token);