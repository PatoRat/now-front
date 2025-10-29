import { Theme } from "@react-navigation/native";

const BamvDark: Theme = {
    dark: true,
    colors: {
        primary: "#EBFF46",     // acento fuerte (botones/links)
        background: "#0F0F10",  // fondo app
        card: "#1A1D21",        // superficies (drawer, headers)
        text: "#ECEFF4",        // texto principal
        border: "#2B2F36",      // bordes/dividers
        notification: "#C892FF" // badges/toasts
    },
    fonts: {
        regular: { fontFamily: "NimbusSansL-Regular", fontWeight: "400" },
        medium: { fontFamily: "NimbusSansL-Medium", fontWeight: "500" },
        bold: { fontFamily: "NimbusSansL-Bold", fontWeight: "700" },
        heavy: {fontFamily: "NimbusSansL-Heavy", fontWeight: "800" }
    }

};

const BamvLight: Theme = {
    dark: false,
    colors: {
        primary: "#111111",
        background: "#FAFAFB",
        card: "#FFFFFF",
        text: "#121212",
        border: "#E6E8EC",
        notification: "#EBFF46"
    },
    fonts: {
        regular: { fontFamily: "NimbusSansL-Regular", fontWeight: "400" },
        medium: { fontFamily: "NimbusSansL-Medium", fontWeight: "500" },
        bold: { fontFamily: "NimbusSansL-Bold", fontWeight: "700" },
        heavy: {fontFamily: "NimbusSansL-Heavy", fontWeight: "800" }
    }
};

export { BamvDark, BamvLight };

