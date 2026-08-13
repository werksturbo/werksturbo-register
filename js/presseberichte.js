"use strict";

/* ==========================================================
   PRESSEBERICHTE
   CSV → Tabelle
========================================================== */

const CSV_FILE = "../data/presseberichte.csv";

document.addEventListener("DOMContentLoaded", loadPresseberichte);


/* ==========================================================
   CSV laden
========================================================== */

function loadPresseberichte() {

    Papa.parse(CSV_FILE, {

        download: true,
        header: true,
        skipEmptyLines: true,

        complete: function(results) {

            console.log(
                "Presseberichte CSV geladen:",
                results.data
            );

            buildPresseberichteTable(results.data);
        },

        error: function(error) {

            console.error(
                "Fehler beim Laden der Presseberichte:",
                error
            );

        }

    });

}


/* ==========================================================
   Tabelle aufbauen
========================================================== */

function buildPresseberichteTable(data) {

    const tbody =
        document.querySelector("#dokumente-tabelle tbody");

    if (!tbody) {

        console.error(
            "Presseberichte: Tabellenkörper nicht gefunden."
        );

        return;
    }

    tbody.innerHTML = "";


    data.forEach(function(bericht) {

        const tr = document.createElement("tr");


/* --------------------------------------------------
   Bericht
-------------------------------------------------- */

const tdBericht =
    document.createElement("td");

tdBericht.textContent =
    bericht.Bericht || "";

tr.appendChild(tdBericht);


        /* --------------------------------------------------
           Kategorie
        -------------------------------------------------- */

        const tdKategorie =
            document.createElement("td");

        tdKategorie.textContent =
            bericht.Kategorie || "";

        tr.appendChild(tdKategorie);


        /* --------------------------------------------------
           Beschreibung
        -------------------------------------------------- */

        const tdBeschreibung =
            document.createElement("td");

        tdBeschreibung.textContent =
            bericht.Beschreibung || "";

        tr.appendChild(tdBeschreibung);


/* --------------------------------------------------
   Vorschau mit PDF-Link
-------------------------------------------------- */

const tdVorschau =
    document.createElement("td");

tdVorschau.style.textAlign = "center";


if (bericht.Thumbnail) {

    const img =
        document.createElement("img");

    img.src =
        "../images/presseberichte/" +
        bericht.Thumbnail;

    img.className = "thumbnail";

    img.alt =
        bericht.Bericht || "Pressebericht";


    /* ----------------------------------------------
       Thumbnail mit PDF verknüpfen
    ---------------------------------------------- */

    if (bericht.Link) {

        const link =
            document.createElement("a");

        link.href =
            bericht.Link;

        link.target =
            "_blank";

        link.rel =
            "noopener";


        link.appendChild(img);

        tdVorschau.appendChild(link);

    } else {

        tdVorschau.appendChild(img);

    }

}


        tr.appendChild(tdVorschau);


        tbody.appendChild(tr);

    });

}
