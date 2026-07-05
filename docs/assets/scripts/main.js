/* ============ STORAGE HELPERS ============ */

var STORAGE_USERS = "accesiruta_users";
var STORAGE_REPORTS = "accesiruta_reports";
var STORAGE_SESSION = "accesiruta_session";
var STORAGE_CONTRAST = "accesiruta_contrast";
var STORAGE_CONTACTS = "accesiruta_contacts";
var STORAGE_VOICE_MODE = "accesiruta_voice_mode";

function getContacts() {
    var raw = localStorage.getItem(STORAGE_CONTACTS);
    return raw ? JSON.parse(raw) : [];
}

function saveContacts(contacts) {
    localStorage.setItem(STORAGE_CONTACTS, JSON.stringify(contacts));
}

function setFormMessage(el, text, isError) {
    if (!el) {
        return;
    }
    el.textContent = text;
    el.classList.remove("form-message-success", "form-message-error");
    el.classList.add(isError ? "form-message-error" : "form-message-success");
}

function debounce(fn, delay) {
    var timer = null;
    return function () {
        var args = arguments;
        var context = this;
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay);
    };
}

function getUsers() {
    var raw = localStorage.getItem(STORAGE_USERS);
    return raw ? JSON.parse(raw) : [];
}

function saveUsers(users) {
    localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
}

function getReports() {
    var raw = localStorage.getItem(STORAGE_REPORTS);
    return raw ? JSON.parse(raw) : [];
}

function saveReports(reports) {
    localStorage.setItem(STORAGE_REPORTS, JSON.stringify(reports));
}

function getSession() {
    var raw = localStorage.getItem(STORAGE_SESSION);
    return raw ? JSON.parse(raw) : null;
}

function saveSession(session) {
    localStorage.setItem(STORAGE_SESSION, JSON.stringify(session));
}

function clearSession() {
    localStorage.removeItem(STORAGE_SESSION);
}

function seedData() {
    var users = getUsers();

    var hasAdmin = users.some(function (u) {
        return u.email === "admin@accesiruta.pe";
    });

    if (!hasAdmin) {
        users.push({
            name: "Administrador AccesiRuta",
            email: "admin@accesiruta.pe",
            phone: "999999999",
            password: "admin123",
            role: "admin"
        });
        saveUsers(users);
    }

    var reports = getReports();

    if (reports.length === 0) {
        var seedReports = [
            { id: 1, types: ["Rampa bloqueada"], location: "Av. Brasil con Jr. Lima, Breña", reporter: "Carla Ruiz", date: "2026-06-18", status: "pendiente" },
            { id: 2, types: ["Vereda dañada"], location: "Jr. Ayacucho 450, Cercado de Lima", reporter: "Miguel Torres", date: "2026-06-22", status: "verificado" },
            { id: 3, types: ["Cruce inseguro"], location: "Av. Universitaria con Av. Venezuela, San Miguel", reporter: "Rosa Medina", date: "2026-06-25", status: "pendiente" },
            { id: 4, types: ["Obra sin señalización"], location: "Av. Arequipa 2100, Lince", reporter: "Jorge Pinto", date: "2026-06-28", status: "resuelto" }
        ];
        saveReports(seedReports);
    }

    var contacts = getContacts();

    if (contacts.length === 0) {
        var seedContacts = [
            { id: 1, name: "Valeria Chumpitaz", email: "valeria.ch@example.com", phone: "987654321", profile: "Persona con discapacidad motriz", date: "2026-06-20", status: "pendiente" },
            { id: 2, name: "Renzo Salazar", email: "renzo.salazar@example.com", phone: "912345678", profile: "Familiar o acompañante", date: "2026-06-24", status: "pendiente" }
        ];
        saveContacts(seedContacts);
    } else {
        var contactsNeedMigration = contacts.some(function (c) {
            return !c.id || !c.status;
        });

        if (contactsNeedMigration) {
            contacts = contacts.map(function (c, index) {
                return {
                    id: c.id || (Date.now() + index),
                    name: c.name,
                    email: c.email,
                    phone: c.phone,
                    profile: c.profile,
                    date: c.date,
                    status: c.status || "pendiente"
                };
            });
            saveContacts(contacts);
        }
    }
}

seedData();

/* ============ TOASTS ============ */

var toastContainer = document.getElementById("toastContainer");

function showToast(text, type) {
    if (!toastContainer) {
        return;
    }

    var toast = document.createElement("div");
    toast.className = type === "error" ? "toast toast-error" : "toast";
    toast.textContent = text;

    toastContainer.appendChild(toast);

    setTimeout(function () {
        toast.classList.add("toast-out");
        setTimeout(function () {
            toast.remove();
        }, 300);
    }, 3200);
}


/* ============ MAPA LEAFLET DE LA PORTADA ============ */
/* Muestra el mapa real de OpenStreetMap, con dos marcadores y una ruta
   accesible similar a la referencia original. Si Leaflet o Internet no
   están disponibles, queda visible la imagen local de respaldo. */

var heroMapElement = document.getElementById("heroMap");
var heroMapShell = document.getElementById("heroMapShell");

if (heroMapElement && window.L) {
    var heroMap = L.map(heroMapElement, {
        zoomControl: true,
        attributionControl: true,
        scrollWheelZoom: false,
        keyboard: true
    });

    var heroTileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors"
    });

    heroTileLayer.addTo(heroMap);

    var accessibleRoute = [
        [-12.04988, -77.04182],
        [-12.05055, -77.04087],
        [-12.05142, -77.03968],
        [-12.05238, -77.03843],
        [-12.05338, -77.03712],
        [-12.05442, -77.03582],
        [-12.05548, -77.03448]
    ];

    var routeLine = L.polyline(accessibleRoute, {
        color: "#0f8b83",
        weight: 5,
        opacity: 0.96,
        lineCap: "round",
        lineJoin: "round"
    }).addTo(heroMap);

    var accessiblePin = L.divIcon({
        className: "accesiruta-map-pin",
        html: '<span class="map-pin-shape"><span class="map-pin-center"></span></span>',
        iconSize: [28, 38],
        iconAnchor: [14, 34],
        popupAnchor: [0, -32]
    });

    L.marker(accessibleRoute[0], { icon: accessiblePin })
        .addTo(heroMap)
        .bindTooltip("Punto de origen", { direction: "top", offset: [0, -28] });

    L.marker(accessibleRoute[accessibleRoute.length - 1], { icon: accessiblePin })
        .addTo(heroMap)
        .bindTooltip("Punto de destino", { direction: "top", offset: [0, -28] });

    heroMap.fitBounds(routeLine.getBounds(), {
        padding: [42, 42],
        maxZoom: 16
    });

    heroTileLayer.on("load", function () {
        if (heroMapShell) {
            heroMapShell.classList.add("map-ready");
        }
        heroMap.invalidateSize();
    });

    setTimeout(function () {
        heroMap.invalidateSize();
    }, 250);
}

/* ============ MOBILE MENU ============ */

var menuButton = document.getElementById("menuButton");
var menu = document.getElementById("menu");

if (menuButton && menu) {
    menuButton.onclick = function () {
        menu.classList.toggle("active");
    };
}

/* ============================================================
   GUÍA POR VOZ (Web Speech API)
   Pensada para personas con discapacidad visual: permite escuchar
   el contenido de cada sección y anuncia en voz alta los resultados
   de cada acción (login, búsqueda, reportes, etc.). No requiere
   claves ni servicios externos: usa la síntesis de voz incluida en
   el propio navegador.
   ============================================================ */

var SPEAK_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H3v6h3l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 6a9 9 0 0 1 0 12"/></svg>';
var MUTE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H3v6h3l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>';

var voiceSupported = "speechSynthesis" in window;
var voiceModeToggle = document.getElementById("voiceModeToggle");
var voiceLiveRegion = document.getElementById("voiceLiveRegion");
var voiceEnabled = localStorage.getItem(STORAGE_VOICE_MODE) !== "off";
var VOICE_RATE = 1.15;

function updateVoiceLiveRegion(text) {
    if (!voiceLiveRegion || !text) {
        return;
    }

    voiceLiveRegion.textContent = "";
    setTimeout(function () {
        voiceLiveRegion.textContent = text;
    }, 40);
}

function updateVoiceToggleUI() {
    if (!voiceModeToggle) {
        return;
    }

    if (!voiceSupported) {
        voiceModeToggle.innerHTML = MUTE_ICON;
        voiceModeToggle.classList.add("voice-off");
        voiceModeToggle.title = "La guía por voz no está disponible en este navegador";
        voiceModeToggle.disabled = true;
        return;
    }

    voiceModeToggle.innerHTML = voiceEnabled ? SPEAK_ICON : MUTE_ICON;
    voiceModeToggle.classList.toggle("voice-off", !voiceEnabled);
    voiceModeToggle.title = voiceEnabled
        ? "Guía por voz activada (clic para desactivar)"
        : "Guía por voz desactivada (clic para activar)";
}

/* speak(): respeta la preferencia del usuario (se detiene si desactivó la guía por voz) */
function speak(text) {
    if (!voiceSupported || !voiceEnabled || !text) {
        return;
    }

    updateVoiceLiveRegion(text);
    window.speechSynthesis.cancel();

    var utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-PE";
    utterance.rate = VOICE_RATE;
    window.speechSynthesis.speak(utterance);
}

/* speakForce(): siempre habla (usada cuando el usuario pide explícitamente "escuchar") */
function speakForce(text) {
    if (!voiceSupported || !text) {
        return;
    }

    updateVoiceLiveRegion(text);
    window.speechSynthesis.cancel();

    var utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-PE";
    utterance.rate = VOICE_RATE;
    window.speechSynthesis.speak(utterance);
}

if (voiceModeToggle) {
    voiceModeToggle.onclick = function () {
        voiceEnabled = !voiceEnabled;
        localStorage.setItem(STORAGE_VOICE_MODE, voiceEnabled ? "on" : "off");
        updateVoiceToggleUI();
        showToast(voiceEnabled ? "Guía por voz activada." : "Guía por voz desactivada.");
        speakForce(voiceEnabled ? "Guía por voz activada." : "Guía por voz desactivada.");
    };
}

updateVoiceToggleUI();

var testVoiceButton = document.getElementById("testVoiceButton");

if (testVoiceButton) {
    testVoiceButton.onclick = function () {
        speakForce(
            "En 200 metros, gire a la derecha. Cruce peatonal con semáforo sonoro detectado. " +
            "Vereda amplia por los próximos 100 metros."
        );
    };
}

function cleanVoiceText(text) {
    return (text || "").replace(/\s+/g, " ").trim();
}

function isVisibleForVoice(element) {
    if (!element) {
        return false;
    }

    var style = window.getComputedStyle(element);

    if (style.display === "none" || style.visibility === "hidden" || element.getAttribute("aria-hidden") === "true") {
        return false;
    }

    return element.getClientRects().length > 0;
}

function getReadableContent(target) {
    if (!target) {
        return "";
    }

    var parts = [];
    var candidates = target.querySelectorAll(
        "h1, h2, h3, h4, h5, h6, p, label, button, .section-label, .map-caption, th, td"
    );

    for (var i = 0; i < candidates.length; i++) {
        var element = candidates[i];

        if (!isVisibleForVoice(element) || element.classList.contains("speak-button") || element.closest(".speak-button")) {
            continue;
        }

        var text = cleanVoiceText(element.textContent);

        if (text && parts.indexOf(text) === -1) {
            parts.push(text);
        }
    }

    return parts.join(". ");
}

function buildSectionAnnouncement(target, selectedName) {
    var content = getReadableContent(target);
    var guidance = cleanVoiceText(target.getAttribute("data-voice-guidance"));
    var parts = [];

    if (selectedName) {
        parts.push("Has seleccionado " + selectedName + ".");

        if (content === selectedName) {
            content = "";
        } else if (content.indexOf(selectedName + ". ") === 0) {
            content = content.substring(selectedName.length + 2);
        }
    }

    if (content) {
        parts.push(content + ".");
    }

    if (guidance) {
        parts.push("Indicaciones: " + guidance);
    }

    return cleanVoiceText(parts.join(" "));
}

function announceElementContent(target, force, selectedName) {
    var announcement = buildSectionAnnouncement(target, selectedName);

    if (force) {
        speakForce(announcement);
    } else {
        speak(announcement);
    }
}

var speakButtons = document.querySelectorAll(".speak-button[data-speak-target]");

for (var s = 0; s < speakButtons.length; s++) {
    speakButtons[s].addEventListener("click", function () {
        var targetId = this.getAttribute("data-speak-target");
        var target = document.getElementById(targetId);

        if (!target) {
            return;
        }

        announceElementContent(target, true, "");
    });
}

/* Cada tarjeta de Funciones principales puede seleccionarse con mouse o teclado.
   Al entrar en ella se anuncia el nombre, la descripción y la acción recomendada. */
var featureCards = document.querySelectorAll("#funciones .feature-card[role='button']");
var lastFeatureCard = null;
var lastFeatureAnnouncementTime = 0;

function announceFeatureCard(card, force) {
    if (!card) {
        return;
    }

    var now = Date.now();

    if (!force && lastFeatureCard === card && now - lastFeatureAnnouncementTime < 800) {
        return;
    }

    lastFeatureCard = card;
    lastFeatureAnnouncementTime = now;

    for (var i = 0; i < featureCards.length; i++) {
        featureCards[i].classList.remove("voice-selected");
    }

    card.classList.add("voice-selected");

    var titleElement = card.querySelector("h3");
    var selectedName = titleElement ? cleanVoiceText(titleElement.textContent) : "esta función";
    announceElementContent(card, false, selectedName);
}

for (var f = 0; f < featureCards.length; f++) {
    featureCards[f].addEventListener("focus", function () {
        announceFeatureCard(this, false);
    });

    featureCards[f].addEventListener("click", function () {
        announceFeatureCard(this, false);
    });

    featureCards[f].addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            announceFeatureCard(this, true);
        }
    });
}

/* ============ HIGH CONTRAST TOGGLE ============ */

var contrastToggle = document.getElementById("contrastToggle");

function applyContrastState(isActive) {
    document.body.classList.toggle("high-contrast", isActive);

    if (contrastToggle) {
        contrastToggle.classList.toggle("active", isActive);
    }
}

if (localStorage.getItem(STORAGE_CONTRAST) === "true") {
    applyContrastState(true);
}

if (contrastToggle) {
    contrastToggle.onclick = function () {
        var isActive = !document.body.classList.contains("high-contrast");
        applyContrastState(isActive);
        localStorage.setItem(STORAGE_CONTRAST, isActive ? "true" : "false");
        showToast(isActive ? "Modo alto contraste activado." : "Modo alto contraste desactivado.");
    };
}

/* ============ DEMO SCREEN SWITCHING ============ */

var buttons = document.getElementsByClassName("demo-btn");
var screens = document.getElementsByClassName("app-screen");

function getDemoScreenName(screenId) {
    for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].getAttribute("data-screen") === screenId) {
            return cleanVoiceText(buttons[i].textContent);
        }
    }

    var screen = document.getElementById(screenId);
    var heading = screen ? screen.querySelector("h3") : null;
    return heading ? cleanVoiceText(heading.textContent) : "esta sección";
}

function announceDemoScreen(screenId) {
    var target = document.getElementById(screenId);

    if (!target) {
        return;
    }

    announceElementContent(target, false, getDemoScreenName(screenId));
}

function switchToScreen(screenId) {
    for (var j = 0; j < buttons.length; j++) {
        buttons[j].classList.toggle("active", buttons[j].getAttribute("data-screen") === screenId);
    }

    for (var k = 0; k < screens.length; k++) {
        screens[k].classList.toggle("active", screens[k].id === screenId);
    }

    var target = document.getElementById(screenId);

    if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "nearest" });

        setTimeout(function () {
            announceDemoScreen(screenId);
        }, 350);
    }
}

for (var i = 0; i < buttons.length; i++) {
    buttons[i].onclick = function () {
        var screenId = this.getAttribute("data-screen");

        if (screenId === "adminScreen") {
            var session = getSession();

            if (!session || session.role !== "admin") {
                showToast("Inicia sesión como administrador para ver el panel.", "error");
                switchToScreen("loginScreen");
                return;
            }
        }

        switchToScreen(screenId);
    };
}

var adminNavLink = document.getElementById("adminNavLink");

if (adminNavLink) {
    adminNavLink.onclick = function (event) {
        var session = getSession();

        if (!session || session.role !== "admin") {
            event.preventDefault();
            showToast("Inicia sesión como administrador para ver el panel.", "error");
            document.getElementById("demo").scrollIntoView({ behavior: "smooth" });
            switchToScreen("loginScreen");
        } else {
            switchToScreen("adminScreen");
        }
    };
}

/* ============ LOGIN NAV LINK (arriba en la barra de navegación) ============ */
/* Lleva directamente a la pantalla de "Iniciar sesión" dentro de la sección
   de vista previa de la app (#demo), igual que hace "Panel admin". */

var loginNavLink = document.getElementById("loginNavLink");

if (loginNavLink) {
    loginNavLink.onclick = function (event) {
        event.preventDefault();
        document.getElementById("demo").scrollIntoView({ behavior: "smooth" });
        switchToScreen("loginScreen");
    };
}

/* ============ TERMS AND CONDITIONS MODAL ============ */

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
        showToast("Términos aceptados.");
    };
}

if (termsModal) {
    termsModal.onclick = function (event) {
        if (event.target === termsModal) {
            termsModal.classList.remove("active");
        }
    };
}

/* ============ MAP MODAL ============ */

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
        updateModalMapEmbed();
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

var modalMapFrame = document.getElementById("modalMapFrame");
var useAsDestinationButton = document.getElementById("useAsDestinationButton");

function updateModalMapEmbed() {
    if (!modalMapFrame) {
        return;
    }

    var originValue = originAddress ? originAddress.value.trim() : "";
    var destinationValue = modalDestination ? modalDestination.value.trim() : "";

    if (destinationValue === "") {
        return;
    }

    if (originValue !== "" && originValue !== "Mi ubicación actual") {
        modalMapFrame.src = "https://www.google.com/maps?saddr=" + encodeURIComponent(originValue) +
            "&daddr=" + encodeURIComponent(destinationValue) + "&output=embed";
    } else {
        modalMapFrame.src = "https://www.google.com/maps?q=" + encodeURIComponent(destinationValue) + "&output=embed";
    }
}

var debouncedModalMapUpdate = debounce(updateModalMapEmbed, 700);

if (modalDestination) {
    modalDestination.addEventListener("input", debouncedModalMapUpdate);
}

if (originAddress) {
    originAddress.addEventListener("input", debouncedModalMapUpdate);
}

if (useAsDestinationButton) {
    useAsDestinationButton.onclick = function () {
        var destinationValue = modalDestination ? modalDestination.value.trim() : "";

        if (destinationValue === "") {
            originInfo.innerHTML = "Escribe una dirección de destino primero.";
            originInfo.style.color = "red";
            return;
        }

        if (destinationInput) {
            destinationInput.value = destinationValue;
        }

        updateDestinationMap(destinationValue);
        showToast("Dirección copiada exactamente a tu búsqueda.");

        if (mapModal) {
            mapModal.classList.remove("active");
        }
    };
}

if (openGoogleMapsButton) {
    openGoogleMapsButton.onclick = function () {
        var origin = originAddress ? originAddress.value.trim() : "";
        var destination = modalDestination ? modalDestination.value.trim() : "";

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

/* ============ CHIP / CHECKBOX SELECTION ============ */

var accessNeedCards = document.getElementsByClassName("access-need");

for (var a = 0; a < accessNeedCards.length; a++) {
    accessNeedCards[a].onclick = function () {
        var checkbox = this.getElementsByTagName("input")[0];

        if (checkbox) {
            checkbox.checked = !checkbox.checked;
            this.classList.toggle("selected", checkbox.checked);

            if (this.id === "otherObstacleToggle") {
                var otherWrap = document.getElementById("otherObstacleWrap");

                if (otherWrap) {
                    otherWrap.classList.toggle("hidden", !checkbox.checked);

                    if (checkbox.checked) {
                        var otherInputField = document.getElementById("otherObstacleInput");
                        if (otherInputField) {
                            otherInputField.focus();
                        }
                    }
                }
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
            this.classList.toggle("selected", checkbox.checked);
        }
    };
}

/* ============ PHONE INPUT FILTERS ============ */
/* Only digits are accepted while typing, capped at 9 characters, so the
   value can never become a negative or non-numeric string. */

function attachPhoneFilter(inputEl) {
    if (!inputEl) {
        return;
    }

    inputEl.addEventListener("input", function () {
        var digitsOnly = inputEl.value.replace(/\D/g, "").slice(0, 9);
        inputEl.value = digitsOnly;
    });
}

attachPhoneFilter(document.getElementById("phone"));
attachPhoneFilter(document.getElementById("contactPhone"));

/* ============ LOGIN ============ */

var loginForm = document.getElementById("loginForm");
var loginMessage = document.getElementById("loginMessage");

if (loginForm && loginMessage) {
    loginForm.onsubmit = function (event) {
        event.preventDefault();

        var email = document.getElementById("loginEmail").value.trim().toLowerCase();
        var password = document.getElementById("loginPassword").value;
        var users = getUsers();

        var matchedUser = users.find(function (u) {
            return u.email.toLowerCase() === email;
        });

        if (matchedUser) {
            if (matchedUser.password !== password) {
                setFormMessage(loginMessage, "Contraseña incorrecta.", true);
                showToast("Contraseña incorrecta.", "error");
                speak("Contraseña incorrecta.");
                return;
            }

            saveSession({ name: matchedUser.name, email: matchedUser.email, role: matchedUser.role || "user" });
            setFormMessage(loginMessage, "Inicio de sesión realizado correctamente.", false);
            showToast("Bienvenido/a, " + matchedUser.name + ".");
            speak("Inicio de sesión realizado correctamente. Bienvenido o bienvenida, " + matchedUser.name + ".");
            loginForm.reset();

            if (matchedUser.role === "admin") {
                setTimeout(function () {
                    switchToScreen("adminScreen");
                    renderAdminPanel();
                }, 500);
            } else {
                setTimeout(function () {
                    switchToScreen("searchScreen");
                }, 500);
            }
        } else {
            if (email.indexOf("admin") !== -1) {
                setFormMessage(loginMessage, "Correo de administrador no reconocido.", true);
                showToast("Correo de administrador no reconocido.", "error");
                speak("Correo de administrador no reconocido.");
                return;
            }

            var guestName = email.split("@")[0] || "Usuario";
            saveSession({ name: guestName, email: email, role: "user" });
            setFormMessage(loginMessage, "Sesión iniciada en modo demostración.", false);
            showToast("Modo demostración: sesión iniciada como " + guestName + ".");
            speak("Sesión iniciada en modo demostración como " + guestName + ".");
            loginForm.reset();

            setTimeout(function () {
                switchToScreen("searchScreen");
            }, 500);
        }
    };
}

/* ============ LOGOUT ============ */

var logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
    logoutButton.onclick = function () {
        clearSession();
        showToast("Sesión cerrada.");
        speak("Sesión cerrada.");
        renderAdminPanel();
        switchToScreen("loginScreen");
    };
}

/* ============ REGISTER ============ */

var registerForm = document.getElementById("registerForm");
var registerMessage = document.getElementById("registerMessage");

if (registerForm && registerMessage) {
    registerForm.onsubmit = function (event) {
        event.preventDefault();

        var fullName = document.getElementById("fullName").value.trim();
        var email = document.getElementById("registerEmail").value.trim().toLowerCase();
        var password = document.getElementById("registerPassword").value;
        var confirmPassword = document.getElementById("confirmPassword").value;
        var phone = document.getElementById("phone").value;

        if (password !== confirmPassword) {
            setFormMessage(registerMessage, "Las contraseñas no coinciden.", true);
            showToast("Las contraseñas no coinciden.", "error");
            speak("Las contraseñas no coinciden.");
        } else if (!/^9\d{8}$/.test(phone)) {
            setFormMessage(registerMessage, "El teléfono debe empezar en 9 y tener 9 dígitos.", true);
            showToast("El teléfono debe empezar en 9 y tener 9 dígitos.", "error");
            speak("El teléfono debe empezar en 9 y tener 9 dígitos.");
        } else if (!acceptTerms || acceptTerms.checked === false) {
            setFormMessage(registerMessage, "Debes revisar y aceptar los términos y condiciones para crear tu cuenta.", true);
            showToast("Debes aceptar los términos y condiciones.", "error");
            speak("Debes aceptar los términos y condiciones para crear tu cuenta.");
        } else {
            var users = getUsers();
            var alreadyExists = users.some(function (u) {
                return u.email.toLowerCase() === email;
            });

            if (alreadyExists) {
                setFormMessage(registerMessage, "Ya existe una cuenta con ese correo.", true);
                showToast("Ya existe una cuenta con ese correo.", "error");
                speak("Ya existe una cuenta con ese correo.");
                return;
            }

            users.push({ name: fullName, email: email, phone: phone, password: password, role: "user" });
            saveUsers(users);

            setFormMessage(registerMessage, "Cuenta creada correctamente.", false);
            showToast("Cuenta creada. Ya puedes iniciar sesión.");
            speak("Cuenta creada correctamente. Ahora puedes iniciar sesión.");

            registerForm.reset();

            if (acceptTerms) {
                acceptTerms.checked = false;
            }

            setTimeout(function () {
                switchToScreen("loginScreen");
            }, 900);
        }
    };
}

/* ============ ACCESSIBILITY PREFERENCES ============ */

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
            setFormMessage(accessMessage, "Selecciona al menos una necesidad de accesibilidad.", true);
            showToast("Selecciona al menos una necesidad de accesibilidad.", "error");
            speak("Selecciona al menos una necesidad de accesibilidad.");
        } else {
            setFormMessage(accessMessage, "Preferencias de accesibilidad guardadas.", false);
            showToast("Preferencias de accesibilidad guardadas.");
            speak("Preferencias de accesibilidad guardadas.");
        }
    };
}

/* ============ SEARCH ROUTE ============ */

var searchForm = document.getElementById("searchForm");
var searchMessage = document.getElementById("searchMessage");

var destinationMapFrame = document.getElementById("destinationMapFrame");
var mapCaptionText = document.getElementById("mapCaptionText");

function updateDestinationMap(destination) {
    if (destinationMapFrame && destination) {
        destinationMapFrame.src = "https://www.google.com/maps?q=" + encodeURIComponent(destination) + "&output=embed";
    }

    if (mapCaptionText && destination) {
        mapCaptionText.textContent = "Vista real de: " + destination;
    }
}

if (searchForm && searchMessage && destinationInput) {
    searchForm.onsubmit = function (event) {
        event.preventDefault();

        var destination = destinationInput.value.trim();

        if (destination === "") {
            setFormMessage(searchMessage, "Ingresa un destino para calcular la ruta.", true);
            showToast("Ingresa un destino para calcular la ruta.", "error");
            speak("Ingresa un destino para calcular la ruta.");
        } else {
            setFormMessage(searchMessage, "Ruta accesible calculada. El mapa muestra el lugar real.", false);
            showToast("Ruta accesible calculada.");
            speak("Ruta accesible calculada hacia " + destination + ". El mapa muestra el lugar real.");
            updateDestinationMap(destination);
        }
    };
}

/* ============ REPORT OBSTACLE ============ */

var reportForm = document.getElementById("reportForm");
var reportMessage = document.getElementById("reportMessage");

if (reportForm && reportMessage) {
    reportForm.onsubmit = function (event) {
        event.preventDefault();

        var locationValue = document.getElementById("location").value.trim();
        var obstacleInputs = document.getElementsByName("obstacle");
        var selectedTypes = [];

        for (var i = 0; i < obstacleInputs.length; i++) {
            if (obstacleInputs[i].checked) {
                selectedTypes.push(obstacleInputs[i].value);
            }
        }

        var otherIndex = selectedTypes.indexOf("Otro");

        if (otherIndex !== -1) {
            var otherInputEl = document.getElementById("otherObstacleInput");
            var customText = otherInputEl ? otherInputEl.value.trim() : "";
            selectedTypes[otherIndex] = customText ? ("Otro: " + customText) : "Otro (sin especificar)";
        }

        if (selectedTypes.length === 0) {
            setFormMessage(reportMessage, "Selecciona un tipo de obstáculo.", true);
            showToast("Selecciona un tipo de obstáculo.", "error");
            speak("Selecciona un tipo de obstáculo.");
        } else if (locationValue === "") {
            setFormMessage(reportMessage, "Ingresa la ubicación del obstáculo.", true);
            showToast("Ingresa la ubicación del obstáculo.", "error");
            speak("Ingresa la ubicación del obstáculo.");
        } else {
            var session = getSession();
            var reports = getReports();

            reports.push({
                id: Date.now(),
                types: selectedTypes,
                location: locationValue,
                reporter: session ? session.name : "Usuario anónimo",
                date: new Date().toISOString().slice(0, 10),
                status: "pendiente"
            });

            saveReports(reports);

            setFormMessage(reportMessage, "Reporte enviado correctamente.", false);
            showToast("Gracias por ayudar a la comunidad. Reporte enviado.");
            speak("Reporte enviado correctamente. Gracias por ayudar a la comunidad.");

            reportForm.reset();

            var checkedLabels = document.querySelectorAll('#reportForm .access-need.selected');
            checkedLabels.forEach(function (label) {
                label.classList.remove("selected");
            });

            var otherWrap = document.getElementById("otherObstacleWrap");
            if (otherWrap) {
                otherWrap.classList.add("hidden");
            }

            renderAdminPanel();
        }
    };
}

/* ============ VOICE GUIDE (preferencias) ============ */

var voiceForm = document.getElementById("voiceForm");
var voiceMessage = document.getElementById("voiceMessage");

if (voiceForm && voiceMessage) {
    voiceForm.onsubmit = function (event) {
        event.preventDefault();

        setFormMessage(voiceMessage, "Configuración de guía por voz guardada.", false);
        showToast("Guía por voz configurada.");
        speak("Configuración de guía por voz guardada correctamente.");
    };
}

/* ============ CONTACT ============ */

var contactForm = document.getElementById("contactForm");
var message = document.getElementById("message");

if (contactForm && message) {
    contactForm.onsubmit = function (event) {
        event.preventDefault();

        var name = document.getElementById("name").value.trim();
        var email = document.getElementById("email").value.trim();
        var contactPhoneValue = document.getElementById("contactPhone").value.trim();
        var profile = document.getElementById("profile").value;
        var profileLabel = document.getElementById("profile").selectedOptions[0]
            ? document.getElementById("profile").selectedOptions[0].textContent
            : profile;

        if (name === "" || email === "" || profile === "") {
            setFormMessage(message, "Por favor, completa todos los campos.", true);
            showToast("Completa todos los campos.", "error");
            speak("Por favor, completa todos los campos.");
        } else if (!/^9\d{8}$/.test(contactPhoneValue)) {
            setFormMessage(message, "El teléfono debe empezar en 9 y tener 9 dígitos.", true);
            showToast("El teléfono debe empezar en 9 y tener 9 dígitos.", "error");
            speak("El teléfono debe empezar en 9 y tener 9 dígitos.");
        } else {
            var contacts = getContacts();

            contacts.push({
                id: Date.now(),
                name: name,
                email: email,
                phone: contactPhoneValue,
                profile: profileLabel,
                date: new Date().toISOString().slice(0, 10),
                status: "pendiente"
            });

            saveContacts(contacts);

            setFormMessage(message, "Gracias por tu interés en AccesiRuta. Pronto recibirás novedades.", false);
            showToast("Gracias por tu interés en AccesiRuta.");
            speak("Gracias por tu interés en AccesiRuta. Pronto recibirás novedades.");

            contactForm.reset();
            renderAdminPanel();
        }
    };
}

/* ============ ADMIN PANEL ============ */

var adminLocked = document.getElementById("adminLocked");
var adminContent = document.getElementById("adminContent");
var adminTableBody = document.getElementById("adminTableBody");
var adminSummary = document.getElementById("adminSummary");
var adminContactsBody = document.getElementById("adminContactsBody");
var adminContactsSummary = document.getElementById("adminContactsSummary");

var CONTACT_STATUS_OPTIONS = ["pendiente", "verificado", "contactado"];

function renderContactsPanel() {
    if (!adminContactsBody) {
        return;
    }

    var contacts = getContacts().slice().sort(function (x, y) {
        return (y.id || 0) - (x.id || 0);
    });

    var pendingContactsCount = contacts.filter(function (c) {
        return (c.status || "pendiente") === "pendiente";
    }).length;

    if (adminContactsSummary) {
        adminContactsSummary.innerHTML = contacts.length + " personas dejaron sus datos desde la sección de contacto &middot; " + pendingContactsCount + " pendientes de contactar";
    }

    adminContactsBody.innerHTML = "";

    if (contacts.length === 0) {
        var emptyRow = document.createElement("tr");
        var emptyCell = document.createElement("td");
        emptyCell.colSpan = 7;
        emptyCell.className = "admin-empty";
        emptyCell.innerHTML = "Todavía no hay registros de contacto.";
        emptyRow.appendChild(emptyCell);
        adminContactsBody.appendChild(emptyRow);
        return;
    }

    contacts.forEach(function (contact) {
        var contactStatus = contact.status || "pendiente";
        var row = document.createElement("tr");

        var nameCell = document.createElement("td");
        nameCell.textContent = contact.name;

        var emailCell = document.createElement("td");
        emailCell.textContent = contact.email;

        var phoneCell = document.createElement("td");
        phoneCell.textContent = contact.phone || "-";

        var profileCell = document.createElement("td");
        profileCell.textContent = contact.profile;

        var dateCell = document.createElement("td");
        dateCell.textContent = contact.date;

        var statusCell = document.createElement("td");
        var statusSelect = document.createElement("select");
        statusSelect.className = "status-select status-" + contactStatus;

        CONTACT_STATUS_OPTIONS.forEach(function (statusOption) {
            var option = document.createElement("option");
            option.value = statusOption;
            option.textContent = statusOption.charAt(0).toUpperCase() + statusOption.slice(1);
            if (statusOption === contactStatus) {
                option.selected = true;
            }
            statusSelect.appendChild(option);
        });

        statusSelect.onchange = function () {
            var allContacts = getContacts();
            var target = allContacts.find(function (c) { return c.id === contact.id; });
            if (target) {
                target.status = statusSelect.value;
                saveContacts(allContacts);
                statusSelect.className = "status-select status-" + statusSelect.value;
                showToast("Estado del contacto actualizado.");
                renderContactsPanel();
            }
        };

        statusCell.appendChild(statusSelect);

        var actionCell = document.createElement("td");
        var deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-report-btn";
        deleteButton.innerHTML = "✕";
        deleteButton.title = "Eliminar solicitud";
        deleteButton.onclick = function () {
            var allContacts = getContacts().filter(function (c) { return c.id !== contact.id; });
            saveContacts(allContacts);
            showToast("Solicitud de contacto eliminada.");
            renderContactsPanel();
        };
        actionCell.appendChild(deleteButton);

        row.appendChild(nameCell);
        row.appendChild(emailCell);
        row.appendChild(phoneCell);
        row.appendChild(profileCell);
        row.appendChild(dateCell);
        row.appendChild(statusCell);
        row.appendChild(actionCell);

        adminContactsBody.appendChild(row);
    });
}

function renderAdminPanel() {
    if (!adminLocked || !adminContent || !adminTableBody) {
        return;
    }

    var session = getSession();
    var isAdmin = session && session.role === "admin";

    adminLocked.classList.toggle("hidden", isAdmin);
    adminContent.classList.toggle("active", isAdmin);

    if (!isAdmin) {
        return;
    }

    renderContactsPanel();

    var reports = getReports().slice().sort(function (x, y) {
        return y.id - x.id;
    });

    var pendingCount = reports.filter(function (r) { return r.status === "pendiente"; }).length;

    if (adminSummary) {
        adminSummary.innerHTML = reports.length + " reportes en total &middot; " + pendingCount + " pendientes de revisión";
    }

    adminTableBody.innerHTML = "";

    if (reports.length === 0) {
        var emptyRow = document.createElement("tr");
        var emptyCell = document.createElement("td");
        emptyCell.colSpan = 6;
        emptyCell.className = "admin-empty";
        emptyCell.innerHTML = "Todavía no hay reportes de la comunidad.";
        emptyRow.appendChild(emptyCell);
        adminTableBody.appendChild(emptyRow);
        return;
    }

    reports.forEach(function (report) {
        var row = document.createElement("tr");

        var typeCell = document.createElement("td");
        typeCell.textContent = report.types ? report.types.join(", ") : "-";

        var locationCell = document.createElement("td");
        locationCell.textContent = report.location;

        var reporterCell = document.createElement("td");
        reporterCell.textContent = report.reporter;

        var dateCell = document.createElement("td");
        dateCell.textContent = report.date;

        var statusCell = document.createElement("td");
        var statusSelect = document.createElement("select");
        statusSelect.className = "status-select status-" + report.status;
        ["pendiente", "verificado", "resuelto"].forEach(function (statusOption) {
            var option = document.createElement("option");
            option.value = statusOption;
            option.textContent = statusOption.charAt(0).toUpperCase() + statusOption.slice(1);
            if (statusOption === report.status) {
                option.selected = true;
            }
            statusSelect.appendChild(option);
        });

        statusSelect.onchange = function () {
            var allReports = getReports();
            var target = allReports.find(function (r) { return r.id === report.id; });
            if (target) {
                target.status = statusSelect.value;
                saveReports(allReports);
                statusSelect.className = "status-select status-" + statusSelect.value;
                showToast("Estado del reporte actualizado.");
                renderAdminPanel();
            }
        };

        statusCell.appendChild(statusSelect);

        var actionCell = document.createElement("td");
        var deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-report-btn";
        deleteButton.innerHTML = "✕";
        deleteButton.title = "Eliminar reporte";
        deleteButton.onclick = function () {
            var allReports = getReports().filter(function (r) { return r.id !== report.id; });
            saveReports(allReports);
            showToast("Reporte eliminado.");
            renderAdminPanel();
        };
        actionCell.appendChild(deleteButton);

        row.appendChild(typeCell);
        row.appendChild(locationCell);
        row.appendChild(reporterCell);
        row.appendChild(dateCell);
        row.appendChild(statusCell);
        row.appendChild(actionCell);

        adminTableBody.appendChild(row);
    });
}

renderAdminPanel();

/* ============ SCROLL REVEAL ============ */

var revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(function (element) {
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach(function (element) {
        element.classList.add("revealed");
    });
}

/* ============ ANIMATED STAT COUNTERS ============ */

var statNumbers = document.querySelectorAll(".stat-number");

function animateCounter(element) {
    var target = parseInt(element.getAttribute("data-target"), 10) || 0;
    var duration = 1400;
    var startTime = null;

    function step(timestamp) {
        if (!startTime) {
            startTime = timestamp;
        }

        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = Math.floor(eased * target);

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            element.textContent = target;
        }
    }

    requestAnimationFrame(step);
}

if ("IntersectionObserver" in window && statNumbers.length > 0) {
    var statsObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    statNumbers.forEach(function (el) {
        statsObserver.observe(el);
    });
} else {
    statNumbers.forEach(function (el) {
        el.textContent = el.getAttribute("data-target");
    });
}

/* ============ TESTIMONIAL CAROUSEL ============ */

var testimonials = [
    {
        text: "Antes evitaba salir sola por miedo a encontrar una vereda rota. Ahora reviso la ruta antes de salir y llego con mucha más tranquilidad.",
        author: "Rosa M., usuaria con discapacidad motriz"
    },
    {
        text: "La guía por voz me avisa antes de cada cruce. Es la primera app que realmente piensa en cómo camino por la ciudad.",
        author: "Fernando A., usuario con discapacidad visual"
    },
    {
        text: "Reporté una obra sin señalización cerca de mi casa y en dos días ya aparecía marcada para otros vecinos. Se siente comunidad real.",
        author: "Lucía P., vecina de San Miguel"
    },
    {
        text: "Como acompañante de mi papá, la función de alto contraste y los textos grandes hacen que él mismo pueda usar la app sin ayuda.",
        author: "Diego H., familiar de usuario"
    }
];

var testimonialText = document.getElementById("testimonialText");
var testimonialAuthor = document.getElementById("testimonialAuthor");
var testimonialDots = document.getElementById("testimonialDots");
var testimonialPrev = document.getElementById("testimonialPrev");
var testimonialNext = document.getElementById("testimonialNext");
var currentTestimonial = 0;
var testimonialTimer = null;

function renderTestimonial(index) {
    if (!testimonialText || !testimonialAuthor) {
        return;
    }

    testimonialText.style.animation = "none";
    testimonialText.offsetHeight;
    testimonialText.style.animation = "";

    testimonialText.textContent = '"' + testimonials[index].text + '"';
    testimonialAuthor.textContent = "— " + testimonials[index].author;

    if (testimonialDots) {
        var dots = testimonialDots.getElementsByClassName("testimonial-dot");
        for (var i = 0; i < dots.length; i++) {
            dots[i].classList.toggle("active", i === index);
        }
    }
}

function buildTestimonialDots() {
    if (!testimonialDots) {
        return;
    }

    testimonials.forEach(function (t, index) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "testimonial-dot" + (index === 0 ? " active" : "");
        dot.setAttribute("aria-label", "Ver testimonio " + (index + 1));
        dot.onclick = function () {
            currentTestimonial = index;
            renderTestimonial(currentTestimonial);
            restartTestimonialTimer();
        };
        testimonialDots.appendChild(dot);
    });
}

function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    renderTestimonial(currentTestimonial);
}

function prevTestimonial() {
    currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    renderTestimonial(currentTestimonial);
}

function restartTestimonialTimer() {
    if (testimonialTimer) {
        clearInterval(testimonialTimer);
    }
    testimonialTimer = setInterval(nextTestimonial, 6000);
}

if (testimonialText) {
    buildTestimonialDots();

    if (testimonialNext) {
        testimonialNext.onclick = function () {
            nextTestimonial();
            restartTestimonialTimer();
        };
    }

    if (testimonialPrev) {
        testimonialPrev.onclick = function () {
            prevTestimonial();
            restartTestimonialTimer();
        };
    }

    restartTestimonialTimer();
}