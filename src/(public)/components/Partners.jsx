import React from "react";
import { CardCarousel } from "@/components/ui/card-carousel";
import { S3_BASE_URL } from "@/constants";
import { useGetPartnersQuery } from "@/slices/partnerApiSlice";
import Spinner from "@/components/ui/Spinner";

const Partners = () => {
  const { data: partnersData, isLoading, isError, error } = useGetPartnersQuery();

  const partners = partnersData?.data || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-24 text-red-600">
        <p className="text-lg font-medium">
          Error loading partners: {error?.data?.message || "Please try again later"}
        </p>
      </div>
    );
  }

  const activePartners = partners.filter((partner) => partner.status === "active");

  if (activePartners.length === 0) {
    return (
      <div className="text-center py-24 text-gray-500">
        <p className="text-lg font-medium">No active partners available.</p>
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
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 md:text-5xl">
            Our Trusted Partners
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto md:text-xl">
            We collaborate with industry leaders and innovative companies to deliver exceptional
            services.
          </p>
        </div>

        {/* Carousel */}
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
