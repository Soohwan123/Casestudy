<template>
  <div
    class="text-left"
    :style="{
      'background-image':
        'url(https://www.lifeofpix.com/wp-content/uploads/2018/04/275-ake6418-jj-jite-001-1600x1000.jpg)',
    }"
  >
    <div class="text-center">
      <q-avatar style="height: 70px; width: 110px; margin-top: 20px">
        <img :src="`/img/Laptop.png`" />
      </q-avatar>
    </div>
    <div class="text-h4 text-center q-mt-md q-mb-md">Logout</div>
    <div class="text-title2 text-center text-positive text-bold q-mt-sm">
      Goodbye!
    </div>
    <div style="margin-top: 800px">.</div>
  </div>
</template>
<script>
import { onMounted } from "vue";
export default {
  setup() {
    onMounted(() => {
      sessionStorage.clear();
    });
    return {};
  },
};
</script>
