module.exports.get = async function(region, accountId, champion) {
    let fetch = require("node-fetch")
    let matchApi = await fetch(`https://${region}.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?champion=${champion}`, {
        headers: {"X-Riot-Token": process.env.RIOTAPI}})
    let matchBody = await matchApi.json()
  
    var gameId = matchBody.matches[0].gameId
    var platformId = matchBody.matches[0].platformId
  
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

    var kda = `${participants[participantId].stats.kills}/${participants[participantId].stats.deaths}/${participants[participantId].stats.assists}`
    var minions = participants[participantId].stats.totalMinionsKilled + participants[participantId].stats.neutralMinionsKilled
    
    var lastGameMessage = `${win?'✅ **Victoria**':'❌ **Derrota**'} en **${cola}. ** KDA: ${kda}. Minions: ${minions}`
    return lastGameMessage
}