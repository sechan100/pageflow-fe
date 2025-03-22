




type HSLA = {
  h?: number,
  s?: number,
  l?: number,
  a?: number
}

// background
const background = {
  h: 0,
  s: 0,
  l: 96
}

const primary = {
  h: 93,
  s: 30,
  l: 48
}

const descriptionHsla = "hsla(0, 0%, 0%, 0.7)"

export const STYLES = { 
  color: {
    // background
    background: `hsl(${background.h}, ${background.s}%, ${background.l}%)`,
    backgroundHsla: (hsla: HSLA) => `hsla(${background.h + (hsla.h ?? 0)}, ${background.s + (hsla.s ?? 0)}%, ${background.l + (hsla.l ?? 0)}%, ${hsla.a ?? 1})`,
    primary: `hsl(${primary.h}, ${primary.s}%, ${primary.l}%)`,
    primaryHsla: (hsla: HSLA) => `hsla(${primary.h + (hsla.h ?? 0)}, ${primary.s + (hsla.s ?? 0)}%, ${primary.l + (hsla.l ?? 0)}%, ${hsla.a ?? 1})`,
    secondary: "hsl(93, 33%, 60%)",
    description: descriptionHsla,
  },
  border: {
    solid: `1px solid hsla(0, 0%, 0%, 0.12)`,
  }
}