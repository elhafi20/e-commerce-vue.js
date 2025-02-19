<template>
  <div class="login-container">
    <div class="login-box">
      <form @submit.prevent="login" class="login-form">
        <h1 class="login-title">Login</h1>
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            v-model="email" 
            id="email" 
            required 
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            v-model="password" 
            id="password" 
            required 
          />
        </div>
        <button type="submit" class="login-button">Login</button>
      </form>
    </div>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
export default {
  name: "Login",
  components: {
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
        const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
        const userId = userCredential.user.uid;

        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          alert(`Login berhasil sebagai ${userData.role}!`);
          this.$router.push(userData.role === "admin" ? "/dashboard" : "/");
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
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f4f4f4;
}
.login-box {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}
.login-title {
  font-size: 24px;
  margin-bottom: 20px;
}
.login-form .form-group {
  margin-bottom: 15px;
  text-align: left;
}
.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}
.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.login-button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}
.login-button:hover {
  background-color: #0056b3;
}
@media (max-width: 600px) {
  .login-box {
    width: 90%;
}
}
</style>
