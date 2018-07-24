import React, {PropTypes} from 'react';
const spanError = ({id, name}) => {
	return(
		<span id={id}>`{this.state.errors.$name}`</span>
	)
}
export default spanError;