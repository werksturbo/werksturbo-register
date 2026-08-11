"use strict";

/******************************************************************
 * WERKSTURBO WISSENSDATENBANK
 * Galerie-Verwaltung
 *
 * Zuständig ausschließlich für die Bilder der Wissensdatenbank.
 * Die eigentliche Lightbox-Funktion kommt aus lightbox.js.
 ******************************************************************/

console.log("Knowledge Gallery geladen");


/******************************************************************
 * Galerien der Wissensdatenbank
 ******************************************************************/

const KNOWLEDGE_GALLERIES = {

    /*
     * Nummer auf dem Kardantunnel
     */
    kardantunnel: [

        "../images/wissensdb/nr_kardantunnel_gross.jpg"

    ],


    /*
     * Karosseriefarbe bei Erstauslieferung
     *
     * Zwei Bilder:
     * 1. Silber
     * 2. Weiß
     */
    karosseriefarbe: [

        "../images/wissensdb/karosserie_farbe_gross_silber.jpg",

        "../images/wissensdb/karosserie_farbe_gross_weiss.jpg"

    ],


    /*
     * Motorcode PYN
     */
    motorcode: [

        "../images/wissensdb/motorcode_gross.jpg"

    ]

};


/******************************************************************
 * Galerien bei der zentralen Lightbox registrieren
 ******************************************************************/

Object.entries(KNOWLEDGE_GALLERIES).forEach(
    ([name, images]) => {

        Lightbox.registerGallery(
            name,
            images
        );

        console.log(
            "Knowledge-Galerie registriert:",
            name,
            images
        );

    }
);


/******************************************************************
 * Öffnen einer Wissensdatenbank-Galerie
 *
 * Diese Funktion bleibt zunächst bestehen, damit die vorhandenen
 * onclick-Aufrufe in der wissensdatenbank.html unverändert
 * weiter funktionieren.
 *
 * Die Funktion benutzt aber NICHT mehr die alte Lightbox aus
 * script_v4.js, sondern ausschließlich die neue zentrale Lightbox.
 ******************************************************************/

function openKnowledgeGallery(
    name,
    startIndex = 0,
    title = ""
) {

    if (!KNOWLEDGE_GALLERIES[name]) {

        console.warn(
            "Knowledge-Galerie nicht gefunden:",
            name
        );

        return;
    }


    console.log(
        "Knowledge-Galerie öffnen:",
        name,
        "Start:",
        startIndex,
        "Titel:",
        title
    );


    Lightbox.open(
        name,
        startIndex
    );

}
