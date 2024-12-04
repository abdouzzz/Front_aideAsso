<template>
  <div class="layout-topbar">
    <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle">
      <em :class="iconeBouton"></em>
    </button>
    <router-link to="/" class="layout-topbar-logo">
      <img class="logo-image" alt="Logo Aide Asso" src="@/assets/images/Logo_aide_asso.png" />
    </router-link>

    <div class="flex justify-content-center" v-if="!isHomePage">
      <Breadcrumb :home="home" :model="fileAriane" />
    </div>

    <div class="flex justify-center ml-8">
      <AutoComplete v-model="associationSelected" optionLabel="nom" placeholder="Chercher une association ..."
        :suggestions="associationFiltred" @complete="search">
        <template #option="slotProps">
          <router-link :to="`/asso-search-detail/${slotProps.option.id}`">
            <div class="flex items-center space-x-2">
              <img v-if="slotProps.option.logo" :src="'data:image/png;base64,' + slotProps.option.logo"
                :alt="slotProps.option.nom" style="width: 15px;" class="mr-3" />
              <div class="text-lg font-medium">{{ slotProps.option.nom }}</div> <!-- Texte plus grand -->
            </div>
          </router-link>


        </template>
        <template #header>
          <div class="font-medium px-3 py-2">Associations disponible</div>
        </template>
      </AutoComplete>
    </div>

    <button class="p-link layout-topbar-menu-button layout-topbar-button" v-styleclass="{
      selector: '@next',
      enterClass: 'hidden',
      enterActiveClass: 'scalein',
      leaveToClass: 'hidden',
      leaveActiveClass: 'fadeout',
      hideOnOutsideClick: true,
    }">
      <em class="pi pi-ellipsis-v"></em>
    </button>
    <ul class="layout-topbar-menu hidden lg:flex origin-top">
      <li>
        <div class="layout-topbar-button" :class="{ 'w-6rem border-radius-2rem': windowInnerWidth >= 992 }">
          <em class="fas fa-moon" :class="{ 'mr-2': windowInnerWidth >= 992 }"></em>
          <InputSwitch v-model="themeSombreActive" @change="changerTheme" />
        </div>
      </li>
      <li>
        <router-link to="/admin">
          <div class="p-link layout-topbar-button">
            <em class="fas fa-cog"></em>
            <span>Paramètres</span>
          </div>
        </router-link>
      </li>
      <li>
        <!-- Content for logged-in user -->
        <div class="p-link layout-topbar-button">
          <router-link :to="user ? '' : '/login'" class="layout-topbar-logo">
            <Avatar size="large" shape="circle">
              <div @click="toggleReglage" v-if="user">
                {{ user.prenom?.charAt(0).toUpperCase() + '' + user.nom?.charAt(0).toUpperCase() }}
              </div>
              <div v-else><em class="fas fa-user"></em></div>
            </Avatar>
            <span class="ml-3">Profil</span>
          </router-link>
        </div>
        <OverlayPanel ref="userR">
          <div class="flex flex-column gap-3 w-28rem" v-if="user">
            <div class="mb-4"
              style="display: flex; justify-content: space-between; align-items: center; text-align: center">
              <span class="font-medium text-900 block">Réglages</span>
              <div>
                <Badge v-if="user.email" :value="user.email" class="mr-2" style="color: #fff" />
              </div>
            </div>
            <!-- User Settings -->
            <div class="mb-2">
              <div style="display: flex; justify-content: space-between; width: 100%">
                <div class="mb-3">
                  <label for="firstname" class="block mb-1">Prénom</label>
                  <inputText id="firstname" v-model="user.prenom" type="text" />
                </div>
                <div class="mb-3 ml-2">
                  <label for="lastname" class="block mb-1">Nom</label>
                  <inputText id="lastname" v-model="user.nom" type="text" />
                </div>
              </div>
              <div class="mb-3">
                <label for="email" class="block mb-1">Email</label>
                <inputText id="email" v-model="user.email" type="email" class="w-full" />
              </div>
              <div class="mb-3">
                <label for="password" class="block mb-1">Mot de passe</label>
                <Password v-model="password" id="password" toggleMask />
              </div>
            </div>
            <div class="mb-3" style="display: flex; justify-content: flex-end">
              <PButton label="Annuler" icon="pi pi-times" class="p-button-text" @click="toggleReglage" />
              <PButton label="Modifier" icon="pi pi-plus" @click="modifUser()" />
            </div>
          </div>
        </OverlayPanel>
      </li>
      <li>
        <button v-if="user" class="p-link layout-topbar-button" @click="confirmerDeconnexion($event)">
          <em class="fas fa-sign-out"></em>
          <span>Se déconnecter</span>
        </button>
        <ConfirmPopup></ConfirmPopup>
      </li>
    </ul>
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import EventBus from '@/AppEventBus';
import { useUserService } from '@/composables/user/UserService';
import UserModel from './models/UserModel';
import { useRoute } from 'vue-router';
import router from '@/router';
import { MenuItem } from 'primevue/menuitem';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { Association } from '@/models/AssociationModel';
import { useAssoService } from './composables/asso/AssoService';

const confirm = useConfirm();
const associationService = useAssoService();
const toast = useToast();
const route = useRoute();
const userService = useUserService();
const user = ref<UserModel | null>(null);
const isHomePage = ref(route.name === 'tableau-de-bord');
const jwt = ref(false);
const op = ref();
const userR = ref();
const password = ref('');
const associationListe = ref<Association[]>([]);
const associationSelected = ref<Association>();
const associationFiltred = ref<Association[]>([]);

const search = (event) => {
  setTimeout(() => {
    if (!event.query.trim().length) {
      associationFiltred.value = [...associationListe.value];
    } else {
      associationFiltred.value = associationListe.value.filter((asso: Association) => {
        return asso.nom.toLowerCase().includes(event.query.toLowerCase());
      });
    }
  }, 250);
}




const menuSidebarIsActive = ref(sessionStorage.getItem("idAsso") ? true : false);

const home = ref({
  icon: 'pi pi-home',
});
const fileAriane = ref<MenuItem[]>([]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toggle = (event: any) => {
  op.value.toggle(event);
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toggleReglage = (event: any) => {
  userR.value.toggle(event);
};

function formatDate(date: Date) {
  return new Date(date).toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

async function fetchData() {
  if (jwt.value) {
    try {
      const userData = await userService.getUserById(Number(sessionStorage.getItem('jwt')));
      user.value = userData;
      console.log('User connected:', user.value);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  } else {
    user.value = null;
  }
}
async function modifUser() {
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const confirmerDeconnexion = (event: any) => {
  confirm.require({
    target: event.currentTarget,
    message: 'Voulez-vous vous déconnecter?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm',
    rejectLabel: 'Annuler',
    acceptLabel: 'Déconnexion',
    accept: async () => {
      await seDeconnecter();
      toast.add({ severity: 'info', summary: 'Confirmé', detail: 'Déconnexion effectuée', life: 1000 });
    },
    reject: () => {
      toast.add({ severity: 'error', summary: 'Rejeté', detail: 'Déconnexion annulée', life: 1000 });
    },
  });
};

onMounted(async () => {
  associationListe.value = await associationService.getAllAssociation();
  console.log('asso', associationListe.value);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', storeWindowInnerWidth);
});

const props = defineProps<{
  staticMenuInactive: boolean;
  mobileMenuActive: boolean;
}>();
const emit = defineEmits<{
  (e: 'menu-toggle', v: Event): void;
  (e: 'topbar-menu-toggle', v: Event): void;
}>();

const windowInnerWidth = ref(window.innerWidth);
window.addEventListener('resize', storeWindowInnerWidth);
const themeSombreActive = ref(false);

const iconeBouton = computed(() => {
  let icone = 'pi pi-times';
  if ((windowInnerWidth.value >= 992 && props.staticMenuInactive) || (windowInnerWidth.value < 992 && !props.mobileMenuActive)) {
    icone = 'pi pi-bars';
  }
  return icone;
});

onMounted(async () => {
  fileAriane.value = [{ label: route.name?.toString(), to: { path: route.path } }];
  jwt.value = !!sessionStorage.getItem('jwt');
  if (window.localStorage.getItem('dark-mode')) {
    themeSombreActive.value = window.localStorage.getItem('dark-mode') === 'true';
    if (themeSombreActive.value) changerTheme();
  }
  await fetchData();
});

watch(
  () => sessionStorage.getItem('jwt'),
  async () => {
    await fetchData();
  }
);

watch(
  () => route.name,
  (newRouteName) => {
    fileAriane.value = [{ label: newRouteName?.toString(), to: { path: route.path } }];
  }
);



function onMenuToggle(event: Event) {
  emit('menu-toggle', event);
}

function storeWindowInnerWidth() {
  windowInnerWidth.value = window.innerWidth;
}

function changerTheme() {
  EventBus.emit('theme-change', {
    theme: themeSombreActive.value ? 'lara-dark-indigo' : 'lara-light-indigo',
    dark: themeSombreActive.value,
  });
  window.localStorage.setItem('dark-mode', themeSombreActive.value.toString());
}

async function seDeconnecter() {
  if (user.value) {
    user.value = null;
  }
  sessionStorage.removeItem('jwt');
  router.push({ name: 'accueil' });
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', storeWindowInnerWidth);
});
</script>

<style lang="scss" scoped>
.border-radius-2rem {
  border-radius: 2rem !important;
}

.custom-megamenu {
  background-color: inherit;
  border: none;
  /* Récupère la couleur de fond de la Card */
}

.custom-tabmenu {
  display: flex;
  justify-content: space-around;
  font-size: 5rem;
}

.layout-topbar-logo {
  display: flex;
  align-items: left;
  justify-content: left;
  padding: 0.5rem;
  /* Un petit espace autour du logo */
}

.logo-image {
  width: auto;
  /* Garde les proportions d'origine du logo */
  max-width: 100%;
  /* Le logo s'adapte à la taille du conteneur */
  height: 4rem;
  /* Définit une hauteur fixe pour le logo */
  object-fit: contain;
  /* S'assure que l'image reste contenue dans le conteneur */
}
</style>
