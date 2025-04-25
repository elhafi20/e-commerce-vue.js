<template>
  <div class="lihat-order">
    <Navbar />
    <div class="container">
      <div class="row justify-content-center mt-5">
        <div class="col text-center">
          <h2><strong>Pesanan Anda</strong></h2>
          <!-- Periksa apakah ada data pesanan -->
          <table
            v-if="orders.length > 0"
            class="table-auto border-collapse border border-gray-400 w-full"
          >
            <thead>
              <tr class="bg-gray-200">
                <th class="border border-gray-400 px-4 py-2">Nama</th>
                <th class="border border-gray-400 px-4 py-2">Alamat</th>
                <th class="border border-gray-400 px-4 py-2">Nama Makanan</th>
                <!-- <th class="border border-gray-400 px-4 py-2">Jumlah</th> -->
                <th class="border border-gray-400 px-4 py-2">Harga</th>
                <th class="border border-gray-400 px-4 py-2">Keterangan</th>
                <th class="border border-gray-400 px-4 py-2">Sub Total</th>
                <th class="border border-gray-400 px-4 py-2">Total Harga</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders" :key="order.id">
                <td class="border border-gray-400 px-4 py-2">
                  {{ order.nama }}
                </td>
                <td class="border border-gray-400 px-4 py-2">
                  {{ order.noMeja }}
                </td>
                <td class="border border-gray-400 px-4 py-2">
                  <ul>
                    <li v-for="item in order.keranjang" :key="item.id">
                      {{ item.product.nama }} - {{ item.product.harga }} ({{
                        item.jumlah_pemesanan
                      }})
                    </li>
                  </ul>
                </td>
                <!-- <td class="border border-gray-400 px-4 py-2">
                  <ul>
                    <li v-for="item in order.keranjang" :key="item.id">
                      {{ item.jumlah_pemesanan }}
                    </li>
                  </ul>
                </td> -->
                <td class="border border-gray-400 px-4 py-2">
                  <ul>
                    <li v-for="item in order.keranjang" :key="item.id">
                      {{ item.product.harga }}
                    </li>
                  </ul>
                </td>
                <td class="border border-gray-400 px-4 py-2">
                  <ul>
                    <li v-for="item in order.keranjang" :key="item.id">
                      {{ item.keterangan }}
                    </li>
                  </ul>
                </td>
                <td class="border border-gray-400 px-4 py-2">
                  <ul>
                    <li v-for="item in order.keranjang" :key="item.id">
                      {{ item.product.harga * item.jumlah_pemesanan }}
                    </li>
                  </ul>
                </td>

              </tr>
            </tbody>
          </table>

          <div v-else>Belum ada pesanan...</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase"; // Pastikan file Firebase Anda sudah diatur
import Navbar from "@/components/Navbar.vue";
import { collection, getDocs, orderBy } from "firebase/firestore";

export default {
  name: "LihatOrder",
  components: {
    Navbar,
  },
  data() {
    return {
      orders: [], // Menyimpan data pesanan
    };
  },
  async created() {
    await this.fetchOrders();
  },
  methods: {
    async fetchOrders() {
      try {
        // Mengambil data pesanan dan mengurutkan berdasarkan timestamp
        const querySnapshot = await getDocs(
          collection(db, "pesanan"),
          orderBy("timestamp", "desc")
        );

        // Map data pesanan dan ubah jumlah_pemesanan serta harga menjadi angka
        this.orders = querySnapshot.docs.map((doc) => {
          const orderData = doc.data();
          // Pastikan jumlah_pemesanan dan harga dalam bentuk angka
          orderData.keranjang.forEach((item) => {
            item.jumlah_pemesanan = parseInt(item.jumlah_pemesanan);
            item.product.harga = parseInt(item.product.harga);
          });
          return {
            id: doc.id,
            ...orderData,
          };
        });

        //tampilkan pesanan
        this.orders = this.orders.slice(0);

        console.log("Pesanan terbaru:", this.orders); // Debugging
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    },
    formatCurrency(value) {
      // Format harga ke dalam format rupiah
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(value);
    },
  },
  computed: {
  totalHarga() {
    return this.order.keranjang.reduce((total, item) => {
      const harga = parseInt(item.product.harga) || 0;
      const jumlah = parseInt(item.jumlah_pemesanan) || 0;
      return total + harga * jumlah;
      
    }, 0);
  }
}
};
</script>

<style>
.product-image {
  width: 150px;
  height: auto;
  margin-bottom: 10px;
  border-radius: 8px;
}
.keranjang-item {
  margin-bottom: 20px;
}
</style>
