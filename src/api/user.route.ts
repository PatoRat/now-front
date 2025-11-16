import { URL_BACKEND } from "@/src/config";

const USER_ROUTE = URL_BACKEND + "/users";

const userRegister = async (
    nombre: string,
    email: string,
    password: string,
    numeroAvatar: number
) => {
    const response = await fetch(`${USER_ROUTE}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nombre: nombre,
            email: email,
            password: password,
            numeroAvatar: numeroAvatar
        })
    })

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
    }

    return await response.json();
};

const userLogin = async (email: string, password: string) => {
    const response = await fetch(`${USER_ROUTE}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, password: password })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
    }

    return await response.json();
}

const userGet = async (tokenAuth: string) => {
    // console.log("llegue al fetch", tokenAuth);

    const response = await fetch(`${USER_ROUTE}/my-user`, {
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

export { userGet, userLogin, userRegister };

