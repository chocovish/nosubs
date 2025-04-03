'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '../../lib/auth';

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  fileUrl: string;
  isVisible: boolean;
  displayOrder: number;
};

export async function getProducts(userId) {
  const user = await auth();
  userId = userId ?? user?.id;
  if (!userId) {
    throw new Error('User not authenticated');
  }
  try {
    const products = await prisma.product.findMany({
      where:  { userId },
      orderBy: { displayOrder: 'asc' }
    });
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
}

export async function getProductsBySlug(slug: string) {
  const user = await prisma.user.findUnique({
    where: { shopSlug: slug },
    select: { id: true }
  });
  return getProducts(user?.id);
}

export async function createProduct(data: Omit<Product, 'id' | 'displayOrder' | 'isVisible'>) {
  try {
    const user = await auth();
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    const lastProduct = await prisma.product.findFirst({
      orderBy: { displayOrder: 'desc' }
    });
    const displayOrder = lastProduct ? lastProduct.displayOrder + 1 : 0;

    const product = await prisma.product.create({
      data: {
        ...data,
        isVisible: true,
        displayOrder,
        userId: user.id
      }
    });
    return product;
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error('Failed to create product');
  }
}

export async function updateProduct(id: string, data: Partial<Product>) {
  try {
    const product = await prisma.product.update({
      where: { id },
      data
    });
    return product;
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error('Failed to update product');
  }
}

export async function updateProductsOrder(products: Product[]) {
  try {
    const updates = products.map((product) =>
      prisma.product.update({
        where: { id: product.id },
        data: { displayOrder: product.displayOrder }
      })
    );
    await prisma.$transaction(updates);
    return true;
  } catch (error) {
    console.error('Error updating product order:', error);
    throw new Error('Failed to update product order');
  }
}

export async function toggleProductVisibility(id: string, isVisible: boolean) {
  try {
    const product = await prisma.product.update({
      where: { id },
      data: { isVisible }
    });
    return product;
  } catch (error) {
    console.error('Error toggling product visibility:', error);
    throw new Error('Failed to toggle product visibility');
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id }
    });
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error('Failed to delete product');
  }
}

export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id }
    });
    return product;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw new Error('Failed to fetch product by ID');
  }
} 
