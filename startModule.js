#!/usr/bin/env node

"use strict";

/**
 * This file will be called in index.js to start the given application.
 * It registers the loadModuleHook which writes every required filepath
 * into a temporary file, which will be processed after the process ends.
 *
 */

const argv = require("commander");

argv.option('-e, --entrypoint []', 'Your module entry point')
  .option('-m, --additional-modules []', 'Additional modules that are "required" ')
  .usage('\n\n Usage: node startModule -e [path/to/your/start/script.js] -m "module1 module2"')
  .parse(process.argv);

console.log(argv.entrypoint)
console.log(argv.additionalModules)

require('./loadModuleHook');


process.stderr.on('data', function (err) {
  if (err) {
    debug('STDERR: [%o]', err);
  }
});

process.stdout.on('data', function (data) {
  debug('STDOUT: [%o]', data);
});

// load additional modules
if (argv.additionalModules !== undefined) {
  const additionalModules = argv.additionalModules.split(' ');
  for (let module of additionalModules) {
    console.log('Manually requiring', module);
    require(module)
  }
}

// load the given app
require(argv.entrypoint);

// if loaded just exit, we now have all required files
process.nextTick(() => {
  process.exit(0);
});


