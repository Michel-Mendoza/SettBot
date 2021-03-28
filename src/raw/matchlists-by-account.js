module.exports.get = async function(region, accountId) {
    let fetch = require("node-fetch");
    var data = await fetch(`https://${region}.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?endIndex=10`, {
        headers: {"X-Riot-Token": process.env.RIOTAPI}
    }); var data = data.json()
    return data
}