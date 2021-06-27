const fetch = require('node-fetch');
const { URL } = require("url");

module.exports = {
    summoner_api: async (region, name) => {
        const api = `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${process.env.RIOTAPI}`;
        const data = await fetch(new URL(api));
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
    },

    mastery_api: async (region, id) => {
        const api = `https://${region}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${id}?api_key=${process.env.RIOTAPI}`;
        const data = await fetch(new URL(api));
        const api2 = `https://${region}.api.riotgames.com/lol/champion-mastery/v4/scores/by-summoner/${id}?api_key=${process.env.RIOTAPI}`;
        const data2 = await fetch(api2);
        const json2 = await data2.json();
        const json = await data.json();
        if (json.length < 3) return false;
        return {
            score: json2,
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
    },

    soloqueue_api: async (region, id) => {
        const api = `https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}?api_key=${process.env.RIOTAPI}`;
        const data = await fetch(new URL(api));
        const json = await data.json();
        const soloqueue = json.find(e => e.queueType === 'RANKED_SOLO_5x5')
        if (!soloqueue) return false;
        const tier = soloqueue.tier.toLowerCase()               
            .replace('iron','Hierro')  
            .replace('bronze','Bronce')
            .replace('silver','Plata')
            .replace('gold','Oro')
            .replace('platinum','Platino')
            .replace('diamond','Diamante');
        return {
            tier, 
            rank: soloqueue.rank, 
            lp: soloqueue.leaguePoints,
            wins: soloqueue.wins,
            losses: soloqueue.losses
        };
    },

    flexqueue_api: async (region, id) => {
        const api = `https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}?api_key=${process.env.RIOTAPI}`;
        const data = await fetch(new URL(api));
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
    },  

    history_api: async (region, id) => {
        const api = `https://${region}.api.riotgames.com/lol/match/v4/matchlists/by-account/${id}?api_key=${process.env.RIOTAPI}`;
        const data = await fetch(new URL(api));
        const json = await data.json();
        const matches = json.matches
        if (matches.length < 10) return false;
        const last_game = {
            champion: matches[0].champion, queue: matches[0].queue, time_ago: Date.now() - matches[0].timestamp
        };
        const match_ids = [
            matches[0].gameId,matches[1].gameId,matches[2].gameId,matches[3].gameId,matches[4].gameId,
            matches[5].gameId,matches[6].gameId,matches[7].gameId,matches[8].gameId,matches[9].gameId,
        ];
        return {
            last_game, match_ids
        };
    },

    history_specific: async (region, id, key) => {
        const api = `https://${region}.api.riotgames.com/lol/match/v4/matchlists/by-account/${id}?champion=${key}&api_key=${process.env.RIOTAPI}`;
        const data = await fetch(new URL(api));
        const json = await data.json();
        const matches = json.matches
        if (matches.length < 10) return false;
        const last_game = {
            champion: matches[0].champion, queue: matches[0].queue, time_ago: Date.now() - matches[0].timestamp
        };
        const match_ids = [
            matches[0].gameId,matches[1].gameId,matches[2].gameId,matches[3].gameId,matches[4].gameId,
            matches[5].gameId,matches[6].gameId,matches[7].gameId,matches[8].gameId,matches[9].gameId,
        ];
        return {
            last_game, match_ids
        };
    },

    soloq_history_specific: async (region, id, key) => {
        const api = `https://${region}.api.riotgames.com/lol/match/v4/matchlists/by-account/${id}?champion=${key}&queue=420&api_key=${process.env.RIOTAPI}`;
        const data = await fetch(new URL(api));
        const json = await data.json();
        const matches = json.matches
        if (!matches || matches.length < 10) return false;
        const last_game = {
            champion: matches[0].champion, queue: matches[0].queue, time_ago: Date.now() - matches[0].timestamp
        };
        const match_ids = [
            matches[0].gameId,matches[1].gameId,matches[2].gameId,matches[3].gameId,matches[4].gameId,
            matches[5].gameId,matches[6].gameId,matches[7].gameId,matches[8].gameId,matches[9].gameId,
        ];
        return {
            last_game, match_ids
        };
    },

    mastery_specific: async (region, id, key) => {
        const api = `https://${region}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${id}/by-champion/${key}?api_key=${process.env.RIOTAPI}`
        const data = await fetch(new URL(api))
        const json = await data.json()
        if (!json.championLevel) return false
        return {
            level: json.championLevel,
            points: json.championPoints,
            next: json.championPointsUntilNextLevel,
            tokens: json.tokensEarned,
            chest: json.chestGranted
        }
    },

    gamedata_api: async (region, game, name) => {
        const api = `https://${region}.api.riotgames.com/lol/match/v4/matches/${game}?api_key=${process.env.RIOTAPI}`;
        const data = await fetch(new URL(api));
        const json = await data.json();
        var minutes = json.gameDuration/60
        var segs = (minutes-(Math.trunc(minutes)))*60
        if (segs < 10) var segs = `0${Math.trunc(segs)}`; else var segs = Math.trunc(segs);
        const game_duration = ` ${Math.trunc(minutes)}:${segs}`;
        const remake = json.gameDuration<300?true:false;
        const player = json.participantIdentities.find(e => e.player.summonerName === name);
        const participant = json.participants[player.participantId - 1];
        return {
            remake, game_duration, timestamp: json.gameDuration*1000,
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
    },

    livegame_api: async (region, id) => {
        const api = `https://${region}.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${id}?api_key=${process.env.RIOTAPI}`
        const data = await fetch(new URL(api));
        const json = await data.json();
        if (!json.gameId) return 
        let participant = json.participants.find(e => e.summonerId === `${id}`);
        return {
            queue: json.gameQueueConfigId,
            champion: participant.championId
        }
    },

    main_role: async (region, id) => {
        const api = `https://${region}.api.riotgames.com/lol/match/v4/matchlists/by-account/${id}?endIndex=100&api_key=${process.env.RIOTAPI}`
        const data = await fetch(new URL(api));
        const games = await data.json();
        
        const games_by_lane = games.matches.reduce((acc, curr) => {
            acc[curr.lane] = (acc[curr.lane]||0) + 1
            
            return acc;
            }, {})
            let a = Object.entries(games_by_lane).sort((a, b) => b[1] - a[1])[0]
            if (a[0] !== 'TOP' && a[0] !== 'MID' && a[0] !== 'JUNGLE') {
              const games_by_role = games.matches.reduce((acc, curr) => {
                acc[curr.role] = (acc[curr.role]||0) + 1
              return acc;
              }, {})
              var b = Object.entries(games_by_role).sort((a, b) => b[1] - a[1])[0]
            }
            
            if (!b) {
              var role = a[0]
                .replace('TOP', 'Top')
                .replace('MID', 'Mid')
                .replace('JUNGLE', 'Jungla')
              var played = a[1]
            } else {
              var role = b[0]
                .replace('DUO_CARRY', 'Tirador')
                .replace('DUO_SUPPORT', 'Soporte')
                .replace('NONE', 'Jungla')
              var played = b[1]
            }
            return {main_role:role, games_main:played}

    },

    main_champs: async (region, id) => {
        const api = `https://${region}.api.riotgames.com/lol/match/v4/matchlists/by-account/${id}?endIndex=100&api_key=${process.env.RIOTAPI}`
        const data = await fetch(new URL(api));
        const games = await data.json();
        const games_by_champ = games.matches.reduce((acc, curr) => {
            acc[curr.champion] = (acc[curr.champion]||0) + 1
            return acc;
            }, {})
        return Object.entries(games_by_champ).sort((a, b) => b[1] - a[1])[0]
    },

    championIdentifiers: async (identifier) => {
        const versions = await fetch(`https://ddragon.leagueoflegends.com/api/versions.json`);
        const version = await versions.json();
        const api = `https://ddragon.leagueoflegends.com/cdn/${version[0]}/data/es_ES/champion.json`;
        const data = await fetch(new URL(api));
        const json = await data.json();
        const datos = Object.values(json.data)
        if (typeof identifier === 'number') {
            const championObject = datos.find(e => e.key == identifier);
            if (!championObject) return false
            return {
                key: championObject.key,
                id: championObject.id,
                name: championObject.name
            };
        } else {
            const championObject = datos.find(e => e.id.toLowerCase() == identifier.replace('Wukong', 'MonkeyKing').toLowerCase());
            if (!championObject) return false
            return {
                key: championObject.key,
                id: championObject.id,
                name: championObject.name
            };
        };
    },

    emote: (client, name) => {
        let emotes = client.emojis.cache
        let emote = emotes.find(e => e.name === name)
        if (!emote) {
            emote = emotes.find(e => e.name == name)
        }
        return `<:${emote.name}:${emote.id}>`
    },

    multisearch_txt: async (region, name, client) => {
        const summoner1 = await client.functions.summoner_api(region, name)
        const history1 = await client.functions.history_api(region, summoner1.account_id)
        const main_champ = await client.functions.main_champs(region, summoner1.account_id)
        const soloq = await client.functions.soloqueue_api(region, summoner1.summoner_id);
        const last10Games1 = {
            game1: await client.functions.gamedata_api(region, history1.match_ids[0], summoner1.summoner_name),
            game2: await client.functions.gamedata_api(region, history1.match_ids[1], summoner1.summoner_name),
            game3: await client.functions.gamedata_api(region, history1.match_ids[2], summoner1.summoner_name),
            game4: await client.functions.gamedata_api(region, history1.match_ids[3], summoner1.summoner_name),
            game5: await client.functions.gamedata_api(region, history1.match_ids[4], summoner1.summoner_name),
            game6: await client.functions.gamedata_api(region, history1.match_ids[5], summoner1.summoner_name),
            game7: await client.functions.gamedata_api(region, history1.match_ids[6], summoner1.summoner_name),
            game8: await client.functions.gamedata_api(region, history1.match_ids[7], summoner1.summoner_name),
            game9: await client.functions.gamedata_api(region, history1.match_ids[8], summoner1.summoner_name),
            game10: await client.functions.gamedata_api(region, history1.match_ids[9], summoner1.summoner_name),
        };
        var wins1 = 0; var losses1 = 0;
        if (last10Games1.game1.remake == false) {
            if (last10Games1.game1.win == true) wins1++; else losses1++
        } if (last10Games1.game2.remake == false) {
            if (last10Games1.game2.win == true) wins1++; else losses1++
        } if (last10Games1.game3.remake == false) {
            if (last10Games1.game3.win == true) wins1++; else losses1++
        } if (last10Games1.game4.remake == false) {
            if (last10Games1.game4.win == true) wins1++; else losses1++
        } if (last10Games1.game5.remake == false) {
            if (last10Games1.game5.win == true) wins1++; else losses1++
        } if (last10Games1.game6.remake == false) {
            if (last10Games1.game6.win == true) wins1++; else losses1++
        } if (last10Games1.game7.remake == false) {
            if (last10Games1.game7.win == true) wins1++; else losses1++
        } if (last10Games1.game8.remake == false) {
            if (last10Games1.game8.win == true) wins1++; else losses1++
        } if (last10Games1.game9.remake == false) {
            if (last10Games1.game9.win == true) wins1++; else losses1++
        } if (last10Games1.game10.remake == false) {
            if (last10Games1.game10.win == true) wins1++; else losses1++
        };
        let kills = last10Games1.game1.kda.kills +last10Games1.game2.kda.kills +last10Games1.game3.kda.kills +last10Games1.game4.kda.kills +last10Games1.game5.kda.kills +last10Games1.game6.kda.kills +last10Games1.game7.kda.kills +last10Games1.game8.kda.kills +last10Games1.game9.kda.kills +last10Games1.game10.kda.kills
        let deaths = last10Games1.game1.kda.deaths +last10Games1.game2.kda.deaths +last10Games1.game3.kda.deaths +last10Games1.game4.kda.deaths +last10Games1.game5.kda.deaths +last10Games1.game6.kda.deaths +last10Games1.game7.kda.deaths +last10Games1.game8.kda.deaths +last10Games1.game9.kda.deaths +last10Games1.game10.kda.deaths
        let assists = last10Games1.game1.kda.assists +last10Games1.game2.kda.assists +last10Games1.game3.kda.assists +last10Games1.game4.kda.assists +last10Games1.game5.kda.assists +last10Games1.game6.kda.assists +last10Games1.game7.kda.assists +last10Games1.game8.kda.assists +last10Games1.game9.kda.assists +last10Games1.game10.kda.assists
        let winrate = `${Math.trunc((soloq.wins * 100) / (soloq.wins + soloq.losses))}% WR (${soloq.wins+soloq.losses} partidas.)`
        let champ = (await client.functions.championIdentifiers(parseInt(main_champ[0], 10))).name;
        let champtext = `Campeón más jugado recientemente: ${client.functions.emote(client, (await client.functions.championIdentifiers(parseInt(main_champ[0], 10))).name)} **${champ} (${main_champ[1]} partidas)**`
        if (soloq == false) var txt = `<:UnrankedEmote:857652860740042792> **Sin Clasificar** - Últimas 10 partidas: **${wins1}W / ${losses1}L**\n ${champtext}`
        else var txt = `${client.functions.emote(client, `${soloq.tier}Emote`)} **${soloq.tier} ${soloq.rank}** - ${winrate} - Últimas 10 partidas: **${wins1}W / ${losses1}L**\n ${champtext}`
        let kda = (kills + assists) / deaths
        function trunc (x, posiciones = 0) {
            var s = x.toString()
            var l = s.length
            var decimalLength = s.indexOf('.') + 1
            var numStr = s.substr(0, decimalLength + posiciones)
            return Number(numStr)
        } 
        return {
            name: `**${summoner1.summoner_name}** - ${trunc(kda, 2)} KDA Medio`,
            text: txt
        }
    }
};  

async function verifysummoner (client, message, platform, name, id) {
    const db = client.database;
    db.query("CREATE TABLE IF NOT EXISTS usuarios (idusuario BIGINT, locale TEXT, region TEXT, summoner TEXT, isverified boolean)", function(err) {
        if (err) return console.error(err.message)
    })

    db.query(`INSERT INTO usuarios(idusuario, locale, region, summoner, isverified) VALUES(${message.author.id}, 'English', 'None', 'None', false) ON CONFLICT (idusuario) DO NOTHING`, function(err) {
        if (err) return console.error(err.message)
    })
    
    db.query(`SELECT * FROM usuarios`, async (err, filas) => {
        if (err) return console.error(err.message)
        if (!filas) return;
        let user=filas.rows.find(e => e.idusuario == message.author.id)
        let knownRegion = [
            "EUW", "EUNE", "NA", "LAS", "LAN"
        ].includes(platform); if (knownRegion == true) {
            if (platform === "EUW") var region = "EUW1"
            if (platform === "EUNE") var region = "EUN1"
            if (platform === "NA") var region = "NA1"
            if (platform === "LAN") var region = "LA1"
            if (platform === "LAS") var region = "LA2"
        };
        const api = `https://${region}.api.riotgames.com/lol/platform/v4/third-party-code/by-summoner/${id}?api_key=${process.env.RIOTAPI}`;
        function generateString(length) {
            const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = ' ';
            const charactersLength = characters.length;
            for ( let i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }; return result.replace(' ','');
        }; const key = generateString(20)
        if (user.locale==='English') {
            const msg = await message.reply(`okay, now enter the config of your league of legends client and go to "Verification". Then, paste this key (\`${key}\`) and press save, and then react with ✅.`)
            await msg.react('✅');
            msg.awaitReactions((reaction, user) => user.id == message.author.id && reaction.emoji.name == '✅', {
                max: 1, time: 120000
            }).then(async collected => {
                if (collected.first().emoji.name == '✅'==true) {
                    const data = await fetch(new URL(api));
                    const check = await data.json();
                    if (check===key) {
                        message.reply(`Account linked successfuly.`)
                        db.query(`UPDATE usuarios SET isverified = true WHERE idusuario = ${message.author.id}`, function(err) {
                            if (err) return console.error(err.message)
                        })
                        db.query(`UPDATE usuarios SET summoner = '${name}' WHERE idusuario = ${message.author.id}`, function(err) {
                            if (err) return console.error(err.message)
                        })
                        db.query(`UPDATE usuarios SET region = '${region}' WHERE idusuario = ${message.author.id}`, function(err) {
                            if (err) return console.error(err.message)
                        })
                        return
                    }
                    if (!check===key) return message.reply(`Verification failed, try again later.`)
                }
            }).catch(err => console.error(err));
        };
        if (user.locale==='Espanol') {
            const msg = await message.reply(`vale, ahora ve a la configuración de tu cliente de League of Legends y ve a la pestaña "Verificación". Después, introduce esta clave (\`${key}\`) y pulsa guardar, después reacciona con ✅.`)
            await msg.react('✅');
            msg.awaitReactions((reaction, user) => user.id == message.author.id && reaction.emoji.name == '✅', {
                max: 1, time: 120000
            }).then(async collected => {
                if (collected.first().emoji.name == '✅') {
                    const data = await fetch(new URL(api));
                    const check = await data.json();
                    if (check===key) {
                        message.reply(`Cuenta linkeada correctamente.`)
                        db.run(`UPDATE usuarios SET isverified = true WHERE idusuario = ${message.author.id}`, function(err) {
                            if (err) return console.error(err.message)
                        })
                        db.run(`UPDATE usuarios SET summoner = '${name}' WHERE idusuario = ${message.author.id}`, function(err) {
                            if (err) return console.error(err.message)
                        })
                        db.run(`UPDATE usuarios SET region = '${region}' WHERE idusuario = ${message.author.id}`, function(err) {
                            if (err) return console.error(err.message)
                        })
                        return
                    }
                    if (!check===key) return message.reply(`La verificación ha fallado, prueba de nuevo más tarde.`)
                }
            }).catch(() => {
                message.reply('La verificación ha fallado, prueba de nuevo más tarde.');
        });
        };
    })
    
};
