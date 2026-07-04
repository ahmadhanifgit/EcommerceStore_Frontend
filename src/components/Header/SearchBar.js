import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function SearchBar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedQuery = query.trim();

    if (trimmedQuery) {
      navigate(`/listings?q=${encodeURIComponent(trimmedQuery)}`);
    } else {
      navigate("/listings");
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <button type="submit">Search</button>
    </form>
  );
}

export default SearchBar;