import React from 'react';
import DefaultLayout from '../common/DefaultLayout';
import SideBarRight from '../common/SideBarRight';
import { browserHistory, Router, Route, Link, withRouter } from 'react-router';
import getUserDetails from '../common/CredentialDomain';
import TerminalList from './TerminalList';

class Terminals extends React.Component {
	constructor(props) {
      super(props);
      this.state = {
        terminal:[],
      	msgFailure:"",
        msgSuccess:"",
        pageHead:{
        pagehead:'Terminal',
        dashboard:'Dashboard',
        setup: 'Setup'
      },

      }
       this.onRemoveTerminal = this.onRemoveTerminal.bind(this);

}

    componentDidMount() {
    this.GetAllTerminals();
  }


onRemoveTerminal(terminalid){

    //console.log(terminalid);
   var id;
   var DelTerminal = {};
   var that = this;
   id = terminalid;
    //console.log(id);

    var storeuniquekey = window.sessionStorage.getItem('storeuniquekey');
    var domainuniquekey = window.sessionStorage.getItem('domainuniquekey');
    var credentials = getUserDetails();


    credentials["storeuniquekey"] = storeuniquekey;
    credentials["domainuniquekey"] = domainuniquekey;

    var index = -1;
    var _totalterminals = this.state.terminal.length;
    for( var i = 0; i < _totalterminals; i++ ) {
      if(this.state.terminal[i].id == terminalid){
        index = i;
        break;
      }
    }
    this.state.terminal.splice( index, 1 );
    this.setState( {terminals: this.state.terminal});

    DelTerminal['terminalid'] = terminalid;
    DelTerminal['userdetails'] = getUserDetails();
    DelTerminal['isdeleted'] = true;

    console.log(JSON.stringify(DelTerminal));

    const request = new Request(`${process.env.API_HOST}/ManageTerminals.svc/DeleteTerminal/json`, {
      method: 'POST',
      headers: new Headers({
          'Content-Type': 'application/json'
      }),
      body: JSON.stringify(DelTerminal)
    });

    return fetch(request).then(function(response) {
      return response.json();
    }).then(function(data) {
      if (data.statusCode >= 400) {
        that.setState({
          msgFailure: data.statusMessage
        })
      } else {
        that.setState({
          msgSuccess: data.statusMessage
        });
       /* setTimeout(function() {
          browserHistory.push('/terminals')
        }, 5000)*/
      }
    }).catch(function(error) {
      return error;
    })
  }


  GetAllTerminals() {
    var that = this;
    var credentials = {};
    var storeuniquekey = window.sessionStorage.getItem('storeuniquekey');
    credentials['index'] = 2147483647;
    credentials['recordcount'] = 2147483647;
    credentials["userdetails"] = getUserDetails();
    credentials["userdetails"]['storeuniquekey'] = storeuniquekey;

    console.log(JSON.stringify(credentials));

    const request = new Request(`${process.env.API_HOST}/ManageTerminals.svc/GetAllTerminals/json`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(credentials)
    });
    fetch(request)
      .then(function(response) {
        return response.json();
      }).then(function(data) {
        console.log(data);
        that.setState({
          terminal: data.terminallist
        });
      });
  }


    render(){
      var currentDomain = window.sessionStorage.getItem("currentdomainname");
      var currentStore = window.sessionStorage.getItem("currentstorename");
    	const {msgSuccess, msgFailure,terminal,pageHead } = this.state;
    	return(
        <DefaultLayout>
            <div className="page-head inner__pageHead">
                <div className="domain-icon"> <img src={require( './terminal.svg')}/> <h2>{pageHead.pagehead}</h2> </div>
                    <ol className="breadcrumb">
                      <li><Link to={`/domains`}>{currentDomain}</Link></li>
                      <li><Link to={`/stores`}>{currentStore}</Link></li>
                      <li><Link to={`/dashboard`}>{pageHead.dashboard}</Link></li>
                      <li><Link to={`/setup`}>{pageHead.setup}</Link></li>
                      <li className="active">{pageHead.pagehead}</li>
                    </ol>
            </div>
            <main>
        {msgFailure && <div className="alert alert-warning alert-dismissible" role="alert">
        <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          {msgFailure}
        </div>}
        {msgSuccess && <div className="alert alert-success alert-dismissible" role="alert">
        <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          {msgSuccess}
        </div>}
        <div className="master-table">
            <div className="row">
              <div className="col-sm-12">
                <div className="">
                     <div className="" id="terminal">
                     <TerminalList terminal={terminal} onRemoveTerminal={this.onRemoveTerminal}/>
                    </div>
                </div>
                </div>
              </div>
            </div>
            </main>
        </DefaultLayout>
        )
    }
}
export default Terminals;
