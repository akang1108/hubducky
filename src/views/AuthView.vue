<template>
  <div>
    hello!<br>
    <router-link to="/">Link to Home</router-link><br>
    {{ token }}
  </div>
</template>

<script lang="ts">

import { Options, Vue } from 'vue-class-component';
import {Dropbox, users} from 'dropbox';
import store from "@/store";
import {Data} from "@/store/model";

@Options({
  components: {
  },
})
export default class AuthView extends Vue {
  token = '';
  dbx: Dropbox | null = null;

  beforeCreate() {
    store.dispatch('init');
  }

  get ducky() {
    return store.state.ducky;
  }

  created() {
    const hash = new URLSearchParams(location.hash.substring(1));
    const token = hash.get('access_token') as string;

    if (token != null) {
      this.dbx = new Dropbox({ clientId: import.meta.env.VITE_DROPBOX_CLIENT_ID, accessToken: token });
      this.dbx.filesUpload({path: '/ducky.json', contents: JSON.stringify(this.ducky)});
    }
  }
}

</script>

<style>
</style>
