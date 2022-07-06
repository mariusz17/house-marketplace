import { useNavigate } from "react-router-dom";
import useListings from "../hooks/useListings";
import { Pagination, Scrollbar, A11y, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/autoplay";
import Spinner from "./Spinner";

const Slider = () => {
  const { listings, listingsLoading, listingsError } = useListings(
    {
      field: "timestamp",
      comparison: "!=",
      value: "",
    },
    {
      field: "timestamp",
      direction: "desc",
      limit: 4,
    }
  );

  const navigate = useNavigate();

  if (listingsLoading) return <Spinner />;

  return (
    listings &&
    !listingsError && (
      <>
        <p className="exploreHeading">Recommended</p>

        <Swiper
          modules={[Pagination, Scrollbar, A11y, Autoplay]}
          slidesPerView={1}
          autoplay
          pagination={{ clickable: true }}
        >
          {listings.map(({ data, id }) => (
            <SwiperSlide
              key={id}
              onClick={() => navigate(`/category/${data.type}/${id}`)}
            >
              <div
                style={{
                  background: `url(${data.imgUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                  cursor: "pointer",
                }}
                className="swiperSlideDiv"
              >
                <p className="swiperSlideText">{data.name}</p>
                <p className="swiperSlidePrice">
                  $
                  {data.discountedPrice
                    ? data.discountedPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : data.regularPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  {data.type === "rent" && " / month"}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  );
};

export default Slider;
