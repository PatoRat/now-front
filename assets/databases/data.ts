import { PostType } from "@/scripts/types";

const DATA: PostType[] = [
    {
        id: "1",
        titulo: "Suecia",
        descripcion: "Viajecito a Suecia",
        imagenes: []
    },
    {
        id: "2",
        titulo: "Sample1",
        descripcion: "SampleText1",
        imagenes: [
            require("@/assets/images/favicon.png")
        ]
    },
    {
        id: "3",
        titulo: "Sample2",
        descripcion: "SampleText2",
        imagenes: [
            require("@/assets/images/icon.png"),
            require("@/assets/images/react-logo.png")
        ]
    }
];

export default DATA;