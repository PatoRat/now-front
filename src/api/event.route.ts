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

    return evento.id;

}

const guardarImagenes = async (
    imagenes: ImageSourcePropType[],
    eventId: number,
    tokenAuth: string | null
) => {

    const formData = new FormData();

    formData.append("eventId", `${eventId}`);

    imagenes.forEach(img => {

        const uri: string = (img as { uri: string }).uri;
        const extension = uri.split(".").pop() || "jpg";

        const archivo = {
            uri,
            name: uri,
            type: `image/${extension}`,
        } as any;

        formData.append("imagenes", archivo);
    });

    const response = await fetch(`${URL_BACKEND}/images/save`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${tokenAuth}`
        },
        body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data?.error ?? "Error al subir imágenes");
    }

    console.log("Imagenes guardadas: ", data);
}

/*
// Solo de testeo
const guardarImagenesSoloUri = async (
    imagenes: ImageSourcePropType[],
    eventId: number,
    tokenAuth: string | null
) => {
    const response = await fetch(`${URL_BACKEND}/images/save-sin-archivos`, {
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
*/

export { eventCreate, guardarImagenes };

