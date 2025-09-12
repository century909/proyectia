import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { useToast } from '../contexts/ToastContext';
import { useFormValidation, validationRules } from '../hooks/useFormValidation';
import { createCharacter } from '../services/characters';

const CharacterCreation = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm
  } = useFormValidation(
    { name: '', description: '', personality: '' },
    {
      name: [
        validationRules.required('El nombre del personaje es requerido'),
        validationRules.minLength(2, 'Mínimo 2 caracteres'),
        validationRules.maxLength(50, 'Máximo 50 caracteres')
      ],
      description: [
        validationRules.maxLength(500, 'Máximo 500 caracteres')
      ],
      personality: [
        validationRules.maxLength(200, 'Máximo 200 caracteres')
      ]
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      await createCharacter({
        name: values.name,
        description: values.description,
        personality: values.personality
      });
      
      addToast('¡Personaje creado exitosamente!', 'success');
      navigate('/');
    } catch (err) {
      const errorMessage = err.message || 'Error al crear el personaje. Inténtalo de nuevo.';
      addToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Create Your Character
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Design a unique companion for your conversations
          </p>
        </div>
        
        <Card className="mt-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 p-6">
              <div className="sm:col-span-6">
                <Input
                  id="name"
                  label="Character Name"
                  name="name"
                  type="text"
                  required
                  value={values.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  error={touched.name ? errors.name : ''}
                  placeholder="e.g. Sassy Sue"
                />
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={values.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    onBlur={() => handleBlur('description')}
                    className={`block w-full rounded-md shadow-sm sm:text-sm ${
                      touched.description && errors.description
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                    }`}
                    placeholder="Describe your character's appearance, background, etc."
                  />
                  {touched.description && errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-6">
                <Input
                  id="personality"
                  label="Personality Traits"
                  name="personality"
                  type="text"
                  value={values.personality}
                  onChange={(e) => handleChange('personality', e.target.value)}
                  onBlur={() => handleBlur('personality')}
                  error={touched.personality ? errors.personality : ''}
                  placeholder="e.g. witty, sarcastic, knowledgeable"
                />
              </div>

              <div className="sm:col-span-6">
                <div className="flex flex-col items-center justify-center w-full">
                  <div className="border-2 border-dashed rounded-xl border-gray-300 p-8 text-center w-full">
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <div className="bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full w-20 h-20 flex items-center justify-center text-white font-bold text-2xl">
                          {values.name ? values.name.charAt(0) : 'A'}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Character avatar</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Upload an image or it will be auto-generated
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Upload Image
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Character'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CharacterCreation;