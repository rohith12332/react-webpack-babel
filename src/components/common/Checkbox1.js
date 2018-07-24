import React, {PropTypes} from 'react';
const Checkbox1 = ({name, id, label, onChange, checked, value, defaultChecked, type="checkbox"}) => {

  return (
    <div className="form-group">
        <div className="am-checkbox">
          <input 
            type={type} 
            onChange={onChange}
            checked={checked}
            defaultChecked={defaultChecked}
            name={name}
            id={id}
          />
          <label htmlFor={name}>{label}</label>
          
        </div>
         
    </div>
  );
};

Checkbox1.propTypes = {
  name: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  defaultChecked: PropTypes.string
};

export default Checkbox1;