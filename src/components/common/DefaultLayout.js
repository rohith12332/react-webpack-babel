import React, { Component, PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';
import auth from '../../auth/authenticator';

import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import SideBarRight from './SideBarRight'
import LogInPage from '../Login/LogInPage';
import pageHead from './pageHead';

class DefaultLayout extends Component {
    render() {
        console.log(auth.loggedIn());
        if (auth.loggedIn()) {
            return (
                <div className="am-wrapper am-fixed-sidebar">
                    <Header />
                    <Sidebar />
                    <section className="am-content">
                        <div className="main-content">
                            {this.props.children}
                        </div>
                    <Footer />
                    </section>
                    <SideBarRight />
                </div>
            )
        }else{
            return (
            <div>
                //{ this.props.children }
            </div>
            )
        };
    }
}

export default DefaultLayout;