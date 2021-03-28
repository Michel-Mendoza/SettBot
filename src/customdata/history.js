module.exports.get = async function(region, accountId, startIndex) {
    let fetch = require("node-fetch")
    let matchApi = await fetch(`https://${region}.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?beginIndex=${startIndex}`, {
      headers: {"X-Riot-Token": process.env.RIOTAPI}})
    let matchBody = await matchApi.json()

    if (matchBody.matches.length < 5) return false
    
    var plat1 = matchBody.matches[0].platformId
    var plat2 = matchBody.matches[1].platformId
    var plat3 = matchBody.matches[2].platformId
    var plat4 = matchBody.matches[3].platformId
    var plat5 = matchBody.matches[4].platformId

    var partida1 = matchBody.matches[0].gameId
    var partida2 = matchBody.matches[1].gameId
    var partida3 = matchBody.matches[2].gameId
    var partida4 = matchBody.matches[3].gameId
    var partida5 = matchBody.matches[4].gameId 

    async function getGameData(platform, gameId) {
      var game = await fetch(`https://${platform}.api.riotgames.com/lol/match/v4/matches/${gameId}`, {
        headers: {"X-Riot-Token": process.env.RIOTAPI}})
      var game = await game.json()

      var minutes = game.gameDuration/60
      var segs = (minutes-(Math.trunc(minutes)))*60
      if (segs < 10) var segs = `0${Math.trunc(segs)}`; else var segs = Math.trunc(segs)

      let participantData = game.participants[game.participantIdentities.find(e => e.player.accountId == accountId)["participantId"]-1].stats
    
      var response = {
        duration: `${Math.trunc(minutes)}:${segs}`,
        remake: game.gameDuration>300?false:true,
        win: participantData.win,
        kda: `${participantData.kills}/${participantData.deaths}/${participantData.assists}`,
        minions: participantData.totalMinionsKilled + participantData.neutralMinionsKilled,
      }; return response
    }

    let game1Data = getGameData(plat1, partida1)
    let game2Data = getGameData(plat2, partida2)
    let game3Data = getGameData(plat3, partida3)
    let game4Data = getGameData(plat4, partida4)
    let game5Data = getGameData(plat5, partida5)

    var champ1 = matchBody.matches[0].champion, queue1 = matchBody.matches[0].queue
    var champ2 = matchBody.matches[1].champion, queue2 = matchBody.matches[1].queue
    var champ3 = matchBody.matches[2].champion, queue3 = matchBody.matches[2].queue
    var champ4 = matchBody.matches[3].champion, queue4 = matchBody.matches[3].queue
    var champ5 = matchBody.matches[4].champion, queue5 = matchBody.matches[4].queue
  
    let champByKey = require("../ddragon/champByKey.js");
    let getChamp = champByKey.get

    var champ1 = await getChamp(champ1)
    var champ2 = await getChamp(champ2)
    var champ3 = await getChamp(champ3)
    var champ4 = await getChamp(champ4)
    var champ5 = await getChamp(champ5)

    function queue(cola) {
      if (cola == 420 || cola == 440 || cola == 700) {
        if (cola == 420) return 'Clasificatoria Solo/Dúo'
        if (cola == 440) return 'Clasificatoria Flexible'
        if (cola == 700) return 'Clash'
      } else return 'Normal'
    }

    var cola1 = queue(queue1)
    var cola2 = queue(queue2)
    var cola3 = queue(queue3)
    var cola4 = queue(queue4)
    var cola5 = queue(queue5)

    var historyData = {
      game1: {
        id: partida1,
        duration: (await game1Data).duration,
        remake: (await game1Data).remake,
        win: (await game1Data).win,
        kda: (await game1Data).kda,
        cs: (await game1Data).minions,
        cola: cola1,
        champ: champ1.name
      },
      game2: {
        id: partida2,
        duration: (await game2Data).duration,
        remake: (await game2Data).remake,
        win: (await game2Data).win,
        kda: (await game2Data).kda,
        cs: (await game2Data).minions,
        cola: cola2,
        champ: champ2.name
      },
      game3: {
        id: partida3,
        duration: (await game3Data).duration,
        remake: (await game3Data).remake,
        win: (await game3Data).win,
        kda: (await game3Data).kda,
        cs: (await game3Data).minions,
        cola: cola3,
        champ: champ3.name
      },
      game4: {
        id: partida4,
        duration: (await game4Data).duration,
        remake: (await game4Data).remake,
        win: (await game4Data).win,
        kda: (await game4Data).kda,
        cs: (await game4Data).minions,
        cola: cola4,
        champ: champ4.name
      },
      game5: {
        id: partida5,
        duration: (await game5Data).duration,
        remake: (await game5Data).remake,
        win: (await game5Data).win,
        kda: (await game5Data).kda,
        cs: (await game5Data).minions,
        cola: cola5,
        champ: champ5.name
      }
    }; return historyData
}