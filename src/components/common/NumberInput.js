import React, {PropTypes} from 'react';

const NumberInput = ({name, label, onChange, placeholder, value, defaultValue, required, type="number"}) => {

  return (
    <div className="field">
      <label htmlFor={name}>{label}<span className="required"> {required}</span></label>
        <input
          type={type}
          name={name}
          className="form-control"
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          label={label}
          required={required}
          onChange={onChange} />
    </div>
  );
};

NumberInput.propTypes = {
  name: PropTypes.number.isRequired,
  label: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.number,
  value: PropTypes.number,
  defaultValue: PropTypes.number
};

export default NumberInput;