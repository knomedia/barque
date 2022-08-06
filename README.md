# barque

> package and deploy an `upmk` project

# License

MIT - see LICENSE


## Package

Build webapp with docker and tag in git. Doing so will:

* verify valid version number
* verify you are on an acceptable git branch (master || main by default)
  * set this with an `allowed-branches` key in your `upmk.yml` file for each environment
* docker build your app (with included tag)
* git tag the repo (and push the tag to the remote)
* update your `upmk.yml` environment with the new docker image name + tag
* build your `bin/restart-<environent>.sh` file with the latest image name + tag


```sh
barque package <envirnoment> <version> [--npm-token=token --skip-git --skip-docker-push]
```

For example


```sh
barque package production 0.2.45 --npm-token=abcdefg
```


### Options

* pass along `--npm-token` to use it as an `NPM_TOKEN` build arg
* skip over git tagging and push with `--skip-git`
* skip the docker push step with `--skip-docker-push`


## Deploy

Runs the local `bin/restart-<env>.sh` script file via ssh on the configured server

```sh
barque deploy <environment>
```

For example

```sh
barque deploy production
```

Will execute the local `bin/restart-production.sh` script that gets built
during packaging


## TODO:

* none
