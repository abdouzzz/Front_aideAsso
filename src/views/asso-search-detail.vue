<template>
    <div v-if="association">
        <h1>{{ association.nom }}</h1>
        <p><strong>Numéro RNA:</strong> {{ association.numero_rna }}</p>
        <p><strong>Numéro SIREN:</strong> {{ association.numero_siren }}</p>
        <p><strong>Page Web:</strong> <a :href="association.page_web_url" target="_blank">{{ association.page_web_url
                }}</a></p>
        <p><strong>Description:</strong> {{ association.description }}</p>
        <p><strong>Email:</strong> {{ association.email }}</p>
        <p><strong>Téléphone:</strong> {{ association.telephone }}</p>
        <p><strong>Date de publication au JO:</strong> {{ association.date_pub_jo | formatDate }}</p>
        <p><strong>Adresse:</strong> {{ association.adresse }}</p>
    </div>
    <div v-else>
        <p>Chargement des informations de l'association...</p>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { Association } from '@/models/AssociationModel';
import { useAssoService } from '@/composables/asso/AssoService';

const route = useRoute();
const association = ref<Association | null>(null);

// Récupération de l'ID de l'association à partir de la route
const assoId = ref<number | null>(route.params.id ? Number(route.params.id) : null);

// Appel de la fonction pour récupérer les données de l'association
async function fetchAssociation() {
    if (assoId.value) {
        try {
            association.value = await useAssoService().getAssociationById(assoId.value);
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'association:', error);
        }
    } else {
        console.error('ID de l\'association non trouvé dans l\'URL');
    }
}

// Appel initial de la fonction lorsque le composant est monté
onMounted(() => {
    fetchAssociation();
});

// Surveille les changements de `assoId` et refait l'appel de l'API si nécessaire
watch(assoId, (newId, oldId) => {
    if (newId !== oldId) {
        fetchAssociation();
    }
});

// Mise à jour de `assoId` lorsque la route change (utile si vous utilisez des paramètres de route dynamique)
watch(() => route.params.id, (newId) => {
    const id = newId ? Number(newId) : null;
    if (id !== assoId.value) {
        assoId.value = id;
    }
});
</script>
