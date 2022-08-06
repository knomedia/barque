function buildImageName(settings, version) {
  let org = (settings.upmk.org || '').trim()
  let name = (settings.upmk.name || '').trim()
  if (org.length) {
    org += '/'
  }
  return org + name + ':' + version
}

function buildArgs(npmToken, envMode) {
  envMode = envMode || 'production'
  if (npmToken) {
    return `--build-arg NPM_TOKEN=${npmToken} --build-arg ENV_MODE=${envMode}`
  }
}
function buildCMD(image, npmToken, envMode) {
  let args = buildArgs(npmToken, envMode)
  let cmd = `docker build -t ${image}`
  if (args) {
    cmd += " " + args
  }
  cmd += " ."
  return cmd
}
async function build(tb, image, npmToken, envMode) {
  let cmd = buildCMD(image, npmToken, envMode)
  tb.print.info(cmd)
  let output = await tb.system.run(cmd)
  tb.print.info(output)
}

async function push(tb, image) {
  let cmd = "docker push " + image
  tb.print.info(cmd);
  let output = await tb.system.run(cmd)
  tb.print.info(output)
}

async function dockerPackage(tb, version, settings, npmToken, envMode) {
  let image = buildImageName(settings, version)
  await build(tb, image, npmToken, envMode)
  return image
}

module.exports = dockerPackage
