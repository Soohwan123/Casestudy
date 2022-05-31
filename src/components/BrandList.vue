<template>
  <div
    class="text-left"
    :style="{
      'background-image':
        'url(https://www.lifeofpix.com/wp-content/uploads/2018/04/275-ake6418-jj-jite-001-1600x1000.jpg)',
    }"
  >
    <q-page>
      <div class="text-center q-mt-lg">
        <q-avatar style="height: 125px; width: 180px">
          <img :src="`/img/Laptop.png`" />
        </q-avatar>
        <div
          class="text-bold"
          v-bind:style="{ color: ' #203245', fontSize: 40 + 'px' }"
        >
          Our Brands
        </div>
        <div class="text-center text-positive q-mt-lg">{{ state.status }}</div>
        <q-select
          rounded
          standout
          class="q-mt-lg q-ml-lg text-center"
          v-if="state.brands.length > 0"
          style="
            width: 50vw;
            margin-bottom: 4vh;
            text-decoration-color: antiquewhite;
          "
          :option-value="'id'"
          :option-label="'name'"
          v-model="state.selectedBrandId"
          :options="state.brands"
          label="Select a Brand"
          label-color="warning"
          emit-value
          map-options
          @update:model-value="loadProducts()"
        />

        <div
          class="text-h5 text-bold text-positive"
          v-if="state.products.length > 0"
        >
          {{ state.selectedBrand.name }} ITEMS
        </div>
        <q-scroll-area style="height: 55vh">
          <q-card class="q-ma-md">
            <q-list separator>
              <q-item
                clickable
                @click="selectProduct(product.id)"
                v-for="product in state.products"
                :key="product.id"
              >
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
      <q-dialog
        v-model="state.productSelected"
        transition-show="rotate"
        transition-hide="rotate"
      >
        <q-card class="text-center">
          <q-card-actions align="right">
            <q-btn
              flat
              label="X"
              color="primary"
              v-close-popup
              class="text-h5"
            />
          </q-card-actions>
          <q-card-section class="q-pa-none text-center">
            <q-avatar style="height: 180px; width: 260px" square>
              <img
                :src="`/img/${state.selectedProduct.graphicName}`"
                class="item-image"
              />
            </q-avatar>
          </q-card-section>
          <q-item-section class="text-h5 text-center text-primary">
            {{ state.selectedProduct.productName }} -
            {{ formatCurrency(state.selectedProduct.msrp) }}
          </q-item-section>
          <q-card-section>
            {{ state.selectedProduct.description }}
          </q-card-section>
          <q-card-section>
            <div class="row">
              <div class="col-2 q-mr-sm">
                <q-input
                  v-model.number="state.qty"
                  type="number"
                  filled
                  style="max-width: 15vw"
                  placeholder="qty"
                  hint="Qty"
                  dense
                />
              </div>
              <div class="col-4 q-mr-sm">
                <q-btn
                  color="primary"
                  label="Add To Cart"
                  :disable="state.qty < 0"
                  @click="addToCart()"
                />
              </div>
              <div class="col-4">
                <q-btn
                  color="primary"
                  label="View Cart"
                  style="height: 56px"
                  :disable="state.cart.length < 1"
                  @click="viewCart()"
                />
              </div>
            </div>
          </q-card-section>
          <q-card-section class="text-center text-positive">
            {{ state.dialogStatus }}
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-page>
  </div>
</template>

<script>
import { formatCurrency } from "../utils/formatutils";
import { reactive, onMounted } from "vue";
import { fetcher } from "../utils/apiutil";
import { useRouter } from "vue-router";
export default {
  setup() {
    const router = useRouter();
    onMounted(() => {
      loadBrands();
    });
    let state = reactive({
      status: "",
      brands: [],
      products: [],
      selectedBrand: {},
      selectedBrandId: "",
      selectedProduct: {},
      dialogStatus: "",
      productSelected: false,
      qty: 0,
      cart: [],
      order: [],
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

    const selectProduct = async (productid) => {
      try {
        // q-item click sends us the id, so we need to find the object
        state.selectedProduct = state.products.find(
          (item) => item.id === productid
        );
        state.productSelected = true;
        state.dialogStatus = "";
        if (sessionStorage.getItem("cart")) {
          state.cart = JSON.parse(sessionStorage.getItem("cart"));
        }
      } catch (err) {
        console.log(err);
        state.status = `Error has occured: ${err.message}`;
      }
    };
    const addToCart = () => {
      let index = -1;
      if (state.cart.length > 0) {
        index = state.cart.findIndex(
          // is item already on the cart
          (item) => item.id === state.selectedProduct.id
        );
      }
      if (state.qty > 0) {
        index === -1 // add
          ? state.cart.push({
              id: state.selectedProduct.id,
              qty: state.qty,
              item: state.selectedProduct,
            })
          : (state.cart[index] = {
              // replace
              id: state.selectedProduct.id,
              qty: state.qty,
              item: state.selectedProduct,
            });
        state.dialogStatus = `${state.qty} product(s) added`;
      } else {
        index === -1 ? null : state.cart.splice(index, 1); // remove
        state.dialogStatus = `product(s) removed`;
      }
      sessionStorage.setItem("cart", JSON.stringify(state.cart));
      state.qty = 0;
    };

    const viewCart = () => {
      router.push("cart");
    };

    return {
      state,
      loadProducts,
      selectProduct,
      addToCart,
      formatCurrency,
      viewCart,
    };
  },
};
</script>
