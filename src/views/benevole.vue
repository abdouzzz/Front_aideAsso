<template>
  <div class="card">
    <DataTable :value="listeMembres" stripedRows tableStyle="min-width: 50rem">
      <Column v-for="col of columns" :key="col.id" :field="col.field" :header="col.header"></Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAssoService } from '@/composables/asso/AssoService';
import { Membre } from '@/models/MembreModel';

const listeMembres = ref<Membre>([]);
const AssoService = useAssoService();
const columns = [
  { field: 'id', header: 'ID' },
  { field: 'username', header: 'Username' },
  { field: 'nom', header: 'Nom' },
  { field: 'prenom', header: 'Prénom' },
  { field: 'email', header: 'Mail' },
  { field: 'role', header: 'Rôle' },
];
onMounted(async () => {
  const idAsso = sessionStorage.getItem('idAsso');
  listeMembres.value = await AssoService.getMembersByAssoId(Number(idAsso));
  console.log(listeMembres.value);
});
</script>
