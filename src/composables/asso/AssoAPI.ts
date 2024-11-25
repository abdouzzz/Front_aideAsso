import axiosInstance from '@/config/AxiosConfig';
import { ApiUrlAssos, ApiUrlUsers } from '@/constants/ApiUrls';

export function useAssoApi() {
  return {
    async getAssociationById(id: number) {
      const res = await axiosInstance.get(`${ApiUrlAssos}/id/${id}`);
      return res.data.body;
    },

    async getTresorerieByAssoId(id: number) {
      const res = await axiosInstance.get(`${ApiUrlAssos}/${id}/tresorerie`);
      return res.data.body;
    },

    async getMembersByAssoId(id: number) {
      const res = await axiosInstance.get(`${ApiUrlAssos}/${id}/membres`);
      return res.data.body;
    },

    async updateAssociation(id: number, updatedAsso: any) {
      const res = await axiosInstance.put(`${ApiUrlAssos}/update/${id}`, updatedAsso);
      return res.data.message;
    },

    async createAssociation(data: any) {
      const res = await axiosInstance.post(`${ApiUrlAssos}/add`, data);
      return res.data.body;
    },
    async getAllAssociations(id: number) {
      const res = await axiosInstance.get(`${ApiUrlUsers}/${id}/associations`);
      return res.data.body;
    },
  };
}
