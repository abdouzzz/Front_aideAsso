<template>
  <div>
    <div class="card">
      <Toolbar class="mb-6">
        <template #start>
          <PButton label="New" icon="pi pi-plus" class="mr-2" @click="openNew" />
          <PButton
            label="Delete"
            icon="pi pi-trash"
            severity="danger"
            outlined
            @click="confirmDeleteSelected"
            :disabled="!selectedProducts || !selectedProducts.length"
          />
        </template>
      </Toolbar>
      <DataTable
        ref="dt"
        v-model:selection="selectedProducts"
        :value="listeMembres"
        dataKey="id"
        :paginator="true"
        :rows="10"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 15, 25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} membres"
      >
        <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between" style="justify-content:space-between!important align-items:baseline">
            <h4 class="m-0">Gérer les bénévoles</h4>
            <InputText v-model="filters['global'].value" placeholder="Search..." />
          </div>
        </template>

        <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
        <Column field="id" header="ID" sortable style="min-width: 5rem"></Column>
        <Column field="username" header="Username" sortable style="min-width: 5rem"></Column>
        <Column header="Image">
          <template #body="slotProps">
            <img
              :src="`https://primefaces.org/cdn/primevue/images/membre/${slotProps.data.image}`"
              :alt="slotProps.data.image"
              class="rounded"
              style="width: 64px"
            />
          </template>
        </Column>
        <Column field="prenom" header="Prénom" sortable style="min-width: 8rem"></Column>
        <Column field="nom" header="Nom" sortable style="min-width: 10rem"></Column>
        <Column field="role" header="Rôle" sortable style="min-width: 12rem"></Column>
        <Column field="email" header="Mail" sortable style="min-width: 12rem"></Column>
        <Column field="date_adhesion" header="Date d'adhésion" sortable style="min-width: 12rem">
          <template #body="slotProps">
            salut
          </template>
        </Column>
        <Column field="est_actif" header="Activité" sortable style="min-width: 12rem">
          <template #body="slotProps">
            <Tag v-if="slotProps.data.est_actif" value="Actif" severity="success" />
            <Tag v-else value="Inactif" severity="danger" />
          </template>
        </Column>
        <Column :exportable="false" style="min-width: 12rem">
          <template #body="slotProps">
            <PButton icon="pi pi-pencil" outlined rounded class="mr-2" @click="editProduct(slotProps.data)" />
            <PButton icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(slotProps.data)" />
          </template>
        </Column>
      </DataTable>
    </div>
    <PDialog v-model:visible="addMembreDialog" :style="{ width: '600px' }" header="Ajouter des membres" :modal="true">
      <!-- <div class="flex flex-col gap-6"> -->
      <!-- <MultiSelect
          id="user-select"
          v-model="selectedUsers"
          :options="membres"
          :optionLabel="'username'"
          :optionValue="'id'"
          filter
          filterPlaceholder="Rechercher un utilisateur"
          :placeholder="'Choisissez des utilisateurs'"
          class="w-full"
        >
          <template #selectedValue="slotProps">
            {{ slotProps.value }}
            <img
              v-if="membre.image"
              :src="`https://primefaces.org/cdn/primevue/images/membre/${membre.image}`"
              :alt="membre.image"
              class="block m-auto pb-4"
            />
            <Tag class="mr-2 mb-1" :value="slotProps.value.name" />
          </template>
        </MultiSelect> -->
      <template #footer>
        <PButton v-if="step === 1" label="Suivant" icon="pi pi-arrow-right" @click="goToStep(2)" :disabled="!selectedUsers.length" />
        <PButton v-else-if="step === 2" label="Enregistrer" icon="pi pi-check" @click="saveProduct" />
        <PButton label="Annuler" icon="pi pi-times" text />
      </template>
      <!-- Étape 1 : Sélection des utilisateurs -->
      <div v-if="step === 1">
        <label for="user-select" class="block text-sm font-medium text-gray-700 mb-2">Sélectionnez des utilisateurs</label>
        <MultiSelect
          id="user-select"
          v-model="selectedUsers"
          :options="membres"
          :optionLabel="'username'"
          :optionValue="'id'"
          filter
          filterPlaceholder="Rechercher un utilisateur"
          :placeholder="'Choisissez des utilisateurs'"
          class="w-full"
        >
          <template #selectedValue="slotProps">
            {{ slotProps.value }}
            <img
              v-if="membre.image"
              :src="`https://primefaces.org/cdn/primevue/images/membre/${membre.image}`"
              :alt="membre.image"
              class="block m-auto pb-4"
            />
            <Tag class="mr-2 mb-1" :value="slotProps.value.name" />
          </template>
        </MultiSelect>
      </div>
      <!-- Étape 2 : Définition des informations -->
      <div v-if="step === 2">
        <div v-for="(user, index) in selectedUsersDetails" :key="user.id" class="mb-4 p-4 border rounded">
          <h3 class="text-lg font-bold mb-2">{{ user.username }}</h3>
          <div class="flex flex-col gap-2">
            <div>
              <!-- <label for="role" class="block font-bold mb-3">Rôle</label>
              <Dropdown
                id="inventoryStatus"
                v-model="membre.role"
                :options="statuses"
                optionLabel="label"
                optionValue="label"
                placeholder="Choisissez un rôle"
              > -->
              <label :for="'role-' + index" class="block font-medium">Rôle</label>
              <Dropdown
                v-model="user.role"
                :options="statuses"
                optionLabel="label"
                :id="'role-' + index"
                placeholder="Sélectionnez un rôle"
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value && slotProps.value.value">
                    <Tag :value="slotProps.value.label" :severity="getStatusLabel(slotProps.value.label)" />
                  </div>
                  <div v-else-if="slotProps.value && !slotProps.value.value">
                    <Tag :value="slotProps.value" :severity="getStatusLabel(slotProps.value)" />
                  </div>
                  <span v-else>{{ slotProps.placeholder }}</span>
                </template>
              </Dropdown>
            </div>
            <div>
              <label :for="'date_adhesion-' + index" class="block font-bold mb-3">Date d'adhésion</label>
              <Calendar v-model="user.date_adhesion" :id="'date_adhesion-' + index" />
            </div>
            <div>
              <label :for="'est_actif-' + index" class="block font-bold mb-3">Activité</label>
              <ToggleButton v-model="user.est_actif" :id="'est_actif-' + index" onLabel="Actif" offLabel="Inactif" @click="console.log(user.est_actif)" />
            </div>
          </div>
        </div>
      </div>
      <!-- </div> -->

      <!-- <template #footer>
        <PButton label="Cancel" icon="pi pi-times" text @click="hideDialog" />
        <PButton label="Save" icon="pi pi-check" @click="updateProduct" />
      </template> -->
    </PDialog>
    <PDialog v-model:visible="editMembreDialog" :style="{ width: '450px' }" :header="membre.prenom + ' ' + membre.nom" :modal="true">
      <div class="flex flex-col gap-6">
        <img
          v-if="membre.image"
          :src="`https://primefaces.org/cdn/primevue/images/membre/${membre.image}`"
          :alt="membre.image"
          class="block m-auto pb-4"
        />
        <div>
          <label for="role" class="block font-bold mb-3">Rôle</label>
          <Dropdown
            id="inventoryStatus"
            v-model="membre.role"
            :options="statuses"
            optionLabel="label"
            optionValue="label"
            placeholder="Choisissez un rôle"
          >
            <template #value="slotProps">
              {{ slotProps.value.value }}
              <div v-if="slotProps.value && slotProps.value.value">
                <Tag :value="slotProps.value.label" :severity="getStatusLabel(slotProps.value.label)" />
              </div>
              <div v-else-if="slotProps.value && !slotProps.value.value">
                <Tag :value="slotProps.value" :severity="getStatusLabel(slotProps.value)" />
              </div>
              <span v-else>{{ slotProps.placeholder }}</span>
            </template>
          </Dropdown>
        </div>
        <div>
          <label for="date_adhesion" class="block font-bold mb-3">Date d'adhésion</label>
          <Calendar v-model="membre.date_adhesion" />
        </div>
        <div>
          <label for="est_actif" class="block font-bold mb-3">Activité</label>
          <ToggleButton v-model="membre.est_actif" onLabel="Actif" offLabel="Inactif" />
        </div>
      </div>

      <template #footer>
        <PButton label="Cancel" icon="pi pi-times" text @click="hideDialog" />
        <PButton label="Save" icon="pi pi-check" @click="updateProduct" />
      </template>
    </PDialog>

    <PDialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="membre"
          >Are you sure you want to delete <b>{{ membre.name }}</b
          >?</span
        >
      </div>
      <template #footer>
        <PButton label="No" icon="pi pi-times" text @click="deleteProductDialog = false" />
        <PButton label="Yes" icon="pi pi-check" @click="deleteProduct" />
      </template>
    </PDialog>

    <PDialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="membre">Are you sure you want to delete the selected membres?</span>
      </div>
      <template #footer>
        <PButton label="No" icon="pi pi-times" text @click="deleteProductsDialog = false" />
        <PButton label="Yes" icon="pi pi-check" text @click="deleteSelectedProducts" />
      </template>
    </PDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { useAssoService } from '@/composables/asso/AssoService';
import { useUserService } from '@/composables/user/UserService';
import { useMemberService } from '@/composables/member/MemberService';
import { Membre } from '@/models/MembreModel';

const listeMembres = ref<Membre>([]);
const AssoService = useAssoService();
const MemberService = useMemberService();
const UserService = useUserService();

onMounted(async () => {
  const idAsso = sessionStorage.getItem('idAsso');
  listeMembres.value = await AssoService.getMembersByAssoId(Number(idAsso));
  allMembres.value = await UserService.getUsers();
  membres.value = allMembres.value.filter((user) => !listeMembres.value.some((member) => member.user_id === user.id));
});

const toast = useToast();
const dt = ref();
const membres = ref<Membre[]>([]);
const membre = ref<Membre>({});
const addMembreDialog = ref(false);
const editMembreDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const selectedUsers = ref([]);
const allMembres = ref<Membre[]>();
const step = ref(1);
const selectedUsersDetails = ref([]); // Détails des utilisateurs sélectionnés

// Gestion des étapes
const goToStep = (stepNumber) => {
  step.value = stepNumber;
  if (stepNumber === 2) {
    // Remplir les détails des utilisateurs sélectionnés à l'étape 2
    selectedUsersDetails.value = selectedUsers.value.map((id) => {
      const user = membres.value.find((u) => u.id === id);
      return { ...user, role: null, est_actif: false, date_adhesion: null }; // Ajouter des champs modifiables
    });
  }
};

const selectedProducts = ref();
const filters = ref({
  'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const submitted = ref(false);
const statuses = ref([
  { label: 'Président', value: 'president' },
  { label: 'Secrétaire', value: 'secretaire' },
  { label: 'Trésorier', value: 'tresorier' },
  { label: 'Bénévole', value: 'benevole' },
]);
const openNew = () => {
  membre.value = {};
  submitted.value = false;
  addMembreDialog.value = true;
};
const hideDialog = () => {
  editMembreDialog.value = false;
  submitted.value = false;
};
const saveProduct = async () => {
  // submitted.value = true;
  const jsonOutput = {
    newMembres: selectedUsersDetails.value.map((user) => ({
      id_user: user.id,
      role: user.role.label,
      date_adhesion: user.date_adhesion,
      est_actif: user.est_actif,
    })),
  };
  try {
    await MemberService.addMember(Number(sessionStorage.getItem('idAsso')), jsonOutput); // Use the combined object
    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Les membres ont été ajoutés avec succès.',
      life: 5000,
    });
    addMembreDialog.value = false;
    // membre.value = {};
  } catch (error) {
    // Handle error if needed
    console.error('Error adding members:', error);
  }
  //   if (membre?.value.name?.trim()) {
  //     if (membre.value.id) {
  //       membre.value.inventoryStatus = membre.value.inventoryStatus.value ? membre.value.inventoryStatus.value : membre.value.inventoryStatus;
  //       membres.value[findIndexById(membre.value.id)] = membre.value;
  //       toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
  //     } else {
  //       membre.value.id = createId();
  //       membre.value.code = createId();
  //       membre.value.image = 'membre-placeholder.svg';
  //       membre.value.inventoryStatus = membre.value.inventoryStatus ? membre.value.inventoryStatus.value : 'INSTOCK';
  //       membres.value.push(membre.value);
  //       toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
  //     }

  //     editMembreDialog.value = false;
  //     membre.value = {};
  //   }
};

const editProduct = (prod) => {
  membre.value = { ...prod };
  editMembreDialog.value = true;
};

const updateProduct = async () => {
  try {
    await MemberService.updateMember(Number(membre.value.id), membre.value); // Use the combined object
    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: "L'association a été modifiée avec succès.",
      life: 5000,
    });
    editMembreDialog.value = false;
    membre.value = {};
  } catch (error) {
    // Handle error if needed
    console.error('Error creating association:', error);
  }
};

const confirmDeleteProduct = (prod) => {
  membre.value = prod;
  deleteProductDialog.value = true;
};
const deleteProduct = () => {
  membres.value = membres.value.filter((val) => val.id !== membre.value.id);
  deleteProductDialog.value = false;
  membre.value = {};
  toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
};
const findIndexById = (id) => {
  let index = -1;
  for (let i = 0; i < membres.value.length; i++) {
    if (membres.value[i].id === id) {
      index = i;
      break;
    }
  }
  return index;
};
const createId = () => {
  let id = '';
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for ( var i = 0; i < 5; i++ ) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};
const confirmDeleteSelected = () => {
  deleteProductsDialog.value = true;
};

const formatDate = (date) => {
  if (!date) return '';
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Intl.DateTimeFormat('fr-FR', options).format(date);
};

const deleteSelectedProducts = () => {
  membres.value = membres.value.filter((val) => !selectedProducts.value.includes(val));
  deleteProductsDialog.value = false;
  selectedProducts.value = null;
  toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'INSTOCK':
      return 'success';
    case 'LOWSTOCK':
      return 'warn';
    case 'OUTOFSTOCK':
      return 'danger';
    default:
      return null;
  }
};
</script>
