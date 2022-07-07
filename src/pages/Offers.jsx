import ListingItem from "../components/ListingItem";
import useListings from "../hooks/useListings";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

const Offers = () => {
  const {
    listings,
    listingsLoading,
    listingsError,
    wasLastListingFetched,
    getMoreListings,
  } = useListings("offer", "==", true, 10);

  if (listingsError) toast.error("Could not get offers listing.");

  return (
    <div className="category">
      <header>
        <p className="pageHeader">Offers</p>
      </header>

      {!listingsError && (
        <Listings loading={listingsLoading} listings={listings} />
      )}
      {!wasLastListingFetched && (
        <p className="loadMore" onClick={getMoreListings}>
          Load more
        </p>
      )}
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
