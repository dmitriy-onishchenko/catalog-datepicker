import React, { Component } from 'react';
import moment from 'moment';
import DatepickerHeader from '../../components/DatepickerHeader';
import DatepickerBottom from '../../components/DatepickerBottom';
import DatepickerWrapp from '../../components/DatepickerWrapp';
import { isMobile } from "react-device-detect";
import './style.css';

class DatePicker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            headerHeight: 0,
            bottomHeight: 0,
            minDate: moment(),
            startDate: null,
            endDate: null,
            focusedInput: isMobile ? 'startDate' : null,
            time_start: null,
            calendarFocused: false,
            time_end: null,
            daySize: window.innerWidth / 7,
            start: moment("2020-06-05 00:00", "YYYY-MM-DD HH:mm"),
            end: moment("2020-06-05 23:30", "YYYY-MM-DD HH:mm"),
            end_start: moment("2020-06-05 00:00", "YYYY-MM-DD HH:mm"),
            end_end: moment("2020-06-05 23:30", "YYYY-MM-DD HH:mm"),
            classStart: null,
            homeDatePicker: true,
            cardDatePicker: false,
            datePickerMode: 'activate datepicker with price mode'
        };
    }

    onReset = () => {
        this.setState({ startDate: null, endDate: null, time_start: null, time_end: null });
    }

    onResetTime = () => {
        this.setState({ time_start: null, time_end: null });
    }

    onDatesChange = ({startDate, endDate}) => {
        this.setState({ startDate, endDate })
    }
    
    onFocusChange = focusedInput => this.setState({ focusedInput: isMobile ? (focusedInput || 'startDate') : focusedInput})

    onHeaderHeightInit = (height) => {
        this.setState({ headerHeight: height})
    }

    onBottomHeightInit = (height) => {
        this.setState({ bottomHeight: height})
    }

    onInitStartTime = (time) => {
        this.setState({ time_start: time })
    }

    onInitEndTime = (time) => {
        this.setState({ time_end: time })
    }

    onChangeDatePickerMode = () => {
        this.onReset();
        this.setState({
            cardDatePicker: !this.state.cardDatePicker, 
            homeDatePicker: !this.state.homeDatePicker,
            datePickerMode: this.state.cardDatePicker ? 'activate datepicker with price mode' : 'activate datepicker without price mode'
        })
    }

    render() {
        const { startDate, endDate, focusedInput } = this.state;
        const { car_availability, car_prices } = this.props;

        return (
            <div className="Datepicker" style={ isMobile ? { height: window.innerHeight, paddingTop: this.state.headerHeight + 15 } : null}>
                <DatepickerHeader
                    onReset={this.onReset}
                    onHeaderHeightInit={this.onHeaderHeightInit}
                    startDate={startDate}
                    time_start={this.state.time_start}
                    endDate={endDate}
                    time_end={this.state.time_end}
                />
                <DatepickerWrapp
                    headerHeight={this.state.headerHeight}
                    bottomHeight={this.state.bottomHeight}
                    startDate={startDate}
                    daySize={this.state.daySize}
                    endDate={endDate}
                    car_availability={car_availability}
                    car_prices={car_prices}
                    onDatesChange={this.onDatesChange}
                    onFocusChange={this.onFocusChange}
                    homeDatePicker={this.state.homeDatePicker}
                    cardDatePicker={this.state.cardDatePicker}
                    focusedInput={focusedInput}
                />
                <DatepickerBottom
                    daySize={this.state.daySize}
                    onResetTime={this.onResetTime}
                    time_start={this.state.time_start}
                    time_end={this.state.time_end}
                    startDate={startDate}
                    endDate={endDate}
                    datePickerMode={this.state.datePickerMode}
                    onChangeDatePickerMode={this.onChangeDatePickerMode}
                    onInitStartTime={this.onInitStartTime}
                    onInitEndTime={this.onInitEndTime}
                    onBottomHeightInit={this.onBottomHeightInit}
                />
            </div>
        );
    }
}

export default DatePicker;