import { useParams, Link } from "react-router-dom";
import {
  useGetServiceCategoryQuery,
  useGetServicesByCategoryQuery,
} from "@/slices/serviceApiSlice";
import Spinner from "@/components/ui/Spinner";
import { RenderDescription } from "@/components/rich-text-editor/RenderDescription";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

const ServicePageScreen = () => {
  const { id } = useParams();

  // Fetch single category
  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
    error: categoryError,
  } = useGetServiceCategoryQuery(id);

  // Fetch services for this category
  const {
    data: servicesData,
    isLoading: isServicesLoading,
    isError: isServicesError,
    error: servicesError,
  } = useGetServicesByCategoryQuery(id);

  // Loading state
  if (isCategoryLoading || isServicesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  // Error state for category
  if (isCategoryError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage
          title="Category Error"
          message={
            categoryError?.data?.message || "Failed to load category details"
          }
          actionText="Try Again"
          actionLink={`/services/${id}`}
        />
      </div>
    );
  }

  // Category not found
  if (!categoryData?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage
          title="Category Not Found"
          message="The service category you're looking for doesn't exist or may have been removed."
          actionText="Browse All Services"
          actionLink="/services"
        />
      </div>
    );
  }

  // Now safe to parse JSON
  const category = categoryData.data;
  const parsedJson = JSON.parse(category.description || "{}");
  const services = servicesData?.data || [];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Category Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            {category.iconSvg ? (
              <div
                className="w-20 h-20 bg-white rounded-full shadow-md flex items-center justify-center p-4"
                dangerouslySetInnerHTML={{ __html: category.iconSvg }}
              />
            ) : (
              <div className="w-20 h-20 bg-blue-100 rounded-full shadow-md flex items-center justify-center text-blue-500 text-3xl">
                {category?.title?.charAt(0) || "?"}
              </div>
            )}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {category.title || "Untitled Category"}
          </h1>

          <RenderDescription json={parsedJson} />
        </div>

        {/* Services List */}
        {isServicesError ? (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <p className="text-red-500">
              {servicesError?.data?.message ||
                "Failed to load services for this category"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : services.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <p className="text-gray-500">
              No services available in this category yet.
            </p>
            <Link
              to="/services"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse All Services
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 font-medium">
                      {service.price
                        ? `$${service.price.toFixed(2)}`
                        : "Get Quote"}
                    </span>
                    <Link
                      to={`/services/${category._id}/${service._id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicePageScreen;
