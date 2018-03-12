import {ipcRenderer} from 'electron'
import TLEventStore from './scripts/tl-event-store'

const es = new TLEventStore()
const CHAN = 'event-store-response'
let logBase = null

ipcRenderer.on('event-store', function (evt, action) {
    const { type, payload, error, meta } = action
    switch (type) {
        case 'LOAD':
            es.loadFords([meta.logBase]).then(function () {
                logBase = meta.logBase
                ipcRenderer.send(CHAN, { type, meta, payload:true })
            }).catch(function (e) {
                ipcRenderer.send(CHAN, { type, meta, error:true, payload:e })
            })
            break
        case 'FETCH'://meta.rule
            try {
                ipcRenderer.send(CHAN, { type, meta:{ ...meta, logBase }, payload:'' })
                const events = es.fetchEventsByRules(meta.rule||meta.rules)//Time consuming sync action
                ipcRenderer.send(CHAN, { type, meta:{ ...meta, logBase }, payload:events })
            } catch (e) {
                //document.write(e)
                ipcRenderer.send(CHAN, { type, meta, error:true, payload:{
                    message: e.message,
                    name: e.name,
                    stack: e.stack,
                    fileName: e.fileName,
                    columnNumber: e.columnNumber,
                    lineNumber: e.lineNumber,
                }})}
            break
        default:
            ipcRenderer.send(CHAN, { type:'BAD_REQUEST', error:true, payload:new TypeError('bad request', action) })
    }
})
