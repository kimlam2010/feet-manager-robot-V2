import * as React from 'react';
import { useForm, FormProvider, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface FormProps<T extends z.ZodType<any, any>>
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  schema: T;
  onSubmit: (values: z.infer<T>) => void;
  defaultValues?: Partial<z.infer<T>>;
  children: (methods: UseFormReturn<z.infer<T>>) => React.ReactNode;
}

export function Form<T extends z.ZodType<any, any>>({
  schema,
  onSubmit,
  defaultValues,
  children,
  ...props
}: FormProps<T>) {
  const methods = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} {...props}>
        {children(methods)}
      </form>
    </FormProvider>
  );
}

export { useForm }; 