export const cropImageViaCoordinate = (pointX, pointY, cropWidth, cropHeight, textboxId) => {
    const imageElement = document.getElementById(`imageCanvas`) as HTMLCanvasElement;

    // create a temporary canvas sized to the cropped size
    const canvas1 = document.getElementById('cropCanvas') as HTMLCanvasElement;
    const ctx1 = canvas1.getContext('2d');
    canvas1.width = cropWidth;
    canvas1.height = cropHeight;
    // use the extended from of drawImage to draw the
    // cropped area to the temp canvas
    if (ctx1) {
        ctx1?.drawImage(imageElement, pointX, pointY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
    }

    return canvas1.toDataURL();
}