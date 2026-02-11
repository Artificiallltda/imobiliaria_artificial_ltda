// TODO - Substituir dados mockados futuramente pela API

export const settingsMock = {
  user: {
    name: 'João Silva',
    email: 'joao.silva@imobiliaria.com.br',
    phone: '(11) 98765-4321',
    role: 'Corretor',
    notifications: {
      email: true,
      whatsapp: true,
      sms: false
    },
    theme: 'light',
    language: 'pt-BR'
  },
  realEstate: {
    name: 'Imobiliária Artificial LTDA',
    cnpj: '12.345.678/0001-90',
    phone: '(11) 3456-7890',
    email: 'contato@imobiliaria.com.br',
    address: {
      street: 'Rua das Imobiliárias',
      number: '123',
      complement: 'Sala 45',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      cep: '01001-000'
    },
    logo: '/logo-imobiliaria.png'
  },
  // TODO - Adicionar mais configurações conforme necessário
};

export const saveSettingsMock = async (settings) => {
  // Simula uma chamada de API
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Configurações salvas:', settings);
      resolve({ success: true });
    }, 1000);
  });
};
