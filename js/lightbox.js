/*!
 * ==========================================================
 * Werksturbo Lightbox
 * Version 4.1.0
 *
 * Ford Capri Werksturbo Register
 *
 * Autor:
 * Udo Schneider
 * ChatGPT
 *
 * ==========================================================
 */

"use strict";

console.log("LIGHTBOX VERSION Lauffähig");

class WerksturboLightbox {

    constructor(options = {}) {

        this.version = "4.0.0";

        this.options = Object.assign({

            preload: true,
            keyboard: true,
            closeOnOverlay: true,
            loop: false,
            animationSpeed: 250

        }, options);

        /* ------------------------------
           Galerieverwaltung
        ------------------------------ */

        this.galleries = new Map();

        this.currentGallery = null;

        this.currentImages = [];

        this.currentIndex = 0;

        /* ------------------------------
           Status
        ------------------------------ */

        this.isOpen = false;

        this.isLoading = false;

        /* ------------------------------
           DOM Elemente
        ------------------------------ */

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

/******************************************************************
 * Lightbox HTML erzeugen
 ******************************************************************/

createLightboxHTML() {

    // Bereits vorhanden?
    if (document.getElementById("lightbox")) {
        return;
    }

    document.body.insertAdjacentHTML("beforeend", `

<div id="lightbox">

    <span id="closeLightbox">&times;</span>

    <div id="lightboxLoader"></div>

    <button id="prevImage" class="lightboxNav">&#10094;</button>

    <img id="lightboxImage" alt="">

    <button id="nextImage" class="lightboxNav">&#10095;</button>

    <div id="lightboxInfo"></div>

    <div class="lightboxToolbar">

        <a id="downloadImage" download>
            Download
        </a>

    </div>

</div>

`);

}




    
    /* ===========================================
       Initialisierung
    =========================================== */

        init() {

        this.createLightboxHTML();    
        this.cacheDom();

        this.bindEvents();

        console.info(

            "Werksturbo Lightbox",

            this.version,

            "initialisiert"

        );

    }

    /* ===========================================
       DOM
    =========================================== */

    cacheDom() {

        this.dom.lightbox = document.getElementById("lightbox");

        this.dom.image = document.getElementById("lightboxImage");

        this.dom.loader = document.getElementById("lightboxLoader");

        this.dom.close = document.getElementById("closeLightbox");

        this.dom.previous = document.getElementById("prevImage");

        this.dom.next = document.getElementById("nextImage");

        this.dom.info = document.getElementById("lightboxInfo");

        this.dom.lnr = document.getElementById("lbLnr");

        this.dom.chassis = document.getElementById("lbChassis");

        this.dom.land = document.getElementById("lbLand");

        this.dom.status = document.getElementById("lbStatus");

        this.dom.counter = document.getElementById("lbCounter");

        this.dom.download = document.getElementById("downloadImage");

    }

        checkDom() {

        const missing = [];

        for (const key in this.dom) {

            if (this.dom[key] === null)

                missing.push(key);

        }

        if (missing.length) {

            console.error(

                "Lightbox: Fehlende HTML Elemente:",

                missing.join(", ")

            );

            return false;

        }

        return true;

    }

    /* ===========================================
       Events
    =========================================== */

        bindEvents() {

        if (!this.checkDom())

            return;

        this.dom.close.addEventListener("click", () => this.close());

        this.dom.previous.addEventListener("click", () => this.previous());

        this.dom.next.addEventListener("click", () => this.next());

        if (this.options.closeOnOverlay) {

            this.dom.lightbox.addEventListener("click", (event) => {

                if (event.target === this.dom.lightbox)

                    this.close();

            });

        }

        if (this.options.keyboard) {

            document.addEventListener("keydown", (event) => {

                if (!this.isOpen)

                    return;

                switch (event.key) {

                    case "Escape":

                        this.close();

                        break;

                    case "ArrowLeft":

                        this.previous();

                        break;

                    case "ArrowRight":

                        this.next();

                        break;

                }

            });

        }

    }

    /* ===========================================
       Galerieverwaltung
    =========================================== */

    registerGallery(name, images = []) {

        if (!name) {
            console.error("Lightbox: Galerie benötigt einen Namen.");
            return;
        }

        if (!Array.isArray(images)) {
            console.error("Lightbox: Bilder müssen als Array übergeben werden.");
            return;
        }

        this.galleries.set(name, images);

    }

    getGallery(name) {

        return this.galleries.get(name) || [];

    }

    /* ===========================================
       Lightbox öffnen / schließen
    =========================================== */

    open(galleryName, index = 0) {

        const gallery = this.getGallery(galleryName);

        if (gallery.length === 0) {

            console.warn(`Lightbox: Galerie "${galleryName}" ist leer oder existiert nicht.`);
            return;

        }

        this.currentGallery = galleryName;
        this.currentImages = gallery;
        this.currentIndex = index;

       this.openCurrentImage();
    }

    close() {

    this.isOpen = false;

    this.dom.lightbox.classList.remove("show");

    // Bild vollständig zurücksetzen
    this.dom.image.onload = null;
    this.dom.image.onerror = null;
    this.dom.image.removeAttribute("src");
    this.dom.image.style.display = "none";

    setTimeout(() => {
        this.dom.lightbox.style.display = "none";
    }, 250);

    document.body.style.overflow = "";

    this.currentGallery = null;
    this.currentImages = [];
    this.currentIndex = 0;

}
    toggle() {

        if (this.isOpen)
            this.close();
        else
            console.warn("Lightbox: toggle() kann nur verwendet werden, wenn bereits eine Galerie geöffnet wurde.");

    }

    /* ===========================================
       Navigation
    =========================================== */

    next() {

        if (!this.currentImages.length)
            return;

        if (this.currentIndex < this.currentImages.length - 1) {

            this.currentIndex++;

        } else if (this.options.loop) {

            this.currentIndex = 0;

        } else {

            return;

        }

        this.showImage();

    }

    previous() {

        if (!this.currentImages.length)
            return;

        if (this.currentIndex > 0) {

            this.currentIndex--;

        } else if (this.options.loop) {

            this.currentIndex = this.currentImages.length - 1;

        } else {

            return;

        }

        this.showImage();

    }

showImage() {

    if (!this.currentImages.length)
        return;

    const imageData = this.currentImages[this.currentIndex];

    if (!imageData)
        return;

    this.dom.image.style.display = "none";
    this.showLoader();

    // Alte Events entfernen
    this.dom.image.onload = null;
    this.dom.image.onerror = null;

    // Bild vollständig zurücksetzen
    this.dom.image.removeAttribute("src");

    this.dom.image.onload = () => {
        
        this.hideLoader();
        this.dom.image.style.display = "block";

        this.updateInfo(imageData);

        this.updateCounter();

        this.updateDownload(imageData);

        this.preload();

    };

    this.dom.image.onerror = () => {

        this.hideLoader();

        console.error("Bild konnte nicht geladen werden:", imageData.src);

    };

    // Browser einen Tick warten lassen
    requestAnimationFrame(() => {

        this.dom.image.src = imageData.src;

    });

}

    /* ===========================================
       Informationen aktualisieren
    =========================================== */

    updateInfo(imageData) {

        if (this.dom.lnr)
            this.dom.lnr.textContent = imageData.lnr || "-";

        if (this.dom.chassis)
            this.dom.chassis.textContent = imageData.chassis || "-";

        if (this.dom.land)
            this.dom.land.textContent = imageData.country || "-";

        if (this.dom.status)
            this.dom.status.textContent = imageData.status || "-";

    }


 /* ===========================================
       Modul 4b – Bildzähler
    =========================================== */


    updateCounter() {

        if (!this.dom.counter)
            return;

        this.dom.counter.textContent =
            (this.currentIndex + 1) + " / " + this.currentImages.length;

    }

 /* ===========================================
      Modul 4c – Downloadbutton
    =========================================== */

    updateDownload(imageData) {

        if (!this.dom.download)
            return;

        this.dom.download.href = imageData.src;

        this.dom.download.download = "";

    }

 /* ===========================================
     Modul 4d – Loader
    =========================================== */



    showLoader() {

        if (this.dom.loader)
            this.dom.loader.style.display = "block";

    }

    hideLoader() {

        if (this.dom.loader)
            this.dom.loader.style.display = "none";

    }


 /* ===========================================
     Modul 4e – Vorladen des nächsten Bildes
    =========================================== */


    preload() {

        if (!this.options.preload)
            return;

        const nextIndex = this.currentIndex + 1;

        if (nextIndex >= this.currentImages.length)
            return;

        const img = new Image();

        img.src = this.currentImages[nextIndex].src;

    }

  /* ===========================================
   Register-Adapter
=========================================== */

openRegisterRow(rows, index, photoColumn = "Foto") {

    if (!rows || rows.length === 0) {
        console.error("Lightbox: Keine Registerdaten vorhanden.");
        return;
    }

    this.currentGallery = "register";
    this.currentImages = [];

    rows.forEach(tabRow => {

        const row = tabRow.getData();

        this.currentImages.push({

            src: getImageLink(row[photoColumn]),

            title: row.Fahrzeug || row.Bezeichnung || "",

            lnr: row.Lnr || row.Nr || "",

            chassis: row.Chassis || "",

            country: row.Land || "",

            status: row.Status || "",

            raw: row

        });

    });

    this.currentIndex = index;

    this.openCurrentImage();

}

  /* ===========================================
       Neue Hilfsfunktion
    =========================================== */

    openCurrentImage() {

        if (!this.currentImages.length)
            return;

        this.isOpen = true;

        this.dom.lightbox.style.display = "flex";
        this.dom.lightbox.classList.add("show");

        console.log("Lightbox sichtbar");
        console.log("Bild:", this.currentImages[this.currentIndex].src);

        document.body.style.overflow = "hidden";

        this.showImage();

    }


}

const Lightbox = new WerksturboLightbox();
Lightbox.init();
