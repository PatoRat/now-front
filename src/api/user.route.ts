import { URL_BACKEND } from "@/src/config";

const USER_PATH = URL_BACKEND + "/users";

const userRegister = async (
    nombre: string,
    email: string,
    contrasenia: string,
    numeroAvatar: number
) => {
    const response = await fetch(`${USER_PATH}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nombre: nombre,
            email: email,
            contrasenia: contrasenia,
            numeroAvatar: numeroAvatar
        })
    })

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
    }

    return await response.json();
};


const cambiarAvatar = async (tokenAuth: string | null, index: number) => {
    const response = await fetch(`${USER_PATH}/cambiar-avatar/${index}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${tokenAuth}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
    }

    return await response.json();
};

const userLogin = async (email: string, password: string) => {
    const response = await fetch(`${USER_PATH}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, password: password })
    });

    if (!response.ok) {
        // console.log("LLEGO HASTA ACA, user route");
        const error = await response.json();
        throw new Error(error.error);
    }

    return await response.json();
}

const userGet = async (tokenAuth: string) => {
    // console.log("llegue al fetch", tokenAuth);

    const response = await fetch(`${USER_PATH}/my-user`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${tokenAuth}`,
        }
    });

    if (!response.ok) {
        console.error(response.body);
        throw new Error("Error al obtener la información del usuario");
    }

    return await response.json();
}

export { cambiarAvatar, userGet, userLogin, userRegister };

