import * as types from './actionTypes';
import StoresApi from '../api/StoresApi';

export function storeList() {
	return function(dispatch) {
		return StoresApi.storeslist().then(response => {
				
		});
	}
}