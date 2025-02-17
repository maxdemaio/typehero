'use client';

import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { AlertCircle, MailCheck } from '@repo/ui/icons';
import clsx from 'clsx';
import {
  Alert,
  AlertDescription,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui';
import { uploadWaitlistEntry } from '~/components/landing/waitlist/create.action';

const waitlistFormSchema = z.object({
  name: z.string().min(1, 'Please enter your name'),
  email: z.string().email(),
  intention: z.string(),
});

export type WaitlistFormSchema = z.infer<typeof waitlistFormSchema>;

export function WaitlistForm() {
  const [state, setState] = useState<'duplicate' | 'error' | 'idle' | 'submitting' | 'success'>(
    'idle',
  );

  const isSubmitting = state === 'submitting';

  const form = useForm<WaitlistFormSchema>({
    resolver: zodResolver(waitlistFormSchema),
    defaultValues: {
      email: '',
      name: '',
    },
  });

  async function onSubmit(data: WaitlistFormSchema) {
    try {
      setState('submitting');
      const status = await uploadWaitlistEntry(data);
      if (status === 'duplicate') {
        setState('duplicate');
      } else {
        setState('success');
      }
      form.reset();
    } catch (e) {
      setState('error');
    }
  }

  return (
    <div className="w-full md:w-[350px]">
      <Form {...form}>
        <form className="flex flex-col" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className={clsx({
                      'rounded-b-none rounded-t-xl border border-b-0 border-red-600 bg-white/50 backdrop-blur-md dark:border-red-400 dark:bg-neutral-950/50':
                        form.formState.errors.name,
                      'rounded-b-none rounded-t-xl border-b-0 border-black/30 bg-white/20 backdrop-blur-md dark:border-white/30 dark:bg-neutral-950/20':
                        !form.formState.errors.name,
                    })}
                    {...field}
                    autoComplete="name"
                    id="name"
                    placeholder="Your name"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className={clsx({
                      'rounded-none border border-red-600 bg-white/50 backdrop-blur-md dark:border-red-400 dark:bg-neutral-950/50':
                        form.formState.errors.email,
                      'rounded-none border-black/30 bg-white/20 backdrop-blur-md dark:border-white/30 dark:bg-neutral-950/20':
                        !form.formState.errors.email,
                    })}
                    {...field}
                    autoComplete="email"
                    id="email"
                    placeholder="Your email address"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="intention"
            render={({ field }) => (
              <FormItem>
                <Select defaultValue={field.value} onValueChange={field.onChange} {...field}>
                  <FormControl>
                    <SelectTrigger
                      className={clsx({
                        'rounded-b-xl rounded-t-none border border-t-0 border-red-600 bg-white/50 backdrop-blur-md dark:border-red-400 dark:bg-neutral-950/50':
                          form.formState.errors.intention,
                        'rounded-b-xl rounded-t-none border-t-0 border-black/30 bg-white/20 backdrop-blur-md dark:border-white/30 dark:bg-neutral-950/20':
                          !form.formState.errors.intention,
                      })}
                    >
                      <SelectValue placeholder="Why are you interested in TypeHero?" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl bg-white/50 backdrop-blur-md dark:bg-black/50">
                    <SelectItem className="cursor-pointer rounded-lg brightness-150" value="user">
                      I want to solve type challenges
                    </SelectItem>
                    <SelectItem
                      className="cursor-pointer rounded-lg brightness-150"
                      value="builder"
                    >
                      I want to build type challenges
                    </SelectItem>
                    <SelectItem className="cursor-pointer rounded-lg brightness-150" value="both">
                      Both
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <Button
            className="wl-form-button group relative mt-6 w-full overflow-hidden rounded-xl px-[2px] py-[2px] font-bold transition-shadow duration-300 hover:shadow-[0_0.5rem_2rem_-0.75rem_#3178c6] dark:hover:shadow-[0_0.5rem_2rem_-0.75rem_#5198f6]"
            disabled={isSubmitting}
            type="submit"
          >
            <span className="h-full w-full rounded-[10px] bg-white px-4 py-2 text-center font-bold text-black transition-colors duration-300 group-hover:bg-blue-100 dark:bg-black dark:text-white group-hover:dark:bg-cyan-950">
              {isSubmitting ? 'Submitting...' : 'Join the waitlist'}
            </span>
          </Button>
        </form>
      </Form>
      <div className="mt-3">
        {state === 'duplicate' && (
          <AlertDestructive text="We already have your email. Thanks for signing up!" />
        )}
        {state === 'success' && <AlertSuccess />}
        {state === 'error' && <AlertDestructive />}
      </div>
    </div>
  );
}

export function AlertDestructive({
  text = 'Something went wrong. Please try again.',
}: {
  text?: string;
}) {
  return (
    <Alert className="dark:bg-[#230808]" variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="text-left text-black dark:text-white">{text}</AlertDescription>
    </Alert>
  );
}

export function AlertSuccess() {
  return (
    <Alert variant="success">
      <MailCheck className="h-4 w-4" />
      <AlertDescription className="text-left text-white">
        Thanks for signing up for the waitlist! Consider{' '}
        <a
          className="underline"
          href="https://twitter.com/typeheroapp"
          rel="noopener"
          target="_blank"
        >
          following us on twitter
        </a>{' '}
        for general updates.
      </AlertDescription>
    </Alert>
  );
}
