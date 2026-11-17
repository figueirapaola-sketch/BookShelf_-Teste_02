import React, { useState } from 'react';
import { Upload, Link as LinkIcon, Image as ImageIcon, Check } from 'lucide-react';

export default function ImageUploader({ label = "Imagem", value, onChange, placeholder = "URL da imagem ou faça upload" }) {
  const [activeTab, setActiveTab] = useState('url'); // 'url' or 'upload'
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        throw new Error('Falha no upload do arquivo');
      }

      const data = await res.json();
      onChange(data.url);
    } catch (err) {
      console.error('Erro de upload:', err);
      // Fallback: convert to base64 if server fails
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange(event.target.result);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  // Sample quick presets suitable for books/articles
  const PRESET_COVERS = [
    { label: 'Sci-Fi / Tecnologia', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80' },
    { label: 'Clássico / Antigo', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80' },
    { label: 'Fantasia / Natureza', url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80' },
    { label: 'Moderno / Urbano', url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format&fit=crop&q=80' },
    { label: 'Ilustração Artística', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80' }
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-stone-700">{label}</label>
        <div className="flex space-x-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`px-2.5 py-1 rounded transition ${activeTab === 'url' ? 'bg-amber-100 text-amber-900 font-medium' : 'text-stone-500 hover:text-stone-800'}`}
          >
            URL
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-2.5 py-1 rounded transition ${activeTab === 'upload' ? 'bg-amber-100 text-amber-900 font-medium' : 'text-stone-500 hover:text-stone-800'}`}
          >
            Arquivo
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`px-2.5 py-1 rounded transition ${activeTab === 'presets' ? 'bg-amber-100 text-amber-900 font-medium' : 'text-stone-500 hover:text-stone-800'}`}
          >
            Galeria
          </button>
        </div>
      </div>

      {activeTab === 'url' && (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
            <LinkIcon className="w-4 h-4" />
          </div>
          <input
            type="url"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
          />
        </div>
      )}

      {activeTab === 'upload' && (
        <div className="border-2 border-dashed border-stone-300 rounded-lg p-4 text-center hover:border-amber-500 transition bg-white">
          <input
            type="file"
            id="file-input"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <label htmlFor="file-input" className="cursor-pointer flex flex-col items-center">
            <Upload className="w-6 h-6 text-stone-400 mb-1" />
            <span className="text-sm font-medium text-stone-700">
              {isUploading ? 'Enviando imagem...' : 'Clique para selecionar do computador'}
            </span>
            <span className="text-xs text-stone-500 mt-1">PNG, JPG ou GIF até 10MB</span>
          </label>
        </div>
      )}

      {activeTab === 'presets' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
          {PRESET_COVERS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onChange(preset.url)}
              className={`group relative rounded-lg overflow-hidden border text-left p-1 text-xs transition ${value === preset.url ? 'ring-2 ring-amber-600 border-amber-600' : 'border-stone-200 hover:border-stone-400'}`}
            >
              <img src={preset.url} alt={preset.label} className="w-full h-14 object-cover rounded mb-1" />
              <div className="truncate font-medium text-stone-700">{preset.label}</div>
              {value === preset.url && (
                <div className="absolute top-2 right-2 bg-amber-600 text-white rounded-full p-0.5">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Preview */}
      {value && (
        <div className="flex items-center space-x-3 mt-2 p-2 bg-stone-100 rounded-lg">
          <img
            src={value}
            alt="Prévia"
            className="w-14 h-14 object-cover rounded border border-stone-300 shadow-sm"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200';
            }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-stone-700 truncate">Pré-visualização carregada</p>
            <p className="text-xs text-stone-500 truncate">{value}</p>
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-xs text-red-600 hover:text-red-800 font-medium px-2 py-1"
          >
            Remover
          </button>
        </div>
      )}
    </div>
  );
}
