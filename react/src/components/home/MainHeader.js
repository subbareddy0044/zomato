// import { Link } from "react-router-dom";

import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../common/Header";

function MainHeader() {
  let [locationList, setLocationList] = useState([]);

  let getLocationList = async () => {
    let url = "http://localhost:5003/api/get-location-list";
    let { data } = await axios.get(url);
    setLocationList(data.location);
  };

  useEffect(() => {
    getLocationList();
  }, []); // on load i.e once we want to run it
  return (
    <>
      <section className="row main-section align-content-start">
        <Header />
        <section className="col-12 d-flex flex-column align-items-center justify-content-center">
          <p className="brand-name fw-bold my-lg-2 mb-0">e!</p>
          <p className="h1 text-white my-3 text-center">
            Find the best restaurants, cafés, and bars
          </p>
          <div className="search w-50 d-flex mt-3">
            <select
              type="text"
              className="form-select mb-3 mb-lg-0 w-50 me-lg-3 py-2 px-3"
              placeholder="Please type a location"
            >
              <option>--- Select Location ---</option>
              {locationList.map((location, index) => {
                return (
                  <option key={index}>
                    {location.name}, {location.city}
                  </option>
                );
              })}
            </select>
            <div className="w-75 input-group">
              <span className="input-group-text bg-white">
                <i className="fa fa-search text-primary"></i>
              </span>
              <input
                type="text"
                className="form-control py-2 px-3"
                placeholder="Search for restaurants"
              />
            </div>
          </div>
        </section>
      </section>
    </>
  );
}

export default MainHeader;
