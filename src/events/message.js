const Discord = require('discord.js')
module.exports = {
    async execute (client) {
        client.on('message', async (message) => {
            const log_channel = await client.channels.cache.get('843803560600797195')
            if (message.author.bot==true) return;
            if (message.guild) {
                let prefix = 's.'
                let args = message.content.slice(prefix.length).trim().split(/ +/g);
                let command = args.shift().toLowerCase();
                if (command == 'champion') {
                    let input = [{value: args[0]}]
                    let embed = await require('../cmdfiles/champion.js').msg(input, message, client)
                    if (!embed) {
                        message.reply('Ha ocurrido un error. Asegúrate de que no has introducido ningún espacio en los argumentos del comando. Recomendamos usar los comandos de barra diagonal (/).')
                    } else message.reply(embed)
                } else if (command == 'help') {

                } else if (command == 'lofi') {

                } else if (command == 'mastery') {
                    if (args.length >= 4) {
                        message.reply('Ha ocurrido un error. Asegúrate de que no has introducido ningún espacio en los argumentos del comando. Recomendamos usar los comandos de barra diagonal (/).')
                    } else {
                        let input = [{value: platform(args[0])},{value:args[1]}, {value:args[2]}]
                        let embed = await require('../cmdfiles/mastery.js').msg(input, message, client)
                        if (!embed) {
                            message.reply('Ha ocurrido un error. Asegúrate de que no has introducido ningún espacio en los argumentos del comando. Recomendamos usar los comandos de barra diagonal (/).')
                        } else message.reply(embed)
                    }
                } else if (command == 'multisearch') {
                    message.reply('Este comando sólo puede ser usado con los comandos de barra diagonal (/).')
                } else if (command == 'profile') {
                    if (args.length >= 3) {
                        message.reply('Ha ocurrido un error. Asegúrate de que no has introducido ningún espacio en los argumentos del comando. Recomendamos usar los comandos de barra diagonal (/).')
                    } else {
                        let input = [{value: platform(args[0])},{value:args[1]}]
                        let embed = await require('../cmdfiles/profile.js').msg(input, message, client)
                        if (!embed) {
                            message.reply('Ha ocurrido un error. Asegúrate de que no has introducido ningún espacio en los argumentos del comando. Recomendamos usar los comandos de barra diagonal (/).')
                        } else message.reply(embed)
                    }
                } else if (command == 'parche') {
                    let version = await fetch(`https://ddragon.leagueoflegends.com/api/versions.json`);
                    version = await version.json();
                    version = version[0].split('.')
                    while (version.length >= 3) version.pop()
                    version = version.join('-') 
                    let parche = `https://euw.leagueoflegends.com/es-es/news/game-updates/patch-${version}-notes/`
                    message.reply(parche)
                }
            } else if (!message.guild) {
                const embed = new Discord.MessageEmbed()
                .setAuthor(`Nuevo DM en SettBot - De ${message.author.username}#${message.author.discriminator}`)
                .setThumbnail(`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}`)
                .setDescription(message.content)
                .setColor('BLUE');
            log_channel.send(embed)
            }
        });
    }
}

let platform = function (region) {
    if (region=='EUW') return 'EUW1';
    if (region=='EUNE') return 'EUN1';
    if (region=='NA') return 'NA1';
    if (region=='LAN') return 'LA1';
    if (region=='LAS') return 'LA2';
    if (region=='KR') return 'KR';
    if (region=='JP') return 'JP1';
    if (region=='OCE') return 'OC1';
    if (region=='BR') return 'BR1';
    else return region;
}