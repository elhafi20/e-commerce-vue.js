<template>
  <div>
    <b-navbar toggleable="lg" type="light">
      <div class="container">
        <b-navbar-brand tag="router-link" to="/"><strong>Blink Coffee</strong></b-navbar-brand>

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
                <span class="badge badge-success ml-2">{{ jumlah_pesanan }}</span>
              </router-link>
            </li>

            <!-- Login hanya untuk Admin -->
            <li class="nav-item" v-if="isAdmin === null">
              <span class="nav-link text-muted">Memeriksa...</span>
            </li>
            <li class="nav-item" v-if="isAdmin === false">
              <router-link class="nav-link" style="border: none;" to="/login">
                <b-icon-person></b-icon-person>
              </router-link>
            </li>
            <li class="nav-item" v-if="isAdmin === true">
              <button class="nav-link btn btn-outline-danger" @click="logout">Logout</button>
            </li>
          </b-navbar-nav>
        </b-collapse>
      </div>
    </b-navbar>
  </div>
</template>

<script>
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { db } from "../firebase"; // Path ke konfigurasi Firebase Anda

export default {
  name: "Navbar",
  data() {
    return {
      jumlah_pesanan: 0,
      isAdmin: null, // Null saat memeriksa status login
    };
  },
  methods: {
    listenToKeranjang() {
      const keranjangRef = collection(db, "keranjang");
      onSnapshot(keranjangRef, (snapshot) => {
        this.jumlah_pesanan = snapshot.size;
      });
    },
    async checkAdmin(user) {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists() && userSnap.data().role === "admin") {
          this.isAdmin = true;
        } else {
          this.isAdmin = false;
          await signOut(getAuth()); // Logout otomatis jika bukan admin
        }
      } else {
        this.isAdmin = false;
      }
    },
    async logout() {
      try {
        await signOut(getAuth());
        this.$toast.success("Logout berhasil", { position: "top-right" });
        this.$router.push("/login");
      } catch (error) {
        this.$toast.error("Gagal logout. Silakan coba lagi.", { position: "top-right" });
      }
    },
  },
  mounted() {
    this.listenToKeranjang();
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      this.checkAdmin(user);
    });
  },
};
</script>

<style>
.button {
  border-radius: 20px;
}
</style>
