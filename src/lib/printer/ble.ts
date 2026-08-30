// coteadmin/src/lib/printer/ble.ts
export interface WriteOptions {
  withResponse?: boolean;
  chunkSize?: number;
  delay?: number;
}

export class BlePrinter {
  private device: BluetoothDevice | null = null;
  private server: BluetoothRemoteGATTServer | null = null;
  private service: BluetoothRemoteGATTService | null = null;
  private characteristic: BluetoothRemoteGATTCharacteristic | null = null;

  private connected = false;

  get isConnected() {
    return this.connected;
  }

  get deviceName() {
    return this.device?.name ?? "(Unknown)";
  }

  get serviceUuid() {
    return this.service?.uuid ?? "-";
  }

  get characteristicUuid() {
    return this.characteristic?.uuid ?? "-";
  }

  get writeSupported() {
    return this.characteristic?.properties.write ?? false;
  }

  get writeWithoutResponseSupported() {
    return this.characteristic?.properties.writeWithoutResponse ?? false;
  }

  async connect(log?: (msg: string) => void) {
    if (!("bluetooth" in navigator)) {
      throw new Error("Web Bluetooth is not supported in this browser.");
    }

    log?.("Requesting Bluetooth device...");

    this.device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [0xff00, "49535343-fe7d-4ae5-8fa9-9fafd205e455"],
    });

    log?.(`Selected: ${this.device.name ?? "(Unknown)"}`);

    if (!this.device.gatt) {
      throw new Error("Device doesn't support GATT.");
    }

    this.server = await this.device.gatt.connect();

    log?.("GATT Connected");

    // ---------- FF00 ----------
    try {
      this.service = await this.server.getPrimaryService(0xff00);

      log?.("Service FF00 found");

      const characteristics = await this.service.getCharacteristics();

      for (const c of characteristics) {
        log?.(
          `Characteristic: ${c.uuid} | write=${c.properties.write} | writeNoResp=${c.properties.writeWithoutResponse}`,
        );

        if (c.properties.write || c.properties.writeWithoutResponse) {
          this.characteristic = c;
          this.connected = true;

          log?.("Using this characteristic.");
          return;
        }
      }

      throw new Error("No writable characteristic in FF00.");
    } catch (err) {
      log?.(`FF00 failed: ${String(err)}`);
    }

    // ---------- ISSC ----------
    this.service = await this.server.getPrimaryService(
      "49535343-fe7d-4ae5-8fa9-9fafd205e455",
    );

    log?.("ISSC service found");

    const characteristics = await this.service.getCharacteristics();

    for (const c of characteristics) {
      log?.(
        `Characteristic: ${c.uuid} | write=${c.properties.write} | writeNoResp=${c.properties.writeWithoutResponse}`,
      );

      if (c.properties.write || c.properties.writeWithoutResponse) {
        this.characteristic = c;
        this.connected = true;

        log?.("Using this characteristic.");
        return;
      }
    }

    throw new Error("No writable characteristic found.");
  }

  async write(
    bytes: Uint8Array,
    options: WriteOptions = {},
    log?: (msg: string) => void,
  ) {
    if (!this.characteristic) {
      throw new Error("Printer not connected.");
    }

    const { withResponse = false, chunkSize = 244, delay = 0 } = options;

    log?.(
      `Sending ${bytes.length} bytes | chunk=${chunkSize} | ${
        withResponse ? "writeWithResponse" : "writeWithoutResponse"
      }`,
    );

    for (let offset = 0; offset < bytes.length; offset += chunkSize) {
      const chunk = bytes.slice(offset, offset + chunkSize);

      if (withResponse) {
        await this.characteristic.writeValueWithResponse(chunk);
      } else {
        await this.characteristic.writeValueWithoutResponse(chunk);
      }

      log?.(
        `Chunk ${offset}-${offset + chunk.length - 1} (${chunk.length} bytes)`,
      );

      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    log?.("Done");
  }

  async writeText(
    text: string,
    options: WriteOptions = {},
    log?: (msg: string) => void,
  ) {
    const encoder = new TextEncoder();

    await this.write(encoder.encode(text), options, log);
  }

  disconnect() {
    this.device?.gatt?.disconnect();

    this.connected = false;
    this.service = null;
    this.characteristic = null;
  }
}
