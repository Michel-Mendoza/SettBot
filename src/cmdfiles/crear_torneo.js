const fetch = require('node-fetch');
const { URL } = require("url");

module.exports = {
    name: 'crear_torneo',
    description: 'Inicia un torneo y devuelve su ID.',
    options: [
        {    
        name: "nombre",
        description: "El nombre del torneo.",
        type: 3,
        required: true
        },
        {    
            name: "provider_id",
            description: "Tu ID de proveedor.",
            type: 3,
            required: true
        }],
    msg: async (args, interaction, client) => {
        let t_name = args[0].value 
        let provider = args[1].value

        if (!interaction.member.id == '797254248387444769') return 'No estás autorizado.'

        let tournament_creation_body = {name: t_name, providerId: provider}

        let key = 'RGAPI-e6b78cc5-6d96-437f-b640-67f7e8dd7777'

        let api = new URL('https://americas.api.riotgames.com/lol/tournament-stub/v4/tournaments')
        let data = await fetch(api, {headers: {'X-Riot-Token':key}, method: 'POST', body: JSON.stringify(tournament_creation_body)})
        data = await data.json()

        const Discord = require('discord.js')
        let embed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription('SettBot Torneos')
            .setDescription('Has creado un torneo.\nID del torneo: '+ data)
            .setTimestamp()
        return embed
    }
    
}