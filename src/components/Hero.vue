<template>
  <div class="hero">
    <!--desktop-->
    <div class="d-none d-md-block">
      <div class="row mt-4">
        <div class="col-md-6">
          <div class="d-flex h-100">
            <div class="justify-content-center align-self-center">
              <h2>
                <strong>Delicious Drink Menu,</strong> <br />
                In Your Gadget
              </h2>
              <p>Ayo Segera Pilih dan Pesan Menu Favorit Anda...</p>
              <router-link to="/foods" class="btn btn-lg btn-oke">
                <b-icon-arrow-right></b-icon-arrow-right>Pesan
              </router-link>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <img src="../assets/Hero.png" style="width: 60%; height:auto; margin-left: 40%;" />
        </div>
      </div>
    </div>

    <!--mobile-->
    <div class="d-sm-block d-md-none">
      <div class="row mt-4">
        <div class="col-md-6 mb-2">
          <img src="../assets/Hero.png" style="width: 60%; height:auto; margin-left: 20%;" />
        </div>
        <div class="col-md-6">
          <div class="d-flex h-100">
            <div class="justify-content-center align-self-center">
              <h2>
                <strong>Delicious Food Menu,</strong> <br />
                In Your Gadget
              </h2>
              <p>Ayo Segera Pilih dan Pesan Menu Favorit Anda...</p>
              <router-link to="/foods" class="btn btn-lg btn-oke">
                <b-icon-arrow-right></b-icon-arrow-right>Pesan
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Hero",
};
</script>

<style>
.btn-oke:hover {
    background-color: #873600;
}
</style>