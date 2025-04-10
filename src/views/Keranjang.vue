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
                <router-link to="/foods" class="text-dark">Menu</router-link>
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
                  <th scope="col">Menu</th>
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
              class="btn btn-oke float-right"
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

<script
  src="https://app.sandbox.midtrans.com/snap/snap.js"
  data-client-key="SB-Mid-client-G4UW4GVuovWp4RKT"
></script>

<script>
import Navbar from "@/components/Navbar.vue";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/firebase";

export default {
  name: "Keranjang",
  components: { Navbar },
  data() {
    return {
      keranjang: [],
      pesan: {
        nama: "",
        noMeja: "",
        kodePesanan: "",
      },
      showPaymentOptions: false,
      showQRCode: false,
      showDirectPayment: false,
      selectedFile: null,
      activePesananId: null,
      uploadingImage: false,
    };
  },
  computed: {
    totalHarga() {
      return this.keranjang.reduce(
        (total, item) => total + item.product.harga * item.jumlah_pemesanan,
        0
      );
    },
  },
  mounted() {
    this.fetchKeranjang();
  },
  methods: {
    async fetchKeranjang() {
      try {
        const querySnapshot = await getDocs(collection(db, "keranjang"));
        this.keranjang = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Gagal mengambil data keranjang: ", error);
      }
    },

    async hapusKeranjang(id) {
      try {
        await deleteDoc(doc(db, "keranjang", id));
        this.fetchKeranjang();
        this.$toast.success("Item berhasil dihapus dari keranjang");
      } catch (error) {
        console.error("Gagal menghapus item: ", error);
      }
    },

    async loadMidtransScript() {
      if (window.snap) return; // sudah dimuat

      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
        script.setAttribute("data-client-key", "SB-Mid-client-G4UW4GVuovWp4RKT");
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    },

    async checkout() {
      if (this.pesan.nama && this.pesan.noMeja && this.keranjang.length > 0) {
        try {
          await this.loadMidtransScript();
          const kodePesanan = `ORD-${Date.now().toString(36).toUpperCase()}`;

          const docRef = await addDoc(collection(db, "pesanan"), {
            nama: this.pesan.nama,
            noMeja: this.pesan.noMeja,
            keranjang: this.keranjang,
            kodePesanan,
            waktuPesanan: new Date().toISOString(),
            status: "pending",
            metodePembayaran: "midtrans",
          });

          this.pesan.kodePesanan = kodePesanan;
          this.activePesananId = docRef.id;

          const response = await fetch(
            "http://localhost:3001/api/midtrans/create-transaction",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: kodePesanan,
                gross_amount: Number(this.totalHarga),
                customerName: this.pesan.nama,
              }),
            }
          );
          console.log(response);
          console.log("Type data totalHarga: ", typeof this.totalHarga);

          const result = await response.json();

          if (result.token) {
            // Load Midtrans Snap
            window.snap.pay(result.token, {
              onSuccess: async (res) => {
                const pesananDocRef = doc(db, "pesanan", this.activePesananId);
                await updateDoc(pesananDocRef, {
                  status: "paid",
                  waktuPembayaran: new Date().toISOString(),
                  midtransResponse: res,
                });

                const deletePromises = this.keranjang.map((item) =>
                  deleteDoc(doc(db, "keranjang", item.id))
                );
                await Promise.all(deletePromises);

                this.$router.push({
                  path: "/pesanan-sukses",
                  query: { kodePesanan: kodePesanan },
                });
              },
              onPending: () => {
                this.$toast.info("Transaksi masih dalam proses");
              },
              onError: (error) => {
                this.$toast.error("Terjadi kesalahan saat proses pembayaran");
                console.error(error);
              },
            });
          }
        } catch (error) {
          console.error("Checkout Error:", error);
        }
      } else {
        this.$toast.error("Lengkapi data dan pastikan keranjang tidak kosong");
      }
    },

    onFileChange(e) {
      this.selectedFile = e.target.files[0];
    },

    async completeDirectPayment() {
      try {
        await updateDoc(doc(db, "pesanan", this.activePesananId), {
          status: "paid",
          waktuPembayaran: new Date().toISOString(),
          pembayaranLangsung: true,
        });
        await Promise.all(
          this.keranjang.map((item) => deleteDoc(doc(db, "keranjang", item.id)))
        );
        this.$router.push({
          path: "/pesanan-sukses",
          query: { kodePesanan: this.pesan.kodePesanan },
        });
      } catch (err) {
        console.error(err);
        this.$toast.error("Gagal mencatat pembayaran langsung");
      }
    },

    async updateStatusToDalamProses(pesananId) {
      await updateDoc(doc(db, "pesanan", pesananId), {
        status: "Dalam proses",
      });
    },

    async updateStatusToCompleted(pesananId) {
      await updateDoc(doc(db, "pesanan", pesananId), { status: "completed" });
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.modal-body {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qr-image {
  max-width: 250px;
  margin-bottom: 15px;
}

.button-group {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 15px;
}

.payment-options {
  width: 100%;
  margin: 15px 0;
}

.payment-details {
  width: 100%;
  text-align: center;
  margin-bottom: 10px;
}

.btn-oke {
  background-color: #4caf50;
  color: white;
}

.btn-block {
  display: block;
  width: 100%;
}
</style>
