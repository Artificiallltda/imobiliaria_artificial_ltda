import { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../../services/settingsService';
import { Card, Input, Button, Select, useToast } from '../../components/ui';
import styles from './styles.module.css';

export default function Settings() {
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'pt-BR',
    notifications_enabled: true,
    company_name: '',
    company_phone: '',
    company_email: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  // Carregar configurações ao abrir página
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (error) {
        toast({
          type: 'error',
          message: 'Erro ao carregar configurações'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Apenas campos que foram alterados
      const updateData = {};
      Object.keys(settings).forEach(key => {
        if (settings[key] !== undefined) {
          updateData[key] = settings[key];
        }
      });

      await updateSettings(updateData);
      setHasChanges(false);
      
      toast({
        type: 'success',
        message: 'Configurações salvas com sucesso!'
      });

      // Aplicar tema imediatamente
      if (updateData.theme) {
        document.body.dataset.theme = updateData.theme;
      }

      // Aplicar idioma imediatamente (se existir sistema de i18n)
      if (updateData.language && window.i18n) {
        window.i18n.changeLanguage(updateData.language);
      }

    } catch (error) {
      toast({
        type: 'error',
        message: 'Erro ao salvar configurações'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <h1>Personalização</h1>
        <p>Carregando configurações...</p>
      </div>
    );
  }

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

      {/* Seção de Preferências */}
      <Card title="Preferências" className={styles.section}>
        <div className={styles.formGrid}>
          <Select
            label="Tema"
            value={settings.theme}
            options={[
              { value: 'light', label: 'Claro' },
              { value: 'dark', label: 'Escuro' },
            ]}
            onChange={(e) => handleInputChange('theme', e.target.value)}
            size="small"
          />
          <Select
            label="Idioma"
            value={settings.language}
            options={[
              { value: 'pt-BR', label: 'Português' },
              { value: 'en-US', label: 'Inglês' },
              { value: 'es-ES', label: 'Espanhol' },
            ]}
            onChange={(e) => handleInputChange('language', e.target.value)}
            size="small"
          />
          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={settings.notifications_enabled}
                onChange={(e) => handleInputChange('notifications_enabled', e.target.checked)}
              />
              Notificações por e-mail
            </label>
          </div>
        </div>
      </Card>

      {/* Seção de Dados da Imobiliária */}
      <Card title="Dados da Imobiliária" className={styles.section}>
        <div className={styles.formGrid}>
          <Input
            label="Nome da Empresa"
            value={settings.company_name || ''}
            onChange={(e) => handleInputChange('company_name', e.target.value)}
            size="small"
            placeholder="Imobiliária XPTO"
          />
          <Input
            label="Telefone"
            value={settings.company_phone || ''}
            onChange={(e) => handleInputChange('company_phone', e.target.value)}
            size="small"
            placeholder="(11) 99999-9999"
          />
          <Input
            label="E-mail"
            type="email"
            value={settings.company_email || ''}
            onChange={(e) => handleInputChange('company_email', e.target.value)}
            size="small"
            placeholder="contato@imobiliaria.com"
          />
        </div>
      </Card>

      {/* TODO - Adicionar mais seções conforme necessário */}
    </div>
  );
}
