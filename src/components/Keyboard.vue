<!--<template>-->
<!--  <div>enabled: {{ enabled }}</div>-->
<!--</template>-->

<!--<script lang="ts">-->

<!--import { Vue } from 'vue-class-component';-->
<!--import {Component, Prop, Watch} from "vue-property-decorator";-->
<!--import { watch } from 'vue';-->
<!--import {KeyboardInput} from "./keyboard-model";-->


<!--export default class Keyboard extends Vue {-->
<!--  @Prop({'default': true}) enabled!: boolean;-->
<!--  @Prop({'default': new KeyboardInput()}) input!: KeyboardInput;-->

<!--  // created() {-->
<!--  //   watch([this.enabled], (newValues: any[]) => {-->
<!--  //     console.log('watch-created', this.enabled, newValues);-->
<!--  //   });-->
<!--  // }-->
<!--  @Watch('enabled')-->
<!--  watchEnabled(newVal: any) {-->
<!--    console.log('watcher newVal:' + newVal);-->
<!--  }-->

<!--  // watch() {-->
<!--  //   return {-->
<!--  //     enabled(newVal: boolean) {-->
<!--  //       console.info('watching', newVal);-->
<!--  //     }-->
<!--  //   }-->
<!--  // }-->

<!--  toggleListener() {-->
<!--    if (this.enabled) {-->
<!--      window.addEventListener('keypress', this.listenerAction);-->
<!--    } else {-->
<!--      window.removeEventListener('keypress', this.listenerAction);-->
<!--    }-->
<!--  }-->

<!--  listenerAction(e: KeyboardEvent) {-->
<!--    this.input.mapping.forEach((callback: () => void, key: string) => {-->
<!--      if (e.key === key) {-->
<!--        callback();-->
<!--      }-->
<!--    });-->
<!--  }-->
<!--}-->

<!--</script>-->

<!--<style>-->
<!--</style>-->
