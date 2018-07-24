import React, {PropTypes} from 'react';
const Checkbox = ({name, id, label, onChange, checked, value, defaultChecked, type="checkbox"}) => {

  return (

    
    <div className="form-group">
      <label className="control-label">{label}</label>
      <div>
        <div className="switch-button switch-button-info">
          <input 
            type={type} 
            onChange={onChange}
            checked={checked}
            defaultChecked={defaultChecked}
            name={name}
            id={id}
          />
          <span><label htmlFor={name}></label></span> 
        </div>
      </div>
    </div>
  );
};

Checkbox.propTypes = {
  name: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  defaultChecked: PropTypes.string
};

export default Checkbox;