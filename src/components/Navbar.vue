<template>
  <div>
    <b-navbar toggleable="lg" type="light">
      <div class="container">
        <b-navbar-brand ><strong>Blink Coffe</strong></b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <li class="nav-item">
              <router-link class="nav-link" to="/">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/foods">Menu</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/search-pesanan">Cari Pesanan</router-link>
            </li>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/keranjang">
                Keranjang
                <b-icon-bag></b-icon-bag>
                <span class="badge badge-success ml-2">{{
                  jumlah_pesanan
                }}</span>
              </router-link>
            </li>
          </b-navbar-nav>
          
        </b-collapse>
      </div>
    </b-navbar>
  </div>
</template>

<script>
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase"; // Path ke konfigurasi Firebase Anda
import { getAuth, signOut } from "firebase/auth";

export default {
  name: "Navbar",
  data() {
    return {
      jumlah_pesanan: 0, // Menggunakan total jumlah item
    };
  },
  methods: {
    listenToKeranjang() {
      // Listen real-time ke koleksi "keranjang" di Firestore
      const keranjangRef = collection(db, "keranjang");
      onSnapshot(keranjangRef, (snapshot) => {
        // Hitung jumlah dokumen dalam koleksi "keranjang"
        this.jumlah_pesanan = snapshot.size;
      });
    },
    async logout() {
      const auth = getAuth();
      try {
        await signOut(auth);
        this.$toast.success("Logout berhasil", {
          type: "success",
          position: "top-right",
          duration: 3000,
          dismissible: true,
        })
        this.$router.push("/login");
      } catch (error) {
        console.error("Error saat logout:", error);
        this.$toast.error("Gagal logout. Silakan coba lagi.");
      }
    },
  },
  mounted() {
    this.listenToKeranjang(); // Panggil fungsi untuk listen data Firestore
  },
};
</script>

<style>
.button {
  border-radius:  20px;
}
</style>
