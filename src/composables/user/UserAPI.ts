import axiosInstance from '@/config/AxiosConfig';
import { ApiUrlUsers } from '@/constants/ApiUrls';

export function useUserApi() {
  return {
    async getUsers() {
      const res = await axiosInstance.get(`${ApiUrlUsers}`);
      return res.data.body;
    },
    async getUserById(id: number) {
      const res = await axiosInstance.get(`${ApiUrlUsers}/${id}`);
      return res.data.body;
    },
    async loginUser(email: string, password: string) {
      const res = await axiosInstance.post(`${ApiUrlUsers}/login`, { email, password });
      console.log('res',res);
      return res.data.body;
    },
    async createUserAccount(
      firstName: string,
      lastName: string,
      email: string,
      password: string,
      confirmPassword: string,
      photo: string,
    ) {
      const res = await axiosInstance.post(`${ApiUrlUsers}/register`, {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        photo
      });
      return res.data.body;
    },
  };
}
