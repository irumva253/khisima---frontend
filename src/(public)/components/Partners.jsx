import React from "react";
import { CardCarousel } from "@/components/ui/card-carousel";
import { S3_BASE_URL } from "@/constants";
import { useGetPartnersQuery } from "@/slices/partnerApiSlice";
import Spinner from "@/components/ui/Spinner";
import { Link } from 'react-router-dom';

// Debug component
const DebugPartners = ({ data, error, url }) => {
  return (
    <div className="fixed bottom-0 right-0 bg-black text-white p-4 max-w-md max-h-64 overflow-auto z-50 text-xs">
      <h3 className="font-bold mb-2">API Debug Information:</h3>
      <div className="mb-2">
        <span className="font-semibold">API URL: </span>
        {url}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Status: </span>
        {error ? `Error - ${error.status}` : data ? 'Success' : 'No data'}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Error Type: </span>
        {error?.error || 'None'}
      </div>
      <pre className="whitespace-pre-wrap break-words mt-2">
        {error ? JSON.stringify(error, null, 2) : data ? JSON.stringify(data, null, 2) : 'No data received'}
      </pre>
    </div>
  );
};

const Partners = () => {
  const { data: partnersData, isLoading, isError, error } = useGetPartnersQuery();
  
  // Set this to false to disable debug mode after fixing
  const SHOW_DEBUG = true;
  
  // API URL for debugging - you might need to adjust this based on your API_ENDPOINTS
  const API_URL = "https://khisima-backend.onrender.com/api/partners";

  // Enhanced error logging
  React.useEffect(() => {
    if (isError) {
      console.error("Partners API Error Details:", error);
      console.log("Attempted to fetch from:", API_URL);
      
      // Test the API endpoint directly
      if (SHOW_DEBUG) {
        fetch(API_URL)
          .then(response => {
            console.log("Direct fetch response status:", response.status);
            return response.json();
          })
          .then(data => console.log("Direct fetch data:", data))
          .catch(err => console.error("Direct fetch error:", err));
      }
    }
  }, [isError, error, API_URL]);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="lg" />
        {SHOW_DEBUG && <p className="ml-4">Loading partners from {API_URL}</p>}
      </div>
    );
  }

  // Handle error state with more detailed information
  if (isError) {
    return (
      <>
        <div className="text-center py-24 text-red-600">
          <p className="text-lg font-medium">
            Error loading partners
          </p>
          <p className="text-sm mt-2">
            Failed to connect to the server. This might be a temporary issue.
          </p>
          <div className="mt-4 text-xs bg-red-100 p-3 rounded max-w-md mx-auto">
            <p className="font-semibold">Technical Details:</p>
            <p>Error: {error?.error || "Failed to fetch"}</p>
            <p>URL: {API_URL}</p>
          </div>
          <div className="mt-6 space-x-4">
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Try Again
            </button>
            <Link to="/contact" className="text-blue-600 hover:underline inline-block mt-2">
              Contact support
            </Link>
          </div>
        </div>
        {SHOW_DEBUG && (
          <DebugPartners data={partnersData} error={error} url={API_URL} />
        )}
      </>
    );
  }

  // Ensure partners is always an array
  const partners = Array.isArray(partnersData) ? partnersData : [];

  const activePartners = partners.filter((partner) => partner.status === "active");

  if (activePartners.length === 0) {
    return (
      <>
        <div className="text-center py-24 text-gray-500">
          <p className="text-lg font-medium">No active partners available.</p>
          <Link to="/contact" className="text-blue-600 hover:underline">
            Become a partner
          </Link>
        </div>
        {SHOW_DEBUG && (
          <DebugPartners data={partnersData} error={error} url={API_URL} />
        )}
      </>
    );
  }

  const carouselItems = activePartners.map((partner) => ({
    id: partner._id,
    title: partner.title,
    image: `${S3_BASE_URL}/${partner.fileKey}`,
    content: (
      <div className="text-center p-4">
        <h3 className="font-semibold text-lg mb-2 text-gray-800">{partner.title}</h3>
        <p className="text-gray-600 text-sm">Our trusted partner</p>
      </div>
    ),
  }));

  return (
    <>
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 md:text-5xl">
              Our Trusted Partners
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto md:text-xl">
              We collaborate with industry leaders and innovative companies to deliver exceptional
              services.
            </p>
          </div>

          <CardCarousel
            items={carouselItems}
            autoSlide={true}
            autoSlideInterval={5000}
            showArrows={true}
            showDots={true}
            className="max-w-6xl mx-auto"
          />
        </div>
      </section>
      
      {SHOW_DEBUG && (
        <DebugPartners data={partnersData} error={error} url={API_URL} />
      )}
    </>
  );
};

export default Partners;