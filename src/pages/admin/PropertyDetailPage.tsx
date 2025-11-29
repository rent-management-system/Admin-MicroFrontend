import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  getMockPropertyById, 
  updatePropertyStatus,
  type PropertyStatus
} from "@/services/mockDataService";
import { toast } from "sonner";
import { ArrowLeft } from 'lucide-react';

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch property details
  const { data: property, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: () => getMockPropertyById(id!)
  });

  // Update property status
  const updateStatus = useMutation({
    mutationFn: async (status: PropertyStatus) => {
      if (!id) throw new Error('Property ID is required');
      return updatePropertyStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      toast.success('Property status updated successfully');
    },
    onError: (error) => {
      console.error('Error updating property status:', error);
      toast.error('Failed to update property status');
    },
  });

  if (isLoading) {
    return <div className="container mx-auto py-6">Loading property details...</div>;
  }

  if (error || !property) {
    return (
      <div className="container mx-auto py-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h2 className="text-lg font-medium text-red-800">Error loading property</h2>
          <p className="mt-1 text-sm text-red-700">
            {error instanceof Error ? error.message : 'Property not found'}
          </p>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Status badge component
  const StatusBadge = ({ status }: { status: PropertyStatus }) => {
    const statusVariants = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      APPROVED: 'bg-green-100 text-green-800 border-green-200',
      REJECTED: 'bg-red-100 text-red-800 border-red-200',
      RESERVED: 'bg-blue-100 text-blue-800 border-blue-200',
      DELETED: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full border ${statusVariants[status]}`}>
        {status}
      </span>
    );
  };

  // Action buttons based on current status
  const renderActionButtons = () => {
    switch (property.status) {
      case 'PENDING':
        return (
          <div className="flex space-x-2">
            <Button 
              variant="default" 
              onClick={() => updateStatus.mutate('APPROVED')}
            >
              Approve
            </Button>
            <Button 
              variant="outline" 
              onClick={() => updateStatus.mutate('REJECTED')}
            >
              Reject
            </Button>
          </div>
        );
      case 'APPROVED':
        return (
          <div className="flex space-x-2">
            <Button 
              variant="default" 
              onClick={() => updateStatus.mutate('RESERVED')}
            >
              Mark as Reserved
            </Button>
            <Button 
              variant="outline" 
              onClick={() => updateStatus.mutate('PENDING')}
            >
              Move to Pending
            </Button>
          </div>
        );
      case 'RESERVED':
        return (
          <div className="flex space-x-2">
            <Button 
              variant="default" 
              onClick={() => updateStatus.mutate('APPROVED')}
            >
              Make Available
            </Button>
          </div>
        );
      case 'REJECTED':
        return (
          <div className="flex space-x-2">
            <Button 
              variant="default" 
              onClick={() => updateStatus.mutate('PENDING')}
            >
              Move to Pending
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-2 pl-0"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Button>
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">{property.title}</h1>
            <StatusBadge status={property.status} />
          </div>
          <p className="text-muted-foreground">{property.location}</p>
        </div>
        <div className="flex space-x-2">
          {renderActionButtons()}
          <Button 
            variant="outline" 
            onClick={() => updateStatus.mutate('DELETED')}
            disabled={property.status === 'DELETED'}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Property images */}
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent>
              {property.photos && property.photos.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {property.photos.map((photo, index) => (
                    <div key={index} className="aspect-video bg-muted rounded-md overflow-hidden">
                      <img 
                        src={photo} 
                        alt={`Property ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">No images available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Property details */}
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="amenities">Amenities</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Property Type</h4>
                      <p className="text-sm text-muted-foreground capitalize">
                        {property.house_type || 'N/A'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Bedrooms</h4>
                      <p className="text-sm text-muted-foreground">
                        {property.bedrooms || 'N/A'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Bathrooms</h4>
                      <p className="text-sm text-muted-foreground">
                        {property.bathrooms || 'N/A'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Area</h4>
                      <p className="text-sm text-muted-foreground">
                        {property.area_sqm ? `${property.area_sqm} m²` : 'N/A'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Price</h4>
                      <p className="text-sm text-muted-foreground">
                        ETB {property.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Status</h4>
                      <div className="text-sm">
                        <StatusBadge status={property.status} />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="description" className="pt-4">
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {property.description || 'No description provided.'}
                  </p>
                </TabsContent>
                <TabsContent value="amenities" className="pt-4">
                  {property.amenities && property.amenities.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {property.amenities.map((amenity, index) => (
                        <Badge key={index} variant="secondary" className="capitalize">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No amenities listed.</p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Owner information */}
          <Card>
            <CardHeader>
              <CardTitle>Owner Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Name</h4>
                  <p className="text-sm text-muted-foreground">
                    {property.user_id || 'N/A'}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Contact</h4>
                  <p className="text-sm text-muted-foreground">
                    {property.user_id ? `User ID: ${property.user_id}` : 'N/A'}
                  </p>
                </div>
                <Button variant="outline" className="w-full">
                  Contact Owner
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Property activity */}
          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Listed On</h4>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(property.created_at), 'MMMM d, yyyy')}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Last Updated</h4>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(property.updated_at), 'MMMM d, yyyy')}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Property ID</h4>
                  <p className="text-sm text-muted-foreground font-mono">
                    {property.id}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full">
                View on Map
              </Button>
              <Button variant="outline" className="w-full">
                View Similar Properties
              </Button>
              <Button variant="outline" className="w-full">
                Print Details
              </Button>
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={() => updateStatus.mutate('DELETED')}
                disabled={property.status === 'DELETED'}
              >
                Delete Property
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
