import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert
} from '@mui/material';
import { Delete, Add } from '@mui/icons-material';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', password: '', confirmPassword: '', role: 'user' });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setUsers(res.data);
      } catch (err) {
        setError('Failed to fetch users');
      }
    };
    fetchUsers();
  }, []);

  const handleEditUser = async (curUser) => {
    try {
      const updatedUser = await axios.patch(
        `http://localhost:3001/api/users/${curUser._id}/username`,
        { username: curUser.username },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setUsers(users.map(user => 
        user._id === curUser._id ? { ...user, ...updatedUser.data } : user
      ));
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const handleEditRole = async (curUser) => {
    try {
      const roleUpdate = await axios.patch(
        `http://localhost:3001/api/users/${curUser._id}/role`,
        { role: curUser.role },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setUsers(users.map(user => 
        user._id === curUser._id ? { ...user, ...roleUpdate.data } : user
      ));
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/users/${selectedUser._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(users.filter(user => user._id !== selectedUser._id));
      setDeleteOpen(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Delete failed');
    }
  };

  const handleCreateUser = async () => {
    if (newUser.password !== newUser.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const res = await axios.post('http://localhost:3001/api/users', {
        username: newUser.username,
        password: newUser.password,
        role: newUser.role
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers([...users, res.data.user]);
      setCreateOpen(false);
      setNewUser({ username: '', password: '', confirmPassword: '', role: 'user' });
    } catch (err) {
      setError(err.response?.data?.error || 'Creation failed');
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error.toString()}</Alert>}

      <Typography variant="h4" mb={4} gutterBottom sx={{ fontWeight: 600, color: '#3f51b5' }}>
        User Management
      </Typography>

      <Button
        variant="contained"
        startIcon={<Add />}
        sx={{ mb: 2 }}
        onClick={() => setCreateOpen(true)}
      >
        Create New Account
      </Button>

      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Role</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user._id}>
                <TableCell>
                  <TextField
                    value={user.username}
                    onChange={(e) => setUsers(users.map(u => u._id === user._id ? { ...u, username: e.target.value } : u))}
                    onBlur={() => {
                      handleEditUser(user);
                    }}
                    variant="standard"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <FormControl fullWidth variant="standard">
                    <Select
                      value={user.role}
                      onChange={(e) => setUsers(users.map(u => u._id === user._id ? { ...u, role: e.target.value } : u))}
                      onBlur={() => {
                        handleEditRole(user);
                      }}
                    >
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => {
                    setSelectedUser(user);
                    setDeleteOpen(true);
                  }}>
                    <Delete color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete user {selectedUser?.username}?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={handleDeleteUser}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)}>
        <DialogTitle>Create New Account</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Username"
            fullWidth
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Confirm Password"
            type="password"
            fullWidth
            value={newUser.confirmPassword}
            onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={newUser.role}
              label="Role"
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateUser}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};


export default UserManagement;