module.exports = {
    name: 'verify',
    async execute(message, args, client) {
        const functions = client.functions
        var platform = args.shift().toUpperCase();
        var name = args.join(' ')
        let knownRegion = [
            "EUW", "EUNE", "NA", "LAS", "LAN"
        ].includes(platform); if (knownRegion == true) {
            if (platform === "EUW") var region = "EUW1"
            if (platform === "EUNE") var region = "EUN1"
            if (platform === "NA") var region = "NA1"
            if (platform === "LAN") var region = "LA1"
            if (platform === "LAS") var region = "LA2"
        };
        const summoner = await functions.summoner_api(region, name)
        await functions.verifysummoner(client, message, platform, name, summoner.summoner_id)
    }
}