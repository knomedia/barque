const YAML = require('yaml')
const fse = require('fs-extra')

const SETTINGS_PATH = "upmk.yml"

async function updateConfig(tb, image, mode, settings) {
  tb.print.info('updating ' + SETTINGS_PATH + ' with ' + image + ' for ' + mode + ' environment')
  settings.upmk.envs[mode].image = image
  let yamlSettings = YAML.stringify(settings)
  return fse.writeFileSync(SETTINGS_PATH, yamlSettings)
}

module.exports = updateConfig
