const Discord = require('discord.js');
const fs = require('fs');
const prefix = 's.';

const cmds = new Discord.Collection();
const comandos = fs.readdirSync('./cmds').filter(file => file.endsWith('.js'));

for (const file of comandos) {
	const command = require(`../cmds/${file}`);
	cmds.set(command.name, command);
};

module.exports = {
	name: 'message',
	async execute(message, client) {
        if (message.author.bot) return;
        if (!message.content.startsWith(prefix)) return;

        const database = client.database
        database.create(`${message.author.id}`, {
            locale: 'English',
            verified: false,
            summoner: null,
            region: null
        });

        const userdata = database.get(`${message.author.id}`)
        const errormessage = {
            English: 'an internal error ocurred while running the command. Try again later.',
            Espanol: 'ha ocurrido un error interno al ejecutar este comando. Prueba de nuevo más tarde.'
        };

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        const toExecute = command + '.js';
        
        const isCommand = comandos.includes(toExecute);
        if (isCommand == false) return;
        try {
            cmds.get(command).execute(message, args, client);
        } catch (error) {
            if (userdata.locale==='English') return message.reply(errormessage.English);
            if (userdata.locale==='Espanol') return message.reply(errormessage.Espanol);
            console.error(error);
        };  
	},
};

client.functions = require('../functions.js');