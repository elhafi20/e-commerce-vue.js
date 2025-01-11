<template>
  <div class="add-product">
    <h1>Tambah Produk</h1>
    <form @submit.prevent="addProduct">
      <div class="form-group">
        <label for="kode">Kode</label>
        <input type="text" v-model="product.kode" id="kode" required />
      </div>
      <div class="form-group">
        <label for="nama">Nama</label>
        <input type="text" v-model="product.nama" id="nama" required />
      </div>
      <div class="form-group">
        <label for="harga">Harga</label>
        <input type="number" v-model="product.harga" id="harga" required />
      </div>
      <div class="form-group">
        <label for="is_ready">Status Ketersediaan</label>
        <select v-model="product.is_ready" id="is_ready">
          <option :value="true">Tersedia</option>
          <option :value="false">Tidak Tersedia</option>
        </select>
      </div>
      <div class="form-group">
        <label for="gambar">Gambar</label>
        <input type="file" @change="uploadImage" id="gambar" />
      </div>
      <button type="submit">Tambah Produk</button>
    </form>
  </div>
</template>

<script>
import { getFirestore, collection, addDoc } from "firebase/firestore";

export default {
  data() {
    return {
      product: {
        kode: "",
        nama: "",
        harga: 0,
        is_ready: true,
        gambar: "",
      },
      imageFile: null,
    };
  },
  methods: {
    async uploadImage(event) {
      this.imageFile = event.target.files[0];
      const formData = new FormData();
      formData.append("file", this.imageFile);
      formData.append("upload_preset", "FoodItem"); // Dapatkan dari Cloudinary
      formData.append("cloud_name", "dvx6l69vv"); // Dapatkan dari Cloudinary

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/dvx6l69vv/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        this.product.gambar = data.secure_url;
        console.log(this.product.gambar); // URL gambar
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    },
    async addProduct() {
      try {
        this.product.harga = parseInt(this.product.harga);
        const db = getFirestore();
        const productsCollection = collection(db, "products");
        await addDoc(productsCollection, this.product);
        this.$toast.success("Product added successfully!", {
          type: "success",
          position: "top-right",
          duration: 3000,
          dismissible: true,
        });
        this.resetForm();
      } catch (error) {
        console.error("Error adding product:", error);
      }
    },
    resetForm() {
      this.product = {
        kode: "",
        nama: "",
        harga: 0,
        is_ready: true,
        gambar: "",
      };
      this.imageFile = null;
    },
  },
};
</script>

<style scoped>
.add-product {
  max-width: 600px;
  margin: auto;
}
.form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
}
input,
select,
button {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
}
button {
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #45a049;
}
</style>
