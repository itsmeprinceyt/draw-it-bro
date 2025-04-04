import { create } from 'zustand'

type Point = { x: number; y: number };
type Line = { points: Point[] };

type State = {
  lines: Line[];
  undoStack: Line[][];
  redoStack: Line[][];
  addLine: (line: Line) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
};

export const useDrawingStore = create<State>((set) => ({
  lines: [],
  undoStack: [],
  redoStack: [],
  addLine: (line) =>
    set((state) => ({
      lines: [...state.lines, line],
      undoStack: [...state.undoStack, state.lines],
      redoStack: [],
    })),
  undo: () =>
    set((state) => {
      const prev = state.undoStack.pop();
      return prev
        ? {
            lines: prev,
            redoStack: [...state.redoStack, state.lines],
            undoStack: [...state.undoStack],
          }
        : state;
    }),
  redo: () =>
    set((state) => {
      const next = state.redoStack.pop();
      return next
        ? {
            lines: next,
            undoStack: [...state.undoStack, state.lines],
            redoStack: [...state.redoStack],
          }
        : state;
    }),
  reset: () => set({ lines: [], undoStack: [], redoStack: [] }),
}));
