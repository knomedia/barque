const nunjucks = require('nunjucks')

function getEnv() {
  let nunEnv = nunjucks.configure([], { autoescape: true })
  return nunEnv
}

function render(template, context) {
  let env = getEnv()
  return env.renderString(template, context)
}

module.exports = render

