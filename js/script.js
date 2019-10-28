// Global variables
var BASE_URL = ""; //Server domain to connect
var TOKEN = ""; //Token to connect server
var USER_ID = ""; // userId of user
var USER_NAME = ""; // username of user
var data;
var PRODUCT_ID = 0;
var domain = "";

WebFontConfig = {
    google: {
        families: ['Lato:300,400,700:latin']
    }
};

$(document).ready(function () {

    // $("#navigationHeader").load("_nav.html");

    setupNavigation();

    checkDomain();

    setupListener();

});

/*
 * Function for checking before loading page's content
 */

function checkDomain() {

    $(".page").hide();

    BASE_URL = window.localStorage.getItem('baseURL');
    TOKEN = window.localStorage.getItem('token');
    USER_ID = window.localStorage.getItem('userId');
    USER_NAME = window.localStorage.getItem('username');

    domain = location.origin;

    if (isDomainOfLocal(domain)) {
        domain = location.href;
    }

    if (isEmpty(BASE_URL)) {
        getDomain();
    } else {
        checkShareResume();
    }
};

function checkShareResume() {

    var name = getParam('name');
    if (!isEmpty(name)) {
        transferToDetailResume("view", name)
    } else {
        checkLogin();
    }
}

function checkLogin() {
    TOKEN = window.localStorage.getItem('token');
    if (isEmpty(TOKEN)) {
        transferToLogin();
    } else {
        transferToUserResume();
    }
}

function setupListener() {

    $("#setupDomain").submit(function (e) {

        e.preventDefault();

        var url = $('#domain').val();
        var BASE_URL = window.localStorage.getItem('baseURL');

        if (!isEmpty(url)) {
            BASE_URL = url + "/my-app/api/";
            window.localStorage.setItem('baseURL', BASE_URL);
        } else {
            if (!isEmpty(BASE_URL)) {
                transferToLogin();
            } else {
                transferTo404Page("Cannot find domain");
            }
        }

        return false;
    });

    $("#loginForm").submit(function (e) {

        e.preventDefault();

        BASE_URL = window.localStorage.getItem('baseURL');
        var form = $(this);
        var url = BASE_URL + form.attr('action');

        login(url, form);
        return false;
    });

    $("#registrationForm").submit(function (e) {

        e.preventDefault();

        var BASE_URL = window.localStorage.getItem('baseURL');
        var form = $(this);
        var url = BASE_URL + form.attr('action');

        if (validateForm()) {
            registration(url, form);
        }
        return false;
    });

    $("#resumeForm").submit(function (e) {

        e.preventDefault();

        var BASE_URL = window.localStorage.getItem('baseURL');
        var form = $(this);
        var action = form.attr('action');
        var url = BASE_URL + action;

        if (action.includes('new')) {
            data = form.serializeArray();
            newResume(url, form);
        } else {
            editResume(url, form);
        }

        return false;
    });

    $('#edit').click(function () {
        transferToResumeForm(param);
    });

    $('#back').click(function () {
        transferToUserResume();
    });

    initForDetailPage();

};

/* 
 * Ajax call
 */

function getDomain() {
    console.log("Trigger get domain!");
    $.ajax({
        type: "GET",
        url: "https://api.heroku.com/apps/jsonresumedemo/config-vars",
        headers: {
            'Accept': 'application/vnd.heroku+json; version=3',
            'Authorization': 'Bearer 51f661c8-37f8-4d57-a532-83ec9ac9f41a'
        },
        dataType: 'json',
        success: function (response) {
            if (!isEmpty(response.DOMAIN)) {
                console.log('Respone', response.DOMAIN);
                BASE_URL = response.DOMAIN + "/my-app/api/";
                window.localStorage.setItem('baseURL', BASE_URL);
                checkShareResume();
            } else {
                transferToSetupDomain();
            }
        },

        error: function (request, status, error) {
            $("#errorLogin").html(insertAlert(jQuery.parseJSON(request.responseText).data));
            console.log('The page was NOT loaded', error);
        },

    });
}

function login(url, form) {
    console.log('url -', url);
    $.ajax({
        type: "POST",
        url: url,
        data: form.serialize(),
        dataType: 'json',
        success: function (response) {
            if (response.status == "Success") {
                window.localStorage.setItem('token', response.data.token);
                window.localStorage.setItem('userId', response.data.appUser.userId);
                window.localStorage.setItem('username', response.data.appUser.userName);
                BASE_URL = window.localStorage.getItem('baseURL');
                TOKEN = window.localStorage.getItem('token');
                USER_ID = window.localStorage.getItem('userId');
                USER_NAME = window.localStorage.getItem('username');

                transferToUserResume();

            } else {
                $('#errorLogin').html(insertAlert(response.data));
            }
        },

        error: function (request, status, error) {
            $("#errorLogin").html(insertAlert(jQuery.parseJSON(request.responseText).data));
            console.log('The page was NOT loaded', error);
        },

    });
};

function registration(url, form) {
    console.log('url', url);
    $.ajax({
        type: "POST",
        url: url,
        data: form.serialize(),
        dataType: 'json',
        success: function (response) {
            if (response.status == "Success") {
                window.localStorage.setItem('token', response.data.token);
                window.localStorage.setItem('userId', response.data.appUser.userId);
                window.localStorage.setItem('username', response.data.appUser.userName);
                BASE_URL = window.localStorage.getItem('baseURL');
                TOKEN = window.localStorage.getItem('token');
                USER_ID = window.localStorage.getItem('userId');
                USER_NAME = window.localStorage.getItem('username');
                transferToUserResume();
            } else {
                $('#errorRegistration').html(insertAlert(response.data));
            }
        },

        error: function (request, status, error) {
            $('#errorRegistration').html(insertAlert(jQuery.parseJSON(request.responseText).data));
            console.log('The page was NOT loaded', error);
        },

    });
};

function listUserResumes(url) {
    console.log('url', url);
    $.ajax({
        type: "GET",
        url: url,
        data: {
            username: USER_NAME,
            token: TOKEN,
            userId: USER_ID
        },
        dataType: 'json',
        success: function (response) {
            if (response.status == "Success") {
                if (response.data.length === 0) {
                    $('#userResumeList').html(
                        `<div class="text-center" style="padding-bottom: 75px;">You don't have any resume. Let create new resume!</div>`
                    );
                    $('#empty-resume-modal').show();
                    $('#share-link-modal').hide();
                } else {
                    var partHeadHtml =
                        '<div style="padding-top: 25px;">' +
                        '<h2>Your Resume List</h2>' +
                        '<table class="table table-striped">' +
                        '<tr>' +
                        '<th>Id</th>' +
                        '<th>Name</th>' +
                        '<th>Job Title</th>' +
                        '<th>Top</th>' +
                        '<th colspan="4">Action</th>' +
                        '</tr>';
                    var partDataHtml = "";
                    $.each(response.data, function (index, element) {
                        var enableStar = '';
                        var enableButton = `<a href="#" onclick="return enableTopResume('product/enable', ` + element.productId + `);" >Enable Top</a>`;
                        if (element.enabled) {
                            enableStar = '<a href="#"><i class="fas fa-star"></i></a>';
                            enableButton = '';
                        }
                        var itemHtml =
                            '<tr>' +
                            '<td>' + element.productId + '</td>' +
                            '<td>' + element.name + '</td>' +
                            '<td>' + element.jobTitle + '</td>' +
                            '<td>' + enableStar + '</td>' +
                            `<td><a href="#" onclick="return transferToDetailResume('product/detail', ` + element.productId + `);" >View</a></td>` +
                            '<td><a href="#" onclick="return transferToResumeForm(' + element.productId + ');" >Edit</a></td>' +
                            '<td>' + enableButton + '</td>' +
                            `<td><a href="" onclick="return deleteResume('product/delete',` + element.productId + ');" >Delete</a></td>' +
                            '</tr>';
                        partDataHtml += itemHtml;
                    });
                    var partEndHtml =
                        '</table>' +
                        '</div>';
                    var allPartHtml = partHeadHtml + partDataHtml + partEndHtml;
                    $('#userResumeList').html(allPartHtml);
                    $('#empty-resume-modal').hide();
                    $('#share-link-modal').show();
                    $('#share-link-content').val(domain + "?name=" + USER_NAME);
                }
            } else {
                $('#errorUserResume').html(insertAlert(response.data));
            }
        },

        error: function (request, status, error) {
            $('#errorUserResume').html(insertAlert(jQuery.parseJSON(request.responseText).data));
            console.log('The page was NOT loaded', error);
        },

    });
};

function detailResume(url, id) {
    console.log('url -', url);
    $.ajax({
        type: "GET",
        url: url,
        data: {
            id: id,
            token: TOKEN,
            userId: USER_ID
        },
        dataType: 'json',
        success: function (response) {

            if (response.status == "Success") {
                $('input[name ="productId"]').val(response.data.productId);
                $('input[name ="name"]').val(response.data.name);
                $('input[name ="jobTitle"]').val(response.data.jobTitle);
                $('input[name ="address"]').val(response.data.address);
                $('input[name ="telephone"]').val(response.data.telephone);
                $('input[name ="email"]').val(response.data.email);
                $('input[name ="website"]').val(response.data.website);
                $('input[name ="language"]').val(response.data.language);
                $('input[name ="about"]').val(response.data.about);
                $('input[name ="workExperience"]').val(response.data.workExperience);

            } else {
                console.log("Cannot get data!");
            }
        },

        error: function (request, status, error) {
            console.log('The page was NOT loaded', error);
        },

    });
};

function newResume(url, form) {
    console.log('url -', url);
    var data = form.serializeArray();
    data.push({
        name: 'token',
        value: TOKEN
    }, {
        name: 'userId',
        value: USER_ID
    }, {
        name: 'username',
        value: USER_NAME
    });
    $.ajax({
        type: "GET",
        url: url,
        data: $.param(data),
        dataType: 'json',
        success: function (response) {

            if (response.status == "Success") {
                moveToViewResume(response.data.productId);
            } else {
                $('#errorResumeForm').html(insertAlert(response.data));
            }

        },

        error: function (request, status, error) {
            $('#errorResumeForm').html(insertAlert(jQuery.parseJSON(request.responseText).data));
            console.log('The page was NOT loaded', error);
        },

    });
};

function editResume(url, form) {
    console.log('url -', url);
    var data = form.serializeArray();
    data.push({
        name: 'token',
        value: TOKEN
    }, {
        name: 'userId',
        value: USER_ID
    }, {
        name: 'username',
        value: USER_NAME
    });
    $.ajax({
        type: "POST",
        url: url,
        data: $.param(data),
        dataType: 'json',
        success: function (response) {

            if (response.status == "Success") {
                moveToViewResume(response.data.productId);
            } else {
                var id = getParam('edit');
                if (isEmpty(id)) {
                    $('#errorLogin').html(insertAlert(response.data));
                } else {
                    window.location.replace("404Page.html");
                }
            }

        },

        error: function (request, status, error) {
            if (isEmpty(id)) {
                $('#errorLogin').html(insertAlert(request.responseText.data));
            } else {
                window.location.replace("404Page.html");
            }
            console.log('The page was NOT loaded', error);
        },

    });
};

function deleteResume(url, index) {
    var fullUrl = BASE_URL + url;
    console.log('url -', fullUrl);
    $.ajax({
        type: "GET",
        url: fullUrl,
        data: {
            id: index,
            token: TOKEN,
            userId: USER_ID
        },
        dataType: 'json',
        success: function (response) {
            if (response.status == "Success") {
                listUserResumes(BASE_URL + "product/user");
            } else {
                $('#errorUserResume').html(insertAlert(response.data));
            }
        },

        error: function (request, status, error) {
            $("#errorUserResume").html(insertAlert(request.responseText.data));
            console.log('The page was NOT loaded', error);
        },

    });
};

function enableTopResume(url, index) {
    var fullUrl = BASE_URL + url;
    console.log('url -', fullUrl);
    $.ajax({
        type: "GET",
        url: fullUrl,
        data: {
            id: index,
            token: TOKEN,
            userId: USER_ID,
            username: USER_NAME
        },
        dataType: 'json',
        success: function (response) {
            if (response.status == "Success") {
                listUserResumes(BASE_URL + "product/user");
            } else {
                $('#errorUserResume').html(insertAlert(response.data));
                console.log("Cannot enable top resume!", error);
            }
        },

        error: function (request, status, error) {
            $("#errorUserResume").html(insertAlert(request.responseText.data));
            console.log('The page was NOT loaded', error);
        },
    });
};

function logout(url) {
    var fullUrl = BASE_URL + url;
    console.log('url -', fullUrl);
    $.ajax({
        type: "GET",
        url: fullUrl,
        data: {
            token: TOKEN
        },
        dataType: 'json',
        success: function (response) {

            if (response.status == "Success") {
                window.localStorage.removeItem("token");
                window.localStorage.removeItem("userId");
                window.localStorage.removeItem("username");
                setupNavigation();
                transferToLogin();
            } else {
                alert("Cannot logout!");
            }

        },

        error: function (request, status, error) {
            console.log('The page was NOT loaded', error);
        },

    });
    return false;
};

function detail(url, id, name) {
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

                $('[itemprop="name"]').html(`<b>` + response.data.name + `</b>`);
                $('[itemprop="jobTitle"]').html(response.data.jobTitle);
                $('[itemprop="address"]').html(response.data.address);
                $('[itemprop="telephone"]').html(response.data.telephone);
                $('[itemprop="email"]').html(response.data.email);
                $('[itemprop="website"]').html(response.data.website);
                $('[itemprop="language"]').html(response.data.language);
                $('[itemprop="description"]').html(response.data.about);
                $('[itemprop="work-experience"]').html(response.data.workExperience);

            } else {
                transferTo404Page();
                console.log("Cannot get data!");
            }
        },

        error: function (request, status, error) {
            transferTo404Page();
            console.log('The page was NOT loaded', error);
        },

    });
};

/*
 * Transfer function to show page
 */

function transferToSetupDomain() {
    $(".page").hide();
    $("#setupDomainContainer").show();
    return false;
}

function transferToLogin() {
    $(".page").hide();
    $("#loginContainer").show();
    return false;
}

function transferToRegistration() {
    $(".page").hide();
    $("#registrationContainer").show();
    return false;
}

function transferToUserResume() {

    setupNavigation();

    $(".page").hide();
    $("#userResumesContainer").show();
    $('[itemprop="name"]').html(USER_NAME);
    listUserResumes(BASE_URL + "product/user");

    return false;
}

function transferToResumeForm(id) {
    $(".page").hide();
    $("#resumeFormContainer").show();

    if (id == 0) {
        $("#resumeForm").attr("action", "product/new")
    } else {
        $("#resumeForm").attr("action", "product/edit")
        $('input[name ="productId"]').val(id);
        var fullUrl = BASE_URL + "product/detail";
        detailResume(fullUrl, id);
    }

    return false;
}

function transferToDetailResume(action, param) {
    $(".page").hide();
    $("#resumeDetailContainer").show();

    var fullUrl = BASE_URL + action;
    if (action.includes("view")) {
        detail(fullUrl, "", param);
        $('#action-button').hide();
    } else {
        detail(fullUrl, param, "");
        $('#action-button').show();
    }

}

function transferTo404Page(message) {
    $(".page").hide();
    $("#r404PageContainer").show();

    if (message != null) {
        $("#errorContent").html(message);
    }
}

function getNav(id) {
    switch (id) {
        case '1':
            checkDomain();
            break;
        case '2':
            transferToRegistration();
            break;
        case '3':
            transferToLogin();
            break;
        case '4':
            transferToResumeForm(0);
            break;
        case '5':
            transferToUserResume();
            break;
        case '6':
            transferToSetupDomain();
            break;
        case '7':
            logout('logout');
            break;
        default:
            console.log("Unknown id!", id)
            transferToSetupDomain();
    }
}

function validateForm() {
    var password = $('#registrationForm input[name ="password"]').val();
    var retype = $('#registrationForm input[name ="retypePassword"]').val();
    if (password != retype) {
        $('#samePassword').html(insertAlert("Password and Retype Password must be the same!"));
        return false;
    }
    return true;
}

function initForDetailPage() {
    var toggleFloatingMenu = function () {
        $('.js-floating-nav').toggleClass('is-visible');
        $('.js-floating-nav-trigger').toggleClass('is-open');
    };

    $(".background-card").css("min-height", window.screen.availHeight + "px");
    $("[data-toggle=tooltip]").tooltip();
    $('.js-floating-nav-trigger').on('click', function (e) {
        e.preventDefault();
        toggleFloatingMenu();
    });
    $('.js-floating-nav a').on('click', toggleFloatingMenu);

    $("#remaining-profiles").on('show.bs.collapse', function () {
        $('.js-profiles-collapse > i')
            .removeClass('icon-chevron-down')
            .addClass('icon-chevron-up');
    });

    $("#remaining-profiles").on('hidden.bs.collapse', function () {
        $('.js-profiles-collapse > i')
            .removeClass('icon-chevron-up')
            .addClass('icon-chevron-down');
    });

    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
        '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
}

/*
 * Script for common use
 */

function setupNavigation() {

    console.log("Trigger set up navigation")

    var token = window.localStorage.getItem('token');
    var username = window.localStorage.getItem('username');

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

function isDomainOfLocal(url) {
    if (url.includes("file://")) {
        return true;
    }
    return false;
}