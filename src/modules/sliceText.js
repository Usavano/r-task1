// cut off extra text
function sliceLongText(textValue, length) {
  return textValue.length > length
    ? `${textValue.slice(0, length)}...`
    : textValue;
}

export default sliceLongText;
