async function push(tb, image) {
  let cmd = "docker push " + image
  tb.print.info(cmd);
  let output = await tb.system.run(cmd)
  tb.print.info(output)
}

async function dockerPush(tb, image) {
  await push(tb, image)
  return image
}

module.exports = dockerPush
