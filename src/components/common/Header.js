import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { userRole, logout } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Voting System
        </Typography>
        {userRole && (
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;