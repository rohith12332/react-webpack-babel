export const Currency = () => {
	let country = window.sessionStorage.getItem('storecountry');
	if(country === 'India'){
		return "₹"
	}else{
		return "$"
	}
}
