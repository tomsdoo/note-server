export function initializeApi(apiEndpointBase) {
  return {
    async fetchNotes() {
      const { notes } = await fetch(`${apiEndpointBase}/notes`)
        .then(r => r.json());
      return notes;
    },
    async insertNote({ subject, body }) {
      const { note } = await fetch(
        `${apiEndpointBase}/notes`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            subject: subject ?? "",
            body,
          }),
        }
      );
      return note;
    },
    async updateNote(savingNote) {
      const { note } = await fetch(
        `${apiEndpointBase}/notes/${savingNote.id}`,
        {
          method: "PUT",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(savingNote),
        }
      );
      return note;
    },
    async deleteNote(id) {
      const { result } = await fetch(`${apiEndpointBase}/notes/${id}`, {
        method: "DELETE",
      });
      return result;
    }
  };
}
