import jQuery from "jquery";
var $ = jQuery;

//global loader
$(window).on('load', function () {
  setTimeout(function () {
    let urlPath3 = [
      "/"
    ];
    $('.overlay').removeClass('show');
    $("body").removeClass("block");
    $(".app-loader").removeClass("show");
    if (urlPath3.includes(window.location.pathname)) {
    }
  }, 500)
});

$(function () {

  const height = $("header").innerHeight()
  $("#headerPlaceholder").height(height);

  const thankYouHeight = $(window).innerHeight() - $("footer") .innerHeight();
  $("#thankYouContainer").height(thankYouHeight);

  $("[data-path]").each(function () {
    let totPaths = parseInt($(this).attr("data-path"), 10),
      i = 0;
    for (let i = 1; i < totPaths + 1; i++) {
      $(this).append('<span class="path' + i + '"></span>');
    }
  });

  // zoom pinch on ios
  var isiDevice = / iPod| iPad| iPhone/i.test(
    navigator.userAgent.toLowerCase()
  );
  if (isiDevice) {
    document.addEventListener(
      "touchmove",
      function (event) {
        if (event.scale !== 1) {
          event.preventDefault();
        }
      },
      { passive: false }
    );
  }

  // Contact Form
  
  let fullName = $("#contactFullName");
  let email = $("#contactEMail");
  let phoneNumber = $("#contactPhone");

  $("#contact").on("submit", function (e) {
    e.preventDefault();
    let page_source = $("#source").val();
    let project = $("#source").val();
    let tnc = $("#tnc").is(':checked');
    const mobileRegex = /^[6-9]\d{9}$/;
    const emailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    let valid = false;

    if(fullName.val() == '') {
      $(`#${fullName[0].id}_error`).html("This is a required field");
      valid = false;
    } else {
      $(`#${fullName[0].id}_error`).html("");
      valid = true;
    }

    if(email.val() == '') {
      $(`#${email[0].id}_error`).html("This is a required field");
      valid = false;
    } 
    // else if(!emailRegex.test(email.val())) {
    //   $(`#${email[0].id}_error`).html("Please enter a valid email address");
    //   valid = false;
    // }
    else {
      $(`#${email[0].id}_error`).html("");
      valid = true;
    }
    if (!emailRegex.test(email.val())) {
       $(`#${email[0].id}_error`).html("Please enter a valid email address");
      valid = false;
    } else {
       $(`#${email[0].id}_error`).html("");
      valid = true;
    }
    if(phoneNumber.val() == '') {
      $(`#${phoneNumber[0].id}_error`).html("This is a required field");
      valid = false;
    } else if(!mobileRegex.test(phoneNumber.val())) {
      $(`#${phoneNumber[0].id}_error`).html("Please enter a valid phone number");
      valid = false;
    } else {
      $(`#${fullName[0].id}_error`).html("");
      valid = true;
    }

    if(!tnc) {
      $('#checkTnc_error').html("This is a required field");
      valid = false;
    } else {
      $('#checkTnc_error').html("");
      valid = true;
    }

    if(valid) {
      makeApiCall(fullName, phoneNumber, email, project, page_source);
    }
    
  })

  // onChange Input Value
  $("#contactFullName").on("keypress keyup", function (event) {
    var inputValue = event.which;
    if (
      !(inputValue >= 65 && inputValue <= 122) &&
      inputValue != 32 &&
      inputValue != 0
    ) {
      event.preventDefault();
    }
    var checkText = $(this).val();
    $(this).val(checkText.replace(/[^a-zA-Z ]/g, ""));
  });

  $("input[type='tel']").on("keypress keyup", function (event) {
    var charCode = event.which;
    if (charCode > 31 && (charCode < 45 || charCode > 57)) {
      event.preventDefault();
    }
    var checkNumber = $(this).val();
    if ($(this).hasClass("numbre")) {
      $(this).val(checkNumber.replace((/^[0-9]+$/, "")));
    }
  });

  //modal start here
  $("[data-modal-open]").on("click", function () {
    let modalId = $(this).data("modal-open");
    openModal(modalId);
  });

  $(".modal--close, .overlay, [data-modal-close]").on("click", function () {
    $(".modal, .overlay").removeClass("show");
    $("body").removeClass("block");
  });
  //modal end here

  $(".overlay").on("click", function () {
    $("#lightbox").removeClass("show");
  });

});

/* ---------- document ready end ---------- */

//open modal

function openModal(modalId) {
  $("body").addClass("block");
  $('[data-modal-id="' + modalId + '"], .overlay').addClass("show");
}

function makeApiCall(fullname, mobilenum, emailid, project, page_source) {
  var formData = new FormData();
  const urlParams = new URLSearchParams(window.location.search);
  const utm_source = urlParams.get("utm_source");
  const utm_medium = urlParams.get("utm_medium");
  const utm_campaign = urlParams.get("utm_campaign");
  const utm_content = urlParams.get("utm_content");
  const utm_term = urlParams.get("utm_term");
  formData.append("utm_source", utm_source);
  formData.append("utm_medium", utm_medium);
  formData.append("utm_campaign", utm_campaign);
  formData.append("utm_content", utm_content);
  formData.append("utm_term", utm_term);
  formData.append("page_source", page_source);
  formData.append("fullname", fullname.val());
  formData.append("phone", mobilenum.val());
  formData.append("email", emailid.val());
  formData.append("project", project);
  $.ajax({
    type: "POST",
    url: `${process.env.APP_BASE_URL_DEV}api/lead-submit`,
    processData: false,
    contentType: false,
    mimeType: "multipart/form-data",
    headers: {
      "X-Requested-With": process.env.TOKEN,
    },
    data: formData,
    success: function (res) {
      var data = JSON.parse(res);
      if (data.success === true) {
        $("#formStatus").addClass("hide")
        $("#formStatus").html('');

        emailid.val('')
        fullname.val('')
        mobilenum.val('')

        window.location.href = "/thank-you.html";
        
      } else {
        $("#formStatus").removeClass("hide")
        $("#formStatus").html(data.message);
      }
    },
    error: function () { },
  });
}