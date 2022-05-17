<template>
  <div class="text-center">
    <q-avatar style="height: 70px; width: 110px; margin-top: 20px">
      <img :src="`/img/Laptop.png`" />
    </q-avatar>
    <div class="text-h4 q-mt-md">Cart Contents</div>
    <q-avatar
      class="q-mt-md"
      style="height: 100px; width: 110px; margin-right: 15px"
      square
    >
      <img :src="`/img/cart.jpg`" />
    </q-avatar>
    <div class="text-h6 text-primary">{{ state.status }}</div>
  </div>
  <div
    v-if="state.cart.length > 0"
    style="width: 90vw; margin-left: 5vw; margin-top: 1vh"
  >
    <div>
      <q-item style="bottom: -2vh">
        <q-item-section class="col-5 q-ml-sm text-h7 text-bold"
          >Name
        </q-item-section>
        <q-item-section class="col-1 q-ml-sm text-h7 text-bold">
          Qty
        </q-item-section>
        <q-item-section class="q-ml-sm text-h7 text-bold">
          MSRP
        </q-item-section>
        <q-item-section class="q-ml-sm text-h7 text-bold">
          Extended
        </q-item-section>
      </q-item>
      <q-scroll-area style="height: 40vh">
        <q-card class="q-ma-md">
          <q-list separator>
            <q-item v-for="item in state.cart" :key="item.id" clickable>
              <q-item-section class="text-left">
                {{ item.item.productName }}
              </q-item-section>
              <q-item-section class="text-right">
                {{ item.qty }}
              </q-item-section>
              <q-item-section class="text-right">
                {{ formatCurrency(item.item.msrp) }}
              </q-item-section>
              <q-item-section class="text-right">
                {{ formatCurrency(item.item.msrp * item.qty) }}
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section
                class="text-h7 text-right text-bold"
              ></q-item-section>
              <q-item-section class="text-left"></q-item-section>
              <q-item-section class="text-h7 text-right text-bold"
                >Sub:
              </q-item-section>
              <q-item-section class="text-right"
                >{{ formatCurrency(state.sub) }}
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section
                class="text-h7 text-right text-bold"
              ></q-item-section>
              <q-item-section class="text-left"></q-item-section>
              <q-item-section class="text-h7 text-right text-bold"
                >Tax(13%):
              </q-item-section>
              <q-item-section class="text-right"
                >{{ formatCurrency(state.tax) }}
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section
                class="text-h7 text-right text-bold"
              ></q-item-section>
              <q-item-section class="text-left"></q-item-section>
              <q-item-section class="text-h7 text-right text-bold text-primary"
                >Total:
              </q-item-section>
              <q-item-section class="text-right text-primary text-bold"
                >{{ formatCurrency(state.sub + state.tax) }}
              </q-item-section>
            </q-item>
          </q-list>
          <div
            style="
              margin-bottom: 15px;
              margin-right: 10px;
              padding: 0px 0 10px 0;
            "
          >
            <div class="col-4 text-right">
              <q-btn color="primary" label="EMPTY CART" @click="clearCart()" />
            </div>
          </div>
        </q-card>
      </q-scroll-area>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted } from "vue";
import { formatCurrency } from "../utils/formatutils";

export default {
  setup() {
    onMounted(() => {
      if (sessionStorage.getItem("cart")) {
        state.cart = JSON.parse(sessionStorage.getItem("cart"));
        state.cart.forEach((cartItem) => {
          state.sub += cartItem.item.msrp * cartItem.qty;
          state.tax += cartItem.item.msrp * cartItem.qty * 0.13;
        });
      } else {
        state.cart = [];
      }
    });

    let state = reactive({
      status: "",
      name: "",
      sub: 0,
      tax: 0,
      total: 0,
      cart: [],
    });

    const clearCart = () => {
      sessionStorage.removeItem("cart");
      state.cart = [];
      state.status = "cart emptied";
    };

    return {
      state,
      clearCart,
      formatCurrency,
    };
  },
};
</script>
