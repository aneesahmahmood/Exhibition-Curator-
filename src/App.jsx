import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Filters from "./components/Filters";

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(1); 

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };
  return (
    <Router>
      <div className="min-h-screen">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center max-w-3xl mx-auto px-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                Discover World-Class Art
              </h1>
              <p className="text-base sm:text-lg text-gray-600">
                Explore artworks from multiple renowned collections worldwide
              </p>
            </div>

            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Filters />
                  
                    <div className="flex justify-center space-x-4 pt-6 sm:pt-8">
                      <button
                        className="btn-secondary"
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                      <button
                        className="btn-primary"
                        onClick={handleNext}
                        disabled={currentPage >= totalPages}
                      >
                        Next
                      </button>
                    </div>
                  </>
                }
              />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
