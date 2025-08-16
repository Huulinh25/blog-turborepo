"use client";

import DOMPurity from "dompurify";

type Props = {
  content: string;
  className?: string;
};

const SanitizedContent = (props: Props) => {
  const cleanHtml = DOMPurity.sanitize(props.content);

  return (
    <div
      className={props.className}
      dangerouslySetInnerHTML={{ __html: props.content }}
    />
  );
};
export default SanitizedContent;
