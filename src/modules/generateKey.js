const generate5Key = () => {
  const min = 10000;
  const max = 99999;
  const uniqKey = Math.floor(Math.random() * (max - min + 1)) + min;
  return uniqKey;
};

export default generate5Key;
