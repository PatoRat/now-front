export const URL_BACKEND = "http://192.168.0.104:3000";

/*
Tengo activado la herramienta de desarrollador en Android y hago la conexion por USB primero, para
hacer el tunel:
adb devices (chequeo que haya device)
adb reverse tcp:3000 tcp:3000
adb reverse tcp:8081 tcp:8081
adb reverse --list (para verificar que se haya hecho el puente)
Pero en caso de que ustedes necesiten, cambien la IP de localhost por la suya.
*/