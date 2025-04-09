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
          
          <!-- Payment Options Modal -->
          <div v-if="showPaymentOptions" class="modal-overlay">
            <div class="modal-container">
              <h2 class="modal-header">Pilih Metode Pembayaran</h2>
              <div class="modal-body">
                <p><strong>Kode Pesanan:</strong> {{ pesan.kodePesanan }}</p>
                <p><strong>Total Pembayaran:</strong> Rp. {{ totalHarga }}</p>
                
                <div class="payment-options">
                  <button class="btn btn-info btn-block" @click="selectPaymentMethod('transfer')">
                    Transfer & Upload Bukti Pembayaran
                  </button>
                  <small class="text-muted">* Hanya gambar (maksimal 500 KB)</small>
                </div>
                
                <button class="btn btn-secondary mt-3" @click="showPaymentOptions = false">
                  Batal
                </button>
              </div>
            </div>
          </div>
          
          <!-- Transfer Payment Modal -->
          <div v-if="showQRCode" class="modal-overlay">
            <div class="modal-container">
              <h2 class="modal-header">Pembayaran Transfer</h2>

              <div class="modal-body">
                <img
                  src="../assets/images/qris.jpg"
                  alt="QR Code"
                  class="qr-image"
                />
                
                <div class="payment-details mt-3">
                  <p><strong>Kode Pesanan:</strong> {{ pesan.kodePesanan }}</p>
                  <p><strong>Total Pembayaran:</strong> Rp. {{ totalHarga }}</p>
                  <p class="text-muted">Silakan transfer ke rekening yang tertera pada QR code di atas</p>
                </div>

                <div class="form-group mt-2">
                  <label for="upload">Upload Bukti Pembayaran:</label>
                  <input
                    type="file"
                    class="form-control"
                    @change="onFileChange"
                    accept="image/*"
                  />
                </div>

                <div v-if="uploadingImage" class="text-center my-3">
                  <div class="spinner-border text-primary" role="status">
                    <span class="sr-only">Loading...</span>
                  </div>
                  <p>Sedang mengupload...</p>
                </div>

                <div class="button-group mt-3">
                  <button
                    class="btn btn-success"
                    @click="uploadBuktiPembayaran"
                    :disabled="!selectedFile || uploadingImage"
                  >
                    Konfirmasi Pembayaran
                  </button>

                  <button class="btn btn-secondary" @click="showQRCode = false">
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
  // query,
  // where,
  getDoc,
} from "firebase/firestore";
import { db } from "@/firebase";

export default {
  name: "Keranjang",
  components: {
    Navbar,
  },
  data() {
    return {
      keranjang: [],
      pesan: {
        nama: "",
        noMeja: "",
        kodePesanan: ""
      },
      showPaymentOptions: false,
      showQRCode: false,
      showDirectPayment: false,
      selectedFile: null,
      activePesananId: null, // Store the Firestore document ID
      uploadingImage: false,
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
      if (this.pesan.nama && this.pesan.noMeja && this.keranjang.length > 0) {
        try {
          // Generate kode pesanan unik
          const kodePesanan = `ORD-${Date.now().toString(36).toUpperCase()}`;

          // Simpan data pesanan ke Firestore
          const docRef = await addDoc(collection(db, "pesanan"), {
            nama: this.pesan.nama,
            noMeja: this.pesan.noMeja,
            keranjang: this.keranjang,
            kodePesanan: kodePesanan,
            waktuPesanan: new Date().toISOString(),
            status: "pending", // Status pesanan: pending, paid, completed
            metodePembayaran: null // Akan diisi nanti
          });

          // Simpan kode pesanan dan document ID
          this.pesan.kodePesanan = kodePesanan;
          this.activePesananId = docRef.id;

          this.$toast.success("Pesanan berhasil dibuat", {
            type: "success",
            position: "top-right",
            duration: 3000,
            dismissible: true,
          });
          
          // Tampilkan opsi pembayaran
          this.showPaymentOptions = true;
          
        } catch (error) {
          console.error("Terjadi kesalahan saat memproses checkout: ", error);
          this.$toast.error("Gagal membuat pesanan", {
            type: "error",
            position: "top-right",
            duration: 3000,
            dismissible: true,
          });
        }
      } else {
        let message = "Terjadi kesalahan:";
        if (!this.pesan.nama) message += " Nama harus diisi.";
        if (!this.pesan.noMeja) message += " Nomor meja harus diisi.";
        if (this.keranjang.length === 0) message += " Keranjang kosong.";
        
        this.$toast.error(message, {
          type: "error",
          position: "top-right",
          duration: 3000,
          dismissible: true,
        });
      }
    },
    selectPaymentMethod(method) {
      if (!this.activePesananId) {
        this.$toast.error("Pesanan tidak ditemukan", {
          type: "error",
          position: "top-right",
          duration: 3000,
          dismissible: true,
        });
        return;
      }
      
      // Update metode pembayaran di Firestore
      const updatePaymentMethod = async () => {
        try {
          const pesananDocRef = doc(db, "pesanan", this.activePesananId);
          await updateDoc(pesananDocRef, {
            metodePembayaran: method
          });
        } catch (error) {
          console.error("Gagal mengupdate metode pembayaran:", error);
        }
      };
      
      // Tutup modal opsi pembayaran
      this.showPaymentOptions = false;
      
      if (method === 'direct') {
        // Tampilkan modal pembayaran langsung
        updatePaymentMethod();
        this.showDirectPayment = true;
      } else if (method === 'transfer') {
        // Tampilkan modal QR code dan upload bukti
        updatePaymentMethod();
        this.showQRCode = true;
      }
    },
    onFileChange(event) {
      this.selectedFile = event.target.files[0];
    },
    async uploadBuktiPembayaran() {
      if (!this.selectedFile) {
        this.$toast.error("Silakan pilih file untuk diupload", {
          type: "error",
          position: "top-right",
          duration: 3000,
          dismissible: true,
        });
        return;
      }
      
      if (!this.activePesananId) {
        this.$toast.error("ID pesanan tidak ditemukan", {
          type: "error",
          position: "top-right",
          duration: 3000,
          dismissible: true,
        });
        return;
      }
      
      this.uploadingImage = true;
      
      try {
        const formData = new FormData();
        formData.append("file", this.selectedFile);
        formData.append("upload_preset", "FoodItem"); // Sesuaikan dengan Cloudinary
        formData.append("cloud_name", "dvx6l69vv"); // Sesuaikan dengan akun Cloudinary kamu

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/dvx6l69vv/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Gagal mengupload gambar");
        }

        const data = await response.json();
        const buktiPembayaranUrl = data.secure_url;

        // Update pesanan dengan bukti pembayaran
        const pesananDocRef = doc(db, "pesanan", this.activePesananId);
        
        // Pastikan dokumen ada
        const docSnap = await getDoc(pesananDocRef);
        if (!docSnap.exists()) {
          throw new Error("Pesanan tidak ditemukan");
        }
        
        // Update dokumen dengan bukti pembayaran dan status
        await updateDoc(pesananDocRef, {
          buktiPembayaran: buktiPembayaranUrl,
          status: "Dalam proses",
          waktuPembayaran: new Date().toISOString()
        });

        // Hapus item dari keranjang setelah pembayaran berhasil
        const deletePromises = this.keranjang.map((item) =>
          deleteDoc(doc(db, "keranjang", item.id))
        );
        await Promise.all(deletePromises);
        
        this.$toast.success("Pembayaran berhasil", {
          type: "success",
          position: "top-right",
          duration: 3000,
          dismissible: true,
        });
        
        // Tutup modal dan redirect ke halaman sukses
        this.showQRCode = false;
        this.$router.push({
          path: "/pesanan-sukses",
          query: { kodePesanan: this.pesan.kodePesanan },
        });
        
      } catch (error) {
        console.error("Error uploading payment proof:", error);
        this.$toast.error(`Gagal mengupload bukti pembayaran: ${error.message}`, {
          type: "error",
          position: "top-right",
          duration: 3000,
          dismissible: true,
        });
      } finally {
        this.uploadingImage = false;
      }
    },
    async completeDirectPayment() {
      try {
        const pesananDocRef = doc(db, "pesanan", this.activePesananId);
        await updateDoc(pesananDocRef, {
          status: "paid",
          waktuPembayaran: new Date().toISOString(),
          pembayaranLangsung: true
        });

        const deletePromises = this.keranjang.map((item) =>
          deleteDoc(doc(db, "keranjang", item.id))
        );
        await Promise.all(deletePromises);

        this.$toast.success("Pembayaran berhasil dicatat", {
          type: "success",
          position: "top-right",
          duration: 3000,
          dismissible: true,
        });

        this.showDirectPayment = false;
        this.$router.push({
          path: "/pesanan-sukses",
          query: { kodePesanan: this.pesan.kodePesanan },
        });
      } catch (error) {
        console.error("Error completing direct payment:", error);
        this.$toast.error(`Gagal mencatat pembayaran: ${error.message}`, {
          type: "error",
          position: "top-right",
          duration: 3000,
          dismissible: true,
        });
      }
    },
    async updateStatusToDalamProses(pesananId) {
      try {
        const pesananDocRef = doc(db, "pesanan", pesananId);
        await updateDoc(pesananDocRef, {
          status: "Dalam proses",
        });
        this.$toast.success("Status pesanan diperbarui ke 'Dalam proses'");
      } catch (error) {
        console.error("Gagal memperbarui status:", error);
      }
    },
    async updateStatusToCompleted(pesananId) {
      try {
        const pesananDocRef = doc(db, "pesanan", pesananId);
        await updateDoc(pesananDocRef, {
          status: "completed",
        });
        this.$toast.success("Status pesanan diperbarui ke 'completed'");
      } catch (error) {
        console.error("Gagal memperbarui status:", error);
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
  background-color: #4CAF50;
  color: white;
}

.btn-block {
  display: block;
  width: 100%;
}
</style>