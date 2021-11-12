/**
 * Function to generate a image Data URI from a string
 * By default always high error resistance rate of ~ 30%
 * @param {String} link
 */
export default (link) =>
  import("qrcode").then((QRCode) =>
    QRCode.toDataURL(link, { errorCorrectionLevel: "H" })
  );
