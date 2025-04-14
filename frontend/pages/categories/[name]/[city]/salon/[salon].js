import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import AuthContext from "../../../../../context/AuthContext";
import Header from '../../../../../component/header.js';
import Footer from '../../../../../component/footer';

export default function SalonPage() {
  const router = useRouter();
  const { salon, name, city } = router.query;
  const { token } = useContext(AuthContext);

  const [salonData, setSalonData] = useState(null);
  const [error, setError] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    description: "",
  });
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (token === undefined) return;
      if (!token) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    }, 10);
    return () => clearTimeout(timeoutId);
  }, [token, router]);

  const fetchSalonData = async () => {
    if (salon && token) {
      try {
        const salonName = encodeURIComponent(salon);
        const response = await fetch(
          `http://localhost:3001/salon/${salonName}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Erreur lors de la récupération des données du salon");
        const data = await response.json();

        console.log("Données du salon reçues :", data); // pour debug
        setSalonData(data);
      } catch (error) {
        console.error("Erreur :", error);
        setError("Erreur lors du chargement des données du salon");
      }
    }
  };

  useEffect(() => {
    fetchSalonData();
  }, [salon, token]);

  const handleReservation = (serviceId) => {
    if (serviceId) {
      const url = `/categories/${encodeURIComponent(name)}/${encodeURIComponent(city)}/salon/${encodeURIComponent(salon)}/reservation/${encodeURIComponent(serviceId)}`;
      router.push(url);
    }
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) : value,
    }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError("");
    setReviewSuccess("");

    try {
      const response = await fetch(
        `http://localhost:3001/salon/${salonData.id_salon}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating: reviewForm.rating,
            description: reviewForm.description,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Échec de la soumission de l'avis");
      }

      setReviewSuccess("Avis soumis avec succès !");
      setReviewForm({
        rating: 5,
        description: "",
      });

      // Recharge les données pour afficher l'avis mis à jour sans doublon
      await fetchSalonData();

    } catch (error) {
      console.error("Erreur lors de la soumission de l'avis :", error);
      setReviewError(error.message);
    }
  };

  if (!salon || !token) return <p>Chargement...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!salonData) return <p>Chargement des données du salon...</p>;

  return (
    <>
      <Header />
      <div id="rdv">
        <h3>{salonData.name}</h3>
        <span><img src="/map-pin.svg" alt="" /><u>{salonData.adress} {salonData.city}</u></span>
        <span><img src="/star.svg" alt="" />{Number(salonData.moyenne_rating).toFixed(1)}</span>
        <img src={`../../../../${salonData.picture}`} alt={salonData.name} />

        <h3>Réserver en ligne pour un RDV chez {salonData.name}</h3>
        <span>24h24 - Confirmation immédiate</span>

        <article>
          <section>
            <h3>Choix de la prestation</h3>
            {salonData.services?.length === 0 ? (
              <p>Aucun service disponible pour ce salon.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {salonData.services?.map((service) => (
                  <li
                    key={`service-${service.id_service}`}
                    style={{
                      marginBottom: "10px",
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <strong>{service.description}</strong>: {service.price} € - {service.time} minutes
                    <button
                      onClick={() => handleReservation(service.id_service)}
                      style={{
                        marginLeft: "10px",
                        padding: "5px 10px",
                        cursor: "pointer",
                        background: "#0070f3",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                      }}
                    >
                      Réserver
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <div>
              <h4>Note globale</h4>
              <p id="note_glob">{Number(salonData.moyenne_rating).toFixed(1)}</p>
            </div>
            <div>
              <h4>Avis</h4>
              {salonData.reviews?.length === 0 ? (
                <p>Aucun avis disponible pour ce salon.</p>
              ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {salonData.reviews?.map((review) => (
                    <li
                      key={`review-${review.id_review}`}
                      style={{
                        marginBottom: "15px",
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <strong>{review.rating}/5</strong> - {review.description}
                      <p style={{ color: "#666", fontSize: "0.8em" }}>
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </article>

        <h3>À-propos</h3>
        <div>
          <p>{salonData.description}</p>
        </div>

        <div style={{ margin: "20px 0" }}>
          <h3>Ajouter un avis</h3>
          <form onSubmit={handleReviewSubmit}>
            <div style={{ marginBottom: "10px" }}>
              <label>
                Note (1-5) :
                <select
                  name="rating"
                  value={reviewForm.rating}
                  onChange={handleReviewChange}
                  style={{ marginLeft: "10px" }}
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={`rating-${num}`} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <textarea
                name="description"
                value={reviewForm.description}
                onChange={handleReviewChange}
                placeholder="Votre avis..."
                style={{ width: "100%", minHeight: "100px", padding: "8px" }}
                required
              />
            </div>
            {reviewError && <p style={{ color: "red" }}>{reviewError}</p>}
            {reviewSuccess && <p style={{ color: "green" }}>{reviewSuccess}</p>}
            <button
              type="submit"
              style={{
                padding: "8px 16px",
                background: "#0070f3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Soumettre l'avis
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
