module.exports.get = async function(region, accountId) {
    let fetch = require("node-fetch")
    let matchApi = await fetch(`https://${region}.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}`, {
      headers: {"X-Riot-Token": process.env.RIOTAPI}})
    let matchBody = await matchApi.json()

    if (matchBody.matches.length < 10) return false
    
    var partida1 = matchBody.matches[0].gameId
    var partida2 = matchBody.matches[1].gameId
    var partida3 = matchBody.matches[2].gameId
    var partida4 = matchBody.matches[3].gameId
    var partida5 = matchBody.matches[4].gameId
    var partida6 = matchBody.matches[5].gameId
    var partida7 = matchBody.matches[6].gameId
    var partida8 = matchBody.matches[7].gameId
    var partida9 = matchBody.matches[8].gameId
    var partida10 = matchBody.matches[9].gameId
  
    var plat1 = matchBody.matches[0].platformId
    var plat2 = matchBody.matches[1].platformId
    var plat3 = matchBody.matches[2].platformId
    var plat4 = matchBody.matches[3].platformId
    var plat5 = matchBody.matches[4].platformId
    var plat6 = matchBody.matches[5].platformId
    var plat7 = matchBody.matches[6].platformId
    var plat8 = matchBody.matches[7].platformId
    var plat9 = matchBody.matches[8].platformId
    var plat10 = matchBody.matches[9].platformId
  
    let game1Api = await fetch(`https://${plat1}.api.riotgames.com/lol/match/v4/matches/${partida1}`, {
      headers: {"X-Riot-Token": process.env.RIOTAPI}})
    let game1Body = await game1Api.json()
  
    let game2Api = await fetch(`https://${plat2}.api.riotgames.com/lol/match/v4/matches/${partida2}`, {
      headers: {"X-Riot-Token": process.env.RIOTAPI}})
    let game2Body = await game2Api.json()
  
    let game3Api = await fetch(`https://${plat3}.api.riotgames.com/lol/match/v4/matches/${partida3}`, {
      headers: {"X-Riot-Token": process.env.RIOTAPI}})
    let game3Body = await game3Api.json()
  
    let game4Api = await fetch(`https://${plat4}.api.riotgames.com/lol/match/v4/matches/${partida4}`, {
      headers: {"X-Riot-Token": process.env.RIOTAPI}})
    let game4Body = await game4Api.json()
  
    let game5Api = await fetch(`https://${plat5}.api.riotgames.com/lol/match/v4/matches/${partida5}`, {
      headers: {"X-Riot-Token": process.env.RIOTAPI}})
    let game5Body = await game5Api.json()
  
    let game6Api = await fetch(`https://${plat6}.api.riotgames.com/lol/match/v4/matches/${partida6}`, {
      headers: {"X-Riot-Token": process.env.RIOTAPI}})
    let game6Body = await game6Api.json()
  
    let game7Api = await fetch(`https://${plat7}.api.riotgames.com/lol/match/v4/matches/${partida7}`, {
      headers: {"X-Riot-Token": process.env.RIOTAPI}})
    let game7Body = await game7Api.json()
  
    let game8Api = await fetch(`https://${plat8}.api.riotgames.com/lol/match/v4/matches/${partida8}`, {
      headers: {"X-Riot-Token": process.env.RIOTAPI}})
    let game8Body = await game8Api.json()
  
    let game9Api = await fetch(`https://${plat9}.api.riotgames.com/lol/match/v4/matches/${partida9}`, {
      headers: {"X-Riot-Token": process.env.RIOTAPI}})
    let game9Body = await game9Api.json()
  
    let game10Api = await fetch(`https://${plat10}.api.riotgames.com/lol/match/v4/matches/${partida10}`, {
      headers: {"X-Riot-Token": process.env.RIOTAPI}})
    let game10Body = await game10Api.json()
  
    var participantId = game1Body.participantIdentities.find(element => element.player.accountId == accountId)["participantId"] -1
    var participants = game1Body.participants
    var win1 = participants[participantId].stats.win
  
    var participantId = game2Body.participantIdentities.find(element => element.player.accountId == accountId)["participantId"]-1
    var participants = game2Body.participants
    var win2 = participants[participantId].stats.win
  
    var participantId = game3Body.participantIdentities.find(element => element.player.accountId == accountId)["participantId"]-1
    var participants = game3Body.participants
    var win3 = participants[participantId].stats.win
  
    var participantId = game4Body.participantIdentities.find(element => element.player.accountId == accountId)["participantId"]-1
    var participants = game4Body.participants
    var win4 = participants[participantId].stats.win
  
    var participantId = game5Body.participantIdentities.find(element => element.player.accountId == accountId)["participantId"]-1
    var participants = game5Body.participants
    var win5 = participants[participantId].stats.win
  
    var participantId = game6Body.participantIdentities.find(element => element.player.accountId == accountId)["participantId"]-1
    var participants = game6Body.participants
    var win6 = participants[participantId].stats.win
  
    var participantId = game7Body.participantIdentities.find(element => element.player.accountId == accountId)["participantId"]-1
    var participants = game7Body.participants
    var win7 = participants[participantId].stats.win
  
    var participantId = game8Body.participantIdentities.find(element => element.player.accountId == accountId)["participantId"]-1
    var participants = game8Body.participants
    var win8 = participants[participantId].stats.win
  
    var participantId = game9Body.participantIdentities.find(element => element.player.accountId == accountId)["participantId"]-1
    var participants = game9Body.participants
    var win9 = participants[participantId].stats.win
  
    var participantId = game10Body.participantIdentities.find(element => element.player.accountId == accountId)["participantId"]-1
    var participants = game10Body.participants
    var win10 = participants[participantId].stats.win
  
    var victorias = 0, derrotas = 0
  
    if (win1 == true) {var victorias = victorias + 1}
    if (win1 == false) {var derrotas = derrotas + 1}
  
    if (win2 == true) {var victorias = victorias + 1}
    if (win2 == false) {var derrotas = derrotas + 1}
  
    if (win3 == true) {var victorias = victorias + 1}
    if (win3 == false) {var derrotas = derrotas + 1}
  
    if (win4 == true) {var victorias = victorias + 1}
    if (win4 == false) {var derrotas = derrotas + 1}
  
    if (win5 == true) {var victorias = victorias + 1}
    if (win5 == false) {var derrotas = derrotas + 1}
  
    if (win6 == true) {var victorias = victorias + 1}
    if (win6 == false) {var derrotas = derrotas + 1}
  
    if (win7 == true) {var victorias = victorias + 1}
    if (win7 == false) {var derrotas = derrotas + 1}
  
    if (win8 == true) {var victorias = victorias + 1}
    if (win8 == false) {var derrotas = derrotas + 1}
  
    if (win9 == true) {var victorias = victorias + 1}
    if (win9 == false) {var derrotas = derrotas + 1}
  
    if (win10 == true) {var victorias = victorias + 1}
    if (win10 == false) {var derrotas = derrotas + 1}
  
    return `${victorias} Victorias - ${derrotas} Derrotas`
  }