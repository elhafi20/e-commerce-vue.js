<template>
  <div class="pesanan-sukses">
    <Navbar />
    <div class="container">
      <div class="row justify-content-center mt-5">
        <div class="col text-center">
          <img src="../assets/hehe.png" width="300" />
          <h2><strong>Sukses!!</strong></h2>
          <h4>
            Pesanan Anda segera diproses <br />
            Selamat Menunggu
          </h4>
          <p>
            <strong>Kode Pesanan Anda: {{ kodePesanan }}</strong>
            <button
              class="btn btn-secondary btn-sm ml-2"
              @click="salinKodePesanan"
            >
              Salin
            </button>
          </p>

          <!-- Tambahkan tombol -->
          <button @click="lihatPesanan" class="btn btn-primary mt-3">
            Lihat Pesanan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";

export default {
  name: "PesananSukses",
  components: {
    Navbar,
  },
  data() {
    return {
      kodePesanan: this.$route.query.kodePesanan || "Kode tidak ditemukan",
    };
  },
  methods: {
    lihatPesanan() {
      this.$router.push("/search-pesanan"); // Arahkan ke route 'lihat-pesanan'
    },
    salinKodePesanan() {
      if (!this.kodePesanan) return;

      navigator.clipboard
        .writeText(this.kodePesanan)
        .then(() => {
          this.$toast.success("Kode pesanan berhasil disalin ke clipboard!", {
            type: "success",
            position: "top-right",
            duration: 3000,
            dismissible: true,
          });
        })
        .catch((err) => {
          console.error("Gagal menyalin kode pesanan: ", err);
          this.$toast.error("Gagal menyalin kode pesanan.", {
            type: "error",
            position: "top-right",
            duration: 3000,
            dismissible: true,
          });
        });
    },
  },
};
</script>

<style>
/* Tambahkan styling sesuai kebutuhan */
</style>
