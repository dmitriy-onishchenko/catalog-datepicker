import React, { Component } from 'react';
import 'react-dates/initialize';
import moment from 'moment';
import 'moment/locale/ru';
import { DayPickerRangeController, isInclusivelyAfterDay } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import './style.css';

moment().locale('ru');

class DatePickerDesktop extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showDatePicker: false,
            minDate: moment(),
            startDate: null,
            endDate: null,
            focusedInput:'startDate',
            daySize: window.innerWidth / 7
        };
    }

    onDatesChange = ({ startDate, endDate }) => {
        this.setState({ startDate, endDate });
        if (startDate && endDate) {
            this.initRangeDays(startDate, endDate);
            this.state.showDatePicker = false;
        } else {
            document.querySelectorAll('.calendar-selected-days')[0].innerHTML = '';
            document.querySelectorAll('.calendar-range-days')[0].innerHTML = '';
        }

        if (startDate) {
            $('input[name=dateStart]').val(startDate.format("DD.MM.YYYY"));
        } else {
            $('input[name=dateStart]').val('')
        }

        if (endDate) {
            $('input[name=dateEnd]').val(endDate.format("DD.MM.YYYY"));
        } else {
            $('input[name=dateEnd]').val('');
        }

        $('.calendar-selected-days').trigger('change');
    }

    getCountDays(today_day, select_day) {
        let a = moment(today_day);
        let b = moment(select_day);
        let timeDifferenceInDays = b.diff(a, 'days');

        return timeDifferenceInDays;
    }

    onFocusChange = focusedInput => {
        this.setState({
          focusedInput: !focusedInput ? 'startDate' : focusedInput
        });
      };

    renderDay = (day) => {
        const daySize = this.props.daySize;

        return (
            <div className="CalendarDay__item" style={{ height: Math.ceil(daySize)}}>
                {day.format('D')}
            </div>
        )
    }

    renderDayDesktop = (day) => {
        return (
            <div className="CalendarDay__item">
                {day.format('D')}
            </div>
        )
    }

    initRangeDays(startDate, endDate) {
        const dateRangeString = `${startDate.format("DD MMMM")} - ${endDate.format("DD MMMM")} ${moment().year()}`;
        const count_days = this.getCountDays(startDate, endDate);

        document.querySelectorAll('.calendar-selected-days')[0].innerHTML = dateRangeString;
        document.querySelectorAll('.calendar-range-days')[0].innerHTML = `${count_days} дней`;
    }

    componentDidMount() {
        var startDate = moment(this.props.startDate, 'DD-MM-YYYY');
        var endDate = moment(this.props.endDate, 'DD-MM-YYYY');
        
        this.setState({startDate: startDate, endDate: endDate});
        this.initRangeDays(startDate, endDate);
    }

    render() {
        return (
            <div className="Datepicker">
                <div
                    hidden
                    id="datepicker-label"
                    onClick={() =>
                        this.setState({ showDatePicker: !this.state.showDatePicker })
                    }
                >
                </div>

                {this.state.showDatePicker && 
                    <DayPickerRangeController
                        startDate={this.state.startDate}
                        endDate={this.state.endDate}
                        onDatesChange={this.onDatesChange}
                        focusedInput={this.state.focusedInput}
                        onFocusChange={this.onFocusChange}
                        renderDayContents={this.renderDayDesktop}
                        keepOpenOnDateSelect={false}
                        enableOutsideDays={false}
                        hideKeyboardShortcutsPanel={true}
                        minimumNights={0}
                        numberOfMonths={2}
                        noBorder
                        onOutsideClick={() => this.setState({ showDatePicker: false })}
                        isOutsideRange={day => !isInclusivelyAfterDay(day, moment())}
                    />
                }
            </div>
        );
    }
}

export default DatePickerDesktop;