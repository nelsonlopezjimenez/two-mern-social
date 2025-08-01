import { Container, Typography, Box } from '@mui/material'
import { useParams } from 'react-router-dom'

function Profile() {
  const { userId } = useParams()

  return (
    <Container maxWidth="md" sx={{ mt: 10, mb: 4 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          py: 4
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          User Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Profile for user ID: {userId}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Profile functionality coming soon...
        </Typography>
      </Box>
    </Container>
  )
}

export default Profile