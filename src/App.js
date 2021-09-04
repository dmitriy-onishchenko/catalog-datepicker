import React, { Component } from 'react';
import DatePickerDesktop from './pages/DatepickerDesktop';
import DatePickerDesktopPrice from './pages/DatepickerDesktopPrice';
import DatePickerMobileUpdate from './pages/DatePickerMobileUpdate';
import { isMobile, isBrowser } from "react-device-detect";
import './App.css';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			car_availability: null,
			car_prices: null,
			startDate: null,
			lastDate: null,
			startTime: null,
			endTime: null,
			init: false
		};
	}

	componentDidMount() {
		if (isMobile) {
			document.getElementsByTagName("html")[0].classList.add('is-mobile-device');
		}

		if (isBrowser) {
			document.getElementsByTagName("html")[0].classList.add('is-desktop-device');
		}
		$(window).trigger('datepickerInit');
	}

	render() {
		return (
			<div className="App">
				<div
                    hidden
                    id="datepicker-init"
                    onClick={() => {
						var startDate = document.querySelectorAll('[name=dateStart]')[0].value; 
						var endDate = document.querySelectorAll('[name=dateEnd]')[0].value;

						this.setState({ startDate: startDate, endDate: endDate })
						this.setState({init: true})
                    }}
                >
                </div>
				{this.state.init &&
					<div>
						<DatePickerMobileUpdate startDate={this.state.startDate} endDate={this.state.endDate}></DatePickerMobileUpdate>
						<DatePickerDesktop startDate={this.state.startDate} endDate={this.state.endDate}></DatePickerDesktop>
					</div>
				}
			</div>
		);
	}
}

export default App;