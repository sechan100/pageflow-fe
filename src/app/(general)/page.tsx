/** @jsxImportSource @emotion/react */
'use client';
import Container from '@mui/material/Container';
import { AppBar } from '@/widgets/app-bar';
import { Footer } from '@/widgets/footer';


export const Home = () => {
  return (
    <>
      <AppBar />
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
      >
        {/* <MainContent /> */}
        {/* <Latest /> */}
      </Container>
      <Footer />
    </>
  );
}
export default Home;