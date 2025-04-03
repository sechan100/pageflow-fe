import { Area } from "react-easy-crop";

const quality = 0.8;

type Args = {
  src: string;
  cropArea: Area;
  file: File;
}
export const createCroppedImageFile = async ({
  src,
  cropArea,
  file,
}: Args): Promise<File> => {
  // 이미지 요소 생성
  const image = new Image();

  // 이미지 로드 프로미스
  const imageLoadPromise = new Promise<void>((resolve) => {
    image.onload = () => resolve();
    image.src = src;
  });

  // 이미지 로드 대기
  await imageLoadPromise;

  // 캔버스 생성 및 설정
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context를 생성할 수 없습니다.');
  }

  // 크롭 영역 크기로 캔버스 설정
  canvas.width = cropArea.width;
  canvas.height = cropArea.height;

  // 크롭 영역을 캔버스에 그리기
  ctx.drawImage(
    image,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    cropArea.width,
    cropArea.height
  );

  // 캔버스를 Blob으로 변환
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        throw new Error('Blob을 생성할 수 없습니다.');
      }
    }, file.type, quality);
  });

  // Blob을 File 객체로 변환
  return new File([blob], file.name, { type: file.type });
};