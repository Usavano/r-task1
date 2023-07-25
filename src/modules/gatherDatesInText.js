// look for dates in content
function gatherDatesInText(text) {
  const dateRegex = /\d{1,2}\/\d{1,2}\/\d{4}/g;
  const dates = text.match(dateRegex);
  return !dates ? '' : dates.join(', ');
}

export default gatherDatesInText;
