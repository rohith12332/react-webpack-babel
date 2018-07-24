import React, {PropTypes} from 'react';


const TextInput = ({name, id, tabIndex, label, disabled, onChange,readOnly, placeholder, value, defaultValue, required, onBlur,onFocus, type="text"}) => {
  return (
    <div className="field">
      <label htmlFor={name}>{label}<span className="required"> {required}</span></label>
        <input
          type={type}
          name={name}
          id={name}
          tabIndex={tabIndex}
          className="form-control"
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          label={label}
          disabled={disabled}
          required={required}
          onChange={onChange} 
          readOnly={readOnly}
          onBlur = {onBlur} 
          onFocus={onFocus}/>
    </div>
  );
};

TextInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  /*value: PropTypes.string,
  defaultValue: PropTypes.string*/
};

export default TextInput;