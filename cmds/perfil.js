module.exports = {
    name: 'perfil',
    description: 'Devuelve información como el estado de clasificatorias de un jugador, además de sus campeones con más maestría, entre otros datos.',
    async execute(message, args) {
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
    
        let summonerData = summonerByName.get(region, name); if (!(await summonerData).id) return (await msg).edit(invocadorInexistente); 
        let rankedData = rankedInfo.get(region, (await summonerData).id);
        let masteriesData = masteries.get(region, (await summonerData).id);
        let lastGameData = lastGame.get(region, (await summonerData).accountId);
        let last10GamesData = last10GamesWL.get(region, (await summonerData).accountId);

        const Discord = require('discord.js');
        const embed = new Discord.MessageEmbed();
        embed.setTitle('Esto es lo que he encontrado:');
        embed.setAuthor(`Perfil de ${(await summonerData).name} - ${platform.toUpperCase()}`);
        embed.addField('Nivel:', (await summonerData).summonerLevel, true);
        embed.addField('‎', '‎', true);
        embed.addField('Últimas 10 Partidas:', await last10GamesData, true);
        embed.addField('Campeones con mayor maestría:', `${(await masteriesData).champ1}\n${(await masteriesData).champ2}\n${(await masteriesData).champ3}`, true);
        embed.addField('‎', '‎', true);
        embed.addField('Estadísticas en Clasificatoria Solo/Dúo:', (await rankedData).isRanked?`${(await rankedData).elo}\n${(await rankedData).leaguePoints} Puntos de Liga ${(await rankedData).winRatio}`:'Sin clasificar', true);
        embed.addField('Última partida:', `${await lastGameData}`);
        embed.setFooter(`Solicitado por ${message.author.username}`, message.author.avatarURL());
        embed.setTimestamp()

        (await msg).edit(embed);
    }
}