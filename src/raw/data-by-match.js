module.exports.get = async function(region, matchId) {
    let fetch = require("node-fetch");
    var data = await fetch(`https://${region}.api.riotgames.com/lol/match/v4/matches/${matchId}`, {
        headers: {"X-Riot-Token": process.env.RIOTAPI}
    }); var data = data.json()
    return data
}