<template>
  <div class="association-form-container">
    <div class="form-grid">
      <!-- Logo -->
      <div class="field">
        <label for="logo">Logo (URL)</label>
        <img
          v-if="associationData.logo"
          :src="'data:image/png;base64,' + associationData.logo"
          alt="Tournament Image"
          :style="{ width: '15%', height: 'auto' }"
        />
        <FileUpload
          v-model="associationData.logo"
          :multiple="false"
          accept="image/*"
          :maxFileSize="1000000"
          @select="onSelectedFile($event)"
        />
      </div>

      <!-- Nom -->
      <div class="field">
        <label for="nom">Nom</label>
        <InputText id="nom" v-model="associationData.nom" placeholder="Nom de l'association" />
      </div>

      <!-- Sigle -->
      <div class="field">
        <label for="sigle">Sigle</label>
        <InputText id="sigle" v-model="associationData.sigle" placeholder="Sigle" />
      </div>

      <!-- Numéro RNA -->
      <div class="field">
        <label for="rna">Numéro RNA</label>
        <InputText id="rna" v-model="associationData.numero_rna" placeholder="Numéro RNA" :disabled="true" />
      </div>

      <!-- Numéro SIREN -->
      <div class="field">
        <label for="siren">Numéro SIREN</label>
        <InputText id="siren" v-model="associationData.numero_siren" placeholder="Numéro SIREN" :disabled="true" />
      </div>

      <!-- Lien de la page web -->
      <div class="field">
        <label for="page_web_url">Page Web</label>
        <InputText id="page_web_url" v-model="associationData.page_web_url" placeholder="Lien de la page web" />
      </div>

      <!-- Téléphone -->
      <div class="field">
        <label for="telephone">Téléphone</label>
        <InputText id="telephone" v-model="associationData.telephone" placeholder="Numéro de téléphone" />
      </div>

      <!-- Email -->
      <div class="field">
        <label for="email">Email</label>
        <InputText id="email" v-model="associationData.email" placeholder="Adresse email" />
      </div>

      <!-- Adresse -->
      <div class="field">
        <label for="adresse">Adresse</label>
        <PTextarea id="adresse" v-model="associationData.adresse" placeholder="Adresse" rows="3" />
      </div>

      <!-- Code postal -->
      <div class="field">
        <label for="code_postal">Code Postal</label>
        <InputNumber id="code_postal" v-model="associationData.code_postal" placeholder="Adresse" />
      </div>

      <!-- Ville -->
      <div class="field">
        <label for="ville">Ville</label>
        <InputText id="ville" v-model="associationData.ville" placeholder="Adresse" />
      </div>

      <!-- Objet (Description) -->
      <div class="field">
        <label for="objet">Objet</label>
        <PTextarea id="objet" v-model="associationData.description" placeholder="Objet de l'association" rows="5" />
      </div>

      <!-- Boutons d'action -->
      <div class="actions">
        <PButton label="Enregistrer" icon="pi pi-check" @click="saveAssociation" class="p-button-success" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAssoService } from '@/composables/asso/AssoService';
import { Association } from '@/models/AssociationModel';
import { useToast } from 'primevue/usetoast';

const associationService = useAssoService();
const associationData = ref<Association>({});
const isLoading = ref<boolean>();
const toast = useToast();

onMounted(async () => {
  const jwt = sessionStorage.getItem('idAsso');
  isLoading.value = true;
  associationData.value = await associationService.getAssociationById(Number(jwt));
  console.log(associationData.value);
  isLoading.value = false;
});

const saveAssociation = async () => {
  try {
    console.log(associationData.value);
    await associationService.updateAssociation(Number(sessionStorage.getItem('idAsso')), associationData.value); // Use the combined object
    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: "L'association a été modifiée avec succès.",
      life: 5000,
    });
  } catch (error) {
    // Handle error if needed
    console.error('Error creating association:', error);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onSelectedFile(event: any) {
  const file = event.files[0];

  const reader = new FileReader();

  reader.onloadend = function () {
    // Convertir le Blob en une chaîne de caractères
    const base64String = reader?.result as string | null;

    if (base64String) {
      const [, data] = base64String.split(',');
      // Enregistrer la chaîne de caractères dans votre objet ou l'envoyer au serveur
      associationData.value.logo = data;
      console.log(associationData.value.logo);
    }
  };

  // Lire le contenu du fichier en tant que Blob
  reader.readAsDataURL(file);
}
</script>

<style scoped>
.association-form-container {
  max-width: 800px;
  margin: 0 auto;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
}

.actions {
  grid-column: span 2;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
