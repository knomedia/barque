const command = {
  name: 'barque',
  run: async (toolbox) => {
    const { print } = toolbox
    print.info('package and ship upmk projects')
  },
}

module.exports = command
