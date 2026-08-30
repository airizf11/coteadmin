// coteadmin/src/components/printlab/PrintLab.tsx
"use client";

import { useMemo, useState } from "react";
import { BlePrinter, WriteOptions } from "@/lib/printer/ble";
import { EscPos } from "@/lib/printer/escpos";

const printer = new BlePrinter();

const chunkOptions = [20, 40, 64, 128, 244];

export default function PrintLab() {
  const [withResponse, setWithResponse] = useState(false);
  const [chunkSize, setChunkSize] = useState(244);
  const [delay, setDelay] = useState(0);

  const [text, setText] = useState("HELLO WORLD");
  const [hex, setHex] = useState("1B 40 48 45 4C 4C 4F 0A");

  const [logs, setLogs] = useState<string[]>([]);

  const options = useMemo<WriteOptions>(
    () => ({
      withResponse,
      chunkSize,
      delay,
    }),
    [withResponse, chunkSize, delay],
  );

  function log(msg: string) {
    console.log(msg);

    setLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ${msg}`,
    ]);
  }

  function clearLog() {
    setLogs([]);
  }

  async function connect() {
    try {
      await printer.connect(log);
      log("Connected.");
    } catch (e) {
      console.error(e);
      log(String(e));
    }
  }

  function disconnect() {
    printer.disconnect();
    log("Disconnected.");
  }

  async function send(bytes: Uint8Array) {
    try {
      await printer.write(bytes, options, log);
    } catch (e) {
      console.error(e);
      log(String(e));
    }
  }

  async function sendText() {
    await send(EscPos.text(text));
  }

  async function sendHex() {
    try {
      const bytes = Uint8Array.from(
        hex
          .trim()
          .split(/\s+/)
          .map((v) => parseInt(v, 16)),
      );

      await send(bytes);
    } catch {
      log("Invalid HEX");
    }
  }

  async function copyLog() {
    await navigator.clipboard.writeText(
      logs.join("\n"),
    );

    log("Log copied.");
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-6">

      <h1 className="text-3xl font-bold">
        PrintLab
      </h1>

      <div className="rounded border p-4">

        <div className="mb-3 flex gap-2">

          <button
            onClick={connect}
            className="rounded bg-blue-600 px-3 py-2 text-white"
          >
            Connect
          </button>

          <button
            onClick={disconnect}
            className="rounded bg-red-600 px-3 py-2 text-white"
          >
            Disconnect
          </button>

          <span className="ml-auto font-semibold">
            Status : {printer.isConnected ? "🟢 Connected" : "🔴 Disconnected"}
          </span>

        </div>

      </div>

      <div className="mb-4 grid gap-2 rounded border bg-gray-50 p-3 text-sm">
        <div><strong>Device</strong> : {printer.deviceName}</div>
        <div><strong>Service</strong> : {printer.serviceUuid}</div>
        <div><strong>Characteristic</strong> : {printer.characteristicUuid}</div>
        <div><strong>Write</strong> : {printer.writeSupported ? "✅" : "❌"}</div>
        <div><strong>Write No Response</strong> : {printer.writeWithoutResponseSupported ? "✅" : "❌"}</div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        <section className="rounded border p-4">

          <h2 className="mb-4 text-xl font-semibold">
            Write Options
          </h2>

          <label className="mb-3 flex items-center gap-2">

            <input
              type="checkbox"
              checked={withResponse}
              onChange={(e) =>
                setWithResponse(e.target.checked)
              }
            />

            writeWithResponse

          </label>

          <div className="mb-4">

            <label className="block mb-2">
              Chunk Size
            </label>

            <select
              value={chunkSize}
              onChange={(e) =>
                setChunkSize(Number(e.target.value))
              }
              className="w-full rounded border p-2"
            >
              {chunkOptions.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>

          </div>

          <div>

            <label className="block mb-2">
              Delay (ms)
            </label>

            <input
              type="number"
              value={delay}
              onChange={(e) =>
                setDelay(Number(e.target.value))
              }
              className="w-full rounded border p-2"
            />

          </div>

        </section>
                <section className="rounded border p-4">

          <h2 className="mb-4 text-xl font-semibold">
            Quick Tests
          </h2>

          <div className="grid grid-cols-2 gap-2">

            <button
              onClick={() => send(EscPos.init())}
              className="rounded bg-gray-800 px-3 py-2 text-white"
            >
              ESC @
            </button>

            <button
              onClick={() => send(EscPos.hello())}
              className="rounded bg-gray-800 px-3 py-2 text-white"
            >
              HELLO
            </button>

            <button
              onClick={() => send(EscPos.lf(1))}
              className="rounded bg-gray-800 px-3 py-2 text-white"
            >
              Feed x1
            </button>

            <button
              onClick={() => send(EscPos.lf(3))}
              className="rounded bg-gray-800 px-3 py-2 text-white"
            >
              Feed x3
            </button>

            <button
              onClick={() => send(EscPos.lf(5))}
              className="rounded bg-gray-800 px-3 py-2 text-white"
            >
              Feed x5
            </button>

            <button
              onClick={() => send(EscPos.testReceipt())}
              className="rounded bg-green-600 px-3 py-2 text-white"
            >
              Test Receipt
            </button>

          </div>

          <hr className="my-6" />

          <h2 className="mb-3 text-xl font-semibold">
            Manual Text
          </h2>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            className="mb-3 w-full rounded border p-2 font-mono"
          />

          <button
            onClick={sendText}
            className="rounded bg-blue-600 px-3 py-2 text-white"
          >
            Send Text
          </button>

          <hr className="my-6" />

          <h2 className="mb-3 text-xl font-semibold">
            Manual HEX
          </h2>

          <textarea
            value={hex}
            onChange={(e) => setHex(e.target.value)}
            rows={5}
            className="mb-3 w-full rounded border p-2 font-mono"
          />

          <button
            onClick={sendHex}
            className="rounded bg-purple-600 px-3 py-2 text-white"
          >
            Send HEX
          </button>

        </section>

      </div>

      <section className="rounded border p-4">

        <div className="mb-4 flex items-center">

          <h2 className="text-xl font-semibold">
            Live Log
          </h2>

          <div className="ml-auto flex gap-2">

            <button
              onClick={copyLog}
              className="rounded bg-blue-600 px-3 py-2 text-white"
            >
              Copy
            </button>

            <button
              onClick={clearLog}
              className="rounded bg-red-600 px-3 py-2 text-white"
            >
              Clear
            </button>

          </div>

        </div>

        <pre className="h-[450px] overflow-auto rounded bg-black p-4 text-sm text-green-400">

{logs.length === 0
  ? "No logs..."
  : logs.join("\n")}

        </pre>

      </section>

    </main>
  );
}