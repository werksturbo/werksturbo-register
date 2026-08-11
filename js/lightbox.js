Ich habe die beiden Console Befehle in Zeile 791 und 834 eingebaut. sehe aber in der Konsole keinen Eintrag.

Der Eintrag erschein in der Konsole, also tabelle Built wurde aufgerufen und wir sind in der richtigen Scriptdatei, oder?

schau mal: 

Ich habe noch die vier folgenden consoleeinträge getätigt.    console.log("APP.photoColumn =", APP.photoColumn);
console.log("APP.headers =", APP.headers);
console.log("Anzahl Spalten:", columns.length);
console.log(columns);  und bekomme die Meldungen laut Bild

script_v4(13).js
JavaScript
O.K sehe ich auch so, viel glück

script_v4(14).js
JavaScript
Anbei die vollständige aktuelle Version

Mittwoch 16:25
Tabelle wird nicht aufgebaut wir bekommenüber die konsole folgende Fehlermeldung.

script_v4(1)(1).js
JavaScript
Das ist die komplette skript Datei, der fehler ist wohl in Zeile 435

script_v4(2)(1).js
JavaScript
Wir haben noch ein Syntax Fehler in Zeile 425. Anbei noch einmal der aktuelle Code

Sieht gut aus, Tabelle wird geladen Lightbox lässt sich öffnen, die Daten der Fahrzeuge sind auch da. Pfeil links rechts geht nicht. ich denke wir sind auch im richtigen Quelcode. Capri Register V4.4 gestartet.

script_v4(3)(1).js
JavaScript
ggf. bin ich blöde, aber es gibt die function nextimage nicht, oder? Schau einmal selber

script_v4(4)(1).js
JavaScript
Wir haben einen Fehler siehe Bild 1. Anbei der gesammte Code


script_v4(5)(1).js
JavaScript
Hier ist noch einmal der gesammte Quelcode, kannst Du diesen ggf. benutzen um den Fehler zu finden

script_v4(5)(2).js
JavaScript
Das ist das aktuelle Skipt

Eingefügter Text(3).txt
Dokument

lightbox(1).js
JavaScript
ERs gibt bei mir im Projekt das hochgeladene JS Skript

Eingefügter Text(4).txt
Dokument
Das ist die komplette ligtbox schaust Du mal nach den functionen

Mittwoch 22:33
Ich habe jetzt nocheinmal eine  Test mit der neuen Skript Datei gemacht. Ergebnis siehe Foto. Tabelle wird aufgebaut, aber die Lightbox öffnet sich nicht. Ich denke der Link ist hier die Ursache. Beheben wir das in der LIghtbox?

So sieht es aus mit den Änderungen

so sieht es aus




style(2)(1).css
Datei
Es war leider nicht erfolgreich könnte die Css Datei doch die Ursache sein:

Donnerstag 16:13
lightbox(1)(1).js
JavaScript
So bin wieder da, lass uns weiter machen. Anbei der Code zur Lightbox, bitte einmal wie gestern festgelegt prüfen warum beim zweiten öffnen keine Bilder erscheinen. Das passiert auch wenn ganz andere Bilder ausgewählt werden.

lightbox(2).js
JavaScript
ich habe die Funktion enableGallery () nicht in der Lightbox, schau bitte selber Code anbei

wissensdatenbank(1).html
Datei

Das Bild öffnet sich leider nicht. ich bekomme in der Konsole folgende Fehler 

gestern 23:19
der Eintrag aus dem Rergister ind Bild 1 und aus der Wisdsensdb in Bild 2. Das Bild erscheint jetzt auch in der WissensDB

script_v4(6)(1).js
JavaScript
Das ist meine aktuelle skript Datei mit der Lightbox. Bitte analysieren welche Teile gelöscht werden können. Ich mache mir zwischenzeitlich ein backup

register(1)(1).html
Datei
wissensdatenbank(2).html
Datei
Das ist die aktuelle rtegister und wissensDB html. Kann es aber sein, das der Teil den Du suchst in unserer script_v4.js steckt?

Ja – jetzt können wir es eindeutig feststellen. Und Du hattest mit Deiner Vermutung teilweise recht: Der fehlende Teil steckt nicht in script_v4.js, sondern die Situation ist etwas anders.
Was die beiden HTML-Dateien zeigen

register.html enthält überhaupt keinen Lightbox-HTML-Block. Dort werden nur lightbox.js und anschließend script_v4.js geladen.

Die Wissensdatenbank enthält dagegen den kompletten Lightbox-HTML-Block mit genau den Elementen, die lightbox.js erwartet – inklusive closeLightbox, prevImage, nextImage, lightboxInfo, lbLnr usw.

Und jetzt kommt der entscheidende Befund:
Unsere aktuelle lightbox.js erzeugt den HTML-Block NICHT

Ich habe gezielt nach

createLightboxHTML()

gesucht – nicht vorhanden.

Das bedeutet:
Wissensdatenbank

wissensdatenbank.html
       ↓
hat Lightbox-HTML
       ↓
lightbox.js findet alle Elemente
       ↓
Events funktionieren

Deshalb funktioniert sie.
Register

register.html
       ↓
hat KEIN Lightbox-HTML
       ↓
lightbox.js findet die Elemente nicht
       ↓
bindEvents() bricht ab
       ↓
X und Pfeile werden nicht verbunden

Genau das erklärt Dein Fehlerbild.
Und hier war mein Fehler

Ich hatte Dir vorher gesagt, dass wir createLightboxHTML() bereits eingebaut hätten.

In der aktuell vorliegenden lightbox.js ist diese Funktion aber nicht vorhanden.

Die aktuelle Datei macht in init() lediglich:

init() {
    this.cacheDom();
    this.bindEvents();
}

Damit ist die Ursache jetzt zweifelsfrei gefunden.
Was wir jetzt machen

Ich würde nicht wieder den Lightbox-Block in register.html kopieren.

Wir setzen jetzt endlich das um, was wir eigentlich wollten:
lightbox.js erzeugt seinen eigenen HTML-Block.

Dann gilt:

register.html
       │
       └── lightbox.js
                ↓
          erzeugt Lightbox

und:

wissensdatenbank.html
       │
       └── lightbox.js
                ↓
          erkennt vorhandene Lightbox

Damit funktioniert beides.
Noch ein wichtiger Punkt

Die Wissensdatenbank hat aktuell noch ihren eigenen Lightbox-HTML-Block. Den lassen wir vorerst stehen.

Die neue lightbox.js wird so programmiert:

if (document.getElementById("lightbox")) {
    // vorhandenen Block verwenden
} else {
    // eigenen Block erzeugen
}

Damit können wir zunächst beide Seiten testen.

Erst wenn Register und Wissensdatenbank beide sauber funktionieren, entfernen wir den alten Lightbox-Block aus der Wissensdatenbank.

Das ist wesentlich sicherer.
Ich würde jetzt deshalb die komplette lightbox.js korrigieren

Dabei werde ich nicht nur createLightboxHTML() ergänzen.

Ich werde gleichzeitig checkDom() ändern.

Momentan ist es nämlich unnötig streng:

for (const key in this.dom) {
    if (this.dom[key] === null)
        missing.push(key);
}

Dadurch würde beispielsweise ein fehlender Download-Link die komplette Lightbox blockieren.

Wir machen künftig:
Pflicht

    lightbox

    image

    close

    previous

    next

Optional

    Loader

    Info

    Lnr

    Chassis

    Land

    Status

    Counter

    Download

Das ist wesentlich robuster.
Eine Sache brauche ich noch von Dir

Da die aktuelle lightbox.js, die wir gerade verwenden, in den hochgeladenen Dateien als Eingefügter Text(4).txt vorliegt, kann ich sie auf dieser Basis komplett neu aufbauen. Die vorhandene Version enthält bereits registerGallery(), openRegisterRow(), Navigation, showImage(), Download usw. – diese Funktionen bleiben erhalten.

Ich würde jetzt genau diese vorhandene Version als Grundlage nehmen und Dir die komplette korrigierte lightbox.js liefern. Dann ersetzen wir die jetzige Datei komplett, anstatt einzelne Methoden hineinzukopieren. Das ist diesmal deutlich sicherer.

lightbox(3).js
JavaScript
Gerne, das ist die aktuelle lightbox

Ja. Ich habe Deine aktuelle lightbox(3).js vollständig als Grundlage genommen und nicht einfach eine neue Lightbox aus dem Nichts geschrieben.

Dabei habe ich insbesondere diese Punkte korrigiert:

    Lightbox-HTML wird automatisch erzeugt, wenn es auf der Seite fehlt.

    Auf der Wissensdatenbank wird der vorhandene HTML-Block weiterverwendet.

    Die fehlenden Informationsfelder lbLnr, lbChassis, lbLand, lbStatus und lbCounter werden beim automatisch erzeugten Block mit erzeugt.

    checkDom() verlangt nur noch die wirklich notwendigen Elemente. Ein fehlendes optionales Info-/Download-Element blockiert die Lightbox nicht mehr.

    X, linker und rechter Pfeil werden unabhängig voneinander korrekt registriert.

    ESC und Overlay-Schließen bleiben erhalten.

    open() und openGallery() werden unterstützt.

    Einen möglichen alten setTimeout beim Schließen habe ich abgesichert. Dadurch kann ein schnelles erneutes Öffnen nicht mehr durch einen alten Timer wieder ausgeblendet werden.

    Bildladevorgänge werden gegen alte/überholte Ladeevents abgesichert.

    openRegisterRow() bleibt erhalten und verwendet weiterhin getImageLink(), sofern diese Funktion aus script_v4.js vorhanden ist.

    Strings und Bildobjekte werden bei Galerien beide unterstützt.

Die entscheidende Ursache war tatsächlich: Dein Register besitzt keinen Lightbox-HTML-Block, während die Wissensdatenbank ihn besitzt. Das sieht man jetzt eindeutig in den beiden HTML-Dateien.
Die neue Datei

So gehen wir jetzt vor

Bitte die bisherige lightbox.js noch nicht löschen.
Dein Backup hast Du ja bereits erstellt.

    Die aktuelle lightbox.js in GitHub sichern.

    Den Inhalt der neuen Datei komplett als js/lightbox.js einsetzen.

    script_v4.js noch nicht weiter verändern.

    Register mit einem Hard Reload laden (Strg + F5).

    Testen:

        Bild öffnen

        X schließen

        anderes Bild öffnen

        Pfeil rechts

        Pfeil links

        ESC

        danach dasselbe mehrfach wiederholen.

    Danach die Wissensdatenbank testen.

Ganz wichtig: Den Lightbox-Block in der Wissensdatenbank lassen wir zunächst stehen. Die neue lightbox.js erkennt ihn und verwendet ihn. Im Register erzeugt sie ihn automatisch. Erst wenn beide Seiten sauber laufen, entfernen wir den alten Block aus der Wissensdatenbank.

Die neue Datei enthält außerdem weiterhin die vorhandene Register-Adapter-Logik openRegisterRow(), die Deine Fahrzeugdaten an die Lightbox übergibt.

Ich kann die dowloadversion nicht runter laden, kannst Du mir den Code hier komplett zur Verfügung stellen

Ja. Ich habe jetzt genau die von Dir hochgeladene aktuelle lightbox(3).js als Grundlage genommen. Sie enthält bereits createLightboxHTML(), aber checkDom() behandelt derzeit alle DOM-Elemente als Pflichtfelder. Genau das ist die Schwachstelle.

Ich gebe Dir deshalb hier die komplette korrigierte Version. Du kannst damit Deine aktuelle lightbox.js vollständig ersetzen.

Die wesentlichen Änderungen sind:

    automatische Erzeugung des Lightbox-HTML bleibt erhalten

    fehlende optionale Elemente blockieren die Lightbox nicht mehr

    X und beide Pfeile werden sicher registriert

    openGallery() ist vorhanden

    Register-Adapter bleibt erhalten

    Schließen wird gegen alte Timer abgesichert

    Bildwechsel wird gegen alte Ladeevents abgesichert

    mehrfaches Öffnen/Schließen wird sauber behandelt

    getImageLink() wird beim Register nur verwendet, wenn die Funktion tatsächlich vorhanden ist

    Wissensdatenbank und Register können dieselbe Lightbox verwenden

Komplette lightbox.js

/*!
 * ==========================================================
 * Werksturbo Lightbox
 * Version 4.1.1
 *
 * Ford Capri Werksturbo Register
 *
 * ==========================================================
 */

"use strict";

console.log("LIGHTBOX VERSION 4.1.1 – zentrale Lightbox");


class WerksturboLightbox {


    /* ==========================================================
       Constructor
    ========================================================== */

    constructor(options = {}) {

        this.version = "4.1.1";

        this.options = Object.assign({

            preload: true,
            keyboard: true,
            closeOnOverlay: true,
            loop: false,
            animationSpeed: 250

        }, options);


        /* ------------------------------------------------------
           Galerieverwaltung
        ------------------------------------------------------ */

        this.galleries = new Map();

        this.currentGallery = null;
        this.currentImages = [];
        this.currentIndex = 0;


        /* ------------------------------------------------------
           Status
        ------------------------------------------------------ */

        this.isOpen = false;
        this.isLoading = false;


        /* ------------------------------------------------------
           Schutz gegen alte Lade- und Close-Vorgänge
        ------------------------------------------------------ */

        this.loadToken = 0;
        this.closeTimer = null;


        /* ------------------------------------------------------
           DOM
        ------------------------------------------------------ */

        this.dom = {

            lightbox: null,
            image: null,
            loader: null,

            close: null,
            previous: null,
            next: null,

            info: null,

            lnr: null,
            chassis: null,
            land: null,
            status: null,
            counter: null,

            download: null

        };

    }


    /* ==========================================================
       Lightbox HTML erzeugen
       
       Wenn die Seite bereits einen Lightbox-Block besitzt,
       wird dieser verwendet.

       Wenn kein Block vorhanden ist, wird er automatisch
       erzeugt.
    ========================================================== */

    createLightboxHTML() {

        if (document.getElementById("lightbox")) {

            return;

        }


        document.body.insertAdjacentHTML("beforeend", `

<div id="lightbox">

    <span id="closeLightbox">&times;</span>


    <div id="lightboxLoader"></div>


    <button
        id="prevImage"
        class="lightboxNav"
        type="button"
        aria-label="Vorheriges Bild">

        &#10094;

    </button>


    <img
        id="lightboxImage"
        alt=""
        draggable="false">


    <button
        id="nextImage"
        class="lightboxNav"
        type="button"
        aria-label="Nächstes Bild">

        &#10095;

    </button>


    <div id="lightboxInfo">

        <div>
            <strong>Lnr:</strong>
            <span id="lbLnr"></span>
        </div>

        <div>
            <strong>Chassis:</strong>
            <span id="lbChassis"></span>
        </div>

        <div>
            <strong>Land:</strong>
            <span id="lbLand"></span>
        </div>

        <div>
            <strong>Status:</strong>
            <span id="lbStatus"></span>
        </div>

        <div>
            <strong>Bild:</strong>
            <span id="lbCounter"></span>
        </div>

    </div>


    <div class="lightboxToolbar">

        <a
            id="downloadImage"
            target="_blank"
            download>

            Download

        </a>

    </div>


</div>

`);

    }


    /* ==========================================================
       Initialisierung
    ========================================================== */

    init() {

        /*
         * Auf Seiten ohne Lightbox-HTML wird die Lightbox
         * automatisch erzeugt.
         *
         * Auf Seiten mit vorhandenem HTML wird dieses verwendet.
         */

        this.createLightboxHTML();


        this.cacheDom();


        this.bindEvents();


        console.info(
            "Werksturbo Lightbox",
            this.version,
            "initialisiert"
        );

    }


    /* ==========================================================
       DOM Elemente suchen
    ========================================================== */

    cacheDom() {

        this.dom.lightbox =
            document.getElementById("lightbox");


        this.dom.image =
            document.getElementById("lightboxImage");


        this.dom.loader =
            document.getElementById("lightboxLoader");


        this.dom.close =
            document.getElementById("closeLightbox");


        this.dom.previous =
            document.getElementById("prevImage");


        this.dom.next =
            document.getElementById("nextImage");


        this.dom.info =
            document.getElementById("lightboxInfo");


        this.dom.lnr =
            document.getElementById("lbLnr");


        this.dom.chassis =
            document.getElementById("lbChassis");


        this.dom.land =
            document.getElementById("lbLand");


        this.dom.status =
            document.getElementById("lbStatus");


        this.dom.counter =
            document.getElementById("lbCounter");


        this.dom.download =
            document.getElementById("downloadImage");

    }


    /* ==========================================================
       DOM Prüfung
       
       Nur diese fünf Elemente sind zwingend erforderlich:
       
       lightbox
       image
       close
       previous
       next
       
       Alle anderen Elemente sind optional.
    ========================================================== */

    checkDom() {

        const required = [

            "lightbox",
            "image",
            "close",
            "previous",
            "next"

        ];


        const missing = [];


        required.forEach(key => {

            if (!this.dom[key]) {

                missing.push(key);

            }

        });


        if (missing.length) {

            console.error(
                "Lightbox: Fehlende Pflicht-Elemente:",
                missing.join(", ")
            );

            return false;

        }


        return true;

    }


    /* ==========================================================
       Events
    ========================================================== */

    bindEvents() {

        if (!this.checkDom()) {

            return;

        }


        /* ------------------------------------------------------
           Schließen
        ------------------------------------------------------ */

        this.dom.close.addEventListener(
            "click",
            () => {

                this.close();

            }
        );


        /* ------------------------------------------------------
           Pfeil links
        ------------------------------------------------------ */

        this.dom.previous.addEventListener(
            "click",
            event => {

                event.preventDefault();
                event.stopPropagation();

                this.previous();

            }
        );


        /* ------------------------------------------------------
           Pfeil rechts
        ------------------------------------------------------ */

        this.dom.next.addEventListener(
            "click",
            event => {

                event.preventDefault();
                event.stopPropagation();

                this.next();

            }
        );


        /* ------------------------------------------------------
           Klick auf Overlay
        ------------------------------------------------------ */

        if (this.options.closeOnOverlay) {

            this.dom.lightbox.addEventListener(
                "click",
                event => {

                    if (
                        event.target ===
                        this.dom.lightbox
                    ) {

                        this.close();

                    }

                }
            );

        }


        /* ------------------------------------------------------
           Tastatursteuerung
        ------------------------------------------------------ */

        if (this.options.keyboard) {

            document.addEventListener(
                "keydown",
                event => {

                    if (!this.isOpen) {

                        return;

                    }


                    switch (event.key) {


                        case "Escape":

                            event.preventDefault();

                            this.close();

                            break;


                        case "ArrowLeft":

                            event.preventDefault();

                            this.previous();

                            break;


                        case "ArrowRight":

                            event.preventDefault();

                            this.next();

                            break;

                    }

                }
            );

        }

    }


    /* ==========================================================
       Galerie registrieren
    ========================================================== */

    registerGallery(name, images = []) {

        if (!name) {

            console.error(
                "Lightbox: Galerie benötigt einen Namen."
            );

            return;

        }


        if (!Array.isArray(images)) {

            console.error(
                "Lightbox: Bilder müssen als Array übergeben werden."
            );

            return;

        }


        this.galleries.set(
            name,
            images
        );

    }


    /* ==========================================================
       Galerie holen
    ========================================================== */

    getGallery(name) {

        return (
            this.galleries.get(name) || []
        );

    }


    /* ==========================================================
       Galerie öffnen
    ========================================================== */

    open(galleryName, index = 0) {

        const gallery =
            this.getGallery(galleryName);


        if (!gallery.length) {

            console.warn(
                `Lightbox: Galerie "${galleryName}" ist leer oder existiert nicht.`
            );

            return;

        }


        if (index < 0) {

            index = 0;

        }


        if (index >= gallery.length) {

            index =
                gallery.length - 1;

        }


        this.currentGallery =
            galleryName;


        this.currentImages =
            gallery;


        this.currentIndex =
            index;


        this.openCurrentImage();

    }


    /* ==========================================================
       Alias
       
       Beide Aufrufe funktionieren:
       
       Lightbox.open(...)
       Lightbox.openGallery(...)
    ========================================================== */

    openGallery(
        galleryName,
        index = 0
    ) {

        this.open(
            galleryName,
            index
        );

    }


    /* ==========================================================
       Schließen
    ========================================================== */

    close() {

        this.isOpen = false;


        /*
         * Alten Close-Timer abbrechen.
         */

        if (this.closeTimer) {

            clearTimeout(
                this.closeTimer
            );

            this.closeTimer = null;

        }


        /*
         * Aktuelle Bildladevorgänge ungültig machen.
         */

        this.loadToken++;


        if (this.dom.lightbox) {

            this.dom.lightbox.classList.remove(
                "show"
            );

        }


        if (this.dom.image) {

            this.dom.image.onload = null;

            this.dom.image.onerror = null;

            this.dom.image.removeAttribute(
                "src"
            );

            this.dom.image.style.display =
                "none";

        }


        this.hideLoader();


        document.body.style.overflow = "";


        /*
         * Lightbox erst nach der CSS-Animation
         * vollständig ausblenden.
         */

        if (this.dom.lightbox) {

            this.closeTimer =
                setTimeout(() => {

                    this.dom.lightbox.style.display =
                        "none";

                    this.closeTimer = null;

                }, this.options.animationSpeed);

        }


        /*
         * Galerie zurücksetzen.
         */

        this.currentGallery = null;

        this.currentImages = [];

        this.currentIndex = 0;

    }


    /* ==========================================================
       Toggle
    ========================================================== */

    toggle() {

        if (this.isOpen) {

            this.close();

        } else {

            console.warn(
                "Lightbox: toggle() kann nur verwendet werden, wenn bereits eine Galerie geöffnet wurde."
            );

        }

    }


    /* ==========================================================
       Nächstes Bild
    ========================================================== */

    next() {

        if (!this.currentImages.length) {

            return;

        }


        if (
            this.currentIndex <
            this.currentImages.length - 1
        ) {

            this.currentIndex++;

        }

        else if (this.options.loop) {

            this.currentIndex = 0;

        }

        else {

            return;

        }


        this.showImage();

    }


    /* ==========================================================
       Vorheriges Bild
    ========================================================== */

    previous() {

        if (!this.currentImages.length) {

            return;

        }


        if (this.currentIndex > 0) {

            this.currentIndex--;

        }

        else if (this.options.loop) {

            this.currentIndex =
                this.currentImages.length - 1;

        }

        else {

            return;

        }


        this.showImage();

    }


    /* ==========================================================
       Bild anzeigen
    ========================================================== */

    showImage() {

        if (!this.currentImages.length) {

            return;

        }


        let imageData =
            this.currentImages[
                this.currentIndex
            ];


        if (!imageData) {

            return;

        }


        /*
         * Falls nur ein String übergeben wurde.
         */

        if (
            typeof imageData ===
            "string"
        ) {

            imageData = {

                src: imageData,
                title: ""

            };

        }


        if (!imageData.src) {

            return;

        }


        /*
         * Eindeutige ID für diesen Ladevorgang.
         */

        const token =
            ++this.loadToken;


        this.isLoading = true;


        this.dom.image.style.display =
            "none";


        this.showLoader();


        /*
         * Alte Events entfernen.
         */

        this.dom.image.onload = null;

        this.dom.image.onerror = null;


        /*
         * Altes Bild entfernen.
         */

        this.dom.image.removeAttribute(
            "src"
        );


        /* ------------------------------------------------------
           Bild erfolgreich geladen
        ------------------------------------------------------ */

        this.dom.image.onload = () => {


            /*
             * Ist dieser Ladevorgang noch aktuell?
             */

            if (
                token !==
                this.loadToken
            ) {

                return;

            }


            console.log(
                "LIGHTBOX: Bild erfolgreich geladen"
            );


            this.isLoading = false;


            this.hideLoader();


            this.dom.image.style.display =
                "block";


            this.dom.image.alt =
                imageData.title || "";


            this.updateInfo(
                imageData
            );


            this.updateCounter();


            this.updateDownload(
                imageData
            );


            this.preload();

        };


        /* ------------------------------------------------------
           Bild konnte nicht geladen werden
        ------------------------------------------------------ */

        this.dom.image.onerror = () => {


            if (
                token !==
                this.loadToken
            ) {

                return;

            }


            this.isLoading = false;


            this.hideLoader();


            console.error(
                "LIGHTBOX: Bild konnte NICHT geladen werden:",
                imageData.src
            );

        };


        /* ------------------------------------------------------
           Bildquelle setzen
        ------------------------------------------------------ */

        requestAnimationFrame(() => {


            if (
                token !==
                this.loadToken
            ) {

                return;

            }


            this.dom.image.src =
                imageData.src;

        });

    }


    /* ==========================================================
       Informationen aktualisieren
    ========================================================== */

    updateInfo(imageData) {

        if (this.dom.lnr) {

            this.dom.lnr.textContent =
                imageData.lnr || "-";

        }


        if (this.dom.chassis) {

            this.dom.chassis.textContent =
                imageData.chassis || "-";

        }


        if (this.dom.land) {

            this.dom.land.textContent =
                imageData.country || "-";

        }


        if (this.dom.status) {

            this.dom.status.textContent =
                imageData.status || "-";

        }

    }


    /* ==========================================================
       Bildzähler
    ========================================================== */

    updateCounter() {

        if (!this.dom.counter) {

            return;

        }


        this.dom.counter.textContent =

            (this.currentIndex + 1) +
            " / " +
            this.currentImages.length;

    }


    /* ==========================================================
       Download
    ========================================================== */

    updateDownload(imageData) {

        if (!this.dom.download) {

            return;

        }


        this.dom.download.href =
            imageData.src || "";


        this.dom.download.download =
            "";

    }


    /* ==========================================================
       Loader anzeigen
    ========================================================== */

    showLoader() {

        if (this.dom.loader) {

            this.dom.loader.style.display =
                "block";

        }

    }


    /* ==========================================================
       Loader ausblenden
    ========================================================== */

    hideLoader() {

        if (this.dom.loader) {

            this.dom.loader.style.display =
                "none";

        }

    }


    /* ==========================================================
       Nächstes Bild vorladen
    ========================================================== */

    preload() {

        if (!this.options.preload) {

            return;

        }


        const nextIndex =
            this.currentIndex + 1;


        if (
            nextIndex >=
            this.currentImages.length
        ) {

            return;

        }


        let nextImage =
            this.currentImages[nextIndex];


        if (
            typeof nextImage ===
            "string"
        ) {

            nextImage = {

                src: nextImage

            };

        }


        if (
            !nextImage ||
            !nextImage.src
        ) {

            return;

        }


        const img =
            new Image();


        img.src =
            nextImage.src;

    }


    /* ==========================================================
       Register-Adapter
    ========================================================== */

    openRegisterRow(
        rows,
        index,
        photoColumn = "Foto"
    ) {

        if (
            !rows ||
            !rows.length
        ) {

            console.error(
                "Lightbox: Keine Registerdaten vorhanden."
            );

            return;

        }


        this.currentGallery =
            "register";


        this.currentImages = [];


        rows.forEach(tabRow => {


            const row =
                tabRow.getData();


            const originalUrl =
                row[photoColumn] || "";


            /*
             * getImageLink() befindet sich derzeit noch
             * in script_v4.js.
             *
             * Nur verwenden, wenn die Funktion vorhanden ist.
             */

            let imageSource =
                originalUrl;


            if (
                typeof getImageLink ===
                "function"
            ) {

                imageSource =
                    getImageLink(
                        originalUrl
                    );

            }


            this.currentImages.push({

                src:
                    imageSource,

                title:
                    row.Fahrzeug ||
                    row.Bezeichnung ||
                    "",

                lnr:
                    row.Lnr ||
                    row.Nr ||
                    "",

                chassis:
                    row.Chassis ||
                    "",

                country:
                    row.Land ||
                    "",

                status:
                    row.Status ||
                    "",

                raw:
                    row

            });

        });


        if (
            index < 0 ||
            index >= this.currentImages.length
        ) {

            index = 0;

        }


        this.currentIndex =
            index;


        this.openCurrentImage();

    }


    /* ==========================================================
       Aktuelles Bild öffnen
    ========================================================== */

    openCurrentImage() {

        if (
            !this.currentImages.length
        ) {

            return;

        }


        /*
         * Einen eventuell noch laufenden
         * Schließ-Timer abbrechen.
         */

        if (this.closeTimer) {

            clearTimeout(
                this.closeTimer
            );

            this.closeTimer = null;

        }


        this.isOpen = true;


        /*
         * Lightbox sichtbar machen.
         */

        this.dom.lightbox.style.display =
            "flex";


        requestAnimationFrame(() => {


            if (!this.isOpen) {

                return;

            }


            this.dom.lightbox.classList.add(
                "show"
            );

        });


        document.body.style.overflow =
            "hidden";


        console.log(
            "Lightbox sichtbar"
        );


        console.log(
            "Bild:",
            this.currentImages[
                this.currentIndex
            ].src
        );


        this.showImage();

    }

}


/* ==========================================================
   Globale Lightbox-Instanz
========================================================== */

const Lightbox =
    new WerksturboLightbox();


Lightbox.init();

Was Du jetzt machst

    Deine aktuelle lightbox.js vorher sichern – das hast Du ja bereits gemacht.

    Den kompletten bisherigen Inhalt von lightbox.js löschen.

    Den Code oben komplett einfügen.

    Als js/lightbox.js speichern.

    GitHub aktualisieren.

    Danach im Browser Strg + F5.

Danach bitte genau diese Reihenfolge testen

Register:

    Fahrzeugbild öffnen

    X schließen

    dasselbe Bild wieder öffnen

    anderes Fahrzeug öffnen

    Pfeil rechts

    Pfeil links

    ESC

Wissensdatenbank:

    Bild öffnen

    schließen

    wieder öffnen

    erneut schließen/öffnen

Noch keine weiteren Änderungen an script_v4.js vornehmen.

Der entscheidende Unterschied zur jetzigen Version ist checkDom(): In Deiner aktuellen Datei bricht bindEvents() ab, sobald irgendeines der DOM-Felder fehlt. Genau das wollen wir jetzt verhindern.

Wenn der Test erfolgreich ist, kümmern wir uns als Nächstes darum, die verbliebenen alten Lightbox-Funktionen aus script_v4.js kontrolliert zu entfernen.


