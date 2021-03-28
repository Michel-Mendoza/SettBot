module.exports = {
    name: 'maestria',
    description: 'Consulta puntuación de maestría de un invocador.',
    async execute(message, args) {
        let regionError = require("../errores/regionError.json");
        let invocadorInexistente = require("../errores/invocador-inexistente.json");
        let campeonInexistente = require("../errores/campeon-inexistente.json");
        let missingArgs = require("../errores/uso-incorrecto/maestria.json");
        let neverPlayed = require("../errores/campeon-no-jugado.json");
        let notEnough = require("../errores/partidas-insuficientes-champ.json");
    
        const champion = args[0]
        var platform = args[1], region = args[1];
        args.shift(); args.shift(); const name = args.join(' ');
    
        if (!region || !name || !champion) return message.channel.send(missingArgs)
    
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
        let championById = require("../src/ddragon/champById.js");
        let mastery = require("../src/raw/masteries-by-summoner-champion.js");
        let lastGData = require("../src/customdata/last-champion-game.js");
        let last10GData = require("../src/customdata/last-10-games-champion.js");
        let ddragonver = require("../src/ddragon/ddragon-ver.js");
    
        let summonerData = summonerByName.get(region, name); if (!(await summonerData).id) return (await msg).edit(invocadorInexistente);
        let championData = championById.get(champion); if ((await championData) == false) return (await msg).edit(campeonInexistente);
        let masteryData = mastery.get(region, (await summonerData).id, (await championData).key); if (!(await masteryData).championPoints) return (await msg).edit(neverPlayed);
        let lastGameData = lastGData.get(region, (await summonerData).accountId, (await championData).key);
        let last10GameData = last10GData.get(region, (await summonerData).accountId, (await championData).key); if ((await last10GameData) == false) return (await msg).edit(notEnough);
        let version = ddragonver.get()
    
        if ((await masteryData).championLevel == 1) var icon = 'https://cdn.discordapp.com/attachments/811691705551683637/818425648795222056/50.png';
        if ((await masteryData).championLevel == 2) var icon = 'https://cdn.discordapp.com/attachments/811691705551683637/818425685021687828/50.png';
        if ((await masteryData).championLevel == 3) var icon = 'https://cdn.discordapp.com/attachments/811691705551683637/818425969794482186/50.png';
        if ((await masteryData).championLevel == 4) var icon = 'https://cdn.discordapp.com/attachments/811691705551683637/818425723013693470/50.png';
        if ((await masteryData).championLevel == 5) var icon = 'https://cdn.discordapp.com/attachments/811691705551683637/818425771982192650/50.png';
        if ((await masteryData).championLevel == 6) var icon = 'https://cdn.discordapp.com/attachments/811691705551683637/818425805415251968/50.png';
        if ((await masteryData).championLevel == 7) var icon = 'https://cdn.discordapp.com/attachments/811691705551683637/818425838546452520/50.png';
    
        const dc = require("discord.js")
        const embed = new dc.MessageEmbed();
        embed.setAuthor(`Estadísticas con ${(await championData).name} - ${(await summonerData).name} - ${platform.toUpperCase()}`, icon)
        embed.setTitle(`Esto es lo que he encontrado:`)
        embed.addField(`Nivel de maestría y puntuación:`, `Nivel ${(await masteryData).championLevel} - ${(await masteryData).championPoints} puntos.`)
        embed.addField(`Última partida con ${(await championData).name}:`, (await lastGameData), true)
        embed.addField(`Últimas 10 partidas con ${(await championData).name}:`, `KDA Medio: ${(await last10GameData).kda} - Ha obtenido ${(await last10GameData).wr}`)
        embed.setImage(`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${(await championData).id}_0.jpg`)
        embed.setThumbnail(`https://ddragon.leagueoflegends.com/cdn/${await version}/img/profileicon/${(await summonerData).profileIconId}.png`)
        embed.setFooter(`Solicitado por ${message.author.username}`, message.author.avatarURL())
        embed.setTimestamp(new Date());
        if ((await masteryData).championLevel < 5) {
            embed.addField('Puntos hasta el siguiente nivel:', `${(await masteryData).championPointsUntilNextLevel}`)
        }; if ((await masteryData).championLevel == 5 && (await masteryData).championLevel < 7) {
            embed.addField(`Insignias de maestría ${((await masteryData).championLevel)+1} obtenidas:`, `${(await masteryData).tokensEarned}`)
        };
        (await msg).edit(embed);
    }
}