<template>
    <div class="admin-dashboard">
      <!-- <Navbar /> -->
      <div class="container">
        <div>
            <h2 class="mt-4">Dashboard Admin - Pesanan</h2>
        <router-link class="btn btn-success" :to="`/dashboard`">Back</router-link>

        </div>
        
        <div class="table-responsive mt-3">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Kode Pesanan</th>
                <th scope="col">Nama Pelanggan</th>
                <th scope="col">Nomor Meja</th>
                <th scope="col">Status</th>
                <th scope="col">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(pesanan, index) in pesananList" :key="pesanan.id">
                <th>{{ index + 1 }}</th>
                <td>{{ pesanan.kodePesanan }}</td>
                <td>{{ pesanan.nama }}</td>
                <td>{{ pesanan.noMeja }}</td>
                <td>{{ pesanan.status || 'Belum Diproses' }}</td>
                <td>
                  <button 
                    v-if="pesanan.status !== 'Selesai'" 
                    class="btn btn-success"
                    @click="updateStatus(pesanan.id, 'Selesai')"
                  >
                    Tandai Selesai
                  </button>
                  <button 
                    class="btn btn-danger" 
                    @click="hapusPesanan(pesanan.id)"
                  >
                    Hapus Pesanan
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script>
//   import Navbar from "@/components/Navbar.vue";
  import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
  import { db } from "@/firebase";
  
  export default {
    name: "AdminDashboard",
    components: {
    //   Navbar,
    },
    data() {
      return {
        pesananList: [],
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
      async updateStatus(id, status) {
        try {
          const pesananRef = doc(db, "pesanan", id);
          await updateDoc(pesananRef, { status: status });
          this.fetchPesanan();
          this.$toast.success(`Pesanan ${status}`, {
            type: "success",
            position: "top-right",
            duration: 3000,
            dismissible: true,
          });
        } catch (error) {
          console.error("Gagal memperbarui status pesanan: ", error);
        }
      },
      async hapusPesanan(id) {
        try {
          await deleteDoc(doc(db, "pesanan", id));
          this.fetchPesanan();
          this.$toast.success("Pesanan berhasil dihapus", {
            type: "success",
            position: "top-right",
            duration: 3000,
            dismissible: true,
          });
        } catch (error) {
          console.error("Gagal menghapus pesanan: ", error);
        }
      },
    },
    mounted() {
      this.fetchPesanan(); // Ambil data pesanan saat komponen dimuat
    },
  };
  </script>
  
  <style scoped>
  .admin-dashboard {
    margin-top: 20px;
  }
  
  table {
    width: 100%;
  }
  </style>
  