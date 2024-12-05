<template>
  <div class="food-detail">
    <Navbar />
    <div class="container">
      <!--Breadcrumb-->
      <div class="row mt-4">
        <div class="col">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <router-link to="/" class="text-dark">Home</router-link>
              </li>
              <li class="breadcrumb-item">
                <router-link to="/foods" class="text-dark">Foods</router-link>
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                Food Order
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div class="row mt-3">
        <div class="col-md-6">
          <img
          :src="product.gambar"
      alt="Gambar Produk"
      class="img-fluid shadow"
          />
        </div>
        <div class="col-md-6">
          <h2>
            <strong>{{ product.nama }}</strong>
          </h2>
          <hr />
          <h4>
            Harga : <strong> Rp {{ product.harga }}</strong>
          </h4>
          <form class="mt-4" v-on:submit.prevent>
            <div class="form-group">
              <label for="jumlah-pemesanan">Jumlah Pesanan</label>
              <input
                type="number"
                class="form-control"
                v-model="pesan.jumlah_pemesanan"
              />
            </div>
            <div class="form-group">
              <label for="keterangan">keterangan</label>
              <textarea
                v-model="pesan.keterangan"
                class="form-control"
                placeholder="Keterangan"
              ></textarea>
            </div>
            <button type="submit" class="btn btn-success" @click="pemesanan">
              <b-icon-cart></b-icon-cart>Pesan
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import firebaseApp from "@/firebase"; // Import aplikasi Firebase
import { getFirestore, doc, getDoc, collection, addDoc } from "firebase/firestore";
export default {
  name: "FoodDetail",
  components: {
    Navbar,
  },
  data() {
    return {
      product: {}, // Data produk
      pesan: {
        jumlah_pemesanan: 0,
        keterangan: "",
      },
    };
  },
  methods: {
    async setProducts(productId) {
  try {
    const db = getFirestore(firebaseApp); // Pastikan firebaseApp sudah diinisialisasi
    const productRef = doc(db, "products", productId); // Referensi dokumen di Firestore
    const productSnap = await getDoc(productRef); // Ambil dokumen

    if (productSnap.exists()) {
      this.product = productSnap.data(); // Simpan data produk
      console.log("Product data:", this.product); // Debugging data
    } else {
      console.error("Product not found!");
    }
  } catch (error) {
    console.error("Error fetching product:", error);
  }
},
    async pemesanan() {
      if (this.pesan.jumlah_pemesanan > 0) {
        try {
          const db = getFirestore(firebaseApp); // Gunakan aplikasi Firebase
          const cartCollection = collection(db, "keranjang");

          // Data pesanan
          const orderData = {
            ...this.pesan,
            product: this.product,
            timestamp: new Date(),
          };

          // Tambahkan pesanan ke koleksi "keranjang"
          await addDoc(cartCollection, orderData);

          // Navigasi ke halaman keranjang
          this.$router.push({ path: "/keranjang" });
          this.$toast.success("Sukses Masuk Keranjang", {
            type: "success",
            position: "top-right",
            duration: 3000,
            dismissible: true,
          });
        } catch (error) {
          console.error("Terjadi kesalahan saat mengirim data pesanan:", error);
        }
      } else {
        this.$toast.error("Isi Jumlah Pesanan", {
          type: "error",
          position: "top-right",
          duration: 3000,
          dismissible: true,
        });
      }
    },
  },
  mounted() {
  const productId = this.$route.params.id;
  console.log("Product ID from route params:", productId); // Debugging
  this.setProducts(productId);
},
};
</script>


<style>