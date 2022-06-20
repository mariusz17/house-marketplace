import { useState } from "react";
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";
import { Spinner } from "../components/Spinner";

const CreateListing = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

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

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    offer,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude,
  } = formData;

  const onSubmit = async (e) => {
    e.preventDefault();

    if (discountedPrice >= regularPrice) {
      toast.error("Discounted price has to be less than regular price.");
      return;
    }

    if (images.length > 6) {
      toast.error("Max 6 images are allowed.");
      return;
    }

    setLoading(true);

    let geolocation = {};
    let location;

    if (geolocationEnabled) {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
        );

        const data = await response.json();

        geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
        geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;
        location =
          data.status === "ZERO_RESULTS"
            ? undefined
            : data.results[0]?.formatted_address;

        if (location === undefined || location.includes("undefined")) {
          setLoading(false);
          toast.error("Please enter correct address");
          return;
        }
      } catch (error) {
        setLoading(false);
        toast.error(
          "Could not get geolocation from Google API. Please use manual geolocation."
        );
        return;
      }
    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
      location = address;
    }

    console.log(geolocation.lat);
    console.log(geolocation.lng);
    console.log(location);

    setLoading(false);
  };

  const onMutate = (e) => {
    e.preventDefault();

    let boolean = null;

    if (e.target.value === "true") {
      boolean = true;
    }

    if (e.target.value === "false") {
      boolean = false;
    }

    // Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }

    // Boolean, numbers, text
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }

    // if (e.target.files) {
    //   setFormData((prevState) => ({
    //     ...prevState,
    //     images: e.target.files,
    //   }));
    // } else if (e.target.value === "true") {
    //   setFormData((prevState) => ({
    //     ...prevState,
    //     [e.target.id]: true,
    //   }));
    // } else if (e.target.value === "false") {
    //   setFormData((prevState) => ({
    //     ...prevState,
    //     [e.target.id]: false,
    //   }));
    // } else if (e.target.type === "number") {
    //   setFormData((prevState) => ({
    //     ...prevState,
    //     [e.target.id]: +e.target.value,
    //   }));
    // } else {
    //   setFormData((prevState) => ({
    //     ...prevState,
    //     [e.target.id]: e.target.value,
    //   }));
    // }
  };

  const setGoogleGeolocation = (e) => {
    if (e.target.value === "true") {
      setGeolocationEnabled(true);
    }
    if (e.target.value === "false") {
      setGeolocationEnabled(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="profile">
      <header>
        <p className="pageHeader">Create a listing</p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <label className="formLabel">Sell / Rent</label>
          <div className="formButtons">
            <button
              type="button"
              className={type === "sale" ? "formButtonActive" : "formButton"}
              id="type"
              value="sale"
              onClick={onMutate}
            >
              Sell
            </button>

            <button
              type="button"
              className={type === "rent" ? "formButtonActive" : "formButton"}
              id="type"
              value="rent"
              onClick={onMutate}
            >
              Rent
            </button>
          </div>

          <label htmlFor="name" className="formLabel">
            Name
          </label>
          <input
            className="formInputName"
            type="text"
            id="name"
            value={name}
            onChange={onMutate}
            minLength="10"
            maxLength="32"
            required
          />

          <div className="formRooms flex">
            <div>
              <label htmlFor="bedrooms" className="formLabel">
                Bedrooms
              </label>
              <input
                className="formInputSmall"
                type="number"
                id="bedrooms"
                value={bedrooms}
                onChange={onMutate}
                minLength="1"
                maxLength="50"
                required
              />
            </div>
            <div>
              <label htmlFor="bathrooms" className="formLabel">
                Bathrooms
              </label>
              <input
                className="formInputSmall"
                type="number"
                id="bathrooms"
                value={bathrooms}
                onChange={onMutate}
                minLength="1"
                maxLength="50"
                required
              />
            </div>
          </div>

          <label className="formLabel">Parking spot</label>
          <div className="formButtons">
            <button
              className={parking ? "formButtonActive" : "formButton"}
              type="button"
              id="parking"
              value={true}
              onClick={onMutate}
              min="1"
              max="50"
            >
              Yes
            </button>
            <button
              className={
                !parking && parking !== null ? "formButtonActive" : "formButton"
              }
              type="button"
              id="parking"
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className="formLabel">Furnished</label>
          <div className="formButtons">
            <button
              className={furnished ? "formButtonActive" : "formButton"}
              type="button"
              id="furnished"
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !furnished && furnished !== null
                  ? "formButtonActive"
                  : "formButton"
              }
              type="button"
              id="furnished"
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label htmlFor="address" className="formLabel">
            Address
          </label>
          <textarea
            className="formInputAddress"
            type="text"
            id="address"
            value={address}
            onChange={onMutate}
            required
          />

          <label className="formLabel">Use Google Geolocation</label>
          <div className="formButtons">
            <button
              className={geolocationEnabled ? "formButtonActive" : "formButton"}
              type="button"
              id="google-geolocation"
              value={true}
              onClick={setGoogleGeolocation}
            >
              Yes
            </button>
            <button
              className={
                !geolocationEnabled ? "formButtonActive" : "formButton"
              }
              type="button"
              id="google-geolocation"
              value={false}
              onClick={setGoogleGeolocation}
            >
              No
            </button>
          </div>

          {!geolocationEnabled && (
            <div className="formLatLng flex">
              <div>
                <label className="formLabel">Latitude</label>
                <input
                  className="formInputSmall"
                  type="number"
                  id="latitude"
                  value={latitude}
                  onChange={onMutate}
                  required
                />
              </div>
              <div>
                <label className="formLabel">Longitude</label>
                <input
                  className="formInputSmall"
                  type="number"
                  id="longitude"
                  value={longitude}
                  onChange={onMutate}
                  required
                />
              </div>
            </div>
          )}

          <label className="formLabel">Offer</label>
          <div className="formButtons">
            <button
              className={offer ? "formButtonActive" : "formButton"}
              type="button"
              id="offer"
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !offer && offer !== null ? "formButtonActive" : "formButton"
              }
              type="button"
              id="offer"
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className="formLabel">Regular Price</label>
          <div className="formPriceDiv">
            <input
              className="formInputSmall"
              type="number"
              id="regularPrice"
              value={regularPrice}
              onChange={onMutate}
              min="50"
              max="750000000"
              required
            />
            {type === "rent" && <p className="formPriceText">$ / Month</p>}
          </div>

          {offer && (
            <>
              <label className="formLabel">Discounted Price</label>
              <input
                className="formInputSmall"
                type="number"
                id="discountedPrice"
                value={discountedPrice}
                onChange={onMutate}
                min="50"
                max="750000000"
                required={offer}
              />
            </>
          )}

          <label className="formLabel">Images</label>
          <p className="imagesInfo">
            The first image will be the cover (max 6).
          </p>
          <input
            className="formInputFile"
            type="file"
            id="images"
            onChange={onMutate}
            max="6"
            accept=".jpg,.png,.jpeg"
            multiple
            required
          />
          <button type="submit" className="primaryButton createListingButton">
            Create Listing
          </button>
        </form>
      </main>
    </div>
  );
};

export default CreateListing;
