const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47];
const JPEG_SIGNATURE = [0xff, 0xd8, 0xff];

function hasSignature(image: Buffer, signature: number[]) {
  return signature.every((byte, index) => image[index] === byte);
}

export function getImageMimeType(image: Buffer) {
  if (hasSignature(image, PNG_SIGNATURE)) {
    return 'image/png';
  }

  if (hasSignature(image, JPEG_SIGNATURE)) {
    return 'image/jpeg';
  }

  return null;
}
