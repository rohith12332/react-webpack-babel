import React               from 'react';
import {Link, IndexLink}   from 'react-router';
import Header    from '../common/Header';
import Footer from '../common/Footer';
import StoreCore           from './storeCore';
import PageHead            from './PageHead';
import './store.scss';

class Stores extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      moduleTitle:"Choose a Store",
      ButtonAddStore: 'Add Store'
    }
  }
  componentDidMount() {
    document.body.classList.add('has-no-nav');
  }
  componentWillUnmount() {
    document.body.classList.remove('has-no-nav');
  }
  render(){
    var credentials = JSON.parse(window.sessionStorage.getItem("userDetails"));
    //console.log(credentials.storeuser)
    return (
      <div className="am-wrapper am-nosidebar-left">
      <Header />
        <div className="am-content">
        <PageHead />
          <div className="main-content container" id="stores">
            <div className="contentful">
              <div className="store-head mainScreen">{this.state.moduleTitle}</div>
              <section id="">
                  <div className="row">
                    <StoreCore ref={instance => { this.child = instance; }} />
                  </div>
              </section>
            </div>
            <div className="container clearfix">
              <div className="row">
                <div className="add-store-btn-wrp green-links">
                  {!credentials.storeuser && <Link data-modal="addstore mainScreen" href="javascript:void(0)" className="md-trigger" onClick={() => {this.child.openAdd();}}><i className="icon icon-1189"></i>{this.state.ButtonAddStore}</Link>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Stores;