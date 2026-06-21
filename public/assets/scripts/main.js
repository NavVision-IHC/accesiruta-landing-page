var menuButton = document.getElementById("menuButton");
var menu = document.getElementById("menu");

if (menuButton && menu) {
    menuButton.onclick = function () {
        menu.classList.toggle("active");
    };
}

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

        var selectedScreen = document.getElementById(screenId);

        if (selectedScreen) {
            selectedScreen.classList.add("active");
        }
    };
}

/* TERMS AND CONDITIONS - ONLY REGISTER */

var termsModal = document.getElementById("termsModal");
var openTermsModal = document.getElementById("openTermsModal");
var closeTermsModal = document.getElementById("closeTermsModal");
var acceptTermsButton = document.getElementById("acceptTermsButton");
var acceptTerms = document.getElementById("acceptTerms");

if (openTermsModal && termsModal) {
    openTermsModal.onclick = function () {
        termsModal.classList.add("active");
    };
}

if (closeTermsModal && termsModal) {
    closeTermsModal.onclick = function () {
        termsModal.classList.remove("active");
    };
}

if (acceptTermsButton && acceptTerms && termsModal) {
    acceptTermsButton.onclick = function () {
        acceptTerms.checked = true;
        termsModal.classList.remove("active");
    };
}

if (termsModal) {
    termsModal.onclick = function (event) {
        if (event.target === termsModal) {
            termsModal.classList.remove("active");
        }
    };
}

/* MAP MODAL */

var mapModal = document.getElementById("mapModal");
var openMapModalButton = document.getElementById("openMapModalButton");
var closeMapModal = document.getElementById("closeMapModal");
var openGoogleMapsButton = document.getElementById("openGoogleMapsButton");
var useLocationButton = document.getElementById("useLocationButton");
var originAddress = document.getElementById("originAddress");
var modalDestination = document.getElementById("modalDestination");
var destinationInput = document.getElementById("destination");
var originInfo = document.getElementById("originInfo");

var userLocation = "";

if (openMapModalButton && mapModal) {
    openMapModalButton.onclick = function () {
        if (destinationInput && modalDestination) {
            modalDestination.value = destinationInput.value;
        }

        mapModal.classList.add("active");
    };
}

if (closeMapModal && mapModal) {
    closeMapModal.onclick = function () {
        mapModal.classList.remove("active");
    };
}

if (mapModal) {
    mapModal.onclick = function (event) {
        if (event.target === mapModal) {
            mapModal.classList.remove("active");
        }
    };
}

if (useLocationButton && originInfo) {
    useLocationButton.onclick = function () {
        if (!navigator.geolocation) {
            originInfo.innerHTML = "Tu navegador no permite obtener ubicación.";
            originInfo.style.color = "red";
            return;
        }

        originInfo.innerHTML = "Solicitando permiso de ubicación...";
        originInfo.style.color = "#4d6470";

        navigator.geolocation.getCurrentPosition(
            function (position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;

                userLocation = latitude + "," + longitude;

                if (originAddress) {
                    originAddress.value = "Mi ubicación actual";
                }

                originInfo.innerHTML = "Ubicación actual permitida correctamente.";
                originInfo.style.color = "#0f7f73";
            },
            function () {
                originInfo.innerHTML = "No se pudo obtener la ubicación. Ingresa tu dirección exacta manualmente.";
                originInfo.style.color = "red";
            }
        );
    };
}

if (openGoogleMapsButton) {
    openGoogleMapsButton.onclick = function () {
        var origin = "";
        var destination = "";

        if (originAddress) {
            origin = originAddress.value.trim();
        }

        if (modalDestination) {
            destination = modalDestination.value.trim();
        }

        if (destination === "") {
            originInfo.innerHTML = "Ingresa un destino para abrir el mapa.";
            originInfo.style.color = "red";
            return;
        }

        var mapUrl = "";

        if (userLocation !== "") {
            mapUrl = "https://www.google.com/maps/dir/?api=1&origin=" +
                encodeURIComponent(userLocation) +
                "&destination=" +
                encodeURIComponent(destination) +
                "&travelmode=walking";
        } else if (origin !== "") {
            mapUrl = "https://www.google.com/maps/dir/?api=1&origin=" +
                encodeURIComponent(origin) +
                "&destination=" +
                encodeURIComponent(destination) +
                "&travelmode=walking";
        } else {
            mapUrl = "https://www.google.com/maps/search/?api=1&query=" +
                encodeURIComponent(destination);
        }

        window.open(mapUrl, "_blank");

        originInfo.innerHTML = "Mapa abierto correctamente en una nueva pestaña.";
        originInfo.style.color = "#0f7f73";

        if (mapModal) {
            mapModal.classList.remove("active");
        }
    };
}

/* ACCESSIBILITY SELECTION */

var accessNeedCards = document.getElementsByClassName("access-need");

for (var a = 0; a < accessNeedCards.length; a++) {
    accessNeedCards[a].onclick = function () {
        var checkbox = this.getElementsByTagName("input")[0];

        if (checkbox) {
            checkbox.checked = !checkbox.checked;

            if (checkbox.checked) {
                this.classList.add("selected");
            } else {
                this.classList.remove("selected");
            }
        }
    };
}

var priorityChips = document.getElementsByClassName("priority-chip");

for (var p = 0; p < priorityChips.length; p++) {
    priorityChips[p].onclick = function () {
        var checkbox = this.getElementsByTagName("input")[0];

        if (checkbox) {
            checkbox.checked = !checkbox.checked;

            if (checkbox.checked) {
                this.classList.add("selected");
            } else {
                this.classList.remove("selected");
            }
        }
    };
}

/* LOGIN */

var loginForm = document.getElementById("loginForm");
var loginMessage = document.getElementById("loginMessage");

if (loginForm && loginMessage) {
    loginForm.onsubmit = function (event) {
        event.preventDefault();

        loginMessage.innerHTML = "Inicio de sesión realizado correctamente.";
        loginMessage.style.color = "#0f7f73";

        loginForm.reset();
    };
}

/* REGISTER */

var registerForm = document.getElementById("registerForm");
var registerMessage = document.getElementById("registerMessage");

if (registerForm && registerMessage) {
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
        } else if (!acceptTerms || acceptTerms.checked === false) {
            registerMessage.innerHTML = "Debes revisar y aceptar los términos y condiciones para crear tu cuenta.";
            registerMessage.style.color = "red";
        } else {
            registerMessage.innerHTML = "Cuenta creada correctamente.";
            registerMessage.style.color = "#0f7f73";

            registerForm.reset();

            if (acceptTerms) {
                acceptTerms.checked = false;
            }
        }
    };
}

/* ACCESSIBILITY */

var accessForm = document.getElementById("accessForm");
var accessMessage = document.getElementById("accessMessage");

if (accessForm && accessMessage) {
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
        }
    };
}

/* SEARCH */

var searchForm = document.getElementById("searchForm");
var searchMessage = document.getElementById("searchMessage");

if (searchForm && searchMessage && destinationInput) {
    searchForm.onsubmit = function (event) {
        event.preventDefault();

        var destination = destinationInput.value.trim();

        if (destination === "") {
            searchMessage.innerHTML = "Ingresa un destino para calcular la ruta.";
            searchMessage.style.color = "red";
        } else {
            searchMessage.innerHTML = "Ruta accesible calculada correctamente. Puedes abrir el mapa para revisar el recorrido.";
            searchMessage.style.color = "#0f7f73";
        }
    };
}

/* REPORT */

var reportForm = document.getElementById("reportForm");
var reportMessage = document.getElementById("reportMessage");

if (reportForm && reportMessage) {
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

            reportForm.reset();
        }
    };
}

/* VOICE */

var voiceForm = document.getElementById("voiceForm");
var voiceMessage = document.getElementById("voiceMessage");

if (voiceForm && voiceMessage) {
    voiceForm.onsubmit = function (event) {
        event.preventDefault();

        voiceMessage.innerHTML = "Configuración de guía por voz guardada.";
        voiceMessage.style.color = "#0f7f73";
    };
}

/* CONTACT */

var contactForm = document.getElementById("contactForm");
var message = document.getElementById("message");

if (contactForm && message) {
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

            contactForm.reset();
        }
    };
}