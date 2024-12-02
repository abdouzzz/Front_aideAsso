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
          <div class="flex flex-wrap gap-2 items-center justify-between">
            <h4 class="m-0">Gérer les bénévoles</h4>
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText v-model="filters['global'].value" placeholder="Search..." />
            </IconField>
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
        <Column field="date_adhesion" header="Date d'adhésion" sortable style="min-width: 12rem"></Column>
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

    <PDialog v-model:visible="productDialog" :style="{ width: '450px' }" :header="membre.prenom + ' ' + membre.nom" :modal="true">
      <div class="flex flex-col gap-6">
        <img
          v-if="membre.image"
          :src="`https://primefaces.org/cdn/primevue/images/membre/${membre.image}`"
          :alt="membre.image"
          class="block m-auto pb-4"
        />
        <div>
          <label for="role" class="block font-bold mb-3">Rôle</label>
          <Dropdown id="inventoryStatus" v-model="membre.role" :options="statuses" optionLabel="label" placeholder="Choisissez un rôle">
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
        <PButton label="Save" icon="pi pi-check" @click="saveProduct" />
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
import { Membre } from '@/models/MembreModel';

const listeMembres = ref<Membre>([]);
const AssoService = useAssoService();

onMounted(async () => {
  const idAsso = sessionStorage.getItem('idAsso');
  listeMembres.value = await AssoService.getMembersByAssoId(Number(idAsso));
});

const toast = useToast();
const dt = ref();
const membres = ref();
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const membre = ref({});
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
  productDialog.value = true;
};
const hideDialog = () => {
  productDialog.value = false;
  submitted.value = false;
};
const saveProduct = () => {
  submitted.value = true;
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

  //     productDialog.value = false;
  //     membre.value = {};
  //   }
};
const editProduct = (prod) => {
  membre.value = { ...prod };
  productDialog.value = true;
};

const updateProduct = () => {
    
}

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
