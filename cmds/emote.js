module.exports = {
    name: 'emote',
    description: 'test',
    async execute(message, args, client) {
        const emotes = client.emojis.cache
        console.log(emotes)
    }
}