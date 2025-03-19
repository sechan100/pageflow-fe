import { SxProps } from "@mui/material";


export const SectionEditorTheme = {
  code: 'editor-code',
  heading: {
    h1: 'editor-heading-h1',
    h2: 'editor-heading-h2',
    h3: 'editor-heading-h3',
    h4: 'editor-heading-h4',
    h5: 'editor-heading-h5',
  },
  image: 'editor-image',
  link: 'editor-link',
  list: {
    listitem: 'editor-listitem',
    nested: {
      listitem: 'editor-nested-listitem',
    },
    ol: 'editor-list-ol',
    ul: 'editor-list-ul',
  },
  ltr: 'ltr',
  paragraph: 'editor-paragraph',
  placeholder: 'editor-placeholder',
  quote: 'editor-quote',
  rtl: 'rtl',
  text: {
    bold: 'editor-text-bold',
    code: 'editor-text-code',
    hashtag: 'editor-text-hashtag',
    italic: 'editor-text-italic',
    overflowed: 'editor-text-overflowed',
    strikethrough: 'editor-text-strikethrough',
    underline: 'editor-text-underline',
    underlineStrikethrough: 'editor-text-underlineStrikethrough',
  },
};



type EditorStyleOptions = {
  height: number
}
export const getEditorStyle = (opt: EditorStyleOptions): SxProps => ({
  // Editor Root
  "[data-lexical-editor='true']": {
    outline: "none", // focus되었을 때 파란색 테두리 제거
    lineHeight: 2,
    columnCount: 2,
    // columnGap: 60,
    columnFill: 'auto',
    height: opt.height,
    // /* column-rule: 1px dotted rgba(255, 255, 255, 0.693) !important; */
  },

  // Paragraph
  ".editor-paragraph": {
    m: 0,
  }
})