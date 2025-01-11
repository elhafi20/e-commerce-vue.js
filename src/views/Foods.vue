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

      <div class="row">
      <div class="col-md-4 mt-4" v-for="product in products" :key="product.id">
        <CardProduct :product="product">
          <router-link
            class="btn btn-success"
            :to="`/foods/${product.id}`"
            slot="pesan" 
          >
            <b-icon-cart></b-icon-cart> Pesan
          </router-link>
        </CardProduct>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import CardProduct from "@/components/CardProduct.vue";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";

export default {
  name: "Foods",
  components: {
    Navbar,
    CardProduct,
  },
  data() {
    return {
      products: [],
      search: "",
    };
  },
  methods: {
    async searchFood() {
      const searchQuery = this.search.trim().toLowerCase(); // Normalisasi pencarian
      if (searchQuery === "") {
        // Tampilkan semua produk jika pencarian kosong
        this.fetchProducts();
      } else {
        try {
          // Ambil semua data produk
          const productsRef = collection(db, "products");
          const querySnapshot = await getDocs(productsRef);
          const allProducts = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Filter produk berdasarkan substring
          const filteredProducts = allProducts.filter((product) =>
            product.nama.toLowerCase().includes(searchQuery)
          );

          this.setProducts(filteredProducts); // Set produk hasil filter
        } catch (error) {
          console.error("Error searching products: ", error);
        }
      }
    },
    async fetchProducts() {
      try {
        const productsRef = collection(db, "products");
        const querySnapshot = await getDocs(productsRef);
        const allProducts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        this.setProducts(allProducts);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    },
    setProducts(data) {
      this.products = data;
    },
  },
  mounted() {
    this.fetchProducts(); // Fetch products on mount
  },
};
</script>

<style></style>
