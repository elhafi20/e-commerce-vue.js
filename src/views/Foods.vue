<template>
  <div class="foods">
    <Navbar />
    <div class="container">
      <div class="row mt-4">
        <div class="col-12 text-center text-md-start">
          <h2>Daftar <strong>Menu</strong></h2>
        </div>
      </div>

      <!-- Input Search -->
      <div class="row justify-content-center mt-3">
        <div class="col-md-6 col-sm-10">
          <div class="input-group mb-3">
            <input
              v-model="search"
              type="text"
              class="form-control"
              placeholder="Cari Menu Favorit Anda..."
              aria-label="Cari"
            />
            <span class="input-group-text">
              <b-icon-search></b-icon-search>
            </span>
          </div>
        </div>
      </div>

      <!-- Daftar Produk -->
      <div class="row justify-content-center">
        <div
          class="col-12 col-sm-6 col-md-4 col-lg-3 mt-4"
          v-for="product in filteredProducts"
          :key="product.id"
        >
          <CardProduct :product="product" class="responsive-card">
            <!-- Pastikan slot sesuai dengan yang digunakan di CardProduct -->
            <template #pesan>
              <router-link class="btn btn-primary text-start" :to="`/foods/${product.id}`" style="background-color:#a04000; border:none;">
                <b-icon-cart></b-icon-cart> Pesan
              </router-link>
            </template>
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
  computed: {
    filteredProducts() {
      const searchQuery = this.search.trim().toLowerCase();
      return searchQuery
        ? this.products.filter((product) =>
            product.nama.toLowerCase().includes(searchQuery)
          )
        : this.products;
    },
  },
  methods: {
    async fetchProducts() {
      try {
        const productsRef = collection(db, "products");
        const querySnapshot = await getDocs(productsRef);
        this.products = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    },
  },
  mounted() {
    this.fetchProducts();
  },
};
</script>

<style scoped>
/* Responsif Card */
.responsive-card img {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 10px;
}

/* Produk Detail */
.product-details {
  padding: 10px;
}

.product-details h5 {
  font-size: 1.2rem;
  font-weight: bold;
}

.product-details p {
  font-size: 1rem;
  margin-bottom: 8px;
}

/* Responsif Layout */
@media (max-width: 576px) {
  .foods h2 {
    font-size: 1.5rem;
    text-align: center;
  }
  .responsive-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 768px) {
  .foods h2 {
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
