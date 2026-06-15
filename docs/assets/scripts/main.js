var menuButton = document.getElementById("menuButton");
var menu = document.getElementById("menu");

menuButton.onclick = function () {
    menu.classList.toggle("active");
};

var buttons = document.getElementsByClassName("demo-btn");
var screens = document.getElementsByClassName("app-screen");

for (var i = 0; i < buttons.length; i++) {
    buttons[i].onclick = function () {
        var screenId = this.getAttribute("data-screen");

        for (var j = 0; j < buttons.length; j++) {
            buttons[j].classList.remove("active");
        }

        for (var k = 0; k < screens.length; k++) {
            screens[k].classList.remove("active");
        }

        this.classList.add("active");
        document.getElementById(screenId).classList.add("active");
    };
}

function showOperationTerms(elementId) {
    var termsBox = document.getElementById(elementId);

    termsBox.innerHTML =
        "<strong>Términos y condiciones:</strong> al continuar aceptas el uso responsable de AccesiRuta, " +
        "la protección de tus datos personales y el uso de reportes reales para mejorar la accesibilidad urbana.";

    termsBox.style.display = "block";
}

/* ACCESSIBILITY SELECTION */

var accessNeedCards = document.getElementsByClassName("access-need");

for (var a = 0; a < accessNeedCards.length; a++) {
    accessNeedCards[a].onclick = function () {
        var checkbox = this.getElementsByTagName("input")[0];

        checkbox.checked = !checkbox.checked;

        if (checkbox.checked) {
            this.classList.add("selected");
        } else {
            this.classList.remove("selected");
        }
    };
}

var priorityChips = document.getElementsByClassName("priority-chip");

for (var p = 0; p < priorityChips.length; p++) {
    priorityChips[p].onclick = function () {
        var checkbox = this.getElementsByTagName("input")[0];

        checkbox.checked = !checkbox.checked;

        if (checkbox.checked) {
            this.classList.add("selected");
        } else {
            this.classList.remove("selected");
        }
    };
}

/* LOGIN */

var loginForm = document.getElementById("loginForm");
var loginMessage = document.getElementById("loginMessage");

loginForm.onsubmit = function (event) {
    event.preventDefault();

    loginMessage.innerHTML = "Inicio de sesión realizado correctamente.";
    loginMessage.style.color = "#0f7f73";
    showOperationTerms("loginTerms");

    loginForm.reset();
};

/* REGISTER */

var registerForm = document.getElementById("registerForm");
var registerMessage = document.getElementById("registerMessage");

registerForm.onsubmit = function (event) {
    event.preventDefault();

    var password = document.getElementById("registerPassword").value;
    var confirmPassword = document.getElementById("confirmPassword").value;
    var phone = document.getElementById("phone").value;

    if (password !== confirmPassword) {
        registerMessage.innerHTML = "Las contraseñas no coinciden.";
        registerMessage.style.color = "red";
    } else if (phone.length !== 9 || isNaN(phone)) {
        registerMessage.innerHTML = "El teléfono debe tener 9 dígitos numéricos.";
        registerMessage.style.color = "red";
    } else {
        registerMessage.innerHTML = "Cuenta creada correctamente.";
        registerMessage.style.color = "#0f7f73";
        showOperationTerms("registerTerms");
        registerForm.reset();
    }
};

/* ACCESSIBILITY */

var accessForm = document.getElementById("accessForm");
var accessMessage = document.getElementById("accessMessage");

accessForm.onsubmit = function (event) {
    event.preventDefault();

    var options = document.getElementsByName("accessOption");
    var selected = false;

    for (var i = 0; i < options.length; i++) {
        if (options[i].checked) {
            selected = true;
        }
    }

    if (selected === false) {
        accessMessage.innerHTML = "Selecciona al menos una necesidad de accesibilidad.";
        accessMessage.style.color = "red";
    } else {
        accessMessage.innerHTML = "Preferencias de accesibilidad guardadas.";
        accessMessage.style.color = "#0f7f73";
        showOperationTerms("accessTerms");
    }
};

/* SEARCH */

var searchForm = document.getElementById("searchForm");
var searchMessage = document.getElementById("searchMessage");

searchForm.onsubmit = function (event) {
    event.preventDefault();

    var destination = document.getElementById("destination").value;

    if (destination === "") {
        searchMessage.innerHTML = "Ingresa un destino para calcular la ruta.";
        searchMessage.style.color = "red";
    } else {
        searchMessage.innerHTML = "Ruta accesible calculada correctamente.";
        searchMessage.style.color = "#0f7f73";
        showOperationTerms("searchTerms");
    }
};

/* REPORT */

var reportForm = document.getElementById("reportForm");
var reportMessage = document.getElementById("reportMessage");

reportForm.onsubmit = function (event) {
    event.preventDefault();

    var location = document.getElementById("location").value;
    var obstacles = document.getElementsByName("obstacle");
    var selectedObstacle = false;

    for (var i = 0; i < obstacles.length; i++) {
        if (obstacles[i].checked) {
            selectedObstacle = true;
        }
    }

    if (selectedObstacle === false) {
        reportMessage.innerHTML = "Selecciona un tipo de obstáculo.";
        reportMessage.style.color = "red";
    } else if (location === "") {
        reportMessage.innerHTML = "Ingresa la ubicación del obstáculo.";
        reportMessage.style.color = "red";
    } else {
        reportMessage.innerHTML = "Reporte enviado correctamente.";
        reportMessage.style.color = "#0f7f73";
        showOperationTerms("reportTerms");
        reportForm.reset();
    }
};

/* VOICE */

var voiceForm = document.getElementById("voiceForm");
var voiceMessage = document.getElementById("voiceMessage");

voiceForm.onsubmit = function (event) {
    event.preventDefault();

    voiceMessage.innerHTML = "Configuración de guía por voz guardada.";
    voiceMessage.style.color = "#0f7f73";
    showOperationTerms("voiceTerms");
};

/* CONTACT */

var contactForm = document.getElementById("contactForm");
var message = document.getElementById("message");

contactForm.onsubmit = function (event) {
    event.preventDefault();

    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var profile = document.getElementById("profile").value;

    if (name === "" || email === "" || profile === "") {
        message.innerHTML = "Por favor, completa todos los campos.";
        message.style.color = "red";
    } else {
        message.innerHTML = "Gracias por tu interés en AccesiRuta. Pronto recibirás novedades.";
        message.style.color = "#0f7f73";
        showOperationTerms("contactTerms");
        contactForm.reset();
    }
};