$().ready(function() {
    $("#signupForm").validate({
    rules: {
        businessname: "required"
    }
    });
});