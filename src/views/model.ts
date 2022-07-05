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
  desc?: string;

  constructor() {
    super();
    this.name = '';
  }
}




// visible: false;
// title: '';
// openModalLinkTitle: '';
// confirmButtonName: '';
// linkName: '';
// linkUrl: '';
// tabIndex: 0;
// sectionIndex: 0;
// linkIndex: null;
