<template>
  <div class="p-4">
    <!-- Cartes de résumé -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
      <div class="card p-4 flex items-center justify-between" style="flex: 1 1 22%;">
        <i class="pi pi-calendar text-blue-500 text-3xl"></i>
        <div>
          <h5>Total Transactions</h5>
          <p class="text-xl font-bold">{{ transactions.length }}</p>
        </div>
      </div>
      <div class="card p-4 flex items-center justify-between" style="flex: 1 1 22%;">
        <i class="pi pi-wallet text-green-500 text-3xl"></i>
        <div>
          <h5>Total Crédit</h5>
          <p class="text-xl font-bold">{{ totalCredit }} €</p>
        </div>
      </div>
      <div class="card p-4 flex items-center justify-between" style="flex: 1 1 22%;">
        <i class="pi pi-minus text-red-500 text-3xl"></i>
        <div>
          <h5>Total Débit</h5>
          <p class="text-xl font-bold">{{ totalDebit }} €</p>
        </div>
      </div>
      <div class="card p-4 flex items-center justify-between" style="flex: 1 1 22%;">
        <i class="pi pi-dollar text-yellow-500 text-3xl"></i>
        <div>
          <h5>Somme Totale</h5>
          <p class="text-xl font-bold">{{ netBalance }} €</p>
        </div>
      </div>
    </div>
     <!-- Graphique en courbes -->
    <div class="mb-4">
      <div class="card">
        <Chart type="line" :data="lineChartData" :options="lineChartOptions" class="h-[28rem]" />
      </div>
    </div>
     <!-- Table des transactions -->
    <DataTable 
      v-model:filters="filters"
      :value="transactions"
      paginator
      :rows="5"
      dataKey="id"
      filterDisplay="row"
      :loading="loading"
      :globalFilterFields="['nom_transaction', 'tiers', 'operation', 'date_operation']"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 15, 25]"
      currentPageReportTemplate="Affiche {first} à {last} de {totalRecords} transactions"
    >
        <template #header>
          <div class="flex" style="justify-content:space-between; align-items:baseline">
            <PButton label="Ajouter une transaction" icon="pi pi-plus" @click="showDialog = true" class="mb-3" />
            <InputText v-model="filters['global'].value" placeholder="Rechercher" />
          </div>
        </template>
        <template #empty>Aucune transaction trouvée</template>
        <template #loading>Chargement des transactions. Veuillez patienter.</template>
  
        <Column field="nom_transaction" header="Nom de transaction" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.nom_transaction }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" @input="filterCallback()" placeholder="Filtrer par nom de transaction" />
          </template>
        </Column>
  
        <Column field="operation" header="Transaction" style="min-width: 10rem">
          <template #body="{ data }">
            {{ data.operation }}€
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" @input="filterCallback()" placeholder="Filtrer par transaction" />
          </template>
        </Column>
  
        <Column field="date_operation" header="Date" style="min-width: 12rem">
          <template #body="{ data }">
            {{ formatDate(data.date_operation) }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <Calendar v-model="filterModel.value" dateFormat="dd/mm/yy" @change="filterCallback()" placeholder="Filtrer par date" />
          </template>
        </Column>
  
        <Column field="tiers" header="Tiers" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.tiers }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" @input="filterCallback()" placeholder="Filtrer par tier" />
          </template>
        </Column>
    </DataTable>
     <!-- Dialogue pour ajouter une transaction -->
    <PDialog header="Ajouter une transaction" v-model:visible="showDialog" :modal="true" :closable="false" :style="{ width: '50vw' }">
      <div class="p-fluid">
        <div class="field">
          <label for="nom_transaction">Nom de la transaction</label>
          <InputText id="nom_transaction" v-model="newTransaction.nom_transaction" />
        </div>
        <div class="field">
          <label for="operation">Montant</label>
          <InputNumber id="operation" v-model="newTransaction.operation" />
        </div>
        <div class="field">
          <label for="date_operation">Date</label>
          <Calendar id="date_operation" v-model="newTransaction.date_operation" dateFormat="dd/mm/yy" />
        </div>
        <div class="field">
          <label for="tiers">Tiers</label>
          <InputText id="tiers" v-model="newTransaction.tiers" />
        </div>
      </div>
      <template #footer>
        <PButton label="Annuler" icon="pi pi-times" class="p-button-text" @click="showDialog = false" />
        <PButton label="Ajouter" icon="pi pi-check" @click="addTransaction" />
      </template>
    </PDialog>
  </div>
</template>
  
<script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useAssoService } from '@/composables/asso/AssoService';
  import { FilterMatchMode } from '@primevue/core/api';
    import { useToast } from 'primevue/usetoast';

  const assoService = useAssoService();
  const transactions = ref([]);
  const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nom_transaction: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    operation: { value: null, matchMode: FilterMatchMode.CONTAINS },
    date_operation: { value: null, matchMode: FilterMatchMode.DATE },
    tiers: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
  });
  const newTransaction = ref({
    association_id: Number(sessionStorage.getItem("idAsso")),
    nom_transaction: "",
    operation: null,
    date_operation: null,
    tiers: ""
  });
  const showDialog = ref(false);
  const loading = ref(true);
  const toast = useToast();
  const lineChartData = ref(null);
  const lineChartOptions = ref(null);
  
  onMounted(async () => {
    try {
      const res = await assoService.getAllTresorieByAssociations(Number(sessionStorage.getItem("idAsso")));
      transactions.value = res.map(transaction => ({
        ...transaction,
        date_operation: new Date(transaction.date_operation)
      }));
      loading.value = false;
      updateChartData();
    } catch (error) {
      console.error('Error fetching transactions', error);
    }
  });
  
  const totalCredit = computed(() => {
    return transactions.value.reduce((acc, transaction) => (transaction.operation > 0 ? acc + transaction.operation : acc), 0).toFixed(2);
  });
  
  const totalDebit = computed(() => {
    return transactions.value.reduce((acc, transaction) => (transaction.operation < 0 ? acc - transaction.operation : acc), 0).toFixed(2);
  });
  
  const netBalance = computed(() => {
    return (totalCredit.value - totalDebit.value).toFixed(2);
  });
  
  const formatDate = (date) => {
    if (!date) return '';
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Intl.DateTimeFormat('fr-FR', options).format(date);
  };
  
  const updateChartData = async () => {
    const res = await assoService.getAllTresorieByAssociations(Number(sessionStorage.getItem("idAsso")));
      transactions.value = res.map(transaction => ({
        ...transaction,
        date_operation: new Date(transaction.date_operation)
      }));
    const groupedByDate = transactions.value
  .sort((a, b) => new Date(a.date_operation) - new Date(b.date_operation)) // Trier par date
  .reduce((acc, transaction) => {
    const date = transaction.date_operation;
    const day = String(date.getDate()).padStart(2, '0'); // Jour sur 2 chiffres
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mois sur 2 chiffres (0-indexé)
    const year = date.getFullYear(); // Année sur 4 chiffres
    const formattedDate = `${day}-${month}-${year}`;

    
    // Initialiser la date si elle n'existe pas dans `acc`
    if (!acc[formattedDate]) {
      acc[formattedDate] = { total: 0, credit: 0, debit: 0 };
    }
    
    // Ajouter l'opération au crédit, débit et total
    acc[formattedDate].total += transaction.operation;
    if (transaction.operation > 0) {
      acc[formattedDate].credit += transaction.operation;
    } else {
      acc[formattedDate].debit += transaction.operation;
    }
    
    // Si ce n'est pas la première date, ajouter le total cumulatif de la date précédente
    const dates = Object.keys(acc); // Obtenir les clés triées
    const previousDate = dates[dates.length - 2]; // Date précédente (si elle existe)
    if (previousDate) {
      acc[formattedDate].total += acc[previousDate].total; // Ajouter le total cumulatif précédent
    }
    
    return acc;
  }, {});

  
    lineChartData.value = {
      labels: Object.keys(groupedByDate),
      datasets: [
        {
          label: 'Total',
          type:'line',
          data: Object.values(groupedByDate).map(item => item.total),
          borderColor: '#42A5F5',
          backgroundColor: 'rgba(66, 165, 245, 0.3)',
          fill: false,
          tension: 0.4
        },
        {
          label: 'Crédit',
          type:'bar',
          data: Object.values(groupedByDate).map(item => item.credit),
          borderColor: '#66BB6A',
          backgroundColor: 'rgba(102, 187, 106, 0.3)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Débit',
          type:'bar',
          data: Object.values(groupedByDate).map(item => item.debit),
          borderColor: '#EF5350',
          backgroundColor: 'rgba(239, 83, 80, 0.3)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');
  
    lineChartOptions.value = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        }
      }
    };
  };
  
  const addTransaction = async () => {
    // if (newTransaction.value.nom_transaction && newTransaction.value.operation !== null && newTransaction.value.date_operation) {
    //   transactions.value.push({ ...newTransaction.value, id: Date.now() }); // Simulated ID
    //   newTransaction.value = {
    //     association_id: Number(sessionStorage.getItem("idAsso")),
    //     nom_transaction: "",
    //     operation: null,
    //     date_operation: null,
    //     tiers: ""
    //   };
    //   showDialog.value = false;
    //   updateChartData();
    // } else {
    //   alert('Veuillez remplir tous les champs.');
    // }
     try {
      await assoService.saveTresorieAsso(newTransaction.value);
      toast.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Les membres ont été ajoutés avec succès.',
        life: 5000,
      });
      showDialog.value = false;
      updateChartData();
    } catch (error) {
      // Handle error if needed
      console.error('Error adding members:', error);
  }
  };
</script>
  
<style scoped>
/* Ajoutez ici vos styles spécifiques si nécessaire */
</style>
  