const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      // Home Page
      {
        path: "/",
        name: "home",
        component: () => import("pages/HomePage.vue"),
      },

      // DataUtil
      {
        path: "/datautil",
        name: "datautil",
        component: () => import("components/DataUtil.vue"),
      },

      // Brands
      {
        path: "/brands",
        name: "brands",
        component: () => import("components/BrandList.vue"),
      },

      //Carts
      {
        name: "cart",
        path: "/cart",
        component: () => import("components/CartContainer.vue"),
      },

      //Register
      {
        name: "register",
        path: "/register",
        component: () => import("components/RegisterCustomer.vue"),
      },

      //Login
      {
        name: "login",
        path: "/login",
        component: () => import("components/LoginCustomer.vue"),
      },

      //logout
      {
        name: "logout",
        path: "/logout",
        component: () => import("components/LogoutCustomer.vue"),
      },

      //Orders
      {
        name: "orders",
        path: "/orders",
        component: () => import("components/OrderList.vue"),
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];
export default routes;
