import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import * as z from 'zod';
import { Box, Breadcrumbs, Button, MenuItem, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import { getUserByIdFn, updateUserFn } from '../api/userApi';
import { RoleType, StatusEnum } from '../api/types';
import FormInput from '../../components/FormInput';
import FormSwitch from '../../components/FormSwitch';
import FormSelect from '../../components/FormSelect';

const LinkItem = styled(Link)`
  text-decoration: none;
  color: #8fc9f9;
  &:hover {
    text-decoration: underline;
  }
`;

const editUserSchema = z.object({
  id: z.number(),
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
  role: z.optional(z.enum(RoleType)),
  password: z.string()
    .min(8, 'A Senha deve ter 8 ou mais caracteres')
    .max(32, 'A Senha deve ter menos de 32 caracteres')
    .optional()
    .or(z.literal('')),
  passwordConfirm: z.string().min(1, 'Por favor, confirme sua Senha').optional().or(z.literal('')),
}).refine((data) => data.password === data.passwordConfirm, {
  path: ['passwordConfirm'],
  message: 'As Senhas devem ser iguais',
});

export type EditUserInput = z.infer<typeof editUserSchema>;

const EditUserPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { isLoading: isLoadingUser, error, data } = useQuery({
    queryKey: ['getUserById', id], 
    queryFn: () => getUserByIdFn(id),
  });

  const methods = useForm<EditUserInput>({
    resolver: zodResolver(editUserSchema),
  });

  const { mutate, isPending } = useMutation(
    { mutationFn: (userData: any) => updateUserFn({ ...userData }),
      onSuccess(data) {
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
    setValue,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  useEffect(() => {
    if (!isLoadingUser && !error && data) {
      setValue('id', data.data.id ? data.data.id : 0);
      setValue('nome', data.data.nome);
      setValue('email', data.data.email);
      setValue('rua', data.data.rua);
      setValue('numero', data.data.numero);
      setValue('complemento', data.data.complemento);
      setValue('bairro', data.data.bairro);
      setValue('cidade', data.data.cidade);
      setValue('estado', data.data.estado);
      setValue('cep', data.data.cep);
      setValue('role', data.data.role);
      setValue('active', data.data.status === StatusEnum.ATIVO ? true : false);
    }
  }, [isLoadingUser, error, data, setValue]);

  const onSubmitHandler: SubmitHandler<EditUserInput> = (values) => {
    mutate({
        ...values,
        status: values.active ? StatusEnum.ATIVO : StatusEnum.INATIVO,
        active: undefined,
        password: undefined,
        passwordConfirm: undefined,
        role: undefined,
      });
  };

  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
      <Breadcrumbs separator='›' aria-label='breadcrumb' sx={{ mb: 1 }}>
        <LinkItem key='1' to={'/users'} color='inherit' sx={{ display: 'flex', alignItems: 'center' }}>
          <PersonIcon sx={{ mr: 0.5 }} fontSize='inherit' />Usuários
        </LinkItem>
        <Typography key='2' color='text.primary'>
          Editar
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
          <FormInput name='nome' label='Nome do Usuário' />
          <FormInput name='email' label='Email do Usuário' type='email' />
          <FormInput name='rua' label='Rua' />
          <FormInput name='numero' label='Número' />
          <FormInput name='complemento' label='Complemento' />
          <FormInput name='bairro' label='Bairro' />
          <FormInput name='cidade' label='Cidade' />
          <FormInput name='estado' label='Estado' />
          <FormInput name='cep' label='CEP' />
          <FormInput name='password' label='Senha' type='password' />
          <FormInput
            name='passwordConfirm'
            label='Confirmação de Senha'
            type='password'
          />
          <FormSelect name='role' label='Perfil do Usuário'>
            <MenuItem value={RoleType.CUSTOMER}>{RoleType.CUSTOMER}</MenuItem>
            <MenuItem value={RoleType.USER}>{RoleType.USER}</MenuItem>
          </FormSelect>
          <Box sx={{ ml: 1, mb: 1, mt: 1 }}>
            <FormSwitch name='active' label='Ativo' />
          </Box>

          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'end' }}>
              <Button
                variant='outlined'
                sx={{ mt: 2,  mr: 2 }}
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
                loading={isPending || isLoadingUser}
              >
                Salvar
              </Button>
            </Box>
          </Box>
        </Box>
      </FormProvider>
    </Paper>
  );
};

export default EditUserPage;
