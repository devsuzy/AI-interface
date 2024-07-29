import UAParser from "ua-parser-js";

const uap = new UAParser();

function getOS() {
  return uap?.getOS()?.name?.toLowerCase();
}

function getBrowser() {
  return uap?.getBrowser()?.name?.toLowerCase();
}

export { getOS, getBrowser };
