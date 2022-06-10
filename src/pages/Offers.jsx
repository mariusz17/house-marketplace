import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase.config";
import ListingItem from "../components/ListingItem";
import { toast } from "react-toastify";
import { Spinner } from "../components/Spinner";

const Offers = () => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Get reference
        const listingsRef = collection(db, "listings");

        // Create query
        const q = query(
          listingsRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc", limit(10))
        );

        // Execute query
        const querySnap = await getDocs(q);

        const listings = [];
        querySnap.forEach((doc) => {
          listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error("Could not get offers listing.");
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="category">
      <header>
        <p className="pageHeader">Offers</p>
      </header>

      <Listings loading={loading} listings={listings} />

      {/* {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <></>
      ) : (
        <p>No listings for {params.categoryName}</p>
      )} */}
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
