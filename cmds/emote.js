module.exports = {
    name: 'emote',
    description: 'test',
    async execute(message, args, client) {
        const emotes = client.emojis.cache
        const emote = emotes.find(emoji => emoji.name === 'Yasuo')
        console.log(emote)
    }
}