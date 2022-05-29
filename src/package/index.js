const verifyAcceptedBranch = require('./branch')
const dockerBuild = require('./docker_build')
const dockerPush = require('./docker_push')
const updateConfig = require('./config')
const git = require('./git')
const buildTemplate = require('./template')
const loadSettings = require('upmk-utils').settings.load

function getEnvironment(tb, name, settings) {
  let env = settings.upmk.envs[name]
  if (!env) {
    tb.print.error('no env found named "' + name + '". please check your upmk.yml file')
    process.exit(1)
  }
  return env
}

function getSettings(){
  return loadSettings()
}

function getVersion(tb) {
  let version = tb.semver.clean(tb.parameters.second)
  if (!tb.semver.valid(version)) {
    tb.print.error('version: "' + version + '" is not valid');
    process.exit(1)
  }
  return version
}

function getNpmToken(tb) {
  let options = tb.parameters.options || {}
  return options.npmToken
}

async function packageApp(tb) {
  let mode = tb.parameters.first
  tb.print.info('packaging app for:', mode);
  let version = getVersion(tb)
  let settings = getSettings()
  let skipGit = !!tb.parameters.options.skipGit
  let skipDockerPush = !!tb.parameters.options.skipDockerPush
  let env = getEnvironment(tb, mode, settings)
  let npmToken = getNpmToken(tb)
  await verifyAcceptedBranch(tb, mode, env)
  let image = await dockerBuild(tb, version, settings, npmToken)
  if (!skipDockerPush) {
    await dockerPush(tb, image)
  } else {
    tb.print.info('... skipping docker push')
  }
  await updateConfig(tb, image, mode, settings)
  if (!skipGit) {
    await git(tb, version, settings)
  } else {
    tb.print.info('... skipping git tagging and push')
  }
  await buildTemplate(tb, settings, mode, image)
}

module.exports = packageApp
