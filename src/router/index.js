import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Foods from '../views/Foods.vue'
import FoodDetail from '@/views/FoodDetail.vue'
import Keranjang from '@/views/Keranjang.vue'
import PesananSukses from '@/views/PesananSukses.vue'
import BestFoodDetail from '../views/BestFoodDetail.vue'
import LihatOrder from '../views/LihatOrder.vue'
import TambahFood from '../views/admin/TambahFood.vue'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import Dashboard from '../views/admin/dashboard.vue'
import SearchPesanan from '../views/SearchPesanan.vue'
import Order from '../views/admin/Order.vue'
import { getAuth } from "firebase/auth";

import { getFirestore, doc, getDoc } from "firebase/firestore";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/foods',
    name: 'Foods',
    component: Foods
  },
  {
    path: '/foods/:id',
    name: 'FoodDetail',
    component: FoodDetail
  },
  {
    path: '/bestfoods/:id',
    name: 'BestFoods',
    component: BestFoodDetail
  },
  {
    path: '/keranjang',
    name: 'Keranjang',
    component: Keranjang
  },
  {
    path: '/pesanan-sukses',
    name: 'PesananSukses',
    component: PesananSukses
  },
  {
    path: '/lihat-pesanan',
    name: 'LihatOrder',
    component: LihatOrder
  },
  {
    path: '/tambah-food',
    name: 'TambahFood',
    component: TambahFood,

  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiresAdmin: true
    }
  },
  {
    path: '/order',
    name: 'Order',
    component: Order,
    meta: {
      requiresAdmin: true
    }
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: "/search-pesanan",
    name: "SearchPesanan",
    component: SearchPesanan,
  },

  
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


router.beforeEach(async (to, from, next) => {
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);

  if (requiresAdmin) {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      // Jika pengguna belum login, arahkan ke halaman login
      return next({ name: "Login" })
    }

    // Cek peran pengguna di Firestore
    const db = getFirestore();
    const userDoc = doc(db, "users", user.uid);
    const userSnap = await getDoc(userDoc);

    if (userSnap.exists() && userSnap.data().role === "admin") {
      // Jika peran admin, izinkan akses
      next();
    } else {
      // Jika bukan admin, redirect ke dashboard
      alert("Anda tidak memiliki akses ke halaman ini.");
      next({ name: "Dashboard" });
    }
  } else {
    // Jika tidak membutuhkan admin, lanjutkan
    next();
  }
});


export default router
