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
        let count = this.getCountDays(start_day, select_day) - 1;

        let datesBlockBefore = {};

        for (let i = count; i >= 0; i--) {
            datesBlockBefore[Object.keys(this.state.car_availability)[i]] = 'unavailable';
        }

        return datesBlockBefore;
    }

    getCountDays(today_day, select_day) {
        let a = moment(today_day);
        let b = moment(select_day);
        let timeDifferenceInDays = b.diff(a, 'days');

        return timeDifferenceInDays;
    }

    onReset = () => {
        this.setState({ startDate: null, endDate: null, time_start: null, time_end: null, highlightDays: null });
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
                this.setState({ datesBlocked: full_days })
            } else {
                this.setState({ datesBlocked: filtered_days_before })
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
                    this.setState({ datesBlocked: full_days })
					
                } else {
                    this.setState({ datesBlocked: filtered_days_before })
                }
            } else {
                this.setState({ datesBlocked: this.state.car_availability })
            }
        }
    }

    onFocusChange = focusedInput => {
        if (focusedInput === null) {
			this.setState({ datesBlocked: this.state.car_availability });
        }
        if (this.state.focusedInput === null && focusedInput === 'endDate') {
            this.setState({ focusedInput: 'startDate'})
        } else {
            this.setState({ focusedInput: isMobile ? (focusedInput || 'startDate') : focusedInput })
        }
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
