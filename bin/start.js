const { program } = require('commander');
var pm2 = require('pm2');
const path = require('path')
const fs = require('fs')

const { APP_NAME } = require('./constants')

const temp = path.resolve(__dirname, '../temp/')
const pidFilePath = path.join(temp, 'beauty-json-clipboard.pid')
const logFilePath = path.join(temp, 'log.log')
const outFilePath = path.join(temp, 'out.log')
const errorFilePath = path.join(temp, 'error.log')

function createTempFiles() {
    if (!fs.existsSync(temp)) {
        fs.mkdirSync(temp);
    }

    try {
        fs.writeFileSync(pidFilePath, '', { flag: 'wx' });
        fs.writeFileSync(logFilePath, '', { flag: 'wx' });
        fs.writeFileSync(outFilePath, '', { flag: 'wx' });
        fs.writeFileSync(errorFilePath, '', { flag: 'wx' });
    } catch(e){
        return
    }
}

program
    .command('start')
    .description('start listening from clipboard')
    .action(() => {
        createTempFiles()

        pm2.start(path.resolve(__dirname, '../lib/index.js'), {
            name: APP_NAME,
            pid: pidFilePath,
            output: outFilePath,
            error: errorFilePath,
            interpreter: 'node',
            instances: 1,
            autorestart: false
        }, () => {
            pm2.disconnect()
                console.log('✨ I am ready to beautify your clipboard\'s JSONs')
        });
});