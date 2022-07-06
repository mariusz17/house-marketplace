import ListingItem from "../components/ListingItem";
import useListings from "../hooks/useListings";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

const Offers = () => {
  const { listings, listingsLoading, listingsError } = useListings(
    {
      field: "offer",
      comparison: "==",
      value: true,
    },
    {
      field: "timestamp",
      direction: "desc",
      limit: 10,
    }
  );

  if (listingsError) toast.error("Could not get offers listing.");

  return (
    <div className="category">
      <header>
        <p className="pageHeader">Offers</p>
      </header>

      <Listings loading={listingsLoading} listings={listings} />
    </div>
  );
};

const Listings = ({ loading, listings }) => {
  if (loading) {
    return <Spinner />;
  }

  if (!listings || listings.length < 1) {
    return <p>Currently there are no offers</p>;
  }

  return (
    <main>
      <ul className="categoryListings">
        {listings.map((listing) => {
          return (
            <ListingItem
              key={listing.id}
              listing={listing.data}
              id={listing.id}
            />
          );
        })}
      </ul>
    </main>
  );
};

export default Offers;
