import React, { useState } from 'react';
import { Copy, Check, FileText, Settings, Scissors } from 'lucide-react';

const TextSplitter = () => {
  const [maxChars, setMaxChars] = useState(3000);
  const [inputText, setInputText] = useState('');
  const [fragments, setFragments] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedFragments, setCopiedFragments] = useState(new Set());

  const splitText = () => {
    if (!inputText.trim()) return;
    
    // Dividir por párrafos (doble salto de línea)
    const paragraphs = inputText.split(/\n\s*\n/);
    const result = [];
    let currentFragment = '';
    
    for (let i = 0; i < paragraphs.length; i++) {
      const paragraph = paragraphs[i].trim();
      
      // Si agregar este párrafo excede el límite
      if (currentFragment.length + paragraph.length + 2 > maxChars) {
        // Si hay contenido acumulado, guardarlo
        if (currentFragment.trim()) {
          result.push(currentFragment.trim());
          currentFragment = '';
        }
        
        // Si el párrafo individual es muy largo, dividirlo por oraciones
        if (paragraph.length > maxChars) {
          const sentences = paragraph.split(/(?<=[.!?])\s+/);
          let tempFragment = '';
          
          for (const sentence of sentences) {
            if (tempFragment.length + sentence.length + 1 > maxChars) {
              if (tempFragment.trim()) {
                result.push(tempFragment.trim());
                tempFragment = sentence;
              } else {
                // Si una oración es muy larga, la guardamos tal como está
                result.push(sentence);
              }
            } else {
              tempFragment += (tempFragment ? ' ' : '') + sentence;
            }
          }
          
          if (tempFragment.trim()) {
            currentFragment = tempFragment;
          }
        } else {
          currentFragment = paragraph;
        }
      } else {
        // Agregar el párrafo al fragmento actual
        currentFragment += (currentFragment ? '\n\n' : '') + paragraph;
      }
    }
    
    // Agregar el último fragmento si existe
    if (currentFragment.trim()) {
      result.push(currentFragment.trim());
    }
    
    setFragments(result);
    setCopiedFragments(new Set()); // Resetear fragmentos copiados al dividir nuevo texto
  };

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setCopiedFragments(prev => new Set(prev).add(index));
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const copyAllFragments = async () => {
    const allText = fragments.join('\n\n---\n\n');
    try {
      await navigator.clipboard.writeText(allText);
      setCopiedIndex('all');
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Scissors className="text-blue-600 w-8 h-8" />
            <h1 className="text-4xl font-bold text-gray-800">Divisor de Textos</h1>
          </div>
          <p className="text-gray-600 text-lg">Divide textos largos respetando párrafos y límites de caracteres</p>
        </div>

        {/* Configuration */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="text-blue-600 w-5 h-5" />
            <h2 className="text-xl font-semibold text-gray-800">Configuración</h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <label className="flex items-center gap-2 text-gray-700">
              <span className="font-medium">Límite de caracteres:</span>
              <input
                type="number"
                value={maxChars}
                onChange={(e) => setMaxChars(parseInt(e.target.value) || 3000)}
                className="border border-gray-300 rounded-lg px-3 py-2 w-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="100"
                max="10000"
              />
            </label>
            <div className="text-sm text-gray-500">
              Recomendado: 3000 caracteres para mensajes largos
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="text-blue-600 w-5 h-5" />
            <h2 className="text-xl font-semibold text-gray-800">Texto a dividir</h2>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Pega aquí tu texto largo... La división se realizará respetando los párrafos (punto y aparte) y el límite de caracteres configurado."
            className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              Caracteres: {inputText.length.toLocaleString()}
            </div>
            <button
              onClick={splitText}
              disabled={!inputText.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <Scissors className="w-4 h-4" />
              Dividir Texto
            </button>
          </div>
        </div>

        {/* Results */}
        {fragments.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 rounded-full p-2">
                  <Check className="text-green-600 w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Resultado</h2>
                  <p className="text-gray-600">
                    {fragments.length} fragmento{fragments.length !== 1 ? 's' : ''} generado{fragments.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <button
                onClick={copyAllFragments}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              >
                {copiedIndex === 'all' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                Copiar Todo
              </button>
            </div>

            <div className="space-y-4">
              {fragments.map((fragment, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        Fragmento {index + 1}
                      </div>
                      <div className="text-sm text-gray-500">
                        {fragment.length.toLocaleString()} caracteres
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(fragment, index)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1 ${
                        copiedFragments.has(index) && copiedIndex !== index
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {copiedIndex === index ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copiedIndex === index 
                        ? 'Copiado' 
                        : copiedFragments.has(index) 
                        ? 'Volver a copiar' 
                        : 'Copiar'}
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 max-h-32 overflow-y-auto">
                    {fragment}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextSplitter;
