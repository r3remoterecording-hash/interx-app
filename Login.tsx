
import React, { useState } from 'react';
import { authService, User } from '../services/authService';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isRegistering) {
        if (!name) throw new Error("O nome é obrigatório.");
        const user = await authService.register(name, email, password);
        onLoginSuccess(user);
      } else {
        const user = await authService.login(email, password);
        onLoginSuccess(user);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black overflow-hidden selection:bg-white selection:text-black">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative w-full max-w-sm px-6 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl mb-8 shadow-2xl shadow-white/10 relative group transition-all">
            <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all"></div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-black relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2 italic">
            Interx Health
          </h1>
          <div className="flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.4em]">
              {isRegistering ? 'Cadastro Corporativo' : 'Terminal de Acesso Seguro'}
            </p>
          </div>
        </div>

        <div className="glass-panel rounded-[2.5rem] p-10 border border-white/10 shadow-2xl relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegistering && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <label className="block text-[9px] font-black text-white/40 uppercase tracking-widest mb-2 ml-1">Identificação Operador</label>
                <input
                  type="text"
                  required
                  className="w-full px-6 py-4 rounded-2xl glass-input text-white placeholder-white/10 outline-none font-bold text-sm focus:border-white/30"
                  placeholder="Nome Completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div>
              <label className="block text-[9px] font-black text-white/40 uppercase tracking-widest mb-2 ml-1">Credencial de Acesso</label>
              <input
                type="text"
                required
                className="w-full px-6 py-4 rounded-2xl glass-input text-white placeholder-white/10 outline-none font-bold text-sm focus:border-white/30"
                placeholder="E-mail ou Usuário"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[9px] font-black text-white/40 uppercase tracking-widest mb-2 ml-1">Chave de Segurança</label>
              <input
                type="password"
                required
                className="w-full px-6 py-4 rounded-2xl glass-input text-white placeholder-white/10 outline-none font-bold text-sm focus:border-white/30"
                placeholder="Senha de Acesso"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-black p-3 rounded-xl text-center uppercase tracking-widest animate-pulse">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-5 rounded-2xl bg-white text-black font-black hover:bg-emerald-50 transition-all active:scale-95 uppercase tracking-widest text-[10px] flex items-center justify-center mt-4 shadow-xl shadow-white/5"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                isRegistering ? 'Registrar Acesso' : 'Autenticar Terminal'
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <button 
              onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
              className="text-[9px] text-white/30 hover:text-white font-black uppercase tracking-widest transition-all"
            >
              {isRegistering ? 'Retornar ao Login' : 'Criar Novo Acesso Corporativo'}
            </button>
          </div>
        </div>

        <div className="mt-12 text-center">
            <p className="text-[12px] font-black text-white tracking-[0.3em] uppercase italic">Interx Health Corporation</p>
            <p className="text-[8px] text-white/10 font-bold uppercase tracking-[0.5em] mt-3">
              Advanced Security Protocol • V 2.5.0
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
