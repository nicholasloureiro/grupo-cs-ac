'use client';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-chocolate-dark to-chocolate-dark/95 text-white py-6 px-4 shadow-xl backdrop-blur-sm">
      <div className="max-w-4xl mx-auto flex items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gold/20 rounded-full blur-md"></div>
            <img
              src="/cacau-logo.svg"
              alt="Cacau Show"
              className="relative h-14 w-14 drop-shadow-lg"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gold tracking-tight">
              Processador de Relatorios Semanais
            </h1>
            <p className="text-cream/80 text-sm font-medium">
              Ferramenta para Franqueados
              <span className="ml-2 text-xs bg-cream/20 px-2 py-0.5 rounded-full">
                Não oficial
              </span>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
