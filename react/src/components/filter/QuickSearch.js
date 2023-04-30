import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FilterOption from "./FilterOption";
import Header from "../common/Header";
import RestaurantList from "./RestaurantList";
import axios from "axios";

function QuickSearch() {
  let { meal_id } = useParams();
  let [locationList, setLocationList] = useState([]);
  let [restaurantList, setRestaurantList] = useState([]);
  let [filterData, setFilterData] = useState({
    mealtype: meal_id,
  });

  let getLocationList = async () => {
    let url = "http://localhost:5003/api/get-location-list";
    let { data } = await axios.get(url);
    setLocationList(data.location);
  };

  let filter = async () => {
    let url = "http://localhost:5003/api/filter";

    let { data } = await axios.post(url, filterData);
    setRestaurantList(data.restaurants);
  };

  let getFilterResult = (event, type) => {
    let value = event.target.value;
    let _filterData = { ...filterData };
    switch (type) {
      case "sort":
        // sort code
        _filterData["sort"] = value;
        break;
      case "costForTwo":
        value = value.split("-");
        _filterData["l_cost"] = Number(value[0]);
        _filterData["h_cost"] = Number(value[1]);
        break;

      default:
        break;
    }
    setFilterData(_filterData);
  };
  useEffect(() => {
    getLocationList();
  }, []); // mounting ==> only once

  useEffect(() => {
    filter();
  }, [filterData]); // updating ===> on state update every time

  return (
    <>
      <Header bg="bg-danger" />
      <div className="row">
        <div className="col-12 px-5 pt-4">
          <p className="h3">Breakfast Places In Mumbai</p>
        </div>
        {/* <!-- food item --> */}
        <div className="col-12 d-flex flex-wrap px-lg-5 px-md-5 pt-4">
          <FilterOption
            locationList={locationList}
            getFilterResult={getFilterResult}
          />
          <RestaurantList restaurantList={restaurantList} />
        </div>
      </div>
    </>
  );
}

export default QuickSearch;
/**
 * we click radio/check,select inputs
 * getFilterResult (event,type) get triggered
 * value of input is access
 * we create a local filter data variable , to avoid the issue if reference;
 * as per the switch operation filterData is update
 * useFilterData() is triggered to update the  filterData state
 * as soon as filterData updates a useEffect() having filterData dependance get call
 * in useEffect() we have filter method , it get call
 * and the filter API is trigger
 * and on response restaurant list is updated
 */
