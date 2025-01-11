<template>
  <div class="admin-dashboard">
    <h1>Dashboard Admin</h1>

    <div class="actions flex justify-content-center">
      <button @click="showAddModal">Tambah Data</button>
      <router-link class="btn btn-success" :to="`/order`">Orderan</router-link>
      <button @click="logout" class="btn btn-danger">Logout</button>
    </div>

    <div class="product-list">
      <h2>Daftar Produk</h2>
      <table>
        <thead>
          <tr>
            <th>Kode</th>
            <th>Nama</th>
            <th>Harga</th>
            <th>Ketersediaan</th>
            <th>Gambar</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>{{ product.kode }}</td>
            <td>{{ product.nama }}</td>
            <td>{{ product.harga }}</td>
            <td>{{ product.is_ready ? "Tersedia" : "Tidak Tersedia" }}</td>
            <td>
              <img :src="product.gambar" alt="product" width="100" />
            </td>
            <td>
              <button class="btn-warning" @click="editProduct(product)">
                Edit
              </button>
              <!-- Button to trigger the delete confirmation -->
              <button @click="confirmDelete(product.id)">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delete Confirmation Modal -->
    <!-- Confirmation Modal (using a simple modal) -->
    <div v-if="showConfirmDelete" class="modal">
      <div class="modal-content">
        <span class="close" @click="cancelDelete">&times;</span>
        <h2>Konfirmasi Penghapusan</h2>
        <p>Apakah Anda yakin ingin menghapus produk ini?</p>
        <button @click="deleteProduct">Ya</button>
        <button @click="cancelDelete">Tidak</button>
      </div>
    </div>

    <!-- Modal for Editing Product -->
    <div v-if="editingProduct" class="modal">
      <div class="modal-content">
        <span class="close" @click="cancelEdit">&times;</span>
        <h2>Edit Produk</h2>
        <form @submit.prevent="updateProduct">
          <div class="form-group">
            <label for="edit-nama">Nama</label>
            <input
              type="text"
              v-model="editingProduct.nama"
              id="edit-nama"
              required
            />
          </div>
          <div class="form-group">
            <label for="edit-harga">Harga</label>
            <input
              type="number"
              v-model="editingProduct.harga"
              id="edit-harga"
              required
            />
          </div>
          <div class="form-group">
            <label for="edit-is_ready">Status Ketersediaan</label>
            <select v-model="editingProduct.is_ready" id="edit-is_ready">
              <option :value="true">Tersedia</option>
              <option :value="false">Tidak Tersedia</option>
            </select>
          </div>
          <div class="form-group">
            <label for="edit-gambar">Gambar</label>
            <input type="file" @change="uploadEditImage" id="edit-gambar" />
            <img :src="editingProduct.gambar" alt="current image" width="100" />
          </div>
          <button type="submit">Simpan</button>
        </form>
      </div>
    </div>

    <!-- Modal for Adding Product -->
    <div v-if="showAdd" class="modal">
      <div class="modal-content">
        <span class="close" @click="cancelAdd">&times;</span>
        <h2>Tambah Produk</h2>
        <form @submit.prevent="addProduct">
          <div class="form-group">
            <label for="add-kode">Kode</label>
            <input
              type="text"
              v-model="newProduct.kode"
              id="add-kode"
              required
            />
          </div>
          <div class="form-group">
            <label for="add-nama">Nama</label>
            <input
              type="text"
              v-model="newProduct.nama"
              id="add-nama"
              required
            />
          </div>
          <div class="form-group">
            <label for="add-harga">Harga</label>
            <input
              type="number"
              v-model="newProduct.harga"
              id="add-harga"
              required
            />
          </div>
          <div class="form-group">
            <label for="add-is_ready">Status Ketersediaan</label>
            <select v-model="newProduct.is_ready" id="add-is_ready">
              <option :value="true">Tersedia</option>
              <option :value="false">Tidak Tersedia</option>
            </select>
          </div>
          <div class="form-group">
            <label for="add-gambar">Gambar</label>
            <input type="file" @change="uploadAddImage" id="add-gambar" />
          </div>
          <button type="submit">Tambah</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, signOut } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  addDoc,
} from "firebase/firestore";

export default {
  data() {
    return {
      products: [],
      editingProduct: null,
      showAdd: false,
      newProduct: {
        kode: "",
        nama: "",
        harga: 0,
        gambar: "",
        is_ready: true,
      },
      showConfirmDelete: false, // Flag to show confirmation modal
      productToDelete: null,
    };
  },
  methods: {
    async fetchProducts() {
      try {
        const db = getFirestore();
        const productsCollection = collection(db, "products");
        const querySnapshot = await getDocs(productsCollection);
        this.products = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
confirmDelete(productId) {
      this.productToDelete = productId;
      this.showConfirmDelete = true;
    },

    // Cancel delete operation
    cancelDelete() {
      this.showConfirmDelete = false;
      this.productToDelete = null;
    },

    // Delete the product from Firestore
    async deleteProduct() {
      if (!this.productToDelete) {
        return;
      }
      try {
        const db = getFirestore();
        await deleteDoc(doc(db, "products", this.productToDelete));
        this.$toast.success("Produk berhasil dihapus!", {
          type: "success",
          position: "top-right",
          duration: 3000,
          dismissible: true,
        });
        this.showConfirmDelete = false;
        this.fetchProducts(); // Refresh the product list
      } catch (error) {
        console.error("Error deleting product:", error);
        this.$toast.error("Gagal menghapus produk!", {
          type: "error",
          position: "top-right",
          duration: 3000,
          dismissible: true,
        });
      }
    },
    logout() {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          this.$toast.success("Anda berhasil logout!", {
            type: "success",
            position: "top-right",
            duration: 3000,
            dismissible: true,
          });
          this.$router.push("/login"); // Arahkan ke halaman login
        })
        .catch((error) => {
          this.$toast.error("Terjadi kesalahan saat logout!", {
            type: "error",
            position: "top-right",
            duration: 3000,
            dismissible: true,
          });
          console.error("Error logging out:", error);
        });
    },

    editProduct(product) {
      this.editingProduct = { ...product }; // Clone the product object
    },
    async updateProduct() {
      try {
        const db = getFirestore();
        const productRef = doc(db, "products", this.editingProduct.id);
        await updateDoc(productRef, {
          nama: this.editingProduct.nama,
          harga: parseInt(this.editingProduct.harga),
          is_ready: this.editingProduct.is_ready,
          gambar: this.editingProduct.gambar,
        });
        console.log(this.editingProduct);
        this.$toast.success("Product updated successfully!", {
          type: "success",
          position: "top-right",
          duration: 3000,
          dismissible: true,
        });
        this.editingProduct = null;
        this.fetchProducts();
      } catch (error) {
        console.error("Error updating product:", error);
      }
    },
    async addProduct() {
      try {
        const db = getFirestore();
        const productsCollection = collection(db, "products");
        await addDoc(productsCollection, this.newProduct);
        console.log(this.newProduct);
        this.$toast.success("Product added successfully!", {
          type: "success",
          position: "top-right",
          duration: 3000,
          dismissible: true,
        });
        this.cancelAdd();
        this.fetchProducts();
      } catch (error) {
        console.error("Error adding product:", error);
      }
    },
    async uploadAddImage(event) {
      if (!this.newProduct) {
        console.error("newProduct is not initialized");
        return;
      }
      const file = event.target.files[0];
      if (!file) {
        console.error("No file selected");
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "FoodItem");
      formData.append("cloud_name", "dvx6l69vv");

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/dvx6l69vv/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        if (data.secure_url) {
          this.newProduct.gambar = data.secure_url;
        } else {
          console.error("Cloudinary upload failed:", data);
          alert("Gagal mengunggah gambar. Coba lagi.");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Terjadi kesalahan saat mengunggah gambar.");
      }
    },

    async uploadEditImage(event) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "FoodItem");
      formData.append("cloud_name", "dvx6l69vv");

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/dvx6l69vv/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        this.editingProduct.gambar = data.secure_url;
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    },

    showAddModal() {
      this.showAdd = true;
    },
    cancelAdd() {
      this.showAdd = false;
      this.newProduct = {
        kode: "",
        nama: "",
        harga: 0,
        is_ready: true,
      };
    },
    cancelEdit() {
      this.editingProduct = null;
    },
  },
  mounted() {
    this.fetchProducts();
  },
};
</script>

<style scoped>
/* General Layout */
.admin-dashboard {
  font-family: Arial, sans-serif;
  margin: 20px;
}

h1 {
  text-align: center;
  color: #333;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

button,
.router-link {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
}

button:hover,
.router-link:hover {
  opacity: 0.8;
}

button.btn-danger {
  background-color: #e74c3c;
  color: white;
}

button.btn-success {
  background-color: #2ecc71;
  color: white;
}

button.btn-warning {
  background-color: #f39c12;
  color: white;
}

/* Product List */
.product-list {
  margin-top: 30px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th, td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
}

th {
  background-color: #f4f4f4;
}

td img {
  max-width: 100px;
  border-radius: 5px;
}

/* Modal Styles */
.modal {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 500px;
  margin: auto;
  position: relative;
}

h2 {
  text-align: center;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

input,
select {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  font-size: 14px;
}

button[type="submit"] {
  background-color: #3498db;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button[type="submit"]:hover {
  background-color: #2980b9;
}

button.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: #888;
}

button.close:hover {
  color: #333;
}

/* Confirmation Modal */
.modal-content p {
  text-align: center;
  font-size: 16px;
  color: #555;
}

.modal-content button {
  background-color: #e74c3c;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  margin: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.modal-content button:hover {
  background-color: #c0392b;
}

.modal-content button:nth-child(2) {
  background-color: #2ecc71;
}

.modal-content button:nth-child(2):hover {
  background-color: #27ae60;
}

/* Responsiveness */
@media screen and (max-width: 768px) {
  .actions {
    flex-direction: column;
    gap: 10px;
  }

  table {
    font-size: 14px;
  }

  .modal-content {
    width: 90%;
  }
}
</style>
