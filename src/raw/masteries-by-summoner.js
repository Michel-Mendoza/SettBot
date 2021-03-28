module.exports.get = async function(region, summonerId) {
    let fetch = require("node-fetch");
    var data = await fetch(`https://${region}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summonerId}`, {
        headers: {"X-Riot-Token": process.env.RIOTAPI}
    }); var data = data.json()
    return data
}