const Discord = require('discord.js');
const fs = require('fs');
const prefix = 'b.';

const cmds = new Discord.Collection();
const comandos = fs.readdirSync('./cmds').filter(file => file.endsWith('.js'));

for (const file of comandos) {
	const command = require(`../cmds/${file}`);
	cmds.set(command.name, command);
};

module.exports = {
	name: 'message',
	async execute(message) {
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        const toExecute = command + '.js';
        
        const isCommand = comandos.includes(toExecute);
        if (isCommand == true) {
            try {
                cmds.get(command).execute(message, args);
            } catch (error) {
                message.reply('ha ocurrido un error interno al ejecutar este comando. Prueba de nuevo más tarde.');
                console.error(error);
            };
        }
	},
};