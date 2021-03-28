module.exports = {
    name: 'help',
    description: 'Comando de ayuda',
    async execute(message) {
        const Discord = require('discord.js');
        const ddragonver = require("../src/ddragon/ddragon-ver.js");
        const version = ddragonver.get();
        const embed = new Discord.MessageEmbed()
        embed.setAuthor(`SettBot - v${await version}`, `https://cdn.discordapp.com/avatars/720401741643907173/23a0557707641dc470396da441297be4.webp`)
        embed.setTitle('Lista de comandos disponibles')
        embed.setDescription('```fix\n¡Gracias por usar SettBot! Aquí tienes una lista de comandos que puedes usar. Si tienes alguna duda, sugerencia o encuentras un error, no dudes en enviarme un DM, soy Michel Mendoza#2510```\n❯ **Perfil:**\ns.perfil <región> <nombre> - Te muestra una lista de maestrías, estadísticas de ranked solo/dúo, winrate de las últimas 10 partidas y los datos sobre la última partida de un invocador.\n``Ejemplo: s.perfil EUW MendozaX``\n\n❯ **Maestría:**\ns.maestria <región> <campeón> <nombre> - Te muestra el nivel y puntuación de maestría con un campeón, winrate de las últimas 10 partidas y los datos sobre la última partida de un invocador con un campeón específico.\n``Ejemplo: s.maestria EUW Yasuo MendozaX``\n\n❯ **Campeón:**\ns.champion <campeón> - Te muestra el lore, pasiva y habilidades de un campeón específico.\n``Ejemplo: s.champion Sett``\n\n❯ **Historial:**\ns.historial <región> <número de página> <nombre> - Te muestra las últimas 5 partidas de un invocador. Si cambias el número de página, verás más partidas.\n``Ejemplo: s.historial EUW 1 MendozaX``\n\n❯ **Regiones:**\nEl bot está disponible en los siguientes servidores:\n``EUW, EUNE, NA, LAN, LAS, KR, OCE``\n[¡Anádeme a tu servidor!](https://portalmybot.com/mybotlist/bot/720401741643907173)')
        message.channel.send(embed)
    }
}