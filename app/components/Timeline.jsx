import React, { Component } from 'react'
import PropTypes from 'prop-types'

class SimileTimeline extends Component {
    static propTypes : {
        events: PropTypes.array,
    }

    constructor(props) {
        super(props)
        this.eventSource = new Timeline.DefaultEventSource()
        this.timeline = null
    }

    handleResize() {
        if (!this.handleResize.timerID)
            this.handleResize.timerID = window.setTimeout(()=>{
            this.handleResize.timerID = null
                this.timeline.layout()
            })
    }

    componentWillReceiveProps({ events }) { //events undefinedable
        console.log('componentWillReceiveProps', events)
        const newEvents = events || []
        const oldEvents = this.props.events || []
        if (newEvents.length === oldEvents.length &&
        newEvents.toString() === oldEvents.toString()) {return}
        this.eventSource.clear()
        this.eventSource.addEvents(events)
        if (newEvents.length && !this.isCenterInRange()) {this.moveToCenterOfEvents()}
    }

    moveToCenterOfEvents () {
        const earlistDateUTC = this.eventSource.getEarliestDate().valueOf()
        const latestDateUTC = this.eventSource.getLatestDate().valueOf()
        const midDateUTC = (earlistDateUTC + latestDateUTC) / 2
        const midDate = new Date(midDateUTC)
        this.timeline.getBand(2).scrollToCenter(midDate)
    }

    isCenterInRange () {
        const centerUTC = this.timeline.getBand(2).getCenterVisibleDate().valueOf()
        const earliestDateUTC = this.eventSource.getEarliestDate().valueOf()
        const latestDateUTC = this.eventSource.getLatestDate().valueOf()
        return centerUTC <= latestDateUTC && centerUTC >= earliestDateUTC
    }

    shouldComponentUpdate() {
        return false //so that we just update it manually
    }

    render() {
        return (
            <div>
                <div ref="timeline" style={{width:'100%', height:300}}>
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.eventSource.addEvents(this.props.events || [])
        //const theme = Timeline.ClassicTheme.create()
        //theme.event.bubble.width = 350
        //theme.event.bubble.height = 300
        //const d = '2017-08-16T19:11:36.266Z'
        const bandInfos = [
            Timeline.createBandInfo({
                width:          "40%",
                intervalUnit:   Timeline.DateTime.SECOND,
                intervalPixels: 50,
                eventSource:    this.eventSource,
                //date:           d,
                //theme:          theme,
                //layout:         'original'  // original, overview, detailed
            }),
            Timeline.createBandInfo({
                width:          "40%",
                intervalUnit:   Timeline.DateTime.MINUTE,
                intervalPixels: 100,
                eventSource:    this.eventSource,
            }),
            Timeline.createBandInfo({
                overview:      true,
                width:          "20%",
                intervalUnit:   Timeline.DateTime.HOUR,
                intervalPixels: 200,
                eventSource:    this.eventSource,
            })
        ]
        bandInfos[1].syncWith = 0
        bandInfos[1].highlight = true
        bandInfos[2].syncWith = 1
        bandInfos[2].highlight = true
        this.timeline = Timeline.create(this.refs.timeline, bandInfos)

        window.addEventListener('resize', this.bindedHandleResize = this.handleResize.bind(this))
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.bindedHandleResize)
    }
}

export default SimileTimeline
