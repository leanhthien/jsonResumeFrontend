
/*
* Script for common use
*/

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