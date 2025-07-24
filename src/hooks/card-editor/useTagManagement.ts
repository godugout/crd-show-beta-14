
import { useState } from 'react';

export const useTagManagement = (initialTags: string[] = []) => {
  const [tags, setTags] = useState<string[]>(initialTags);
  const hasMaxTags = tags.length >= 10;

  const addTag = (tag: string) => {
    if (!hasMaxTags && !tags.includes(tag)) {
      setTags(prev => [...prev, tag]);
      return [...tags, tag];
    }
    return tags;
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    return newTags;
  };

  const handleTagInput = (input: string) => {
    const newTags = input.split(',').map(tag => tag.trim()).filter(Boolean);
    const uniqueTags = [...new Set([...tags, ...newTags])].slice(0, 10);
    setTags(uniqueTags);
    return uniqueTags;
  };

  const updateTags = (newTags: string[]) => {
    setTags(newTags);
    return newTags;
  };

  return {
    tags,
    addTag,
    removeTag,
    handleTagInput,
    hasMaxTags,
    updateTags
  };
};
