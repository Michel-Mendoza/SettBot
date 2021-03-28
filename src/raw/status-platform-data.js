module.exports.get = async function(region) {
    let fetch = require("node-fetch");
    var data = await fetch(`https://${region}.api.riotgames.com/lol/status/v4/platform-data`, {
        headers: {"X-Riot-Token": process.env.RIOTAPI}
    }); var data = data.json()
    return data
}