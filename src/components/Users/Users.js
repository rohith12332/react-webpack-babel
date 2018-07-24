import React from 'react';
import DefaultLayout from '../common/DefaultLayout'
import SideBarRight from '../common/SideBarRight';
import Breadcrumbs from '../common/Breadcrumbs';
import { browserHistory, Link } from 'react-router';
import getUserDetails from '../common/CredentialDomain';
import Tabelify from '../react-tabelify/Tabelify';
import _ from  'underscore';
import './users.css';


var columnMetadata = [
    {
        "columnName": "username",
        "displayName": "User Name"
    },
    {
        "columnName": "firstname",
        "displayName": "First Name"
    },
    {
        "columnName": "lastname",
        "displayName": "Last Name"
    },
    {
        "columnName": "mobilephone",
        "displayName": "Phone Number",
    },
    {
        "columnName": "role_value",
        "displayName": "Role",
    },
    {
        "columnName": "id",
        "displayName": "Action",
        render:()=>{
            return <div></div>
        },
        "flexBasis":'190px'
    }
];
class Users extends React.Component {
  constructor(props) {
    super(props)
    this.onChangeGrid = this.onChangeGrid.bind(this);
    this.state = {
      users: [],
      msgFailure:"",
      msgSuccess:"",
      tableConfig: {
        columnMetadata: columnMetadata,
        currentPage: 1,
        showCheckbox: false,
        onChangeGrid: this.onChangeGrid,
        selectedRows: {},
        onRowClick: this.onRowClick,
        resultsPerPage: 40,
        localSearch: true,
        btnText: 'Add User',
        btnUrl:'users/new',
        isLoading: true
      }
    }
    this.onRemoveUser = this.onRemoveUser.bind(this);
    this.modifyUser = this.modifyUser.bind(this);
  }

  onChangeGrid(event, data) {
    var tableConfig = this.state.tableConfig;
    _.extend(tableConfig, data);
    this.setState({
      tableConfig: tableConfig
    });
  }

  componentDidMount() {
    this.getUsers();
  }

  onRemoveUser(userId){
    var id;
    var DelUser = {};
    var credentials = {};
    var that = this;
    id = userId;

    var index = -1;
    var _totalusers = this.state.users.length;
    for( var i = 0; i < _totalusers; i++ ) {
      if(this.state.users[i].id == userId){
        index = i;
        break;
      }
    }
    this.state.users.splice( index, 1 );
    this.setState( {users: this.state.users});

    DelUser['UserID'] = userId;
    DelUser['userdetails'] = getUserDetails();
    DelUser['isdeleted'] = true;
    const request = new Request(`${process.env.API_HOST}/ManageUsers.svc/DeleteUser/json`, {
      method: 'POST',
      headers: new Headers({
          'Content-Type': 'application/json'
      }),
      body: JSON.stringify(DelUser)
    });

    return fetch(request).then(function(response) {
      return response.json();
    }).then(function(data) {
      if (data.statusCode >= 400) {
        that.setState({
          msgFailure: data.statusMessage
        })
        setTimeout(function() {
        that.setState({
          msgFailure:''
        })
      }, 4000);
      } else {
        that.setState({
          msgSuccess: data.statusMessage
        });
        setTimeout(function() {
        that.setState({
          msgSuccess:''
        })
      }, 4000);
      }
    }).catch(function(error) {
      return error;
    })
  }
  modifyUser(vendorid){
    browserHistory.push(`/users/${vendorid}`)
  }

  getUsers() {
    var that = this;
    var credentials = {};
    credentials['userdetails'] = getUserDetails();
    const request = new Request(`${process.env.API_HOST}/ManageUsers.svc/GetUsers/json`, {
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
        console.log(data)
        var tableConfig = that.state.tableConfig;
        tableConfig['isLoading'] = false;
        that.setState({
          users: data.usersList
        });
      });
  }
  render(){
    const {msgSuccess, msgFailure, users} = this.state;

    let currentDomain = window.sessionStorage.getItem("currentdomainname");
    let currentStore = window.sessionStorage.getItem("currentstorename");
    return(

      <DefaultLayout>
          <div className="page-head inner__pageHead">
            <div className="domain-icon"> <img src={require( './user-list.svg')}/> <h2>Users</h2></div>

            <ol className="breadcrumb">
              <li><Link to={`/domains`}>{currentDomain}</Link></li>
              <li><Link to={`/stores`}>{currentStore}</Link></li>
              <li><Link to={`/dashboard`}>Dashboard</Link></li>
              <li><Link to={`/setup`}>Setup</Link></li>
              <li>Users</li>
            </ol>
          </div>
          <main>
          <div className="master-table">
            {msgFailure && <div className="alert alert-warning alert-dismissible" role="alert">
            <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            {msgFailure}
            </div>}
            {msgSuccess && <div className="alert alert-success alert-dismissible" role="alert">
            <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            {msgSuccess}
            </div>}
            <div className="row">
              <div className="col-sm-12">
                <div className="">
                  <div className="" id="user-list">
                      <Tabelify
                        data={users} {...this.state.tableConfig}
                        urlHandler
                        editHandler={this.modifyUser}
                        deleteHandler={this.onRemoveUser}
                      />
                    {/*<UserList users={users} onRemoveUser={this.onRemoveUser}/>*/}
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
export default Users;