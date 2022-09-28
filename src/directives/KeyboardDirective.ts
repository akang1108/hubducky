import { Directive, DirectiveBinding, VNode } from 'vue'

export class KeyboardDirectiveInput {
  active: boolean;
  name: string;
  constructor(active: boolean, name: string) {
    this.active = active;
    this.name = name;
  }
}

const KeyboardDirective = <Directive<HTMLElement, KeyboardDirectiveInput>>{
  // called before bound element's attributes
  // or event listeners are applied
  created(el: HTMLElement, binding: DirectiveBinding<KeyboardDirectiveInput>, vnode: VNode<any, HTMLElement>): void {
    // see below for details on arguments
    console.log('KeyboardDirective created')
    console.log('binding', binding.value);
    console.log('binding', binding);

    // this.$watch(binding.value, function(newVal: any) {
    //   console.info('watched', newVal);
    // });
    // binding.watch = {
    //   'binding.value': function(newVal: any, oldVal: any) {
    //     console.info('watched', newVal);
    //   }
    // }
  },
  // called after the parent component and
  // all of its children have updated
  updated(el: HTMLElement, binding: DirectiveBinding<KeyboardDirectiveInput>, vnode: VNode<any, HTMLElement>): void {
    console.log('KeyboardDirective updated', binding.value);
  }
}
//Directive<HTMLElement, KeyboardDirectiveInput> {

export default KeyboardDirective;
