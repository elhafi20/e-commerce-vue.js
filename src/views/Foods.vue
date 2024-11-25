<template>
  <div>
    <Navbar />
    <div class="container">
      <div class="row mt-4">
        <div class="col">
          <h2>Daftar <strong>Makanan</strong></h2>
        </div>
      </div>

      <div class="row mt-3">
        <div class="col">
          <div class="input-group mb-3">
            <input
              v-model="search"
              type="text"
              class="form-control"
              placeholder="Cari Makanan Favorit Anda..."
              aria-label="Cari"
              aria-describedby="basic-addon1"
              @keyup="searchFood"
            />
            <div class="input-group-prepend">
              <span class="input-group-text" id="basic-addon1">
                <b-icon-search></b-icon-search>
              </span>
            </div>
          </div>
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
import Navbar from "@/components/Navbar.vue";
import CardProduct from "@/components/CardProduct.vue";
import { db } from "@/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default {
  name: "Foods",
  components: {
    Navbar,
    CardProduct,
  },
  data() {
    return {
      products: [],
      search: '',
    };
  },
  methods: {
    setProducts(data) {
      this.products = data;
    },
    async searchFood() {
      if (this.search.trim() === '') {
        this.fetchProducts(); // Fetch all products if the search is empty
      } else {
        try {
          const productsRef = collection(db, "products");
          const q = query(
            productsRef,
            where("nama", "==", this.search)
          );
          const querySnapshot = await getDocs(q);
          const foundProducts = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          this.setProducts(foundProducts);
        } catch (error) {
          console.error("Error searching products: ", error);
        }
      }
    },
    async fetchProducts() {
      try {
        const productsRef = collection(db, "products");
        const querySnapshot = await getDocs(productsRef);
        const allProducts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        this.setProducts(allProducts);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    },
  },
  mounted() {
    this.fetchProducts(); // Fetch products on mount
  },
};
</script>

<style>
</style>
