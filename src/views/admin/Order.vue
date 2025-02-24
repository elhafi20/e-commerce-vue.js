<template>
  <div class="admin-dashboard">
    <div class="container">
      <div>
        <h2 class="mt-4">Dashboard Admin - Pesanan</h2>
        <router-link class="btn btn-success" :to="`/dashboard`">Back</router-link>
      </div>

      <div class="table-responsive mt-3">
        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Kode Pesanan</th>
              <th>Nama Pelanggan</th>
              <th>Nomor Meja</th>
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
              <td>{{ pesanan.status || 'Belum Diproses' }}</td>
              <td>
                <button class="btn btn-info" @click="lihatPesanan(pesanan)">Lihat Pesanan</button>
                <button v-if="pesanan.status !== 'Selesai'" class="btn btn-success"
                  @click="updateStatus(pesanan.id, 'Selesai')">Tandai Selesai</button>
                <button class="btn btn-danger" @click="konfirmasiHapus(pesanan)">Hapus Pesanan</button>
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
        <button class="btn btn-secondary" @click="showConfirmModal = false">Tidak</button>
      </div>
    </div>

    <!-- Modal Detail Pesanan -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-container">
        <h2 class="modal-header">Detail Pesanan</h2>
        <p><strong>Nama:</strong> {{ selectedPesanan?.nama }}</p>
        <p><strong>Nomor Meja:</strong> {{ selectedPesanan?.noMeja }}</p>
        <p><strong>Kode Pesanan:</strong> {{ selectedPesanan?.kodePesanan }}</p>
        <p><strong>Waktu Pesanan:</strong> {{ new Date(selectedPesanan?.waktuPesanan).toLocaleString() }}</p>

        <h3 class="modal-subtitle">Detail Keranjang:</h3>
        <ul class="item-list">
          <li v-for="item in selectedPesanan?.keranjang" :key="item.id">
            <span class="item-name">{{ item.product.nama }} x {{ item.jumlah_pemesanan }} - Rp. {{ item.product.harga }}</span>
          </li>
        </ul>

        <p class="total-harga">Total Harga: <span>Rp. {{ totalHarga }}</span></p>

        <button class="btn btn-primary" @click="showModal = false">Tutup</button>
      </div>
    </div>
  </div>
</template>

<script>
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default {
  name: "AdminDashboard",
  data() {
    return {
      pesananList: [],
      selectedPesanan: null,
      showModal: false,
      showConfirmModal: false, // Tambahkan state untuk modal konfirmasi
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
      return this.selectedPesanan?.keranjang.reduce(
        (acc, item) => acc + item.jumlah_pemesanan * item.product.harga,
        0
      ) || 0;
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
</style>
