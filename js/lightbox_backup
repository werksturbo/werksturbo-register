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
