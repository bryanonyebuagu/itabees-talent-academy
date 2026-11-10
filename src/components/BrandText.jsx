import React from "react";

const brandPattern = /(ItaBEES|ITABEES)/gi;

function colorize(node) {
  if (typeof node === "string") return node.split(brandPattern).map((part, index) =>
    /^itabees$/i.test(part)
      ? <span className="brand-text" key={index}><span className="brand-ita">{part.slice(0, 3)}</span><span className="brand-bees">{part.slice(3)}</span></span>
      : <React.Fragment key={index}>{part}</React.Fragment>,
  );
  if (Array.isArray(node)) return node.map(colorize);
  if (React.isValidElement(node) && node.props.children !== undefined) {
    return React.cloneElement(node, undefined, colorize(node.props.children));
  }
  return node;
}

export default function BrandText({ children }) {
  return colorize(children);
}
