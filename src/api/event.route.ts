import { PostType, Ubicacion } from "@/scripts/types";
import { URL_BACKEND } from "@/src/config";
import { ImageSourcePropType } from "react-native";

const EVENT_PATH = URL_BACKEND + "/events";

const getEvents = async (
    tokenAuth: string | null,
    location: { lat: number; lon: number },
    distanciaMin: number,
    distanciaMax: number,
    filtrosExtra?: {
        fechaInicio?: Date | null;
        fechaFin?: Date | null;
    }
): Promise<PostType[]> => {
    try {
        const body: any = {
            coordenadasUsuario: {
                latitud: location.lat,
                longitud: location.lon
            },
            rangoMin: distanciaMin,
            rangoMax: distanciaMax
        };

        // Agregamos filtros solo si existen
        if (filtrosExtra?.fechaInicio) {
            body.fechaInicio = filtrosExtra.fechaInicio.toISOString();
        }

        if (filtrosExtra?.fechaFin) {
            body.fechaFin = filtrosExtra.fechaFin.toISOString();
        }

        const res = await fetch(`${EVENT_PATH}/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(tokenAuth && { Authorization: `Bearer ${tokenAuth}` })
            },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            throw new Error(`Error ${res.status}`);
        }

        const data: PostType[] = await res.json();
        return data;

    } catch (error) {
        throw error;
    }
};


const agregarFavs = async (tokenAuth: string | null, id: string) => {

    try {
        const res = await fetch(`${EVENT_PATH}/add-fav`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenAuth}`,
            },
            body: JSON.stringify({
                eventId: Number(id),
            })
        });


        if (!res.ok) {
            // console.error("Error al crear favoritos:", res.status);
            throw new Error(`Error ${res.status}: `);
        }

        const favs = await res.json();

        return favs; // Array de eventos favoritos

    } catch (error) {
        // console.error("Error creating favoritos:", error);
        throw error;
    }
};


const quitarFavs = async (tokenAuth: string | null, id: string) => {

    try {
        const res = await fetch(`${EVENT_PATH}/rem-fav`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenAuth}`,
            },
            body: JSON.stringify({
                eventId: Number(id),
            })
        });


        if (!res.ok) {
            // console.error("Error al borrar favoritos:", res.status);
            throw new Error(`Error ${res.status}: `);
        }

        const favs = await res.json();

        return favs; // Array de eventos favoritos

    } catch (error) {
        // console.error("Error al borrar favoritos:", error);
        throw error;
    }
};

// const getLike = async (tokenAuth: string | null, id : string)=> {

//     try {
//         const res = await fetch(`${EVENT_PATH}/check-like/${id}`, {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${tokenAuth}`,
//             },
//         });


//         if (!res.ok) {
//             console.error("Error al buscar like:", res.status);
//             throw new Error(`Error ${res.status}: `);
//         }

//         const isLiked = await res.json();

//         return isLiked; // Array de eventos favoritos

//     } catch (error) {
//         console.error("Error al buscar like:", error);
//         throw error;
//     }
// };

const getFavs = async (tokenAuth: string | null) => {

    try {
        const res = await fetch(`${EVENT_PATH}/favs`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${tokenAuth}`,
            }
        });


        if (!res.ok) {
            // console.error("Error al cargar favoritos:", res.status);
            throw new Error(`Error ${res.status}: `);
        }

        const favs = await res.json();

        return favs; // Array de eventos favoritos

    } catch (error) {
        // console.error("Error fetching favoritos:", error);
        throw error;
    }
};

const getAllEvents = async (
    tokenAuth: string | null
): Promise<PostType[]> => {
    try {

        // console.log("Entraal getALlEvents del front???");
        const res = await fetch(`${EVENT_PATH}/all`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${tokenAuth}`,
            },
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        return data; // Array de eventos
    } catch (error) {
        // console.error("Error fetching events:", error);
        throw error;
    }
};



const getMyEvents = async (
    tokenAuth: string | null
) => {
    try {

        const res = await fetch(`${EVENT_PATH}/created-by-authorized-user`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${tokenAuth}`,
            },
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        return data; // Array de eventos
    } catch (error) {
        // console.error("Error fetching events:", error);
        throw error;
    }
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

const getMyFollowingIds = async (token: string) => {
       try {
    const res = await fetch(`${URL_BACKEND}/events/following`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    //console.log("Status:", res.status);

    if (!res.ok) {
      // Captura errores del backend
      const text = await res.text();
      throw new Error(`Error fetching following list: ${res.status} ${text}`);
    }

    const data = await res.json();
    //console.log("Body:", data);
    return data;

  } catch (err) {
    console.error("Error fetching following list", err);
    throw err; // importante para que el hook lo capture
  }
};
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

export { agregarFavs, eventCreate, getAllEvents, getEvents, getFavs, getMyEvents, guardarImagenes, quitarFavs, getMyFollowingIds };

