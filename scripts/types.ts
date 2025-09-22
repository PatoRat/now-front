import { ImageSourcePropType } from "react-native";

type PostType = {
    id: string,
    titulo: string,
    descripcion: string,
    imagenes: ImageSourcePropType[]
};

export { PostType };

