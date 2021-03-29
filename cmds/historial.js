module.exports = {
    name: 'historial',
    description: 'Información sobre el historial de partidas de un jugador.',
    async execute(message, args) {
        let regionError = require("../errores/regionError.json");
        let invocadorInexistente = require("../errores/invocador-inexistente.json");
        let missingArgs = require("../errores/uso-incorrecto/historial.json");
        let notEnough = require("../errores/partidas-insuficientes.json");
    
        const page = args[0]; if (isNaN(page)==true) return message.channel.send(missingArgs)
        var platform = args[1], region = args[1];
        args.shift(); args.shift(); const name = args.join(' ');
    
        if (!region || !name) return message.channel.send(missingArgs)
    
        let startIndex = (page-1)*5
    
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
        let getHistory = require("../src/customdata/history.js");
        let ddragonver = require("../src/ddragon/ddragon-ver.js");
    
        let summonerData = summonerByName.get(region, name); if (!(await summonerData).id) return (await msg).edit(invocadorInexistente);
        let history = await getHistory.get(region, (await summonerData).accountId, startIndex); if (getHistory == false) return (await msg).edit(notEnough);
        let version = ddragonver.get();
        let mark = "`";

        const dc = require('discord.js');
        const embed = new dc.MessageEmbed();
        embed.setTitle('Esto es lo que he encontrado:')
        embed.setAuthor(`Página ${page} del historial de partidas - ${(await summonerData).name}`,`https://ddragon.leagueoflegends.com/cdn/${await version}/img/profileicon/${(await summonerData).profileIconId}.png`)
        embed.addField(`Partida ${page*5-4} - ${history.game1.remake?'Remake':((history.game1.win)?'Victoria':'Derrota')} - ${history.game1.duration}`, `${mark}${history.game1.champ} - ${history.game1.kda} - ${history.game1.cs} minions. - ${history.game1.cola}\nID De la partida: ${history.game1.id}${mark}`)
        embed.addField(`Partida ${page*5-3} - ${history.game2.remake?'Remake':((history.game2.win)?'Victoria':'Derrota')} - ${history.game2.duration}`, `${mark}${history.game2.champ} - ${history.game2.kda} - ${history.game2.cs} minions. - ${history.game2.cola}\nID De la partida: ${history.game2.id}${mark}`)
        embed.addField(`Partida ${page*5-2} - ${history.game3.remake?'Remake':((history.game3.win)?'Victoria':'Derrota')} - ${history.game3.duration}`, `${mark}${history.game3.champ} - ${history.game3.kda} - ${history.game3.cs} minions. - ${history.game3.cola}\nID De la partida: ${history.game3.id}${mark}`)
        embed.addField(`Partida ${page*5-1} - ${history.game4.remake?'Remake':((history.game4.win)?'Victoria':'Derrota')} - ${history.game4.duration}`, `${mark}${history.game4.champ} - ${history.game4.kda} - ${history.game4.cs} minions. - ${history.game4.cola}\nID De la partida: ${history.game4.id}${mark}`)
        embed.addField(`Partida ${page*5-0} - ${history.game5.remake?'Remake':((history.game5.win)?'Victoria':'Derrota')} - ${history.game5.duration}`, `${mark}${history.game5.champ} - ${history.game5.kda} - ${history.game5.cs} minions. - ${history.game5.cola}\nID De la partida: ${history.game5.id}${mark}`)
        embed.setFooter(`Usa s.historial <número de página> ${platform.toUpperCase()} ${(await summonerData).name} para ver más partidas.`, message.author.avatarURL())
        embed.setTimestamp(new Date());
        (await msg).edit(embed)
    }

}