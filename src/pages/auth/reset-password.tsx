import { Button, FormError, Input, Label } from '@/components/ui';
import { useToast } from '@/hooks';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { resetPassword, signin } from '@/services';
import { AuthLayout } from '../_layout/auth';
import { useParams } from 'react-router-dom';

const schema = z
  .object({
    password: z
      .string({ required_error: 'Escolha uma nova senha' })
      .min(8, 'Sua nova senha deve conter no mínimo 8 caracteres'),
    confirm_password: z.string({ required_error: 'Confirme sua nova senha' }),
  })
  .superRefine(({ confirm_password, password }, ctx) => {
    if (confirm_password !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Suas senhas não coincidem',
        path: ['passwordConfirmation'],
      });
    }
  });

type FormSchema = z.infer<typeof schema>;

export const ResetPasswordPage = () => {
  const { token } = useParams();

  if (!token) return;

  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<FormSchema>({ resolver: zodResolver(schema), mode: 'onBlur' });

  const { mutate } = useMutation({
    mutationFn: (data: FormSchema) =>
      resetPassword(token, { password: data.password, confirm_password: data.confirm_password }),
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Senha alterada com sucesso',
        description: 'Agora você pode acessar sua conta com sua nova senha.',
      });
      navigate('/sign-in');
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Ops!',
        description: 'Não foi possível alterar sua senha, tente novamente mais tarde.',
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
              <h1 className="text-2xl font-semibold tracking-tighter">Criar nova senha</h1>
              <p className="text-sm text-muted-foreground">
                Digite sua nova senha e confirme para alterar a senha de sua conta.
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nova senha</Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                  placeholder="Escolha uma nova senha"
                />
                <FormError errors={errors} fieldName="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirme sua senha</Label>
                <Input
                  id="confirm_password"
                  type="password"
                  {...register('confirm_password')}
                  placeholder="Confirme sua nova senha"
                />
                <FormError errors={errors} fieldName="confirm_password" />
              </div>
              <Button disabled={isSubmitted} className="w-full" type="submit">
                Alterar senha
              </Button>
            </form>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};
