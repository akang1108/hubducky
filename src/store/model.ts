export class Link {
  name: string;
  url: string;
  constructor(name: string, url: string) {
    this.name = name;
    this.url = url;
  }
}

export class Section {
  name: string;
  links: Link[];
  notes?: string;
  constructor(name: string, links: Link[], notes?: string) {
    this.name = name;
    this.links = links;
    this.notes = notes;
  }
}

export class Tab {
  name: string;
  sections: Section[];
  constructor(name: string, sections: Section[]) {
    this.name = name;
    this.sections = sections;
  }
}

export class Data {
  tabs: Tab[];
  constructor(tabs: Tab[]) {
    this.tabs = tabs;
  }
}

export class Ducky {
  lastUpdated: Date;
  data: Data;

  constructor(lastUpdated: Date, data: Data) {
    this.lastUpdated = lastUpdated;
    this.data = data;
  }

  static blank(): Ducky {
    return new Ducky(
        new Date(),
        new Data([])
    );
  }
}

export class NoteMetadata {
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  constructor(title: string, x: number, y: number, width: number, height: number) {
    this.title = title;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}
