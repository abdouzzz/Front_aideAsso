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
    async deleteMember(id: number){
      try {
        const response = await MemberApi.deleteMember(id);
        if(response){
          return `Membre suppprimé avec succès`
        } else {
          return `Echec de la suppression du membre`
        }
      } catch (error) {
        console.error("Erreur lors de la suppression du membre  :", error);
        return "Erreur lors de la suppression du membre.";
      }
    },
    async deleteMembers(data: any){
      console.log(data);
      try {
        const response = await MemberApi.deleteMembers(data);
        if(response){
          return `Membres suppprimés avec succès`
        } else {
          return `Echec de la suppression des membres`
        }
      } catch (error) {
        console.error("Erreur lors de la suppression des membres  :", error);
        return "Erreur lors de la suppression des membres.";
      }
    }
  };
}
