import React, { createContext, useState, useEffect, useReducer, useActionState, useContext } from 'react';
import ReactDOM from 'react-dom/client';

const origin = new URL(location.href).origin;

const NotesContext = createContext();

function App({ children }) {
  const [notes, setNotes] = useState([]);
  async function refreshNotes() {
    const { notes: nextNotes } = await fetch(`${origin}/notes`).then(r => r.json());
    setNotes(nextNotes);
  }
  useEffect(() => {
    refreshNotes();
  }, []);
  async function addNote({ subject, body }) {
    await fetch(`${origin}/notes`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        subject: subject ?? "",
        body,
      }),
    });
    await refreshNotes();
  }
  async function saveNote(savingNote) {
    await fetch(`${origin}/notes/${savingNote.id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(savingNote),
    });
    await refreshNotes();
  }
  async function removeNote({ id }) {
    await fetch(`${origin}/notes/${id}`, { method: "DELETE" });
    await refreshNotes();
  }
  return (
    <NotesContext value={notes}>
      <header><h1>notes</h1><a href="/openapi">openapi</a></header>
      <NoteForm addNote={addNote} saveNote={saveNote} removeNote={removeNote} />
    </NotesContext>
  );
}

function NoteForm({ addNote, removeNote, saveNote }) {
  const [note,setNote] = useState(null);
  function upsertNote(note) {
    if (note?.id != null) {
      saveNote(note);
    } else {
      addNote(note);
    }
    setNote(null);
  }
  return (
    <div className="app-form">
      <NoteList removeNote={removeNote} selectNote={(value) => setNote(value)} />
      <NoteEditor note={note} key={note?.id ?? ""} saveNote={upsertNote} />
    </div>
  );
}

function NoteList({ removeNote, selectNote }) {
  const notes = useContext(NotesContext);
  return (
    <ul className="note-list">
      {notes.map(note => <NoteItem key={note.id} note={note} remove={removeNote} select={selectNote} />)}
    </ul>
  );
}

function NoteItem({ note, remove, select }) {
  return (
    <div className="note-item">
      <div className="note-id">{note.id}</div>
      <div className="note-subject">{note.subject}</div>
      <div className="note-body">{note.body}</div>
      <ul className="button-list">
        <li>
          <button onClick={(e) => select(note)}>edit</button>
        </li>
        <li>
          <button onClick={(e) => remove(note)}>remove</button>
        </li>
      </ul>
    </div>
  );
}

function NoteEditor({ note, saveNote }) {
  const [body, setBody] = useState(note?.body ?? "");
  const [subject, setSubject] = useState(note?.subject ?? "");
  function save() {
    saveNote({
      ...(note?.id ? { id: note.id } : {}),
      subject,
      body,
    });
    setBody("");
    setSubject("");
  }
  return (
    <form className="note-editor">
      <fieldset>
        <legend>subject</legend>
        <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />
      </fieldset>
      <fieldset>
        <legend>body</legend>
        <input type="text" value={body} onChange={(e) => setBody(e.target.value)} />
      </fieldset>
      <ul className="button-list">
        <li>
          <button type="button" onClick={save}>{ note?.id ? "save" : "add" }</button>
        </li>
      </ul>
    </form>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
