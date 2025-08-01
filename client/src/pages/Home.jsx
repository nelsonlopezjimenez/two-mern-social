import { Container, Typography, Box } from '@mui/material'

function Home() {
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
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to MERN Social
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          A modern social media platform built with React 19, Express 5, and MongoDB
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Start connecting with friends and sharing your thoughts!
        </Typography>
      </Box>
    </Container>
  )
}

export default Home