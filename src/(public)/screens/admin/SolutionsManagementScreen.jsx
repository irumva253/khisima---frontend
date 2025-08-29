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
import AddNewSolutionCategory from './_components/AddNewSolutionCategory'
import SolutionCategoriesList from './_components/SolutionCategoriesList'
import SolutionsList from './_components/SolutionsList'

const SolutionsManagementScreen = () => {
  return (
    <section className="p-4">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row mb-4 gap-3 sm:items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-700">
          Solutions Management
        </h1>
        
        {/* Buttons on the right (stack on mobile) */}
        <div className="flex flex-col sm:flex-row ml-auto gap-2 w-full sm:w-auto">
          <AddNewSolutionCategory />
          <Link to="/admin/solutions/create" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">Add New Solution</Button>
          </Link>
        </div>
      </div>

      <hr className="mb-4" />

      {/* Tabs Section */}
      <Tabs defaultValue="solutions" className="w-full">
        {/* Tabs list wraps on mobile */}
        <TabsList className="mb-4 flex flex-wrap w-full sm:w-auto bg-blue-200/50 dark:bg-blue-900/20 rounded">
          <TabsTrigger value="categories" className="flex-1 sm:flex-none">
            Solutions Categories
          </TabsTrigger>
          <TabsTrigger value="solutions" className="flex-1 sm:flex-none">
            All Solutions
          </TabsTrigger>
        </TabsList>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Solution Categories List</h2>
              <CardDescription>
                View and manage your solution categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SolutionCategoriesList /> 
            </CardContent>
          </Card>
        </TabsContent>

        {/* Solutions Tab */}
        <TabsContent value="solutions">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">List of Solutions</h2>
              <CardDescription>
                View and manage your solutions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SolutionsList /> 
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  )
}

export default SolutionsManagementScreen

