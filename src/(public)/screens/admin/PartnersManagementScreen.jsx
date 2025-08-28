import React, { useState } from 'react'
import { toast } from 'sonner'
import { Edit, Trash2, Eye } from 'lucide-react'

import AddNewPartner from './_components/AddNewPartner'
import { 
  useGetPartnersQuery, 
  useDeletePartnerMutation,
  useUpdatePartnerMutation 
} from '@/slices/partnerApiSlice'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { S3_BASE_URL } from '@/constants'
import { Loader2 } from 'lucide-react'

const PartnersManagementScreen = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [partnerToDelete, setPartnerToDelete] = useState(null)

  const { 
    data: partnersData, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useGetPartnersQuery()

  const [deletePartner, { isLoading: isDeleting }] = useDeletePartnerMutation()
  const [updatePartner] = useUpdatePartnerMutation()

  const partners = partnersData?.data || []

  const handleDelete = async () => {
    if (!partnerToDelete) return

    try {
      await deletePartner(partnerToDelete._id).unwrap()
      toast.success('Partner deleted successfully!')
      setDeleteDialogOpen(false)
      setPartnerToDelete(null)
    } catch (error) {
      console.error('Error deleting partner:', error)
      toast.error(error?.data?.message || 'Failed to delete partner')
    }
  }

  const handleToggleStatus = async (partner) => {
    try {
      const updatedPartner = {
        ...partner,
        status: partner.status === 'active' ? 'inactive' : 'active'
      }
      
      await updatePartner(updatedPartner).unwrap()
      toast.success(`Partner ${updatedPartner.status === 'active' ? 'activated' : 'deactivated'}!`)
    } catch (error) {
      console.error('Error updating partner:', error)
      toast.error(error?.data?.message || 'Failed to update partner')
    }
  }

  if (isLoading) {
    return (
      <section className="p-4">
        <div className="flex items-center justify-center min-h-64">
          <Loader2 className="animate-spin ml-2" />
        </div>
      </section>
    )
  }

  if (isError) {
    return (
      <section className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-semibold">Error loading partners</h3>
          <p className="text-red-600">{error?.data?.message || 'Please try again later'}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="p-4">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row mb-4 gap-3 sm:items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-700">
          Partners Management
        </h1>
        
        {/* Buttons on the right (stack on mobile) */}
        <div className="flex flex-col sm:flex-row ml-auto gap-2 w-full sm:w-auto">
          <AddNewPartner refetchPartners={refetch} />
        </div>
      </div>

      <hr className="mb-4" />

      {/* Partners list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {partners.map((partner) => (
          <div
            key={partner._id}
            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Partner Image */}
            <div className="h-48 bg-gray-100 overflow-hidden">
              {partner.fileKey ? (
                <img
                  src={`${S3_BASE_URL}/${partner.fileKey}`}
                  alt={partner.title}
                  className="w-full h-full object-contain p-4"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
              ) : null}
              
              {/* Fallback */}
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-center text-gray-400">
                  <Eye className="w-12 h-12 mx-auto mb-2" />
                  <p>No image</p>
                </div>
              </div>
            </div>

            {/* Partner Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-2 truncate">
                {partner.title}
              </h3>
              
              <div className="flex items-center justify-between">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    partner.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {partner.status}
                </span>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(partner)}
                    className="text-xs"
                  >
                    {partner.status === 'active' ? 'Deactivate' : 'Activate'}
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setPartnerToDelete(partner)
                      setDeleteDialogOpen(true)
                    }}
                    disabled={isDeleting}
                    className="text-xs"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {partners.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Eye className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No partners yet
          </h3>
          <p className="text-gray-500">
            Add your first partner to get started
          </p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the partner "{partnerToDelete?.title}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}

export default PartnersManagementScreen