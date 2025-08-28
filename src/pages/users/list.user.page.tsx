import * as React from 'react';
import {
  DataGrid,
  GridActionsCellItem,
  type GridColDef,
  type GridSlots,
} from '@mui/x-data-grid';
import { Box, Breadcrumbs, Button, Paper, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import LinearProgress from '@mui/material/LinearProgress';
import { useQuery } from '@tanstack/react-query';
import { getUsersFn } from '../../api/userApi';
import { type IUser } from '../../api/types';
import { useNavigate } from 'react-router-dom';

type Row = (IUser[])[number];

export default function ListUserPage() {
  const [rows, setRows] = React.useState<Row[]>([]);
  const navigate = useNavigate();

  const { isLoading, error, data } = useQuery({
    queryKey: ['allUsers'], 
    queryFn: () => getUsersFn(),
  });

  /*
  const deleteUser = React.useCallback(
    (id: GridRowId) => () => {
      setTimeout(() => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      });
    },
    [],
  );

  const toggleAdmin = React.useCallback(
    (id: GridRowId) => () => {
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id ? { ...row, active: !row.active } : row,
        ),
      );
    },
    [],
  );
  */

  const columns = React.useMemo<GridColDef<Row>[]>(
    () => [
      { field: 'nome', headerName: 'Nome', type: 'string', flex: 1 },
      { field: 'email', headerName: 'Email', type: 'string', flex: 1, minWidth: 250 },
      { field: 'createdAt', headerName: 'Criado em', type: 'dateTime', width: 180, valueGetter: (value) => value && new Date(value) },
      { field: 'updatedAt', headerName: 'Atualizado em', type: 'dateTime', width: 180, valueGetter: (value) => value && new Date(value) },
      { field: 'status', headerName: 'Ativo', type: 'boolean', width: 120 },
      {
        field: 'actions',
        type: 'actions',
        width: 80,
        getActions: (params) => [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={() => navigate(`/user/${params.id}`)}
          />,
        ],
      },
    ],
    [navigate],
  );

  React.useEffect(() => {
    if (!isLoading && !error && data) {
      setRows(data.data);
    }
  },
  [isLoading, error, data]);

  return (
    <>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <Breadcrumbs separator='›' aria-label='breadcrumb' sx={{ mb: 1 }}>
          <Typography key='1' color='text.primary' sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonIcon sx={{ mr: 0.5 }} fontSize='inherit' />Usuários
          </Typography>
        </Breadcrumbs>
        <DataGrid
          columns={columns}
          rows={rows}
          slots={{
            loadingOverlay: LinearProgress as GridSlots['loadingOverlay']  
          }}
          loading={isLoading}
        />
      </Paper>
      <Box sx={{ display: 'flex', justifyContent: 'end'  }}>
        <Button
          loading={isLoading}
          variant='contained'
          sx={{ mt: 1, mr: 2 }}
          onClick={() => navigate('/user')}
        >
          Criar Novo Usuário
        </Button>
      </Box>
    </>
  );
}