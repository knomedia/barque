function buildImageName(settings, version) {
  let org = (settings.upmk.org || '').trim()
  let name = (settings.upmk.name || '').trim()
  if (org.length) {
    org += '/'
  }
  return org + name + ':' + version
}

function buildArgs(npmToken) {
  if (npmToken) {
    return `--build-arg NPM_TOKEN=${npmToken}`
  }
}
function buildCMD(image, npmToken) {
  let args = buildArgs(npmToken)
  let cmd = `docker build -t ${image}`
  if (args) {
    cmd += " " + args
  }
  cmd += " ."
  return cmd
}
async function build(tb, image, npmToken) {
  let cmd = buildCMD(image, npmToken)
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

async function dockerPackage(tb, version, settings, npmToken) {
  let image = buildImageName(settings, version)
  await build(tb, image, npmToken)
  return image
}

module.exports = dockerPackage
