<template>
  <div class="keranjang">
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
                Keranjang
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <h2>Keranjang <strong>Saya</strong></h2>
          <div class="table-responsive mt-3">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Gambar</th>
                  <th scope="col">Makanan</th>
                  <th scope="col">Keterangan</th>
                  <th scope="col">Jumlah</th>
                  <th scope="col">Harga</th>
                  <th scope="col">Total Harga</th>
                  <th scope="col">Hapus</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(keranjang, index) in keranjang" :key="keranjang.id">
                  <th>{{ index + 1 }}</th>
                  <td>
                    <img
                      :src="keranjang.product.gambar"
                      class="img-fluid shadow"
                      width="250"
                    />
                  </td>
                  <td>
                    <strong>{{ keranjang.product.nama }}</strong>
                  </td>
                  <td>
                    {{ keranjang.keterangan ? keranjang.keterangan : "-" }}
                  </td>
                  <td>
                    {{ keranjang.jumlah_pemesanan }}
                  </td>
                  <td align="right">Rp. {{ keranjang.product.harga }}</td>
                  <td align="right">
                    <strong>
                      Rp.
                      {{
                        keranjang.product.harga * keranjang.jumlah_pemesanan
                      }}</strong
                    >
                  </td>
                  <td align="center" class="text-danger">
                    <b-icon-trash
                      @click="hapusKeranjang(keranjang.id)"
                    ></b-icon-trash>
                  </td>
                </tr>

                <tr>
                  <td colspan="6" align="right">
                    <strong>Total Harga :</strong>
                  </td>
                  <td align="right">
                    <strong>Rp. {{ totalHarga }}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="row justify-content-end">
        <div class="col-md-4">
          <form class="mt-4" v-on:submit.prevent>
            <div class="form-group">
              <label for="nama">Nama :</label>
              <input type="text" class="form-control" v-model="pesan.nama" />
            </div>
            <div class="form-group">
              <label for="noMeja">Nomor Meja :</label>
              <input
                type="number"
                class="form-control"
                v-model="pesan.noMeja"
              />
            </div>

            <button
              type="submit"
              class="btn btn-success float-right"
              @click="checkout"
            >
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
import { collection, getDocs, deleteDoc, doc, addDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default {
  name: "Keranjang",
  components: {
    Navbar,
  },
  data() {
    return {
      keranjang: [],
      pesan: {},
    };
  },
  methods: {
    async fetchKeranjang() {
      try {
        const keranjangRef = collection(db, "keranjang");
        const querySnapshot = await getDocs(keranjangRef);
        this.keranjang = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // console.log(this.keranjang);
      } catch (error) {
        console.error("Gagal mengambil data keranjang: ", error);
      }
    },
    async hapusKeranjang(id) {
      try {
        await deleteDoc(doc(db, "keranjang", id));
        this.fetchKeranjang();
        this.$toast.success("Item berhasil dihapus dari keranjang", {
          type: "success",
          position: "top-right",
          duration: 3000,
          dismissible: true,
        });
      } catch (error) {
        console.error("Gagal menghapus item: ", error);
      }
    },
    async checkout() {
      if (this.pesan.nama && this.pesan.noMeja) {
        try {
          // Simpan data pesanan ke Firestore
          await addDoc(collection(db, "pesanan"), {
            nama: this.pesan.nama,
            noMeja: this.pesan.noMeja,
            keranjang: this.keranjang,
          });

          // Hapus semua item di keranjang
          const deletePromises = this.keranjang.map((item) =>
            deleteDoc(doc(db, "keranjang", item.id))
          );
          await Promise.all(deletePromises);

          this.$router.push({ path: "/pesanan-sukses" });
          this.$toast.success("Sukses Dipesan", {
            type: "success",
            position: "top-right",
            duration: 3000,
            dismissible: true,
          });
        } catch (error) {
          console.error("Terjadi kesalahan saat memproses checkout: ", error);
        }
      } else {
        this.$toast.error("Nama dan Nomor Meja Harus Di Isi", {
          type: "error",
          position: "top-right",
          duration: 3000,
          dismissible: true,
        });
      }
    },
  },
  mounted() {
    this.fetchKeranjang(); // Ambil data keranjang saat komponen dimuat
  },
  computed: {
    totalHarga() {
      return this.keranjang.reduce((total, item) => {
        return total + item.product.harga * item.jumlah_pemesanan;
      }, 0);
    },
  },
};
</script>

<style>
</style>
