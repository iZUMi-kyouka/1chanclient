export function splitTags(tags: string): number[] {
  const tagsArray = tags.split(',');
  if (tagsArray.length === 1 && tagsArray[0] === '') {
    return [];
  } else {
    return tagsArray.map((t) => Number(t));
  }
}

export function splitCustomTags(tags: string): string[] {
  const tagsArray = tags.split(',');
  if (tagsArray.length === 1 && tagsArray[0] === '') {
    return [];
  }

  return tagsArray;
}
