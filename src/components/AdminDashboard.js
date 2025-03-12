import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import UserManagement from './admin/UserManagement';
import EventCreation from './admin/EventCreation';
import PollDetails from './admin/PollDetails';

const AdminDashboard = () => {
  const [tabValue, setTabValue] = useState(0);

  return (
    <div>
      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
        <Tab label="Events Management" />
        <Tab label="User Management" />
        <Tab label="Poll Details" />
      </Tabs>

      <Box sx={{ pt: 3 }}>
        {tabValue === 0 && <EventCreation />}
        {tabValue === 1 && <UserManagement />}
        {tabValue === 2 && <PollDetails />}
      </Box>
    </div>
  );
};

export default AdminDashboard;