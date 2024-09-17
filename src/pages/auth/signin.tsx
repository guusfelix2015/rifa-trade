import { Button, FormError, Input, Label } from '@/components/ui';
import { useToast } from '@/hooks';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { signin } from '@/services';
import { AuthActionType, useAuth } from '@/store';
import { saveAccessToken } from '@/auth';
import { AuthLayout } from '../_layout/auth';

const schema = z.object({
  email: z
    .string({ required_error: 'Informe seu endereço de e-mail' })
    .min(1, 'Informe seu endereço de e-mail')
    .email('Informe um endereço de e-mail válido'),
  password: z.string({ required_error: 'Informe sua senha' }).min(1, 'Informe sua senha'),
});

type FormSchema = z.infer<typeof schema>;

export const SigninPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { dispatch } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({ resolver: zodResolver(schema), mode: 'onBlur' });

  const { mutate, isPending } = useMutation({
    mutationFn: signin,
    onSuccess: (response) => {
      const { token } = response;
      saveAccessToken({ token });
      dispatch({ type: AuthActionType.LOGIN });
      navigate('/home');
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Ops!',
        description: error.response?.data.msg || 'Ocorreu um erro ao tentar acessar o painel',
      });
    },
  });

  const onSubmit = async (data: FormSchema) => {
    mutate(data);
  };

  return (
    <AuthLayout>
      <div>
        <div className="p-8">
          <Button variant="outline" asChild className="absolute right-8 top-8">
            <Link to="/sign-up">Nova conta</Link>
          </Button>
          <div className="flex w-[350px] flex-col justify-center gap-6">
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tighter">Acessar painel</h1>
              <p className="text-sm text-muted-foreground">
                Acompanhe suas campanhas e gerencie suas rifas
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Endereço de e-mail</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="Digite seu endereço de e-mail"
                />
                <FormError errors={errors} fieldName="email" />
              </div>
              <div>
                <Label htmlFor="password" className="mb-2">
                  Senha
                </Label>
                <Input type="password" {...register('password')} placeholder="Digite sua senha" />
                <FormError errors={errors} fieldName="password" />
              </div>
              <Button disabled={isPending} className="w-full" type="submit">
                Acessar painel
              </Button>
            </form>
            <Button variant="link">
              <Link to="/recover">Esqueci minha senha</Link>
            </Button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};
