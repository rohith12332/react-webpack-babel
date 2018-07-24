import React from 'react';
import createClass from 'create-react-class';
import PropTypes from 'prop-types';
import Select from 'react-select';

const STATES = require('../data/states');
import './select.scss';
var StatesField = createClass({
	displayName: 'StatesField',
	propTypes: {
		label: PropTypes.string,
		searchable: PropTypes.bool,
	},
	getDefaultProps () {
		return {
			label: 'States:',
			searchable: true,
		};
	},
	getInitialState () {
		return {
			country: 'AU',
			disabled: false,
			searchable: this.props.searchable,

			clearable: true,
			rtl: false,
		};
	},
	switchCountry (e) {
		var newCountry = e.target.value;
		this.setState({
			country: newCountry,
			selectValue: null,
		});
	},
	updateValue (newValue) {
		alert(newValue)
		this.setState({
			selectValue: newValue,
		});
	},
	focusStateSelect () {
		this.refs.stateSelect.focus();
	},
	toggleCheckbox (e) {
		let newState = {};
		newState[e.target.name] = e.target.checked;
		this.setState(newState);
	},
	render () {
		var options = STATES[this.state.country];
		return (
			<div className="section">

				<Select
					id="state-select"
					ref="stateSelect"
					options={options}
					simpleValue
					name="selected-state"
					value={this.state.selectValue}
					onChange={this.updateValue}
					rtl={this.state.rtl}
				/>

			</div>
		);
	}
});


module.exports = StatesField;
