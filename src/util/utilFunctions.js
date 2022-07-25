export const createRandomUniqueList = ({
  size = 5,
  includeElements = [],
}) => {
  const numbers = Array(size * 5).fill().map((_, index) => index + 1);
  numbers.sort(() => Math.random() - 0.5);
  return [...numbers.slice(0, size - includeElements.length), ...includeElements];
};

export const pickRandonItemFromList = (items = [[]]) => {
  return items.map(item => item[Math.floor(Math.random()*item.length)]);
};
