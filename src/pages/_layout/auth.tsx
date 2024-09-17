import { Gem } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

export const AuthLayout = ({ children }: Props) => {
  return (
    <div className="grid min-h-screen grid-cols-2 antialiased">
      <div className="flex h-full flex-col justify-between border-r border-foreground/5 bg-muted p-10 text-muted-foreground">
        <div className="flex items-center gap-3 text-lg font-medium text-foreground">
          <Gem className="h-6 w-6" />
          <span className="font-semibold">RifaTrade</span>
        </div>
        <footer className="text-sm">
          Painel do parceiro &copy; RifaTrade - {new Date().getFullYear()}
        </footer>
      </div>
      <div className="relative flex flex-col items-center justify-center">{children}</div>
    </div>
  );
};
