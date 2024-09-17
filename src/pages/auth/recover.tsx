import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, FormError, Input, Label } from '@/components/ui';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../_layout/auth';
import { useMutation } from '@tanstack/react-query';
import { toast } from '@/hooks';
import { forgetPassword } from '@/services';

const schema = z.object({
  email: z
    .string({ required_error: 'Informe seu endereço de e-mail' })
    .min(1, 'Informe seu endereço de e-mail')
    .email('Informe um endereço de e-mail válido'),
});

type FormSchema = z.infer<typeof schema>;

export const RecoverPage = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({ resolver: zodResolver(schema) });


  const {mutate, isPending} = useMutation({
    mutationFn: forgetPassword,
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Tudo certo!',
        description: 'Enviamos um e-mail com instruções para recuperação de senha.',
      });
      navigate('/');
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Ops!',
        description: 'Não foi possível enviar o e-mail de recuperação, tente novamente mais tarde',
      });
    },
  })

  const onSubmit = (data: FormSchema) => {
    mutate(data.email);
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
              <h1 className="text-2xl font-semibold tracking-tighter">Recuperar minha conta</h1>
              <p className="text-sm text-muted-foreground">
                Digite o endereço de e-mail utilizado em sua conta para receber um link de
                recuperação de senha.
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
              <Button disabled={isPending} className="w-full" type="submit">
                Recuperar conta
              </Button>
            </form>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};
