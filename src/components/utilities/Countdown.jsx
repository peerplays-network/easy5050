import React from 'react';
import moment from 'moment';
import { Tooltip } from 'react-tippy';

class Countdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            now: moment.utc().local(),
            dateTo: moment(this.props.dateTo),
            day: 0,
            hour: 0,
            min: 0,
            sec: 0,
            shortHand: this.props.shortHand
        };
        this.timer = this.timer.bind(this);
    }
    componentDidMount() {
        // console.warn(this.state.now.format("dddd, MMMM Do YYYY, h:mm:ss a"));
        // console.warn(this.state.dateTo.format("dddd, MMMM Do YYYY, h:mm:ss a"));
        this.countdown = setInterval(this.timer, 1000);
    }
    componentWillUnmount() {
        clearInterval(this.countdown);
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.dateTo !== this.props.dateTo) {
            this.setState({
                dateTo: moment(this.props.dateTo)
            });
        }
    }
    timer() {
        const now = moment();
        const sec = this.state.dateTo.diff(now, 'seconds') % 60;
        const min = this.state.dateTo.diff(now, 'minutes') % 60;
        const hour = this.state.dateTo.diff(now, 'hours'); // % 24, if we want days
        const day = this.state.dateTo.diff(now, 'days');
        this.setState({
            now,
            day: day < 10 ? `0${ day}` : day,
            hour: hour < 10 ? `0${ hour}` : hour,
            min: min < 10 ? `0${ min}` : min,
            sec: sec < 10 ? `0${ sec}` : sec
        });
    }
    // renderDays() {
    //     if (this.state.day > 1) {
    //         return `${this.state.day } days `;
    //     } else if (this.state.day === 1) {
    //         return `${this.state.day } day `;
    //     }
    //     return '';
    // }

    render() {

        let dateContent = (<Tooltip
        title={this.props.dateTo.format("MMMM Do, h:mm a")}
        position="right"
        ><span>{this.state.hour}:{this.state.min}:{this.state.sec}</span></Tooltip>);

        if (this.state.hour > 72 || this.state.hour == 72 && this.state.min > 0 || this.state.hour == 72 && this.state.sec > 0) {
            dateContent = this.props.dateTo.format("MMMM Do, h:mm a");
        }

        if (this.state.shortHand) {
            dateContent = this.props.dateTo.format("MMM Do, h:mm a");
        }

        return (
          <span>
            {dateContent}
          </span>
        );
    }
  }

export default Countdown;

