import { useContext } from "react";
import { AuthContext } from "../components/context-provider/AuthContext";

const useAuth = () => useContext(AuthContext);

export { useAuth };
