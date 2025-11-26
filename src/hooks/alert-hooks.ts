import { useState } from "react";


const useAlertState = () => {
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSuccess, setAlertSuccess] = useState(true);

    return ({
        visible: {
            get: () => alertVisible,
            set: (estado: boolean) => setAlertVisible(estado)
        },
        mensaje: {
            get: () => alertMessage,
            set: (mensaje: string) => setAlertMessage(mensaje)
        },
        success: {
            get: () => alertSuccess,
            set: (estado: boolean) => setAlertSuccess(estado)
        }
    });
}

export { useAlertState };
