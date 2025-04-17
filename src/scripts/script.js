import "../styles/styles.css";
import Swal from "sweetalert2";

const API_URL = "https://notes-api.dicoding.dev/v2/notes";

function showError(message) {
  Swal.fire({
    icon: "error",
    title: "Oops... Terjadi Kegagalan",
  });
}

class CustomInput extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
            <div>
                <input type="${this.getAttribute("type")}" placeholder="${this.getAttribute("placeholder")}" required>
                <span class="error-message" style="color: red; font-size: 12px; display: none;"></span>
            </div>
        `;
    this.inputElement = this.querySelector("input");
    this.errorMessage = this.querySelector(".error-message");

    this.inputElement.addEventListener("input", () => this.validate());
  }

  validate() {
    if (this.inputElement.value.length < 3) {
      this.errorMessage.textContent = "Minimal 3 karakter";
      this.errorMessage.style.display = "block";
    } else {
      this.errorMessage.style.display = "none";
    }
  }
}
customElements.define("custom-input", CustomInput);

class CustomTextarea extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
            <div>
                <textarea placeholder="${this.getAttribute("placeholder")}" required></textarea>
                <span class="error-message" style="color: red; font-size: 12px; display: none;"></span>
            </div>
        `;
    this.textareaElement = this.querySelector("textarea");
    this.errorMessage = this.querySelector(".error-message");

    this.textareaElement.addEventListener("input", () => this.validate());
  }

  validate() {
    if (this.textareaElement.value.length < 10) {
      this.errorMessage.textContent = "Minimal 10 karakter";
      this.errorMessage.style.display = "block";
    } else {
      this.errorMessage.style.display = "none";
    }
  }
}
customElements.define("custom-textarea", CustomTextarea);

class CustomButton extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<button type="${this.getAttribute("type")}">${this.innerHTML}</button>`;
  }
}
customElements.define("custom-button", CustomButton);

class NoteItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const title = this.getAttribute("title");
    const body = this.getAttribute("body");
    const id = this.getAttribute("id");
    const archived = this.getAttribute("archived") === "true";

    this.shadowRoot.innerHTML = `
            <style>
                .note {
                    border: 1px solid #ddd;
                    padding: 10px;
                    margin: 10px;
                    border-radius: 5px;
                    background: #fff;
                    display: flex;
                    flex-direction: column;
                    transition: transform 0.2s ease; /* Smooth transition */
                }
                h3 { margin: 0; }
                .actions {
                    margin-top: 10px;
                    display: flex;
                    gap: 5px;
                }
                .note:hover {
                    transform: scale(1.02); /* Scale effect on hover */
                }
            </style>
            <div class="note">
                <h3>${title}</h3>
                <p>${body}</p>
                <div class="actions">
                    <button onclick="toggleArchive('${id}', ${archived})">${archived ? "Kembalikan" : "Arsipkan"}</button>
                    <button onclick="deleteNote('${id}')">Hapus</button>
                </div>
            </div>
        `;
  }
}
customElements.define("note-item", NoteItem);

class LoadingSpinner extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
            <style>
                .spinner {
                    border: 8px solid #f3f3f3; /* Light grey */
                    border-top: 8px solid #3498db; /* Blue */
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    animation: spin 1s linear infinite;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    display: none; /* Hidden by default */
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
            <div class="spinner"></div>
        `;
  }

  show() {
    this.querySelector(".spinner").style.display = "block";
  }

  hide() {
    this.querySelector(".spinner").style.display = "none";
  }
}
customElements.define("loading-spinner", LoadingSpinner);

const loadingSpinner = document.createElement("loading-spinner");
document.body.appendChild(loadingSpinner);

async function fetchNotes() {
  loadingSpinner.show();
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch notes");
    const data = await response.json();
    return data.data;
  } catch (error) {
    showError(error.message);
    return [];
  } finally {
    loadingSpinner.hide();
  }
}

async function fetchArchivedNotes() {
  loadingSpinner.show();
  try {
    const response = await fetch(`${API_URL}/archived`);
    if (!response.ok) throw new Error("Failed to fetch archived notes");
    const data = await response.json();
    return data.data;
  } catch (error) {
    showError(error.message);
    return [];
  } finally {
    loadingSpinner.hide();
  }
}

async function createNote(title, body) {
  loadingSpinner.show();
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, body }),
    });
    if (!response.ok) throw new Error("Failed to create note");
    const data = await response.json();
    return data.data;
  } catch (error) {
    showError(error.message);
  } finally {
    loadingSpinner.hide();
  }
}

async function archiveNoteById(id) {
  loadingSpinner.show();
  try {
    const response = await fetch(`${API_URL}/${id}/archive`, {
      method: "POST",
    });
    if (!response.ok) throw new Error("Failed to archive note");
  } catch (error) {
    showError(error.message);
  } finally {
    loadingSpinner.hide();
  }
}

async function unarchiveNoteById(id) {
  loadingSpinner.show();
  try {
    const response = await fetch(`${API_URL}/${id}/unarchive`, {
      method: "POST",
    });
    if (!response.ok) throw new Error("Failed to unarchive note");
  } catch (error) {
    showError(error.message);
  } finally {
    loadingSpinner.hide();
  }
}

async function deleteNoteById(id) {
  loadingSpinner.show();
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Failed to delete note");
  } catch (error) {
    showError(error.message);
  } finally {
    loadingSpinner.hide();
  }
}

async function displayNotes() {
  const notes = await fetchNotes();
  const container = document.getElementById("notesContainer");
  container.innerHTML = "";
  notes.forEach((note) => {
    const noteElement = document.createElement("note-item");
    noteElement.setAttribute("id", note.id);
    noteElement.setAttribute("title", note.title);
    noteElement.setAttribute("body", note.body);
    noteElement.setAttribute("archived", note.archived);
    container.appendChild(noteElement);
  });
}

async function displayArchivedNotes() {
  const notes = await fetchArchivedNotes();
  const container = document.getElementById("archivedNotesContainer");
  container.innerHTML = "";
  notes.forEach((note) => {
    const noteElement = document.createElement("note-item");
    noteElement.setAttribute("id", note.id);
    noteElement.setAttribute("title", note.title);
    noteElement.setAttribute("body", note.body);
    noteElement.setAttribute("archived", note.archived);
    container.appendChild(noteElement);
  });
}

document
  .getElementById("addNoteForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const title = this.querySelector("custom-input input").value;
    const body = this.querySelector("custom-textarea textarea").value;
    if (title.trim() === "" || body.trim() === "") return;
    const newNote = await createNote(title, body);
    displayNotes();
    this.reset();
  });

document
  .getElementById("viewArchivedButton")
  .addEventListener("click", async function () {
    const archivedContainer = document.getElementById("archivedNotesContainer");
    archivedContainer.style.display =
      archivedContainer.style.display === "none" ? "block" : "none";
    await displayArchivedNotes();
  });

window.toggleArchive = async function (id, isArchived) {
  if (isArchived) {
    await unarchiveNoteById(id);
  } else {
    await archiveNoteById(id);
  }
  await displayNotes();
  await displayArchivedNotes();
};

window.deleteNote = async function (id) {
  await deleteNoteById(id);
  await displayNotes();
  await displayArchivedNotes();
};

displayNotes();
