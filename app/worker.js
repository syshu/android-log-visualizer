import {ipcRenderer} from 'electron'
import tlEventDiscoverer from './scripts/tlEventDiscoverer.js'

let getEventsByRule = null
const CHAN = 'event-store-response'
let logBase = null

ipcRenderer.on('event-store', function (evt, action) {
    const { type, payload, error, meta } = action
    switch (type) {
        case 'LOAD':
            tlEventDiscoverer(meta.logBase).then(function (gebr) {
                logBase = meta.logBase
                getEventsByRule = gebr
                ipcRenderer.send(CHAN, { type, meta, payload:true })
            }).catch(function (e) {
                ipcRenderer.send(CHAN, { type, meta, error:true, payload:e })
            })
            break
        case 'FETCH'://meta.rule
            try {
                console.assert(getEventsByRule, 'getEventsByRule null, maybe not LOADed before?')
                ipcRenderer.send(CHAN, { type, meta:{ ...meta, logBase }, payload:'' })
                const events = getEventsByRule(meta.rule || meta.rules[0])
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
