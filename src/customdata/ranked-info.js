module.exports.get = async function(region, summonerId) {
    let fetch = require("node-fetch")
    let leagueApi = await fetch(`https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`, {
        headers: {"X-Riot-Token": process.env.RIOTAPI}})
    let leagueBody = await leagueApi.json()
  
    if (!leagueBody[0]) {var elo = "Sin clasificar"}
    else if (leagueBody[0].queueType === "RANKED_FLEX_SR" && !leagueBody[1]) {var elo = "Sin clasificar"}
    else if (leagueBody[0].queueType === "RANKED_SOLO_5x5") {
      var tier = leagueBody[0].tier
      var rank = leagueBody[0].rank
      var lps = leagueBody[0].leaguePoints
      var wins = leagueBody[0].wins
      var loses = leagueBody[0].losses
  
    }
    else if (leagueBody[0].queueType === "RANKED_FLEX_SR" && leagueBody[1].queueType === "RANKED_SOLO_5x5") {
      var tier = leagueBody[1].tier
      var rank = leagueBody[1].rank
      var lps = leagueBody[1].leaguePoints
      var wins = leagueBody[1].wins
      var loses = leagueBody[1].losses
    }
    if (tier === "IRON") {var elo = `Hierro  ${rank}`}
    if (tier === "BRONZE") {var elo = `Bronce  ${rank}`}
    if (tier === "SILVER") {var elo = `Plata  ${rank}`}
    if (tier === "GOLD") {var elo = `Oro  ${rank}`}
    if (tier === "PLATINUM") {var elo = `Platino  ${rank}`}
    if (tier === "DIAMOND") {var elo = `Diamante  ${rank}`}
    if (tier === "MASTER") {var elo = `Master`}
    if (tier === "GRANDMASTER") {var elo = `Grandmaster`}
    if (tier === "CHALLENGER") {var elo = `Challenger`}
  
    var rankedInfo = {
      isRanked: elo==="Sin clasificar"?false:true,
      elo: elo,
      leaguePoints: lps,
      winRatio: `${Math.trunc((wins * 100) / (wins + loses))}% Winrate`
    }; return rankedInfo
  }