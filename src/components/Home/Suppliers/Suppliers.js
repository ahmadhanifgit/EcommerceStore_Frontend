import "../../../styles/Suppliers.css";

const suppliers = [
  { country: "United Arab Emirates", code: "🇦🇪" },
  { country: "Australia", code: "🇦🇺" },
  { country: "United States", code: "🇺🇸" },
  { country: "Russia", code: "🇷🇺" },
  { country: "Italy", code: "🇮🇹" },
  { country: "Denmark", code: "🇩🇰" },
  { country: "France", code: "🇫🇷" },
  { country: "China", code: "🇨🇳" },
  { country: "United Kingdom", code: "🇬🇧" },
  { country: "Pakistan", code: "🇵🇰" }
];

function Suppliers() {
  return (
    <section className="suppliers">

      <h2>Suppliers by Region</h2>

      <div className="supplier-grid">

        {suppliers.map((supplier, index) => (

          <div
            className="supplier-item"
            key={index}
          >

            <span className="flag">
              {supplier.code}
            </span>

            <span>
              {supplier.country}
            </span>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Suppliers;