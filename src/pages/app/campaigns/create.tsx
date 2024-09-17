import {
  Button,
  Calendar,
  FormError,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@/components/ui';
import { cn } from '@/lib';
import { AppLayout } from '@/pages/_layout/app';
import { getCategories } from '@/services';
import { useAuth } from '@/store';
import { times } from '@/utils/times';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { formatToBRL, formatToPhone } from 'brazilian-values';
import { format } from 'date-fns';
import { CalendarIcon, ChevronLeft, TicketMinus } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

enum TicketType {
  MANUAL = 'MANUAL',
  AUTOMATICO = 'AUTOMATICO',
}

const schema = z.object({
  name: z
    .string({ required_error: 'Informe seu nome completo' })
    .min(3, 'Seu nome deve conter no mínimo 3 caracteres')
    .max(100, 'Seu nome deve conter no máximo 100 caracteres'),
  description: z
    .string()
    .min(3, 'A descrição deve conter no mínimo 3 caracteres')
    .max(255, 'A descrição deve conter no máximo 255 caracteres')
    .optional(),
  value_ticket: z.coerce
    .number({ required_error: 'Informe o valor da cota' })
    .min(1, 'O valor da cota deve ser maior que 0'),
  category_id: z.coerce.number({ required_error: 'Informe a categoria' }),
  draw_date: z.string(),
  max_ticket_buy: z.coerce
    .number({ required_error: 'Informe a quantidade máxima de cotas' })
    .min(1, 'A quantidade máxima de cotas deve ser maior que 0'),
  min_ticket_buy: z.coerce
    .number({ required_error: 'Informe a quantidade mínima de cotas' })
    .min(1, 'A quantidade mínima de cotas deve ser maior que 0'),
  ticket_type: z.enum([TicketType.AUTOMATICO, TicketType.MANUAL]),
  limit_ticket: z.coerce
    .number({ required_error: 'Informe a quantidade de cotas' })
    .min(1, 'A quantidade de cotas deve ser maior que 0'),
  phone_support: z.string(),
  ticket_payment_time: z.string(),
});

type FormSchema = z.infer<typeof schema> & { totalInvoice: number };

export const CreateCampaignPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
  } = useForm<FormSchema>({ resolver: zodResolver(schema) });

  const { value_ticket, limit_ticket } = watch();

  const { data: categories, isPending } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
  });

  function submit(data: FormSchema) {
    console.log(data);
  }

  const totalInvoice = value_ticket * limit_ticket;

  return (
    <AppLayout>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => {
              navigate(-1);
            }}
          >
            <ChevronLeft className="h-7 w-7 md:h-7 md:w-7" />
          </Button>

          <TicketMinus className="h-7 w-7 md:h-7 md:w-7" />
          <h1 className="text-2xl md:text-2xl font-medium tracking-tight">Criar campanha</h1>
        </div>
        <span className="font-bold text-emerald-500">{formatToBRL(totalInvoice.toString())}</span>
      </div>
      <div>
        <form onSubmit={handleSubmit(submit)}>
          <div className="flex flex-col gap-4 mt-4">
            <Label htmlFor="name" className="text-sm font-medium">
              Nome da campanha
              <span className="text-red-400 ml-1">*</span>
            </Label>
            <Input {...register('name')} type="text" placeholder="Digite o nome da campanha" />
            <FormError errors={errors} fieldName="name" />
          </div>
          <div className="flex flex-col gap-4 mt-4">
            <Label htmlFor="description" className="text-sm font-medium">
              Descrição
            </Label>
            <Textarea {...register('description')} placeholder="Descreva sua campanha" />
            <FormError errors={errors} fieldName="description" />
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col gap-4 mt-4 w-full">
              <Label htmlFor="value_ticket" className="text-sm font-medium">
                Valor da cota
                <span className="text-red-400 ml-1">*</span>
              </Label>
              <Input
                {...register('value_ticket')}
                type="number"
                placeholder="Digite o valor da cota"
              />
              <FormError errors={errors} fieldName="value_ticket" />
            </div>
            <div className="flex flex-col gap-4 mt-4 w-full">
              <Label className="text-sm font-medium">
                Quantidade de cotas <span className="text-red-400 ml-1">*</span>
              </Label>
              <Input
                type="number"
                {...register('limit_ticket')}
                placeholder="Digite a quantidade de cotas"
                className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col gap-4 mt-4 w-full">
              <Label className="text-sm font-medium">
                Data de encerramento <span className="text-red-400 ml-1">*</span>
              </Label>
              <Controller
                control={control}
                name="draw_date"
                render={({ field }) => {
                  return (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full justify-between text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), 'PPP')
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="mr-2 h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => {
                            const dateString = date ? date.toISOString().split('.')[0] : '';
                            field.onChange(dateString.replace('T', ' '));
                            setDate(date);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  );
                }}
              />
            </div>
            <div className="flex flex-col gap-4 mt-4 w-full">
              <Label className="text-sm font-medium">
                Como serão gerados os tickets <span className="text-red-400 ml-1">*</span>
              </Label>
              <Controller
                control={control}
                name="ticket_type"
                render={({ field: { value, onChange } }) => (
                  <Select
                    value={value}
                    onValueChange={(value) => {
                      onChange(value);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TicketType.AUTOMATICO}>Automático</SelectItem>
                      <SelectItem value={TicketType.MANUAL}>Manual</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <FormError errors={errors} fieldName="ticket_type" />
            </div>
            {/*  <div className="flex flex-col gap-4 mt-4 w-full">
              <Label className="text-sm font-medium">
                Categoria <span className="text-red-400 ml-1">*</span>
              </Label>
              <Controller
                control={control}
                name="category_id"
                render={({ field: { value, onChange } }) => (
                  <Select
                    value={value}
                    onValueChange={(value) => {
                      onChange(value);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={categories?.campaignCategories.data[0].id}>
                        {categories?.campaignCategories.data[0].name}
                      </SelectItem>
                      <SelectItem value={categories?.campaignCategories.data[1].id}>
                        {categories?.campaignCategories.data[1].name}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <FormError errors={errors} fieldName="ticket_type" />
            </div> */}
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-4 mt-4 w-full">
              <Label htmlFor=" max_ticket_buy" className="text-sm font-medium">
                Quantidade máxima de cotas que um usuário pode comprar
              </Label>
              <Input
                {...register('max_ticket_buy')}
                type="number"
                placeholder="Digite a quantidade máxima de cotas"
              />
              <FormError errors={errors} fieldName="max_ticket_buy" />
            </div>
            <div className="flex flex-col gap-4 mt-4 w-full">
              <Label htmlFor="min_ticket_buy" className="text-sm font-medium">
                Quantidade mínima de cotas que um usuário pode comprar
              </Label>
              <Input
                {...register('min_ticket_buy')}
                type="number"
                placeholder="Digite a quantidade mínima de cotas"
              />
              <FormError errors={errors} fieldName="min_ticket_buy" />
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-4 w-full">
            <Label htmlFor="phone_support">
              Telefone para suporte <span className="text-red-400 ml-1">*</span>
            </Label>
            <Controller
              control={control}
              name="phone_support"
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
          <div className="flex flex-col gap-4 mt-4 w-full">
            <Label htmlFor="Tempo para pagamento">
              Tempo <span className="text-red-400 ml-1">*</span>
            </Label>
            <Controller
              control={control}
              name="ticket_payment_time"
              render={({ field: { value, onChange } }) => (
                <Select
                  value={value}
                  onValueChange={(value) => {
                    onChange(value);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione uma opção" />
                  </SelectTrigger>
                  <SelectContent>
                    {times.map((time) => (
                      <SelectItem key={time.value} value={time.value}>
                        {time.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FormError errors={errors} fieldName="ticket_payment_time" />
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="mt-4">
              CRIAR CAMPANHA
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};
