<template>
  <div class="search-pesanan">
    <Navbar />
    <div class="container mt-5">
      <h2>Cari Pesanan</h2>
      <form class="mt-4" @submit.prevent="cariPesanan">
        <div class="form-group">
          <label for="kodePesanan">Masukkan Kode Pesanan:</label>
          <input type="text" id="kodePesanan" class="form-control" v-model="kodePesanan"
            placeholder="Contoh: ORD-123ABC" />
        </div>
        <button type="submit" class="btn btn-primary mt-3">Cari</button>
      </form>

      <div v-if="showModal" class="modal-overlay">
        <div class="modal-container">
          <h2 class="modal-header">Detail Pesanan</h2>

          <div class="modal-body">
            <p><strong>Nama:</strong> {{ selectedPesanan.nama }}</p>
            <p><strong>Nomor Meja:</strong> {{ selectedPesanan.noMeja }}</p>
            <p>
              <strong>Kode Pesanan:</strong> {{ selectedPesanan.kodePesanan }}
            </p>
            <p>
              <strong>Waktu Pesanan:</strong>
              {{ new Date(selectedPesanan.waktuPesanan).toLocaleString() }}
            </p>
            <p>
              <strong>Bukti pembayaran:</strong> {{ selectedPesanan.buktiPembayaran }}
            </p>


            <h3 class="modal-subtitle">Detail Keranjang:</h3>
            <ul class="item-list">
              <li v-for="item in selectedPesanan.keranjang" :key="item.id">
                <span class="item-name">{{ item.product.nama }} x {{ item.jumlah_pemesanan }} Rp.
                  {{ item.product.harga }}</span>
                <span class="item-keterangan">
                  <strong>Keterangan:</strong>
                  {{ item.keterangan || "Tidak ada keterangan" }}
                </span>
              </li>
            </ul>

            <p class="total-harga">
              Total Harga: <span>Rp. {{ totalHarga }}</span>
            </p>

            <button class="close-btn" @click="showModal = false">Tutup</button>
          </div>
        </div>
      </div>

      <div v-if="error" class="mt-5 text-danger">
        <p>{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore"; 

export default {
  name: "SearchPesanan",
  components: {
    Navbar,
  },
  data() {
    return {
      kodePesanan: "",
      buktiPembayaran: null,
      selectedPesanan: null,
      showModal: false,
      error: null,
    };
  },
  methods: {
    async cariPesanan() {
      this.error = null;
      this.selectedPesanan = null;
      this.showModal = false;

      if (!this.kodePesanan.trim()) {
        this.error = "Kode pesanan tidak boleh kosong!";
        return;
      }
      try {
        const pesananRef = collection(db, "pesanan");
        const q = query(
          pesananRef,
          where("kodePesanan", "==", this.kodePesanan)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          this.error = "Pesanan tidak ditemukan!";
        } else {
          this.selectedPesanan = querySnapshot.docs[0].data();
          this.buktiPembayaran = this.selectedPesanan.buktiPembayaran || null; // Ambil bukti pembayaran
          this.showModal = true;
        }
      } catch (error) {
        console.error("Gagal mencari pesanan: ", error);
        this.error = "Terjadi kesalahan saat mencari pesanan.";
      }
    },
  },
  async onFileChange(event) {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
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
    this.buktiPembayaran = data.secure_url;

    // Cari dokumen Firestore berdasarkan kode pesanan
    const pesananRef = collection(db, "pesanan");
    const q = query(pesananRef, where("kodePesanan", "==", this.kodePesanan));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docId = querySnapshot.docs[0].id; // Dapatkan ID dokumen Firestore
      const pesananDocRef = doc(db, "pesanan", docId); // Gunakan ID dokumen

      // Update bukti pembayaran di Firestore
      await updateDoc(pesananDocRef, {
        buktiPembayaran: this.buktiPembayaran,
      });
    }
  } catch (error) {
    console.error("Error uploading image:", error);
  }
},
  computed: {
    totalHarga() {
      return (
        this.selectedPesanan?.keranjang.reduce(
          (acc, item) => acc + item.jumlah_pemesanan * item.product.harga,
          0
        ) || 0
      );
    },
  },
};
</script>

<style scoped>
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

.modal-subtitle {
  font-size: 18px;
  font-weight: bold;
  margin-top: 10px;
  text-align: left;
}

.item-list {
  list-style: none;
  padding: 0;
  text-align: left;
}

.item-list li {
  padding: 8px 0;
  border-bottom: 1px solid #ddd;
}

.item-name {
  font-weight: bold;
  display: block;
}

.item-keterangan {
  font-size: 14px;
  color: #666;
}

.total-harga {
  font-size: 20px;
  font-weight: bold;
  color: green;
  margin-top: 15px;
  text-align: center;
}

.total-harga span {
  color: #28a745;
}

.close-btn {
  background: #007bff;
  color: white;
  padding: 10px;
  width: 100%;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 15px;
}

.close-btn:hover {
  background: #0056b3;
}
</style>
