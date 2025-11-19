import { Filtros } from "@/scripts/types";
import { URL_BACKEND } from "@/src/config";
import { ImageSourcePropType } from "react-native";

const EVENT_PATH = URL_BACKEND + "/events";

const eventGet = async (
    filtros: Filtros,
    tokenAuth: string | null
) => {

    if (!filtros) {
        throw new Error("Sin ubicación");
    }

    const res = await fetch(`${EVENT_PATH}/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${tokenAuth}`
        },
        body: JSON.stringify({
            coordenadasUsuario: {
                latitud: filtros.ubicacion?.latitud,
                longitud: filtros.ubicacion?.longitud,
            }
        }),
    });

    if (!res.ok) throw new Error("Error al traer eventos filtrados");

    return res.json();
};


const eventCreate = async (
    titulo: string,
    descripcion: string,
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

    /* Hecho por IA, no daba más de pelear con la forma para guardar archivos
    en el back */
    imagenes.forEach((img, index) => {
        const fuente = img as { uri: string };
        const uri = fuente.uri;

        const match = /\.(\w+)$/.exec(uri);
        const extension = match ? match[1] : "jpg";

        const mimeType =
            extension === "png"
                ? "image/png"
                : extension === "jpg" || extension === "jpeg"
                    ? "image/jpeg"
                    : "application/octet-stream";

        const archivo: any = {
            uri,
            name: `imagen-${index}.${extension}`, // <- nombre limpio
            type: mimeType,
        };

        formData.append("imagenes", archivo);
    });
    /* Hasta acá */


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

export { eventCreate, eventGet, guardarImagenes };

