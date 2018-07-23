import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { login } from '../../actions/auth.actions'

export class LoginForm extends Component {
  constructor(props){
    super(props);

    this.state = {
      username: '',
      password: '',
      submitted: false
    };
  }
  
  render() {
    const { username, password, submitted } = this.state;
    return (
      <div className="c-login">
        <form>
          <h1>Login Form</h1>
          <input
            type="text"
            label="Hello"
            className="c-input"
            placeholder="User Name"
          />
           <input
            type="text"
            label="Hello"
            className="c-input"
            placeholder="Password"
          />
        </form>       
      </div>
    )
  };
};

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = (dispatch) => {
  actions: bindActionCreators({login}, dispatch)
};

//export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(LoginForm));
export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);

