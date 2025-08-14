export interface FontPairing {
    name: string; // The display name for the font pairing, e.g., "Classic Elegant"
    fontTitle: string; // The CSS class for the title font
    fontText: string; // The CSS class for the body text font
}

export const fontPairings: FontPairing[] = [
    {
        name: "Classic Elegant",
        fontTitle: "font-great-vibes",
        fontText: "font-lato",
    },
    {
        name: "Bold Modern",
        fontTitle: "font-playfair-display",
        fontText: "font-montserrat",
    },
    {
        name: "Rustic & Personal",
        fontTitle: "font-cedarville-cursive",
        fontText: "font-roboto-condensed",
    },
    {
        name: "Luxurious & Formal",
        fontTitle: "font-cinzel",
        fontText: "font-raleway",
    },
    {
        name: "Clean Minimalist",
        fontTitle: "font-poppins",
        fontText: "font-open-sans",
    },
    {
        name: "Warm Traditional",
        fontTitle: "font-dancing-script",
        fontText: "font-merriweather",
    },
    {
        name: "Casual Modern",
        fontTitle: "font-pacifico",
        fontText: "font-quicksand",
    },
    {
        name: "Classic Serif",
        fontTitle: "font-lora",
        fontText: "font-roboto",
    },
    // --- 8 NEW FONT PAIRINGS ---
    {
        name: "Chic & Glamorous",
        fontTitle: "font-oswald",
        fontText: "font-eb-garamond",
    },
    {
        name: "Playful & Whimsical",
        fontTitle: "font-lobster",
        fontText: "font-cabin",
    },
    {
        name: "Vintage & Nostalgic",
        fontTitle: "font-abril-fatface",
        fontText: "font-work-sans",
    },
    {
        name: "Art Deco & Sophisticated",
        fontTitle: "font-josefin-sans",
        fontText: "font-lato", // Lato is versatile and pairs well
    },
    {
        name: "Soft & Romantic",
        fontTitle: "font-sacramento",
        fontText: "font-cardo",
    },
    {
        name: "Bold & Energetic",
        fontTitle: "font-anton",
        fontText: "font-roboto", // Roboto is a strong workhorse font
    },
    {
        name: "Handwritten & Intimate",
        fontTitle: "font-indie-flower",
        fontText: "font-muli",
    },
    {
        name: "Elegant Serif Duo",
        fontTitle: "font-cormorant-garamond",
        fontText: "font-source-sans-pro",
    },
];