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
          <button
            class="btn btn-primary mt-2"
            @click="showQRCode = true"
          >
            Bayar Sekarang
          </button>
          <div v-if="showQRCode" class="modal-overlay">
  <div class="modal-container">
    <h2 class="modal-header">Pembayaran</h2>

    <div class="modal-body">
      <img src="../assets/images/kakap.jpg" alt="QR Code" class="qr-image" />
      
      <div class="form-group mt-2">
        <label for="upload">Upload Bukti Pembayaran:</label>
        <input type="file" class="form-control" @change="onFileChange" />
      </div>
      
      <div class="button-group">
        <button class="btn btn-success" @click="checkoutORD-M7OXWQYP">Bayar</button>
        <button class="btn btn-secondary" @click="showQRCode = false">Tutup</button>
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
import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc, query, where } from "firebase/firestore";
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
      showQRCode: false,
      selectedFile: null,
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
      // Generate kode pesanan unik
      const kodePesanan = `ORD-${Date.now().toString(36).toUpperCase()}`;

      // Simpan data pesanan ke Firestore
      await addDoc(collection(db, "pesanan"), {
        nama: this.pesan.nama,
        noMeja: this.pesan.noMeja,
        keranjang: this.keranjang,
        kodePesanan: kodePesanan, // Simpan kode pesanan
        waktuPesanan: new Date().toISOString(), // Tambahkan waktu pesanan
      });

      // Simpan kode pesanan ke data pesan
      this.pesan.kodePesanan = kodePesanan;

      // Hapus semua item di keranjang
      const deletePromises = this.keranjang.map((item) =>
        deleteDoc(doc(db, "keranjang", item.id))
      );
      await Promise.all(deletePromises);

      // Redirect ke halaman sukses dengan kode pesanan
      this.$router.push({ 
        path: "/pesanan-sukses", 
        query: { kodePesanan: kodePesanan } 
      });

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
onFileChange(event) {
  this.selectedFile = event.target.files[0];
},
async uploadBuktiPembayaran() {
  if (this.selectedFile) {
    const formData = new FormData();
    formData.append("file", this.selectedFile);
    formData.append("upload_preset", "FoodItem"); // Sesuaikan dengan Cloudinary
    formData.append("cloud_name", "dvx6l69vv"); // Sesuaikan dengan akun Cloudinary kamu

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dvx6l69vv/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      const buktiPembayaranUrl = data.secure_url;

      // Cari dokumen Firestore berdasarkan kode pesanan
      const pesananRef = collection(db, "pesanan");
      const q = query(pesananRef, where("kodePesanan", "==", this.pesan.kodePesanan));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id; // Dapatkan ID dokumen Firestore
        const pesananDocRef = doc(db, "pesanan", docId); // Gunakan ID dokumen

        // Update bukti pembayaran di Firestore
        await updateDoc(pesananDocRef, {
          buktiPembayaran: buktiPembayaranUrl,
        });

        this.$toast.success("Bukti pembayaran berhasil diupload", {
          type: "success",
          position: "top-right",
          duration: 3000,
          dismissible: true,
        });
      } else {
        this.$toast.error("Pesanan tidak ditemukan", {
          type: "error",
          position: "top-right",
          duration: 3000,
          dismissible: true,
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      this.$toast.error("Gagal mengupload bukti pembayaran", {
        type: "error",
        position: "top-right",
        duration: 3000,
        dismissible: true,
      });
    }
  } else {
    this.$toast.error("Silakan pilih file untuk diupload", {
      type: "error",
      position: "top-right",
      duration: 3000,
      dismissible: true,
    });
  }
}

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
.btn-oke:hover {
  background-color: #873600;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  border-radius: 10px;
  padding: 20px;
  width: 90%;
  max-width: 450px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.modal-header {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 15px;
}

.modal-body p {
  font-size: 16px;
  margin: 5px 0;
  text-align: left;
}

.qr-image {
  max-width: 100%;
  height: auto;
  margin-bottom: 15px;
}

.form-group {
  text-align: left;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.btn {
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  flex: 1;
  margin: 0 5px;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-success:hover {
  background: #218838;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}
</style>