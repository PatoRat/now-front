import { URL_BACKEND } from "@/src/config";

const REPORT_PATH = URL_BACKEND + "/reports";

const crearReporte = async (
    tokenAuth: string | null,
    eventId: number,
    motivo: string,
    descripcion: string,
    fecha: Date,
    estado: "Pendiente" | "Aprobado" | "Denegado"
) => {
    console.log("\n\n\###LLEGO HASTA crearReporte Route Front###n\n");
    const response = await fetch(`${REPORT_PATH}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenAuth}`,
        },
        body: JSON.stringify({
            eventId: eventId,
            descripcion: descripcion,
            fecha: fecha,
            motivo: motivo,
            estado: estado
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
    }

    const reporte = await response.json();
    console.log("Reporte creado: ", reporte);

    return reporte.id;
}

export {
    crearReporte
};

