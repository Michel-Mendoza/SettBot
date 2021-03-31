module.exports.get = async function(region, accountId, client) {
    let fetch = require("node-fetch")
    let matchApi = await fetch(`https://${region}.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}`, {
        headers: {"X-Riot-Token": process.env.RIOTAPI}})
    let matchBody = await matchApi.json()
  
    var gameId = matchBody.matches[0].gameId
    var platformId = matchBody.matches[0].platformId
    var lastChamp = matchBody.matches[0].champion
  
    var gameInfo = await fetch(`https://${platformId}.api.riotgames.com/lol/match/v4/matches/${gameId}`, {
        headers: {"X-Riot-Token": process.env.RIOTAPI}})
    var gameInfo = await gameInfo.json()
  
    var participantId = gameInfo.participantIdentities.find(element => element.player.accountId == accountId)["participantId"] - 1
    var participants = gameInfo.participants
    var win = participants[participantId].stats.win
    var cola = gameInfo.queueId
  
    if (cola == 420 || cola == 440 || cola == 700) {
      if (cola == 420) {
        var cola = 'Clasificatoria Solo/Dúo'
      }
      if (cola == 440) {
        var cola = 'Clasificatoria Flexible'
      }
      if (cola == 700) {
        var cola = 'Clash'
      }
    } else {var cola = 'Normal'}

    var version = await fetch(`https://ddragon.leagueoflegends.com/api/versions.json`)
    var version = await version.json()
    var version = version[0]

    let championsApi = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/es_ES/champion.json`)
    let champions = await championsApi.json()

    let datos = Object.values(champions.data)
    let lastChampName = datos.find(e => e.key == lastChamp).name

    function getEmote(client, name) {
      let emotes = client.emojis.cache
      let emote = emotes.find(e => e.name.toLowerCase() === name.toLowerCase())
      return `<:${emote.name}:${emote.id}>`
    }
    let lastChampEmote = (client, (datos.find(e => e.key == lastChamp).id))
  
    var kda = `${participants[participantId].stats.kills}/${participants[participantId].stats.deaths}/${participants[participantId].stats.assists}`
    var minions = participants[participantId].stats.totalMinionsKilled + participants[participantId].stats.neutralMinionsKilled
    
    if (win == true) var lastGameMessage = `✅ **Victoria** en ${cola} con **${lastChampEmote}${lastChampName} .** KDA: ${kda}. Minions: ${minions}`
    else var lastGameMessage = `❌ **Derrota** en ${cola} con **${lastChampEmote}${lastChampName} .** KDA: ${kda}. Minions: ${minions}`
    return lastGameMessage
  }
  