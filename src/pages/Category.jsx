import { useParams } from "react-router-dom";
import useListings from "../hooks/useListings";
import ListingItem from "../components/ListingItem";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

const Category = () => {
  const params = useParams();

  const { listings, listingsLoading, listingsError } = useListings(
    {
      field: "type",
      comparison: "==",
      value: params.categoryName,
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
        <p className="pageHeader">
          {params.categoryName === "rent"
            ? "Places for rent"
            : "Places for sale"}
        </p>
      </header>

      {!listingsError && (
        <Listings loading={listingsLoading} listings={listings} />
      )}
    </div>
  );
};

const Listings = ({ loading, listings }) => {
  if (loading) {
    return <Spinner />;
  }

  if (!listings || listings.length < 1) {
    return <p>No listings</p>;
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

export default Category;
