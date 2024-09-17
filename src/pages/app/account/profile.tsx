import {
  Button,
  FormError,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui';
import { AppLayout } from '@/pages/_layout/app';
import { User, useAuth } from '@/store';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { updateUser } from '@/services';
import { toast } from '@/hooks';
import { formatPhoneNumber } from '@/utils';
import { formatToCPF, formatToPhone } from 'brazilian-values';

const schema = z.object({
  name: z
    .string({ required_error: 'Informe seu nome completo' })
    .min(3, 'Seu nome deve conter no mínimo 3 caracteres')
    .optional(),
  nickname: z.string({ required_error: 'Informe seu nick name' }).nullable().optional(),
  email: z
    .string({ required_error: 'Informe seu endereço de e-mail' })
    .min(1, 'Informe seu endereço de e-mail')
    .email('Informe um endereço de e-mail válido')
    .nullable()
    .optional(),
  phone: z.string().nullable().optional(),
  document: z.string().nullable().optional(),
  photo: z.string().nullable().optional(),
  facebook_url: z.string().url().nullable().optional(),
  instagram_url: z.string().url().nullable().optional(),
  telegram_group_url: z.string().url().nullable().optional(),
  whatsapp_group_url: z.string().nullable().optional(),
  tiktok_url: z.string().url().nullable().optional(),
  youtube_url: z.string().url().nullable().optional(),
});

type FormSchema = Pick<
  User,
  | 'name'
  | 'nickname'
  | 'email'
  | 'phone'
  | 'document'
  | 'photo'
  | 'facebook_url'
  | 'instagram_url'
  | 'telegram_group_url'
  | 'whatsapp_group_url'
  | 'tiktok_url'
  | 'youtube_url'
> & { id: number };

export const ProfilePage = () => {
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<FormSchema>({ resolver: zodResolver(schema), mode: 'onBlur' });

  const { mutate, isPending } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Tudo certo!',
        description: 'Seus dados foram atualizados com sucesso!',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Ops!',
        description: 'Não foi possível atualizar seus dados, tente novamente mais tarde',
      });
    },
  });

  const submit = async (data: FormSchema) => {
    if (!user) {
      return;
    }
    const formattedData = {
      ...data,
      phone: formatPhoneNumber(data.phone),
      document: data.document?.replace(/\D/g, ''),
      id: user.id,
    };
    mutate(formattedData);
  };
  useEffect(() => {
    if (!user) return;
    setValue('name', user.name);
    setValue('nickname', user.nickname);
    setValue('email', user.email);
    setValue('phone', formatToPhone(user.phone ?? '') ?? '');
    setValue('document', formatToCPF(user.document ?? '') ?? '');
    setValue('photo', user.photo ? user.photo : null);
    setValue('facebook_url', user.facebook_url ? user.facebook_url : null);
    setValue('instagram_url', user.instagram_url ? user.instagram_url : null);
    setValue('telegram_group_url', user.telegram_group_url ? user.telegram_group_url : null);
    setValue('whatsapp_group_url', user.whatsapp_group_url ? user.whatsapp_group_url : null);
    setValue('tiktok_url', user.tiktok_url ? user.tiktok_url : null);
    setValue('youtube_url', user.youtube_url ? user.youtube_url : null);
  }, [user, setValue]);

  return (
    <AppLayout>
      <Tabs defaultValue="account" className="flex gap-6 w-full">
        <TabsList className="mb-8 flex flex-col w-[300px] py-10 mt-2">
          <TabsTrigger className="py-2 w-full" value="account">
            Dados pessoais
          </TabsTrigger>
          <TabsTrigger className="py-2 w-full" value="password">
            Redes sociais
          </TabsTrigger>
        </TabsList>
        <TabsContent className="w-full border p-10 rounded" value="account">
          <form onSubmit={handleSubmit(submit)}>
            <div className="flex flex-col gap-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight mb-6">Perfil</h1>
                <Label htmlFor="name">Nome</Label>
                <Input
                  type="text"
                  {...register('name')}
                  placeholder="Digite seu nome e sobrenome"
                />
                <FormError errors={errors} fieldName="name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nickname">Nick name</Label>
                <Input type="text" {...register('nickname')} placeholder="Digite seu nick name" />
                <FormError errors={errors} fieldName="nickname" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  type="email"
                  {...register('email')}
                  placeholder="Digite seu endereço de e-mail"
                />
                <FormError errors={errors} fieldName="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Controller
                  control={control}
                  name="phone"
                  render={({ field: { value, onChange } }) => (
                    <Input
                    maxLength={15}
                      value={value ?? ''}
                      onChange={(e) => {
                        const watchPhone = e.target.value;
                        if (!watchPhone) return null;
                        const formattedPhone = formatToPhone(watchPhone);
                        onChange(formattedPhone);
                      }}
                      type="text"
                      placeholder="(99) 99999-9999"
                    />
                  )}
                />
                <FormError errors={errors} fieldName="phone" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="document">Documento (CPF)</Label>
                <Controller
                  control={control}
                  name="document"
                  render={({ field: { value, onChange } }) => (
                    <Input
                      maxLength={14}
                      value={value ?? ''}
                      onChange={(e) => {
                        const watchDocument = e.target.value;
                        const formattedDocument = formatToCPF(watchDocument);
                        onChange(formattedDocument);
                      }}
                      type="text"
                      placeholder="Digite seu documento"
                    />
                  )}
                />
                <FormError errors={errors} fieldName="document" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="photo">Foto</Label>
                <Input {...register('photo')} placeholder="Envie sua foto" />
                <FormError errors={errors} fieldName="photo" />
              </div>
            </div>
            <div className="flex items-end justify-end mt-6">
              <Button type="submit">Atualizar</Button>
            </div>
          </form>
        </TabsContent>
        <TabsContent className="w-full border p-10 rounded" value="password">
          <form onSubmit={handleSubmit(submit)}>
            <div className="flex flex-col gap-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight mb-6">Redes sociais</h1>
                <Label htmlFor="facebook_url">Facebook</Label>
                <Input {...register('facebook_url')} placeholder="Link do facebook" />
                <FormError errors={errors} fieldName="facebook_url" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram_url">Instagram</Label>
                <Input {...register('instagram_url')} type="text" placeholder="Link do intagram" />
                <FormError errors={errors} fieldName="instagram_url" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telegram_group_url">Grupo telegram</Label>
                <Input {...register('telegram_group_url')} placeholder="Link do grupo telegram" />
                <FormError errors={errors} fieldName="telegram_group_url" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp_group_url">Grupo whatsapp</Label>
                <Input
                  type="text"
                  {...register('whatsapp_group_url')}
                  placeholder="Link do grupo whatsapp"
                />
                <FormError errors={errors} fieldName="whatsapp_group_url" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tiktok_url">TikTok</Label>
                <Input type="text" {...register('tiktok_url')} placeholder="Link do tiktok" />
                <FormError errors={errors} fieldName="tiktok_url" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtube_url">Youtube</Label>
                <Input type="text" {...register('youtube_url')} placeholder="Link do youtube" />
                <FormError errors={errors} fieldName="youtube_url" />
              </div>
            </div>
            <div className="flex items-end justify-end mt-6">
              <Button disabled={isPending}>Atualizar</Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};
