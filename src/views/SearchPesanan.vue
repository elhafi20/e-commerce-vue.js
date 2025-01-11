<template>
    <div class="search-pesanan">
      <Navbar />
      <div class="container mt-5">
        <h2>Cari Pesanan</h2>
        <form class="mt-4" @submit.prevent="cariPesanan">
          <div class="form-group">
            <label for="kodePesanan">Masukkan Kode Pesanan:</label>
            <input
              type="text"
              id="kodePesanan"
              class="form-control"
              v-model="kodePesanan"
              placeholder="Contoh: ORD-123ABC"
            />
          </div>
          <button type="submit" class="btn btn-primary mt-3">Cari</button>
        </form>
  
        <div v-if="pesanan" class="detail-pesanan">
  <h3>Detail Pesanan</h3>
  <p><strong>Nama:</strong> {{ pesanan.nama }}</p>
  <p><strong>Nomor Meja:</strong> {{ pesanan.noMeja }}</p>
  <p><strong>Kode Pesanan:</strong> {{ pesanan.kodePesanan }}</p>
  <p><strong>Waktu Pesanan:</strong> {{ new Date(pesanan.waktuPesanan).toLocaleString() }}</p>


  <h4>Detail Keranjang:</h4>
  <ul>
  <li v-for="item in pesanan.keranjang" :key="item.id">
    <div>
      <span class="item-name">{{ item.product.nama }}</span>
      <span class="item-price">{{ item.jumlah_pemesanan }} x Rp. {{ item.product.harga }}</span>
    </div>
    <p class="item-keterangan">
      <strong>Keterangan:</strong> {{ item.keterangan || 'Tidak ada keterangan' }}
    </p>
  </li>
</ul>

  <p class="total-harga">Total Harga: Rp. {{ totalHarga }}</p>
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
  
  export default {
    name: "SearchPesanan",
    components: {
      Navbar,
    },
    data() {
      return {
        kodePesanan: "",
        pesanan: null,
        error: null,
      };
    },
    methods: {
      async cariPesanan() {
        this.pesanan = null;
        this.error = null;
  
        if (!this.kodePesanan) {
          this.error = "Kode Pesanan harus diisi!";
          return;
        }
  
        try {
          const pesananRef = collection(db, "pesanan");
          const q = query(pesananRef, where("kodePesanan", "==", this.kodePesanan));
          const querySnapshot = await getDocs(q);
  
          if (!querySnapshot.empty) {
            this.pesanan = querySnapshot.docs[0].data();
          } else {
            this.error = "Pesanan dengan kode tersebut tidak ditemukan.";
          }
        } catch (error) {
          console.error("Gagal mencari pesanan: ", error);
          this.error = "Terjadi kesalahan saat mencari pesanan.";
        }
      },
    },
    computed: {
      totalHarga() {
        if (this.pesanan) {
          return this.pesanan.keranjang.reduce((total, item) => {
            return total + item.product.harga * item.jumlah_pemesanan;
          }, 0);
        }
        return 0;
      },
    },
  };
  </script>
  
  <style>


h2, h3, h4 {
  color: #2c3e50;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  font-weight: 700;
  font-size: 28px;
}

/* Form Styling */
form {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: bold;
  margin-bottom: 8px;
  color: #34495e;
}

.form-control {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;
}

.form-control:focus {
  border-color: #3498db;
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
  outline: none;
}

button.btn-primary {
  background-color: #3498db;
  color: white;
  font-size: 16px;
  font-weight: bold;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s ease-in-out;
}

button.btn-primary:hover {
  background-color: #2980b9;
}

/* Styling untuk Detail Pesanan */
.detail-pesanan {
  background: #ffffff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 30px;
}

.detail-pesanan h3 {
  text-align: center;
  color: #2c3e50;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.detail-pesanan p {
  font-size: 16px;
  color: #34495e;
  margin: 10px 0;
}

.detail-pesanan p strong {
  color: #2c3e50;
  font-weight: bold;
}

.detail-pesanan ul {
  list-style: none;
  padding: 0;
  margin: 20px 0;
}

/* Styling untuk List Item di Keranjang */
.detail-pesanan ul li {
  display: flex;
  flex-direction: column; /* Ubah agar item ditampilkan dalam kolom */
  padding: 10px;
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;
  background: #f9f9f9; /* Tambahkan latar belakang lembut */
  border-radius: 8px; /* Tambahkan border radius */
}

.detail-pesanan ul li:last-child {
  border-bottom: none;
}

.detail-pesanan ul li .item-name {
  font-weight: bold;
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 5px; /* Ruang antara nama produk dan harga */
}

.detail-pesanan ul li .item-price {
  font-size: 14px;
  color: #27ae60;
  font-weight: 600;
  margin-bottom: 8px; /* Ruang antara harga dan keterangan */
}

.detail-pesanan ul li .item-keterangan {
  font-size: 14px;
  color: #7f8c8d;
  margin-top: 5px;
  font-style: italic; /* Keterangan terlihat berbeda */
  background: #eef2f3; /* Latar belakang khusus untuk keterangan */
  padding: 5px 10px; /* Tambahkan padding untuk kenyamanan */
  border-radius: 5px; /* Rounding di kotak keterangan */
}

/* Total Harga */
.total-harga {
  margin-top: 20px;
  text-align: right;
  font-size: 18px;
  font-weight: bold;
  color: #27ae60;
}

/* Responsive Design */
@media screen and (max-width: 768px) {
  .detail-pesanan {
    padding: 15px;
  }

  .detail-pesanan h3 {
    font-size: 20px;
  }

  .detail-pesanan p {
    font-size: 14px;
  }

  /* Styling untuk Keterangan Pesanan */
.keterangan-pesanan {
  margin-top: 15px;
  font-size: 16px;
  color: #34495e;
}

.keterangan-pesanan strong {
  color: #2c3e50;
  font-weight: bold;
}

/* Styling untuk Keterangan di Item Keranjang */
.item-keterangan {
  font-size: 14px;
  color: #7f8c8d;
  margin-top: 5px;
  margin-left: 20px;
}
.item-keterangan strong {
  color: #2c3e50;
  font-weight: bold;
}

  .total-harga {
    font-size: 16px;
  }
}
  </style>
  