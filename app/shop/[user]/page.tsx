import { Card, CardContent } from '@/components/ui/card';
import { getProducts } from '@/app/actions/products';
import Link from 'next/link';
import { ShoppingCart, Star, Tag, Eye, Store } from 'lucide-react';

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  fileUrl: string;
  isVisible: boolean;
  displayOrder: number;
};

export default async function UserShopPage({ params }: { params: Promise<{ user: string }> }) {
  const { user } = await params;
  const products = (await getProducts(user)).filter(product => product.isVisible);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent inline-flex items-center gap-3">
            <Store className="w-8 h-8 sm:w-10 sm:h-10 inline-block" />
            {`${user}'s Shop`}
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            Discover amazing digital products
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {products.map((product) => (
            <Link href={`/shop/${user}/${product.id}`} key={product.id}>
              <Card className="group h-full overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] bg-white/80 backdrop-blur-sm hover:bg-white/90 border-transparent hover:border-purple-100">
                <div className="relative">
                  {/* Product Image */}
                  <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                    />
                  </div>
                  
                  {/* Price Tag */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 group-hover:bg-purple-600 transition-colors">
                    <Tag className="w-4 h-4 text-purple-600 group-hover:text-white" />
                    <span className="font-bold text-purple-600 group-hover:text-white">
                      ${product.price}
                    </span>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 group-hover:text-purple-600 transition-colors line-clamp-1">
                        {product.title}
                      </h2>
                      <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                    <div className="flex items-center gap-2 text-purple-600 font-medium text-sm">
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </div>
                  </div>

                  {/* Buy Button */}
                  <div className="mt-6 transition-transform transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium">
                      <ShoppingCart className="w-4 h-4" />
                      <span>Buy Now</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}