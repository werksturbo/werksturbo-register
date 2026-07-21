document.addEventListener("DOMContentLoaded", function () {

    Papa.parse("../data/dokumente.csv", {

        download: true,
        header: true,
        delimiter: ";",
        skipEmptyLines: true,

        complete: function (results) {

            const tbody = document.querySelector("#dokumente-tabelle tbody");

            results.data.forEach(function (doc) {

                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${doc.Dokument}</td>
                    <td>${doc.Kategorie}</td>
                    <td>${doc.Beschreibung}</td>
                    <td>
                        <a href="../documents/prospekt_de.pdf" target="_blank">
                        <img src="../images/dokumente/prospekt_de.jpg"
                             class="thumb">
                    </a>
                    </td>
                `;

                tbody.appendChild(row);

            });

        },

        error: function (err) {

            console.error("Fehler beim Laden der CSV:", err);

        }

    });

});
