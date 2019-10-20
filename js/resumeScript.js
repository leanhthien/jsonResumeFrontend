// Global variables
var BASE_URL = ""; //Server domain to connect
var TOKEN = ""; //Token to connect server
var USER_ID = "";
var USER_NAME = "";

$(document).ready(function () {

    init();

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

    $(".header").load("_nav.html");

    if (isEmpty(BASE_URL) || isEmpty(TOKEN)) {
        window.location.replace("home.html");
    }

    $("#resumeForm").submit(function (e) {
        e.preventDefault();

        var form = $(this);
        var url = BASE_URL + form.attr('action');
        if(url.includes("new")) {
            newResume(url, form)
        }
        else {
            editResume(url, form)
        }
        return false;
    });
}

// Ajax call server for json

function listUserResumes(url) {
    console.log('url', url);
    $.ajax({
        type: "GET",
        url: url,
        data: {
            token: TOKEN,
            username: USER_NAME
        }, 
        dataType: 'json',
        success: function(response)
        {
            if (response.messege == "Success") {
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
                $.each(response.data, function(index, element) {
                    var enableStar = '';
                    var enableButton = `<a href="#" onclick="return enableTopResume('', ` + element.productId + ');" >Enable Top</a>';
                    if (element.enabled) {
                        enableStart = '<a href="#"><i class="fas fa-star"></i></a>';
                        enableButton = '';
                    }
                    var itemHtml = 
            '<tr>' +
                '<td>' + element.productId + '</td>' +
                '<td>' + element.name + '</td>' +
                '<td>' + element.jobTitle + '</td>' +
                '<td>' + enableStar + '</td>' +
                '<td><a href="#" onclick="return moveToViewResume();" >View</a></td>' +
                '<td><a href="#" onclick="return transferToResumeForm();" >Edit</a></td>' +
                '<td>' + enableButton + '</td>' +
                `<td><a href="" onclick="return deleteResume('', ` + element.productId + ');" >Delete</a></td>' +
            '</tr>';
                    partDataHtml += itemHtml;
        });

                var partEndHtml =
        '</table>' +
'</div>';
                var allPartHtml = partHeadHtml + partDataHtml + partEndHtml;
                $('#userResumeList').html(allPartHtml);
            }
            else {
                $('#errorLogin').html(insertAlert(response.data));
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

function detailResume(url, id) {
    console.log('url', url);
    $.ajax({
        type: "POST",
        url: url,
        data: {
            id = id
        },
        dataType: 'json',
        success: function (response) {

            if (response.status == "Success") {
                return response.data;
                //TODO: move to new detail page
            } else {
                //TODO: handle
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

function newResume(url, form) {
    console.log('url', url);
    $.ajax({
        type: "POST",
        url: url,
        data: form.serialize(),
        dataType: 'json',
        success: function (response) {

            if (response.status == "Success") {
                window.location.replace("resume.html");
                //TODO: move to new detail page
            } else {
                //TODO: handle
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

function editResume(url, form) {
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
                window.location.replace("welcome.html");
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

function logout(url) {
    console.log('url', url);
    $.ajax({
        type: "POST",
        url: url,
        dataType: 'json',
        success: function (response) {

            if (response.status == "Success") {
                window.localStorage.clear();
                window.location.replace("home.html");
            } else {
                alert("Cannot logout!")
            }

        },

        error: function (request, status, error) {
            ("#errorUserResume").html(request.responseText.data);
            console.log('The page was NOT loaded', error);
        },

        complete: function (xhr, status) {
            console.log("The request is complete!", status);
        },

    });
};

function deleteResume(url, index) {
    url = BASE_URL + "product/delete";
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
                listUserResumes(BASE_URL + "product/user")
            } else {
                insertAlert("Cannot delete resume!")
            }

        },

        error: function (error) {
            insertAlert("Cannot delete resume!")
            console.log('The page was NOT loaded', error);
        },

        complete: function (xhr, status) {
            console.log("The request is complete!", status);
        },

    });
};

function enableTopResume(url, index) {
    url = BASE_URL + "product/enabled";
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
                listUserResumes(BASE_URL + "product/user")
            } else {
                insertAlert("Cannot enable top resume!")
            }

        },

        error: function (request, status, error) {
            ("#errorUserResume").html(request.responseText.data);
            console.log('The page was NOT loaded', error);
        },

        complete: function (xhr, status) {
            console.log("The request is complete!", status);
        },

    });
};

/*
* Transfer to 
*/

function transferToUserResume() {

    var html = `
    
    <div class="header"></div>

    <div id="errorUserResume"></div>

    <div class="container">
        <div class="row">
            <div class="col-3 text-center">
                <span class="profile-pic-container">
                    <div class="profile-pic">
                        <img class="media-object img-circle center-block" data-src="holder.js/100x100"
                            alt="Richard Hendriks"
                            src="https://s.gravatar.com/avatar/7e6be1e623fb85adde3462fa8587caf2?s=100&amp;r=pg&amp;d=mm"
                            itemprop="image" />
                    </div>
                    <div class="name-and-profession" style="padding-top: 10px;">
                        <h5></h5>
                    </div>
                </span>
                <button type="button" class="btn btn-info" data-toggle="modal" data-target="#myModal">
                    Share resume
                </button>
            </div>
        </div>
        <!-- The Modal -->
        <div class="modal" id="myModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <!-- Modal body -->
                    <div class="modal-body">

                        <div class="text-center" style="padding-top: 20px;">
                            <p>You don't have any resume to share. Let make new one to start!</p>
                        </div>

                        <p style="padding-bottom: 10px; padding-top: 20px;">Share this link to another for showing your
                            resume:</p>

                        <div class="text-center" style="padding: 20px;">
                            <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="text-center" style="padding: 50px;" id="emptyUserResumeList"></div>

        <div id="userResumeList"></div>

        <a href="#" class="btn btn-info" role="button" onclick="return transferToResumeForm(0);">New Resume</a>
    </div>
    `;
    $('#initPage').html(html);

    listUserResumes(BASE_URL + "product/user")

}

function transferToResumeForm(id) {

    var action;

    if (id != 0) {
        action = "product/edit";
        var resume = detailResume(BASE_URL + "product/detail", id);
    }
    else {
        action = "product/new";
    }

    var html = `
    <body>

    <div class="container">

        <h2 class="text-center">Resume Details</h2>
        <div>
            <form id="resumeForm" class="form-horizontal" action=`+ action +` method="post">

                <input type="hidden" name="productId" />
                <div class="form-group">
                    <label class="col-sm-2 control-label">Name:</label>
                    <div class="col">
                        <input type="text" class="form-control" name="name" required />`+ resume.name + `
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">Job Title:</label>
                    <div class="col">
                        <input type="text" class="form-control" name="jobTitle" required />` + resume.jobTitle +`
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">Address:</label>
                    <div class="col">
                        <input type="text" class="form-control" name="address" />` + resume.address +`
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">Telephone:</label>
                    <div class="col">
                        <input type="text" class="form-control" name="telephone" />` + resume.telephone +`
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">Email:</label>
                    <div class="col">
                        <input type="text" class="form-control" name="email" />` + resume.email +`
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">Website:</label>
                    <div class="col">
                        <input type="text" class="form-control" name="website" />` + resume.website + `
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">Language:</label>
                    <div class="col">
                        <input type="text" class="form-control" name="language" />` + resume.language +`
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">About:</label>
                    <div class="col">
                        <textarea class="form-control" rows="3" name="about" >` + resume.about +`</textarea>
                    </div>
                </div>
        </div>
        <div class="form-group">
            <label class="col-sm-2 control-label">Work Experience:</label>
            <div class="col">
                <textarea class="form-control" rows="5" name="workExperience" >` + resume.workExperience + `</textarea>
            </div>
        </div>

        <div class="text-center">
            <button type="submit" class="btn btn-info">Submit</button>
            <a href="#" class="btn btn-danger" role="button" onClick=" return transferToUserResume();">Cancel</a>
        </div>
        </form>
    </div>

    <div style="height:75px;"></div>

    </div>

</body>
    `;
    $('#initPage').html(html);
}



// Method moving to another page


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