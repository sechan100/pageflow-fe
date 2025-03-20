import { SxProps } from "@mui/material";


export const SectionEditorTheme = {
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
    // columnCount: 2,
    // columnGap: 60,
    // columnFill: 'auto',
    // height: opt.height,
  },

  // Paragraph
  ".pf-p": {
    m: 0,
    textAlign: 'justify',
  }
}