/******************************************************************
 *
 * CAPRI REGISTER
 * Version 4.4
 *
 * CSV + Tabulator + Lightbox
 *
 ******************************************************************/

"use strict";

/******************************************************************
 * Konfiguration
 ******************************************************************/

const CONFIG = {

    csvFile: "data/register.csv",

    pageSize: 25,

    thumbnailWidth: 120,

    thumbnailHeight: 80,

    lightboxBackground: "#000"

};

/******************************************************************
 * Spalten-Konfiguration
 ******************************************************************/

const COLUMNS = {

    photo: "Foto Link",

    number: "Lnr",

    chassis: "Chassis",

    owner: "Eigentuemer",

    country: "Land",

    status: "Status",

    year: "Jahr",

    month: "Monat",

    notes: "Anmerkungen"

};

/******************************************************************
 * Globale Anwendung
 ******************************************************************/

const APP = {

    table: null,

    data: [],

    headers: [],

    photoColumn: null,

    currentImage: "",

    currentRow: null,

    currentIndex: 0,

    visibleData: [],

    filters: {

        search: "",
        country: "",
        status: "",
        year: ""

    },

    gallery: {

        active: false,

        images: [],

        index: 0,

        title: ""

    }

};

/******************************************************************
 * Programmstart
 ******************************************************************/

document.addEventListener("DOMContentLoaded", init);

/******************************************************************
 * Initialisierung
 ******************************************************************/

async function init() {

    console.log("Capri Register V4.4 gestartet");

    setStatus("CSV wird geladen ...");

    try {

        await loadCSV();

        updateCounter();

        buildTable();

        initSearch();

        initFilters();

        initLightbox();

        updateResultCounter();

        APP.visibleData = APP.table.getData("active");

        setStatus("CSV erfolgreich geladen");

    }

    catch (error) {

        console.error(error);

        setStatus("Fehler beim Laden");

    }

}
/******************************************************************
 * Status
 ******************************************************************/

function setStatus(text){

    const obj = document.getElementById("csvStatus");

    if(obj){

        obj.textContent = text;

    }

}

/******************************************************************
 * Fahrzeugzähler
 ******************************************************************/

function updateCounter(){

    const obj = document.getElementById("vehicleCount");

    if(obj){

        obj.textContent = APP.data.length + " Fahrzeuge";

    }

}

/******************************************************************
 * Trefferzähler aktualisieren
 ******************************************************************/


function updateResultCounter() {

    const counter = document.getElementById("resultCounter");

    if (!counter || !APP.table) return;

    const visible = APP.table.getDataCount("active");
    const total = APP.data.length;

    // --------------------------------------------------------
    // Keine Filter aktiv
    // --------------------------------------------------------

    const noFilters =
        APP.filters.search === "" &&
        APP.filters.country === "" &&
        APP.filters.status === "" &&
        APP.filters.year === "";

    if (noFilters) {

        counter.textContent = `${total} Fahrzeuge`;

        counter.style.background = "rgba(40,167,69,.25)";
        counter.style.borderColor = "rgba(40,167,69,.55)";
        counter.style.color = "#ffffff";

        return;

    }

    // --------------------------------------------------------
    // Keine Treffer
    // --------------------------------------------------------

    if (visible === 0) {

        counter.textContent = `Keine Treffer`;

        counter.style.background = "rgba(220,53,69,.25)";
        counter.style.borderColor = "rgba(220,53,69,.60)";
        counter.style.color = "#ffffff";

        return;

    }

    // --------------------------------------------------------
    // Filter aktiv
    // --------------------------------------------------------

    counter.textContent = `${visible} von ${total} Fahrzeuge`;

    counter.style.background = "rgba(13,110,253,.25)";
    counter.style.borderColor = "rgba(13,110,253,.60)";
    counter.style.color = "#ffffff";

}

/******************************************************************
 * Live-Suche
 ******************************************************************/

function initSearch() {

    const input = document.getElementById("globalSearch");

    if (!input) return;

    input.addEventListener("input", function () {

        // Suchbegriff speichern
        APP.filters.search = this.value.trim();

        // Alle Filter neu anwenden
        applyFilters();

    });

}

/******************************************************************
 * Filter initialisieren
 ******************************************************************/


function initFilters() {

    // ------------------------------------------------------------
    // Dropdowns mit Werten füllen
    // ------------------------------------------------------------

    fillSelect("countryFilter", COLUMNS.country);

    fillSelect("statusFilter", COLUMNS.status);

    fillSelect("yearFilter", COLUMNS.year);

    // ------------------------------------------------------------
    // Land
    // ------------------------------------------------------------

    document
        .getElementById("countryFilter")
        .addEventListener("change", function () {

            APP.filters.country = this.value;

            applyFilters();

        });

    // ------------------------------------------------------------
    // Status
    // ------------------------------------------------------------

    document
        .getElementById("statusFilter")
        .addEventListener("change", function () {

            APP.filters.status = this.value;

            applyFilters();

        });

    // ------------------------------------------------------------
    // Baujahr
    // ------------------------------------------------------------

    document
        .getElementById("yearFilter")
        .addEventListener("change", function () {

            APP.filters.year = this.value;

            applyFilters();

        });

    // ------------------------------------------------------------
    // Filter zurücksetzen
    // ------------------------------------------------------------

    document
        .getElementById("resetFilters")
        .addEventListener("click", resetFilters);

}


/******************************************************************
 * Select füllen
 ******************************************************************/

function fillSelect(selectId,column){

    const select=document.getElementById(selectId);

    if(!select) return;

    const values=[...new Set(

        APP.data
            .map(r=>r[column])
            .filter(v=>v)

    )].sort();

    values.forEach(value=>{

        const option=document.createElement("option");

        option.value=value;

        option.textContent=value;

        select.appendChild(option);

    });

}


/******************************************************************
 * Filter anwenden
 ******************************************************************/

function applyFilters() {

    APP.table.setFilter(function (row) {

        // Volltextsuche
        if (APP.filters.search) {

            const text = JSON.stringify(row).toLowerCase();

            const words = APP.filters.search
                .toLowerCase()
                .split(/\s+/)
                .filter(word => word.length > 0);

            for (const word of words) {

                if (!text.includes(word)) {
                    return false;
                }

            }

        }

        // Land
        if (APP.filters.country &&
            row[COLUMNS.country] !== APP.filters.country) {

            return false;

        }

        // Status
        if (APP.filters.status &&
            row[COLUMNS.status] !== APP.filters.status) {

            return false;

        }

        // Baujahr
        if (APP.filters.year &&
            row[COLUMNS.year] !== APP.filters.year) {

            return false;

        }

        return true;

    });

}


/******************************************************************
 * Filter zurücksetzen
 ******************************************************************/

function resetFilters() {

    // APP zurücksetzen
    APP.filters.search = "";
    APP.filters.country = "";
    APP.filters.status = "";
    APP.filters.year = "";

    // Suchfeld leeren
    document.getElementById("globalSearch").value = "";

    // Dropdowns zurücksetzen
    document.getElementById("countryFilter").value = "";
    document.getElementById("statusFilter").value = "";
    document.getElementById("yearFilter").value = "";

    // Tabelle neu filtern
    applyFilters();

}

/******************************************************************
 * CSV laden
 ******************************************************************/

async function loadCSV() {

    return new Promise((resolve, reject) => {

        Papa.parse(CONFIG.csvFile, {

            download: true,

            header: true,

            delimiter: ";",

            skipEmptyLines: true,

            complete(results) {

                if (!results.data || results.data.length === 0) {

                    reject("CSV enthält keine Daten.");

                    return;

                }

                // BOM entfernen und Spaltennamen bereinigen
                APP.headers = results.meta.fields.map(header =>
                    header.replace(/^\uFEFF/, "").trim()
                );

                APP.data = results.data;

                // Foto-Spalte automatisch erkennen
                APP.photoColumn = APP.headers.find(header =>
                    header.toLowerCase().includes("foto")
                );

                console.log("CSV geladen:", APP.data.length, "Datensätze");

                resolve();

            },

            error(error) {

                reject(error);

            }

        });

    });

}

/******************************************************************
 * Spalten erzeugen
 ******************************************************************/

function buildColumns() {

    const columns = [];

    // ---------------------------------------------------------
    // 1. Foto-Spalte
    // ---------------------------------------------------------

    if (APP.photoColumn) {

        columns.push({

            title: "Foto",

            field: APP.photoColumn,

            width: 150,

            frozen: true,

            headerSort: false,

            hozAlign: "center",

            formatter: photoFormatter,

            cellClick(e, cell) {

                const rows = APP.table.getRows("active");
                const index = rows.indexOf(cell.getRow());

                if (index < 0) {
                    return;
                }

                APP.currentIndex = index;
                APP.currentRow = cell.getRow();

                Lightbox.openRegisterRow(
                    rows,
                    index,
                    APP.photoColumn
                );

            }

        });

    }

    // ---------------------------------------------------------
    // Restliche Spalten
    // ---------------------------------------------------------

    APP.headers.forEach(header => {

        if (header === APP.photoColumn) {
            return;
        }

        const h = header.trim().toLowerCase();

        let width = 140;

        switch (h) {

            case "lnr":
                width = 70;
                break;

            case "chassis":
                width = 120;
                break;

            case "monat":
                width = 80;
                break;

            case "jahr":
                width = 70;
                break;

            case "land":
                width = 120;
                break;

            case "status":
                width = 110;
                break;

            case "ort":
                width = 220;
                break;

            case "anmerkungen":
                width = 320;
                break;

        }

        columns.push({

            title: header,

            field: header,

            width: width,

            headerSort: true,

            frozen:
                header === COLUMNS.number ||
                header === COLUMNS.chassis,

            formatter:

                header.trim().toLowerCase() === COLUMNS.status.toLowerCase()
                    ? statusFormatter

                : header.trim().toLowerCase() === COLUMNS.owner.toLowerCase()
                    ? ownerFormatter

                : undefined

        });

    });

    return columns;

}
/******************************************************************
 * Eigentümer-Formatter
 ******************************************************************/

function ownerFormatter(cell){

    const value = (cell.getValue() || "").trim();

    if(value === ""){

        return "";

    }

    return `
        <span class="owner-private">
          🔒 Vertraulich
        </span>
    `;

}

/******************************************************************
 * Status-Formatter
 ******************************************************************/

function statusFormatter(cell) {

    const value = cell.getValue() || "";

    // CSS-Klasse aus dem Status erzeugen
    const cssClass = "status-" +
        value
            .toLowerCase()
            .replace(/\//g, "-")
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");

    return `
        <span class="status-badge ${cssClass}">
            ${value}
        </span>
    `;

}


/******************************************************************
 * Tabelle erzeugen
 ******************************************************************/

function buildTable() {

    // Alte Tabelle entfernen
    if (APP.table) {
        APP.table.destroy();
        APP.table = null;
    }

    // Neue Tabelle erzeugen
    APP.table = new Tabulator("#registerTable", {

        data: APP.data,

        columns: buildColumns(),

        layout: "fitDataTable",

        rowHeight: 60,

        pagination: true,

        paginationSize: CONFIG.pageSize,

        movableColumns: true,

        resizableColumns: true,

        responsiveLayout: false,

        placeholder: "Keine Fahrzeuge gefunden"

    });

    // Galerie erst nach dem ersten Rendern aufbauen
    requestAnimationFrame(() => {

        buildRegisterGallery();

    });

    // Nach jedem Seitenwechsel Galerie aktualisieren
    APP.table.on("pageLoaded", function () {

        buildRegisterGallery();

        updateResultCounter();

    });

    // Nach jeder Datenänderung Galerie aktualisieren
    APP.table.on("dataFiltered", function () {

        buildRegisterGallery();

        updateResultCounter();

    });

    // Nach jeder Sortierung Galerie aktualisieren
    APP.table.on("dataSorted", function () {

        buildRegisterGallery();

    });

}

/******************************************************************
 * Galerie für die Werksturbo-Lightbox aufbauen
 ******************************************************************/

function buildRegisterGallery() {
console.log("buildRegisterGallery gestartet");
    
	if (!APP.table) {
        return;
    }
	

	
    const rows = APP.table.getRows("active");

    const gallery = [];

    rows.forEach(tabRow => {

        const row = tabRow.getData();

        // Nur Fahrzeuge mit Bild übernehmen
        if (!row[APP.photoColumn]) {
            return;
        }

        gallery.push({

            src: row[APP.photoColumn],

            lnr: row.Lnr || "",

            chassis: row.Chassis || "",

            country: row.Land || "",

            status: row.Status || "",

            raw: row

        });

    });

    Lightbox.registerGallery("register", gallery);

    console.log("Register-Galerie aufgebaut:", gallery.length, "Bilder");

	console.log("Register-Galerie aufgebaut:", gallery.length);

}




/******************************************************************
 * Lightbox initialisieren
 ******************************************************************/

function initLightbox() {

    const lightbox = document.getElementById("lightbox");
    const closeBtn = document.getElementById("closeLightbox");
    const prevBtn = document.getElementById("prevImage");
    const nextBtn = document.getElementById("nextImage");

    if (!lightbox || !closeBtn) {

        console.warn("Lightbox-Elemente nicht gefunden.");
        return;

    }

    // ----------------------------------------------------------
    // Schließen über X
    // ----------------------------------------------------------

    closeBtn.addEventListener("click", closeLightbox);


    // ----------------------------------------------------------
    // Schließen über Hintergrund
    // ----------------------------------------------------------

    lightbox.addEventListener("click", function (e) {

        if (e.target === lightbox) {
            closeLightbox();
        }

    });


    // ----------------------------------------------------------
    // Linker Pfeil
    // ----------------------------------------------------------

    if (prevBtn) {

        prevBtn.addEventListener("click", function (e) {

            e.stopPropagation();

            navigateLightbox(-1);

        });

    }


    // ----------------------------------------------------------
    // Rechter Pfeil
    // ----------------------------------------------------------

    if (nextBtn) {

        nextBtn.addEventListener("click", function (e) {

            e.stopPropagation();

            navigateLightbox(1);

        });

    }


    // ----------------------------------------------------------
    // Tastatur
    // ----------------------------------------------------------

    document.addEventListener("keydown", function (e) {

        if (!isLightboxOpen()) {
            return;
        }

        if (e.key === "Escape") {

            closeLightbox();

        } else if (e.key === "ArrowLeft") {

            e.preventDefault();
            navigateLightbox(-1);

        } else if (e.key === "ArrowRight") {

            e.preventDefault();
            navigateLightbox(1);

        }

    });

}


/******************************************************************
 * Prüfen, ob Lightbox geöffnet ist
 ******************************************************************/

function isLightboxOpen() {

    const lightbox = document.getElementById("lightbox");

    if (!lightbox) {
        return false;
    }

    return lightbox.classList.contains("show") ||
           lightbox.style.display === "flex";

}


/******************************************************************
 * Lightbox Navigation
 ******************************************************************/

function navigateLightbox(direction) {

    // ----------------------------------------------------------
    // Wissensdatenbank-Galerie
    // ----------------------------------------------------------

    if (APP.gallery.active) {

        const images = APP.gallery.images;

        if (!images || images.length === 0) {
            return;
        }

        APP.gallery.index += direction;

        // Zyklische Navigation
        if (APP.gallery.index < 0) {
            APP.gallery.index = images.length - 1;
        }

        if (APP.gallery.index >= images.length) {
            APP.gallery.index = 0;
        }

        const item = images[APP.gallery.index];

        // Galerie kann Strings oder Objekte enthalten
        if (typeof item === "string") {

            openLightbox(item);

        } else if (item && item.src) {

            openLightbox(item.src);

            if (item.raw) {
                updateLightboxInfo(item.raw);
            }

        }

        return;
    }


    // ----------------------------------------------------------
    // Fahrzeugregister
    // ----------------------------------------------------------

    showVehicle(APP.currentIndex + direction);

}


/******************************************************************
 * Wissensdatenbank-Galerien
 ******************************************************************/

const KNOWLEDGE_GALLERIES = {

    motorcode: [

        "../images/wissensdb/motorcode_gross.jpg"

    ]

    // Weitere Galerien bleiben hier wie bisher bestehen.

};


/******************************************************************
 * Galerie anhand ihres Namens öffnen
 ******************************************************************/

function openKnowledgeGallery(name, startIndex = 0, title = "") {

    const images = KNOWLEDGE_GALLERIES[name];

    if (!images) {

        console.warn("Galerie nicht gefunden:", name);
        return;

    }

    openGallery(images, startIndex, title);

}


/******************************************************************
 * Galerie öffnen
 ******************************************************************/

function openGallery(images, startIndex = 0, title = "") {

    if (!images || images.length === 0) {
        return;
    }

    // Index absichern
    if (startIndex < 0) {
        startIndex = 0;
    }

    if (startIndex >= images.length) {
        startIndex = images.length - 1;
    }

    APP.gallery.active = true;
    APP.gallery.images = images;
    APP.gallery.index = startIndex;
    APP.gallery.title = title;

    const item = images[startIndex];

    if (typeof item === "string") {

        openLightbox(item);

    } else if (item && item.src) {

        openLightbox(item.src);

        if (item.raw) {
            updateLightboxInfo(item.raw);
        }

    }

}


/******************************************************************
 * Lightbox öffnen
 ******************************************************************/

function openLightbox(url) {

    if (!url) {
        return;
    }

    const lightbox = document.getElementById("lightbox");
    const image = document.getElementById("lightboxImage");
    const loader = document.getElementById("lightboxLoader");
    const download = document.getElementById("downloadImage");

    if (!lightbox || !image) {
        return;
    }

    // Loader anzeigen
    if (loader) {
        loader.style.display = "block";
    }

    // Bild zunächst ausblenden
    image.style.display = "none";


    image.onload = () => {

        if (loader) {
            loader.style.display = "none";
        }

        image.style.display = "block";
        lightbox.style.display = "flex";

        requestAnimationFrame(() => {

            lightbox.classList.add("show");

        });

    };


    image.onerror = () => {

        if (loader) {
            loader.style.display = "none";
        }

        console.error(
            "Bild konnte nicht geladen werden:",
            image.src
        );

    };


    // ----------------------------------------------------------
    // Bildquelle bestimmen
    // ----------------------------------------------------------

    let imageSource;

    if (APP.gallery.active) {

        // Wissensdatenbank-Galerie:
        // fertiger Bildpfad
        imageSource = url;

    } else {

        // Fahrzeugregister:
        // CSV-Bildpfad umwandeln
        imageSource = getImageLink(url);

    }


    // ----------------------------------------------------------
    // Bild laden
    // ----------------------------------------------------------

    image.src = imageSource;


    // ----------------------------------------------------------
    // Download-Link
    // ----------------------------------------------------------

    if (download) {
        download.href = imageSource;
    }

}


/******************************************************************
 * Lightbox schließen
 ******************************************************************/

function closeLightbox() {

    const lightbox = document.getElementById("lightbox");
    const image = document.getElementById("lightboxImage");
    const loader = document.getElementById("lightboxLoader");

    if (!lightbox || !image) {
        return;
    }

    image.onload = null;
    image.onerror = null;

    if (loader) {
        loader.style.display = "none";
    }


    // ----------------------------------------------------------
    // Galerie-Modus zurücksetzen
    // ----------------------------------------------------------

    APP.gallery.active = false;
    APP.gallery.images = [];
    APP.gallery.index = 0;
    APP.gallery.title = "";


    // ----------------------------------------------------------
    // Lightbox schließen
    // ----------------------------------------------------------

    lightbox.classList.remove("show");

    setTimeout(() => {

        lightbox.style.display = "none";

        image.removeAttribute("src");
        image.style.display = "none";

    }, 250);

}


/******************************************************************
 * Fahrzeug in der Lightbox anzeigen
 ******************************************************************/

function showVehicle(index) {

    if (!APP.table) {
        return;
    }

    const rows = APP.table.getRows("active");

    if (!rows || rows.length === 0) {
        return;
    }


    // ----------------------------------------------------------
    // Zyklische Navigation
    // ----------------------------------------------------------

    if (index < 0) {
        index = rows.length - 1;
    }

    if (index >= rows.length) {
        index = 0;
    }


    // ----------------------------------------------------------
    // Aktuelles Fahrzeug merken
    // ----------------------------------------------------------

    APP.currentIndex = index;
    APP.currentRow = rows[index];


    // ----------------------------------------------------------
    // Werksturbo-Lightbox
    // ----------------------------------------------------------

    Lightbox.openRegisterRow(
        rows,
        index,
        APP.photoColumn
    );

}


/******************************************************************
 * Lightbox Informationen
 ******************************************************************/

function updateLightboxInfo(row) {

    if (!row) {
        return;
    }

    const lnr = document.getElementById("lbLnr");
    const chassis = document.getElementById("lbChassis");
    const land = document.getElementById("lbLand");
    const status = document.getElementById("lbStatus");
    const counter = document.getElementById("lbCounter");


    if (lnr) {
        lnr.textContent = row["Lnr"] || "";
    }

    if (chassis) {
        chassis.textContent = row["Chassis"] || "";
    }

    if (land) {
        land.textContent = row["Land"] || "";
    }

    if (status) {
        status.textContent = row["Status"] || "";
    }


    // ----------------------------------------------------------
    // Zähler auf Basis der aktuell sichtbaren Fahrzeuge
    // ----------------------------------------------------------

    if (counter && APP.table) {

        const rows = APP.table.getRows("active");

        counter.textContent =
            (APP.currentIndex + 1) + " / " + rows.length;

    }

}

/******************************************************************
 * Thumbnail
 ******************************************************************/

function photoFormatter(cell) {

    const url = cell.getValue();

    if (!url) return "";

    return `
        <img
            class="thumbnail"
            src="${getThumbnailLink(url)}"
         style="
    		width:${CONFIG.thumbnailWidth}px;
    		height:${CONFIG.thumbnailHeight}px;
    		object-fit:contain;
    		object-position:center;
    		background:#ffffff;
    		border-radius:6px;
    		padding:2px;
    		cursor:pointer;
    		display:block;
    		margin:auto;
">
    `;

}

/******************************************************************
 * Bild-Formatter
 ******************************************************************/

function photoFormatter(cell){

    const url = cell.getValue();

    if(!url) return "";

    return `
        <img
            class="thumbnail"
            src="${getThumbnailLink(url)}"
            style="
                width:${CONFIG.thumbnailWidth}px;
                height:${CONFIG.thumbnailHeight}px;
                object-fit:contain;
                background:white;
                border-radius:6px;
                cursor:pointer;
                padding:2px;
            ">
    `;

}

/******************************************************************
 * Thumbnail-Link erzeugen
 ******************************************************************/

function getThumbnailLink(url){

    if(!url) return "";

    try{

        const u = new URL(url);

        const id = u.searchParams.get("id");

        if(id){

            return `https://drive.google.com/thumbnail?id=${id}&sz=w300`;

        }

    }catch(error){

        console.warn("Thumbnail-Link konnte nicht erzeugt werden.", error);

    }

    return url;

}


/******************************************************************
 * Originalbild für Lightbox
 ******************************************************************/

function getImageLink(url){

    if(!url) return "";

    try{

        const u = new URL(url);

        const id = u.searchParams.get("id");

        if(id){

            // Großes Bild (ca. 4000 px)
            return `https://drive.google.com/thumbnail?id=${id}&sz=s4000`;

        }

    }catch(error){

        console.error(error);

    }

    return url;

}



