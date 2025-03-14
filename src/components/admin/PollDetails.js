import React, { useState, useEffect } from 'react';
import { Button, Modal, Box, Typography, Select, MenuItem, Alert, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, IconButton } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';

const PollDetails = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/api/events/', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(response => {
      setEvents(response.data);
    }).catch(err => {
      setError(err.response?.data?.error || err.message);
    });
  }, []);

  const handleOpen = (event) => {
    setSelectedEvent(event);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEvent(null);
  };

  const handleStatusChange = async (event, eventId) => {
    const newStatus = event.target.value;
    try {
      const res = await axios.patch(`http://localhost:3001/api/events/${eventId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEvents(events.map(event => event._id === eventId ? { ...event, status: res.data.status } : event));
      setSuccess('Status updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>Events</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event._id}>
                <TableCell>{event.title}</TableCell>
                <TableCell>{event.description}</TableCell>
                <TableCell>
                  <Select
                    value={event.status}
                    onChange={(e) => handleStatusChange(e, event._id)}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="closed">Closed</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button variant="contained" onClick={() => handleOpen(event)}>View Details</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedEvent && (
        <Modal open={open} onClose={handleClose}>
          <Box sx={{ p: 4, bgcolor: 'background.paper', margin: 'auto', width: '50%', position: 'relative', borderRadius: 2, boxShadow: 24 }}>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
              Event Title: <Typography component="span" variant="h4" sx={{ fontWeight: 'normal', textTransform:'capitalize' }}>{selectedEvent.title}</Typography>
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Description: <br />
              <Typography component="span" variant="body1" sx={{ fontWeight: 'normal', fontStyle: 'italic' }}>{selectedEvent.description}</Typography>
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold', mb: 0 }}>
              Status: <Typography component="span" variant="body2" sx={{ fontWeight: 'normal', textTransform:'capitalize' }}>{selectedEvent.status}</Typography>
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold', mb: 0 }}>
              Anonymity: <Typography component="span" variant="body2" sx={{ fontWeight: 'normal', textTransform:'capitalize' }}>{selectedEvent.isAnonymous ? "Not Anonym" : "Anonym"}</Typography>
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold', mb: 2 }}>
              Options: <Typography component="span" variant="body2" sx={{ fontWeight: 'normal', textTransform:'capitalize' }}>{selectedEvent.options.join(', ')}</Typography>
            </Typography>
            {/* Fetch and display vote results */}
            <VoteResults eventId={selectedEvent._id} isAnonymous={selectedEvent.isAnonymous} />
          </Box>
        </Modal>
      )}
    </Box>
  );
};

const VoteResults = ({ eventId, isAnonymous }) => {
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:3001/api/votes/results/${eventId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(response => {
      setResults(response.data);
    }).catch(err => {
      setError(err.response?.data?.error || err.message);
    });
  }, [eventId]);

  if (!results) return null;
  
  let data = null;
  if (!isAnonymous) {
    if (results.summary) {
      data = {
        labels: results.summary.map(result => result.option),
        datasets: [
          {
            label: 'Votes',
            data: results.summary.map(result => result.count),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }
        ]
      };
    }
    
    return (
      <Box>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Typography variant="h6">Vote Results</Typography>
        {data && <Bar data={data} />}
        <Box>
          <Typography variant="h6">Voters</Typography>
          {results.details.map(detail => (
            <Typography key={detail.timestamp} variant="body2">{detail.voter}: {detail.option} at {new Date(detail.timestamp).toLocaleString()}</Typography>
          ))}
        </Box>
      </Box>
    );
  } else {
    data = {
      labels: results.map(result => result.option),
      datasets: [
        {
          label: 'Votes',
          data: results.map(result => result.count),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }
      ]
    };

    return (
      <Box>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Typography variant="h6">Vote Results</Typography>
        {data && <Bar data={data} />}
      </Box>
    );
  }

  
};

export default PollDetails;