/* ==========================================================
   Pressefotos
   CSV + Thumbnail-Tabelle
========================================================== */

"use strict";

const CONFIG = {
    csvFile: "../data/pressefotos.csv",
    thumbnailPath: "../images/pressefotos/",
    imagePath: "../data/Pressefotos/"
};

document.addEventListener("DOMContentLoaded", init);


/* ==========================================================
   Initialisierung
========================================================== */

async function init() {

    try {

        const response = await fetch(CONFIG.csvFile);

        if (!response.ok) {
            throw new Error("CSV konnte nicht geladen werden.");
        }

        const csvText = await response.text();

        Papa.parse(csvText, {

            header: true,
            delimiter: ";",
            skipEmptyLines: true,

            complete: function(results) {

                buildTable(results.data);

            },

            error: function(error) {

                console.error(
                    "Fehler beim Lesen der CSV:",
                    error
                );

            }

        });

    } catch (error) {

        console.error(
            "Fehler beim Laden der Pressefotos:",
            error
        );

    }

}


/* ==========================================================
   Tabelle aufbauen
========================================================== */

function buildTable(data) {

    const tbody =
        document.querySelector(
            "#pressefotos-tabelle tbody"
        );

    if (!tbody) return;

    tbody.innerHTML = "";


    data.forEach(function(item) {

        const row =
            document.createElement("tr");


        /* --------------------------------------------------
           Pressefoto / Thumbnail
        -------------------------------------------------- */

        const fotoCell =
            document.createElement("td");

        const imageLink =
            document.createElement("a");

        imageLink.href =
            CONFIG.imagePath +
            encodeURIComponent(item.Bild);

        imageLink.target = "_blank";
        imageLink.rel = "noopener";


        const thumbnail =
            document.createElement("img");

        thumbnail.src =
            CONFIG.thumbnailPath +
            encodeURIComponent(item.Thumbnail);

        thumbnail.alt =
            item.Foto || "Pressefoto";

        thumbnail.loading = "lazy";

        thumbnail.classList.add("pressefoto-thumbnail");


        imageLink.appendChild(thumbnail);

        fotoCell.appendChild(imageLink);


        /* --------------------------------------------------
           Kategorie
        -------------------------------------------------- */

        const categoryCell =
            document.createElement("td");

        categoryCell.textContent =
            item.Kategorie || "";


        /* --------------------------------------------------
           Beschreibung
        -------------------------------------------------- */

        const descriptionCell =
            document.createElement("td");

        descriptionCell.textContent =
            item.Beschreibung || "";


        /* --------------------------------------------------
           Zeile zusammensetzen
        -------------------------------------------------- */

        row.appendChild(fotoCell);

        row.appendChild(categoryCell);

        row.appendChild(descriptionCell);

        tbody.appendChild(row);

    });

}
