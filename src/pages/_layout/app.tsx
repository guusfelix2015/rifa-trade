import { Header } from '@/components/header';

interface Props {
  children: React.ReactNode;
}
export function AppLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen flex-col antialiased">
      <Header />
      <div className="flex flex-1 flex-col gap-4 p-8 pt-6 m-auto h-full w-full sm:max-w-5xl">{children}</div>
    </div>
  );
}
