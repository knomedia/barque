const PRODUCTION = "production"

const DEFAULT_ACCEPTED_BRANCHES = [
  'master',
  'main',
]

const ACCEPTABLE_KEY = "accepted-branches"

function getAcceptable(envSettings) {
  let value = (envSettings[ACCEPTABLE_KEY] || '').trim()
  if (value.length) {
    return value.split(',').reduce(function(arr, v) {
      let b = v.trim()
      if (b.length) {
        arr.push(b)
      }
      return arr
    }, [])
  } else {
    return DEFAULT_ACCEPTED_BRANCHES
  }
}

function isAcceptedBranch(branch, envSettings) {
  let acceptableBranches = getAcceptable(envSettings)
  let ok = acceptableBranches.some(function(name) {
    return name === branch
  })
  return ok
}

async function checkBranch(tb, mode, envSettings) {
  if (mode === PRODUCTION) {
    let cmd = "git rev-parse --abbrev-ref HEAD"
    let branch;
    try {
      branch = await tb.system.run(cmd, {trim: true})
    } catch(e) {
      tb.print.error('error checking for accepted branch, errored with:')
      tb.print.error(e.toString())
      process.exit(1)
    }
    if (!isAcceptedBranch(branch, envSettings)) {
      tb.print.error('you are not on an approved branch, but are packaging production')
      tb.print.info('accepted-branches: ' + getAcceptable(envSettings))
      process.exit(1)
    }
    return branch
  }
}

module.exports = checkBranch

