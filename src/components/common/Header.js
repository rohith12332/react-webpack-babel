import React, { PropTypes } from "react";
import { Link, IndexLink } from "react-router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sessionActions from "../../actions/sessionActions";
import * as today from "../common/Date";
import auth from "../../auth/authenticator";
import moment from "moment";
global.jQuery = require("jquery");

var datetime = null,
  date = null;

var update = function() {
  date = moment(new Date());
  datetime.html(date.format(" h:mm:ss A, MM-DD-YYYY"));
};

class Header extends React.Component {
  constructor(props) {
    super();
    this.logOut = this.logOut.bind(this);
  }
  componentDidMount() {
    //Jquery Script for header Date and Time
    jQuery(document).ready(function() {
      //initialize the javascript
      App.init();
      datetime = jQuery("#datetime");
      update();
      setInterval(update, 1000);

      $(window).on("scroll", function() {
        if ($(this).scrollTop() > 20) {
          $(".headerRow").addClass("pull-up");
          $(".headerRow__cell--right").fadeOut();
        } else {
          $(".headerRow").removeClass("pull-up");
          $(".headerRow__cell--right").fadeIn();
        }
      });
      jQuery(document).ready(function() {
        jQuery(".js-toggle__nav").click(function(e) {
          jQuery(this).toggleClass("is-active");
          jQuery(".profile-menu").toggleClass("is-active");
          e.preventDefault();
        });
      });
    });
  }

  logOut(event) {
    event.preventDefault();
    this.props.actions.logOutUser();
  }

  render() {
    return (
      <header className="main__header">
        <div className="headerRow">
          <div className="headerRow__cell--left">
            <h1 className="c-brand__logo">
              <Link to="/dashboard">
                <img
                  className="c-brand__logo--media"
                  src={require("../common/logo.png")}
                />
              </Link>
            </h1>

            <a href="#" className="am-toggle-left-sidebar collapsed">
              {" "}
              <span className="icon-bar">
                <span />
                <span />
                <span />
              </span>
            </a>
            {/* <a href="#" className="am-toggle-right-sidebar"><span className="icon s7-menu2"></span></a> */}
          </div>
          <div className="headerRow__cell--right">
            <a href="#" className="toggle-profile js-toggle__nav">
              <b>
                <img className="iconBuddy" src={require("../common/boy.svg")} />
              </b>
              <span className="angle-down icon-559" />
            </a>

            <ul className="profile-menu">
              <li>
                <Link to={`/profile`}>
                  <i className="fa fa-user" aria-hidden="true" />My profile
                </Link>
              </li>
              {/* <li>
                <Link to={`/`}>
                  <i className="fa fa-cog" aria-hidden="true" />Settings
                </Link>
              </li> */}
              <li>
                <Link to={`/logout`} onClick={this.logOut}>
                  <i className="fa fa-sign-out" aria-hidden="true" />Sign Out
                </Link>
              </li>
            </ul>

            {/* <ul className="c-userController">
            <li className="dropdown">
              <a href="#" data-toggle="dropdown" className="dropdown-toggle">
                <b><img className="iconBuddy" src={require('../common/boy.svg')} /></b>
                <span className="angle-down icon-559"></span>
              </a>

              <ul className="dropdown-menu" role="menu">
                <li><Link to={`/profile`}><i className="fa fa-user" aria-hidden="true"></i>My profile</Link></li>
                <li><Link to={`/`}><i className="fa fa-cog" aria-hidden="true"></i>Settings</Link></li>
                <li><Link to={`/logout`} onClick={this.logOut}><i className="fa fa-sign-out" aria-hidden="true"></i> Sign Out</Link></li>
              </ul>
            </li>
          </ul> */}
          </div>
        </div>
      </header>
    );
  }
}

Header.propTypes = {
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return { logged_in: state.session };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(sessionActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
