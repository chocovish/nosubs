'use client';

import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { ProductForm } from '@/components/ui/product-form';
import { getProducts, createProduct, updateProduct, updateProductsOrder, toggleProductVisibility, deleteProduct } from '@/app/actions/products';
import { Pencil, Eye, EyeOff, Trash2, Search, GripVertical, X, Info, Save, RotateCcw, Download, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { useUserProfile } from '@/hooks/use-user';

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  fileUrl: string;
  isVisible: boolean;
  displayOrder: number;
  thumbnail?: File[];
  productFile?: File[],
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [originalProducts, setOriginalProducts] = useState<Product[]>([]); // Store original order
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRearrangeMode, setIsRearrangeMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [_,setEditForm] = useState<Partial<Product>>({
    title: '',
    description: '',
    price: 0,
    imageUrl: '',
    fileUrl: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) => 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(products);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update display order locally without saving to backend
    const updatedItems = items.map((item, index) => ({
      ...item,
      displayOrder: index,
    }));

    setProducts(updatedItems);
    setFilteredProducts(updatedItems.filter((product) => 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    ));
    
    // Mark that there are unsaved changes
    setHasChanges(true);
  };

  const saveRearrangement = async () => {
    try {
      await updateProductsOrder(products);
      setHasChanges(false);
      toast.success('Product order saved successfully');
    } catch (error) {
      console.error('Error updating product order:', error);
      toast.error('Failed to save product order');
    }
  };

  const cancelRearrangement = () => {
    // Restore original arrangement
    setProducts(originalProducts);
    setFilteredProducts(originalProducts.filter((product) => 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    ));
    setHasChanges(false);
  };

  const enterRearrangeMode = () => {
    // Store original order before rearranging
    setOriginalProducts([...products]);
    setIsRearrangeMode(true);
  };

  const exitRearrangeMode = () => {
    // Ask for confirmation if there are unsaved changes
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to exit without saving?')) {
        setProducts(originalProducts);
        setFilteredProducts(originalProducts.filter((product) => 
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
        ));
        setHasChanges(false);
        setIsRearrangeMode(false);
      }
    } else {
      setIsRearrangeMode(false);
    }
  };

  const toggleVisibility = async (product: Product) => {
    try {
      await toggleProductVisibility(product.id, !product.isVisible);
      fetchProducts();
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDelete = async (product: Product) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(product.id);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleEdit = (product: Product) => {
    setIsEditing(product.id);
    setEditForm(product);
    setSelectedProduct(null);
  };

  const handleSave = async (data: Partial<Product>) => {
    try {
      if (isEditing === 'new') {
        await createProduct(data as Omit<Product, 'id' | 'displayOrder' | 'isVisible'>);
      } else if (isEditing) {
        await updateProduct(isEditing, data);
      }
      setIsEditing(null);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const viewProductDetails = (product: Product) => {
    setSelectedProduct(product);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="container mx-auto md:p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Products</h1>
          <Button variant="gradient" onClick={() => {
            if (isEditing === 'new') {
              setIsEditing(null);
            } else {
              setIsEditing('new');
            }
          }}>Add Product</Button>
        </div>

        {isEditing === "new" && ( 
          <ProductForm
            mode="create"
            onSubmit={handleSave}
            onClose={() => setIsEditing(null)}
          />
        )}

        <div className="mb-4 flex flex-col md:flex-row gap-4">
          {!isRearrangeMode ? (
            <Button
              variant="outline"
              onClick={enterRearrangeMode}
              className="md:mr-2 whitespace-nowrap order-2 md:order-1"
            >
              Rearrange Products
            </Button>
          ) : (
            <div className="flex gap-2 order-2 md:order-1">
              <Button
                variant="outline"
                onClick={exitRearrangeMode}
                className="whitespace-nowrap"
              >
                Exit Rearrange
              </Button>
              <Button
                variant="default"
                onClick={saveRearrangement}
                className="whitespace-nowrap bg-green-600 hover:bg-green-700"
                disabled={!hasChanges}
              >
                <Save className="h-4 w-4 mr-2" /> Save Order
              </Button>
              <Button
                variant="outline"
                onClick={cancelRearrangement}
                className="whitespace-nowrap"
                disabled={!hasChanges}
              >
                <RotateCcw className="h-4 w-4 mr-2" /> Reset
              </Button>
            </div>
          )}
          
          <div className="relative flex-1 order-1 md:order-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              className="pl-10"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {isRearrangeMode ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="products">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {filteredProducts.map((product, index) => (
                    <Draggable
                      key={product.id}
                      draggableId={product.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Card className={`p-4 shadow-md transform hover:scale-[1.01] transition-all duration-300 ${product.isVisible ? 'bg-gradient-to-r from-blue-50 to-purple-50' : 'bg-gray-100 opacity-75'}`}>
                            <div className="flex items-center space-x-4">
                              <div className="text-gray-400">
                                <GripVertical className="h-5 w-5" />
                              </div>
                              <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                                <img
                                  src={product.imageUrl}
                                  alt={product.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-grow">
                                <h3 className={`font-semibold text-lg ${!product.isVisible && 'text-gray-500'}`}>{product.title}</h3>
                                <p className={`text-sm font-medium ${product.isVisible ? 'text-purple-600' : 'text-gray-500'}`}>
                                  ${product.price}
                                </p>
                                {!product.isVisible && (
                                  <span className="text-xs text-gray-500">Hidden</span>
                                )}
                              </div>
                            </div>
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className={`p-4 shadow-md transform hover:scale-[1.01] transition-all duration-300 ${product.isVisible ? 'bg-gradient-to-r from-blue-50 to-purple-50' : 'bg-gray-100 opacity-75'}`}
              >
                {isEditing === product.id ? (
                  <div>
                    <ProductForm
                      mode="edit"
                      initialData={product}
                      onSubmit={handleSave}
                      onClose={() => setIsEditing(null)}
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className={`font-semibold text-lg ${!product.isVisible && 'text-gray-500'}`}>{product.title}</h3>
                      <p className={`text-sm font-medium ${product.isVisible ? 'text-purple-600' : 'text-gray-500'}`}>
                        ${product.price}
                      </p>
                      {!product.isVisible && (
                        <span className="text-xs text-gray-500">Hidden</span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => viewProductDetails(product)}
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleVisibility(product)}
                      >
                        {product.isVisible ? 
                          <EyeOff className="h-4 w-4" /> : 
                          <Eye className="h-4 w-4" />
                        }
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDelete(product)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Product detail dialog component */}
        <ProductDetailDialog
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onEdit={handleEdit}
          onToggleVisibility={toggleVisibility}
        />
      </div>
    </main>
  );
}


// Product Detail Dialog Component
function ProductDetailDialog({ 
  product, 
  isOpen, 
  onClose, 
  onEdit, 
  onToggleVisibility 
}: { 
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (product: Product) => void;
  onToggleVisibility: (product: Product) => void;
}) {
  const {userProfile} =  useUserProfile();
  if (!product) return null;
  const handleShareProduct = () => {
    // Create a URL for the product
    const productUrl = `${window.location.origin}/shop/${userProfile?.shopSlug}}/${product.id}`;
    
    // Copy the URL to clipboard
    navigator.clipboard.writeText(productUrl)
      .then(() => {
        toast.success('Product link copied to clipboard!');
      })
      .catch((error) => {
        console.error('Error copying to clipboard:', error);
        toast.error('Failed to copy link to clipboard');
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[98vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-6xl p-0 overflow-y-auto bg-gradient-to-r from-white to-purple-50 dark:from-gray-900 dark:to-gray-800 h-[95vh] md:h-auto md:max-h-[85vh] mx-0 w-full">
          <div className="flex flex-col md:flex-row min-h-0 h-full">
            {/* Left column - Image and actions */}
            <div className="w-full md:w-2/5 bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-800 dark:to-gray-700 p-4 sm:p-6">
              <div className="rounded-lg overflow-hidden bg-white shadow-lg mb-6">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-auto object-cover aspect-square"
                />
              </div>
              
              <div className="flex flex-col space-y-4">
                <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300">Price</h3>
                    <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300">Status</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      product.isVisible 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {product.isVisible ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    className="flex-1"
                    variant="outline"
                    onClick={() => onEdit(product)}
                  >
                    <Pencil className="h-4 w-4 mr-2" /> Edit
                  </Button>
                  <Button
                    className="flex-1"
                    variant={product.isVisible ? "destructive" : "default"}
                    size="default"
                    onClick={() => onToggleVisibility(product)}
                  >
                    {product.isVisible ? 
                      <><EyeOff className="h-4 w-4 mr-2" /> Hide</> : 
                      <><Eye className="h-4 w-4 mr-2" /> Show</>
                    }
                  </Button>
                </div>
                
                {product.fileUrl && (
                  <Button variant="outline" className="bg-white/80 hover:bg-white dark:bg-gray-800 dark:hover:bg-gray-700">
                    <Download className="h-4 w-4 mr-2" /> Download File
                  </Button>
                )}
                
                <Button 
                  variant="ghost" 
                  className="border border-gray-200 dark:border-gray-700"
                  onClick={handleShareProduct}
                >
                  <Share2 className="h-4 w-4 mr-2" /> Copy Product Link
                </Button>
              </div>
            </div>
            
            {/* Right column - Title and description */}
            <div className="w-full md:w-3/5 p-4 sm:p-6">
              <DialogHeader className="mb-6 text-left">
                <DialogTitle className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {product.title}
                </DialogTitle>
                {!product.isVisible && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                      <EyeOff className="h-3 w-3 mr-1" /> Hidden Product
                    </span>
                  </div>
                )}
              </DialogHeader>
              
              <div className="flex flex-col space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Description</h3>
                  <div 
                    className="prose prose-purple max-w-none dark:prose-invert text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg shadow-sm" 
                    dangerouslySetInnerHTML={{ __html: product.description }} 
                  />
                </div>
                
                <div className="bg-blue-50/70 dark:bg-gray-800/70 rounded-lg p-4 shadow-sm">
                  <h3 className="text-sm font-semibold mb-2 text-blue-800 dark:text-blue-400">Product Details</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-600 dark:text-gray-400">Product ID:</div>
                    <div className="font-mono text-gray-800 dark:text-gray-200">{product.id.slice(0, 8)}...</div>
                    <div className="text-gray-600 dark:text-gray-400">Display Order:</div>
                    <div className="font-mono text-gray-800 dark:text-gray-200">{product.displayOrder}</div>
                  </div>
                </div>
                
                {/* Add bottom padding to ensure scrolling works well on mobile */}
                <div className="pb-6 md:pb-0"></div>
              </div>
            </div>
          </div>
      </DialogContent>
    </Dialog>
  );
}