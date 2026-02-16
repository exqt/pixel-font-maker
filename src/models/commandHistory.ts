import { makeAutoObservable } from "mobx";
import { Command } from "./commands";

const MAX_HISTORY = 100;

export default class CommandHistory {
  undoStack: Command[] = [];
  redoStack: Command[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  execute(cmd: Command) {
    cmd.redo();
    this.undoStack.push(cmd);
    this.redoStack = [];
    if (this.undoStack.length > MAX_HISTORY) {
      this.undoStack.shift();
    }
  }

  push(cmd: Command) {
    this.undoStack.push(cmd);
    this.redoStack = [];
    if (this.undoStack.length > MAX_HISTORY) {
      this.undoStack.shift();
    }
  }

  undo() {
    if (!this.canUndo) return;
    let cmd = this.undoStack.pop()!;
    cmd.undo();
    this.redoStack.push(cmd);
  }

  redo() {
    if (!this.canRedo) return;
    let cmd = this.redoStack.pop()!;
    cmd.redo();
    this.undoStack.push(cmd);
  }

  get canUndo() {
    return this.undoStack.length > 0;
  }

  get canRedo() {
    return this.redoStack.length > 0;
  }

  clear() {
    this.undoStack = [];
    this.redoStack = [];
  }
}
