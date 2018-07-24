import React from 'react';
import DatePicker from 'material-ui/DatePicker';
import injectTapEventPlugin from 'react-tap-event-plugin';
	injectTapEventPlugin();



class DatePickerExampleSimple extends React.Component{
	constructor(props) {
		super(props);
		
	}
	openDatePicker = () => {
		this.refs.datePickerStartDate.focus();
	}
	render(){
		console.log(this.props)
		return(
			  <div>
				  <div className="datepicker-wrapper">
				    <DatePicker hintText="Open to Year" openToYearSelection={true} ref='datePickerStartDate' />
				  </div>
				  <div className="input-group-addon btn btn-secondary" onClick={this.openDatePicker}><i className="icon icon-799"></i></div>
			  </div>
		)
	}
}
export default DatePickerExampleSimple;