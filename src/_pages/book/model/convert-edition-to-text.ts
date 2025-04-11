


export const convertEditionToText = (edition: number) => {
  switch (edition) {
    case 1:
      return "초판";
    case 2:
      return "개정판";
    default:
      return `개정 ${edition - 1}판`;
  }
}