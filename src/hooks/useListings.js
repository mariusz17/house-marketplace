import { useState, useEffect } from "react";
import {
  getDocs,
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase.config";

const useListings = (type, comparison, value, qty) => {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);
  const [error, setError] = useState(null);
  const [lastListing, setLastListing] = useState(null);
  const [wasLastListingFetched, setWasLastListingFetched] = useState(false);
  const [lastDocId, setLastDocId] = useState(null);

  useEffect(() => {
    const getListings = async () => {
      try {
        const listingsRef = collection(db, "listings");
        const q = query(
          listingsRef,
          where(type, comparison, value),
          orderBy("timestamp", "desc"),
          limit(qty)
        );

        const qLast = query(
          listingsRef,
          where(type, comparison, value),
          orderBy("timestamp", "asc"),
          limit(1)
        );

        const querySnap = await getDocs(q);
        const querySnapLast = await getDocs(qLast);
        setLastDocId(querySnapLast.docs[0].id);

        // Check if in this query last listing was fetched
        querySnap.docs[querySnap.docs.length - 1].id ===
        querySnapLast.docs[0].id
          ? setWasLastListingFetched(true)
          : setLastListing(querySnap.docs[querySnap.docs.length - 1]);

        const listings = [];
        querySnap.forEach((doc) =>
          listings.push({
            id: doc.id,
            data: doc.data(),
          })
        );

        setListings(listings);
      } catch (error) {
        console.log(error);
        setError(error);
      }

      setLoading(false);
    };

    getListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getMoreListings = async () => {
    if (wasLastListingFetched) return;

    try {
      const listingsRef = collection(db, "listings");
      const q = query(
        listingsRef,
        where(type, comparison, value),
        orderBy("timestamp", "desc"),
        limit(qty),
        startAfter(lastListing)
      );
      const querySnap = await getDocs(q);

      // Check if in this query last listing was fetched
      querySnap.docs[querySnap.docs.length - 1].id === lastDocId
        ? setWasLastListingFetched(true)
        : setLastListing(querySnap.docs[querySnap.docs.length - 1]);

      const newListings = [...listings];
      querySnap.forEach((doc) =>
        newListings.push({
          id: doc.id,
          data: doc.data(),
        })
      );

      setListings(newListings);
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  return {
    listings,
    listingsLoading: loading,
    listingsError: error,
    setListings,
    getMoreListings,
    wasLastListingFetched,
  };
};

export default useListings;
