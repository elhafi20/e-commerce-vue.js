<template>
  <div class="home">
    <Navbar />
    <div class="container">
      <Hero />

      <div class="row mt-4">
        <div class="col-12 text-center text-md-start ps-md-0">
          <h2>
            Best <strong>Menu</strong>
          </h2>
        </div>
      </div>

      <div class="row justify-content-center">
        <div
          class="col-12 col-sm-6 col-md-4 col-lg-3 mt-4"
          v-for="product in products"
          :key="product.id"
        >
          <CardProduct :product="product" class="responsive-card" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
.responsive-card img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

@media (max-width: 576px) {
  .home h2 {
    font-size: 1.5rem;
    text-align: center;
  }
  .responsive-card {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 768px) {
  .home h2 {
    font-size: 1.8rem;
    text-align: center;
  }
  .responsive-card {
    padding: 10px;
  }
}

@media (max-width: 1024px) {
  .responsive-card {
    max-width: 90%;
    margin: 0 auto;
  }
}
</style>