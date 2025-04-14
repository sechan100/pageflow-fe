import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import { useEffect, useState } from "react";


export const useSectionCharCount = () => {
  const [editor] = useLexicalComposerContext();
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => editorState.read(() => {
      const root = $getRoot();
      // 줄바꿈 문자는 제외
      const content = root.getTextContent().replace(/\n/g, "");
      setCharCount(content.length);
    }));
  }, [editor]);

  return {
    charCount,
  };
}