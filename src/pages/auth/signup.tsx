import { Button, FormError, Input, Label } from '@/components/ui';
import { useToast } from '@/hooks';
import { signup } from '@/services';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { AuthLayout } from '../_layout/auth';

export const schema = z.object({
  name: z
    .string({ required_error: 'Informe seu nome completo' })
    .min(3, 'Seu nome deve conter no mínimo 3 caracteres'),
  email: z
    .string({ required_error: 'Informe seu endereço de e-mail' })
    .min(1, 'Informe seu endereço de e-mail')
    .email('Informe um endereço de e-mail válido'),
  password: z
    .string({ required_error: 'Escolha uma senha' })
    .min(6, 'Sua senha deve conter no mínimo 6 caracteres'),
});

type FormSchema = z.infer<typeof schema>;

export const SignupPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({ resolver: zodResolver(schema), mode: 'onBlur' });

  const { mutate, isPending } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Tudo certo!',
        description: 'Sua conta foi criada com sucesso!',
      });
      navigate('/');
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Ops!',
        description: 'Não foi possível criar sua conta, tente novamente mais tarde',
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
            <Link to="/sign-in">Acessar minha conta</Link>
          </Button>
          <div className="flex w-[350px] flex-col justify-center gap-6">
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tighter">Criar nova conta</h1>
              <p className="text-sm text-muted-foreground">
                Acompanhe suas campanhas e gerencie suas rifas
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name" className="mb-2">
                  Nome completo
                </Label>
                <Input {...register('name')} placeholder="Digite seu nome e sobrenome" />
                <FormError errors={errors} fieldName="name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Endereço de e-mail</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="Digite seu endereço de e-mail"
                />
              </div>
              <div>
                <Label htmlFor="password" className="mb-2">
                  Senha
                </Label>
                <Input {...register('password')} type="password" placeholder="Digite sua senha" />
                <FormError errors={errors} fieldName="password" />
              </div>
              <Button disabled={isPending} className="w-full" type="submit">
                Criar conta
              </Button>
            </form>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};
