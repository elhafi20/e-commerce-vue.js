<template>
  <div class="home">
    <Navbar />
    <div class="container">
      <Hero />

      <div class="row mt-4">
        <div class="col">
          <h2>
            Best
            <strong>Foods</strong>
          </h2>
        </div>
        <div class="col">
          <router-link to="/foods" class="btn btn-success float-right">
            <b-icon-eye></b-icon-eye>Lihat Semua
          </router-link>
        </div>
      </div>

      <div class="row mb-4">
        <div
          class="col-md-4 mt-4"
          v-for="product in products"
          :key="product.id"
        >
          <CardProduct :product="product" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Navbar from "@/components/Navbar.vue";
import Hero from "@/components/Hero.vue";
import CardProduct from "@/components/CardProduct.vue";

import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase"; // Import konfigurasi Firebase Anda

export default {
  name: "HomeView",
  components: {
    Navbar,
    Hero,
    CardProduct,
  },
  data() {
    return {
      products: [], // Daftar produk dari Firestore
    };
  },
  methods: {
    async fetchProducts() {
  try {
    const productsRef = collection(db, "best-products"); // Nama koleksi di Firestore
    const querySnapshot = await getDocs(productsRef);
    this.products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(this.products);  // Debugging, pastikan data sudah benar
  } catch (error) {
    console.error("Gagal mengambil data produk: ", error);
  }
},
  },
  mounted() {
    this.fetchProducts(); // Ambil data dari Firestore ketika komponen dimuat
  },
};
</script>

<style>
/* Tambahkan styling sesuai kebutuhan */
</style>
