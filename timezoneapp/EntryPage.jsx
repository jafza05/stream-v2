import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Box, Typography } from '@mui/material';
import { useUser } from '../contexts/UserContext';
import spookfishLogo from '../assets/spookfish@2x.png';

// Import icons
import { RiDashboardLine, RiFlightTakeoffLine, 
         RiLineChartLine, RiRoadMapLine } from 'react-icons/ri';
import { GiGolfFlag } from 'react-icons/gi';
import { FaFlagCheckered } from 'react-icons/fa';

const EntryPage = () => {
    const navigate = useNavigate();
    const { user, enableGuestMode } = useUser();
    const [message, setMessage] = useState("");
    const [activeButton, setActiveButton] = useState(null);

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

    const handleDisplaySelect = async (displayType, displayName) => {
        setMessage(""); // Clear previous messages
        setActiveButton(displayType);
        
        try {
            const displayExt = `${displayType}-display`;
            console.log(`Navigating to /${displayExt}`);
            
            // Direct navigation to the display URL
            navigate(`/${displayExt}`);
            
            setMessage(`✅ Opening ${displayName} display...`);
        } catch (error) {
            console.error("Error navigating to display:", error);
            setMessage("❌ Error opening display.");
            setActiveButton(null);
        }
    };

    const displayOptions = [
        { type: "primary", name: "Primary", icon: <RiDashboardLine /> },
        { type: "flights", name: "Flights", icon: <RiFlightTakeoffLine /> },
        { type: "golf", name: "Golf", icon: <GiGolfFlag /> },
        { type: "f1", name: "F1", icon: <FaFlagCheckered /> },
        { type: "finance", name: "Finance", icon: <RiLineChartLine /> },
        { type: "traffic", name: "Traffic", icon: <RiRoadMapLine /> },
    ];

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            backgroundColor: '#ffffff', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center' 
        }}>
            <Container maxWidth="sm">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        gap: { xs: 2, sm: 4 },
                        px: 2,
                        py: 3,
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

                    {/* Welcome Message */}
                    <Typography variant="h5" sx={{ 
                        fontWeight: 400, 
                        color: '#333',
                        mb: 1
                    }}>
                        {user ? 'Select your display' : 'Welcome to Stream'}
                    </Typography>

                    {user ? (
                        <>
                            {/* Display Selection Buttons */}
                            <Box sx={{ 
                                display: 'grid',
                                gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' },
                                gap: 2,
                                width: '100%',
                                maxWidth: '450px',
                                mt: 1
                            }}>
                                {displayOptions.map((option) => (
                                    <Button
                                        key={option.type}
                                        variant="contained"
                                        onClick={() => handleDisplaySelect(option.type, option.name)}
                                        sx={{
                                            bgcolor: activeButton === option.type ? '#14e8e2' : '#0ABAB5',
                                            '&:hover': { 
                                                bgcolor: '#099893',
                                                transform: 'translateY(-5px)',
                                                boxShadow: '0 10px 20px rgba(10, 186, 181, 0.3)'
                                            },
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            height: { xs: '80px', sm: '100px' },
                                            borderRadius: '10px',
                                            transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                                            boxShadow: activeButton === option.type 
                                                ? '0 0 20px rgba(10, 186, 181, 0.4), 0 0 40px rgba(10, 186, 181, 0.2)'
                                                : '0 4px 12px rgba(10, 186, 181, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1)',
                                        }}
                                    >
                                        <Box sx={{ 
                                            fontSize: '1.8rem', 
                                            mb: 0.5,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.1)'
                                            }
                                        }}>
                                            {option.icon}
                                        </Box>
                                        <Typography 
                                            variant="button" 
                                            sx={{ 
                                                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                                                fontWeight: 600,
                                                letterSpacing: '0.5px',
                                                textTransform: 'uppercase',
                                            }}
                                        >
                                            {option.name}
                                        </Typography>
                                    </Button>
                                ))}
                            </Box>

                            {/* Status Message */}
                            {message && (
                                <Typography 
                                    variant="body2" 
                                    sx={{
                                        mt: 2,
                                        p: 1,
                                        borderRadius: '8px',
                                        bgcolor: message.includes("❌") 
                                            ? 'rgba(255, 76, 76, 0.1)' 
                                            : 'rgba(10, 186, 181, 0.1)',
                                        border: message.includes("❌") 
                                            ? '1px solid rgba(255, 76, 76, 0.2)' 
                                            : '1px solid rgba(10, 186, 181, 0.2)',
                                        color: message.includes("❌") ? '#e63946' : '#08918d',
                                    }}
                                >
                                    {message}
                                </Typography>
                            )}
                        </>
                    ) : (
                        /* Login and Guest Buttons */
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
                                    '&:hover': { bgcolor: '#099893' },
                                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' },
                                    px: { xs: 3, md: 5 },
                                    py: { xs: 1, sm: 1.5, md: 2 },
                                }}
                            >
                                Login To Stream
                            </Button>
                            
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
                    )}
                </Box>
            </Container>
        </Box>
    );
};

export default EntryPage; 