
class CustomInput extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div>
                <input type="${this.getAttribute('type')}" placeholder="${this.getAttribute('placeholder')}" required>
                <span class="error-message" style="color: red; font-size: 12px; display: none;"></span>
            </div>
        `;
        this.inputElement = this.querySelector('input');
        this.errorMessage = this.querySelector('.error-message');
        
        this.inputElement.addEventListener('input', () => this.validate());
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
customElements.define('custom-input', CustomInput);

class CustomTextarea extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div>
                <textarea placeholder="${this.getAttribute('placeholder')}" required></textarea>
                <span class="error-message" style="color: red; font-size: 12px; display: none;"></span>
            </div>
        `;
        this.textareaElement = this.querySelector('textarea');
        this.errorMessage = this.querySelector('.error-message');
        
        this.textareaElement.addEventListener('input', () => this.validate());
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
customElements.define('custom-textarea', CustomTextarea);

class CustomButton extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<button type="${this.getAttribute('type')}">${this.innerHTML}</button>`;
    }
}
customElements.define('custom-button', CustomButton);

class NoteItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const title = this.getAttribute('title');
        const body = this.getAttribute('body');
        const id = this.getAttribute('id');
        const archived = this.getAttribute('archived') === 'true';
        
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
                }
                h3 { margin: 0; }
                .actions {
                    margin-top: 10px;
                    display: flex;
                    gap: 5px;
                }
            </style>
            <div class="note">
                <h3>${title}</h3>
                <p>${body}</p>
                <div class="actions">
                    <button onclick="archiveNote('${id}')">${archived ? 'Kembalikan' : 'Arsipkan'}</button>
                    <button onclick="deleteNote('${id}')">Hapus</button>
                </div>
            </div>
        `;
    }
}
customElements.define('note-item', NoteItem);

const notesData = [
    {
      id: 'notes-jT-jjsyz61J8XKiI',
      title: 'Welcome to Notes, Dimas!',
      body: 'Welcome to Notes! This is your first note. You can archive it, delete it, or create new ones.',
      createdAt: '2022-07-28T10:03:12.594Z',
      archived: false,
    },
    {
      id: 'notes-aB-cdefg12345',
      title: 'Meeting Agenda',
      body: 'Discuss project updates and assign tasks for the upcoming week.',
      createdAt: '2022-08-05T15:30:00.000Z',
      archived: false,
    },
    {
      id: 'notes-XyZ-789012345',
      title: 'Shopping List',
      body: 'Milk, eggs, bread, fruits, and vegetables.',
      createdAt: '2022-08-10T08:45:23.120Z',
      archived: false,
    },
    {
      id: 'notes-1a-2b3c4d5e6f',
      title: 'Personal Goals',
      body: 'Read two books per month, exercise three times a week, learn a new language.',
      createdAt: '2022-08-15T18:12:55.789Z',
      archived: false,
    },
    {
      id: 'notes-LMN-456789',
      title: 'Recipe: Spaghetti Bolognese',
      body: 'Ingredients: ground beef, tomatoes, onions, garlic, pasta. Steps:...',
      createdAt: '2022-08-20T12:30:40.200Z',
      archived: false,
    },
    {
      id: 'notes-QwErTyUiOp',
      title: 'Workout Routine',
      body: 'Monday: Cardio, Tuesday: Upper body, Wednesday: Rest, Thursday: Lower body, Friday: Cardio.',
      createdAt: '2022-08-25T09:15:17.890Z',
      archived: false,
    },
    {
      id: 'notes-abcdef-987654',
      title: 'Book Recommendations',
      body: "1. 'The Alchemist' by Paulo Coelho\n2. '1984' by George Orwell\n3. 'To Kill a Mockingbird' by Harper Lee",
      createdAt: '2022-09-01T14:20:05.321Z',
      archived: false,
    },
    {
      id: 'notes-zyxwv-54321',
      title: 'Daily Reflections',
      body: 'Write down three positive things that happened today and one thing to improve tomorrow.',
      createdAt: '2022-09-07T20:40:30.150Z',
      archived: false,
    },
    {
      id: 'notes-poiuyt-987654',
      title: 'Travel Bucket List',
      body: '1. Paris, France\n2. Kyoto, Japan\n3. Santorini, Greece\n4. New York City, USA',
      createdAt: '2022-09-15T11:55:44.678Z',
      archived: false,
    },
    {
      id: 'notes-asdfgh-123456',
      title: 'Coding Projects',
      body: '1. Build a personal website\n2. Create a mobile app\n3. Contribute to an open-source project',
      createdAt: '2022-09-20T17:10:12.987Z',
      archived: false,
    },
    {
      id: 'notes-5678-abcd-efgh',
      title: 'Project Deadline',
      body: 'Complete project tasks by the deadline on October 1st.',
      createdAt: '2022-09-28T14:00:00.000Z',
      archived: false,
    },
    {
      id: 'notes-9876-wxyz-1234',
      title: 'Health Checkup',
      body: 'Schedule a routine health checkup with the doctor.',
      createdAt: '2022-10-05T09:30:45.600Z',
      archived: false,
    },
    {
      id: 'notes-qwerty-8765-4321',
      title: 'Financial Goals',
      body: '1. Create a monthly budget\n2. Save 20% of income\n3. Invest in a retirement fund.',
      createdAt: '2022-10-12T12:15:30.890Z',
      archived: false,
    },
    {
      id: 'notes-98765-54321-12345',
      title: 'Holiday Plans',
      body: 'Research and plan for the upcoming holiday destination.',
      createdAt: '2022-10-20T16:45:00.000Z',
      archived: false,
    },
    {
      id: 'notes-1234-abcd-5678',
      title: 'Language Learning',
      body: 'Practice Spanish vocabulary for 30 minutes every day.',
      createdAt: '2022-10-28T08:00:20.120Z',
      archived: false,
    },
];
  

function displayNotes() {
    const container = document.getElementById('notesContainer');
    container.innerHTML = '';
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(250px, 1fr))';
    container.style.gap = '10px';
    notesData.forEach(note => {
        if (!note.archived) {
            const noteElement = document.createElement('note-item');
            noteElement.setAttribute('id', note.id);
            noteElement.setAttribute('title', note.title);
            noteElement.setAttribute('body', note.body);
            noteElement.setAttribute('archived', note.archived);
            container.appendChild(noteElement);
        }
    });
}

function displayArchivedNotes() {
    const container = document.getElementById('archivedNotesContainer');
    container.innerHTML = '';
    notesData.forEach(note => {
        if (note.archived) {
            const noteElement = document.createElement('note-item');
            noteElement.setAttribute('id', note.id);
            noteElement.setAttribute('title', note.title);
            noteElement.setAttribute('body', note.body);
            noteElement.setAttribute('archived', note.archived);
            container.appendChild(noteElement);
        }
    });
}

function archiveNote(id) {
    const note = notesData.find(note => note.id === id);
    if (note) {
        note.archived = !note.archived;
        displayNotes();
        displayArchivedNotes();
    }
}

function deleteNote(id) {
    const index = notesData.findIndex(note => note.id === id);
    if (index !== -1) {
        notesData.splice(index, 1);
        displayNotes();
        displayArchivedNotes();
    }
}

document.getElementById('addNoteForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const title = this.querySelector('custom-input input').value;
    const body = this.querySelector('custom-textarea textarea').value;
    if (title.trim() === '' || body.trim() === '') return;
    notesData.push({ id: Date.now().toString(), title, body, archived: false });
    displayNotes();
    this.reset();
});

document.getElementById('viewArchivedButton').addEventListener('click', function() {
    const archivedContainer = document.getElementById('archivedNotesContainer');
    archivedContainer.style.display = archivedContainer.style.display === 'none' ? 'block' : 'none';
    displayArchivedNotes();
});

displayNotes();

