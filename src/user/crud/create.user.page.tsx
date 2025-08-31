import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Box, Breadcrumbs, Button, MenuItem, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import { signUpUserFn } from '../api/userApi';
import { RoleType, StatusEnum, type IUser } from '../api/types';
import FormInput from '../../components/FormInput';
import FormSelect from '../../components/FormSelect';
import FormSwitch from '../../components/FormSwitch';

const LinkItem = styled(Link)`
  text-decoration: none;
  color: #2363eb;
  &:hover {
    text-decoration: underline;
  }
`;

const registerSchema = z.object({
  nome: z.string().min(1, 'O Nome é obrigatório'),
  email: z.string().min(1, 'O Email é obrigatório'),
  rua: z.string().nullable(),
  numero: z.string().nullable(),
  complemento: z.string().nullable(),
  bairro: z.string().nullable(),
  cidade: z.string().nullable(),
  estado: z.string().nullable(),
  cep: z.string().nullable(),
  active: z.boolean(),
  senha: z.string().min(1, 'A Senha é obrigatória')
    .min(8, 'A Senha tem que ter pelo menos 8 caracteres')
    .max(32, 'A Senha tem que ter no máximo 32 caracteres'),
  senhaConfirm: z.string().min(1, 'Por favor, confirme sua senha'),
  role: z.optional(z.enum(RoleType)),
}).refine((data) => data.senha === data.senhaConfirm, {
  path: ['senhaConfirm'],
  message: 'A Senha e sua confirmação não são iguais',
}) satisfies z.ZodType<IUser>;

export type RegisterInput = z.infer<typeof registerSchema>;

const CreateUserPage = () => {
  const navigate = useNavigate();

  const methods = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const { mutate, isPending } = useMutation(
    { mutationFn: (userData: any) => signUpUserFn(userData),
      onSuccess(data: any) {
        toast.success(data?.message);
        navigate('/users');
      },
      onError(error: any) {
        if (Array.isArray((error as any).response.data.error)) {
          (error as any).response.data.error.forEach((el: any) =>
            toast.error(el.message, {
              position: 'top-right',
            })
          );
        } else {
          toast.error((error as any).response.data.message, {
            position: 'top-right',
          });
        }
      },
    }
  );

  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<RegisterInput> = (values) => {
    mutate({
        ...values,
        status: values.active ? StatusEnum.ATIVO : StatusEnum.INATIVO,
        active: undefined,
        senhaConfirm: undefined,
      });
  };

  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
      <Breadcrumbs separator='›' aria-label='breadcrumb' sx={{ mb: 1 }}>
        <LinkItem key='1' to={'/users'} color='inherit' sx={{ display: 'flex', alignItems: 'center' }}>
          <PersonIcon sx={{ mr: 0.5 }} fontSize='inherit' />Usuários
        </LinkItem>
        <Typography key='2' color='text.primary'>
          Criar Novo Usuário
        </Typography>
      </Breadcrumbs>
      <FormProvider {...methods}>
        <Box
          component='form'
          onSubmit={handleSubmit(onSubmitHandler)}
          noValidate
          autoComplete='off'
          maxWidth='27rem'
          width='100%'
          sx={{
            p: { xs: '1rem', sm: '2rem' },
            borderRadius: 2,
          }}
        >
          <FormInput name='nome' label='Nome' />
          <FormInput name='email' label='Email' type='email' />
          <FormInput name='rua' label='Rua' />
          <FormInput name='numero' label='Número' />
          <FormInput name='complemento' label='Complemento' />
          <FormInput name='bairro' label='Bairro' />
          <FormInput name='cidade' label='Cidade' />
          <FormInput name='estado' label='Estado' />
          <FormInput name='cep' label='CEP' />
          <FormInput name='senha' label='Senha' type='password' />
          <FormInput
            name='senhaConfirm'
            label='Confirmação de Senha'
            type='password'
          />
          <FormSelect name='role' label='Perfil do Usuário'>
            <MenuItem value={RoleType.ADMIN}>{RoleType.ADMIN}</MenuItem>
            <MenuItem value={RoleType.USER}>{RoleType.USER}</MenuItem>
          </FormSelect>
          <Box sx={{ ml: 1, mb: 1, mt: 1, display: 'flex', justifyContent: 'flex-start' }}>
            <FormSwitch name='active' label='Ativo' />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'end' }}>
            <Button
              variant='outlined'
              sx={{ mt: 2, mr: 2 }}
              disableElevation
              component={Link}
              to={'/users'}
            >
              Cancelar
            </Button>
            <Button
              variant='contained'
              sx={{ mt: 2 }}
              disableElevation
              type='submit'
              loading={isPending}
            >
              Salvar
            </Button>
          </Box>
        </Box>
      </FormProvider>
    </Paper>
  );
};

export default CreateUserPage;
