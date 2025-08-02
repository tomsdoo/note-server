import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

export interface Note {
  id: string;
  subject: string;
  body: string;
}

interface DbSchema {
  notes: Note[];
}

const dbFilePath = process.env.DB_JSON_PATH ?? "db.json";
const adapter = new JSONFile<DbSchema>(dbFilePath);
const db = new Low<DbSchema>(adapter, {
  notes: [],
});

export async function getNotes() {
  await db.read();
  return db.data.notes;
}

export async function getNote(id: string) {
  const notes = await getNotes();
  return notes.find((note) => note.id === id) ?? null;
}

export async function upsertNote({
  id,
  subject,
  body,
}: {
  id?: string;
  subject?: string;
  body: string;
}) {
  const note = {
    id: id ?? crypto.randomUUID(),
    subject: subject ?? "",
    body,
  };
  await db.update((data) => {
    data.notes = [
      ...data.notes.filter((existingNote) => existingNote.id !== note.id),
      note,
    ];
  });
  return note;
}

export async function deleteNote(id: string) {
  await db.update((data) => {
    data.notes = data.notes.filter((existingNote) => existingNote.id !== id);
  });
}
