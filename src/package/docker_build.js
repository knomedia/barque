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

function buildPlatform(env) {
  let platform = "linux/amd64"
  try {
    if (env.platform) {
      platform = env.platform
    }
  } catch(e) {
    console.log('error accessing platform key from env')
    console.log(env);
  }
  return `--platform=${platform}`
}

function buildCMD(image, env, npmToken, envMode) {
  let args = buildArgs(npmToken, envMode)
  let platform = buildPlatform(env)
  let cmd = `docker build ${platform} -t ${image}`
  if (args) {
    cmd += " " + args
  }
  cmd += " ."
  return cmd
}
async function build(tb, image, settings, npmToken, envMode) {
  let cmd = buildCMD(image, settings, npmToken, envMode)
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

async function dockerPackage(tb, version, settings, env, npmToken, envMode) {
  let image = buildImageName(settings, version)
  await build(tb, image, env, npmToken, envMode)
  return image
}

module.exports = dockerPackage
