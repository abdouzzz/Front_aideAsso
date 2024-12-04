<template>
  <div class="btn-top-association">
    <PButton label="Nouvelle association" icon="pi pi-plus" iconPos="right" @click="showDialog = true" />
  </div>
  <div class="container mt-4" v-if="!isLoading">
    <div class="grid-container">
      <div class="grid-item" v-for="association in associationListe" :key="association.association_id">
        <Card style="width: 100%; overflow: hidden; height: 100%">
          <template #header>
            <div class="flex align-items-center gap-4 p-3">
              <img v-if="association.logo" :src="'data:image/png;base64,' + association.logo" alt="Tournament Logo"
                style="width: 40px;border-radius: 8px;" />
              <h2 style="margin: 0; font-size: 1.5rem; color: #333; font-weight: bold;">
                {{ association.nom }}
              </h2>
            </div>
          </template>
          <template #subtitle>
            <span style="font-size: 0.9rem; color: #666;">{{ association.date_pub_jo }}</span>
          </template>
          <template #content>
            <p style="font-size: 1rem; color: #555; line-height: 1.5; margin: 10px 0;">
              {{ association.description.slice(0, 200) + '...' }}
            </p>
          </template>
          <template #footer>
            <div class="flex justify-content-end p-3">
              <PButton @click="assoDetail(association.association_id)" label="En savoir plus" severity="secondary"
                outlined style="font-size: 0.9rem; padding: 0.5rem 1rem; border-radius: 5px" />
            </div>
          </template>
        </Card>
      </div>
    </div>
    <!-- Dialog for creating new association -->
    <PDialog v-model:visible="showDialog" class="flex-1 mx-5 md:flex-none custom-dialog" header="Nouvelle association"
      @hide="resetDialog">
      <Steps :model="steps" v-model:activeStep="active" />
      <!-- Step 1: Basic information -->
      <div v-if="active === 0">
        <div class="flex-1 flex flex-column gap-2 mt-3">
          <h2>Nouvelle association</h2>
          <p>Toutes les données peuvent être modifiées ultérieurement.</p>
        </div>
        <div class="flex-1 flex flex-column gap-2 mt-3">
          <label for="newAssociation.numero_rna">Numéro SIREN ou RNA</label>
          <InputText v-model="newAssociation.numero_rna" id="newAssociation.numero_rna"
            placeholder="Entrez le SIREN ou RNA" @blur="fetchAssociationData" />
        </div>
        <!-- Automatically fill in association data after fetching -->
        <div v-if="associationData" class="flex-1 flex flex-column gap-2 mt-3">
          <label for="associationName">Nom de l'association</label>
          <InputText v-model="newAssociation.nom" id="associationName" :disabled="false" />
          <label for="associationDescription">Description</label>
          <InputText v-model="newAssociation.description" id="associationDescription" :disabled="false" />
          <label for="associationEmail">Email</label>
          <InputText v-model="newAssociation.email" id="associationEmail" :disabled="false" />
          <label for="associationTelephone">Téléphone</label>
          <InputText v-model="newAssociation.telephone" id="associationTelephone" :disabled="false" />
          <label for="associationPageWeb">Page web</label>
          <InputText v-model="newAssociation.page_web_url" id="associationPageWeb" :disabled="false" />
          <label for="associationDatePubJO">Date de publication JO</label>
          <InputText v-model="newAssociation.date_pub_jo" id="associationDatePubJO" :disabled="true" />
          <label for="associationAdresse">Adresse</label>
          <AutoComplete v-model="newAssociation.adresse" optionLabel="" id="associationAdresse" :disabled="false"
            :suggestions="filteredAddresses" @complete="fetchAddresses" />
        </div>

      </div>
      <div class="p-dialog-footer mt-3" v-if="active === 0">
        <PButton label="Annuler" icon="pi pi-times" class="p-button-text" @click="resetDialog" />
        <PButton label="Suivant" icon="pi pi-arrow-right" @click="validateStep(nextStep)" />
      </div>
  
  <!-- Step 2: Logo -->
  <div v-if="active === 1">
    <div class="flex-1 flex flex-column gap-2 mt-3">
      <h2>Définissez le logo</h2>
      <p>Ajoutez un logo pour votre association (optionnel).</p>
    </div>
    <div class="flex-1 flex flex-column gap-2 mt-3">
      <label for="associationLogo">Logo de l'association</label>
          <FileUpload v-model="newAssociation.logo" :multiple="false" accept="image/*" :maxFileSize="1000000000000"
            @select="onSelectedFile($event)" />
    </div>
    <div class="p-dialog-footer mt-3">
      <PButton label="Précédent" icon="pi pi-arrow-left" @click="prevStep" class="p-button-text" />
      <PButton label="Enregistrer" icon="pi pi-check" @click="validateStep(saveAssociation)" />
    </div>
  </div>
  </PDialog>
  </div>
  <Toast />
  <div class="spinner-container" v-if="isLoading">
    <LoadingSpinner />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAssoService } from '@/composables/asso/AssoService';
import { useUserService } from '@/composables/user/UserService';
import { useToast } from 'primevue/usetoast';
import { useUtilsService } from '@/composables/UtilsService';
import LoadingSpinner from '@/components/ui-elements/LoadingSpinner.vue';
import UserModel from '@/models/UserModel';
import { Association } from '@/models/AssociationModel';
import axios from 'axios';

const toast = useToast();
const { isLoading } = useUtilsService();
const associationService = useAssoService();
const userService = useUserService();
const router = useRouter();

const showDialog = ref(false);
const active = ref(0);
const steps = [{ label: '' }, { label: '' }];
const user = ref<UserModel | null>(null);

const associationListe = ref<Association[]>([]);
const filteredAddresses = ref([]);
const newAssociation = ref<Association>({
  id: 0, // L'ID sera défini après la création
  nom: '',
  logo: '',
  numero_rna: '',
  numero_siren: '',
  page_web_url: '',
  description: '',
  email: '',
  telephone: '',
  date_pub_jo: new Date(),
  adresse: '',
  user_id: Number(sessionStorage.getItem('jwt')) || 0, // L'ID utilisateur est récupéré du sessionStorage
});

const associationData = ref<any>(null); // Stocke les données de l'association récupérées via l'API

async function fetchAddresses(event) {
  setTimeout(async () => {
    if (!event.query.trim().length) {
      // Réinitialiser la liste des adresses filtrées si la recherche est vide
      filteredAddresses.value = [];
    } else if (event.query.length > 2) {
      try {
        const response = await axios.get(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(event.query)}`);
        const results = response.data.features;

        // Mettre à jour la liste des adresses filtrées
        filteredAddresses.value = results.map(feature => feature.properties.label);
      } catch (error) {
        console.error('Erreur lors de la récupération des adresses:', error);
      }
    } else {
      // Réinitialiser la liste si la chaîne de recherche est trop courte
      filteredAddresses.value = [];
    }
  }, 250); // Temporisation de 250 ms pour réduire la fréquence des requêtes
}




async function fetchData() {
  const jwt = sessionStorage.getItem('jwt');
  if (jwt) {
    try {
      const userData = await userService.getUserById(Number(jwt));
      user.value = userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  } else {
    user.value = null;
  }
}

watch(
  () => sessionStorage.getItem('jwt'),
  async () => {
    await fetchData();
  }
);

onMounted(async () => {
  const jwt = sessionStorage.getItem('jwt');
  isLoading.value = true;
  await fetchData();
  associationListe.value = await associationService.getAllAssociations(Number(jwt));
  console.log(associationListe.value);
  isLoading.value = false;
});

const resetDialog = () => {
  showDialog.value = false;
  active.value = 0;
};

const nextStep = () => {
  active.value += 1;
};

const prevStep = () => {
  active.value -= 1;
};

const fetchAssociationData = async () => {
  if (newAssociation.value.numero_rna) {
    isLoading.value = true;
    try {
      // Récupération des données d'association via l'API gouvernementale
      const response = await axios.get(`https://siva-integ1.cegedim.cloud/apim/api-asso/api/structure/${newAssociation.value.numero_rna}`);
      if (response.data) {
        const data = response.data;
        associationData.value = data;

        // Remplir le formulaire avec les données récupérées
        newAssociation.value.nom = data.identite.nom || '';
        newAssociation.value.description = data.activites.objet || '';
        newAssociation.value.email = data.coordonnees.courriel || '';
        newAssociation.value.telephone = data.coordonnees.telephone || '';
        newAssociation.value.page_web_url = data.page_web_url || '';
        newAssociation.value.date_pub_jo = new Date(data.identite.date_pub_jo) || new Date();  // Récupère la date de publication
        newAssociation.value.adresse = [
          data.coordonnees.adresse_siege.num_voie,
          data.coordonnees.adresse_siege.type_voie,
          data.coordonnees.adresse_siege.voie,
          data.coordonnees.adresse_siege.cp,
          data.coordonnees.adresse_siege.commune
        ].join(' ');

      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données de l\'association:', error);
      toast.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Impossible de récupérer les informations de l\'association.',
        life: 5000,
      });
    }
    isLoading.value = false;
  }
};

const saveAssociation = async () => {
  // Combine the properties of newAssociation.value with user_id
  const assoAndUser = {
    ...newAssociation.value, // Spread the properties from newAssociation.value
    user_id: sessionStorage.getItem('jwt'), // Add user_id to the merged object
  };
  console.log(assoAndUser);
  try {
    await associationService.createAssociation(assoAndUser); // Use the combined object
    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: "L'association a été créée avec succès.",
      life: 5000,
    });

    // Fetch all associations and update the list
    associationListe.value = await associationService.getAllAssociations(Number(assoAndUser.user_id));
    resetDialog(); // Reset the dialog after successful creation
  } catch (error) {
    // Handle error if needed
    console.error('Error creating association:', error);
  }
};
const validateStep = async (callback: Function) => {
  if (!newAssociation.value.nom || !newAssociation.value.description || !newAssociation.value.email) {
    toast.add({
      severity: 'error',
      summary: 'Erreur de validation',
      detail: 'Tous les champs doivent être remplis.',
      life: 5000,
    });
  } else {
    callback();
  }
};

async function assoDetail(id: number) {
  sessionStorage.setItem('idAsso', id.toString()); // Suppose que `token` est renvoyé par l'API
  router.push('/asso-detail');
}

function onSelectedFile(event: any) {
  const file = event.files[0];

  const reader = new FileReader();

  reader.onloadend = function () {
    // Convertir le Blob en une chaîne de caractères
    const base64String = reader?.result as string | null;

    if (base64String) {
      const [, data] = base64String.split(',');
      // Enregistrer la chaîne de caractères dans votre objet ou l'envoyer au serveur
      newAssociation.value.logo = data;
      console.log(newAssociation.value.logo);
    }
  };

  // Lire le contenu du fichier en tant que Blob
  reader.readAsDataURL(file);
}
</script>

<style scoped>
/* Grille responsive avec 3 colonnes */
.grid-container {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  /* Par défaut, une colonne */
  gap: 16px;
  /* Espacement entre les éléments de la grille */
}

@media (min-width: 640px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
    /* 2 colonnes sur les écrans moyens (sm) */
  }
}

@media (min-width: 1024px) {
  .grid-container {
    grid-template-columns: repeat(3, 1fr);
    /* 3 colonnes sur les écrans larges (lg) */
  }
}

.grid-item {
  width: 100%;
  /* Les éléments prennent toute la largeur de leur colonne */
}
</style>