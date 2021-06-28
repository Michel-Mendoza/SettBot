const Discord = require('discord.js')
module.exports = {
    name: "profile",
    description: "Muestra datos de un invocador como su winrate de ranked e información sobre las últimas partidas.",
    options: [
    require('../cmdoptions/region.js'),
    require('../cmdoptions/summonername.js')
    ], msg: async (args, interaction, client) => {
        const functions = client.functions
        let region = args[0].value
        let name = args[1].value

        let platform = function (region) {
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
    
        const mastery = await functions.mastery_api(region, summoner.summoner_id);
        const soloq = await functions.soloqueue_api(region, summoner.summoner_id);
        const history = await functions.history_api(region, summoner.account_id); if (history == false) return `No hay suficientes datos para mostrar.`
        var last10Games = {
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
        const mainrole = await functions.main_role(region, summoner.account_id);
        const livegame = await functions.livegame_api(region, summoner.summoner_id);
        const lastgamechamp = await functions.championIdentifiers(history.last_game.champion);
        lastgamechamp.emote = functions.emote(client, lastgamechamp.id);
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
    
        const champ1Mast = (await functions.championIdentifiers(mastery.one.identifier)).name;
        const champ2Mast = (await functions.championIdentifiers(mastery.two.identifier)).name;
        const champ3Mast = (await functions.championIdentifiers(mastery.three.identifier)).name;
        const champ1Emote = functions.emote(client, (await functions.championIdentifiers(mastery.one.identifier)).id);
        const champ2Emote = functions.emote(client, (await functions.championIdentifiers(mastery.two.identifier)).id);
        const champ3Emote = functions.emote(client, (await functions.championIdentifiers(mastery.three.identifier)).id);
    
    
        var mastery1 = `${champ1Emote} **[${mastery.one.level}]** 1. ${champ1Mast} - ${mastery.one.points.toLocaleString('es-ES')}`
        var mastery2 = `${champ2Emote} **[${mastery.two.level}]** 2. ${champ2Mast} - ${mastery.two.points.toLocaleString('es-ES')}`
        var mastery3 = `${champ3Emote} **[${mastery.three.level}]** 3. ${champ3Mast} - ${mastery.three.points.toLocaleString('es-ES')}`
    
        const winrate = `${Math.trunc((soloq.wins * 100) / (soloq.wins + soloq.losses))}% WR`
        var queueid = history.last_game.queue
    
        function queue (id) {
            if (id == 420 || id == 440 || id == 700 || id == 430 || id == 400 || id == 450) {
                if (id == 420) {
                  return '**Ranked Solo/Dúo**'
                }
                if (id == 440) {
                    return '**Ranked Flex**'
                }
                if (id == 700) {
                    return '**Clash**'
                }
                if (id == 430) {
                    return '**Normal a ciegas**'
                }
                if (id == 400) {
                    return '**Normal reclutamiento**'
                }
                if (id == 450) {
                    return '**ARAM**'
                }
            } else return '**Modo de tiempo limitado**'
        }
        function time2string($time) {
            var delta = $time / 1000;
    
            var days = Math.floor(delta / 86400);
            delta -= days * 86400;
            
            var hours = Math.floor(delta / 3600) % 24;
            delta -= hours * 3600;
            
            var minutes = Math.floor(delta / 60) % 60;
            delta -= minutes * 60;
            
            var seconds = Math.floor(delta % 60);
        
            $time_str = days+'d , '+hours+'h, '+minutes+'min y '+seconds+'s ';
        
            return $time_str;
        }
    
        const lgame = last10Games.game1
        const $1eng = function () {
            if (last10Games.game1.remake) return`⚙️ **Remake** en ${queue(queueid)} con ${lastgamechamp.emote} **${lastgamechamp.name}**.`
            else if (last10Games.game1.win == true) return `✅ **Victoria** en ${queue(queueid)} con ${lastgamechamp.emote} **${lastgamechamp.name}** - KDA: ${last10Games.game1.kda.kills}/${last10Games.game1.kda.deaths}/${last10Games.game1.kda.assists} - Minions: ${last10Games.game1.cs}`
            else return `<:white_x:856990753292288010> **Derrota** en ${queue(queueid)} con ${lastgamechamp.emote} **${lastgamechamp.name}** - KDA: ${last10Games.game1.kda.kills}/${last10Games.game1.kda.deaths}/${last10Games.game1.kda.assists} - Minions: ${last10Games.game1.cs}`
        }
        const $2eng = `🕐 **Duración de la partida:** ${lgame.game_duration} - 📆 Hace ${time2string(history.last_game.time_ago+lgame.timestamp)} atrás.`
        const $eng = $1eng() + '\n' + $2eng

        function rankedTxt () {
            if (soloq == false) return 'Sin clasificar'
            else return `${functions.emote(client, `${soloq.tier}Emote`)} ${soloq.tier} ${soloq.rank} en ${soloq.wins+soloq.losses} partidas\n${soloq.lp} ${soloq.lp == 1?'Punto de liga':'Puntos de liga'}\n${winrate} (${soloq.wins}W / ${soloq.losses}L)`
        }

        async function livegameTxt () {
            if (!livegame) return `Este invocador no se encuentra en partida.`
            else {
                let cola = queue(livegame.queue)
                let champion = await functions.championIdentifiers(livegame.champion)
                let champName = champion.name
                let champId = champion.id
                let emote = functions.emote(client, champId)
                return `Este invocador está jugando **${cola}** con ${emote} **${champName}**.`
            }
        }
        
        const embed = new Discord.MessageEmbed()
            .setAuthor(`Perfil de ${summoner.summoner_name} - ${platform(region)}`, summoner.summoner_icon)
            .setDescription(`Esto es lo que he encontrado:\nRole preferido del jugador: **${mainrole.main_role} (${mainrole.games_main} partidas recientes)**`)
            .addField('Nivel:', summoner.summoner_lvl, true)
            .addField('Puntuación de maestría:', `${mastery.score} puntos en total.`, true)
            .addField('Últimas 10 partidas:', `${gametxt=='No hay datos.'?gametxt:`${wins}W / ${losses}L`}`, true)
            .addField('Campeones con mayor maestría:', `${mastery1} puntos.\n${mastery2} puntos.\n${mastery3} puntos.`, true)
            .addField('Estadísticas en Solo/Dúo:', rankedTxt(), true)
            .addField('Jugando ahora:', await livegameTxt())
            .addField('Última partida:', `${gametxt=='No hay datos.'?gametxt:$eng}`)
            .setFooter(`Solicitado por ${interaction.member.user.username}`,`https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}`)
            .setTimestamp();
            return embed
    }
}