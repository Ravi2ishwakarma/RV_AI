import { useEffect, useState } from "react";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { checkHeading, removeHeadingstar } from "./helper";
import SyntaxHighlighter from "react-syntax-highlighter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Answers = ({ ans, index, type, totalResult }) => {
  const [heading, setHeading] = useState(false);
  const [answer, setAnswer] = useState(ans);

  useEffect(() => {
    if (checkHeading(ans)) {
      setHeading(true);
    }
    setAnswer(removeHeadingstar(ans));
  }, []);

  const renderer = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          {...props}
          language={match[1]}
          style={darcula}
          PreTag="div"
          customStyle={{
            margin: 0,
            padding: '10px',
            fontSize: '0.875rem',
          }}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code {...props} className={className}>
          {children}
        </code>
      );
    },
  };

  return (
    <>
      {index === 0 && totalResult > 1 ? (
        <div className="text-xl text-white inline-block">{answer}</div>
      ) : heading ? (
        <div className="text-2xl font-bold text-right inline-block">{answer}</div>
      ) : (
        <div className={type === "q" ? "pl-1" : "pl-5"}>
          <ReactMarkdown components={renderer} remarkPlugins={[remarkGfm]}>
            {answer}
          </ReactMarkdown>
        </div>
      )}
    </>
  );
};

export default Answers;
