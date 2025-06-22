import React from 'react';
import { Box, IconButton } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';

interface RadialMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onSelectColor: (color: 'red' | 'yellow' | 'green') => void;
}

const colors = ['red', 'yellow', 'green'];

const RadialMenu: React.FC<RadialMenuProps> = ({ x, y, onClose, onSelectColor }) => {
  const radius = 30;
  const centerX = x;
  const centerY = y;

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'auto',
        zIndex: 2000,
      }}
    >
      {colors.map((color, index) => {
        const angle = (2 * Math.PI * index) / colors.length;
        const offsetX = Math.cos(angle) * radius;
        const offsetY = Math.sin(angle) * radius;

        return (
          <IconButton
            key={color}
            onClick={() => {
                onSelectColor(color as 'red' | 'yellow' | 'green');
                onClose();
            }}
            sx={{
              position: 'absolute',
              left: centerX + offsetX,
              top: centerY + offsetY,
              backgroundColor: color,
              color: 'white',
              '&:hover': {
                backgroundColor: color,
                opacity: 0.8,
              },
            }}
          >
            <CircleIcon />
          </IconButton>
        );
      })}
    </Box>
  );
};

export default RadialMenu;
