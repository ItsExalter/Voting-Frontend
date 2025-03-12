import React, { useState } from 'react';
import {
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Box,
  Stack,
  Alert,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper
} from '@mui/material';
import { Delete } from '@mui/icons-material';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';

const EventCreation = () => {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    isAnonymous: true,
    allowCustomOptions: true,
    options: [],
    closesAt: null
  });
  const [newOption, setNewOption] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAddOption = () => {
    if (newOption.trim() && !eventData.options.includes(newOption.trim())) {
      setEventData({
        ...eventData,
        options: [...eventData.options, newOption.trim()]
      });
      setNewOption('');
    }
  };

  const handleDeleteOption = (optionToDelete) => {
    setEventData({
      ...eventData,
      options: eventData.options.filter(option => option !== optionToDelete)
    });
  };

  const handleSubmit = async () => {
    try {
      if (!eventData.title || !eventData.closesAt) {
        throw new Error('Title and closing date are required');
      }

      const res = await axios.post('http://localhost:3001/api/events', eventData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setSuccess('Event created successfully!');
      setTimeout(() => setSuccess(''), 3000);
      setEventData({
        title: '',
        description: '',
        isAnonymous: true,
        allowCustomOptions: true,
        options: [],
        closesAt: null
      });
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Event Title"
            value={eventData.title}
            onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
          />

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            value={eventData.description}
            onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
          />

          <DatePicker
            label="Closing Date"
            value={eventData.closesAt}
            onChange={(newValue) => setEventData({ ...eventData, closesAt: newValue })}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              fullWidth
              label="Add Option"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              sx={{ mr: 2 }}
            />
            <Button variant="contained" onClick={handleAddOption}>Add</Button>
          </Box>

          {eventData.options.length > 0 && (
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6">Added Options:</Typography>
              <List>
                {eventData.options.map((option, index) => (
                  <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <ListItemText primary={option} />
                    <IconButton onClick={() => handleDeleteOption(option)}>
                      <Delete color="error" />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <FormControlLabel
              control={<Checkbox 
                checked={eventData.isAnonymous}
                onChange={(e) => setEventData({ ...eventData, isAnonymous: e.target.checked })}
              />}
              label="Anonymous Voting"
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={<Checkbox 
                checked={eventData.allowCustomOptions}
                onChange={(e) => setEventData({ ...eventData, allowCustomOptions: e.target.checked })}
              />}
              label="Allow Custom Options"
              sx={{ mb: 2 }}
            />
          </Box>

          <Button 
            variant="contained" 
            size="large" 
            onClick={handleSubmit}
            disabled={!eventData.title || !eventData.closesAt}
          >
            Create Event
          </Button>
        </Stack>
      </Box>
    </LocalizationProvider>
  );
};

export default EventCreation;