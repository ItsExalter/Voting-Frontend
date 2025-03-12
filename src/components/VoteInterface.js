import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import axios from 'axios';

const VoteInterface = () => {
  const [statusState, setStatusState] = useState(false);
  const [activeEvents, setActiveEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [voteOption, setVoteOption] = useState('');
  const [customOption, setCustomOption] = useState('');

  useEffect(() => {
    const fetchActiveEvents = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/events/active', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setActiveEvents(res.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchActiveEvents();
  }, []);

  const handleSubmitVote = async () => {
    try {
      await axios.post('http://localhost:3001/api/votes', {
        eventId: selectedEvent._id,
        option: voteOption || customOption
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Vote submitted successfully!');
      setSelectedEvent(null);
    } catch (error) {
      alert(error.response?.data?.error || 'Error submitting vote');
    }
  };

  return (
    
    <Box display="flex" flexDirection="column" sx={{ padding: 3, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
      <Typography variant="h4" mb={4} gutterBottom sx={{ fontWeight: 600}}>
        Active Voting Events
      </Typography>

      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel id="selectEvent">Select Event</InputLabel>
        <Select
          label="Select Event"
          labelId="selectEvent"
          value={selectedEvent?._id || ''}
          onChange={(e) => setSelectedEvent(activeEvents.find(event => event._id === e.target.value))}
        >
          {activeEvents.map(event => (
            <MenuItem key={event._id} value={event._id}>
              {event.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedEvent && (
        <Box display="flex" flexDirection="column">
          <Box sx={{ marginBottom: 3 }}>
            <hr></hr>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              Event Title: <Typography component="span" sx={{ fontWeight: 'normal' }}>{selectedEvent.title}</Typography>
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Description: <Typography component="span" sx={{ fontWeight: 'normal', fontStyle: 'italic' }}>{selectedEvent.description}</Typography>
            </Typography>
            <hr></hr>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, marginBottom: 3 }}>
            <FormControl sx={{ flex: 1 }}>
              <InputLabel id="votingOpt">Voting Options</InputLabel>
              <Select
                label="Voting Options"
                labelId="votingOpt"
                value={voteOption}
                onChange={(e) => setVoteOption(e.target.value)}
                disabled={!selectedEvent}
              >
                {selectedEvent.options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {selectedEvent.allowCustomOptions && (
              <TextField
                fullWidth
                label="Or Enter Custom Option"
                value={customOption}
                onChange={(e) => setCustomOption(e.target.value)}
                sx={{ flex: 1 }}
              />
            )}
          </Box>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmitVote}
            disabled={!voteOption && !customOption}
            sx={{ backgroundColor: '#3f51b5', color: '#fff' }}
          >
            Submit Vote
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default VoteInterface;