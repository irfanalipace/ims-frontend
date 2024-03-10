import { useEffect, useState } from 'react';
import { Grid, Paper } from '@mui/material';
import DataTable from 'components/DataTable/DataTable';
// import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import {
  // decryptId,
  // extractNumberFromHash,
  generateEncryptedID
} from 'core/utils/helpers';
import HeaderPaper from 'components/Containers/HeaderPaper';
import DataTableContainer from 'components/Containers/DataTableContainer';
import TableGrid from 'components/Containers/TableGrid';
import { StockOutInitialColumns } from './columns';
import StockHeader from './Headers/StockHeader';
import { getAllStocksApi } from 'core/api/stockOut';
import { useNavigate } from 'react-router-dom';
import DateRangeHeader from '../../../Components/DateRangeHeader/DateRangeHeader';

const StockOutTable = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  // const [refresh, setRefresh] = useState(0);
  const navigate = useNavigate();

  const handleRowClick = row => {
    if (row.original.status === 'in_warehouse')
      navigate(generateEncryptedID(row?.id));
  };

  const [searchPram, setSearchPram] = useState('');

  return (
    <Grid container>
      <TableGrid sm={12}>
        <HeaderPaper>
          <StockHeader />
        </HeaderPaper>
        <Paper>
          <DateRangeHeader
            searchParams={searchPram}
            setSearchPram={setSearchPram}
          />
        </Paper>

        <DataTableContainer takenHeight='200'>
          <DataTable
            takenHeight='380'
            api={getAllStocksApi}
            columns={StockOutInitialColumns}
            setSelectedRows={setSelectedRows}
            onRowClick={handleRowClick}
            // refresh={refresh}
            manualFilter
            extraParams={searchPram}
          />
        </DataTableContainer>
      </TableGrid>
    </Grid>
  );
};

export default StockOutTable;
