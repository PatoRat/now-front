import { useContext } from "react";
import { ThemeContext } from "../components/context-provider/ThemeContext";

const useTheme = () => useContext(ThemeContext);

export { useTheme };
