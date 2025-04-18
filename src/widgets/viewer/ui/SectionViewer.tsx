import { ReadOnlySection } from '@/entities/reader';
import { LexicalReader } from './LexicalReader';



type Props = {
  section: ReadOnlySection;
};
export const SectionViewer = ({
  section,
}: Props) => {

  return (
    <LexicalReader html={section.content} />
  );
};
