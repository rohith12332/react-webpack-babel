import React from 'react'
import { Route, Switch } from 'react-router-dom'

import App from './components/App'
import LoginForm from './components/LoginPage/LoginForm'

export default () => {
    return(
        <Switch>
            <Route exact path="/" component={ App }/>
            <Route path="/login" component={ LoginForm }/>
        </Switch>
    )
}