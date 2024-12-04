import { useMemberApi } from './MemberAPI';

const MemberApi = useMemberApi();

export function useMemberService() {
  return {
    async updateMember(id: number, updatedMember: any) {
      try {
        const response = await MemberApi.updateMember(id, updatedMember);
        return response; // Retourne un message de succès
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'association :", error);
        return "Erreur lors de la mise à jour de l'association.";
      }
    },
    async addMember(id: number, data: any) {
      try {
        const response = await MemberApi.addMember(id, data);
        if (response) {
          return `Membres ajoutés avec succès. ID: ${response}`;
        } else {
          return "Échec de l'ajout des membres.";
        }
      } catch (error) {
        console.error("Erreur lors de l'ajout des membres  :", error);
        return "Erreur lors de l'ajout des membres.";
      }
    },
  };
}
