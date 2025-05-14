import api from '../../../services/api';
import { Company, CompanyCreate, CompanyUpdate } from '../types';

export const getCompanies = async (): Promise<Company[]> => {
  const response = await api.get('/empresas/');
  return response.data;
};

export const getCompany = async (id: number): Promise<Company> => {
  const response = await api.get(`/empresas/${id}`);
  return response.data;
};

export const createCompany = async (company: CompanyCreate): Promise<Company> => {
  const response = await api.post('/empresas/', company);
  return response.data;
};

export const updateCompany = async (id: number, company: CompanyUpdate): Promise<Company> => {
  const response = await api.put(`/empresas/${id}`, company);
  return response.data;
};

export const deleteCompany = async (id: number): Promise<void> => {
  await api.delete(`/empresas/${id}`);
};