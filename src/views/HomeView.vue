<template>
  <div class="home">
    <Navbar />
    <div class="container">
      <Hero />

      <div class="row mt-4">
        <div class="col-3 text-start ps-0">
          <h2>
            Best
            <strong>Foods</strong>
          </h2>
        </div>
        
      </div>

      <div class="row">
      <div class="col-6 col-md-3 mt-4" v-for="product in products" :key="product.id">
        <CardProduct :product="product">

        </CardProduct>
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
import { db } from "@/firebase"; 

export default {
  name: "HomeView",
  components: {
    Navbar,
    Hero,
    CardProduct,
  },
  data() {
    return {
      products: [],
    };
  },
  methods: {
    async fetchProducts() {
  try {
    const productsRef = collection(db, "best-products"); 
    const querySnapshot = await getDocs(productsRef);
    this.products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    
  } catch (error) {
    console.error("Gagal mengambil data produk: ", error);
  }
},
  },
  mounted() {
    this.fetchProducts(); 
  },
};
</script>

<style>
/* Tambahkan styling sesuai kebutuhan */
</style>
