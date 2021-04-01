const Discord = require('discord.js');
const fetch = require('node-fetch');
module.exports = {
    name: 'profile',
    async execute(message, args, client) {
        const database = client.database
        database.create(`${message.author.id}`, {
            locale: 'English',
            verified: false,
            summoner: null,
            region: null
        });
        const userdata = database.get(`${message.author.id}`)
        const missing_args = {
            English: 'you must tell the region and summoner name to use this command. You can also try linking your summoner name to your profile with `s.verify`',
            Espanol: 'debes incluir la región y el nombre de invocador para usar este comando. También puedes probar a vincular tu nombre de invocador a tu perfil con `s.verify`'
        };
        if (!args[1]&&userdata.verified==false) {
            if (userdata.locale==='English') return message.reply(missing_args.English)
            if (userdata.locale==='Espanol') return message.reply(missing_args.Espanol)
        };
        if (!args[1]&&userdata.verified==true) {
            var name = userdata.summoner;
            var platform = userdata.region.toUpperCase();
        } else if (args[1]) {
            var platform = args.shift().toUpperCase();
            var name = args.join(' ')
        }
        let knownRegion = [
            "EUW", "EUNE", "NA", "LAS", "LAN"
        ].includes(platform); if (knownRegion == true) {
            if (platform === "EUW") var region = "EUW1"
            if (platform === "EUNE") var region = "EUN1"
            if (platform === "NA") var region = "NA1"
            if (platform === "LAN") var region = "LA1"
            if (platform === "LAS") var region = "LA2"
        };
        const summoner = await summoner_api(region, name);
        const mastery = await mastery_api(region, summoner.summoner_id);
        const soloq = await soloqueue_api(region, summoner.summoner_id);
        const history = await history_api(region, summoner.account_id);
        const last10Games = {
            game1: await gamedata_api(region, history.match_ids[0], summoner.summoner_name),
            game2: await gamedata_api(region, history.match_ids[1], summoner.summoner_name),
            game3: await gamedata_api(region, history.match_ids[2], summoner.summoner_name),
            game4: await gamedata_api(region, history.match_ids[3], summoner.summoner_name),
            game5: await gamedata_api(region, history.match_ids[4], summoner.summoner_name),
            game6: await gamedata_api(region, history.match_ids[5], summoner.summoner_name),
            game7: await gamedata_api(region, history.match_ids[6], summoner.summoner_name),
            game8: await gamedata_api(region, history.match_ids[7], summoner.summoner_name),
            game9: await gamedata_api(region, history.match_ids[8], summoner.summoner_name),
            game10: await gamedata_api(region, history.match_ids[9], summoner.summoner_name),
        };
        const lastgamechamp = await championIdentifiers(history.last_game.champion);
        lastgamechamp.emote = emote(client, lastgamechamp.id);
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
            if (last10Games.gam51.win == true) wins++; else losses++
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
        const champ1Mast = (await championIdentifiers(mastery.one.identifier)).name
        const champ2Mast = (await championIdentifiers(mastery.two.identifier)).name
        const champ3Mast = (await championIdentifiers(mastery.three.identifier)).name
        const champ1Emote = emote(client, (await championIdentifiers(mastery.one.identifier)).id)
        const champ2Emote = emote(client, (await championIdentifiers(mastery.two.identifier)).id)
        const champ3Emote = emote(client, (await championIdentifiers(mastery.three.identifier)).id)
        const mastery1 = `**1.${champ1Emote} ${champ1Mast} [${mastery.one.level}]** - ${mastery.one.points.toLocaleString('es-ES')}`
        const mastery2 = `**2.${champ2Emote} ${champ2Mast} [${mastery.two.level}]** - ${mastery.two.points.toLocaleString('es-ES')}`
        const mastery3 = `**3.${champ3Emote} ${champ3Mast} [${mastery.three.level}]** - ${mastery.three.points.toLocaleString('es-ES')}`
        const winrate = `${Math.trunc((soloq.wins * 100) / (soloq.wins + soloq.losses))}% Winrate`
        var cola = history.last_game.queue
        if (userdata.locale==='Espanol') {
            if (cola == 420 || cola == 440 || cola == 700) {
                if (cola == 420) {
                  var cola = 'Clasificatoria Solo/Dúo'
                }
                if (cola == 440) {
                  var cola = 'Clasificatoria Flexible'
                }
                if (cola == 700) {
                  var cola = 'Clash'
                }
              } else {var cola = 'Normal'}
        } else if (userdata.locale==='English') {
            if (cola == 420 || cola == 440 || cola == 700) {
                if (cola == 420) {
                  var cola = 'Ranked Solo/Duo'
                }
                if (cola == 440) {
                  var cola = 'Ranked flex'
                }
                if (cola == 700) {
                  var cola = 'Clash'
                }
              } else {var cola = 'Normal'}
        }
        const embed_espanol = new Discord.MessageEmbed()
            .setAuthor(`Perfil de ${platform} ${summoner.summoner_name}`, summoner.summoner_icon)
            .setDescription('Esto es lo que he encontrado:')
            .addField('Nivel:', summoner.summoner_lvl, true)
            .addField('Últimas 10 Partidas:', `${wins} Victorias - ${losses} Derrotas`, true)
            .addField('‎', '‎', true)
            .addField('Campeones con mayor maestría:', `${mastery1}\n${mastery2}\n${mastery3}`, true)
            .addField('Estadísticas en Clasificatoria Solo/Dúo:', soloq==false?'Sin clasificar.':`${soloq.tier} ${soloq.rank}\n${soloq.lp} puntos de liga.\n${winrate}`, true)
            .addField('Última partida:', `${last10Games.game1.remake?`⚙️ **Remake** en ${cola} con ${lastgamechamp.emote} **${lastgamechamp.name}**.`:`${last10Games.game1.win?`✅ **Victoria** en ${cola} con ${lastgamechamp.emote} **${lastgamechamp.name}** KDA: ${last10Games.game1.kda.kills}/${last10Games.game1.kda.deaths}/${last10Games.game1.kda.assists} - Minions: ${last10Games.game1.cs}`:`❌ **Derrota** en ${cola} con ${lastgamechamp.emote} **${lastgamechamp.name}** KDA: ${last10Games.game1.kda.kills}/${last10Games.game1.kda.deaths}/${last10Games.game1.kda.assists} - Minions: ${last10Games.game1.cs}`}`}`)
            .setFooter(`Solicitado por ${message.author.username}`, message.author.avatarURL())
            .setTimestamp(new Date());
        
        const embed_english = new Discord.MessageEmbed()
            .setAuthor(`Profile of ${platform} ${summoner.summoner_name}`, summoner.summoner_icon)
            .setDescription(`I've found this:`)
            .addField('Level:', summoner.summoner_lvl, true)
            .addField('Last 10 Games:', `${wins} Wins - ${losses} Losses`, true)
            .addField('‎', '‎', true)
            .addField('Champions with better mastery:', `${mastery1}\n${mastery2}\n${mastery3}`, true)
            .addField('Ranked Solo/Duo stats:', soloq==false?'Unranked.':`${soloq.tier} ${soloq.rank}\n${soloq.lp} league points.\n${winrate}`, true)
            .addField('Last game:', `${last10Games.game1.remake?`⚙️ **Remake** in ${cola} with ${lastgamechamp.emote} **${lastgamechamp.name}**.`:`${last10Games.game1.win?`✅ **Victory** in ${cola} with ${lastgamechamp.emote} **${lastgamechamp.name}** KDA: ${last10Games.game1.kda.kills}/${last10Games.game1.kda.deaths}/${last10Games.game1.kda.assists} - Minions: ${last10Games.game1.cs}`:`❌ **Defeat** in ${cola} with ${lastgamechamp.emote} **${lastgamechamp.name}** KDA: ${last10Games.game1.kda.kills}/${last10Games.game1.kda.deaths}/${last10Games.game1.kda.assists} - Minions: ${last10Games.game1.cs}`}`}`)
            .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL())
            .setTimestamp(new Date());
            if (userdata.locale==='Espanol') {
                message.reply(embed_espanol)
            } else if (userdata.locale==='English') {
                message.reply(embed_english)
            }
        async function summoner_api (region, name)  {
            const api = `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${process.env.RIOTAPI}`;
            const data = await fetch(api);
            const json = await data.json();
            const versions = await fetch(`https://ddragon.leagueoflegends.com/api/versions.json`)
            const version = await versions.json()
            if (!json.name) return false;
            const summoner_name = json.name;
            const summoner_id = json.id;
            const account_id = json.accountId;
            const summoner_lvl = json.summonerLevel;
            const summoner_icon = `http://ddragon.leagueoflegends.com/cdn/${version[0]}/img/profileicon/${json.profileIconId}.png`;
            return {
                summoner_name, summoner_id, account_id, summoner_lvl, summoner_icon
            };
        };

        async function mastery_api (region, id) {
            const api = `https://${region}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${id}?api_key=${process.env.RIOTAPI}`;
            const data = await fetch(api);
            const json = await data.json();
            if (json.length < 3) return false;
            return {
                one: {
                    identifier: json[0].championId,
                    level: json[0].championLevel,
                    points: json[0].championPoints,
                    nextLevel: json[0].championPointsUntilNextLevel,
                    tokens: json[0].tokensEarned,
                    chest: json[0].chestGranted
                }, two: {
                    identifier: json[1].championId,
                    level: json[1].championLevel,
                    points: json[1].championPoints,
                    nextLevel: json[1].championPointsUntilNextLevel,
                    tokens: json[1].tokensEarned,
                    chest: json[1].chestGranted
                }, three: {
                    identifier: json[2].championId,
                    level: json[2].championLevel,
                    points: json[2].championPoints,
                    nextLevel: json[2].championPointsUntilNextLevel,
                    tokens: json[2].tokensEarned,
                    chest: json[2].chestGranted
                }
            };
        };

        async function soloqueue_api (region, id) {
            const api = `https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}?api_key=${process.env.RIOTAPI}`;
            const data = await fetch(api);
            const json = await data.json();
            const soloqueue = json.find(e => e.queueType === 'RANKED_SOLO_5x5')
            if (!soloqueue.tier) return false;
            const tier = soloqueue.tier.toLowerCase();
            return {
                tier: tier.charAt(0).toUpperCase() + tier.slice(1), 
                rank: soloqueue.rank, 
                lp: soloqueue.leaguePoints,
                wins: soloqueue.wins,
                losses: soloqueue.losses
            };
        };

        async function flexqueue_api (region, id) {
            const api = `https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}?api_key=${process.env.RIOTAPI}`;
            const data = await fetch(api);
            const json = await data.json();
            const flexqueue = json.find(e => e.queueType === 'RANKED_FLEX_SR')
            if (!flexqueue.tier) return false;
            const tier = flexqueue.tier.toLowerCase();
            return {
                tier: tier.charAt(0).toUpperCase() + tier.slice(1), 
                rank: flexqueue.rank, 
                lp: flexqueue.leaguePoints,
                wins: flexqueue.wins,
                losses: flexqueue.losses
            };
        };

        async function history_api (region, id) {
            const api = `https://${region}.api.riotgames.com/lol/match/v4/matchlists/by-account/${id}?api_key=${process.env.RIOTAPI}`;
            const data = await fetch(api);
            const json = await data.json();
            const matches = json.matches
            if (matches.length < 10) return false;
            const last_game = {
                champion: matches[0].champion, queue: matches[0].queue, date: new Date(matches[0].timestamp)
            };
            const match_ids = [
                matches[0].gameId,matches[1].gameId,matches[2].gameId,matches[3].gameId,matches[4].gameId,
                matches[5].gameId,matches[6].gameId,matches[7].gameId,matches[8].gameId,matches[9].gameId,
            ];
            return {
                last_game, match_ids
            };
        };
        
        async function gamedata_api (region, game, name) {
            const api = `https://${region}.api.riotgames.com/lol/match/v4/matches/${game}?api_key=${process.env.RIOTAPI}`;
            const data = await fetch(api);
            const json = await data.json();
            var minutes = json.gameDuration/60
            var segs = (minutes-(Math.trunc(minutes)))*60
            if (segs < 10) var segs = `0${Math.trunc(segs)}`; else var segs = Math.trunc(segs);
            const game_duration = ` ${Math.trunc(minutes)}:${segs}`;
            const remake = json.gameDuration<300?true:false;
            const player = json.participantIdentities.find(e => e.player.summonerName === name);
            const participant = json.participants[player.participantId - 1];
            return {
                remake, game_duration,
                items: {
                    trinket: participant.stats.item6,
                    item1: participant.stats.item0,
                    item2: participant.stats.item1,
                    item3: participant.stats.item2,
                    item4: participant.stats.item3,
                    item5: participant.stats.item4,
                    item6: participant.stats.item5
                }, kda: {
                    kills: participant.stats.kills,
                    deaths: participant.stats.deaths,
                    assists: participant.stats.assists
                }, summoners: {
                    spell1: participant.spell1Id, spell2: participant.spell2Id
                }, win: participant.stats.win, cs: participant.stats.totalMinionsKilled + participant.stats.neutralMinionsKilled
            };
        };

        async function livegame_api (region, id) {
    
        };
        
        async function championIdentifiers (identifier) {
            const versions = await fetch(`https://ddragon.leagueoflegends.com/api/versions.json`);
            const version = await versions.json();
            const api = `https://ddragon.leagueoflegends.com/cdn/${version[0]}/data/es_ES/champion.json`;
            const data = await fetch(api);
            const json = await data.json();
        
            const datos = Object.values(json.data)
            if (typeof identifier === 'number') {
                const championObject = datos.find(e => e.key == identifier);
                return {
                    key: championObject.key,
                    id: championObject.id,
                    name: championObject.name
                };
            } else {
                const championObject = datos.find(e => e.id.toLowerCase() == identifier.toLowerCase());
                return {
                    key: championObject.key,
                    id: championObject.id,
                    name: championObject.name
                };
            };
        };

        function emote (client, name) {
            let emotes = client.emojis.cache
            let emote = emotes.find(e => e.name.toLowerCase() === name.toLowerCase())
            return `<:${emote.name}:${emote.id}>`
        };
    }
}