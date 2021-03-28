module.exports.get = async function() {
    let fetch = require("node-fetch")
    var version = await fetch(`https://ddragon.leagueoflegends.com/api/versions.json`)
    var version = await version.json()
    var version = version[0]
    return version
  }