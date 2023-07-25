// import modules
import initialNotes from './modules/initialNotes.js';
import generate5Key from './modules/generateKey.js';
import months from './modules/monthesStorage.js';
import sliceLongText from './modules/sliceText.js';
import gatherDatesInText from './modules/gatherDatesInText.js';

const arrayWithNotes = Array.from(initialNotes);

// appoint keys to notes
arrayWithNotes.forEach((note) => (note.key = generate5Key()));

document.addEventListener('DOMContentLoaded', () => {
  renderNotes();
  renderStatistic();
});

// ******FUNCTIONS****** //
// creating single note
function createNote(noteObj) {
  const { key, name, date, category, content } = noteObj;

  const maxNameLength = 20;
  const maxContentLength = 25;
  const formatedName = sliceLongText(name, maxNameLength);
  const formatedContent = sliceLongText(content, maxContentLength);

  const innerDates = gatherDatesInText(content);

  const noteElement = document.createElement('tr');
  const attr = document.createAttribute('data-key');
  attr.value = key;
  noteElement.setAttributeNode(attr);

  noteElement.classList.add('note');

  noteElement.innerHTML = `
    <td class="noteName">${formatedName}</td>
    <td class="noteCreationDate">${
      months[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}</td>
    <td class="noteCategory">${category}</td>
    <td class="noteContent">${formatedContent}</td>
    <td class="noteDates">${innerDates}</td>
    <td class="noteActions">
        <button class="btnEdit">
            <i class="fa-solid fa-pen-to-square fa-xl"></i>
        </button>
        <button class="btnArchive">
            <i class="fa-solid fa-box-archive fa-xl"></i>
        </button>
        <button class="btnDelete">
            <i class="fa-solid fa-trash fa-xl"></i>
        </button>
    </td>`;

  return noteElement;
}
// creating single category stats
function createStatisticRow(categoryObj) {
  const { category, activeAmount, archivedAmount } = categoryObj;
  const statisticEl = document.createElement('tr');

  statisticEl.classList.add('category');

  statisticEl.innerHTML = `              
    <td class="categoryName">${category}</td>
    <td class="categoryActives">${activeAmount}</td>
    <td class="categoryArchived">${archivedAmount}</td>`;

  return statisticEl;
}

// rendering notes
function renderNotes() {
  const notesContainer = document.querySelector('.notesContainer');

  arrayWithNotes.forEach((noteObj) => {
    const note = createNote(noteObj);
    notesContainer.appendChild(note);
  });
}
// rendering stats
function renderStatistic() {
  const statisticContainer = document.querySelector('.statisticContainer');
  const transformedArray = arrayWithNotes.reduce((result, el) => {
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

  transformedArray.forEach((statObj) => {
    const statEl = createStatisticRow(statObj);
    statisticContainer.appendChild(statEl);
  });
}
