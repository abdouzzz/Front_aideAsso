import axiosInstance from '@/config/AxiosConfig';
import { ApiUrlMembres, ApiUrlAssos } from '@/constants/ApiUrls';

export function useMemberApi() {
  return {
    async updateMember(id: number, updatedMember: any) {
      const res = await axiosInstance.put(`${ApiUrlMembres}/update/${id}`, updatedMember);
      return res.data.message;
    },
    async addMember(id: number, newMember: any){
      const res = await axiosInstance.post(`${ApiUrlAssos}/${id}/add/membres`, newMember);
      return res.data.message;
    },
    async deleteMember(id: number){
      const res = await axiosInstance.delete(`${ApiUrlMembres}/delete/${id}`);
      return res.data.message;
    },
    async deleteMembers(deletedMembers: any){
      console.log(deletedMembers);
      const res = await axiosInstance.post(`${ApiUrlMembres}/delete`, deletedMembers);
      return res.data.message;
    },
  };
}
