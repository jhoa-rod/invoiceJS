import type { Invoice } from "../types/invoice";

export const sampleInvoices: Invoice[] = [
  {
    id: "sample-2-26",
    shareId: "factura-2-26-domingo-asistencia",
    invoiceNumber: "2/26",
    date: "2026-05-31",
    period: "Servicios de guardias y preventiva realizados durante mayo de 2026",
    irpfRate: 15,
    status: "enviada",
    issuer: {
      name: "Profesional Sanitario Autónomo",
      taxId: "Y1234567X",
      address: "Calle Balmes 123, 2º 1ª",
      cityPostal: "08008 Barcelona",
      email: "facturacion@profesional.example",
      iban: "ES12 2100 0418 4502 0005 1332",
    },
    client: {
      name: "Domingo Asistencia SLU",
      taxId: "B61036000",
      address: "Avenida Diagonal 640",
      cityPostal: "08017 Barcelona",
    },
    lines: [
      {
        id: "line-guardias-85",
        description: "GUARDIAS 8,5 HORAS",
        dates: "DÍAS 11, 14, 30",
        hours: "8,5",
        amount: 705,
      },
      {
        id: "line-guardias-17",
        description: "GUARDIAS 17 HORAS",
        dates: "DÍA 01, 08, 09, 15",
        hours: "17",
        amount: 1880,
      },
      {
        id: "line-guardias-255",
        description: "GUARDIAS 25,5 HORAS",
        dates: "DÍA 22, 25",
        hours: "25,5",
        amount: 1410,
      },
      {
        id: "line-preventiva-10",
        description: "PREVENTIVA 10 HORAS",
        dates: "DÍA 30",
        hours: "10",
        amount: 270,
      },
    ],
    createdAt: "2026-05-31T10:00:00.000Z",
    updatedAt: "2026-05-31T10:00:00.000Z",
  },
];
