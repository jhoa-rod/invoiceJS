import type { Invoice } from "../types/invoice";
import { cloneInvoice } from "./invoiceStorage";

const HASH_PREFIX = "#factura=";

const encodeBase64Url = (value: string) => {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};

const decodeBase64Url = (value: string) => {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

export const buildShareUrl = (invoice: Invoice) => {
  const invoiceCopy = cloneInvoice(invoice);
  const encoded = encodeBase64Url(JSON.stringify(invoiceCopy));
  return `${window.location.origin}${window.location.pathname}${window.location.search}${HASH_PREFIX}${encoded}`;
};

export const readSharedInvoiceFromHash = (hash: string): Invoice | null => {
  if (!hash.startsWith(HASH_PREFIX)) return null;
  try {
    const encoded = hash.slice(HASH_PREFIX.length);
    return JSON.parse(decodeBase64Url(encoded)) as Invoice;
  } catch {
    return null;
  }
};

export const copyText = async (text: string) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
};
