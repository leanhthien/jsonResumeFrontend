
/**
 * Script for resumes action 
 */

$(document).ready(function () {

    setupData();

});

// Setup

function setupData() {
    listUserResumes(BASE_URL + "/product/user");
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
                    var enableButton = '<a href="#" onclick="return enableTopResume();" >Enable Top</a>';
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
                '<td><a href="#" onclick="return moveToEditResume();" >Edit</a></td>' +
                '<td>' + enableButton + '</td>' +
                '<td><a href="" onclick="return deleteResume();" >Delete</a></td>' +
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


