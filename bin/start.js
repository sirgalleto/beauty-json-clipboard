const { program } = require('commander');
const { promisify } = require('util');
var pm2 = require('pm2');
const path = require('path')
const fs = require('fs')

const { APP_NAME } = require('./constants')

const temp = path.resolve(__dirname, '../temp/')
const pidFilePath = path.join(temp, 'beauty-json-clipboard.pid')
const outFilePath = path.join(temp, 'out.log')
const errorFilePath = path.join(temp, 'error.log')

function createTempFiles() {
    if (!fs.existsSync(temp)) {
        fs.mkdirSync(temp);
    }

    try {
        fs.writeFileSync(pidFilePath, '', { flag: 'wx' });
        fs.writeFileSync(outFilePath, '', { flag: 'wx' });
        fs.writeFileSync(errorFilePath, '', { flag: 'wx' });
    } catch(e){
        return
    }
}

function onSuccess() {
    pm2.disconnect()
    console.log('✨ I am ready to beautify your clipboard\'s JSONs')
}

function onError(error) {
    pm2.disconnect()
    if (error.message) {
        console.log(error.message)
    } else {
        console.log('I had an unexpected error 😅')
    }
}

function run(options) {
    const { autoStart } = options

    createTempFiles()

    pm2.start(path.resolve(__dirname, '../lib/index.js'), {
        name: APP_NAME,
        pid: pidFilePath,
        output: outFilePath,
        error: errorFilePath,
        interpreter: 'node',
        instances: 1,
        autorestart: false
    }, (error) => {
        if (error) {
            if (error.message === 'Script already launched') {
                pm2.stop(APP_NAME, () => {
                    run(options)
                })
                return
            }
            onError(error)
            return
        }

        if (!autoStart) {
            onSuccess()
            return
        }

        if (process.getuid() != 0) {
            onError(new Error('You need to execute this with more rights'))
            return
        }

        pm2.startup(process.platform, {}, (error) => {
            if (error) {
                pm2.stop(APP_NAME, () => {
                    onError(error)
                })
                return
            }

            onSuccess()
        })
    });
}

program
    .command('start')
    .description('start listening from clipboard')
    .option('-a, --auto-start', 'auto start when computer starts (needs permissions)')
    .action(run);