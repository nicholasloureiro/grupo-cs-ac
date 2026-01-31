import Header from './components/Header';
import ProcessingForm from './components/ProcessingForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-cream">
      <Header />
      <div className="py-8">
        <ProcessingForm />
      </div>
      <footer className="text-center py-6 text-chocolate/50 text-sm space-y-2">
        <p>Ferramenta de Gestão de Estoque para Franqueados</p>
        <p className="text-xs max-w-2xl mx-auto px-4">
          Este site não é oficial e não possui qualquer vínculo com a Cacau Show® ou suas empresas afiliadas.
          Trata-se de uma ferramenta independente desenvolvida para auxiliar franqueados.
          Cacau Show® é uma marca registrada de seus respectivos proprietários.
        </p>
      </footer>
    </main>
  );
}
