import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Story from '../components/Story';
import Programme from '../components/Programme';
import Venues from '../components/Venues';
import DressCode from '../components/DressCode';
import Rsvp from '../components/Rsvp';
import Album from '../components/Album';
import PracticalInfo from '../components/PracticalInfo';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Story />
      <Programme />
      <Venues />
      <DressCode />
      <Rsvp />
      <Album />
      <PracticalInfo />
      <Footer />
    </div>
  );
}
