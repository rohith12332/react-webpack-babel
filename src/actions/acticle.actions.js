import { articleConstants } from '../constants';

export const addArticle = article => (
    {
        type: articleConstants.ADD_ARTICLE,
        payload: article
    }
);