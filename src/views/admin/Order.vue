<template>
  <div class="admin-dashboard">
    <div class="container">
      <div>
        <h2 class="mt-4">Dashboard Admin - Pesanan</h2>
        <router-link class="btn btn-success" :to="`/dashboard`"
          >Back</router-link
        >
      </div>

      <div class="table-responsive mt-3">
        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Kode Pesanan</th>
              <th>Nama Pelanggan</th>
              <th>Alamat</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(pesanan, index) in pesananList" :key="pesanan.id">
              <td>{{ index + 1 }}</td>
              <td>{{ pesanan.kodePesanan }}</td>
              <td>{{ pesanan.nama }}</td>
              <td>{{ pesanan.noMeja }}</td>
              <td>{{ pesanan.status || "Belum Diproses" }}</td>
              <td>
                <button class="btn btn-info" @click="lihatPesanan(pesanan)">
                  Lihat Pesanan
                </button>
                <button
                  v-if="pesanan.status !== 'Selesai'"
                  class="btn btn-success"
                  @click="updateStatus(pesanan.id, 'Selesai')"
                >
                  Tandai Selesai
                </button>
                <button
                  class="btn btn-danger"
                  @click="konfirmasiHapus(pesanan)"
                >
                  Hapus Pesanan
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Konfirmasi Hapus -->
    <div v-if="showConfirmModal" class="modal-overlay">
      <div class="modal-container">
        <h2 class="modal-header">Konfirmasi Hapus</h2>
        <p>Apakah Anda yakin ingin menghapus pesanan ini?</p>
        <p><strong>Kode Pesanan:</strong> {{ selectedPesanan?.kodePesanan }}</p>

        <button class="btn btn-danger" @click="hapusPesanan">Ya, Hapus</button>
        <button class="btn btn-secondary" @click="showConfirmModal = false">
          Tidak
        </button>
      </div>
    </div>

    <!-- Modal Detail Pesanan -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-container">
        <h2 class="modal-header">Detail Pesanan</h2>

        <div class="text-left">
          <p><strong>Nama:</strong> {{ selectedPesanan?.nama }}</p>
          <p><strong>Alamat:</strong> {{ selectedPesanan?.noMeja }}</p>
          <p><strong>Kode:</strong> {{ selectedPesanan?.kodePesanan }}</p>
          <p>
            <strong>Waktu:</strong>
            {{ new Date(selectedPesanan?.waktuPesanan).toLocaleString() }}
          </p>
        </div>

        <h3 class="modal-subtitle mt-3">Keranjang:</h3>
        <ul class="item-list">
          <li v-for="item in selectedPesanan?.keranjang" :key="item.id">
            {{ item.product.nama }} x {{ item.jumlah_pemesanan }} - Rp.
            {{ item.product.harga }}
          </li>
        </ul>

        <p class="total-harga">
          Total Harga: <span>Rp. {{ totalHarga }}</span>
        </p>

        <button class="btn btn-primary mt-2" @click="showModal = false">
          Tutup
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/firebase";

export default {
  name: "AdminDashboard",
  data() {
    return {
      pesananList: [],
      selectedPesanan: null,
      showModal: false,
      showConfirmModal: false,
    };
  },
  methods: {
    async fetchPesanan() {
      try {
        const pesananRef = collection(db, "pesanan");
        const querySnapshot = await getDocs(pesananRef);
        this.pesananList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Gagal mengambil data pesanan: ", error);
      }
    },
    lihatPesanan(pesanan) {
      this.selectedPesanan = pesanan;
      this.showModal = true;
    },
    async updateStatus(id, status) {
      try {
        const pesananRef = doc(db, "pesanan", id);
        await updateDoc(pesananRef, { status: status });
        this.fetchPesanan();
      } catch (error) {
        console.error("Gagal memperbarui status pesanan: ", error);
      }
    },
    konfirmasiHapus(pesanan) {
      this.selectedPesanan = pesanan;
      this.showConfirmModal = true;
    },
    async hapusPesanan() {
      try {
        await deleteDoc(doc(db, "pesanan", this.selectedPesanan.id));
        this.showConfirmModal = false;
        this.fetchPesanan();
      } catch (error) {
        console.error("Gagal menghapus pesanan: ", error);
      }
    },
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
  mounted() {
    this.fetchPesanan();
  },
};
</script>

<style scoped>
/* Modal Styles */
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

.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.image-modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 800px;
  text-align: center;
  position: fixed;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
}

.modal-image {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 90vh;
  margin: 0 auto;
  display: block;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
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

.item-list {
  list-style: none;
  padding: 0;
  text-align: left;
}

.item-list li {
  padding: 8px 0;
  border-bottom: 1px solid #ddd;
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

.btn {
  margin: 5px;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-danger {
  background: #dc3545;
  color: white;
  border: none;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border: none;
}

.btn-primary {
  background: #007bff;
  color: white;
  border: none;
}
.bukti-pembayaran {
  width: 100px;
  height: 100px;
}
</style>
