import { useAssoApi } from './AssoAPI';

const assoApi = useAssoApi();

export function useAssoService() {
  return {
    async getAssociationById(id: number) {
      try {
        const response = await assoApi.getAssociationById(id);
        if (response) {
          return response;  // Retourne les données de l'association si l'appel est réussi
        } else {
          return 'Association non trouvée.';
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'association :', error);
        return 'Erreur lors de la récupération des données de l\'association.';
      }
    },

    async getTresorerieByAssoId(id: number) {
      try {
        const response = await assoApi.getTresorerieByAssoId(id);
        if (response) {
          return response;  // Retourne les transactions de la trésorerie si l'appel est réussi
        } else {
          return 'Aucune transaction trouvée.';
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de la trésorerie :', error);
        return 'Erreur lors de la récupération des transactions de trésorerie.';
      }
    },

    async getMembersByAssoId(id: number) {
      try {
        const response = await assoApi.getMembersByAssoId(id);
        if (response) {
          return response;  // Retourne la liste des membres si l'appel est réussi
        } else {
          return 'Aucun membre trouvé.';
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des membres :', error);
        return 'Erreur lors de la récupération des membres de l\'association.';
      }
    },

    async updateAssociation(id: number, updatedAsso: any) {
      try {
        const response = await assoApi.updateAssociation(id, updatedAsso);
        return response;  // Retourne un message de succès
      } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'association :', error);
        return 'Erreur lors de la mise à jour de l\'association.';
      }
    },

    async createAssociation(data: any) {
      try {
        const response = await assoApi.createAssociation(data);
        if (response && response.id_association) {
          return `Association créée avec succès. ID: ${response.id_association}`;
        } else {
          return 'Échec de la création de l\'association.';
        }
      } catch (error) {
        console.error('Erreur lors de la création de l\'association :', error);
        return 'Erreur lors de la création de l\'association.';
      }
    },
    async getAllAssociations(id: number) {
      try {
        const response = await assoApi.getAllAssociations(id);
        if (response) {
          return `liste des association trouver pour l'utilisateur:${id}`;
        } else {
          return 'Échec de la recupereation association.';
        }
      } catch (error) {
        console.error('Erreur lors de la recupereation des associations :', error);
        return 'Erreur lors de la création de l\'association.';
      }
    }
  };
}
