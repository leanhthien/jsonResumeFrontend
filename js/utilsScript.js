
/*
* Script for common use
*/

function setupNavigation() {

    var token = window.localStorage.getItem('token');
    var username = window.localStorage.getItem('baseURL');

    if (isEmpty(token)) {
        $('.guestNavigation').show();
        $('.userNavigation').hide();
    } else {
        $('.guestNavigation').hide();
        $('.userNavigation').show();
        $('#usernameNavigation').html(username);
    }

};

function getParam(param) {
    const searchParams = new URLSearchParams(window.location.search);

    if (searchParams.has(param)) {
        let value = searchParams.get(param);
        return value;
    }
    return "";
}

function isEmpty(str) {
    return (!str || 0 === str.length);
}

function insertAlert(messege) {
    return '<div class="alert alert-danger" role="alert">' + messege + '</div>';
}

function isDomainOfServer(url) {
    if (url.includes("file://")){
        return false;
    }
    return true;
}