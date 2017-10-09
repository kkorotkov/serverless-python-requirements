const fse = require('fs-extra');
const path = require('path');
const {spawnSync} = require('child_process');

/**
  * pipenv install
  * @return {Promise}
  */
function pipfileToRequirements() {
  let usePipenv = this.options.usePipenv;
  if (!usePipenv || !fse.existsSync(path.join(this.servicePath, 'Pipfile')))
    return;

  this.serverless.cli.log('Generating requirements.txt from Pipfile...');

  const res = spawnSync('pipenv', ['lock', '--requirements'], {cwd: this.servicePath});
  if (res.error) {
    if (res.error.code === 'ENOENT')
      throw new Error(`pipenv not found! Install it with 'pip install pipenv'.`);
    throw new Error(res.error);
  }
  if (res.status != 0)
    throw new Error(res.stderr);
  fse.writeFileSync(path.join(this.servicePath, '.serverless/requirements.txt'), res.stdout);
};

module.exports = {pipfileToRequirements};