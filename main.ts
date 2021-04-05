/* Spacer
//
// Cleanup textual files from deprecated
// whitespace control characters. */

import fs from "fs";

const quickLookSizeDefault = 4096;
const tabSizeDefault = 2;

let tabSize = tabSizeDefault;
let force = false;

/* Examine first 4KB of each file for tabs and carriage returns
// and skip the file altogether in case of their absence.
// Avoids processing of already clean large files. */
function quickLook (data: string) {
  const size  = quickLookSizeDefault;
  const slice = data.substr (0, size);

  for (let idx = 0; idx !== slice.length; ++idx) {
    switch (slice.charCodeAt(idx)) {
    /* Comment out cases you would like
    // to be considered not binary-only triggers */
    case  0: case  1: case  2: case  3:
    case  4: case  5: case  6: case  7:
    case  8: case 11: case 12: case 14:
    case 15: case 16: case 17: case 18:
    case 19: case 20: case 21: case 22:
    case 23: case 24: case 25: case 26:
    case 27: case 28: case 29: case 30:
    case 31:case 127: return force; // ignore binary files
    }
  }

  return true;
}

/* Replace tabs with spaces and normalize EOLs */
function processFile (file: string) {
  const lf = String.fromCharCode (10);
  const space = String.fromCharCode (32);
  const spaces = space.repeat (tabSize);
  const data = fs.readFileSync (file, {encoding: "ascii"});
  let eol = true;
  let out = "";

  if (!quickLook (data)) {
    return; // nothing to do
  }

  for (let idx = 0; idx !== data.length; ++idx) {
    switch (data.charCodeAt(idx)) {
    case 9: // Tab
      if (eol) {
        out += spaces;
      } else {
        out += space;
      }
      break;
    case 13: // CR[LF]
      if (data.charCodeAt(idx + 1) === 10) {
        ++idx;
      }
      // fallthrough
    case 10: // LF
      eol  = true;
      out += lf;
      break;
    default:
      eol = false;
      out += data[idx];
      break;
    }
  }

  fs.writeFileSync (file, out, {encoding: "ascii"});
}

/* Process arguments */
interface parameter {
  value: string;
}

function getParameter (param: parameter, arg: string, isBool: boolean
, short: string, long?: string) {
  if (arg[0] === '-') {
    if (arg[1] !== '-' && arg.substr (1, short.length) === short
    && isBool !== (arg[short.length + 1] === '=')) {
      param.value = isBool ? "" : arg.slice (short.length + 2);
      return true;
    }

    if (long && arg[1] === '-' && arg.substr (2, long.length) === long
    && isBool !== (arg[long.length + 2] === '=')) {
      param.value = isBool ? "" : arg.slice (long.length + 3);
      return true;
    }
  }

  return false;
}

function main (args: string[]) {
  let param: parameter = {value: ""};

  for (const path of args) {
    if (getParameter (param, path, true, 'f', "force")) {
      force = true;
    } else if (getParameter (param, path, false, 't', "tab")) {
      tabSize = parseInt (param.value, 10);

      if (isNaN (tabSize)) {
        tabSize = tabSizeDefault;
      }
    } else if (!fs.existsSync (path)) {
      console.log (`Error: ${path} doesn't exist.`);
    } else processFile (path);
  }
}

main (process.argv.slice (2));
