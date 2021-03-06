import {
  bold,
  yellow,
  white,
  green,
  red,
} from "https://deno.land/std/fmt/colors.ts";

class Log {
  static clear() {
    console.clear();
  }

  static info(message: string, tag: string = "") {
    const coloredTag = yellow(bold(`[${tag}]  `));
    const coloredMessage = white(message);
    console.log((coloredTag ? `${tag === "" ? "" : coloredTag}` : "") + coloredMessage);
  }

  static success(message: string, tag: string = "") {
    const coloredTag = yellow(bold(`[${tag}]  `));
    const coloredMessage = green(bold(message));
    console.log((coloredTag ? `${tag === "" ? "" : coloredTag}` : "") + coloredMessage);
  }

  static warning(message: string, tag: string = "") {
    const coloredTag = yellow(bold(`[${tag}]  `));
    const coloredMessage = yellow(bold(message));
    console.log((coloredTag ? `${tag === "" ? "" : coloredTag}` : "") + coloredMessage);
  }

  static error(message: string, tag: string = "") {
    const coloredTag = yellow(bold(`[${tag}]  `));
    const coloredMessage = red(bold(message));
    console.error((coloredTag ? `${tag === "" ? "" : coloredTag}` : "") + coloredMessage);
  }

  static async ask(question: string = ""): Promise<string> {
    await Deno.stdout.write(new TextEncoder().encode(question));
    const buf = new Uint8Array(1024);
    const n = <number>await Deno.stdin.read(buf);
    const input = new TextDecoder().decode(buf.subarray(0, n));
    return input;
  }
}

export default Log;
