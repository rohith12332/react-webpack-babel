import React, {PropTypes} from 'react';
const RadioInput = ({name, id, checked, value, defaultChecked, type="radio"}) => {

  return (
    <input 
      type={type} 
      checked={checked}
      value={value}
      defaultChecked={defaultChecked}
      name={name}
      id={id}
    />
  );
};

RadioInput.propTypes = {
  name: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  defaultChecked: PropTypes.string
};

export default RadioInput;