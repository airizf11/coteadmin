// coteadmin/src/lib/printer/escpos.ts
import { formatRupiah } from "@/lib/format";

export class EscPos {
  private static encoder = new TextEncoder();

  static raw(...bytes: number[]): Uint8Array {
    return Uint8Array.from(bytes);
  }

  static text(text: string): Uint8Array {
    return this.encoder.encode(text);
  }

  static lf(lines = 1): Uint8Array {
    return Uint8Array.from(new Array(lines).fill(0x0a));
  }

  static init(): Uint8Array {
    // ESC @
    return this.raw(0x1b, 0x40);
  }

  static beep(): Uint8Array {
    // ESC B n t
    return this.raw(0x1b, 0x42, 3, 2);
  }

  static cut(): Uint8Array {
    // GS V A 0
    return this.raw(0x1d, 0x56, 0x41, 0x00);
  }

  static alignLeft(): Uint8Array {
    return this.raw(0x1b, 0x61, 0);
  }

  static alignCenter(): Uint8Array {
    return this.raw(0x1b, 0x61, 1);
  }

  static alignRight(): Uint8Array {
    return this.raw(0x1b, 0x61, 2);
  }

  static bold(on = true): Uint8Array {
    return this.raw(0x1b, 0x45, on ? 1 : 0);
  }

  static doubleSize(on = true): Uint8Array {
    return this.raw(0x1d, 0x21, on ? 0x11 : 0x00);
  }

  static concat(...parts: Uint8Array[]): Uint8Array {
    const total = parts.reduce((sum, part) => sum + part.length, 0);

    const result = new Uint8Array(total);

    let offset = 0;

    for (const part of parts) {
      result.set(part, offset);
      offset += part.length;
    }

    return result;
  }

  static qrCode(data: string, size = 6): Uint8Array {
    const dataBytes = this.encoder.encode(data);
    const storeLen = dataBytes.length + 3;
    const pL = storeLen & 0xff;
    const pH = (storeLen >> 8) & 0xff;

    return this.concat(
      this.raw(0x1d, 0x28, 0x6b, 0x04, 0x00, 0x31, 0x41, 0x32, 0x00), // model 2
      this.raw(0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x43, size), // ukuran modul
      this.raw(0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x45, 0x31), // error-correction level M
      this.raw(0x1d, 0x28, 0x6b, pL, pH, 0x31, 0x50, 0x30), // simpen data
      dataBytes,
      this.raw(0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x51, 0x30), // cetak
    );
  }

  static hello(): Uint8Array {
    return this.concat(this.init(), this.text("HELLO"), this.lf(2));
  }

  static testReceipt(): Uint8Array {
    return this.concat(
      this.init(),

      this.alignCenter(),
      this.bold(true),
      this.doubleSize(true),

      this.text("PRINT LAB"),

      this.doubleSize(false),
      this.bold(false),

      this.lf(),

      this.text("------------------------------"),
      this.lf(),

      this.alignLeft(),

      this.text("Web Bluetooth"),
      this.lf(),

      this.text("ESC/POS Test"),
      this.lf(),

      this.text("1234567890"),
      this.lf(),

      this.text("abcdefghijklmnopqrstuvwxyz"),
      this.lf(),

      this.text("------------------------------"),
      this.lf(4),
    );
  }

  static receipt(data: {
    business: {
      name: string;
      address: string | null;
      phone: string | null;
      footer: string;
    };
    order: {
      orderNumber: string;
      paymentMethod: string;
      paymentStatus: "PAID" | "UNPAID";
      createdAt: string;
      dueDate: string | null;
      handledByName: string | null;
      trackingToken?: string | null;
      note?: string | null;
      trackUrl?: string | null;
    };
    customer: { name: string | null };
    items: { itemName: string; qty: number; price: number; subtotal: number }[];
    summary: {
      subtotal: number;
      discountAmount: number;
      promoName: string | null;
      total: number;
    };
  }): Uint8Array {
    const WIDTH = 32;
    const line = (left: string, right: string) => {
      const maxLeftWidth = WIDTH - right.length - 1;
      const truncatedLeft =
        left.length > maxLeftWidth
          ? left.slice(0, Math.max(maxLeftWidth - 1, 0)) + "…"
          : left;
      const space = WIDTH - truncatedLeft.length - right.length;
      return truncatedLeft + " ".repeat(Math.max(space, 1)) + right;
    };
    const divider = "-".repeat(WIDTH);

    const parts: Uint8Array[] = [this.init()];

    // Nama bisnis — besar, tengah
    parts.push(this.alignCenter(), this.bold(true), this.doubleSize(true));
    parts.push(this.text(data.business.name), this.lf());
    parts.push(this.doubleSize(false), this.bold(false));

    // Detil usaha — kecil, tengah
    if (data.business.address)
      parts.push(this.text(data.business.address), this.lf());
    if (data.business.phone)
      parts.push(this.text(data.business.phone), this.lf());

    parts.push(this.alignLeft(), this.text(divider), this.lf());

    // Nama customer — besar, tengah
    if (data.customer.name) {
      parts.push(this.alignCenter(), this.bold(true), this.doubleSize(true));
      parts.push(this.text(data.customer.name), this.lf());
      parts.push(this.doubleSize(false), this.bold(false));
      parts.push(this.alignLeft(), this.text(divider), this.lf());
    }

    // No order, tanggal, estimasi selesai — kecil, justify
    parts.push(this.text(line("No. Order", data.order.orderNumber)), this.lf());
    if (data.order.trackingToken) {
      parts.push(
        this.text(line("Kode Lacak", data.order.trackingToken)),
        this.lf(),
      );
    }
    parts.push(
      this.text(
        line(
          "Tanggal",
          new Date(data.order.createdAt).toLocaleDateString("id-ID"),
        ),
      ),
      this.lf(),
    );
    if (data.order.dueDate) {
      parts.push(
        this.text(
          line(
            "Estimasi Selesai",
            new Date(data.order.dueDate).toLocaleDateString("id-ID"),
          ),
        ),
        this.lf(),
      );
    }
    parts.push(this.text(divider), this.lf());

    // Item
    for (const item of data.items) {
      parts.push(this.text(item.itemName), this.lf());
      parts.push(
        this.text(
          line(
            `${item.qty} x ${formatRupiah(item.price)}`,
            formatRupiah(item.subtotal),
          ),
        ),
        this.lf(),
      );
    }
    parts.push(this.text(divider), this.lf());

    if (data.order.note) {
      parts.push(this.text(divider), this.lf());
      parts.push(this.text(`Ket: ${data.order.note}`), this.lf());
    }

    // Total, bayar, status, kasir
    parts.push(
      this.text(line("Subtotal", formatRupiah(data.summary.subtotal))),
      this.lf(),
    );
    if (data.summary.discountAmount > 0) {
      const label =
        "Diskon" +
        (data.summary.promoName ? ` (${data.summary.promoName})` : "");
      parts.push(
        this.text(line(label, `-${formatRupiah(data.summary.discountAmount)}`)),
        this.lf(),
      );
    }
    parts.push(
      this.bold(true),
      this.text(line("Total", formatRupiah(data.summary.total))),
      this.lf(),
      this.bold(false),
    );
    parts.push(this.text(line("Bayar", data.order.paymentMethod)), this.lf());
    parts.push(this.bold(true));
    parts.push(
      this.text(
        line(
          "Status",
          data.order.paymentStatus === "PAID" ? "LUNAS" : "BELUM LUNAS",
        ),
      ),
      this.lf(),
    );
    parts.push(this.bold(false));
    if (data.order.handledByName) {
      parts.push(this.text(line("Kasir", data.order.handledByName)), this.lf());
    }

    // temp off
    /* if (data.order.trackUrl) {
      parts.push(this.text(divider), this.lf());
      parts.push(this.alignCenter());
      parts.push(this.qrCode(data.order.trackUrl));
      parts.push(this.lf());
      parts.push(this.alignLeft());
    } */

    parts.push(this.text(divider), this.lf());

    // Footer — multiline, tengah
    parts.push(this.alignCenter());
    for (const fLine of data.business.footer.split("\n")) {
      parts.push(this.text(fLine), this.lf());
    }
    parts.push(this.lf(2), this.cut());

    return this.concat(...parts);
  }
}
