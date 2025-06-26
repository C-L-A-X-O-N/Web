import { Box, IconButton } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';

type RadialMenuProps = {
  onSelectColor: (color: 'red'|'yellow'|'green') => void;
  onClose: () => void;
};

const colors: ('red'|'yellow'|'green')[] = ['red','yellow','green'];

export default function RadialMenu({onSelectColor,onClose}: RadialMenuProps) {
  const radius = 30;
  return (
    <Box sx={{position:'relative', width:0, height:0, pointerEvents:'auto'}}>
      {colors.map((color,i) => {
        const angle = (2*Math.PI*i)/colors.length;
        const left = Math.cos(angle)*radius;
        const top  = Math.sin(angle)*radius;
        return (
          <IconButton
            key={color}
            disableRipple
            disableFocusRipple
            onClick={e => { e.stopPropagation(); onSelectColor(color); onClose(); }}
            sx={{
              position:'absolute', left, top,
              backgroundColor: color, color:'#fff',
              '&:hover': {
                boxShadow: '0 0 0 3px rgba(128,128,128,0.5)',
              },
              '&:active': {
                transform: 'scale(1.2)',
              },
              width:24, height:24, p:0
            }}
          >
            <CircleIcon fontSize="small"/>
          </IconButton>
        );
      })}
    </Box>
  );
}
