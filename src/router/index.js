import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from '@/views/GoodsList';
import Cart from '@/views/cart';
import Address from '@/views/address';
import OrderConfirm from "@/views/OrderConfirm"
import OrderSuccess from "@/views/OrderSuccess"

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GoodsList',
      component: GoodsList
    },{
      path: '/cart',
      name: 'cart',
      component: Cart
    },{
      path: '/address',
      name: 'address',
      component: Address
    },{
      path: '/orderConfirm',
      name: 'OrderConfirm',
      component: OrderConfirm
    },{
      path: "/orderSuccess",
      name: "orderSuccess",
      component: OrderSuccess
    }
  ]
})
