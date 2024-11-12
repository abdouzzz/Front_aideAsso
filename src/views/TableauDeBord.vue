<template>
    <div class="btn-top-association">
      <PButton
        label="Nouvelle association"
        icon="pi pi-plus"
        iconPos="right"
        @click="showDialog = true"
      />
    </div>
  
    <div class="grid-container" v-if="!isLoading">
      <router-link
        :to="{ name: 'asso-detail', params: { id: association.id } }"
        class="grid-container"
        v-for="association in associationListe"
        :key="association.id"
      >
        <div class="card mb-0" style="height: 150px">
          <div class="flex flex-row align-items-center">
            <div>
              <span>
                <img
                  :src="'data:image/png;base64,' + association.logo"
                  alt="Association Logo"
                  :style="{ width: '90%', height: 'auto' }"
                />
              </span>
            </div>
            <div class="col-10 flex flex-column justify-content-center">
              <span class="block text-700 font-medium mb-2 text-xl text-center">{{ association.nom }}</span>
              <span class="block text-500 font-medium text-center">{{ association.ville }}</span>
            </div>
          </div>
        </div>
      </router-link>
  
      <!-- Dialog for creating new association -->
      <PDialog v-model:visible="showDialog" class="flex-1 mx-5 md:flex-none custom-dialog" header="Nouvelle association" @hide="resetDialog">
        <Steps :model="steps" v-model:activeStep="active" />
        
        <!-- Step 1: Basic information -->
        <div v-if="active === 0">
          <div class="flex-1 flex flex-column gap-2 mt-3">
            <h2>Nouvelle association</h2>
            <p>Toutes les données peuvent être modifiées ultérieurement.</p>
          </div>
  
          <div class="flex-1 flex flex-column gap-2 mt-3">
            <label for="numeroSirenRNA">Numéro SIREN ou RNA</label>
            <InputText v-model="numeroSirenRNA" id="numeroSirenRNA" placeholder="Entrez le SIREN ou RNA" @blur="fetchAssociationData" />
          </div>
  
          <!-- Automatically fill in association data after fetching -->
          <div v-if="associationData" class="flex-1 flex flex-column gap-2 mt-3">
            <label for="associationName">Nom de l'association</label>
            <InputText v-model="newAssociation.nom" id="associationName" :disabled="true" />
            
            <label for="associationDescription">Description</label>
            <InputText v-model="newAssociation.description" id="associationDescription" :disabled="true" />
            
            <label for="associationEmail">Email</label>
            <InputText v-model="newAssociation.email" id="associationEmail" :disabled="true" />
            
            <label for="associationTelephone">Téléphone</label>
            <InputText v-model="newAssociation.telephone" id="associationTelephone" :disabled="true" />
            
            <label for="associationPageWeb">Page web</label>
            <InputText v-model="newAssociation.page_web_url" id="associationPageWeb" :disabled="true" />
  
            <label for="associationDatePubJO">Date de publication JO</label>
            <InputText v-model="newAssociation.date_pub_jo" id="associationDatePubJO" :disabled="true" />
          </div>
  
          <div class="p-dialog-footer mt-3">
            <PButton label="Annuler" icon="pi pi-times" class="p-button-text" @click="resetDialog" />
            <PButton label="Suivant" icon="pi pi-arrow-right" @click="validateStep(nextStep)" />
          </div>
        </div>
  
        <!-- Step 2: Logo -->
        <div v-if="active === 1">
          <div class="flex-1 flex flex-column gap-2 mt-3">
            <h2>Définissez le logo</h2>
            <p>Ajoutez un logo pour votre association (optionnel).</p>
          </div>
          <div class="flex-1 flex flex-column gap-2 mt-3">
            <label for="associationLogo">Logo</label>
            <InputText v-model="newAssociation.logo" id="associationLogo" />
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
  
  const showDialog = ref(false);
  const active = ref(0);
  const steps = [{ label: '' }, { label: '' }];
  const user = ref<UserModel | null>(null);
  
  const associationListe = ref<Association[]>([]);
  const newAssociation = ref<Association>({
    id: 0,  // L'ID sera défini après la création
    nom: '',
    numero_rna: '',
    numero_siren: '',
    page_web_url: '',
    description: '',
    email: '',
    telephone: '',
    date_pub_jo: new Date(),
    user_id: Number(sessionStorage.getItem('jwt')) || 0,  // L'ID utilisateur est récupéré du sessionStorage
  });
  
  const numeroSirenRNA = ref('');
  const associationData = ref<any>(null); // Stocke les données de l'association récupérées via l'API
  
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
  
  watch(() => sessionStorage.getItem('jwt'), async () => {
    await fetchData();
  });
  
  onMounted(async () => {
    isLoading.value = true;
    await fetchData();
    associationListe.value = await associationService.getAllAssociations();
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
    if (numeroSirenRNA.value) {
      isLoading.value = true;
      try {
        // Récupération des données d'association via l'API gouvernementale
        const response = await axios.get(`https://siva-integ1.cegedim.cloud/apim/api-asso/api/structure/${numeroSirenRNA.value}`);
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
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données de l\'association:', error);
        toast.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de récupérer les informations de l\'association.',
          life: 5000
        });
      }
      isLoading.value = false;
    }
  };
  
  const saveAssociation = async () => {
  // Combine the properties of newAssociation.value with user_id
  const assoAndUser = {
    ...newAssociation.value, // Spread the properties from newAssociation.value
    user_id: sessionStorage.getItem('jwt') // Add user_id to the merged object
  };

  try {
    await associationService.createAssociation(assoAndUser); // Use the combined object
    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: "L'association a été créée avec succès.",
      life: 5000,
    });

    // Fetch all associations and update the list
    associationListe.value = await associationService.getAllAssociations();
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
        life: 5000
      });
    } else {
      callback();
    }
  };
  </script>
  