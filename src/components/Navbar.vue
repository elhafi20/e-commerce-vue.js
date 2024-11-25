<template>
  <div>
    <b-navbar toggleable="lg" type="light">
      <div class="container">
        <b-navbar-brand href="#">Kuliner</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <li class="nav-item">
              <router-link class="nav-link" to="/">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/foods">Foods</router-link>
            </li>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/keranjang">
                Keranjang
                <b-icon-bag></b-icon-bag>
                <span class="badge badge-success ml-2">{{ jumlah_pesanan }}</span>
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
  },
  mounted() {
    this.listenToKeranjang(); // Panggil fungsi untuk listen data Firestore
  },
};
</script>

<style>
/* Tambahkan styling sesuai kebutuhan */
</style>
