import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Box, useTheme } from '@mui/material';
import { useUser } from '../contexts/UserContext';
import spookfishLogo from '../assets/spookfish@2x.png';

const WelcomePage = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const { enableGuestMode } = useUser();
    
    // Check for OAuth failure or redirection
    React.useEffect(() => {
        // Clear any leftover OAuth state
        sessionStorage.removeItem('googleAuthInProgress');
    }, []);

    const handleGuestMode = () => {
        // Enable guest mode
        enableGuestMode();
        // Navigate to guest landing page
        navigate('/guest-landing');
    };

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#ffffff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Container maxWidth="sm"> {/* Adjusted to 'sm' for better mobile experience */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        gap: { xs: 2, sm: 4 }, // Reduce gap on smaller screens
                        px: 2,
                        py: 3, // Add vertical padding for spacing
                    }}
                >
                    {/* Spookfish Logo */}
                    <img
                        src={spookfishLogo}
                        alt="Spookfish Logo"
                        style={{
                            width: 'auto',
                            height: 'auto',
                            maxWidth: '65vw',
                            maxHeight: '45vh',
                            marginBottom: '1rem',
                        }}
                    />

                    {/* Login Button */}
                    <Box 
                        sx={{ 
                            mt: { xs: 1, sm: 3 },
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            width: '100%',
                            maxWidth: '300px'
                        }}
                    >
                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            onClick={() => navigate('/login')}
                            sx={{
                                bgcolor: '#0ABAB5',
                                '&:hover': { bgcolor: '#099893' }, // Slightly darker hover effect
                                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' }, // Smaller font on xs screens
                                px: { xs: 3, md: 5 }, // Adjust padding for touch-friendliness
                                py: { xs: 1, sm: 1.5, md: 2 }, // Reduced padding on xs screens
                            }}
                        >
                            Login To Stream
                        </Button>
                        
                        {/* Guest Mode Button */}
                        <Button
                            variant="outlined"
                            size="large"
                            fullWidth
                            onClick={handleGuestMode}
                            sx={{
                                borderColor: '#0ABAB5',
                                color: '#0ABAB5',
                                '&:hover': { 
                                    borderColor: '#099893',
                                    bgcolor: 'rgba(10, 186, 181, 0.05)'
                                },
                                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' },
                                px: { xs: 3, md: 5 },
                                py: { xs: 1, sm: 1.5, md: 2 },
                            }}
                        >
                            Continue as Guest
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default WelcomePage;
