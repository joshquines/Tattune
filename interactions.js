// functions for user interaction

// run this by default
setUserLoggedIn(false);

// loads the appropriate navbar items depending on if the user is logged in or not
// if logged in -> insert "waveforms" and "logout" items
// if not -> insert "log in" and "sign up" items
function toggleNavItems() {
    if(userLoggedIn) {
        document.getElementById("navi").innerHTML = "<a class=\"navbar-item\" href=\"tattune.stream/library\">waveforms</a>\n" +
            "            <a class=\"navbar-item\" onclick=\"logout()\" href=\"tattune.stream/index\">logout</a>\n";
    } else {
        document.getElementById("navi").innerHTML = "<a class=\"navbar-item\" href=\"tattune.stream/login\">log in</a>\n" +
            "            <a class=\"navbar-item\" href=\"\">sign up</a>";
    }
}

// toggles the menu to appear/hide when the burger icon (in mobile) is pressed
function toggleBurger() {
    document.querySelector('.navbar-menu').classList.toggle('is-active');
}

// sets the boolean variable for toggleNavItems()
function setUserLoggedIn(flag) {
    userLoggedIn = flag;
}

// general function for styling a field box, used for usernames and passwords on login/signup page
function styleFieldBox(id,isOK) {
    if(isOK) {
        document.getElementById(id).classList.remove('is-danger');
        document.getElementById(id).classList.add('is-success');

    } else {
        document.getElementById(id).classList.remove('is-success');
        document.getElementById(id).classList.add('is-danger');
    }
}

function isSanitized(txt) {
    return !/[^a-zA-Z0-9]/.test(txt);
}

// checks if input for username is at least 3 characters & is alphanumeric
function usernameSignupOK() {
    let user = document.getElementById('username-signup').value;
    console.log(isSanitized(user));
    if(user.length>2 && isSanitized(user)) return true;
    return false;
}

function passwordSignupOK() {
    let pw = document.getElementById('password-signup').value;
    if(pw.length>7 && isSanitized(pw)) return true;
    return false;
}

function styleUsernameSignup() {
    styleFieldBox('username-signup',usernameSignupOK());
}

function stylePasswordSignup() {
    styleFieldBox('password-signup', passwordSignupOK());
}

// logs the user out of the system
function logout() {
    setuserLoggedin(false);
}

function login() {
    setUserLoggedIn(true);
}

