import { useNavigate } from "react-router-dom";

function RestaurantList(props) {
  let { restaurantList } = props;
  let navigate = useNavigate();
  return (
    <>
      {/* <!-- search result --> */}
      <div className="col-12 col-lg-8 col-md-7">
        {restaurantList.map((restaurant, index) => {
          return (
            <div
              onClick={() => navigate("/restaurant/" + restaurant._id)}
              key={index}
              className="col-12 food-shadow p-4 mb-4"
            >
              <div className="d-flex align-items-center">
                <img
                  src={"/images/" + restaurant.image}
                  className="food-item"
                />
                <div className="ms-5">
                  <p className="h4 fw-bold">{restaurant.name}</p>
                  <span className="fw-bold text-muted">FORT</span>
                  <p className="m-0 text-muted">
                    <i
                      className="fa fa-map-marker fa-2x text-danger"
                      aria-hidden="true"
                    ></i>
                    {restaurant.locality}, {restaurant.city}
                  </p>
                </div>
              </div>
              <hr />
              <div className="d-flex">
                <div>
                  <p className="m-0">CUISINES:</p>
                  <p className="m-0">COST FOR TWO:</p>
                </div>
                <div className="ms-5">
                  <p className="m-0 fw-bold">
                    {restaurant.cuisine.reduce((pValue, cValue) => {
                      let value;
                      if (pValue == "") {
                        value = cValue.name;
                      } else {
                        value = pValue + ", " + cValue.name;
                      }
                      return value;
                    }, "")}
                  </p>
                  <p className="m-0 fw-bold">
                    <i className="fa fa-inr" aria-hidden="true"></i>
                    {restaurant.min_price}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div className="col-12 pagination d-flex justify-content-center">
          <ul className="pages">
            <li>&lt;</li>
            <li className="active">1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
            <li>&gt;</li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default RestaurantList;
