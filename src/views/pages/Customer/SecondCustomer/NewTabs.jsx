import { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { TabContext, TabPanel } from '@mui/lab';
import OtherDetails from './TabsDetails/OtherDetails';
import AddressTabs from './TabsDetails/AddressTabs';
import ContactPersonTabs from './TabsDetails/ContactPersonTabs';
import NoteDetails from './TabsDetails/NoteDetails';

const NewTabs = () => {
  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <TabContext value={value}>
      <Box sx={{ width: '100%' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="wrapped label tabs example"
        >
					  <Tab value="1" label="Other Details" />
          <Tab value="2" label="Address" />
          <Tab value="3" label="Contact Persons" />
          <Tab value="4" label="Remarks" />
        </Tabs>
        <TabPanel value="1"><OtherDetails /></TabPanel>
        <TabPanel value="2"><AddressTabs /></TabPanel>
        <TabPanel value="3"><ContactPersonTabs /></TabPanel>
				<TabPanel value="4">
					<NoteDetails />
					</TabPanel>
      </Box>
    </TabContext>
  );
};

export default NewTabs;
