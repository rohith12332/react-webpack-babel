import { combineReducers } from 'redux'
import articlesReducer from './article.reducers'
import authReducer from './auth.reducers'

const rootReducer = combineReducers({
    articlesReducer,
    authReducer
})
export default rootReducer;