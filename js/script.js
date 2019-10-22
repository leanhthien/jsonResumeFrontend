// Global variables
var BASE_URL = ""; //Server domain to connect
var TOKEN = ""; //Token to connect server
var USER_ID = ""; // userId of user
var USER_NAME = ""; // username of user


WebFontConfig = {
    google: {
      families: ['Lato:300,400,700:latin']
    }
  };

$(document).ready(function () {

    $("#navigationHeader").load("_nav.html");

    // $(".page").hide();



    initDetailResume()

});














function initDetailResume() {
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
