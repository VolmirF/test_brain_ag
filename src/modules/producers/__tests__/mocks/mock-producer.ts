import { Producer } from '@prisma/client';

export const mockProducer: Producer = {
  id: 1,
  name: 'A',
  document: '123',
  documentType: 'CPF',
  city: 'X',
  state: 'SP',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockProducerList: Producer[] = [
  mockProducer,
  {
    id: 2,
    name: 'B',
    document: '456',
    documentType: 'CNPJ',
    city: 'Y',
    state: 'RJ',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
