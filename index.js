const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');

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