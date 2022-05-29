const loadSettings = require('upmk-utils').settings.load
const loadSecrets = require('upmk-utils').secrets.load

function getEnv(tb, name) {
  let env = loadSettings().upmk.envs[name]
  if (!env) {
    tb.print.error('unable to find config settings for ' + name + ' environment')
    process.exit(1)
  }
  return env
}

async function getScriptPath(tb, envName) {
  let fPath = "bin/restart-" + envName + ".sh"
  let exists = await tb.filesystem.exists(fPath)
  if (!exists) {
    tb.print.error('unable to locate ' + fPath + ' deploy script')
    process.exit(1)
  }
  return fPath
}

async function getUser(tb) {
  let question = {
    type: 'input',
    name: 'user',
    message: 'ssh user name'
  }
  let { user } = await tb.prompt.ask([question])
  if (tb.strings.isBlank(user)) {
    tb.print.error('ssh user cannot be blank')
    process.exit(1)
  }
  return user
}

function formatEnvSecrets(secrets) {
  secrets = secrets || {}
  let allKeys = Object.keys(secrets).map(function(k) {
    return `${ k }='${ secrets[k] }'`
  })
  if (allKeys.length) {
    return allKeys.join(' ') + ' ';
  } else {
    return '';
  }
}

async function runDeploy(tb, options) {
  let envVars = formatEnvSecrets(options.secrets)
  let cmd = 'ssh ' + options.user + '@' + options.ip + ` "${ envVars }bash -s" -- < ` + options.scriptPath
  tb.print.info(cmd)
  let output = await tb.system.run(cmd)
  return output
}

module.exports = {
  name: 'deploy',
  alias: ['restart'],
  run: async (tb) => {
    let envName = tb.parameters.first
    let { ip, host, image } = getEnv(tb, envName)
    let scriptPath = await getScriptPath(tb, envName)
    let secrets = await loadSecrets(tb, envName)
    let user = await getUser(tb)
    let output = await runDeploy(tb, {ip, host, image, user, scriptPath, secrets})
    tb.print.info(output)
  },
}
