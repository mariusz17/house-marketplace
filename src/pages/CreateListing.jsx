import { useState } from "react";
import { getAuth } from "firebase/auth";

const CreateListing = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
    userRef: user.uid,
  });

  return <div>CreateListing</div>;
};

export default CreateListing;
