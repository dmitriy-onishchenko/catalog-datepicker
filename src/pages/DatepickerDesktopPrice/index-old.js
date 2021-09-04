import React, { Component } from 'react';
import moment from 'moment';
import DatepickerHeader from '../../components/DatepickerHeader';
import DatepickerBottom from '../../components/DatepickerBottom';
import DatepickerWrapp from '../../components/DatepickerWrapp';
import { isMobile } from "react-device-detect";

class DatePickerDesktopPrice extends Component {
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
            car_availability: null,
            car_prices: null,
            datesBlocked: null,
            highlightDays: null,
            first_selected: false,
            visible: true
        };
    }

    componentDidMount() {
        fetch("https://run.mocky.io/v3/d1b5c91e-2637-4d86-b653-db32c1081724")
            .then(res => res.json())
            .then(
                (result) => {
                    let result_day = result.availability;
                    let start_day = Object.keys(result.availability)[0];
                    let count = this.getCountDays(start_day, this.state.minDate.format('YYYY-MM-DD'));
                    let new_obj = {};

                    for (let i = count; i < Object.keys(result_day).length; i++) {
                        new_obj[Object.keys(result_day)[i]] = Object.values(result_day)[i]
                    }

                    this.setState({
                        car_availability: new_obj,
                        datesBlocked: new_obj,
                        car_prices: result.prices
                    });

                },
                (error) => {
                    console.log(error)
                }
            )
    }

    componentWillUpdate() {
        if (this.state.startDate && this.state.endDate && !this.state.first_selected) {
            this.setState({ first_selected: true })
        }
    }

    filterBlockedDateAfter(start_day, select_day) {
        let count = this.getCountDays(start_day, select_day) + 1;
        let datesBlockAfter = {};

        for (let i = count; i < Object.keys(this.state.car_availability).length; i++) {
            datesBlockAfter[Object.keys(this.state.car_availability)[i]] = Object.values(this.state.car_availability)[i]
        }

        return datesBlockAfter;
    }

    filterBlockedDateBefore(start_day, select_day) {
        let count = this.getCountDays(start_day, select_day);
        let datesBlockBefore = {};

        for (let i = count; i >= 0; i--) {
            datesBlockBefore[Object.keys(this.state.car_availability)[i]] = Object.values(this.state.car_availability)[i]
        }

        return datesBlockBefore;
    }

    getCountDays(today_day, select_day) {
        today_day = today_day.split('-');
        select_day = select_day.split('-');
        today_day = new Date(today_day[0], today_day[1], today_day[2]);
        select_day = new Date(select_day[0], select_day[1], select_day[2]);

        let date_unixtime = parseInt(today_day.getTime() / 1000);
        let select_date_unixtime = parseInt(select_day.getTime() / 1000);
        let timeDifference = select_date_unixtime - date_unixtime;
        let timeDifferenceInHours = timeDifference / 60 / 60;
        let timeDifferenceInDays = timeDifferenceInHours / 24;

        return timeDifferenceInDays;
    }

    onReset = () => {
        this.setState({ startDate: null, endDate: null, time_start: null, time_end: null, datesBlocked: this.state.car_availability });
    }

    onResetTime = () => {
        this.setState({ time_start: null, time_end: null });
    }

    onDatesChange = ({ startDate, endDate }) => {
        this.setState({ startDate, endDate })

        if (startDate !== null && endDate === null) {
            let today_date = this.state.minDate.format('YYYY-MM-DD');
            let selected_date = startDate.format('YYYY-MM-DD');
            let filtered_days_after = this.filterBlockedDateAfter(today_date, selected_date);
            let filtered_days_before = this.filterBlockedDateBefore(today_date, selected_date);
            let unavailable_date = Object.keys(filtered_days_after).find(key => filtered_days_after[key] === 'unavailable');

            if (unavailable_date && moment(unavailable_date).isAfter(moment(selected_date))) {
                let full_days = {};
                let daysInMonthAfter = {};
                let monthDate = moment(unavailable_date);

                for (let i = 0; i < 365; i++) {
                    let newDay = monthDate.clone().add(i, 'days');

                    daysInMonthAfter[newDay.format('YYYY-MM-DD')] = 'unavailable'
                }
                full_days = Object.assign(filtered_days_before, daysInMonthAfter);
                this.setState({ highlightDays: full_days })

                if (this.state.first_selected) {
                    setTimeout(() => {
                        this.setState({ focusedInput: null })
                    }, 50);
                    setTimeout(() => {
                        this.setState({ focusedInput: 'endDate' })
                    }, 100);
                }
            } 
        }

        if (startDate === null && endDate !== null) {
            let today_date = this.state.minDate.format('YYYY-MM-DD');
            let selected_date = endDate.format('YYYY-MM-DD');
            let filtered_days_before = this.filterBlockedDateBefore(today_date, selected_date);
            let unavailable_date = Object.keys(filtered_days_before).find(key => filtered_days_before[key] === 'unavailable');

            if (unavailable_date) {
                let full_days = {};
                let count = this.getCountDays(this.state.minDate.format('YYYY-MM-DD'), unavailable_date);
                let monthDate = moment(this.state.minDate);

                for (let i = 0; i <= count; i++) {
                    let newDay = monthDate.clone().add(i, 'days');

                    full_days[newDay.format('YYYY-MM-DD')] = 'unavailable';
                }

                this.setState({ highlightDays: full_days })
            }
        }

        if (startDate !== null && endDate !== null) {
            let focused = this.state.focusedInput;

            if (focused === 'startDate' && this.state.startDate && this.state.endDate) {
                this.setState({ endDate: null });

                let today_date = this.state.minDate.format('YYYY-MM-DD');
                let selected_date = startDate.format('YYYY-MM-DD');
                let filtered_days_after = this.filterBlockedDateAfter(today_date, selected_date);
                let filtered_days_before = this.filterBlockedDateBefore(today_date, selected_date);
                let unavailable_date = Object.keys(filtered_days_after).find(key => filtered_days_after[key] === 'unavailable');

                if (unavailable_date && moment(unavailable_date).isAfter(moment(selected_date))) {
                    let full_days = {};
                    let daysInMonthAfter = {};
                    let monthDate = moment(unavailable_date);

                    for (let i = 0; i < 365; i++) {
                        let newDay = monthDate.clone().add(i, 'days');

                        daysInMonthAfter[newDay.format('YYYY-MM-DD')] = 'unavailable'
                    }
                    full_days = Object.assign(filtered_days_before, daysInMonthAfter);
                    this.setState({ highlightDays: full_days })
                }
            } else {
                this.setState({ highlightDays: null })
            }
        }
    }

    onFocusChange = focusedInput => {
        if (focusedInput === null) {
            this.setState({ datesBlocked: this.state.car_availability });
        }

        if (focusedInput === 'endDate' && this.state.startDate) {
            let today_date = this.state.minDate.format('YYYY-MM-DD');
            let selected_date = this.state.startDate.format('YYYY-MM-DD');
            let filtered_days_after = this.filterBlockedDateAfter(today_date, selected_date);
            let filtered_days_before = this.filterBlockedDateBefore(today_date, selected_date);
            let unavailable_date = Object.keys(filtered_days_after).find(key => filtered_days_after[key] === 'unavailable');

            if (unavailable_date && moment(unavailable_date).isAfter(moment(selected_date))) {
                let full_days = {};
                let daysInMonthAfter = {};
                let monthDate = moment(unavailable_date);

                for (let i = 0; i < 365; i++) {
                    let newDay = monthDate.clone().add(i, 'days');

                    daysInMonthAfter[newDay.format('YYYY-MM-DD')] = 'unavailable'
                }
                full_days = Object.assign(filtered_days_before, daysInMonthAfter);
                this.setState({ highlightDays: full_days })
                if (this.state.first_selected) {
                    setTimeout(() => {
                        this.setState({ focusedInput: null })
                    }, 50);
                    setTimeout(() => {
                        this.setState({ focusedInput: 'endDate' })
                    }, 100);
                }
            } else {
                this.setState({ highlightDays: null })
            }
        }

        this.setState({ focusedInput: isMobile ? (focusedInput || 'startDate') : focusedInput })
    }

    onHeaderHeightInit = (height) => {
        this.setState({ headerHeight: height })
    }

    onBottomHeightInit = (height) => {
        this.setState({ bottomHeight: height })
    }

    onInitStartTime = (time) => {
        this.setState({ time_start: time })
    }

    onInitEndTime = (time) => {
        this.setState({ time_end: time })
    }

    render() {
        const { startDate, endDate, focusedInput } = this.state;

        return (
            <div className="Datepicker" style={isMobile ? { height: window.innerHeight, paddingTop: this.state.headerHeight + 15 } : null}>
                <DatepickerHeader
                    onReset={this.onReset}
                    onHeaderHeightInit={this.onHeaderHeightInit}
                    startDate={startDate}
                    time_start={this.state.time_start}
                    endDate={endDate}
                    time_end={this.state.time_end}
                />
                {this.state.datesBlocked
                ? 
                    <DatepickerWrapp
                        headerHeight={this.state.headerHeight}
                        bottomHeight={this.state.bottomHeight}
                        startDate={startDate}
                        daySize={this.state.daySize}
                        endDate={endDate}
                        visible={this.state.visible}
                        mode='desktopPrice'
                        datesBlocked={this.state.datesBlocked}
                        car_prices={this.state.car_prices}
                        onDatesChange={this.onDatesChange}
                        onFocusChange={this.onFocusChange}
                        homeDatePicker={this.state.homeDatePicker}
                        cardDatePicker={this.state.cardDatePicker}
                        highlightDays={this.state.highlightDays}
                        focusedInput={focusedInput}
                    />
                : null}
                
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

export default DatePickerDesktopPrice;