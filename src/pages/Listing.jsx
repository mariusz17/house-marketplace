import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase.config";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import shareIcon from "../assets/svg/shareIcon.svg";
import Spinner from "../components/Spinner";

const Listing = () => {
  const [loading, setLoading] = useState(true);
  const [document, setDocument] = useState(null);

  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocument = async () => {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setDocument(docSnap.data());
      } else {
        toast.error("There is no listing with given id");
        navigate("/");
      }

      setLoading(false);
    };

    fetchDocument();
  }, [navigate, params.listingId]);

  if (loading) return <Spinner />;

  return <div>{document.name}</div>;
};

export default Listing;
