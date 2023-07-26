function createStatArray(array) {
  const resultArray = array.reduce((result, el) => {
    const existingCategory = result.find(
      (item) => item.category === el.category
    );

    if (existingCategory) {
      if (el.archiveStatus) {
        existingCategory.archivedAmount++;
      } else {
        existingCategory.activeAmount++;
      }
    } else {
      result.push({
        category: el.category,
        activeAmount: el.archiveStatus ? 0 : 1,
        archivedAmount: el.archiveStatus ? 1 : 0,
      });
    }

    return result;
  }, []);
  return resultArray;
}
export default createStatArray;
