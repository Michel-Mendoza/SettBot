const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const { URL } = require("url");

module.exports = {
    name: 'champion',
    description: 'Muestra el lore, pasiva y habilidades de un campeón.',
    options: [
        require('../cmdoptions/champion.js')
    ], msg: async (args, interaction, client) => {
        let champion = args[0].value
        let functions = client.functions
        const champ = await functions.championIdentifiers(champion); if (champ==false) {
            return 'No he encontrado el campeón que buscas. Asegúrate de que has escrito el nombre correctamente (La API de Riot está en inglés, debes tener esto en cuenta a la hora de buscar algunos campeones, si estás buscando, por ejemplo, a `Bardo` debes escribir `Bard`).'
        };
        const versions = await fetch(`https://ddragon.leagueoflegends.com/api/versions.json`);
        const version = await versions.json();
        let id = champ.id
        let api = `https://ddragon.leagueoflegends.com/cdn/${version[0]}/data/es_ES/champion/${id}.json`
        let data = await fetch (new URL(api))
        let json = await data.json()
        let champ_data = Object.values(json.data).find(e => e.id == champ.id)

        let tip = champ_data.allytips[Math.floor(Math.random() * champ_data.allytips.length)]

        eliminar_etiquetas = (txt) => {
            var regex = /(<([^>]+)>)/ig
            return txt.replace(regex, " ");
        }
        
        let embed = new MessageEmbed()
            .setAuthor(`${champ.name} - ${champ_data.title}`, `http://ddragon.leagueoflegends.com/cdn/${version[0]}/img/champion/${id}.png`)
            .setDescription(champ_data.lore)
            .addField(`Pasiva: ${champ_data.passive.name}`, eliminar_etiquetas(champ_data.passive.description))
            .addField(`Q: ${champ_data.spells[0].name}`, eliminar_etiquetas(champ_data.spells[0].description))
            .addField(`W: ${champ_data.spells[1].name}`, eliminar_etiquetas(champ_data.spells[1].description))
            .addField(`E: ${champ_data.spells[2].name}`, eliminar_etiquetas(champ_data.spells[2].description))
            .addField(`R: ${champ_data.spells[3].name}`, eliminar_etiquetas(champ_data.spells[3].description))
            .addField('\u200B', tip)
            .setFooter(`Solicitado por ${interaction.member.user.username}`,`https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}`)
            .setTimestamp()

        return embed



    }
}