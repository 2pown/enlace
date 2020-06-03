import {
  bgBlue,
  red,
  bold,
  bgCyan,
  black,
  green,
  yellow,
  blue,
  white,
  bgRed,
  bgGreen,
} from "https://deno.land/std/fmt/colors.ts";

class Log {
  static info(message: string, tag: string = "") {
    const coloredTag = bgGreen(white(black(bold(` ${tag} `))));
    const coloredMessage = white(message);
    console.log((coloredTag ? `${coloredTag}  ` : "") + coloredMessage);
  }

  static warning(message: string) {
    const coloredMessage = yellow(bold(message));
    console.log(coloredMessage);
  }

  static error(message: string) {
    const coloredMessage = bgRed(bold(white(message)));
    console.log(coloredMessage);
  }
}

export default Log;