<template>
  <router-link class="link-retour" :to="{ path: '/' }">
      <PButton class="p-button-outlined btn-retour" icon="pi pi-arrow-left" label="Retour" />
    </router-link>
  <div class="body">
    <div class="box">
      <div class="banner_high">
        <router-link to="/">
        <img src="../assets/images/Logo_aide_asso_footer.png" alt="" />
       </router-link>
        <div class="language">
          <div class="flag" :class="{ active: isActive }" @click="isActive = !isActive">
            <img src="../assets/fr_flag.png" alt="" />
          </div>
          <div class="flag" :class="{ active: !isActive }" @click="isActive = !isActive">
            <img src="../assets/uk_flag.png" alt="" />
          </div>
        </div>
      </div>

      <h1>Se connecter</h1>

      <div class="in">
        <label for="name">Adresse Mail</label>
        <div>
          <input type="text" v-model="username" placeholder="E-mail" />
          <img v-if="username.length >= 4" src="../assets/ok.svg" alt="" />
        </div>

        <div class="button_action">
          <button @click="addEmail('@gmail.com')">@gmail.com</button>
          <button @click="addEmail('@yahoo.com')">@yahoo.com</button>
          <button @click="addEmail('@outlook.com')">@outlook.com</button>
          <button @click="addEmail('@aol.com')">@aol.com</button>
        </div>
      </div>

      <div class="in">
        <label for="name">Mot de passe</label>
        <div>
          <input v-model="password" type="password" placeholder="Entrer votre mot de passe" required />
          <img v-if="password.length >= 8" src="../assets/ok.svg" alt="" />
        </div>
      </div>

      <div class="check_bar">
        <div>
          <input type="checkbox" name="" id="" />
          <label for="">Se souvenir de moi</label>
        </div>
        <a href="">Mot de passe oublié ? </a>
      </div>

      <button class="log" @click="login">Se connecter</button>

      <span>Pas encore de compte ? <a href="/signup">S'inscrire</a> </span>
    </div>
  </div>
  <Toast />
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useUserService } from '@/composables/user/UserService'; // Assurez-vous d'importer correctement votre service utilisateur
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';

const router = useRouter();
const toast = useToast();

const password = ref('');
const username = ref('');
const isActive = ref(true);

const userService = useUserService();

function addEmail(suffix: string) {
  username.value += suffix;
}

async function login() {
  const response = await userService.loginUser(username.value, password.value);
  console.log(response);
  if (response == true) {
    toast.add({ severity: 'success', summary: 'Succès', detail: 'Vous êtes connecté', life: 3000 });
    router.push('/tableau-de-bord');
  } else {
    toast.add({ severity: 'error', summary: 'Erreur', detail: response, life: 3000 });
  }
}
</script>

<style>
@import 'https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap';
.body {
  margin: 0;
  padding: 0;
  background-color: #ebecf0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 110vh;
  font-family: 'Lato', sans-serif;
}
.box {
  background-color: #fff;
  display: flex;
  border-radius: 1em;
  width: 30vw;
  flex-direction: column;
  padding: 2em;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  position: relative;
}
.box .message {
  background-color: #ebecf0;
  border-radius: 0.5em;
  padding: 1em;
}
.box .red {
  background-color: #e45656a4;
  color: #fff;
  visibility: visible;
}
.box .green {
  background-color: rgba(109, 209, 109, 0.664);
  color: #fff;
  visibility: visible;
}
.box .visibility {
  visibility: hidden;
}
.box .banner_high {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 1em 0;
}
.box .banner_high img {
  width: 3em;
}
.box .banner_high h1 {
  margin: 0.6em;
  font-weight: 600;
}
.box .banner_high .language {
  display: flex;
  border-radius: 0.5em;
  background-color: #f9fafc;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 0px 0px 0px, rgba(60, 64, 67, 0.15) 0px 0px 3px 0px;
}
.box .banner_high .language .flag {
  cursor: pointer;
  margin: 0.3em;
  border-radius: 0.3em;
  padding: 0.3em 0.6em;
  display: flex;
}
.box .banner_high .language .flag img {
  width: 2em;
}
.box .log {
  background-color: #000;
  padding: 1.4em;
  color: #fff;
  border-radius: 0.7em;
  border: 1px solid #000;
  transition: 250ms;
  cursor: pointer;
}
.box .log:hover {
  border: 1px solid #000;
  background-color: transparent;
  color: #000;
}
.box .in {
  display: flex;
  flex-direction: column;
  margin: 0.8em 0;
}
.box .in div {
  display: flex;
  align-items: center;
  width: 100%;
}
.box .in label {
  margin: 0.2em;
}
.box .in img {
  width: 2em;
  margin: 0 0.5em;
}
.box .in v-text-field {
  display: flex;
  width: 100%;
}
.box .in input {
  width: 100%;
  padding: 1em;
  display: flex;
  border: 1px solid #ebecf0;
  border-radius: 0.7em;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 0px 0px 0px, rgba(60, 64, 67, 0.15) 0px 0px 3px 0px;
  background-size: 50px;
}
.box .in .button_action {
  display: flex;
  flex-direction: row;
  margin: 0.5em 0;
}
.box .in .button_action button {
  border: 0;
  padding: 0.4em 0.8em;
  margin: 0.2em;
  background-color: #fff;
  border: 1px solid #ebecf0;
  cursor: pointer;
  transition: 250ms;
  border-radius: 5em;
}
.box .in .button_action button:hover {
  background-color: #e8e8e8;
}
.box .check_bar {
  margin: 1em 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.box .check_bar a {
  color: #000;
}
.box .check_bar div input[type='checkbox'] {
  margin: 0 1em;
}
.box span {
  text-align: center;
  margin: 1em 0;
  color: #677083;
}
.box span a {
  color: #000;
}
.box .password_bar {
  display: flex;
  width: 100%;
}
.box .password_bar .bar {
  width: 25%;
  height: 6px;
  background-color: #ebecf0;
  border-radius: 1em;
  margin: 6px;
}
.box .password_bar .green {
  background-color: #6dd16d;
}
.gold-mid {
  background-color: #666;
}
.gray-lighter {
  background-color: #c2c2c2;
}
.toggle-wrapper {
  display: inline-block;
  position: relative;
  cursor: pointer;
  width: 32px;
  height: 18px;
  border-radius: 9999px;
}
.toggle-wrapper:focus {
  outline: 0;
}
.toggle-background {
  display: inline-block;
  border-radius: 9999px;
  height: 100%;
  width: 100%;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.4s ease;
}
.toggle-indicator {
  position: absolute;
  height: 14px;
  width: 14px;
  left: 2px;
  bottom: 2px;
  background-color: #fff;
  border-radius: 9999px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.4s ease;
}
.active {
  background-color: #fff;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 0px 0px 0px, rgba(60, 64, 67, 0.15) 0px 0px 3px 0px;
} /*# sourceMappingURL=style.css.map */
</style>
