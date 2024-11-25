<template>
  <h1>Salut</h1>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAssoService } from '@/composables/asso/AssoService';
import { Association } from '@/models/AssociationModel';

const associationService = useAssoService();
const associationData = ref<Association>();
const isLoading = ref<boolean>();

onMounted(async () => {
  const jwt = sessionStorage.getItem('idAsso');
  isLoading.value = true;
  associationData.value = await associationService.getAssociationById(Number(jwt));
  console.log(associationData.value);
  isLoading.value = false;
});
</script>
