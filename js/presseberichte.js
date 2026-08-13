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
   Vorschau
-------------------------------------------------- */

const tdVorschau =
    document.createElement("td");

tdVorschau.style.textAlign = "center";


if (bericht.Thumbnail) {

    const img =
        document.createElement("img");

    img.src =
        "../images/presseberichte/" +
        encodeURIComponent(bericht.Thumbnail)
            .replace(/%2F/g, "/");

    img.className = "thumbnail";

    img.alt =
        bericht.Bericht || "Pressebericht";


    tdVorschau.appendChild(img);

}


        tr.appendChild(tdVorschau);


        tbody.appendChild(tr);

    });

}
