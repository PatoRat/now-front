import { PostType } from "@/scripts/types";

const DATA: PostType[] = [
  {
    id: "1",
    titulo: "Afrika",
    descripcion: "Hoy, noche del mes en Afrika Club, no te la pierdas",
    imagenes: [
      { uri: "https://lh3.googleusercontent.com/p/AF1QipOvl8JNluUE7VeTDIs_od4sW2ZY6C330W-KHBwy=s680-w680-h510-rw" },
      { uri: "https://lh3.googleusercontent.com/gps-cs-s/AC9h4noydtcHzXNvnQ0dJ33yWeUPA2N5bUXKWj_gnZb5vYLNMmB-XUxaWrvFzLUt6LTYDdQW2-tmsrL9w79QZOnURvDLHxRiDb2pNPYb9M63K14lK1_A_gZ968FbTwTcu4or_UAd1lMl=s680-w680-h510-rw" }
    ],
    fechaInicio: new Date("2025-11-01T22:30:00"),
    fechaFin: new Date("2025-11-02T02:00:00"),
    ubicacion: {
      latitude: -34.6037,
      longitude: -58.3816,
      direccion: "Junín 1787, Buenos Aires"
    }
  },
  {
    id: "2",
    titulo: "Jazz&Funk Jam",
    descripcion: "En Plaza Vicente Lopez va a ver un Jam de musica a las 19:45 hs\nSumate!!",
    imagenes: [
      { uri: "https://lh3.googleusercontent.com/gps-cs-s/AC9h4nrDZb3XmcJpxqFPwkM3xQ4btq8RxDs-AvmhZdToNKyWw4LOcKup8ZRlDkK86I1kZoWZhbk1rKsXdRF4m_txUmjAwBuAm0up0k9AqSnebi8bHp0oELyWGkLRuc12uC5KRXJ3wgmjdg=s680-w680-h510-rw" }
    ],
    fechaInicio: new Date("2025-11-02T19:45:00"),
    fechaFin: new Date("2025-11-02T23:00:00"),
    ubicacion: {
      latitude: -34.5880,
      longitude: -58.4030,
      direccion: "Plaza Vicente López, Buenos Aires"
    }
  },
  {
    id: "3",
    titulo: "Siga la Vaca, Super promo",
    descripcion: "Hoy durante todo el día, promo especial 15% de descuento en Siga la Vaca, cualquier medio de pago!!",
    imagenes: [],
    fechaInicio: new Date("2025-11-03T10:00:00"),
    fechaFin: new Date("2025-11-03T22:00:00"),
    ubicacion: {
      latitude: -34.6158,
      longitude: -58.4333,
      direccion: "Av. Cabildo 500, Buenos Aires"
    }
  }
];

export default DATA;
