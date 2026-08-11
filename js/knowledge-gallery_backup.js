/******************************************************************
 * Wissensdatenbank – Bildgalerien
 ******************************************************************/

const KnowledgeGalleries = {

    /* ----------------------------------------------------------
       Nummer auf dem Kardantunnel
    ---------------------------------------------------------- */

    kardantunnel: [

        {
            src: "../images/wissensdb/nr_kardantunnel_gross.jpg",
            title: "Nummer auf dem Kardantunnel"
        }

    ],


    /* ----------------------------------------------------------
       Karosseriefarbe bei Erstauslieferung
    ---------------------------------------------------------- */

    karosseriefarbe: [

        {
            src: "../images/wissensdb/farbe00.jpg",
            title: "Karosseriefarbe – Übersicht"
        },

        {
            src: "../images/wissensdb/farbe01.jpg",
            title: "Karosseriefarbe – Bild 2"
        },

        {
            src: "../images/wissensdb/farbe02.jpg",
            title: "Karosseriefarbe – Bild 3"
        },

        {
            src: "../images/wissensdb/farbe03.jpg",
            title: "Karosseriefarbe – Bild 4"
        }

    ],


    /* ----------------------------------------------------------
       Motorcode PYN
    ---------------------------------------------------------- */

    motorcode: [

        {
            src: "../images/wissensdb/motorcode_gross.jpg",
            title: "Motorcode PYN"
        }

    ]

};


/******************************************************************
 * Wissensdatenbank-Galerie öffnen
 ******************************************************************/

function openKnowledgeGallery(
    name,
    index = 0,
    title = ""
) {

    const gallery = KnowledgeGalleries[name];

    if (!gallery) {

        console.warn(
            "Wissensdatenbank-Galerie nicht gefunden:",
            name
        );

        return;
    }


    console.log(
        "Wissensdatenbank-Galerie:",
        name
    );

    console.log(
        "Bilder:",
        gallery.length
    );


    /*
     * Galerie bei der zentralen Lightbox registrieren
     */

    Lightbox.registerGallery(
        name,
        gallery
    );


    /*
     * Zentrale Lightbox öffnen
     *
     * WICHTIG:
     * Die aktuelle lightbox.js verwendet
     * Lightbox.open() und nicht openGallery().
     */

    Lightbox.open(
        name,
        index
    );

}
