import { Building, ChevronDown, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { AuthActionType, useAuth } from '@/store';

export function AccountMenu() {
  const navigate = useNavigate();
  const { dispatch, user, isAuthenticated } = useAuth();

  const handleLogout = () => {
    if (!isAuthenticated) return;
    dispatch({ type: AuthActionType.LOGOUT });
    navigate('/sign-in');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex select-none items-center gap-2" variant="outline">
          <span>Conta</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span>{user?.name}</span>
          <span className="text-xs font-normal text-muted-foreground">
            {user?.email ?? 'E-mail não informado'}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            navigate('/profile');
          }}
          className="cursor-pointer"
        >
          <Building className="mr-2 h-4 w-4" />
          <span>Perfil do usuário</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-rose-500 dark:text-rose-400 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
