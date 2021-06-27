const fetch = require('node-fetch')
module.exports = {
    name: "parche",
    description: "Muestra las notas del parche actual.",
    options: [], msg: async (args, interaction, client) => {
        let version = await fetch(`https://ddragon.leagueoflegends.com/api/versions.json`);
        version = await version.json();
        version = version[0].split('.')
        while (version.length >= 3) version.pop()
        version = version.join('-') 
        let parche = `https://euw.leagueoflegends.com/es-es/news/game-updates/patch-${version}-notes/`
        return parche
    }
};