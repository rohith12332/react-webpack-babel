import { articleConstants } from '../constants';

const initialState = {
    articles: []
};
const articlesReducer = (state = initialState, action) => {
    switch (action.type) {
        case articleConstants.ADD_ARTICLE:
            return { ...state, articles: [...state.articles, action.payload] };
        default:
          return state;
      }
    };
export default articlesReducer;