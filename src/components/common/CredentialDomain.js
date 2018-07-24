export default function getUserDetails(){
	var credentials = JSON.parse(window.sessionStorage.getItem("userDetails"));
    var storeuniquekey = window.sessionStorage.getItem('storeuniquekey');
    var domainuniquekey = window.sessionStorage.getItem('domainuniquekey');

    credentials["domainuniquekey"] = domainuniquekey;
    credentials['storeuniquekey'] = storeuniquekey;

    console.log('storeun:'+storeuniquekey);
    console.log('domain:'+domainuniquekey);

    return credentials;
}