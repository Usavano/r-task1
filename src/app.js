// import modules
import initialNotes from './modules/initialNotes.js';
import generate5Key from './modules/generateKey.js';

const arrayWithNotes = Array.from(initialNotes);

// appoint keys to notes
arrayWithNotes.forEach((note) => (note.key = generate5Key()));

document.addEventListener('DOMContentLoaded', () => {
  renderNotes();
});

function createNote(noteObj) {
  const noteElement = document.createElement('tr');
  noteElement.classList.add('note');
  noteElement.innerHTML = `
    <td class="noteName">${noteObj.name}</td>
    <td class="noteCreationDate">${noteObj.date.getMonth()} ${noteObj.date.getDate()}, ${noteObj.date.getFullYear()}</td>
    <td class="noteCategory">${noteObj.category}</td>
    <td class="noteContent">${noteObj.content}</td>
    <td class="noteDates">${noteObj.innerDates}</td>
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

function renderNotes() {
  const container = document.querySelector('.notesContainer');

  arrayWithNotes.forEach((noteObj) => {
    const note = createNote(noteObj);
    container.appendChild(note);
  });
}
