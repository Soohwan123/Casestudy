<template>
  <q-page>
    <div class="text-center q-mt-lg">
      <q-avatar style="height: 125px; width: 180px">
        <img :src="`/img/Laptop.png`" />
      </q-avatar>
      <div v-bind:style="{ color: ' #1976D2', fontSize: 40 + 'px' }">
        Our Brands
      </div>
      <div class="text-positive q-mt-lg">{{ state.status }}</div>
      <q-select
        class="q-mt-lg q-ml-lg"
        v-if="state.brands.length > 0"
        style="width: 50vw; margin-bottom: 4vh; background-color: #fff"
        :option-value="'id'"
        :option-label="'name'"
        v-model="state.selectedBrandId"
        :options="state.brands"
        label="Select a Brand"
        emit-value
        map-options
        @update:model-value="loadProducts()"
      />

      <div
        class="text-h5 text-bold text-center text-info"
        v-if="state.products.length > 0"
      >
        {{ state.selectedBrand.name }} ITEMS
      </div>
      <q-scroll-area style="height: 55vh">
        <q-card class="q-ma-md">
          <q-list separator>
            <q-item v-for="product in state.products" :key="product.id">
              <q-item-section avatar>
                <q-avatar style="height: 125px; width: 180px" square>
                  <img :src="`/img/${product.graphicName}`" />
                </q-avatar>
              </q-item-section>
              <q-item-section class="text-bold text-center text-primary">
                {{ product.productName }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </q-scroll-area>
    </div>
  </q-page>
</template>

<script>
import { reactive, onMounted } from "vue";
import { fetcher } from "../utils/apiutil";
export default {
  setup() {
    onMounted(() => {
      loadBrands();
    });
    let state = reactive({
      status: "",
      brands: [],
      products: [],
      selectedBrand: {},
      selectedBrandId: "",
    });

    const loadBrands = async () => {
      try {
        state.status = "loading brands...";
        const payload = await fetcher(`Brand`);
        if (payload.error === undefined) {
          state.brands = payload;
          state.status = `loaded ${state.brands.length} brands`;
        } else {
          state.status = payload.error;
        }
      } catch (err) {
        console.log(err);
        state.status = `Error has occured: ${err.message}`;
      }
    };

    const loadProducts = async () => {
      try {
        state.selectedBrand = state.brands.find(
          (brand) => brand.id === state.selectedBrandId
        );
        state.status = `finding products for brand ${state.selectedBrand}...`;
        state.products = await fetcher(`Product/${state.selectedBrand.id}`);
        state.status = `loaded ${state.products.length} products for
${state.selectedBrand.name}`;
      } catch (err) {
        console.log(err);
        state.status = `Error has occured: ${err.message}`;
      }
    };

    return {
      state,
      loadProducts,
    };
  },
};
</script>
