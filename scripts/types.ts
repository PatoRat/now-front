import { Theme } from "@react-navigation/native";
import { ImageSourcePropType } from "react-native";

type ThemeContextProps = {
    theme: Theme,
    setTheme: (theme: Theme) => void
};

type PostType = {
    id: string,
    titulo: string,
    descripcion: string,
    imagenes: ImageSourcePropType[]
};

type ImageSelectorButtonProps = {
    onSelect: React.Dispatch<React.SetStateAction<ImageSourcePropType[]>>;
};

type ThemeProviderProps = {
    children: React.ReactNode;
};

type ThemeColors = {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
}

export {
    ImageSelectorButtonProps,
    PostType, ThemeColors, ThemeContextProps,
    ThemeProviderProps
};

