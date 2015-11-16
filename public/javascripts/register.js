$(function() {

    // confirm/verify password and email before registration ///////////////////////////////////////////////////////////////////
    $('#passwordSubmitButton').prop('disabled', true);

    function checkConfirm(field1, field2, type) {
        field1 = $(field1).val();
        field2 = $(field2).val();
        if ((field1 != field2) || (field1 == "") || (field2 == "")) {
            $("#registerMessage").text(type + ' do not match').css("color", "#F00");
            $('#passwordSubmitButton').prop('disabled', true);
        } else {
            $("#registerMessage").text(type + ' OK').css("color", "#090");
            $('#passwordSubmitButton').prop('disabled', false);
        }
    }

    $("#password").keyup(function () {
        if ($("#password").val().length < 6) {
            $("#registerMessage").text('Passwords must be at least six (6) characters').css("color", "#F00");
        } else {
            checkConfirm("#password", "#confirmPassword", "Password is");
        }
    });
    $('#confirmPassword').keyup(function () {
        checkConfirm("#password", "#confirmPassword", "Password is");
    });

    $("#password").change(function () {
        if ($("#password").val().length < 6) {
            $("#registerMessage").text('Passwords must be at least six (6) characters').css("color", "#F00");
        } else {
            checkConfirm("#password", "#confirmPassword", "Password is");
        }
    });
    $('#confirmPassword').change(function () {
        checkConfirm("#password", "#confirmPassword", "Password is");
    });

    $("#email").keyup(function () {
        checkConfirm("#email", "#confirmEmail", "Email is");
    });
    $('#confirmEmail').keyup(function () {
        checkConfirm("#email", "#confirmEmail", "Email is");
    });
    $("#email").change(function () {
        checkConfirm("#email", "#confirmEmail", "Email is");
    });
    $('#confirmEmail').change(function () {
        checkConfirm("#email", "#confirmEmail", "Email is");
    });

});