// Módulo singleton para guardar el token JWT en memoria.
// No es un React Context — se importa directamente donde se necesite.
let _token = null;

export const setAuthToken = (token) => { _token = token; };
export const getAuthToken = () => _token;
