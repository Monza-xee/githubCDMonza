import React from "react";

type TagVariant = "platform" | "genre" | "size";

interface TagProps {
  label: string;
  variant: TagVariant;
}

const Tag: React.FC<TagProps> = ({ label, variant }) => {
  const className = `tag tag-${variant}`;
  return <span className={className}>{label}</span>;
};

export default Tag;
