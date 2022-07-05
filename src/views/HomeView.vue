<template>
  <div class="home">
    <TabView :activeIndex="activeIndex" @tab-click="tabClick($event)">
      <TabPanel v-for="(tab, tabIndex) in linksData.tabs" :key="tabIndex" :header="tab.name">

        <Button v-if="editMode"
                icon="pi pi-times"
                :label="`Delete tab - ${tab.name}`"
                class="p-button-danger p-button-sm mb-1"
                @click="confirmDeleteTab(tabIndex)"/>

        <div class="flex flex-wrap" :id="'tab-' + tabIndex">

          <Card v-for="(section, sectionIndex) in tab.sections"
                :key="sectionIndex"
                :id="`section-${sectionIndex}`"
                :ref="`tab-${tabIndex}-section-${sectionIndex}`"
                :draggable="editMode">

            <template #title>
              <Button v-if="editMode"
                      icon="pi pi-times"
                      class="p-button-danger p-button-xsm mb-1"
                      @click="confirmDeleteSection(tabIndex, sectionIndex)"/>
              {{ section.name }}
            </template>

            <template #content v-if="section.description">
              <TextArea v-model="section.description" :autoResize="true"></TextArea>
            </template>

            <template #content>
              <div v-for="(link, linkIndex) in section.links" :key="linkIndex" class="line-height-3">

                <div v-if="link.url"
                     class="flex"
                     :id="`link-${linkIndex}`"
                     :ref="`tab-${tabIndex}-section-${sectionIndex}-link-${linkIndex}`"
                     :draggable="editMode">

                  <div v-if="editMode">
                    <Button icon="pi pi-times"
                            class="p-button-danger p-button-xsm mb-1 mr-1"
                            @click="confirmDeleteLink(tabIndex, sectionIndex, linkIndex)"/>
                  </div>

                  <a v-if="!editMode" :href="link.url" class="link">{{ link.name }}</a>
                  <div tabindex="0" v-if="editMode" class="link"
                       @keyup.enter="openEditLink(tabIndex, sectionIndex, linkIndex)"
                       @click="openEditLink(tabIndex, sectionIndex, linkIndex)">
                    {{ link.name }}
                  </div>
                </div>
              </div>

              <Button v-if="editMode" label="link" icon="pi pi-plus" class="mb-1 mr-1 p-button-primary p-button-xsm"
                      @click="openEditLink(tabIndex, sectionIndex, null)" />

            </template>

          </Card>

          <Card v-if="editMode">
            <template #content>
              <Button label="section" icon="pi pi-plus" class="p-button-primary p-button-sm"
                      @click="openEditSection(tabIndex, null)" />
            </template>
          </Card>
        </div>
      </TabPanel>
    </TabView>

    <Toolbar>
      <template #start>
        <Button v-if="!editMode" label="Edit Mode" icon="pi pi-pencil" class="p-button-sm mr-1" @click="toggleEditMode()" />
        <Button v-if="editMode" label="View Mode" icon="pi pi-eye" class="p-button-sm mr-1" @click="toggleEditMode()" />
        <Button label="Json" icon="pi pi-eye" class="p-button-sm" @click="this.jsonVisible = true" />
      </template>

      <template #end>
        <Button label="Import" @click="importModal.visible = true" icon="pi pi-upload" class="p-button-sm p-button-warning mr-1" />
        <Button label="Delete storage" @click="confirmDeleteLocalStorage()" icon="pi pi-times" class="p-button-sm p-button-danger" />
      </template>
    </Toolbar>

    <ConfirmDialog></ConfirmDialog>

    <Dialog v-model:visible="jsonVisible" :dismissableMask="true" :modal="true">
      <TextArea :modelValue="JSON.stringify(linksData, null, 2)" :autoResize="true" style="width: 50rem; font-size: .7rem;"></TextArea>
    </Dialog>

    <Dialog class="w-8" v-model:header="editLinkModal.title" v-model:visible="editLinkModal.visible" :dismissableMask="true" :modal="true">
      <div class="field grid">
        <label for="editSectionName" class="col-3 mt-1 justify-content-end">Name</label>
        <InputText id="editSectionName" class="col-7" type="text" v-model="editLinkModal.name" autofocus @keyup.enter="saveLink()"/>
      </div>
      <div class="field grid">
        <label for="editLinkUrl" class="col-3 mt-1 justify-content-end">Url</label>
        <InputText id="editLinkUrl" class="col-9" type="text" v-model="editLinkModal.url" @keyup.enter="saveLink()"/>
      </div>
      <div class="grid justify-content-center">
        <Button :label="editLinkModal.confirmButtonName" @click="saveLink()"/>
      </div>
    </Dialog>

    <Dialog class="w-8" v-model:header="editSectionModal.title" v-model:visible="editSectionModal.visible" :dismissableMask="true" :modal="true">
      <div class="field grid">
        <label for="editSectionName" class="col-3 mt-1 justify-content-end">Name</label>
        <InputText id="editSectionName" class="col-7" type="text" v-model="editSectionModal.name" autofocus @keyup.enter="saveSection()"/>
      </div>
      <div class="field grid">
        <label for="editSectionDesc" class="col-3 mt-1 justify-content-end">Description</label>
        <InputText id="editSectionDesc" class="col-9" type="text" v-model="editSectionModal.desc" @keyup.enter="saveSection()"/>
      </div>
      <div class="grid justify-content-center">
        <Button :label="editSectionModal.confirmButtonName" @click="saveSection()"/>
      </div>
    </Dialog>

    <Dialog v-model:header="importModal.title" v-model:visible="importModal.visible" :dismissableMask="true" :modal="true">
      <FileUpload id="importUploadFile" name="importUploadFile" mode="basic" :customUpload="true" @uploader="uploadFile" />
    </Dialog>
  </div>
</template>

<script lang="ts">

import { Options, Vue } from 'vue-class-component';
import store from "@/store";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Card from "primevue/card";
import Panel from "primevue/panel";
import Fieldset from "primevue/fieldset";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import TextArea from "primevue/textarea";
import Toolbar from "primevue/toolbar";
import InputText from "primevue/inputtext";
import ConfirmDialog from "primevue/confirmdialog";
import FileUpload, {FileUploadUploadEvent} from "primevue/fileupload";
import {Link, LinksData, Section} from "@/store/model";
import { watch } from "vue";
import {EditLinkModal, EditSectionModal} from "@/views/model";

@Options({
  components: {
    Button, Dialog, TabView, TabPanel, Card, Panel, Fieldset, DataTable, Column, TextArea, Toolbar,
    ConfirmDialog, InputText, FileUpload,
  },
})
export default class HomeView extends Vue {
  editLinkModal = new EditLinkModal();
  editSectionModal = new EditSectionModal();

  importModal = {
    visible: false,
    title: 'Import from file',
    filename: '',
  } as any;
  isDragging = false;
  jsonVisible = false;

  get linksData() {
    return store.state.linksData;
  }

  get activeIndex() {
    return store.state.tabIndex;
  }

  set activeIndex(activeIndex: number) {
    store.commit('setTabIndex', activeIndex);
  }

  get editMode() {
    return store.state.editMode;
  }

  set editMode(editMode: boolean) {
    store.commit('setEditMode', editMode);
    this.toggleEventListeners(editMode);
  }

  dragEventListeners = new Map<string, any[]>();

  toggleEventListeners(editMode: boolean) {
    const self = this;
    this.linksData.tabs.forEach((tab, tabIndex) => {
      tab.sections.forEach((section, sectionIndex) => {
        if (!section.links) {
          return;
        }

        section.links.forEach((link, linkIndex) => {
          const linkElem = this.getElem(tabIndex, sectionIndex, linkIndex);
          const refId = this.getRefId(tabIndex, sectionIndex, linkIndex);

          if (editMode) {
            const dragstartFunc = (e: any) => self.dragstart(e, tabIndex, sectionIndex, linkIndex);
            const dragendFunc = (e: any) => self.dragend(e, tabIndex, sectionIndex, linkIndex);
            linkElem.addEventListener('dragstart', dragstartFunc);
            linkElem.addEventListener('dragend', dragendFunc);
            this.dragEventListeners.set(refId, [dragstartFunc, dragendFunc]);
          } else {
            const eventListeners = this.dragEventListeners.get(refId);
            if (eventListeners && eventListeners.length == 2) {
              linkElem.removeEventListener('dragstart', eventListeners[0]);
              linkElem.removeEventListener('dragend', eventListeners[1]);
            }
            this.dragEventListeners.delete(refId);
          }
        });
      });
    });
  }

  created() {
    watch(this.editLinkModal, (newEditModal: any) => {
      if (newEditModal.visible) {
        this.removeKeysListener();
      } else {
        this.addKeysListener();
      }
    }, { immediate: true });
  }

  destroyed() {
    this.removeKeysListener();
  }

  uploadFile(e: FileUploadUploadEvent) {
    const file = (e.files as File[])[0];
    file.text().then((text: string) => {
      const linksData = JSON.parse(text) as LinksData;
      store.commit('setLinksData', linksData);
      this.importModal.visible = false;
    });
  }

  addKeysListener() {
    window.addEventListener('keypress', this.keysListener);
  }

  removeKeysListener() {
    window.removeEventListener('keypress', this.keysListener);
  }

  keysListener(e: KeyboardEvent) {
    switch (e.key) {
      case 'e': {
        this.toggleEditMode(e);
        break;
      }
      case 'j': {
        this.jsonVisible = true;
        break;
      }
      case 'i': {
        this.importModal.visible = true;
        break;
      }
      case 'd': {
        this.confirmDeleteLocalStorage();
        break;
      }
    }
  }

  beforeCreate() {
    store.dispatch('init').then(_ => {
      this.toggleEventListeners(this.editMode);
    });
  }

  tabClick(event: any) {
    store.commit('setTabIndex', event.index);
  }


  toggleEditMode(event: any) {
    this.editMode = !this.editMode;
  }

  getRefId(tabIndex: number | null, sectionIndex: number | null, linkIndex: number | null): string {
    let refId = '';
    refId += tabIndex !== null ? `tab-${tabIndex}` : '';
    refId += sectionIndex !== null ? `-section-${sectionIndex}` : '';
    refId += linkIndex !== null ? `-link-${linkIndex}` : '';
    return refId;
  }

  getElem(tabIndex: number | null, sectionIndex: number | null, linkIndex: number | null): HTMLElement {
    const elemArr = this.$refs[this.getRefId(tabIndex, sectionIndex, linkIndex)] as HTMLElement[];
    return elemArr[0];
  }

  dragstart(event: any, tabIndex: number | null, sectionIndex: number | null, linkIndex: number | null) {
    this.isDragging = true;
    let debug = `tab: ${tabIndex} section: ${sectionIndex} link: ${linkIndex} x: ${event.clientX} y: ${event.clientY}`

    if (linkIndex != null) {
      const link = (this.linksData.tabs[tabIndex as number].sections[sectionIndex as number] as Section).links[linkIndex];
      debug = `dragging link '${link.name}' --- ${debug}`
    } else if (sectionIndex != null) {
      debug = `dragging a section --- ${debug}`
    } else if (tabIndex != null) {
      debug = `dragging a tab --- ${debug}`
    }

    event.stopPropagation();
    console.log(debug);
  }

  dragend(event: any, tabIndex: number | null, sectionIndex: number | null, linkIndex: number | null) {
    this.isDragging = false;
    let debug = '';

    if (linkIndex != null) {
      const link = (this.linksData.tabs[tabIndex as number].sections[sectionIndex as number] as Section).links[linkIndex];

      const targetElement = document.elementFromPoint(event.clientX, event.clientY);

      const targetTabIndex = this.upTheTreeGetId(targetElement, 'tab-');
      const targetSectionIndex = this.upTheTreeGetId(targetElement, 'section-');
      const targetLinkIndex = this.upTheTreeGetId(targetElement, 'link-');

      debug = `dragend link --- targetTabIndex: ${targetTabIndex} targetSectionIndex: ${targetSectionIndex} targetLinkIndex: ${targetLinkIndex}`;

      if (targetTabIndex !== null && targetSectionIndex !== null && targetLinkIndex !== null &&
          tabIndex === targetTabIndex &&
          sectionIndex === targetSectionIndex &&
          linkIndex !== targetLinkIndex) {

        const linksCopy = JSON.parse(JSON.stringify(this.linksData)) as LinksData;
        const section = linksCopy.tabs[tabIndex].sections[sectionIndex] as Section;

        debug = `putting link '${section.links[linkIndex].name}' before link '${section.links[targetLinkIndex].name}'\n${debug}`;

        const linkToMove = section.links.splice(linkIndex, 1);
        const insertIndex = targetLinkIndex > linkIndex ? targetLinkIndex - 1 : targetLinkIndex;
        section.links.splice(insertIndex, 0, linkToMove[0]);
        store.commit('setLinksData', linksCopy);
      }
    } else if (sectionIndex != null) {
      debug = `dragend section --- ${debug}`
    } else if (tabIndex != null) {
      debug = `dragend tab --- ${debug}`
    }

    event.stopPropagation();
    console.log(debug);
  }

  upTheTreeGetId(element: Element | null, idStartsWith: string): number | null {
    if (!element) {
      return null;
    }

    const parentSectionElement = this.upTheTreeById(element, idStartsWith);
    if (parentSectionElement) {
      return parseInt(parentSectionElement.id.substring(idStartsWith.length));
    } else {
      return null;
    }
  }

  upTheTreeById(currentElement: Element | null, targetIdStartsWith: string): Element | null {
    if (currentElement === null) {
      return null;
    }

    if (currentElement.id && currentElement.id.startsWith(targetIdStartsWith)) {
      return currentElement;
    }

    return this.upTheTreeById(currentElement.parentElement, targetIdStartsWith);
  }

  upTheTreeByClass(currentElement: Element | null, targetClass: string): Element | null {
    if (currentElement == null) {
      return null;
    }

    if (targetClass === currentElement.className) {
      return currentElement;
    }

    return this.upTheTreeByClass(currentElement.parentElement, targetClass);
  }

  delete(tabIndex: number, sectionIndex: number | null, linkIndex: number | null) {
    const linksCopy = JSON.parse(JSON.stringify(this.linksData)) as LinksData;
    const tab = linksCopy.tabs[tabIndex];

    if (sectionIndex === null) {
      linksCopy.tabs.splice(tabIndex, 1);
    } else if (linkIndex === null) {
      tab.sections.splice(sectionIndex, 1);
    } else {
      const section = linksCopy.tabs[tabIndex].sections[sectionIndex] as Section;
      section.links.splice(linkIndex, 1);
    }

    store.commit('setLinksData', linksCopy);
  }

  confirmDeleteLocalStorage() {
    this.confirm(this.deleteLocalStorage, 'Delete', 'Delete local storage?');
  }

  confirmDeleteLink(tabIndex: number, sectionIndex: number, linkIndex: number) {
    const self = this;
    const link = this.linksData.tabs[tabIndex].sections[sectionIndex].links[linkIndex];
    this.confirm(function () {
      self.delete(tabIndex, sectionIndex, linkIndex);
    }, 'Delete', `Delete link - ${link.name}?`);
  }

  confirmDeleteSection(tabIndex: number, sectionIndex: number) {
    const self = this;
    const section = this.linksData.tabs[tabIndex].sections[sectionIndex];
    this.confirm(function () {
      self.delete(tabIndex, sectionIndex, null);
    }, 'Delete', `Delete section - ${section.name}?`);
  }

  confirmDeleteTab(tabIndex: number) {
    const self = this;
    const tab = this.linksData.tabs[tabIndex];
    this.confirm(function () {
      self.delete(tabIndex, null, null);
      self.activeIndex = 0;
    }, 'Delete', `Delete tab - ${tab.name}?`);
  }

  confirm(acceptCallback: any, header?: string, message?: string, rejectCallback?: () => void) {
    this.$confirm.require({
      header: header !== undefined ? header : 'Confirmation',
      message: message !== undefined ? message : 'Are you sure?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        acceptCallback();
      },
      reject: () => {
        if (rejectCallback) {
          rejectCallback();
        }
      }
    });
  }

  deleteLocalStorage() {
    store.dispatch('clearStorage');
  }

  openEditLink(tabIndex: number, sectionIndex: number, linkIndex: number | null) {
    this.editLinkModal.tabIndex = tabIndex;
    this.editLinkModal.sectionIndex = sectionIndex;
    this.editLinkModal.linkIndex = linkIndex;
    this.editLinkModal.visible = true;
    this.editLinkModal.title = linkIndex === null ? "Add Link" : "Edit Link"

    if (linkIndex !== null) {
      const tab = this.linksData.tabs[tabIndex];
      const section = tab.sections[sectionIndex] as Section;
      const link = section.links[linkIndex] as Link;
      this.editLinkModal.name = link.name;
      this.editLinkModal.url = link.url;
      this.editLinkModal.confirmButtonName = 'Update';
    } else {
      this.editLinkModal.name = '';
      this.editLinkModal.url = '';
      this.editLinkModal.confirmButtonName = 'Add';
    }
  }

  openEditSection(tabIndex: number, sectionIndex: number | null) {
    this.editSectionModal.tabIndex = tabIndex;
    this.editSectionModal.sectionIndex = sectionIndex;
    this.editSectionModal.visible = true;
    this.editSectionModal.title = sectionIndex === null ? "Add Section" : "Edit Section"

    if (sectionIndex !== null) {
      const tab = this.linksData.tabs[tabIndex];
      const section = tab.sections[sectionIndex] as Section;
      this.editSectionModal.name = section.name;
      this.editSectionModal.desc = section.description;
      this.editSectionModal.confirmButtonName = 'Update';
    } else {
      this.editSectionModal.name = '';
      this.editSectionModal.desc = '';
      this.editLinkModal.confirmButtonName = 'Add';
    }
  }

  saveLink() {
    const linksCopy = JSON.parse(JSON.stringify(this.linksData)) as LinksData;
    const section = linksCopy
        .tabs[this.editLinkModal.tabIndex as number]
        .sections[this.editLinkModal.sectionIndex as number] as Section;
    const link = new Link(this.editLinkModal.name, this.editLinkModal.url);

    if (this.editLinkModal.linkIndex !== null) {
      section.links[this.editLinkModal.linkIndex] = link;
    } else {
      section.links.push(link);
    }

    store.commit('setLinksData', linksCopy);
    this.editLinkModal.visible = false;
  }

  saveSection() {
    const linksCopy = JSON.parse(JSON.stringify(this.linksData)) as LinksData;
    const m = this.editSectionModal;
    const tab = linksCopy.tabs[m.tabIndex as number]


    if (m.sectionIndex !== null) {
      const sectionLinks = tab.sections[m.sectionIndex].links;
      tab.sections[m.sectionIndex] = new Section(m.name, sectionLinks, m.desc);
    } else {
      tab.sections.push(new Section(m.name, [], m.desc));
    }

    store.commit('setLinksData', linksCopy);
    this.editLinkModal.visible = false;
  }

}

</script>

<style>
.form-label {
  width: 10rem;
}
</style>
