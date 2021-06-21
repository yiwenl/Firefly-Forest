// index.js

export { saveImage } from "./saveImage";
export { saveJson } from "./saveJson";
export { resize } from "./resizeCanavs";
export { getDateString } from "./getDateString";

export const iOS = (function() {
  return (
    [
      "iPad Simulator",
      "iPhone Simulator",
      "iPod Simulator",
      "iPad",
      "iPhone",
      "iPod",
    ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  );
})();
