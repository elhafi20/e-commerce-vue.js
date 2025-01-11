<template>
  <div class="card shadow">
    <!-- Menggunakan product.gambar langsung -->
    <img :src="product.gambar" class="card-img-top" alt="Gambar produk" />
    <div class="card-body">
      <h5 class="card-title">{{ product.nama }}</h5>
      <p class="card-text">Harga : Rp {{ product.harga }}</p>
      <div class="d-flex justify-content-beetwen">
      <slot name="pesan"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CardProduct",
  props: ["product"],
};
</script>

<style>
/* Tambahkan styling sesuai kebutuhan */  
</style>
