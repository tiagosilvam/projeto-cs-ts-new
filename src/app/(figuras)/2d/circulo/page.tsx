'use client';

import { useContext } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/Button';
import Input from '@/components/Input';

import { CanvasGlobalContext } from '@/contexts/canvas';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
import { z } from 'zod';

import { PaintBrushIcon, TrashIcon } from '@heroicons/react/24/solid';

const PositionFormSchema = z.object({
  raio: z.coerce
    .number()
    .min(1, 'Valor mínimo: 1')
    .max(300, 'Valor máximo: 300')
});

type PositionFormData = z.infer<typeof PositionFormSchema>;

export default function Circulo() {
  const canvasContext = useContext(CanvasGlobalContext);
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PositionFormData>({
    resolver: zodResolver(PositionFormSchema)
  });

  function handleClick({ raio }: PositionFormData) {
    canvasContext?.desenharPontoMedioCirculo(raio);
    enqueueSnackbar('O círculo foi desenhado.', { variant: 'success' });
  }

  return (
    <div className="flex flex-col bg-white p-4 rounded shadow-sm w-96">
      <span className="text-3xl mb-2">Desenhar Círculo</span>
      <hr className="h-px bg-gray-100 border-0 mb-4" />
      <form
        className="flex flex-col gap-2 items-center"
        onSubmit={handleSubmit(handleClick)}
      >
        <div className="grid gap-2 md:grid-cols-2">
          <Input
            placeholder="Raio"
            type="number"
            step="any"
            required
            {...register('raio')}
            error={errors.raio}
          />
        </div>
        <div className="flex gap-2">
          <Button
            name="Desenhar"
            type="submit"
            icon={<PaintBrushIcon className="w-6 h-6 mr-3" />}
            color="bg-blue-500"
            hover="hover:bg-blue-600"
          />
          <Button
            name="Limpar"
            type="button"
            icon={<TrashIcon className="w-6 h-6 mr-3" />}
            color="bg-emerald-500"
            hover="hover:bg-emerald-600"
            onClick={() => {
              canvasContext?.clearCanvas();
              enqueueSnackbar('O display foi limpo.', { variant: 'info' });
            }}
          />
        </div>
      </form>
    </div>
  );
}
