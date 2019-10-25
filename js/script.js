// Global variables
var BASE_URL = ""; //Server domain to connect
var TOKEN = ""; //Token to connect server
var USER_ID = ""; // userId of user
var USER_NAME = ""; // username of user
var data;
var PRODUCT_ID = 0;
var domain= "";

$(document).ready(function () {

    // $("#navigationHeader").load("_nav.html");
    setupNavigation();
    checkDomain();
    setupListener();

});

function checkDomain() {

    BASE_URL = window.localStorage.getItem('baseURL');
    TOKEN = window.localStorage.getItem('token');
    USER_ID = window.localStorage.getItem('userId');
    USER_NAME = window.localStorage.getItem('username');

    domain = location.origin;

    if(!isDomainOfServer(domain)) {
        domain = "home.html";
    }

    if (isEmpty(BASE_URL)) {
        transferToSetupDomain();
    } else {
        if (isEmpty(TOKEN)) {
            transferToLogin();
        } else {
            transferToUserResume();
        }
    }
};

function setupListener() {

    $("#setupDomain").submit(function (e) {

        e.preventDefault();

        var url = $('#domain').val();
        var baseUrl = window.localStorage.getItem('baseURL');
        if (!isEmpty(url)) {
            BASE_URL = url + "/my-app/api/";
            window.localStorage.setItem('baseURL', BASE_URL);
        } else {
            if (isEmpty(baseUrl)) {
                BASE_URL = "http://127.0.0.1:8080/my-app/api/";
                window.localStorage.setItem('baseURL', BASE_URL);
            }
        }
        TOKEN = window.localStorage.getItem('token');
        if (isEmpty(TOKEN)) {
            transferToLogin();
        }
        else {
            transferToUserResume();
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

};

/* 
 * Ajax call
 */

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

                var callback = getParam('callback');

                if (!isEmpty(callback)) {
                    var productId = getParam('id');
                    moveToViewResume(productId);
                } else {
                    setupNavigation();
                    transferToUserResume();
                }

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
                            '<td><a href="#" onclick="return moveToViewResume(' + element.productId + ');" >View</a></td>' +
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
                    var domain = location.hostname;
                    if (isEmpty(domain)) {
                        dommain = location.pathname;
                    } else {
                        domain = "https://" + location.hostname;
                    }
                    $('#share-link-content').val(domain + "/resume.html?url=" + BASE_URL + "&name=" + USER_NAME);
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

    var nav = getParam('nav');

    if (isEmpty(nav)) {
        var id = getParam('edit');
        if (isEmpty(id)) {
            $(".page").hide();
            $("#userResumesContainer").show();
            $('[itemprop="name"]').html(USER_NAME);
            listUserResumes(BASE_URL + "product/user");
        } else {
            PRODUCT_ID = id;
            transferToResumeForm(id);
        }
    }
    else {
        window.history.pushState({}, document.title, domain);
        getNav(nav);
    }
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

function backInEdit() {
    if (PRODUCT_ID == 0) {
        transferToUserResume();
    }
    else {
        window.history.pushState({}, document.title, domain);
        moveToViewResume(PRODUCT_ID)
    }
}

function getNav(id) {
    switch(id) {
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

function moveToViewResume(productId) {
    window.location.replace("resume.html?id=" + productId);
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
