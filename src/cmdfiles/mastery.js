const { MessageEmbed, Message } = require('discord.js')
module.exports = {
    name: 'mastery',
    description: 'Muestra la puntuación de maestría y algunas estadísticas de un invocador específico con un campeón.',
    options: [
        require('../cmdoptions/region.js'),
        require('../cmdoptions/summonername.js'),
        require('../cmdoptions/champion.js')
    ], msg: async (args, interaction, client) => {
        let region = args[0].value
        let name = args[1].value
        let champion = args[2].value
            .split("'").join('')
            .split(' ').join('')

        let functions = client.functions

        platform = (region) => {
            if (region=='EUW1') return 'EUW';
            if (region=='EUN1') return 'EUNE';
            if (region=='NA1') return 'NA';
            if (region=='LA1') return 'LAN';
            if (region=='LA2') return 'LAS';
            if (region=='KR') return 'KR';
            if (region=='JP1') return 'JP';
            if (region=='OC1') return 'OCE';
            if (region=='BR1') return 'BR';
            else return region;
        }

        const summoner = await functions.summoner_api(region, name); if (summoner==false) {
            return `El invocador que buscas no existe en ${platform(region)}.`
        };

        const champ = await functions.championIdentifiers(champion); if (champ==false) {
            return 'No he encontrado el campeón que buscas. Asegúrate de que has escrito el nombre correctamente (La API de Riot está en inglés, debes tener esto en cuenta a la hora de buscar algunos campeones, si estás buscando, por ejemplo, a `Bardo` debes escribir `Bard`).'
        };

        const history = await functions.history_specific(region, summoner.account_id, champ.key); if (history==false) {
            return `El invocador que buscas no ha jugado al menos 10 partidas con ${champ.name}, por lo que no puedo obtener sus estadísticas.`
        };
        
        const mastery = await functions.mastery_specific(region, summoner.summoner_id, champ.key);

        const last10Games = {
            game1: await functions.gamedata_api(region, history.match_ids[0], summoner.account_id),
            game2: await functions.gamedata_api(region, history.match_ids[1], summoner.account_id),
            game3: await functions.gamedata_api(region, history.match_ids[2], summoner.account_id),
            game4: await functions.gamedata_api(region, history.match_ids[3], summoner.account_id),
            game5: await functions.gamedata_api(region, history.match_ids[4], summoner.account_id),
            game6: await functions.gamedata_api(region, history.match_ids[5], summoner.account_id),
            game7: await functions.gamedata_api(region, history.match_ids[6], summoner.account_id),
            game8: await functions.gamedata_api(region, history.match_ids[7], summoner.account_id),
            game9: await functions.gamedata_api(region, history.match_ids[8], summoner.account_id),
            game10: await functions.gamedata_api(region, history.match_ids[9], summoner.account_id),
        };

        var wins = 0; var losses = 0;
        if (last10Games.game1.remake == false) {
            if (last10Games.game1.win == true) wins++; else losses++
        } if (last10Games.game2.remake == false) {
            if (last10Games.game2.win == true) wins++; else losses++
        } if (last10Games.game3.remake == false) {
            if (last10Games.game3.win == true) wins++; else losses++
        } if (last10Games.game4.remake == false) {
            if (last10Games.game4.win == true) wins++; else losses++
        } if (last10Games.game5.remake == false) {
            if (last10Games.game5.win == true) wins++; else losses++
        } if (last10Games.game6.remake == false) {
            if (last10Games.game6.win == true) wins++; else losses++
        } if (last10Games.game7.remake == false) {
            if (last10Games.game7.win == true) wins++; else losses++
        } if (last10Games.game8.remake == false) {
            if (last10Games.game8.win == true) wins++; else losses++
        } if (last10Games.game9.remake == false) {
            if (last10Games.game9.win == true) wins++; else losses++
        } if (last10Games.game10.remake == false) {
            if (last10Games.game10.win == true) wins++; else losses++
        };

        const history_soloq = await functions.soloq_history_specific(region, summoner.account_id, champ.key); if (history_soloq==false) {
            var ranked_txt = `No hay datos.`
        };

        if (history_soloq != false) {
            let last10Ranked = {
                game1: await functions.gamedata_api(region, history_soloq.match_ids[0], summoner.account_id),
                game2: await functions.gamedata_api(region, history_soloq.match_ids[1], summoner.account_id),
                game3: await functions.gamedata_api(region, history_soloq.match_ids[2], summoner.account_id),
                game4: await functions.gamedata_api(region, history_soloq.match_ids[3], summoner.account_id),
                game5: await functions.gamedata_api(region, history_soloq.match_ids[4], summoner.account_id),
                game6: await functions.gamedata_api(region, history_soloq.match_ids[5], summoner.account_id),
                game7: await functions.gamedata_api(region, history_soloq.match_ids[6], summoner.account_id),
                game8: await functions.gamedata_api(region, history_soloq.match_ids[7], summoner.account_id),
                game9: await functions.gamedata_api(region, history_soloq.match_ids[8], summoner.account_id),
                game10: await functions.gamedata_api(region, history_soloq.match_ids[9], summoner.account_id),
            };
    
            var wins1 = 0; var losses1 = 0;
            if (last10Ranked.game1.remake == false) {
                if (last10Ranked.game1.win == true) wins1++; else losses1++
            } if (last10Ranked.game2.remake == false) {
                if (last10Ranked.game2.win == true) wins1++; else losses1++
            } if (last10Ranked.game3.remake == false) {
                if (last10Ranked.game3.win == true) wins1++; else losses1++
            } if (last10Ranked.game4.remake == false) {
                if (last10Ranked.game4.win == true) wins1++; else losses1++
            } if (last10Ranked.game5.remake == false) {
                if (last10Ranked.game5.win == true) wins1++; else losses1++
            } if (last10Ranked.game6.remake == false) {
                if (last10Ranked.game6.win == true) wins1++; else losses1++
            } if (last10Ranked.game7.remake == false) {
                if (last10Ranked.game7.win == true) wins1++; else losses1++
            } if (last10Ranked.game8.remake == false) {
                if (last10Ranked.game8.win == true) wins1++; else losses1++
            } if (last10Ranked.game9.remake == false) {
                if (last10Ranked.game9.win == true) wins1++; else losses1++
            } if (last10Ranked.game10.remake == false) {
                if (last10Ranked.game10.win == true) wins1++; else losses1++
            };
        }

        const soloq = await functions.soloqueue_api(region, summoner.summoner_id);

        function rankedTxt () {
            if (ranked_txt) return ranked_txt
            else return `${wins1}W / ${losses1}L (${functions.emote(client, `${soloq.tier}Emote`)} ${soloq.tier} ${soloq.rank} - ${soloq.lp} LP)`
        }

        let m1 = `https://static.wikia.nocookie.net/leagueoflegends/images/d/d8/Champion_Mastery_Level_1_Flair.png/revision/latest/scale-to-width-down/50?cb=20150312005229`
        let m2 = `https://raw.communitydragon.org/t/latest/plugins/rcp-fe-lol-profiles/global/default/mastery_level2.png`
        let m3 = `https://raw.communitydragon.org/t/latest/plugins/rcp-fe-lol-profiles/global/default/mastery_level3.png`
        let m4 = `https://raw.communitydragon.org/t/latest/plugins/rcp-fe-lol-profiles/global/default/mastery_level4.png`
        let m5 = `https://raw.communitydragon.org/t/latest/plugins/rcp-fe-lol-profiles/global/default/mastery_level5.png`
        let m6 = `https://raw.communitydragon.org/t/latest/plugins/rcp-fe-lol-profiles/global/default/mastery_level6.png`
        let m7 = `https://raw.communitydragon.org/t/latest/plugins/rcp-fe-lol-profiles/global/default/mastery_level7.png`

        let embed = new MessageEmbed()
            .setTitle(`Maestría ${mastery.level} ${champ.name} - ${summoner.summoner_name}`)
            .setDescription('Esto es lo que he encontrado:')
            .addField(`Últimas 10 partidas:`,`${wins}W / ${losses}L`, true)
            .addField('\u200B', '\u200B', true)
            .addField(`Últimas 10 rankeds:`, `${rankedTxt()}`, true)
            .addField('Puntos de maestría:', `${mastery.points.toLocaleString('es-ES')} puntos.`, true)
            .addField('\u200B', '\u200B', true)
            .addField(`Cofre de botín:`, `${mastery.chest?'<:CofreObtenido:857949930362241035> Cofre obtenido.':'<:CofreDisponible:857949847382655016> Cofre disponible.'}`, true)
        if (mastery.level == 1) embed.addField(`Puntos hasta el siguiente nivel:`, `${mastery.next.toLocaleString('es-ES')}`)
        if (mastery.level == 2) embed.addField(`Puntos hasta el siguiente nivel:`, `${mastery.next.toLocaleString('es-ES')}`)
        if (mastery.level == 3) embed.addField(`Puntos hasta el siguiente nivel:`, `${mastery.next.toLocaleString('es-ES')}`)
        if (mastery.level == 4) embed.addField(`Puntos hasta el siguiente nivel:`, `${mastery.next.toLocaleString('es-ES')}`)
        if (mastery.level == 5) embed.addField(`Insignias de nivel 6 obtenidas:`, `<:6Token:857944470426746912> ${mastery.tokens} insignias.`)
        if (mastery.level == 6) embed.addField(`Insignias de nivel 7 obtenidas:`, `<:7Token:857944880734142475> ${mastery.tokens} insignias.`)
        if (mastery.level == 1) embed.setThumbnail(m1)
        if (mastery.level == 2) embed.setThumbnail(m2)
        if (mastery.level == 3) embed.setThumbnail(m3)
        if (mastery.level == 4) embed.setThumbnail(m4)
        if (mastery.level == 5) embed.setThumbnail(m5)
        if (mastery.level == 6) embed.setThumbnail(m6)
        if (mastery.level == 7) embed.setThumbnail(m7)
        embed.setImage(`http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champ.id}_0.jpg`)
        embed.setFooter(`Solicitado por ${interaction.member.user.username}`,`https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}`)
        embed.setTimestamp()
        return embed
        
    }  
}