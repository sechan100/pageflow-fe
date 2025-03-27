

export const getImageDimensions = (url: string): Promise<{width: number, height: number}> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // 이미지가 로드되면 width와 height 정보를 반환
      resolve({
        width: img.width,
        height: img.height
      });
      // 메모리 누수 방지를 위해 URL 해제
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => {
      reject(new Error('이미지 로드 실패'));
      URL.revokeObjectURL(img.src);
    };
    // File 객체에서 URL 생성
    img.src = url;
  });
}