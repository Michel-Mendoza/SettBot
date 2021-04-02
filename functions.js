const fetch = require('node-fetch');

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
    if (!soloqueue) return false;
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

async function verifysummoner (client, message, platform, name, id) {
    const database = client.database;
    const user = database.get(`${message.author.id}`);
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
                const data = await fetch(api);
                const check = await data.json();
                if (check===key) {
                    message.reply(`Account linked successfuly.`)
                    user.verified=true
                    user.summoner=name
                    user.region=region
                    user.save()
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
                const data = await fetch(api);
                const check = await data.json();
                if (check===key) {
                    message.reply(`Cuenta linkeada correctamente.`)
                    user.verified=true
                    user.summoner=name
                    user.region=region
                    user.save()
                    return
                }
                if (!check===key) return message.reply(`La verificación ha fallado, prueba de nuevo más tarde.`)
            }
        }).catch(() => {
            message.reply('La verificación ha fallado, prueba de nuevo más tarde.');
    });
    };
    
};

function emote (client, name) {
    let emotes = client.emojis.cache
    let emote = emotes.find(e => e.name === name)
    return `<:${emote.name}:${emote.id}>`
};

module.exports = {
    summoner_api, mastery_api, soloqueue_api, flexqueue_api, history_api, gamedata_api, livegame_api, championIdentifiers, emote, verifysummoner
}