<template>
    <div class="login mt-5 mb-5 ">
    <Navbar />
      <h1>Login</h1>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" v-model="email" id="email" required />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" v-model="password" id="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  </template>
  
  <script>
  import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
  import { getFirestore, doc, getDoc } from "firebase/firestore";
  import Navbar from "@/components/Navbar.vue";
  export default {
    name: "Login",
    components: {
      Navbar,
    },
    data() {
      return {
        email: "",
        password: "",
      };
    },
    methods: {
      async login() {
        try {
          const auth = getAuth();
          const db = getFirestore();
          const userCredential = await signInWithEmailAndPassword(
            auth,
            this.email,
            this.password
          );
          const userId = userCredential.user.uid;
  
          // Ambil role pengguna dari Firestore
          const userDoc = await getDoc(doc(db, "users", userId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            alert(`Login berhasil sebagai ${userData.role}!`);
  
            // Redirect berdasarkan role
            if (userData.role === "admin") {
              this.$router.push("/dashboard");
            } else {
              this.$router.push("/");
            }
          } else {
            alert("Data pengguna tidak ditemukan!");
          }
        } catch (error) {
          console.error("Error during login:", error);
          alert("Login gagal: " + error.message);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .login {
    max-width: 400px;
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
  