import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Star,
  Phone,
  Mail,
  Clock,
  Globe,
  Users,
  Building,
  ArrowLeft,
  Calendar,
  Video
} from 'lucide-react';
import { RenderDescription } from '@/components/rich-text-editor/RenderDescription';
import {
  useGetWorkplaceByIdQuery
} from '@/slices/workplaceSlice';

const ReviewWorkPlace = () => {
  const { id } = useParams();
  const { data: workplaceData, isLoading, error } = useGetWorkplaceByIdQuery(id);

  const workplace = workplaceData?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !workplace) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Workplace not found</div>
        <Link to="/workplace" className="text-blue-600 hover:text-blue-700">
          ← Back to Workplaces
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/workplace"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Workplaces
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900">{workplace.title}</h1>
          <div className="flex items-center text-gray-600 mt-2">
            <MapPin className="w-5 h-5 mr-2" />
            <span>{workplace.address.fullAddress}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          {workplace.images && workplace.images[0] && (
            <img
              src={workplace.images[0].url}
              alt={workplace.title}
              className="w-full h-64 md:h-96 object-cover"
            />
          )}
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {workplace.title}
                </h2>
                <div className="flex items-center text-gray-600">
                  <Building className="w-5 h-5 mr-2" />
                  <span>Head of Station: {workplace.headOfStation}</span>
                </div>
              </div>
              
              <div className="flex items-center mt-4 md:mt-0">
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg mr-4">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 mr-1" fill="currentColor" />
                    <span className="font-semibold">{workplace.rating.average.toFixed(1)}</span>
                    <span className="text-sm ml-1">({workplace.rating.count})</span>
                  </div>
                </div>
                
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  workplace.status === 'active' 
                    ? 'bg-green-100 text-green-800'
                    : workplace.status === 'under_maintenance'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {workplace.status.replace('_', ' ').toUpperCase()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex items-center">
                <Globe className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <div className="text-sm text-gray-500">Country</div>
                  <div className="font-medium">{workplace.country.name}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <Phone className="w-6 h-6 text-green-600 mr-3" />
                <div>
                  <div className="text-sm text-gray-500">Phone</div>
                  <div className="font-medium">{workplace.contact.phones[0]}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <Mail className="w-6 h-6 text-purple-600 mr-3" />
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-medium">{workplace.contact.emails[0]}</div>
                </div>
              </div>
            </div>

            <div className="prose max-w-none">
              <RenderDescription json={workplace.description} />
            </div>
          </div>
        </div>

        {/* Additional Images */}
        {workplace.images && workplace.images.length > 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Gallery</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {workplace.images.slice(1).map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.caption || `Workplace image ${index + 2}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}

        {/* Highlight Video */}
        {workplace.highlightVideo && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Highlight Video</h3>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={workplace.highlightVideo}
                className="w-full h-64 md:h-96 rounded-lg"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Operating Hours */}
        {workplace.operatingHours && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Operating Hours</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(workplace.operatingHours).map(([day, hours]) => (
                <div key={day} className="flex justify-between items-center py-2 border-b">
                  <span className="capitalize font-medium">{day}</span>
                  <span className="text-gray-600">
                    {hours.open && hours.close ? `${hours.open} - ${hours.close}` : 'Closed'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Facilities */}
        {workplace.facilities && workplace.facilities.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Facilities & Amenities</h3>
            <div className="flex flex-wrap gap-3">
              {workplace.facilities.map((facility, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium"
                >
                  {facility}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Address</h4>
              <p className="text-gray-600">{workplace.address.fullAddress}</p>
              
              {workplace.coordinates && (
                <div className="mt-4 aspect-w-16 aspect-h-9">
                  <iframe
                    src={`https://maps.google.com/maps?q=${workplace.coordinates.latitude},${workplace.coordinates.longitude}&z=15&output=embed`}
                    className="w-full h-48 rounded-lg"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Contact Details</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <div className="font-medium">Phone Numbers</div>
                    {workplace.contact.phones.map((phone, index) => (
                      <div key={index} className="text-gray-600">{phone}</div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-purple-600 mr-3" />
                  <div>
                    <div className="font-medium">Email Addresses</div>
                    {workplace.contact.emails.map((email, index) => (
                      <div key={index} className="text-gray-600">{email}</div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <div className="font-medium">Operating Status</div>
                    <div className="text-gray-600 capitalize">{workplace.status.replace('_', ' ')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewWorkPlace;