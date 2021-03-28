module.exports.get = async function(id) {

    let fetch = require("node-fetch")  
    var version = await fetch(`https://ddragon.leagueoflegends.com/api/versions.json`)
    var version = await version.json()
    var version = version[0]

    var champId = require("./champById.js");
    var getChamp = champId.get(id);

    var championData = await fetch(`http://ddragon.leagueoflegends.com/cdn/${version}/data/es_ES/champion/${(await getChamp).id}.json`);
    var championData = await championData.json().catch(err => console.error(err));
    if (!(await getChamp).id) return false;
    var id = (await getChamp).id.toLowerCase();

    var datos = Object.values(championData.data);
    var championObject = datos.find(e => e.id.toLowerCase() == id);

    var returnData = {
      name: (await getChamp).name,
      id: (await getChamp).id,
      skins: championObject.skins.length,
      lore: championObject.lore,
      tips: {
        ally: championObject.allytips[Math.random(championObject.allytips.length)],
        enemy: championObject.enemytips[Math.random(championObject.enemytips.length)]
      },
      spells: {
        q: {
          name: championObject.spells[0].name,
          description: championObject.spells[0].description
        },
        w: {
          name: championObject.spells[1].name,
          description: championObject.spells[1].description
        },
        e: {
          name: championObject.spells[2].name,
          description: championObject.spells[2].description
        },
        r: {
          name: championObject.spells[3].name,
          description: championObject.spells[3].description
        },
      },
      passive: {
        name: championObject.passive.name,
        description: championObject.passive.description
      }
    }; return returnData;
  }