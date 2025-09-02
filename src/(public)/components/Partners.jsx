import React from "react";
import { CardCarousel } from "@/components/ui/card-carousel";
import { S3_BASE_URL } from "@/constants";
import { useGetPartnersQuery } from "@/slices/partnerApiSlice";
import Spinner from "@/components/ui/Spinner";
import { Link } from 'react-router-dom';

// Debug component
const DebugPartners = ({ data, error, url, response }) => {
  return (
    <div className="fixed bottom-0 right-0 bg-black text-white p-4 max-w-md max-h-64 overflow-auto z-50 text-xs">
      <h3 className="font-bold mb-2">API Debug Information:</h3>
      <div className="mb-2">
        <span className="font-semibold">API URL: </span>
        {url}
      </div>
      <div className="mb-2">
        <span className="font-semibold">RTK Query Status: </span>
        {error ? `Error` : data ? 'Success' : 'No data'}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Error Type: </span>
        {error?.error || 'None'}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Direct Response: </span>
        <pre className="whitespace-pre-wrap break-words mt-1">
          {response ? JSON.stringify(response, null, 2) : 'No direct response'}
        </pre>
      </div>
      <div className="mt-4">
        <span className="font-semibold">RTK Query Data: </span>
        <pre className="whitespace-pre-wrap break-words mt-1">
          {data ? JSON.stringify(data, null, 2) : 'No data from RTK Query'}
        </pre>
      </div>
      {error && (
        <div className="mt-4">
          <span className="font-semibold">RTK Query Error: </span>
          <pre className="whitespace-pre-wrap break-words mt-1">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

const Partners = () => {
  const { data: partnersData, isLoading, isError, error } = useGetPartnersQuery();
  
  // Debug state
  const [debugInfo, setDebugInfo] = React.useState({
    directResponse: null,
    directError: null,
    corsTest: null
  });
  
  const SHOW_DEBUG = true;
  const API_URL = "https://khisima-backend.onrender.com/api/partners";

  // Test the API directly on component mount
  React.useEffect(() => {
    if (SHOW_DEBUG) {
      // Test CORS with a simple fetch
      fetch(API_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors'
      })
      .then(async response => {
        const data = await response.json();
        setDebugInfo(prev => ({
          ...prev,
          directResponse: {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries([...response.headers]),
            data
          }
        }));
        console.log("Direct fetch success:", response.status, data);
      })
      .catch(err => {
        setDebugInfo(prev => ({...prev, directError: err.message}));
        console.error("Direct fetch error:", err);
      });

      // Test CORS preflight
      fetch(API_URL, {
        method: 'OPTIONS',
        mode: 'cors'
      })
      .then(response => {
        setDebugInfo(prev => ({
          ...prev,
          corsTest: {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries([...response.headers])
          }
        }));
        console.log("CORS preflight test:", response.status);
      })
      .catch(err => {
        console.error("CORS test error:", err);
      });
    }
  }, [API_URL, SHOW_DEBUG]);

  // Enhanced error logging
  React.useEffect(() => {
    if (isError) {
      console.error("RTK Query Error Details:", error);
      console.log("RTK Query attempted to fetch from:", API_URL);
    }
    if (partnersData) {
      console.log("RTK Query Success Data:", partnersData);
    }
  }, [isError, error, API_URL, partnersData]);

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
            <p>Status: {error?.status || "Unknown"}</p>
            <p>URL: {API_URL}</p>
            {debugInfo.directResponse && (
              <p>Direct test: Success ({debugInfo.directResponse.status})</p>
            )}
            {debugInfo.directError && (
              <p>Direct test error: {debugInfo.directError}</p>
            )}
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
          <DebugPartners 
            data={partnersData} 
            error={error} 
            url={API_URL}
            response={debugInfo.directResponse}
          />
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
          <DebugPartners 
            data={partnersData} 
            error={error} 
            url={API_URL}
            response={debugInfo.directResponse}
          />
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
        <DebugPartners 
          data={partnersData} 
          error={error} 
          url={API_URL}
          response={debugInfo.directResponse}
        />
      )}
    </>
  );
};

export default Partners;