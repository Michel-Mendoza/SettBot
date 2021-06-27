const { MessageEmbed } = require('discord.js')
const functions = require('../../functions.js')
module.exports = {
    name: 'multisearch',
    description: 'Copia y pega el texto de la sala aquí para buscar a los 5 jugadores de tu equipo.',
    options: [
        require('../cmdoptions/region.js'),
        {
            name: "text",
            description: "El texto de la sala de la partida sin los saltos de línea, o puedes separar los nombres por comas.",
            type: 3,
            required: true
        }
    ], msg: async (args, interaction, client) => {
        let users_string = args[1].value
        let users_array = users_string
            .split(' ').join('')
            .split('.').join('')
            .split(',').join('*')
            .split('joinedthelobby').join('*')
            .split('sehaunidoalasala').join('*')
            .split('*')
        let region = args[0].value
        let embed = new MessageEmbed()
            .setTitle('Búsqueda Múltiple')
            .setDescription('Esto es lo que he encontrado:')
            .setFooter(`Solicitado por ${interaction.member.user.username}`,`https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}`)
            .setTimestamp();
        if (users_array[0]) {
            let user1 = await functions.multisearch_txt(region, users_array[0], client)
            embed.addField(user1.name, user1.text)
        }
        if (users_array[1]) {
            let user2 = await functions.multisearch_txt(region, users_array[1], client)
            embed.addField(user2.name, user2.text)
        }
        if (users_array[2]) {
            let user3 = await functions.multisearch_txt(region, users_array[2], client)
            embed.addField(user3.name, user3.text)
        }
        if (users_array[3]) {
            let user4 = await functions.multisearch_txt(region, users_array[3], client)
            embed.addField(user4.name, user4.text)
        }
        if (users_array[4]) {
            let user5 = await functions.multisearch_txt(region, users_array[4], client)
            embed.addField(user5.name, user5.text)
        }
        if (users_array[5]) {
            let user6 = await functions.multisearch_txt(region, users_array[5], client)
            embed.addField(user6.name, user6.text)
        }
        if (users_array[6]) {
            let user7 = await functions.multisearch_txt(region, users_array[6], client)
            embed.addField(user7.name, user7.text)
        }
        if (users_array[7]) {
            let user8 = await functions.multisearch_txt(region, users_array[7], client)
            embed.addField(user8.name, user8.text)
        }
        if (users_array[8]) {
            let user9 = await functions.multisearch_txt(region, users_array[8], client)
            embed.addField(user9.name, user9.text)
        }
        if (users_array[9]) {
            let user10 = await functions.multisearch_txt(region, users_array[9], client)
            embed.addField(user10.name, user10.text)
        }
        let ejemplo = '[El comando debería verse así.](https://i.imgur.com/bsEgXc9.png)'
        embed.addField('‎', `¿Faltan jugadores? Asegúrate de que has eliminado todos los saltos de línea correctamente. ${ejemplo}`)
        return embed
    }
}