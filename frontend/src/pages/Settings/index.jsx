import { useState, useEffect } from 'react';
import { settingsMock, saveSettingsMock } from '../../mocks/settingsMock';
import { Card, Input, Button, Select } from '../../components/ui';
import styles from './styles.module.css';

export default function Settings() {
  const [settings, setSettings] = useState(settingsMock);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Carrega as configurações iniciais
  useEffect(() => {
    // TODO - Buscar configurações da API
    setSettings(settingsMock);
  }, []);

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleNestedInputChange = (section, parentField, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parentField]: {
          ...prev[section][parentField],
          [field]: value
        }
      }
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // TODO - Persistir configurações no backend
      await saveSettingsMock(settings);
      setHasChanges(false);
      // TODO - Usar o sistema de toast do projeto
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Erro ao salvar configurações. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Personalização</h1>
        {hasChanges && (
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className={styles.saveButton}
          >
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        )}
      </div>

      {/* Seção de Dados Pessoais */}
      <Card title="Dados Pessoais" className={styles.section}>
        <div className={styles.formGrid}>
          <Input
            label="Nome"
            value={settings.user.name}
            onChange={(e) => handleInputChange('user', 'name', e.target.value)}
            size="small"
          />
          <Input
            label="E-mail"
            type="email"
            value={settings.user.email}
            onChange={(e) => handleInputChange('user', 'email', e.target.value)}
            size="small"
          />
          <Input
            label="Telefone"
            value={settings.user.phone}
            onChange={(e) => handleInputChange('user', 'phone', e.target.value)}
            size="small"
          />
        </div>

        <div className={styles.subtitle}>Notificações</div>
        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={settings.user.notifications.email}
              onChange={(e) => handleNestedInputChange('user', 'notifications', 'email', e.target.checked)}
            />
            E-mail
          </label>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={settings.user.notifications.whatsapp}
              onChange={(e) => handleNestedInputChange('user', 'notifications', 'whatsapp', e.target.checked)}
            />
            WhatsApp
          </label>
        </div>
      </Card>

      {/* Seção de Dados da Imobiliária */}
      <Card title="Dados da Imobiliária" className={styles.section}>
        <div className={styles.formGrid}>
          <Input
            label="Nome"
            value={settings.realEstate.name}
            onChange={(e) => handleInputChange('realEstate', 'name', e.target.value)}
            size="small"
          />
          <Input
            label="CNPJ"
            value={settings.realEstate.cnpj}
            onChange={(e) => handleInputChange('realEstate', 'cnpj', e.target.value)}
            size="small"
          />
          <Input
            label="Telefone"
            value={settings.realEstate.phone}
            onChange={(e) => handleInputChange('realEstate', 'phone', e.target.value)}
            size="small"
          />
          <Input
            label="E-mail"
            type="email"
            value={settings.realEstate.email}
            onChange={(e) => handleInputChange('realEstate', 'email', e.target.value)}
            size="small"
          />
        </div>

        <div className={styles.subtitle}>Endereço</div>
        <div className={styles.formGrid}>
          <Input
            label="Rua"
            value={settings.realEstate.address.street}
            onChange={(e) => handleNestedInputChange('realEstate', 'address', 'street', e.target.value)}
            size="small"
          />
          <div className={styles.addressRow}>
            <div className={styles.addressField}>
              <Input
                label="Número"
                value={settings.realEstate.address.number}
                onChange={(e) => handleNestedInputChange('realEstate', 'address', 'number', e.target.value)}
                size="small"
              />
            </div>
            <div className={styles.addressField}>
              <Input
                label="Complemento"
                value={settings.realEstate.address.complement}
                onChange={(e) => handleNestedInputChange('realEstate', 'address', 'complement', e.target.value)}
                size="small"
              />
            </div>
          </div>
          <div className={styles.addressRow}>
            <div className={styles.addressField}>
              <Input
                label="Bairro"
                value={settings.realEstate.address.neighborhood}
                onChange={(e) => handleNestedInputChange('realEstate', 'address', 'neighborhood', e.target.value)}
                size="small"
              />
            </div>
            <div className={styles.addressField}>
              <Input
                label="Cidade"
                value={settings.realEstate.address.city}
                onChange={(e) => handleNestedInputChange('realEstate', 'address', 'city', e.target.value)}
                size="small"
              />
            </div>
          </div>
          <div className={`${styles.addressRow} ${styles.cepRow}`}>
            <div className={styles.addressField}>
              <Input
                label="UF"
                value={settings.realEstate.address.state}
                onChange={(e) => handleNestedInputChange('realEstate', 'address', 'state', e.target.value)}
                size="small"
                maxLength={2}
                style={{textTransform: 'uppercase'}}
              />
            </div>
            <div className={styles.addressField}>
              <Input
                label="CEP"
                value={settings.realEstate.address.cep}
                onChange={(e) => handleNestedInputChange('realEstate', 'address', 'cep', e.target.value)}
                size="small"
              />
            </div>
          </div>
        </div>

        <div className={styles.uploadSection}>
          <label className={styles.uploadLabel}>
            Logo
            <div className={styles.uploadBox}>
              {settings.realEstate.logo ? (
                <img 
                  src={settings.realEstate.logo} 
                  alt="Logo" 
                  className={styles.logoPreview}
                />
              ) : (
                <span>Clique para fazer upload</span>
              )}
              <input 
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }}
                onChange={(e) => {
                  // TODO - Implementar lógica de upload
                  console.log('Arquivo selecionado:', e.target.files[0]);
                }}
              />
            </div>
          </label>
        </div>
      </Card>

      {/* Seção de Preferências */}
      <Card title="Preferências" className={styles.section}>
        <div className={styles.formGrid}>
          <Select
            label="Tema"
            value={settings.user.theme}
            options={[
              { value: 'light', label: 'Claro' },
              { value: 'dark', label: 'Escuro' },
              { value: 'system', label: 'Sistema' },
            ]}
            onChange={(e) => handleInputChange('user', 'theme', e.target.value)}
            size="small"
          />
          <Select
            label="Idioma"
            value={settings.user.language}
            options={[
              { value: 'pt-BR', label: 'Português' },
              { value: 'en-US', label: 'Inglês' },
            ]}
            onChange={(e) => handleInputChange('user', 'language', e.target.value)}
            size="small"
          />
        </div>
      </Card>

      {/* TODO - Adicionar mais seções conforme necessário */}
    </div>
  );
}
