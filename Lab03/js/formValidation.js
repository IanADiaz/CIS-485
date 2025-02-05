document.addEventListener("DOMContentLoaded", function() {
    var submitButtonJS = document.getElementById("submitButtonJS");

    submitButtonJS.addEventListener("click", function(event) {
        event.preventDefault();
        inputHandler();
    })
})


// var submitButtonJS = document.getElementById("submitButtonJS");
// submitButtonJS.addEventListener("click", inputHandler) 

function inputHandler() {
    var nameInput = document.getElementById("fName");
    var emailInput = document.getElementById("email");
    var subjectInput = document.getElementById("subject");
    var messageInput = document.getElementById("message");
    var errorAudio = document.getElementById("errorAudio");
    var successAudio = document.getElementById("successAudio");
    var errorMessage = document.getElementById("errorMessage");

    var name = nameInput.value.trim();
    var email = emailInput.value.trim();
    var subject = subjectInput.value.trim();
    var message = messageInput.value.trim();

    nameInput.style.borderColor = "";
    emailInput.style.borderColor = "";
    subjectInput.style.borderColor = "";
    messageInput.style.borderColor = "";
    errorMessage.style.display = "none";

    if(name == '' || email == '' || subject == '' || message == '') {
        nameInput.placeholder = "Please fill in.";
        emailInput.placeholder = "Please fill in.";
        subjectInput.placeholder = "Please fill in.";
        messageInput.placeholder = "Please fill in.";
        nameInput.style.borderColor = "red";
        emailInput.style.borderColor = "red";
        subjectInput.style.borderColor = "red";
        messageInput.style.borderColor = "red";
        errorMessage.style.display = "block";
        errorAudio.play();
        return;
    }
    else {
        errorMessage.style.display = "none";
        
        var userInfo = "Form Contents: " + "\n";
        userInfo += "Name: " + nameInput.value + "\n";
        userInfo += "Email: " + emailInput.value + "\n";
        userInfo += "Subject: " + subjectInput.value + "\n";
        userInfo += "Message: " + messageInput.value;
        console.log(userInfo);
        alert("Form Submitted Successfully!");

        successAudio.play();
    }
    

}
    // document.addEventListener("keydown", function(event) {
    // if (event.key == "Enter") {
            // submitButtonJS.click();
        // }
    // });