// Global variables
var BASE_URL = ""; //Server domain to connect
var TOKEN = ""; //Token to connect server
var USER_ID = "";
var USER_NAME = "";

$(document).ready(function () {

    BASE_URL = window.localStorage.getItem('baseURL');

    if (isEmpty(BASE_URL)) {
        var defaultUrl = "http://localhost:8080/my-app/api/";
        window.localStorage.setItem('baseURL', defaultUrl);
        transferToSetupDomain();
    }
    else {
        transferToLogin();
    }

    $("#initPage").on("click", function() { 
        e.preventDefault();

        if ($('#setupDomain').length > 0) {
            var url = $('#domain').val();
            if (!isEmpty(url)) {
                BASE_URL = url + "/my-app/api/";
                window.localStorage.setItem('baseURL', BASE_URL);
            }
            transferToLogin();
        }
        else {

            alert("Trigger replace!");

            // if ($('#loginForm').length > 0) {
            //     BASE_URL = window.localStorage.getItem('baseURL');
            //     var form = $('#loginForm');
            //     // var url = BASE_URL + form.attr('action');
            //     var url = BASE_URL + "login";
        
            //     login(url, form);
            // }
            // else {
            //     var BASE_URL = window.localStorage.getItem('baseURL');
            //     var form = $(this);
            //     // var url = BASE_URL + form.attr('action');
            //     var url = BASE_URL + "registration";
        
            //     if (validateForm()) {
            //         registration(url, form);
            //     }
            // }
        }

        return false;
    });

    // $("#setupDomain").submit(function (e) {

    //     e.preventDefault();

    //     var url = $('#domain').val();
    //     if (!isEmpty(url)) {
    //         BASE_URL = url + "/my-app/api/";
    //         window.localStorage.setItem('baseURL', BASE_URL);
    //     }

    //     transferToLogin();
    //     return false;
    // });

    // $("#loginForm").submit(function (e) {

    //     alert("Trigger login form action!")
    //     e.preventDefault();

    //     BASE_URL = window.localStorage.getItem('baseURL');
    //     var form = $("#loginForm");
    //     // var url = BASE_URL + form.attr('action');
    //     var url = BASE_URL + "login";

    //     login(url, form);
    //     return false;
    // });

    // $("form").submit(function(e) {
    
    //     e.preventDefault();

    //     BASE_URL = window.localStorage.getItem('baseURL');
    //     var form = $('#loginForm');
    //     // var url = BASE_URL + form.attr('action');
    //     var url = BASE_URL + "login";

    //     login(url, form);
    //     return false;
    // });

    // $("#registrationForm").submit(function (e) {

    //     e.preventDefault();

    //     var BASE_URL = window.localStorage.getItem('baseURL');
    //     var form = $(this);
    //     // var url = BASE_URL + form.attr('action');
    //     var url = BASE_URL + "registration";

    //     if (validateForm()) {
    //         registration(url, form);
    //     }
    //     return false;
    // });

});

/*
* Transfer in same home.html file
*/

function transferToSetupDomain() {
    var domainHtml = `
    <h2 class="text-center" style="padding-top: 75px; padding-bottom: 10xp;">Set up domain</h2>

    <p class="text-center">
        Please give the domain of server to start. The struct of a domain is http://www.domain.com </br>
        The default domain is http://localhost:8080 (or http://127.0.0.1:8080) if the domain is not given.
    </p>

    <form id="setupDomain" class="form-horizontal" method="post">
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

        <form id="loginForm" class="form-horizontal" method="post">
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
                <button id="loginSubmit" type="submit" class="btn btn-info">Log in</button>
            </div>
        </form>

        <div class="text-center" style="padding-top: 20px;">
            Don't have an account? Let <a href="#" onclick=" return transferToRegistration();">registration</a> an account
        </div>
        
    `;
    $("#initPage").html(loginHtml);
}

function transferToRegistration() {
    var registrationHtml = `
    <h2 class="text-center" style="padding-top: 75px;">Register account</h2>

        <div id="errorLogin"></div>
        
        <div style="padding-bottom: 20px;">
            
            <form id="registrationForm" class="form-horizontal" method="post">

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
            Already have an account? Let <a href="#" onclick=" return transferToLogin();">log in</a>
        </div>
    `;
    $('#initPage').html(registrationHtml);
}

/*
* Ajax call server for json
*/

function login(url, form) {
    console.log('url', url);
    $.ajax({
        type: "POST",
        url: url,
        data: form.serialize(),
        dataType: 'json',
        success: function (response) {
            console.log('response', response);
            if (response.status == "Success") {
                window.localStorage.setItem('token', response.data.token);
                window.localStorage.setItem('userId', response.data.appUser.userId);
                window.localStorage.setItem('username', response.data.appUser.userName);
                window.location.replace("resumes.html");
            } else {
                $('#errorLogin').html(insertAlert(response.data));
            }

        },

        error: function (request, status, error) {
            $("#errorLogin").insertAlert(request.responseText.data);
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
                window.location.replace("../resumes.html");
            } else {
                $('#errorLogin').html(insertAlert(response.data));
            }
        },

        error: function (request, status, error) {
            insertAlert(request.responseText.data);
            console.log('The page was NOT loaded', error);
        },

        complete: function (xhr, status) {
            console.log("The request is complete!", status);
        },

    });
};

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