module.exports = {
    name: 'verify',
    description: 'Vincula tu nombre de invocador a tu perfil de Discord.',
    options: [
        require('../cmdoptions/region.js'),
        require('../cmdoptions/summonername')
    ], msg: async (args, interaction, client) => {
        return '❌ This command is temporaly disabled.'
    }
}