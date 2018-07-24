class StoresApi {
    static storeslist() {
        var superadmin = window.sessionStorage.getItem("superadmin");
        var domainadmin = window.sessionStorage.getItem("domainadmin");
        var storeuser = window.sessionStorage.getItem("storeuser"); 
        var domainuniquekey = window.sessionStorage.getItem("domainuniquekey"); 
        var credentials = JSON.parse(window.sessionStorage.getItem("credentials")); 

        credentials["domainadmin"] = domainadmin;
        credentials["domainuniquekey"] = domainuniquekey;
    } 
}

export default StoresApi;