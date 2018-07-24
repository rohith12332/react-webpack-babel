export default function getCurrentDate(){    
    let today, dd, mm, yyyy;
    today = new Date();
    dd = today.getDate();
    mm = today.getMonth() + 1;
    yyyy = today.getFullYear();

    if(dd<10) dd='0'+dd;
    if(mm<10) mm='0'+mm;
    today = yyyy+'-'+mm+'-'+dd;
    return today;
}