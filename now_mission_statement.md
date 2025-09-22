# Proyecto "now" - App Móvil para Eventos

## Introducción

**now** es una app móvil (React Native + Expo Go) para descubrir **eventos cercanos** de forma rápida y simple: clubes de lectura, debates, intercambios de idiomas, música en vivo, after office, etc. 

La experiencia es **user-facing**: quien abre la app ve un feed de eventos ordenados por cercanía/horario, puede filtrar lo esencial y entrar al detalle de cada evento.

### Enfoque de esta entrega

En esta entrega de la materia nos enfocamos en:

- **Explorar y consultar eventos** desde la app
- **UX mínima pero fluida** (navegación clara, carga y fail fast)
- **Sin consola de locales/empresas** por ahora; quedará para una iteración futura
- **Backend a definir**: inicialmente trabajaremos con datos mockeados/locales y, si el tiempo alcanza, conectaremos una **fuente simple** (API muy básica o un servicio mínimo) para obtener eventos reales

## Objetivos de desarrollo (alcance del cuatrimestre)

### Navegación y Estructura
- **Navegación básica**: Tabs (por ejemplo: *Inicio* / *Favoritos*) y Stack para *Detalle de evento*, podríamos incluir una seccion lateral tipo Drawer

### Feed de Eventos
- **Lista con tarjetas** que muestren título, categoría, distancia aproximada, horario y lugar
- Primero con **mock data** local; luego conector a API si llegamos

### Sistema de Filtros
- **Filtros esenciales** por **categoría** y **fecha** (hoy/mañana/esta semana)
- Si el tiempo alcanza: **distancia** aproximada

### Detalle de Evento
- Descripción breve, dirección, horario, ubicación aproximada
- Botón para abrir un enlace externo (p. ej. Instagram, web o WhatsApp del organizador)

### Funcionalidad de Favoritos
- **Persistencia local** con **AsyncStorage**
- Guardar/retirar eventos como favoritos, persistiendo entre reinicios

### Geolocalización
- **Solicitar permiso de ubicación** para ordenar por cercanía
- **Fallback**: si falla o se rechaza, permitir elegir barrio/ubicación manual simple

### Manejo de Estados
- **Indicadores de carga** y *empty states* ("no hay eventos")
- **Mensajes de error** comprensibles con opción de **reintentar**

### Implementación Técnica
- **Ejecución en Expo Go** 
- **README** corto (instalación, ejecución y troubleshooting básico)

### Backend (Placeholder)
- Mantener una **interfaz clara** (por ejemplo, `getEvents(params)`) para que el origen de datos pueda cambiar de mock a API sin romper la UI
- Si el tiempo alcanza, exponer un **endpoint** muy simple para `/events`

### Otros marcos de implementacion posibles
- Si el tiempo alcanza, tambien hacer uso de la API de Maps para tener un mapa visible, con los eventos como pines
