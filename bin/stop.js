const { program } = require('commander');
const pm2 = require('pm2')

const { APP_NAME } = require('./constants')

program
    .command('stop')
    .description('stop listening from clipboard')
    .action(() => {
        pm2.stop(APP_NAME, (err) => {
            if(err) {
                console.error('😬 I was not able to find the task running')
            } else {
                console.log('🥺 I hope you don\'t need more beauty JSONs')
            }

            process.exit(0);
        })
    });