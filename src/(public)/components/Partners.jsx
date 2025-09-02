import React from "react";
import { CardCarousel } from "@/components/ui/card-carousel";
import { S3_BASE_URL } from "@/constants";
import Spinner from "@/components/ui/Spinner";
import { Link } from 'react-router-dom';

const Partners = () => {
  const [partners, setPartners] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://khisima-backend.onrender.com/api/partners');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setPartners(data.data || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch partners:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  // Handle loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="text-center py-24 text-red-600">
        <p className="text-lg font-medium">
          Error loading partners
        </p>
        <p className="text-sm mt-2">
          {error || "Please try again later"}
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
        >
          Try Again
        </button>
      </div>
    );
  }

  const activePartners = partners.filter((partner) => partner.status === "active");

  if (activePartners.length === 0) {
    return (
      <div className="text-center py-24 text-gray-500">
        <p className="text-lg font-medium">No active partners available.</p>
        <Link to="/contact" className="text-blue-600 hover:underline">
          Become a partner
        </Link>
      </div>
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
  );
};

export default Partners;