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
      <div class="text-h4 q-mt-md text-primary text-bold">Cart Contents</div>
      <q-avatar
        class="q-mt-md"
        style="height: 100px; width: 110px; margin-right: 15px"
        square
      >
        <img :src="`/img/cart.jpg`" />
      </q-avatar>
      <div class="q-mt-lg text-h6 text-white" style="margin-top: 40px">
        {{ state.status }}
      </div>
    </div>
    <div
      v-if="state.cart.length > 0"
      style="width: 90vw; margin-left: 5vw; margin-top: 1vh"
    >
      <div style="background-color: azure">
        <q-item style="bottom: -2vh">
          <q-item-section
            class="col-5 q-ml-sm text-h7 text-bold"
            style="margin-left: 16px"
            >Name
          </q-item-section>
          <q-item-section
            class="q-ml-sm text-h7 text-bold"
            style="margin-left: -10px"
          >
            Qty
          </q-item-section>
          <q-item-section
            class="q-ml-sm text-h7 text-bold"
            style="margin-left: -40px"
          >
            MSRP
          </q-item-section>
          <q-item-section
            class="q-ml-sm text-h7 text-bold"
            style="margin-left: -20px; margin-right: -16px"
          >
            Extended
          </q-item-section>
        </q-item>
        <q-scroll-area style="height: 40vh">
          <q-card class="q-ma-md">
            <q-list separator>
              <q-item v-for="item in state.cart" :key="item.id" clickable>
                <q-item-section class="text-left" style="font-size: 12px">
                  {{ item.item.productName }}
                </q-item-section>
                <q-item-section class="text-right" style="font-size: 12px">
                  {{ item.qty }}
                </q-item-section>
                <q-item-section class="text-right" style="font-size: 12px">
                  {{ formatCurrency(item.item.msrp) }}
                </q-item-section>
                <q-item-section class="text-right" style="font-size: 12px">
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
                <q-item-section
                  class="text-h7 text-right text-bold text-secondary"
                  >Total:
                </q-item-section>
                <q-item-section class="text-right text-secondary text-bold"
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
                <q-btn
                  class="q-mr-md"
                  color="primary"
                  label="CHECKOUT"
                  :disable="state.cart.length < 1"
                  @click="saveCart()"
                />
                <q-btn
                  color="negative"
                  label="EMPTY CART"
                  @click="clearCart()"
                />
              </div>
            </div>
          </q-card>
        </q-scroll-area>
      </div>
    </div>
    <div style="margin-top: 400px">.</div>
  </div>
</template>

<script>
import { reactive, onMounted } from "vue";
import { formatCurrency } from "../utils/formatutils";
import { poster } from "../utils/apiutil";

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

    const saveCart = async () => {
      let customer = JSON.parse(sessionStorage.getItem("customer"));
      let cart = JSON.parse(sessionStorage.getItem("cart"));
      try {
        state.status = "sending cart info to server";
        let cartHelper = { email: customer.email, selections: cart };
        let payload = await poster("order", cartHelper);
        state.status = payload;
        if (payload.indexOf("not") > 0) {
          state.status = payload;
        } else {
          clearCart();
          state.status = payload;
        }
      } catch (err) {
        console.log(err);
        state.status = `Error add cart: ${err}`;
      }
    };

    return {
      state,
      clearCart,
      formatCurrency,
      saveCart,
    };
  },
};
</script>
