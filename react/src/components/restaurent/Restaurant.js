import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import axios from "axios";
import Header from "../common/Header";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

function Restaurant() {
  let getUserLoginData = () => {
    // read data from local storage
    let token = localStorage.getItem("batch64token");
    if (token == null) {
      return false;
    } else {
      // decode a jwt token =>
      try {
        let result = jwtDecode(token);
        return result;
      } catch (error) {
        // remove a token from localStorage
        localStorage.removeItem("batch64token");
        return false;
      }
    }
  };
  let [user, setUser] = useState(getUserLoginData());

  let { id } = useParams();

  let initRestaurant = {
    aggregate_rating: "",
    city: "",
    city_id: 0,
    contact_number: "",
    cuisine: [],
    cuisine_id: [],
    image: "retaurent-background.png",
    locality: "",
    location_id: 0,
    mealtype_id: 0,
    min_price: 0,
    name: "",
    rating_text: "",
    thumb: [],
    _id: "",
  };

  let [restDetailsToggle, setRestDetailsToggle] = useState(true);
  let [menuList, setMenuList] = useState([]);
  let [rDetails, setRDetails] = useState({ ...initRestaurant });
  let [totalPrice, setTotalPrice] = useState(0);

  let getRestaurantDetails = async () => {
    let url = "http://localhost:5003/api/get-restaurant-details-by-id/" + id;
    let { data } = await axios.get(url);
    if (data.status === true) {
      setRDetails({ ...data.restaurants });
    } else {
      setRDetails({ ...data.initRestaurant });
    }
  };

  let getMenuItems = async () => {
    let url = `http://localhost:5003/api/get-menu-items/${id}`;
    let { data } = await axios.get(url);
    console.log(data);
    if (data.status === true) {
      setMenuList([...data.menu_items]);
    } else {
      setMenuList([]);
    }
    setTotalPrice(0);
  };

  let addItem = (index) => {
    let _menuList = [...menuList]; // re-create array
    _menuList[index].qty += 1;
    setMenuList(_menuList);

    let newTotal = totalPrice + _menuList[index].price;
    setTotalPrice(newTotal);
  };

  let removeItem = (index) => {
    let _menuList = [...menuList];
    _menuList[index].qty -= 1;
    setMenuList(_menuList);

    let newTotal = totalPrice - _menuList[index].price;
    setTotalPrice(newTotal);
  };

  let makePayment = async () => {
    let userOrder = menuList.filter((menu) => menu.qty > 0);

    let url = "http://localhost:5003/api/gen-order-id";
    let { data } = await axios.post(url, { amount: totalPrice });

    if (data.status === false) {
      alert("Unable to gen order id");
      return false;
    }
    let { order } = data;

    var options = {
      key: "rzp_test_aoluE0wTrix8in", // Enter the Key ID generated from the Dashboard
      amount: order.amount, // rupee to paisa
      currency: order.currency,
      name: "Zomato Order",
      description: "Make payment for your orders",
      image:
        "https://www.freelogovectors.net/wp-content/uploads/2016/12/zomato-logo-785x785.png",
      order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      handler: async function (response) {
        var verifyData = {
          payment_id: response.razorpay_payment_id,
          order_id: response.razorpay_order_id,
          signature: response.razorpay_signature,
          name: user.name,
          mobile: 9999999999,
          email: user.email,
          order_list: userOrder,
          totalAmount: totalPrice,
        };
        let { data } = await axios.post(
          "http://localhost:5003/api/verify-payment",
          verifyData
        );
        if (data.status === true) {
          alert("payment completed successfully");
          window.location.assign("/");
        } else {
          alert("payment fails");
        }
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: "9999999999",
      },
    };

    var rzp1 = window.Razorpay(options);
    rzp1.open();
  };

  useEffect(() => {
    getRestaurantDetails();
  }, []); // once i.e on component load

  return (
    <>
      <div
        className="modal fade"
        id="modalUserDetails"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel2"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalToggleLabel2">
                name
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="Enter full Name"
                  value={user.name}
                  onChange={() => {}}
                  disabled
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="name@example.com"
                  value={user.email}
                  onChange={() => {}}
                  disabled
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlTextarea1"
                  className="form-label"
                >
                  Address
                </label>
                <textarea
                  className="form-control"
                  id="exampleFormControlTextarea1"
                  rows="3"
                  value="Nashik"
                  onChange={() => {}}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-danger"
                data-bs-target="#modalMenuList"
                data-bs-toggle="modal"
              >
                Back
              </button>
              <button className="btn btn-success" onClick={makePayment}>
                Pay Now
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="modalMenuList"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalToggleLabel">
                {rDetails.name}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body ">
              {menuList.map((menu, index) => {
                return (
                  <div className="row p-2" key={menu._id}>
                    <div className="col-8">
                      <p className="mb-1 h6">{menu.name}</p>
                      <p className="mb-1">{menu.price}</p>
                      <p className="small text-muted">{menu.description}</p>
                    </div>
                    <div className="col-4 d-flex justify-content-end">
                      <div className="menu-food-item">
                        <img src={"/images/" + menu.image} alt="" />

                        {menu.qty === 0 ? (
                          <button
                            className="btn btn-primary btn-sm add"
                            onClick={() => addItem(index)}
                          >
                            Add
                          </button>
                        ) : (
                          <div className="order-item-count section ">
                            <span
                              className="hand"
                              onClick={() => removeItem(index)}
                            >
                              -
                            </span>
                            <span>{menu.qty}</span>
                            <span
                              className="hand"
                              onClick={() => addItem(index)}
                            >
                              +
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <hr className=" p-0 my-2" />
                  </div>
                );
              })}

              {/* <div className="row p-2">
                <div className="col-8">
                  <p className="mb-1 h6">Gobi Manchurian</p>
                  <p className="mb-1">89</p>
                  <p className="small text-muted">
                    Deep-fried cauliflower florets tossed in pungent spices to
                    form a flavorsome dry curry
                  </p>
                </div>
                <div className="col-4 d-flex justify-content-end">
                  <div className="menu-food-item">
                    <img src="/images/" alt="" />

                    <div className="order-item-count section ">
                      <span className="hand">-</span>
                      <span>0</span>
                      <span className="hand">+</span>
                    </div>
                  </div>
                </div>
                <hr className=" p-0 my-2" />
              </div> */}

              <div className="d-flex justify-content-between">
                <h3>Total {totalPrice}</h3>
                <button
                  className="btn btn-danger"
                  data-bs-target="#modalUserDetails"
                  data-bs-toggle="modal"
                >
                  Process
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="modalGallery"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg " style={{ height: "75vh" }}>
          <div className="modal-content">
            <div className="modal-body h-75">
              <Carousel showThumbs={false} infiniteLoop={true}>
                {rDetails.thumb.map((value, index) => {
                  return (
                    <div key={index} className="w-100">
                      <img src={"/images/" + value}  alt=""/>
                    </div>
                  );
                })}
              </Carousel>
            </div>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <Header bg="bg-danger" />
      </div>

      <div className="row justify-content-center">
        <div className="col-10">
          <div className="row">
            <div className="col-12 mt-5">
              <div className="restaurant-main-image position-relative">
                <img src={"/images/" + rDetails.image} alt="" className="" />
                <button
                  className="btn btn-outline-light position-absolute btn-gallery"
                  data-bs-toggle="modal"
                  data-bs-target="#modalGallery"
                >
                  Click To Get Image Gallery
                </button>
              </div>
            </div>
            <div className="col-12">
              <h3 className="mt-4">{rDetails.name}</h3>
              <div className="d-flex justify-content-between">
                <ul className="list-unstyled d-flex gap-3">
                  <li
                    onClick={() => setRestDetailsToggle(true)}
                    className="fw-bold"
                  >
                    Overview
                  </li>
                  <li
                    onClick={() => setRestDetailsToggle(false)}
                    className="fw-bold"
                  >
                    Contact
                  </li>
                </ul>
                {user === false ? (
                  <button disabled className="btn btn-danger align-self-start">
                    Login to place order
                  </button>
                ) : (
                  <a
                    className="btn btn-danger align-self-start"
                    data-bs-toggle="modal"
                    href="#modalMenuList"
                    role="button"
                    onClick={getMenuItems}
                  >
                    Show Menu List
                  </a>
                )}
              </div>
              <hr className="mt-0" />

              {restDetailsToggle === true ? (
                <div className="over-view">
                  <p className="h5 mb-4">About this place</p>

                  <p className="mb-0 fw-bold">Cuisine</p>
                  <p>
                    {rDetails.cuisine.reduce((pValue, cValue) => {
                      let value = "";
                      if (pValue === "") {
                        value = cValue.name;
                      } else {
                        value = `${pValue}, ${cValue.name}`;
                      }
                      return value;
                    }, "")}
                  </p>

                  <p className="mb-0 fw-bold">Average Cost</p>
                  <p>₹ {rDetails.min_price} for two people (approx.)</p>
                </div>
              ) : (
                <div className="over-view">
                  <p className="mb-0 fw-bold">Phone Number</p>
                  <p>+{rDetails.contact_number}</p>

                  <p className="mb-0 fw-bold">Address</p>
                  <p>
                    {rDetails.locality}, {rDetails.city}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Restaurant;
