import { Home, Gem, Blend, TicketMinus } from 'lucide-react';
import { Separator } from './ui';
import { AccountMenu, NavLink, ThemeToggle } from '.';

export const Header = () => {

  return (
    <div className="border-b">
      <div className="flex h-16 items-center md:gap-6 md:px-6 xs:gap-2 xs:gap-2 xs:px-2 px-6">
        <Gem className="h-6 w-6 hidden md:block xs:hidden" />
        <Separator orientation="vertical" className="h-6 hidden md:block xs:hidden" />

        <nav className="flex items-center space-x-4 lg:space-x-6">
          <NavLink to="/">
            <TicketMinus className="h-4 w-4" />
            Campanhas
          </NavLink>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <AccountMenu />
        </div>
      </div>
    </div>
  );
};
