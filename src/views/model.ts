export class EditModal {
  visible: boolean;
  title: string;
  confirmButtonName: string;
  tabIndex: number | null;
  sectionIndex: number | null;
  linkIndex: number | null;

  constructor() {
    this.title = '';
    this.confirmButtonName = '';
    this.tabIndex = null;
    this.sectionIndex = 0;
    this.linkIndex = null;
    this.visible = false;
  }
}

export class EditLinkModal extends EditModal {
  name: string;
  url: string;

  constructor() {
    super();
    this.name = '';
    this.url = '';
  }
}

export class EditSectionModal extends EditModal {
  name: string;
  notes?: string;

  constructor() {
    super();
    this.name = '';
  }
}

export class EditTabModal extends EditModal {
  name: string;
  showDelete: boolean;

  constructor() {
    super();
    this.name = '';
    this.showDelete = false;
  }
}

export class ImportFromTextModal {
  visible: boolean;
  jsonText: string;

  constructor() {
    this.visible = false;
    this.jsonText = '';
  }
}

