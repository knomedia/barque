const fse = require('fs-extra');
const render = require('../utils/render')

const TEMPLATE_PATH = "app/config/templates/restart-env.sh.njk"
const DEST_PATH = "bin/"
const PROTO_REG = /http(s)?:\/\//

function getDestination(mode) {
  return DEST_PATH + 'restart-' + mode + '.sh'
}

function stripProtocol(hosts) {
  return hosts.split(',').map(function(host) {
    return host.replace(PROTO_REG, '')
  }).join(',')

}

function buildContext(settings, mode, image) {
  let environment = settings.upmk.envs[mode]
  let hosts = environment.host
  if (environment['alt-hosts']) {
    hosts += "," + environment['alt-hosts']
  }
  environment.hosts = stripProtocol(hosts)
  environment.port = environment.port || "80"
  delete environment['alt-hosts']
  let topLevel = {
    name: settings.upmk.name,
    org: settings.upmk.org,
    letsencrypt_email: settings.upmk.letsencrypt_email,
  }
  let env = Object.assign({}, topLevel, environment, {image})
  return env
}

function createScript(template, env, mode) {
  let dest = getDestination(mode)
  let fileContents = render(template, env)
  fse.writeFileSync(dest, fileContents)
  return dest
}

function makeExecutable(filePath, tb) {
  tb.print.info('making ' + filePath + ' executable')
  tb.filesystem.chmodSync(filePath, 0777)
}

async function buildTemplate(tb, settings, mode, image) {
  tb.print.info('building deploy script for: ' + image);
  let contents = fse.readFileSync(TEMPLATE_PATH).toString()
  let env = buildContext(settings, mode, image)
  let filePath = createScript(contents, env, mode)
  makeExecutable(filePath, tb)
}

module.exports = buildTemplate
