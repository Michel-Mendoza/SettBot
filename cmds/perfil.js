module.exports = {
    name: 'perfil',
    description: 'Devuelve información como el estado de clasificatorias de un jugador, además de sus campeones con más maestría, entre otros datos.',
    async execute(message, args, client) {
        let regionError = require("../errores/regionError.json");
        let invocadorInexistente = require("../errores/invocador-inexistente.json");
        let missingArgs = require("../errores/uso-incorrecto/perfil.json");
    
        var platform = args[0], region = args[0];
        args.shift(); const name = args.join(' ');
    
        if (!region || !name) return message.channel.send(missingArgs)
    
        let knownRegion = [
            "EUW", "EUNE", "NA", "LAS", "LAN"
        ].includes(region.toUpperCase()); if (knownRegion == true) {
            if (region.toUpperCase() === "EUW") var region = "EUW1"
            if (region.toUpperCase() === "EUNE") var region = "EUN1"
            if (region.toUpperCase() === "NA") var region = "NA1"
            if (region.toUpperCase() === "LAN") var region = "LA1"
            if (region.toUpperCase() === "LAS") var region = "LA2"
        } else if (knownRegion == false) return message.channel.send(regionError)
    
        const msg = message.channel.send('```Realizando la petición a Riot Games...```');
    
        let summonerByName = require("../src/raw/summoners-by-name.js");
        let rankedInfo = require("../src/customdata/ranked-info.js");
        let masteries = require("../src/customdata/get-masteries.js");
        let lastGame = require("../src/customdata/last-game-data.js");
        let last10GamesWL = require("../src/customdata/last-10-games-win-and-loose.js");
        const ddragonver = require("../src/ddragon/ddragon-ver.js");
    
        let summonerData = summonerByName.get(region, name); if (!(await summonerData).id) return (await msg).edit(invocadorInexistente); 
        let rankedData = rankedInfo.get(region, (await summonerData).id);
        let masteriesData = masteries.get(region, (await summonerData).id);
        let lastGameData = lastGame.get(region, (await summonerData).accountId);
        let last10GamesData = last10GamesWL.get(region, (await summonerData).accountId);
        const version = ddragonver.get();

        const getChampByKey = require('../src/ddragon/champByKey').get
        const id1 = await getChampByKey((await masteriesData).champ1.id).id
        const id2 = await getChampByKey((await masteriesData).champ2.id).id
        const id3 = await getChampByKey((await masteriesData).champ3.id).id

        function getEmote(client, name) {
            console.log(name);
            let emotes = client.emojis.cache
            let emote = emotes.find(e => e.name.toLowerCase() === name.toLowerCase())
            return `<:${emote.name}:${emote.id}>`
        }

        const emote1 = getEmote(client, id1)
        const emote2 = getEmote(client, id2)
        const emote3 = getEmote(client, id3)

        const champion1 = `**1.** ${emote1} ${(await masteriesData).champ1.string}`
        const champion2 = `**2.** ${emote2} ${(await masteriesData).champ2.string}`
        const champion3 = `**3.** ${emote3} ${(await masteriesData).champ3.string}`
        
        const dc = require('discord.js');
        const embed = new dc.MessageEmbed();
        embed.setTitle('Esto es lo que he encontrado:');
        embed.setAuthor(`Perfil de ${(await summonerData).name} - ${platform.toUpperCase()}`, `https://ddragon.leagueoflegends.com/cdn/${await version}/img/profileicon/${(await summonerData).profileIconId}.png`);
        embed.addField('Nivel:', (await summonerData).summonerLevel, true);
        embed.addField('‎', '‎', true);
        embed.addField('Últimas 10 Partidas:', await last10GamesData, true);
        embed.addField('Campeones con mayor maestría:', `${champion1}\n${champion2}\n${champion3}`, true);
        embed.addField('‎', '‎', true);
        embed.addField('Estadísticas en Clasificatoria Solo/Dúo:', (await rankedData).isRanked?`${(await rankedData).elo}\n${(await rankedData).leaguePoints} Puntos de Liga ${(await rankedData).winRatio}`:'Sin clasificar', true);
        embed.addField('Última partida:', `${await lastGameData}`);
        embed.setFooter(`Solicitado por ${message.author.username}`, message.author.avatarURL());
        embed.setTimestamp(new Date());

        (await msg).edit(embed);
    }
}