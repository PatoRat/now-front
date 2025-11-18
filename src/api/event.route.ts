import { Ubicacion } from "@/scripts/types";
import { URL_BACKEND } from "@/src/config";
import { ImageSourcePropType } from "react-native";

const EVENT_PATH = URL_BACKEND + "/events";


const eventCreate = async (
    titulo: string,
    descripcion: string,
    imagenes: ImageSourcePropType[],
    fechaInicio: Date,
    fechaFin: Date,
    ubicacion: Ubicacion,
    tokenAuth: string | null
) => {
    const response = await fetch(`${EVENT_PATH}/create-my-event`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenAuth}`,
        },
        body: JSON.stringify({
            titulo: titulo,
            descripcion: descripcion,
            fechaInicio: fechaInicio,
            fechaFin: fechaFin,
            ubicacion: ubicacion
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
    }

    const evento = await response.json();
    console.log("Evento creado: ", evento);

    await guardarImagenes(imagenes, evento.id, tokenAuth);

}

const guardarImagenes = async (
    imagenes: ImageSourcePropType[],
    eventId: number,
    tokenAuth: string | null
) => {
    const response = await fetch(`${URL_BACKEND}/images/save-sin-archivos`, { // ver como hacer con archivos
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenAuth}`,
        },
        body: JSON.stringify({
            imagenes: imagenes,
            eventId: eventId
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
    }

    console.log("Imagen guardada: ", response.json());
}

export { eventCreate };

