import {BottomNavBar} from "../components/BottomNavBar";
import {TopNavBar} from "../components/TopNavBar";
import ProfilBody from "../components/ProfilBody";

//////////////////////////////////////

const Profil = () => {

  return (
    <div className="h-screen w-full flex flex-col justify-between">
      <TopNavBar />
      <ProfilBody />
      <BottomNavBar />
    </div>
  );
};

export default Profil;