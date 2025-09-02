import React from "react";
import { CardCarousel } from "@/components/ui/card-carousel";
import { S3_BASE_URL } from "@/constants";
import { useGetPartnersQuery } from "@/slices/partnerApiSlice";
import Spinner from "@/components/ui/Spinner";
import { Link } from 'react-router-dom';
import.meta.env.MODE


// Temporary debug component - remove after debugging
const DebugPartners = ({ data, error }) => {
  return (
    <div className="fixed bottom-0 right-0 bg-black text-white p-4 max-w-md max-h-64 overflow-auto z-50 text-xs">
      <h3 className="font-bold mb-2">API Response Debug:</h3>
      <div className="mb-2">
        <span className="font-semibold">Status: </span>
        {error ? `Error - ${error.status}` : 'Success'}
      </div>
      <pre className="whitespace-pre-wrap break-words">
        {error ? JSON.stringify(error, null, 2) : JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

const Partners = () => {
  const { data: partnersData, isLoading, isError, error } = useGetPartnersQuery();

  // Enhanced error logging
  if (isError) {
    console.error("Partners API Error:", error);
  }

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="lg" />
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
            {error?.data?.message || error?.error || "Please try again later"}
          </p>
          <Link to="/contact" className="text-blue-600 hover:underline mt-4 inline-block">
            Contact support
          </Link>
        </div>
        {import.meta.env.MODE === 'development' && (
          <DebugPartners data={partnersData} error={error} />
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
        {import.meta.env.MODE === 'development' && (
          <DebugPartners data={partnersData} error={error} />
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

      {import.meta.env.MODE === 'development' && (
        <DebugPartners data={partnersData} error={error} />
      )}
    </>
  );
};

export default Partners;