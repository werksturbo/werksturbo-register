/******************************************************************
 * Wissensdatenbank-Galerien
 ******************************************************************/

const KnowledgeGalleries = {

    kardantunnel: [

        {
            src: "../images/wissensdb/nr_kardantunnel_gross.jpg",
            title: "Nummer auf dem Kardantunnel"
        }

    ],

    karosseriefarbe: [

        {
            src: "../images/wissensdb/karosserie_farbe.jpg",
            title: "Karosseriefarbe"
        }

    ],

    motorcode: [

        {
            src: "../images/wissensdb/motorcode.jpg",
            title: "Motorcode PYN"
        }

    ]

};

/******************************************************************
 * Wissensdatenbank-Galerie öffnen
 ******************************************************************/

function openKnowledgeGallery(name, index = 0, title = "") {

    const gallery = KnowledgeGalleries[name];

    if (!gallery) {

        console.warn("Galerie nicht gefunden:", name);

        return;

    }

    console.log("Wissensdatenbank-Galerie:", name);
    console.log("Bilder:", gallery.length);

    Lightbox.registerGallery(name, gallery);

    Lightbox.openGallery(name, index);

}
