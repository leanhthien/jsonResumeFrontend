// Global variables
var BASE_URL = ""; //Server domain to connect
var TOKEN = ""; //Token to connect server
var USER_ID = "";
var USER_NAME = "";

$(document).ready(function () {

    init();

    $("#setupDomain").submit(function (e) {

        e.preventDefault();

        var url = $('#domain').val();
        if (isEmpty(url)) {
            BASE_URL = "http://localhost:8080/my-app/api/";
        } else {
            BASE_URL = url + "/my-app/api/";
        }

        window.localStorage.setItem('baseURL', BASE_URL);
        window.location.replace("../index.html");
    });

    $("#loginForm").submit(function (e) {

        e.preventDefault();

        BASE_URL = window.localStorage.getItem('baseURL');
        var form = $(this);
        var url = BASE_URL + form.attr('action');

        login(url, form);
    });

    $("#registrationForm").submit(function (e) {

        e.preventDefault();

        BASE_URL = window.localStorage.getItem('baseURL');
        var form = $(this);
        var url = BASE_URL + form.attr('action');

        if (validateForm()) {
            registration(url, form);
        }
    });

});

// Setup

function init() {

    BASE_URL = window.localStorage.getItem('baseURL');
    TOKEN = window.localStorage.getItem('token');
    USER_ID = window.localStorage.getItem('userId');
    USER_NAME = window.localStorage.getItem('username');

    if (!isEmpty(TOKEN) && !isEmpty(USER_ID) && !isEmpty(USER_NAME)) {
        $(".guest").hide;
        $(".user").show;
        $(".username").text(username);
    } else {
        $(".guest").show;
        $(".user").hide;
    }

    $(".header").load("../spa/_nav.html");
    $(".headerV3").load("../spa/_navForVer3.html");

    if ($(".form-horizonta:first").is("#setupDomain")) {
        if (isEmpty(BASE_URL)) {
            transferToSetupDomain();
        } else {
            if (isEmpty(TOKEN)) {
                transferToLogin();
            }
        }
    }
    else {
        if (isEmpty(TOKEN)) {
                transferToLogin();
        }
    }
}


// Ajax call server for json

function login(url, form) {
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
                window.location.replace("../spa/index.html");
            } else {
                $('#errorLogin').html(insertAlert(response.data));
            }

        },

        error: function (request, status, error) {
            alert(request.responseText);
            console.log('The page was NOT loaded', error);
        },

        complete: function (xhr, status) {
            console.log("The request is complete!", status);
        },

    });
};

function logout(url) {
    console.log('url', url);
    $.ajax({
        type: "POST",
        url: url,
        dataType: 'json',
        success: function (response) {

            if (response.status == "Success") {
                window.localStorage.clear();
                window.location.replace("../spa/index.html");
            } else {
                // $('#errorLogin').html(insertAlert(response.data));
                alert("Cannot logout!")
            }

        },

        error: function (error) {
            console.log('The page was NOT loaded', error);
        },

        complete: function (xhr, status) {
            console.log("The request is complete!", status);
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
                window.location.replace("../spa/resume/resumes.html");
            } else {
                $('#errorLogin').html(insertAlert(response.data));
            }
        },

        error: function (request, status, error) {
            console.log('The page was NOT loaded', error);
        },

        complete: function (xhr, status) {
            console.log("The request is complete!", status);
        },

    });
};

function deleteResume(url, index) {
    console.log('url', url);
    $.ajax({
        type: "POST",
        url: url,
        data: {
            id: index
        },
        dataType: 'json',
        success: function (response) {

            if (response.status == "Success") {
                window.localStorage.clear();
                window.location.replace("../spa/index.html");
            } else {
                // $('#errorLogin').html(insertAlert(response.data));
                alert("Cannot logout!")
            }

        },

        error: function (error) {
            console.log('The page was NOT loaded', error);
        },

        complete: function (xhr, status) {
            console.log("The request is complete!", status);
        },

    });
};

// Transfer

function transferToSetupDomain() {
    var domainHtml = `
    <h2 class="text-center" style="padding-top: 75px; padding-bottom: 10xp;">Set up domain</h2>

    <p class="text-center">
        Please give the domain of server to start. The struct of a domain is http://www.domain.com </br>
        The default domain is http://localhost:8080 (or http://127.0.0.1:8080) if the domain is not given.
    </p>

    <form id="setupDomain" class="form-horizontal" action="" method="post">
            <div class="form-group d-flex justify-content-center">
                <label class="col-sm-1 control-label" >Domain:</label>
                <div class="col-sm-6">
                    <input type="text" id='domain' class="form-control"/>
                </div>
            </div>

            <div class="text-center" style="padding-top: 10px;">
                <button type="submit" class="btn btn-info">Set up</button>
            </div>
    </form>
    `;
    $('#initPage').html(domainHtml);
}

function transferToLogin() {
    var loginHtml = `
    <h2 class="text-center" style="padding-top: 75px; padding-bottom: 10px;">Log in</h2>

        <div id="errorLogin"></div>

        <form id="loginForm" class="form-horizontal" action="login" method="post">
            <div class="form-group d-flex justify-content-center">
                <label class="col-sm-1 control-label">Username:</label>
                <div class="col-sm-6">
                    <input type="text" name='username' class="form-control" />
                </div>
            </div>
            <div class="form-group d-flex justify-content-center">
                <label class="col-sm-1 control-label">Password:</label>
                <div class="col-sm-6">
                    <input type="password" name='password' class="form-control" />
                </div>
            </div>
            <div style="height: 10px;"></div>

            <div class="text-center">
                <button type="submit" class="btn btn-info">Log in</button>
            </div>
        </form>

        <div class="text-center" style="padding-top: 20px;">
            Don't have an account? Let <a href="#" onclick=" return moveToRegistration();">registration</a> an account
        </div>
        
    `;
    $('#initPage').html(loginHtml);
}

function transferToRegistration() {
    var registrationHtml = `
    <h2 class="text-center" style="padding-top: 75px;">Register account</h2>
        
        <div style="padding-bottom: 20px;">
            
            <form id="registrationForm" class="form-horizontal" action="regsitration" method="post">

                <div class="form-group d-flex justify-content-center">
                    <label class="col-sm-2 control-label">Username:</label>
                    <div class="col-sm-6">
                        <input type="text" class="form-control" name="username" required />
                    </div>
                </div>
                <div class="form-group d-flex justify-content-center">
                    <label class="col-sm-2 control-label">Password:</label>
                    <div class="col-sm-6">
                        <input type="password" class="form-control" name="password" required />
                    </div>
                </div>
                <div class="form-group d-flex justify-content-center">
                    <label class="col-sm-2 control-label">Retype Password:</label>
                    <div class="col-sm-6">
                        <input type="password" class="form-control" name="retypePassword" required />
                    </div>
                </div>
                <div class="text-center">
                    <button type="submit" class="btn btn-info">Submit</button>
                </div>
            </form>

        </div>

        <div id="samePassword"></div>

        <div class="text-center" style="padding-top: 20px;">
            Already have an account? Let <a href="#" onclick=" return moveToLogin();">log in</a>
        </div>
    `;
    $('#initPage').html(registrationHtml);
}

// Method moving to another page

function moveToRegistration() {
    window.location.replace("../spa/user/registration.html");
    return false;
}

function moveToLogin() {
    window.location.replace("../spa/user/login.html");
    return false;
}

function moveToResumes(action) {
    window.location.replace("../spa/resume/resumes.html");
    return false;
}

function moveToAllResumes(action) {
    window.location.replace("../spa/resume/allResumes.html");
    return false;
}

function moveToNewResume() {
    window.location.replace("../spa/resume/newResumeForm.html");
    return false;
}

function moveToView() {
    window.location.replace("../spa/resume/resume.html");
    return false;
}

function moveToEdit() {
    window.location.replace("../spa/resume/editResumeForm.html");
    return false;
}

function moveToLogout() {
    var url = BASE_URL + "logout";
    logout(url);
    return false;
}


// Utilities method

function validateForm() {
    var password = $('input[name ="password"]').val();
    var retype = $('input[name ="retypePassword"]').val();
    if (password != retype) {
        $('#samePassword').html(insertAlert("Password and Retype Password must be the same!"));
        return false;
    }
    return true;
}

function isEmpty(str) {
    return (!str || 0 === str.length);
}

function insertAlert(messege) {
    return '<div class="alert alert-danger" role="alert">' + messege + '</div>';
}