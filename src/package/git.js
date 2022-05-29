function buildTag(version) {
  return "v" + version
}

async function gitTag(tb, tag) {
  let cmd = "git tag " + tag
  tb.print.info(cmd)
  let output = await tb.system.run(cmd)
  tb.print.info(output)
}

async function gitPush(tb, tag) {
  let cmd = "git push origin " + tag
  tb.print.info(cmd)
  let output = await tb.system.run(cmd)
  tb.print.info(output)
}

async function git(tb, version, settings) {
  let tag = buildTag(version)
  await gitTag(tb, tag)
  await gitPush(tb, tag)
}
module.exports = git
