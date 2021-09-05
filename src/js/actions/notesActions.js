import { getDatabase, ref, onValue, set } from "firebase/database";

export const setNotesFirebase = (setNotes) => {
  const db = getDatabase();
  const notesRef = ref(db, "notes/");
  onValue(notesRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      setNotes(data);
    }
  });
};

export function addNoteFirebase(noteId, note, section) {
  const db = getDatabase();
  set(ref(db, `notes/${section}/` + noteId), note);
}
