import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

const EventResults = () => {
  const { eventId } = useParams();
  const [results, setResults] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventRes = await axios.get(`http://localhost:3001/api/events/${eventId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const resultsRes = await axios.get(`http://localhost:3001/api/votes/results/${eventId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setEventDetails(eventRes.data);
        setResults(resultsRes.data);
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };
    fetchData();
  }, [eventId]);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        {eventDetails?.title} Results
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Option</TableCell>
              <TableCell align="right">Votes</TableCell>
              {!eventDetails?.isAnonymous && <TableCell>Voter</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {results?.summary?.map((result, index) => (
              <TableRow key={index}>
                <TableCell>{result.option}</TableCell>
                <TableCell align="right">{result.count}</TableCell>
                {!eventDetails?.isAnonymous && results.details && (
                  <TableCell>
                    {results.details
                      .filter(d => d.option === result.option)
                      .map((d, i) => (
                        <div key={i}>{d.voter} - {new Date(d.timestamp).toLocaleString()}</div>
                      ))}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default EventResults;