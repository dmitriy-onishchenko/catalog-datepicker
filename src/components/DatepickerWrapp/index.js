import React, { Component } from 'react';
import 'react-dates/initialize';
import { DayPickerRangeController, isInclusivelyAfterDay } from 'react-dates';
import {
    isMobile
} from "react-device-detect";
import moment from 'moment';
import 'react-dates/lib/css/_datepicker.css';

class DatepickerWrapp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            height: 0,
            selectOnlyStart: false,
            hideDatePicker: false,
            calendarFocused: false
        };
    }

    renderDay = (day) => {
        const daySize = this.props.daySize;

        return (
            <div className="CalendarDay__item" style={{ height: Math.ceil(daySize)}}>
                {day.format('D')}
            </div>
        )
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.startDate && !nextProps.endDate) {
            this.setState({selectOnlyStart: true})
        } else if (!nextProps.startDate && !nextProps.endDate) {
            this.setState({selectOnlyStart: false})
        } else if (nextProps.startDate && nextProps.endDate) {
            this.setState({selectOnlyStart: false})
        }
    }

    render() {
        const { startDate, endDate, focusedInput, daySize, onDatesChange, onFocusChange, headerHeight, bottomHeight} = this.props;
        let heightWrapp;

        if (headerHeight > 0 && bottomHeight > 0) {
            heightWrapp = window.innerHeight - headerHeight - bottomHeight - 15
        }

        return (
            <div className={`Datepicker-wrapp ${this.state.selectOnlyStart ? 'is-selecting-start' : null}`} style={isMobile ? { height: heightWrapp } : null}>
                <DayPickerRangeController
                    startDate={startDate}
                    endDate={endDate}
                    onDatesChange={onDatesChange}
                    focusedInput={focusedInput}
                    onFocusChange={onFocusChange}
                    orientation="verticalScrollable"
                    numberOfMonths={12}
                    renderDayContents={this.renderDay}
                    noNavButtons
                    noBorder
                    minimumNights={0}
                    daySize={daySize}
                    hideKeyboardShortcutsPanel={true}
                    isOutsideRange={day => !isInclusivelyAfterDay(day, moment())}
                />
            </div>
        )
    }
}

export default DatepickerWrapp;