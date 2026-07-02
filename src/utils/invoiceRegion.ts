import type { Invoice, InvoiceParty, InvoiceRegion } from "../types/invoice";

export type InvoiceDateFormat = "european" | "us";

export interface InvoiceRegionConfig {
  id: InvoiceRegion;
  labelKey: "regionSpain" | "regionEu" | "regionUs" | "regionLatam" | "regionInternational";
  taxLabel: string;
  taxIdLabel: string;
  defaultCurrencySymbol: string;
  currencyEditable: boolean;
  dateFormat: InvoiceDateFormat;
}

export const DEFAULT_INVOICE_REGION: InvoiceRegion = "spain";

export const invoiceRegionConfigs: Record<InvoiceRegion, InvoiceRegionConfig> = {
  spain: {
    id: "spain",
    labelKey: "regionSpain",
    taxLabel: "IRPF",
    taxIdLabel: "NIF/NIE/CIF",
    defaultCurrencySymbol: "€",
    currencyEditable: false,
    dateFormat: "european",
  },
  eu: {
    id: "eu",
    labelKey: "regionEu",
    taxLabel: "IVA",
    taxIdLabel: "VAT Number",
    defaultCurrencySymbol: "€",
    currencyEditable: false,
    dateFormat: "european",
  },
  us: {
    id: "us",
    labelKey: "regionUs",
    taxLabel: "Sales Tax",
    taxIdLabel: "EIN / Tax ID",
    defaultCurrencySymbol: "$",
    currencyEditable: false,
    dateFormat: "us",
  },
  latam: {
    id: "latam",
    labelKey: "regionLatam",
    taxLabel: "IVA / Impuesto",
    taxIdLabel: "RFC / RUC / CUIT",
    defaultCurrencySymbol: "",
    currencyEditable: true,
    dateFormat: "european",
  },
  international: {
    id: "international",
    labelKey: "regionInternational",
    taxLabel: "Tax",
    taxIdLabel: "Tax ID",
    defaultCurrencySymbol: "",
    currencyEditable: true,
    dateFormat: "european",
  },
};

export const invoiceRegionOptions = Object.values(invoiceRegionConfigs);

export const getInvoiceRegion = (issuer?: Pick<InvoiceParty, "region">): InvoiceRegion => {
  const region = issuer?.region;
  return region && region in invoiceRegionConfigs ? region : DEFAULT_INVOICE_REGION;
};

export const getInvoiceRegionConfig = (issuer?: Pick<InvoiceParty, "region">) =>
  invoiceRegionConfigs[getInvoiceRegion(issuer)];

export const getInvoiceTaxLabel = (invoice: Pick<Invoice, "issuer">) => getInvoiceRegionConfig(invoice.issuer).taxLabel;

export const getInvoiceTaxIdLabel = (invoice: Pick<Invoice, "issuer">) => getInvoiceRegionConfig(invoice.issuer).taxIdLabel;

export const getInvoiceCurrencySymbol = (invoice: Pick<Invoice, "issuer">) => {
  const config = getInvoiceRegionConfig(invoice.issuer);
  if (!config.currencyEditable) return config.defaultCurrencySymbol;
  return invoice.issuer.currencySymbol?.trim() ?? "";
};

export const getInvoiceDateFormat = (invoice: Pick<Invoice, "issuer">) => getInvoiceRegionConfig(invoice.issuer).dateFormat;

export const normalizeIssuerRegion = (issuer: InvoiceParty): InvoiceParty => {
  const config = getInvoiceRegionConfig(issuer);
  return {
    ...issuer,
    region: config.id,
    currencySymbol: config.currencyEditable ? issuer.currencySymbol ?? "" : config.defaultCurrencySymbol,
  };
};
