import React, { Component } from 'react';
import { isMobile } from "react-device-detect";
import moment from 'moment';
import './style.css';

class DatepickerHeader extends Component {
    componentDidMount() {
        let { onHeaderHeightInit } = this.props;

        onHeaderHeightInit(this.headerElement.clientHeight);
    }

    render() {
        const {startDate, time_start, endDate, time_end, onReset} = this.props;

        return (
            <div className="Datepicker-header" ref={(headerElement) => { this.headerElement = headerElement }}>
                <div className="Datepicker-header__reset">
                    <button className="Datepicker__button-reset" onClick={onReset} type="button">Сбросить</button>
                </div>
                {isMobile &&
                    <div className="Datepicker-header__wrapp">
                        <div className="Datepicker-header__item">
                            <div className="Datepicker-header__date">
                                {startDate
                                    ? moment(startDate).format("ddd, D MMMM")
                                    : 'Start date'
                                }
                            </div>
                            <div className="Datepicker-header__time">
                                {time_start ? moment(time_start, 'x').format("H:mm") : null}
                            </div>
                        </div>
                        <div className="Datepicker-header__delimiter"></div>
                        <div className="Datepicker-header__item">
                            <div className="Datepicker-header__item">
                                <div className="Datepicker-header__date">
                                    {endDate
                                        ? moment(endDate).format("ddd, D MMMM")
                                        : 'End date'
                                    }
                                </div>
                                <div className="Datepicker-header__time">
                                    {time_end ? moment(time_end, 'x').format("H:mm") : null}
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    }
}
    
export default DatepickerHeader;