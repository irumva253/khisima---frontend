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

  // Fetch category
  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
    error: categoryError,
  } = useGetServiceCategoryQuery(id);

  // Fetch services
  const {
    data: servicesData,
    isLoading: isServicesLoading,
    isError: isServicesError,
    error: servicesError,
  } = useGetServicesByCategoryQuery(id);

  // Hardcoded recent updates
  const recentUpdates = [
    { title: "New service added: Express Translation", date: "2 days ago" },
    { title: "Updated pricing for Premium Interpretation", date: "5 days ago" },
    { title: "Special offer: 10% off on Legal Interpretation", date: "1 week ago" },
    { title: "Service maintenance scheduled for next week", date: "2 weeks ago" },
  ];

  // Loading state
  if (isCategoryLoading || isServicesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spinner size="xl" />
          <p className="mt-4 text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  // Error state for category
  if (isCategoryError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full">
          <ErrorMessage
            title="Category Error"
            message={
              categoryError?.data?.message || "Failed to load category details"
            }
            actionText="Try Again"
            actionLink={`/services/${id}`}
          />
        </div>
      </div>
    );
  }

  // Category not found
  if (!categoryData?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full">
          <ErrorMessage
            title="Category Not Found"
            message="The service category you're looking for doesn't exist or may have been removed."
            actionText="Browse All Services"
            actionLink="/services"
          />
        </div>
      </div>
    );
  }

  const category = categoryData.data;
  const services = servicesData?.data || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 mt-5 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <Link to="/services" className="hover:text-blue-600 transition-colors">Services</Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">{category.title}</span>
            </li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content - 70% on large screens */}
          <div className="lg:w-[70%]">
            {/* Category Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="flex-shrink-0">
                  {category.iconSvg ? (
                    <div
                      className="w-24 h-24 bg-blue-50 rounded-full shadow-sm flex items-center justify-center p-4 text-blue-600"
                      dangerouslySetInnerHTML={{ __html: category.iconSvg }}
                    />
                  ) : (
                    <div className="w-24 h-24 bg-blue-100 rounded-full shadow-sm flex items-center justify-center text-blue-600 text-4xl font-bold">
                      {category?.title?.charAt(0) || "?"}
                    </div>
                  )}
                </div>

                <div className="text-center md:text-left">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {category.title || "Untitled Category"}
                  </h1>

                  {/* Category description */}
                  <div className="text-gray-600">
                    <RenderDescription json={category.description} />
                  </div>
                </div>
              </div>
            </div>

            {/* Services List */}
            {isServicesError ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load services</h3>
                <p className="text-gray-500 mb-4">
                  {servicesError?.data?.message ||
                    "Failed to load services for this category"}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Try Again
                </button>
              </div>
            ) : services.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No services available</h3>
                <p className="text-gray-500 mb-4">
                  There are no services available in this category yet.
                </p>
                <Link
                  to="/services"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium inline-block"
                >
                  Browse All Services
                </Link>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Services in this Category</h2>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {services.length} {services.length === 1 ? 'service' : 'services'}
                  </span>
                </div>
                
                <div className="space-y-6">
                  {services.map((service) => (
                    <div
                      key={service._id}
                      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100"
                    >
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              {service.name}
                            </h3>
                            
                            {service.description ? (
                              <div className="text-gray-600">
                                <RenderDescription json={service.description} />
                              </div>
                            ) : (
                              <p className="text-gray-400 italic">
                                No description available.
                              </p>
                            )}
                          </div>
                          
                          <div className="flex flex-col items-end gap-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                              {service.price ? `$${service.price.toFixed(2)}` : "Get Quote"}
                            </span>
                            <div className="flex items-center text-sm text-gray-500">
                              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Delivery in 24h</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-4 border-t border-gray-100">
                          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors text-center">
                            Select Service
                          </button>
                          <button className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors text-center">
                            Contact for Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recent Updates Sidebar - 30% on large screens */}
          <div className="lg:w-[30%]">
            <div className="sticky top-6">
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Recent Updates
                </h2>
                <ul className="space-y-4">
                  {recentUpdates.map((update, index) => (
                    <li
                      key={index}
                      className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100"
                    >
                      <p className="text-sm font-medium text-gray-900">{update.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{update.date}</p>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-sm p-6 text-white">
                <h3 className="text-lg font-bold mb-2">Need help choosing?</h3>
                <p className="text-blue-100 text-sm mb-4">Our experts can help you select the right service for your needs</p>
                <button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-lg transition-colors">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePageScreen;