import React from 'react';

interface TagListProps {
  tags: string[];
  onTagSelect: (tag: string) => void;
}

const TagList: React.FC<TagListProps> = ({ tags, onTagSelect }) => {
  if (tags.length === 0) {
    return <div>Loading tags...</div>;
  }

  return (
    <div className="tag-list">
      {tags.map((tag) => (
        <button
          key={tag}
          className="tag-pill tag-default"
          onClick={() => onTagSelect(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default TagList;
