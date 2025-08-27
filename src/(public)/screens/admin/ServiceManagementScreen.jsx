import React from 'react'
import {
  Card,
  CardDescription,
  CardHeader,
  CardContent,
} from '@/components/ui/card.jsx'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Link } from 'react-router-dom'
import AddNewServiceCategory from './_components/AddNewServiceCategory'
import ServiceCategoriesList from './_components/ServiceCategoriesList'
import ServicesList from './_components/ServicesList'

const ServiceManagementScreen = () => {
  return (
    <section className="p-4">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row mb-4 gap-3 sm:items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-700">
          Service Management
        </h1>
        
        {/* Buttons on the right (stack on mobile) */}
        <div className="flex flex-col sm:flex-row ml-auto gap-2 w-full sm:w-auto">
          <AddNewServiceCategory />
          <Link to="/admin/services/create" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">Add New Service</Button>
          </Link>
        </div>
      </div>

      <hr className="mb-4" />

      {/* Tabs Section */}
      <Tabs defaultValue="services" className="w-full">
        {/* Tabs list wraps on mobile */}
        <TabsList className="mb-4 flex flex-wrap w-full sm:w-auto">
          <TabsTrigger value="categories" className="flex-1 sm:flex-none">
            Service Categories
          </TabsTrigger>
          <TabsTrigger value="services" className="flex-1 sm:flex-none">
            All Services
          </TabsTrigger>
        </TabsList>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Service Categories List</h2>
              <CardDescription>
                View and manage your service categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ServiceCategoriesList /> 
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">List of Services</h2>
              <CardDescription>
                View and manage your services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ServicesList /> 
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  )
}

export default ServiceManagementScreen
