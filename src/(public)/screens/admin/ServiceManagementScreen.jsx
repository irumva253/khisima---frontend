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
import {Link} from 'react-router-dom'
import AddNewServiceCategory from './_components/AddNewServiceCategory'
import ServiceCategoriesList from './_components/ServiceCategoriesList'
import ServicesList from './_components/ServicesList'

const ServiceManagementScreen = () => {
  return (
    <section className="p-4">
      <div className="flex mb-4 items-center">
        <h1 className="text-2xl font-bold text-gray-500">Service Management</h1>
        <div className="ml-auto gap-2 flex">
           <AddNewServiceCategory />
           <Link to="/admin/services/create">
             <Button>Add New Service</Button>
           </Link>
        </div>
      </div>

      <hr className="mb-4" />

      <Tabs defaultValue="services" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="categories">Service Categories</TabsTrigger>
          <TabsTrigger value="services">All Services</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Service Categories List</h2>
              <CardDescription>View and manage your service categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ServiceCategoriesList /> 
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">List of Services</h2>
              <CardDescription>View and manage your services</CardDescription>
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
