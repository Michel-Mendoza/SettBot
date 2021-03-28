module.exports.get = async function() {
    let fetch = require("node-fetch");
    var data = await fetch(`https://euw1.api.riotgames.com/lol/platform/v3/champion-rotations`, {
        headers: {"X-Riot-Token": process.env.RIOTAPI}
    }); var data = data.json()
    return data
}