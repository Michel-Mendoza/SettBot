const fetch = require('node-fetch');
const {
    URL
} = require("url");

module.exports = {
    name: 'registrar_proveedor',
    description: 'Registra un nuevo proveedor de torneos.',
    options: [{
        name: "region",
        description: "La región en la que realizarás los torneos.",
        type: 3,
        required: true,
        choices: [{
                name: "Europe West (EUW)",
                value: "EUW"
            },
            {
                name: "EU Nordic & East (EUNE)",
                value: "EUNE"
            },
            {
                name: "North America (NA)",
                value: "NA"
            },
            {
                name: "Latinoamérica Norte (LAN)",
                value: "LAN"
            },
            {
                name: "Latinoamérica Sur (LAS)",
                value: "LAS"
            },
            {
                name: "Brazil (BR)",
                value: "BR"
            },
            {
                name: "대한민국 (KR)",
                value: "KR"
            },
            {
                name: "日本 (JP)",
                value: "JP"
            },
            {
                name: "Oceania (OCE)",
                value: "OCE"
            }, {
                name: "PBE",
                value: "PBE"
            }
        ]
    }],
    msg: async (args, interaction, client) => {
        let region = args[0].value

        if (!interaction.member.id == '797254248387444769') return 'No estás autorizado.'

        let provider_register = {
            "region": region,
            "url": "https://discord.com/"
        }

        let key = 'RGAPI-e6b78cc5-6d96-437f-b640-67f7e8dd7777'

        let api = new URL('https://americas.api.riotgames.com/lol/tournament-stub/v4/providers')
        let data = await fetch(api, {
            headers: {
                'X-Riot-Token': key
            },
            method: 'POST',
            body: JSON.stringify(provider_register)
        })
        data = await data.json()

        const Discord = require('discord.js')
        let embed = new Discord.MessageEmbed()
            .setColor('RED')
            .setTitle('SettBot Torneos')
            .setDescription('Un nuevo proveedor ha sido registrado.\nID del proveedor: ' + data)
            .setTimestamp()
        return embed
    }

}