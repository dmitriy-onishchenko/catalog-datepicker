import React, { Component } from 'react';
import moment from 'moment';
import 'react-dates/initialize';
import DatepickerHeader from '../../components/DatepickerHeader';
import DatepickerBottom from '../../components/DatepickerBottom';
import { DayPickerRangeController, isInclusivelyAfterDay } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import { isMobile } from "react-device-detect";

class DatePickerMobile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            headerHeight: 0,
            bottomHeight: 0,
            selectOnlyStart: false,
            minDate: moment(),
            startDate: null,
            endDate: null,
            focusedInput: 'startDate',
            time_start: null,
            calendarFocused: false,
            time_end: null,
            showMobileDatepicker: false,
            daySize: window.innerWidth / 7,
            start: moment("2020-06-05 00:00", "YYYY-MM-DD HH:mm"),
            end: moment("2020-06-05 23:30", "YYYY-MM-DD HH:mm"),
            end_start: moment("2020-06-05 00:00", "YYYY-MM-DD HH:mm"),
            end_end: moment("2020-06-05 23:30", "YYYY-MM-DD HH:mm"),
            classStart: null
        };
    }

    onReset = () => {
        this.setState({ startDate: null, endDate: null, time_start: null, time_end: null });
    }

    onResetTime = () => {
        this.setState({ time_start: null, time_end: null });
    }

    onDatesChange = ({ startDate, endDate }) => {
        this.setState({ startDate, endDate });

        if (startDate && !endDate) {
            this.setState({selectOnlyStart: true})
        } else if (!startDate && !endDate) {
            this.setState({selectOnlyStart: false})
        } else if (startDate && endDate) {
            this.setState({selectOnlyStart: false})
        }
    }

    onFocusChange = focusedInput => this.setState({ focusedInput: isMobile ? (focusedInput || 'startDate') : focusedInput })

    onHeaderHeightInit = (height) => {
        this.setState({ headerHeight: height })
    }

    onBottomHeightInit = (height) => {
        this.setState({ bottomHeight: height })
    }

    onInitStartTime = (time) => {
        this.setState({ time_start: time })
    }

    onHideDatepicker = () => {
        this.setState({showMobileDatepicker: false})
    }

    onInitEndTime = (time) => {
        this.setState({ time_end: time })
    }

    renderDay = (day) => {
        const daySize = this.state.daySize;

        return (
            <div className="CalendarDay__item" style={{ height: Math.ceil(daySize)}}>
                {day.format('D')}
            </div>
        )
    }

    componentDidMount() {
        var startDate = moment(this.props.startDate, 'DD-MM-YYYY');
        var endDate = moment(this.props.endDate, 'DD-MM-YYYY');
        
        this.setState({startDate: startDate, endDate: endDate});
        // document.querySelectorAll('[name=dateStart]')[0].value = startDate;
        // document.querySelectorAll('[name=dateEnd]')[0].value = endDate;
    }

    render() {
        const { startDate, endDate, headerHeight, bottomHeight } = this.state;
        let heightWrapp;

        if (headerHeight > 0 && bottomHeight > 0) {
            heightWrapp = window.innerHeight - headerHeight - bottomHeight - 15
        }

        return (
            <div className="Datepicker" style={isMobile ? { height: window.innerHeight, paddingTop: this.state.headerHeight + 15 } : null}>
                <div
                    hidden
                    id="datepicker-mobile-label"
                    onClick={() => {
                        if (isMobile) {
                            document.getElementsByTagName("html")[0].classList.add('is-show-datepicker');
                            this.setState({ showMobileDatepicker: true })
                            } 
                        }
                    }
                ></div>
                {this.state.showMobileDatepicker &&
                    <div>
                        <DatepickerHeader
                            onReset={this.onReset}
                            onHeaderHeightInit={this.onHeaderHeightInit}
                            startDate={this.state.startDate}
                            time_start={this.state.time_start}
                            endDate={this.state.endDate}
                            time_end={this.state.time_end}
                        />
                        <div className={`Datepicker-wrapp ${this.state.selectOnlyStart ? 'is-selecting-start' : ''}`} style={isMobile ? { height: heightWrapp } : null}>
                            <DayPickerRangeController
                                startDate={this.state.startDate}
                                endDate={this.state.endDate}
                                onDatesChange={this.onDatesChange}
                                focusedInput={this.state.focusedInput}
                                onFocusChange={this.onFocusChange}
                                orientation="verticalScrollable"
                                numberOfMonths={12}
                                renderDayContents={this.renderDay}
                                noNavButtons
                                noBorder
                                minimumNights={0}
                                daySize={this.state.daySize}
                                hideKeyboardShortcutsPanel={true}
                                isOutsideRange={day => !isInclusivelyAfterDay(day, moment())}
                            />
                        </div>

                        <DatepickerBottom
                            daySize={this.state.daySize}
                            onResetTime={this.onResetTime}
                            time_start={this.state.time_start}
                            time_end={this.state.time_end}
                            startDate={startDate}
                            endDate={endDate}
                            mode='mobile'
                            onHideDatepicker={this.onHideDatepicker}
                            datePickerMode={this.state.datePickerMode}
                            onChangeDatePickerMode={this.onChangeDatePickerMode}
                            onInitStartTime={this.onInitStartTime}
                            onInitEndTime={this.onInitEndTime}
                            onBottomHeightInit={this.onBottomHeightInit}
                        />
                    </div>
                }
            </div>
        );
    }
}

export default DatePickerMobile;