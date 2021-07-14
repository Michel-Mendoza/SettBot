const fetch = require('node-fetch');
const { URL } = require("url");

module.exports = {
    name: 'configurar_torneo',
    description: 'Establece la configuración del torneo y devuelve las claves de acceso.',
    options: [
        {    
        name: "tournament_id",
        description: "El ID del torneo.",
        type: 3,
        required: true
        },{
            name: "mapa",
            description: "El mapa de las partidas.",
            type: 3,
            required: true,
            choices: [
                {
                    name: "Grieta del Invocador",
                    value: "SUMMONERS_RIFT"
                },
                {
                    name: "Abismo de los Lamentos",
                    value: "HOWLING_ABYSS"
                }
            ]
            },{
                name: "espectadores",
                description: "Tipo de espectadores.",
                type: 3,
                required: true,
                choices: [
                    {
                        name: "Todos",
                        value: "ALL"
                    },
                    {
                        name: "Sólo lobby",
                        value: "LOBBYONLY"
                    },
                    {
                        name: "Nadie",
                        value: "NONE"
                    }
                ]
            },{           
                name: "teamsize",
                description: "Tamaño de los equipos.",
                type: 3,
                required: true,
                choices: [
                    {
                        name: "1",
                        value: "1"
                    },
                    {
                        name: "2",
                        value: "2"
                    },
                    {
                        name: "3",
                        value: "3"
                    },
                    {
                        name: "4",
                        value: "4"
                    },
                    {
                        name: "5",
                        value: "5"
                    }
                ]
                },{           
                    name: "pick_mode",
                    description: "El tipo de pick.",
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: "Selección oculta",
                            value: "BLIND_PICK"
                        },
                        {
                            name: "Reclutamiento",
                            value: "DRAFT_MODE"
                        },
                        {
                            name: "Todo aleatorio",
                            value: "ALL_RANDOM"
                        },
                        {
                            name: "Reclutamiento de torneo (Tipo clash)",
                            value: "TOURNAMENT_DRAFT"
                        }
                    ]
                    },{
                        name: 'keys',
                        description: 'La cantidad de llaves que quieres (máximo 1000)',
                        type: 4,
                        required: true
                    }],
    msg: async (args, interaction, client) => {
        let t_id = args[0].value
        let map = args[1].value
        let spec = args[2].value
        let teamsize = args[3].value
        let pick = args[4].value
        let keys_size = args[5].value

        if (keys_size >= 1000) keys_size = 1000

        if (!interaction.member.id == '797254248387444769') return 'No estás autorizado.'

        let tournament_config_body = {
            "mapType": map,
            "pickType": pick,
            "spectatorType": spec,
            "teamSize": teamsize
          }

        let key = 'RGAPI-e6b78cc5-6d96-437f-b640-67f7e8dd7777'

        let api = new URL(`https://americas.api.riotgames.com/lol/tournament-stub/v4/codes?tournamentId=${t_id}`)
        let data = await fetch(api, {headers: {'X-Riot-Token':key}, method: 'POST', body: JSON.stringify(tournament_config_body)})
        data = await data.json()

        const Discord = require('discord.js')
        let embed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription('SettBot Torneos - Las claves del torneo han sido creadas.')
            .setDescription('Aquí tienes las claves:\n'+ JSON.stringify(data))
            .setTimestamp()
        return embed
    }
    
}