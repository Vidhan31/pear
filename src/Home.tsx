import Share from "./components/Share.tsx";
import { SocketProvider } from "./hooks/SocketProvider.tsx";

export const Home = () => {
  return (
    <SocketProvider>
      <Share />
    </SocketProvider>
  );
};

export default Home;
