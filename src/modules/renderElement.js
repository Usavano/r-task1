// render element
function renderElement(container, elementData, createFn) {
  const element = createFn(elementData);
  container.appendChild(element);
}
export default renderElement;
