import { useState, useEffect } from "react";
import {
  getDocs,
  collection,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebase.config";

const useListings = (
  userWhere = {
    field: "timestamp",
    comparison: "!=",
    value: "",
  },
  userOrderBy = {
    field: "timestamp",
    direction: "desc",
    limit: 10,
  }
) => {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getListings = async () => {
      try {
        const listingsRef = collection(db, "listings");
        const q = query(
          listingsRef,
          where(userWhere.field, userWhere.comparison, userWhere.value),
          orderBy(
            userOrderBy.field,
            userOrderBy.direction,
            limit(userOrderBy.limit)
          )
        );
        const querySnap = await getDocs(q);

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

  return { listings, listingsLoading: loading, listingsError: error };
};

export default useListings;
