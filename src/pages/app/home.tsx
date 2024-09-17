import { useAuth } from '@/store';
import { AppLayout } from '../_layout/app';
import { Button } from '@/components/ui';
import { TicketMinus, TicketPlus, TriangleAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const campaigns = [];

  return (
    <AppLayout>
      <h2 className="text-lg sm:text-xl flex gap-2">
        Ola, <span className="font-medium">{user?.name}!</span>
      </h2>
      <div className="flex items-center gap-2 mt-4">
        <TicketMinus className="h-5 w-5" />
        <h2 className="text-lg flex gap-2 items-center">Minhas campanhas</h2>
      </div>

      <p className="text-gray-500 mt-0.5 text-sm">
        Aqui você pode visualizar e gerenciar suas campanhas de rifas
      </p>

      <div className="flex flex-col p-6 shadow-sm border rounded-2xl items-center gap-2 mt-4">
        <TriangleAlert className="h-10 w-10" />
        <p className="text-sm">Crie uma nova campanha para começar a vender rifas</p>
        <Button
          onClick={() => {
            navigate('/create-campaign');
          }}
          className="flex gap-2 mt-2"
        >
          <TicketPlus />
          CRIAR CAMPANHA
        </Button>
      </div>
    </AppLayout>
  );
};
