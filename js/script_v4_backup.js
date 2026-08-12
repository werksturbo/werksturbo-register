 /* Lightbox Navigation/******************************************************************
 *
 * CAPRI REGISTER
 * Version 4.4(letzte Löschungen)
 *
 * CSV + Tabulator + Lightbox
 *
 ******************************************************************/

"use strict";
console.log("=== CONTROL TEST SCRIPT_V4: Thumbnail 100");

/******************************************************************
 * Konfiguration
 *****************************************************************/

const CONFIG = {

    csvFile: "data/register.csv",

    pageSize: 25,

    thumbnailWidth: 90,

    thumbnailHeight: 56,

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

    console.log("Capri Register V4.4 ohne Lightbox gestartet");

    setStatus("CSV wird geladen ...");

    try {

        await loadCSV();

        updateCounter();

        buildTable();

        initSearch();

        initFilters();

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

            width: 100,

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

    // ---------------------------------------------------------
    // Galerie nach dem ersten Zeichnen aufbauen
    // ---------------------------------------------------------

    requestAnimationFrame(() => {

        buildRegisterGallery();

        APP.visibleData = APP.table.getData("active");

        updateResultCounter();

    });

    // ---------------------------------------------------------
    // Nach Seitenwechsel
    // ---------------------------------------------------------

    APP.table.on("pageLoaded", function () {

        buildRegisterGallery();

        APP.visibleData = APP.table.getData("active");

        updateResultCounter();

    });

    // ---------------------------------------------------------
    // Nach Filter
    // ---------------------------------------------------------

    APP.table.on("dataFiltered", function () {

        buildRegisterGallery();

        APP.visibleData = APP.table.getData("active");

        updateResultCounter();

    });

    // ---------------------------------------------------------
    // Nach Sortierung
    // ---------------------------------------------------------

    APP.table.on("dataSorted", function () {

        buildRegisterGallery();

        APP.visibleData = APP.table.getData("active");

    });

    // ---------------------------------------------------------
    // Nach Änderung der Daten
    // ---------------------------------------------------------

    APP.table.on("dataChanged", function () {

        buildRegisterGallery();

        APP.visibleData = APP.table.getData("active");

        updateResultCounter();

    });

}

/******************************************************************
 * Galerie für die Werksturbo-Lightbox aufbauen
 ******************************************************************/

function buildRegisterGallery() {

    if (!APP.table) {
        return;
    }

    const rows = APP.table.getRows("active");

    if (!rows || rows.length === 0) {

        Lightbox.registerGallery("register", []);

        return;

    }

    const gallery = [];

    rows.forEach(tabRow => {

        const row = tabRow.getData();

        const image = row[APP.photoColumn];

        if (!image) {
            return;
        }

        gallery.push({

            src: image,

            raw: row,

            lnr: row.Lnr || "",

            chassis: row.Chassis || "",

            country: row.Land || "",

            status: row.Status || ""

        });

    });

    Lightbox.registerGallery("register", gallery);

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
