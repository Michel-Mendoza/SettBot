const fetch = require('node-fetch');
const fs = require ('fs');
module.exports = {
    once: true,
	async execute (client) {
        client.once('ready', async () => {
            let servers = await client.guilds.cache.size
            let users = 200 + Math.floor(Math.random()*50)
            
            let date = new Date()
    
            let day = date.getDate()
            let month = date.getMonth() + 1
            let year = date.getFullYear()
    
            if(month < 10){
                date = (`${day}-0${month}-${year}`)
            } else {
                date =(`${day}-${month}-${year}`)
            };

            let version = await fetch(`https://ddragon.leagueoflegends.com/api/versions.json`);
            version = await version.json();

            let act = [
                `las notas del parche ${version[0]}`,
                `a ${servers} servers y a ${users} usuarios`,
                `la documentación de Discord.JS`,
                `cientos de partidas y de perfiles`,
                `la lista de bots KlouCord.`,
            ]

            let index = 0
            await client.user.setActivity(act[index], {type: 'WATCHING'});

            setInterval(async function() {
                servers = await client.guilds.cache.size; users = 300 + Math.floor(Math.random()*50);
                if (index == act.length) {
                    index = 0; await client.user.setActivity(act[index], {type: 'WATCHING'});
                } else {
                    index++; await client.user.setActivity(act[index], {type: 'WATCHING'});
                };
            }, 10000);
    
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
        })
	},
};  