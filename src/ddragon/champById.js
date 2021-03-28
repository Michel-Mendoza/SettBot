module.exports.get = async function checkChampionIdentifiers(id) {
    let fetch = require("node-fetch")
    var version = await fetch(`https://ddragon.leagueoflegends.com/api/versions.json`)
    var version = await version.json()
    var version = version[0]
    
    let championsApi = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/es_ES/champion.json`)
    let champions = await championsApi.json()
  
    let datos = Object.values(champions.data)
    let championObject = datos.find(e => e.id.toLowerCase() == id.toLowerCase())
  
    if (!championObject) return false

    var identifiers = {
      key: championObject.key,
      id: championObject.id,
      name: championObject.name
    }
  
    return identifiers
  }