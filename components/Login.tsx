import React, { useState, useEffect } from 'react';

interface LoginProps {
  onLogin: (isAdmin: boolean) => void;
}

// 🔐 SENHAS (ALTERE AQUI PARA MUDAR AS SENHAS)
const PIN_OPERADOR = '1234';  // PIN para operadores
const PIN_ADMIN = '9999';      // PIN para administradores

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  // Verifica se já está logado
  useEffect(() => {
    const savedAuth = localStorage.getItem('digra_auth');
    if (savedAuth) {
      const auth = JSON.parse(savedAuth);
      // Verifica se ainda está válido (menos de 30 dias)
      const now = Date.now();
      if (now - auth.timestamp < 30 * 24 * 60 * 60 * 1000) {
        onLogin(auth.isAdmin);
      } else {
        localStorage.removeItem('digra_auth');
      }
    }
  }, [onLogin]);

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      setPin(pin + num);
      setError('');
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
    setError('');
  };

  const handleSubmit = () => {
    if (pin.length !== 4) {
      setError('Digite os 4 dígitos');
      return;
    }

    if (pin === PIN_ADMIN) {
      // Login como Admin
      const auth = {
        isAdmin: true,
        timestamp: Date.now()
      };
      localStorage.setItem('digra_auth', JSON.stringify(auth));
      onLogin(true);
    } else if (pin === PIN_OPERADOR) {
      // Login como Operador
      const auth = {
        isAdmin: false,
        timestamp: Date.now()
      };
      localStorage.setItem('digra_auth', JSON.stringify(auth));
      onLogin(false);
    } else {
      // Senha incorreta
      setError('PIN incorreto');
      setShake(true);
      setPin('');
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Backspace') {
      handleBackspace();
    } else if (/^[0-9]$/.test(e.key)) {
      handleNumberClick(e.key);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center"
      onKeyDown={handleKeyPress}
      tabIndex={0}
    >
      <div className={`bg-white rounded-2xl shadow-2xl p-8 w-96 ${shake ? 'animate-shake' : ''}`}>
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-[#004aad] border-4 border-white flex items-center justify-center font-bold text-white text-2xl mb-4">
            DIGRA
          </div>
          <h1 className="text-xl font-bold text-gray-800">GUIAS DE REMESSA</h1>
          <p className="text-sm text-gray-500 mt-2">Digite o PIN de 4 dígitos</p>
        </div>

        {/* PIN Display */}
        <div className="flex justify-center gap-3 mb-6">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center text-2xl font-bold ${
                pin.length > i
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-gray-300 text-gray-400'
              }`}
            >
              {pin.length > i ? '●' : ''}
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-center text-sm">
            {error}
          </div>
        )}

        {/* Number Pad */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num.toString())}
              className="h-14 bg-gray-100 hover:bg-gray-200 rounded-lg text-xl font-bold text-gray-800 transition-colors active:scale-95"
            >
              {num}
            </button>
          ))}
        </div>

        {/* Bottom Row (0, Backspace, OK) */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={handleBackspace}
            className="h-14 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center text-gray-800 transition-colors active:scale-95"
            title="Apagar"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/>
              <line x1="18" y1="9" x2="12" y2="15"/>
              <line x1="12" y1="9" x2="18" y2="15"/>
            </svg>
          </button>
          
          <button
            onClick={() => handleNumberClick('0')}
            className="h-14 bg-gray-100 hover:bg-gray-200 rounded-lg text-xl font-bold text-gray-800 transition-colors active:scale-95"
          >
            0
          </button>

          <button
            onClick={handleSubmit}
            disabled={pin.length !== 4}
            className={`h-14 rounded-lg text-white font-bold transition-colors active:scale-95 ${
              pin.length === 4
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            OK
          </button>
        </div>

        {/* Info */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Este computador lembrará sua senha por 30 dias</p>
        </div>
      </div>

      {/* CSS para animação de shake */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};
