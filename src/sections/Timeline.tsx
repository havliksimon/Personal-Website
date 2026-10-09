import JourneyTimeline2D from '../components/journey/JourneyTimeline2D';
import JourneyDesktop from '../components/journey/JourneyDesktop';
import { useJourneyPrefs } from '../hooks/useJourneyPrefs';

const Timeline = () => {
  const allowRich = useJourneyPrefs();
  return allowRich ? <JourneyDesktop /> : <JourneyTimeline2D />;
};

export default Timeline;
