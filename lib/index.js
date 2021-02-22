const clipboardy = require('clipboardy')
const ClipboardListener = require('clipboard-listener');

const MAX_ERROR_EVENTS = 50;
let errorEvents = []

function isJSONString(value) {
    try {
        return JSON.parse(value)
    } catch(error) {
        return false
    }
}

async function validateAndCopy() {
    try {
        const clipboardText = await clipboardy.read()
        const parsedJson = isJSONString(clipboardText)

        if (parsedJson) {
            await clipboardy.write(
                JSON.stringify(parsedJson, null , 2)
            )
        }
    } catch(error) {    
        errorEvents.push(error)

        if(errorEvents.length > MAX_ERROR_EVENTS) {
            errorEvents.forEach(error => console.log(error))
            process.exit(1)
        }
    }
}

function startListener() {
    const listener = new ClipboardListener({
        timeInterval: 500,
        immediate: true
    });

    listener.on('change', value => {
        validateAndCopy()
    });
}

startListener()