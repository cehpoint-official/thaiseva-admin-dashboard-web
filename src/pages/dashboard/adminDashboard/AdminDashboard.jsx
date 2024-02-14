import CategoriesAndLogo from "../../../components/CategoriesAndLogo";
import FoodBanners from "../../../components/FoodBanners";
import HomeBanners from "../../../components/HomeBanners";
import HotelBanners from "../../../components/HotelBanners";
import LocalAssistance from "../../../components/LocalAssistance";
import NewOfferBanner from "../../../components/NewOffersBanner";
import PageHeading from "../../../components/PageHeading";
import TravelBanners from "../../../components/TravelBanners";

const AdminDashboard = () => {
  return (
    <div>
      <PageHeading text="Admin Dashborad" />

      <div>
        <CategoriesAndLogo />
        {/* home banners container */}
        <HomeBanners />
        <FoodBanners />
        <HotelBanners />
        <TravelBanners />
        <LocalAssistance />
        <NewOfferBanner />
      </div>
    </div>
  );
};

export default AdminDashboard;
