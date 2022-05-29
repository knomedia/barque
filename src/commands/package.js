const packageApp = require('../package')

module.exports = {
  name: 'package',
  alias: ['p'],
  run: async tb => {
    packageApp(tb)
  }
}
