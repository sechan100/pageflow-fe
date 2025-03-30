import { SxProps } from "@mui/material";


export const sectionEditorTheme = {
  code: 'pf-code',
  heading: {
    h1: 'pf-h1',
    h2: 'pf-h2',
    h3: 'pf-h3',
    h4: 'pf-h4',
    h5: 'pf-h5',
  },
  image: 'pf-image',
  link: 'pf-link',
  list: {
    listitem: 'pf-li',
    nested: {
      listitem: 'pf-nested-listitem',
    },
    ol: 'pf-ol',
    ul: 'pf-ul',
  },
  ltr: 'ltr',
  paragraph: 'pf-p',
  placeholder: 'pf-placeholder',
  quote: 'pf-quote',
  rtl: 'rtl',
  text: {
    bold: 'pf-text-bold',
    code: 'pf-text-code',
    hashtag: 'pf-text-hashtag',
    italic: 'pf-text-italic',
    overflowed: 'pf-text-overflowed',
    strikethrough: 'pf-text-strikethrough',
    underline: 'pf-text-underline',
    underlineStrikethrough: 'pf-text-underlineStrikethrough',
  },
};


export const editorStyle: SxProps = {
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