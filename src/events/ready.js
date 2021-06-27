const fetch = require('node-fetch')
const publicIp = require('public-ip');
const fs = require ('fs');
const Discord = require('discord.js');
const beautify = require('beautify');
module.exports = {
    once: true,
	async execute (client) {
        client.once('ready', async () => {
            client.user.setActivity(`Work In Progress`, {type: 'WATCHING',})
            const servers = await client.guilds.cache.size
            const log_channel = await client.channels.cache.get('843799970997862472')
            
            let date = new Date()
    
            let day = date.getDate()
            let month = date.getMonth() + 1
            let year = date.getFullYear()
    
            if(month < 10){
                var _date = (`${day}-0${month}-${year}`)
            } else {
                var _date =(`${day}-${month}-${year}`)
            };
    
            const cmds = fs.readdirSync('./src/cmdfiles').filter(file => file.endsWith('.js'));
    
            for (const file of cmds) {
                const interaction_data = require(`../cmdfiles/${file}`);
                client.api.applications(client.user.id).commands.post({
                    data: {
                        name: interaction_data.name,
                        description: interaction_data.description,
                        options: interaction_data.options
                    }
                });
                client.api.applications(client.user.id).guilds('811691705551683634').commands.post({
                    data: {
                        name: `test_${interaction_data.name}`,
                        description: interaction_data.description,
                        options: interaction_data.options
                    }
                });
            };
            let commands = await client.api.applications(client.user.id).commands.get()
            let cmds_json = JSON.stringify(commands, ['id', 'name'])
            let cmds_string = beautify(cmds_json, {format: 'json'})
            const embed = new Discord.MessageEmbed()
                .setDescription(`Bot iniciado. - IP: ${await publicIp.v4()}\nEstoy en ${servers} servers.\nFecha: ${_date}\nComandos:\n\`\`\`json\n${cmds_string}\`\`\``)
                .setColor('ORANGE')
            log_channel.send(embed);
        })
	},
};  