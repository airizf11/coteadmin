// coteadmin/src/lib/whatsapp.ts
export function waLink(phone: string, text: string): string {
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.startsWith("0") ? "62" + digits.slice(1) : digits;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(text)}`;
}
