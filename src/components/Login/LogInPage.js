import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classnames from 'classnames';
import Footer from '../common/Footer';
import auth from '../../auth/authenticator';
import { loginUser } from '../../actions/sessionActions';
import Header from '../common/Header';
import TextInput from '../common/TextInput';
import Cookies from 'universal-cookie';

global.jQuery = require('jquery');

class LogInPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      querystrings: [],
      credentials: {
        username: '',
        password: ''
      },
      errors: {},
      showStore: false,
      loading: false,
      servererror: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setCookies = this.setCookies.bind(this);
  }
  componentDidMount() {
    this.setCookies();
  }
  componentWillMount(e) {
    const querystrings = {};
    let urlquery, domainuniquekey, storeuniquekey;

    urlquery = this.props.location.query;

    querystrings['domainuniquekey'] = urlquery.domainuniquekey;
    querystrings['storeuniquekey'] = urlquery.storeuniquekey;

    this.setState({
      querystrings: querystrings
    })
  }

  handleChange(e) {
    if (!!this.state.errors[e.target.name]) {

      let errors = Object.assign({}, this.state.errors);
      delete errors[e.target.name];
      this.setState({ errors });

      //set loading state
      this.setState({ loading: true });

      //get username and password
      const field = e.target.name;
      const credentials = this.state.credentials;

      //assign username and password value to credentials
      credentials[field] = e.target.value;

      //set and return credentials states
      return this.setState({ credentials: credentials });
    } else {
      //set loading state
      this.setState({ loading: true });

      //get username and password
      const field = e.target.name;
      const credentials = this.state.credentials;

      //assign username and password value to credentials
      credentials[field] = e.target.value;

      //set and return credentials states
      return this.setState({ credentials: credentials });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    var that = this;
    const cookies = new Cookies();
    if (jQuery('#remember').is(':checked')) {
      var username = jQuery('#username').val();
      var password = jQuery('#password').val();

      cookies.set('username', username);
      cookies.set('password', password);
      cookies.set('remember', true);
    }
    else {
      // reset cookies
      cookies.set('username', null);
      cookies.set('password', null);
      cookies.set('remember', null);
    }

    let errors = {};
    if (this.state.credentials.username === '') errors.username = "Username can't be empty";
    if (this.state.credentials.password === '') errors.password = "Password can't be empty";
    this.setState({ errors });
    const isValid = Object.keys(errors).length == 0;
    if (isValid) {
      var credentials = {};
      var username, password;
      username = jQuery('#username').val();
      password = jQuery('#password').val();
      credentials['username'] = username;
      credentials['password'] = password;

      this.props.actions.loginUser(credentials, this.state.querystrings);
    }
  }
  setCookies() {
    const cookies = new Cookies();
    var remember = cookies.get('remember');
    if (remember == 'true') {
      var username = cookies.get('username');
      var password = cookies.get('password');
      jQuery('#username').val(username);
      jQuery('#password').val(password);
      jQuery('#remember').prop('checked', true);
      this.setState({
        credentials: {
          username: username,
          password: password
        }
      })
    } else {
      jQuery('#remember').prop('checked', false);
      this.setState({
        credentials: {
          username: '',
          password: ''
        }
      })
    }
}
render() {
    jQuery(window).on('load', function(){
        jQuery('#username').focus();
    });
    console.log(this.props)
    let {isLoginPending, isLoginSuccess, isLoginError} = this.props;
    return (
      <div className="login-wrapper">
        <div className="login-container">
          <div className="brand__logo"><img src={require('./login-logo.png')} /></div>
          <div id="login-wrap">
            <div className="panel panel-default">
              <div className="panel-heading"><span>Login to your Account</span></div>
              {isLoginError && <div className="alert alert-warning alert-dismissible" role="alert">
                <button type="button" className="close" data-dismiss="alert" aria-label="Close"></button>
                {isLoginError}
              </div>}
              <div className="panel-body">
                <form className={classnames('form-horizontal', { loading: this.state.loading })} onSubmit={this.handleSubmit}>
                  <div className="login-form">
                    <div className="form-group xs-mb-20">
                      <div className="form-wrap">
                        <div className={classnames('field', { error: !!this.state.errors.username })}>
                          <img src={require('./loginuser.svg')} />
                          <input type="email" className="input-invisible" />
                          <input type="password" className="input-invisible" />
                          <input
                            name="username"
                            value={this.state.credentials.username}
                            onChange={this.handleChange}
                            placeholder="Email / Username"
                            autoComplete="off"
                            id="username"
                            className={classnames('form-control', { error: !!this.state.errors.username })} />
                          <span>{this.state.errors.username}</span>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="form-wrap">
                        <div className={classnames('field', { error: !!this.state.errors.username })}>
                          <img src={require('./password.svg')} />
                          <input
                            name="password"
                            value={this.state.credentials.password}
                            onChange={this.handleChange}
                            placeholder="Password"
                            type="password"
                            autoComplete="off"
                            id="password"
                            className={classnames('form-control', { error: !!this.state.errors.password })} />
                          <span>{this.state.errors.password}</span>
                        </div>
                      </div>
                    </div>
                    <div className="form-group login-submit">
                      <input
                        type="submit"
                        value="Submit"
                        //disabled={isLoginPending}
                        //className="btn-primary btn-lg btn-loading"

                        className={classnames('btn-primary btn-lg',{'btn-loading':isLoginPending})}
                       />

                    </div>
                    {isLoginPending && <div className="form-group footer row" style={{textAlign: 'center'}}>
                      <label>Please wait...</label>
                    </div>}
                    <div className="form-group footer row">
                      <div className="col-sm-6 col-xs-12">
                        <div className="am-checkbox">
                          <input id="remember" type="checkbox" />
                          <label htmlFor="remember">Remember me</label>
                        </div>
                      </div>
                      <div className="col-sm-6 col-xs-12 text-right text-left-xs"><a id="forgot" href="#">Forgot Password?</a></div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="panel-bottom"><span>©2016 OnePOS Retail Soltions. All Rights Reserved.</span></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log(state)
  return state.sessionReducer;
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({loginUser}, dispatch)
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(LogInPage);
