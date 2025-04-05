'use client';

import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header/header';
import { ProductForm } from '@/components/ui/product-form';
import { getProducts, createProduct, updateProduct, updateProductsOrder, toggleProductVisibility, deleteProduct } from '@/app/actions/products';
import { Pencil, Eye, EyeOff, Trash2 } from 'lucide-react';
import { toast, useSonner } from 'sonner';

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
  const [isEditing, setIsEditing] = useState<string | null>(null);

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

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(products);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update display order
    const updatedItems = items.map((item, index) => ({
      ...item,
      displayOrder: index,
    }));

    setProducts(updatedItems);

    try {
      await updateProductsOrder(updatedItems);
    } catch (error) {
      console.error('Error updating product order:', error);
    }
  };

  const toggleVisibility = async (product: Product) => {
    try {
      await toggleProductVisibility(product.id, !product.isVisible);
      fetchProducts();
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
  };

  const handleSave = async (data: Partial<Product>) => {
    console.log('handleSave', data);
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

  return (
      <main className="container mx-auto px-4 py-8">
        <div className="container mx-auto md:p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Manage Products</h1>
            <Button onClick={() => {
                setIsEditing('new')
              }}>Add Product</Button>
          </div>
          {isEditing && ( 
            <ProductForm
              mode={isEditing === 'new' ? 'create' : 'edit'}
              initialData={isEditing === 'new' ? undefined : products.find(p => p.id === isEditing)}
              onSubmit={handleSave}
              onClose={() => setIsEditing(null)}
            />
          )}
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="products">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {products.map((product, index) => (
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
                          <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 shadow-md transform hover:scale-[1.01] transition-all duration-300 group cursor-grab active:cursor-grabbing">
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
                                  <h3 className="font-semibold text-lg">{product.title}</h3>
                                  <p className="text-sm font-medium text-purple-600">
                                    ${product.price}
                                  </p>
                                </div>
                                <div className="flex items-center">
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
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </main>
  );
}