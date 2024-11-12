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
              <router-link class="nav-link" to="/keranjang"
                >Keranjang
                <b-icon-bag></b-icon-bag>
                <span class="badge badge-success ml-2">{{ jumlah_pesanan.length }}</span>
              </router-link>
            </li>
          </b-navbar-nav>
        </b-collapse>
      </div>
    </b-navbar>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Navbar",
  data() {
    return {
      jumlah_pesanan: [],
    };
  },
  methods: {
    setJumlah(data) {
      this.jumlah_pesanan = data;
    },
  },
  mounted() {
    axios.get("http://localhost:3000/keranjang").then((response) => {
      this.setJumlah(response.data);
    });
  },
};
</script>

<style>
</style>