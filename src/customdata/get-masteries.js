module.exports.get = async function(region, summonerId) {

    let fetch = require("node-fetch")
    let masteriesApi = await fetch(`https://${region}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summonerId}`, {
        headers: {"X-Riot-Token": process.env.RIOTAPI}})
    let masteriesBody = await masteriesApi.json()
  
    var version = await fetch(`https://ddragon.leagueoflegends.com/api/versions.json`)
    var version = await version.json()
    var version = version[0]

    let championsApi = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/es_ES/champion.json`)
    let champions = await championsApi.json()
    let datos = Object.values(champions.data)
  
    if(!masteriesBody[0] || !masteriesBody[1] || !masteriesBody[2]) {
      if (!masteriesBody[0]) {
        var champ1Id = 0, champ2Id = 0, champ3Id = 0
        var champ1Level = 0, champ2Level = 0, champ3Level = 0
        var champ1Points = 0, champ2Points = 0, champ3Points = 0
      } else if (!masteriesBody [1] && !masteriesBody[2]) {
        var champ1Id = masteriesBody[0].championId, champ2Id = 0, champ3Id = 0
        var champ1Level = masteriesBody[0].championLevel, champ2Level = 0, champ3Level = 0
        var champ1Points = masteriesBody[0].championPoints, champ2Points = 0, champ3Points = 0
  
        var champ1Name = datos.find(e => e.key == champ1Id).name
  
      } else if (!masteriesBody[2]) {
        var champ1Id = masteriesBody[0].championId, champ2Id = masteriesBody[1].championId, champ3Id = 0
        var champ1Level = masteriesBody[0].championLevel, champ2Level = masteriesBody[1].championLevel, champ3Level = 0
        var champ1Points = masteriesBody[0].championPoints, champ2Points = masteriesBody[1].championPoints, champ3Points = 0
  
        var champ1Name = datos.find(e => e.key == champ1Id).name
        var champ2Name = datos.find(e => e.key == champ2Id).name
      }
    } else {
    var champ1Id = masteriesBody[0].championId, champ2Id = masteriesBody[1].championId, champ3Id = masteriesBody[2].championId
    var champ1Level = masteriesBody[0].championLevel, champ2Level = masteriesBody[1].championLevel, champ3Level = masteriesBody[2].championLevel
    var champ1Points = masteriesBody[0].championPoints, champ2Points = masteriesBody[1].championPoints, champ3Points = masteriesBody[2].championPoints
  
    var champ1Name = datos.find(e => e.key == champ1Id).name
    var champ2Name = datos.find(e => e.key == champ2Id).name
    var champ3Name = datos.find(e => e.key == champ3Id).name
  
    }
  
    let masteryPointsApi = await fetch(`https://${region}.api.riotgames.com/lol/champion-mastery/v4/scores/by-summoner/${summonerId}`, {
        headers: {"X-Riot-Token": process.env.RIOTAPI}})
    let masteryPoints = await masteryPointsApi.json()
  
    var masteryData = {
      champ1: '**1. ' + champ1Name + '** - Nivel ' + champ1Level + ' - ' + champ1Points + ' Puntos.',
      champ2: '**2. ' + champ2Name + '** - Nivel ' + champ2Level + ' - ' + champ2Points + ' Puntos.',
      champ3: '**3. ' + champ3Name + '** - Nivel ' + champ3Level + ' - ' + champ3Points + ' Puntos.',
      totalPoints: masteryPoints
    }; return masteryData
  }