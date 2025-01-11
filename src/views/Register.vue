<template>
    <div class="register">
      <h1>Register</h1>
      <form @submit.prevent="register">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" v-model="email" id="email" required />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" v-model="password" id="password" required />
        </div>
        <div class="form-group">
          <input type="hidden" v-model="role">
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  </template>
  
  <script>
  import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
  import { getFirestore, doc, setDoc } from "firebase/firestore";
  
  export default {
    data() {
      return {
        email: "",
        password: "",
        role: "user", // Default role
      };
    },
    methods: {
      async register() {
        try {
          const auth = getAuth();
          const db = getFirestore();
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            this.email,
            this.password
          );
          const userId = userCredential.user.uid;
  
          // Simpan role pengguna di Firestore
          await setDoc(doc(db, "users", userId), {
            email: this.email,
            role: this.role,
          });
  
          this.$toast.success("Registrasi berhasil", {
            type: "success",
            position: "top-right",
            duration: 3000,
            dismissible: true,
          })
          this.$router.push("/login");
        } catch (error) {
          console.error("Error during registration:", error);
          this.$toast.error("Registrasi gagal: " + error.message, {
            type: "error",
            position: "top-right",
            duration: 3000,
            dismissible: true,
          });
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .register {
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
  