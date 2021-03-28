module.exports.get = async function(key) {
    let fetch = require("node-fetch")
    var version = await fetch(`https://ddragon.leagueoflegends.com/api/versions.json`)
    var version = await version.json()
    var version = version[0]

    let summonerSpellsApi = await fetch(`http://ddragon.leagueoflegends.com/cdn/${version}/data/es_ES/summoner.json`)
    let summonerSpellsBody = await summonerSpellsApi.json()
  
    let datos = Object.values(summonerSpellsBody.data)
    let findSummonerSpell = datos.find(e => e.key == key)
  
    var summonerSpell = findSummonerSpell.id.toString()
  
    if (summonerSpell === "SummonerFlash") var summonerSpell = "<:SummonerFlash:813065099640045628>"
    if (summonerSpell === "SummonerBarrier") var summonerSpell = "<:SummonerBarrier:813065322806247444>"
    if (summonerSpell === "SummonerDot") var summonerSpell = "<:SummonerDot:813065563475673118>"
    if (summonerSpell === "SummonerExhaust") var summonerSpell = "<:SummonerExhaust:813065658853097482>"
    if (summonerSpell === "SummonerHeal") var summonerSpell = "<:SummonerHeal:813065905600069642>"
    if (summonerSpell === "SummonerMana") var summonerSpell = "<:SummonerMana:813066023480852530>"
    if (summonerSpell === "SummonerSmite") var summonerSpell = "<:SummonerSmite:813066269543759913>"
    if (summonerSpell === "SummonerSnowball") var summonerSpell = "<:SummonerSnowball:813066389874278440>"
    if (summonerSpell === "SummonerTeleport") var summonerSpell = "<:SummonerTeleport:813066456555061258>"
    if (summonerSpell === "SummonerBoost") var summonerSpell = "<:SummonerBoost:813065444645666826>"
    if (summonerSpell === "SummonerHaste") var summonerSpell = "<:SummonerHaste:813065785617809479>"
  
    return summonerSpell
  }