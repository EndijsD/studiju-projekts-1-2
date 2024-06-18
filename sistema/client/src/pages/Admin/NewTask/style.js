import { styled } from '@mui/system';

export const Form = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  width: '100%',
  maxWidth: '700px',

  '& .dropzone': {
    minHeight: 'auto',
    paddingBottom: '10px',
    overflow: 'visible',
  },
});
