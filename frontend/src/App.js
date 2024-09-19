import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [media, setMedia] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [reservation, setReservation] = useState({
    reservationTime: '',
    numberOfGuests: 1,
  });
  // Fetch all restaurants
  const fetchRestaurants = async () => {
    try {
      const response = await axios.get("http://localhost:1337/api/restaurants?populate=*");
      setRestaurants(response.data.data);
      setFilteredRestaurants(response.data.data); // Start with all restaurants
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  // Fetch details for a specific restaurant by ID
  const fetchRestaurantDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:1337/api/restaurants/${id}?populate=reviews,media`);
      setSelectedRestaurant(response.data.data);

      // Only reviews for the selected restaurant
      setReviews(response.data.data.attributes.reviews.data);

      // Media for the selected restaurant
      setMedia(response.data.data.attributes.media.data);
    } catch (error) {
      console.error("Error fetching restaurant details:", error);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleReservation = async (restaurantId) => {
    try {
      await axios.post('http://localhost:1337/api/reservations', {
        restaurant: restaurantId,
        reservationTime: reservation.reservationTime,
        numberOfGuests: reservation.numberOfGuests,
      });
      alert('Reservation confirmed!');
    } catch (error) {
      console.error('Error making reservation:', error);
    }
  };
  // Search filter
  const handleSearch = (e) => {
    e.preventDefault();
    const searchTerm = e.target.search.value.toLowerCase();

    // Filter restaurants based on name
    setFilteredRestaurants(
      restaurants.filter((restaurant) =>
        restaurant.attributes.Name.toLowerCase().includes(searchTerm)
      )
    );
  };

  return (
    <div className="container mt-4">
      
      <h1 className="text-center mb-4">Restaurants App</h1>

      {/* Search form */}
      <form className="form-inline my-2 my-lg-0 mb-4 d-flex" onSubmit={handleSearch}>
        <input
          className="form-control mr-2"
          type="search"
          name="search"
          placeholder="Search restaurants..."
          aria-label="Search"
        />
        <button className="btn btn-primary" type="submit">Search</button>
      </form>

      {/* Restaurant list */}
      <ul className="list-group mb-4">
        {filteredRestaurants.map((restaurant) => (
          <li
            key={restaurant.id}
            className="list-group-item"
            onClick={() => fetchRestaurantDetails(restaurant.id)}
          >
            {restaurant.attributes.Name} - <span className="text-info">Click to view details</span>
          </li>
        ))}
      </ul>

      {/* Restaurant details */}
      {selectedRestaurant && (
              <div className="card mb-4">
                <div className="card-body">
                  <h2 className="card-title">{selectedRestaurant.attributes.Name}</h2>
                  <p className="card-text">{selectedRestaurant.attributes.Description[0]?.children[0]?.text || 'No description'}</p>

                  {/* Reviews */}
                  <h3>Reviews</h3>
                  {reviews.length > 0 ? (
                    <ul className="list-group">
                      {reviews.map((review) => (
                        <li className="list-group-item" key={review.id}>
                          <strong>{review.attributes.rating}/5</strong> - {review.attributes.comment}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No reviews yet</p>
                  )}

                  {/* Reservation Form */}
                  <div className="mt-4">
                    <h3>Make a Reservation</h3>
                    <input
                      type="datetime-local"
                      className="form-control mb-2"
                      value={reservation.reservationTime}
                      onChange={(e) =>
                        setReservation({ ...reservation, reservationTime: e.target.value })
                      }
                    />
                    <input
                      type="number"
                      className="form-control mb-2"
                      min="1"
                      value={reservation.numberOfGuests}
                      onChange={(e) =>
                        setReservation({ ...reservation, numberOfGuests: e.target.value })
                      }
                    />
                    <button
                      className="btn btn-success"
                      onClick={() => handleReservation(selectedRestaurant.id)}
                    >
                      Book Reservation
                    </button>
                  </div>
                </div>
              </div>
            )}

      {/* Newsletter subscription */}
      <div className="mt-4">
        <h3>Subscribe to our Newsletter</h3>
        <form>
          <div className="input-group mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Your email"
              aria-label="Your email"
            />
            <div className="input-group-append">
              <button className="btn btn-primary" type="submit">Subscribe</button>
            </div>
          </div>
        </form>
      </div>

      {/* Media Gallery */}
      <h3>Media Gallery</h3>
<div id="carouselExampleControls" className="carousel slide mb-5" data-bs-ride="carousel">
  <div className="carousel-inner">
    {['437387549_959784502819722_6522820373690717676_n_f34dabcb53.jpg', 'DSC_03605_kopia_0377218c58.jpg', 'download_b27289bc9d.jpg', 'restauracja_06354cf27a.jpg', 'Frame_50759_p_800_f48fd185dc.avif', 'b52c5f288f557ff68b40e2201143af9e_5ff6b85695.jpg'].map((image, index) => (
      <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
        <img
          src={`http://localhost:1337/uploads/${image}`}
          alt={`Media ${index + 1}`}
          className="d-block w-100"
          style={{ height: '500px', objectFit: 'cover' }}
        />
      </div>
    ))}
  </div>
  <button className="carousel-control-prev" type="button" href="#carouselExampleControls" data-bs-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Previous</span>
  </button>
  <button className="carousel-control-next" type="button" href="#carouselExampleControls" data-bs-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Next</span>
  </button>
</div>

    </div>
  );
};

export default App;
