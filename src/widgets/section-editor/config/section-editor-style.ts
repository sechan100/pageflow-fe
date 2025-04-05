import { SxProps } from "@mui/material"


const sectionEditorStyle: SxProps = {
  // Editor Root
  "[data-lexical-editor='true']": {
    outline: "none", // focus되었을 때 파란색 테두리 제거
    lineHeight: 2,
  },

  // Paragraph
  ".pf-p": {
    m: 0,
    textAlign: 'justify',
  },

  "h1, h2, h3, h4, h5, h6": {
    my: 1,
  },

  ".pf-image": {
    display: 'inline-block',
  },

  ".image-position-full": {
    display: 'block',
    textAlign: 'center',
    margin: '1em 0 1em 0',
  },

  ".image-position-left": {
    float: "left",
    margin: "1em 1em 0 0",
  },

  ".image-position-right": {
    float: "right",
    margin: "1em 0 0 1em",
  },
}

export {
  sectionEditorStyle
}
