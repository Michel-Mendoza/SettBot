module.exports.get = async function(region, name) {
    let fetch = require("node-fetch");
    var data = await fetch(`https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}`, {
        headers: {"X-Riot-Token": process.env.RIOTAPI}
    }); var data = data.json()
    return data
}