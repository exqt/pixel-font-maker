import { makeAutoObservable } from "mobx"
import { ReactNode } from "react";
import Project from "./project";

export default class AppState {
  page: string = "main";
  theme: string = "light";

  isModalOpen: boolean = false;
  modalContent?: ReactNode = null;

  constructor() {
    makeAutoObservable(this);
  }

  setPage(page: string) {
    this.page = page;
  }

  setModalContent(content?: ReactNode) {
    if (content) {
      this.modalContent = content;
      this.isModalOpen = true;
    }
    else {
      this.isModalOpen = false;
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
