

// Global variables
var BASE_URL = ""; //Server domain to connect
var TOKEN = ""; //Token to connect server
var USER_ID = "";
var USER_NAME = "";
var PRODUCT_ID = 0;
var domain= "";

$(document).ready(function () {

    init();

});

function init() {

    $("#navigationHeader").load("_navForVer3.html");

    setupNavigation();

    var baseUrl = getParam('url');

    if (!isEmpty(baseUrl)) {
        var username = getParam('name');
        var fullUrl = baseUrl + "view";
        detailResume(fullUrl, "", username );
        $('#action-button').hide();
    }
    else {
        var productId = getParam('id');
        domain = location.origin;

        if(!isDomainOfServer(domain)) {
            domain = "home.html";
        }

        if (!isEmpty(productId)) {
            TOKEN = window.localStorage.getItem('token');
            if (isEmpty(TOKEN)) {
                window.location.replace(domain + "?callback=true&id=" + productId);                
            }
            else {
                BASE_URL = window.localStorage.getItem('baseURL');
                TOKEN = window.localStorage.getItem('token');
                USER_ID = window.localStorage.getItem('userId');
                USER_NAME = window.localStorage.getItem('username');
                var fullUrl = BASE_URL + "product/detail";
                detailResume(fullUrl, productId, "");
                $('#action-button').show();

                $('#edit').click(function(){
                    window.location.replace(domain + "?edit=" + productId);
                });
            
                $('#back').click(function(){
                    window.location.replace(domain);
                });
            }
        }
        else {
            window.location.replace("404Page.html");
            // console.log("Cannot find the page!");
        }
    }

};

function detailResume(url, id, name) {
    console.log('url -', url);
    $.ajax({
        type: "GET",
        url: url,
        data: {
            id: id,
            name: name,
            token: TOKEN,
            userId: USER_ID
        },
        dataType: 'json',
        success: function (response) {

            if (response.status == "Success") {
                console.log("Get data success!");

                $('[itemprop="name"]').html(`<b>`+ response.data.name +`</b>`);
                $('[itemprop="jobTitle"]').html(response.data.jobTitle);
                $('[itemprop="address"]').html(response.data.address);
                $('[itemprop="telephone"]').html(response.data.telephone);
                $('[itemprop="email"]').html(response.data.email);
                $('[itemprop="website"]').html(response.data.website);
                $('[itemprop="language"]').html(response.data.language);
                $('[itemprop="description"]').html(response.data.about);
                $('[itemprop="work-experience"]').html(response.data.workExperience);
                
            } else {
                window.location.replace("404Page.html");
                console.log("Cannot get data!");
            }
        },

        error: function (request, status, error) {
            window.location.replace("404Page.html");
            console.log('The page was NOT loaded', error);
        },

    });
};

function transferToHomePage(id) {
    window.location.replace(domain + "?nav=" + id);
};