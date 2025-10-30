import { Low } from "lowdb";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Note } from "@/modules/notes";
import { deleteNote, getNote, getNotes, upsertNote } from "@/modules/notes";

const { defaultNote } = vi.hoisted(() => ({
  defaultNote: {
    id: "dummyId",
    subject: "dummySubject",
    body: "dummyBody",
  },
}));

vi.mock("lowdb", async () => {
  const originalModule = await vi.importActual("lowdb");
  const { Memory, Low: OriginalLow } = originalModule;
  return {
    ...originalModule,
    // @ts-expect-error extending original module dynamically
    Low: class extends OriginalLow {
      constructor() {
        // @ts-expect-error using original Memory for testing
        super(new Memory(), { notes: [defaultNote] });
      }
    },
  };
});

describe("getNotes", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("calls read", async () => {
    const spyRead = vi
      .spyOn(Low.prototype, "read")
      .mockResolvedValue(undefined);
    const notes = await getNotes();
    expect(spyRead).toHaveBeenCalledTimes(1);
    expect(notes).toEqual([defaultNote]);
  });
});

describe("getNote", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it.each([
    { description: "case note exists", id: "dummyId", expected: defaultNote },
    {
      description: "case not note exists",
      id: "dummyIdNotExists",
      expected: null,
    },
  ])("$description", async ({ id, expected }) => {
    const spyRead = vi
      .spyOn(Low.prototype, "read")
      .mockResolvedValue(undefined);
    const note = await getNote(id);
    expect(spyRead).toHaveBeenCalledTimes(1);
    expect(note).toEqual(expected);
  });
});

describe("upsertNote", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("case add if note not exists", async () => {
    const spyUpdate = vi.spyOn(Low.prototype, "update");
    vi.spyOn(crypto, "randomUUID").mockReturnValue("d-u-m-m-y");
    const note = await upsertNote({
      body: "dummyBodyAlt",
    });
    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(note).toEqual({
      id: "d-u-m-m-y",
      body: "dummyBodyAlt",
      subject: "",
    });
    expect(await getNotes()).toSatisfy((notes: Note[]) => {
      return notes.find((note) => note.id === "d-u-m-m-y") != null;
    });
  });

  it("case update if note exists", async () => {
    const spyUpdate = vi.spyOn(Low.prototype, "update");
    vi.spyOn(crypto, "randomUUID").mockReturnValue("d-u-m-m-y");
    const note = await upsertNote({
      id: "dummyId",
      body: "dummyBodyAlt",
    });
    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(note).toEqual({
      id: "dummyId",
      body: "dummyBodyAlt",
      subject: "",
    });
    expect(await getNotes()).toSatisfy((notes: Note[]) => {
      return (
        notes.find((note) => note.id === "dummyId")?.body === "dummyBodyAlt"
      );
    });
  });
});

describe("deleteNote", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("case exists", async () => {
    const spyUpdate = vi.spyOn(Low.prototype, "update");
    await upsertNote({
      id: "to-be-deleted",
      body: "dummyBody",
    });
    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(await getNotes()).toSatisfy((notes: Note[]) => {
      return notes.find((note) => note.id === "to-be-deleted") != null;
    });
    await deleteNote("to-be-deleted");
    expect(spyUpdate).toHaveBeenCalledTimes(2);
    expect(await getNotes()).toSatisfy((notes: Note[]) => {
      return notes.find((note) => note.id === "to-be-deleted") == null;
    });
  });
});
