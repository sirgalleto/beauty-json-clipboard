#!/usr/bin/env node

const { program } = require('commander');
const package = require('../package.json')

require('./start')
require('./stop')

program
.version(package.version, '-v, --vers', 'output the current version');

program.parse(process.argv);