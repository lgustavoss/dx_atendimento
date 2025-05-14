import api from '../../../services/api';
import { Contact, ContactCreate, ContactUpdate } from '../types';

export const getContacts = async (): Promise<Contact[]> => {
  const response = await api.get('/contatos/');
  return response.data;
};

export const getContact = async (id: number): Promise<Contact> => {
  const response = await api.get(`/contatos/${id}`);
  return response.data;
};

export const createContact = async (contact: ContactCreate): Promise<Contact> => {
  const response = await api.post('/contatos/', contact);
  return response.data;
};

export const updateContact = async (id: number, contact: ContactUpdate): Promise<Contact> => {
  const response = await api.put(`/contatos/${id}`, contact);
  return response.data;
};

export const deleteContact = async (id: number): Promise<void> => {
  await api.delete(`/contatos/${id}`);
};