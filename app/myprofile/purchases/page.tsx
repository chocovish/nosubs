'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/use-user';
import { PurchaseData, getUserPurchases, getPurchaseStats } from '@/app/actions/purchases';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Download, Calendar, DollarSign, Package, ExternalLink, Search } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Header } from '@/components/header/header';
import { ProfileSidebar } from '@/components/profile-sidebar';

const PurchasesPage = () => {
  const user = useUser();
  const router = useRouter();
  const [purchases, setPurchases] = useState<PurchaseData[]>([]);
  const [filteredPurchases, setFilteredPurchases] = useState<PurchaseData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ totalPurchases: 0, totalSpent: 0 });

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        setIsLoading(true);
        const purchasesData = await getUserPurchases();
        const statsData = await getPurchaseStats();
        setPurchases(purchasesData);
        setFilteredPurchases(purchasesData);
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching purchases:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchPurchases();
    }
  }, [user]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = purchases.filter(
        purchase => 
          purchase.product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          purchase.seller.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPurchases(filtered);
    } else {
      setFilteredPurchases(purchases);
    }
  }, [searchTerm, purchases]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">You need to be logged in</h1>
        <p className="text-muted-foreground mb-6">Please login to view your purchase history.</p>
        <Button onClick={() => router.push('/login')}>Login</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <ShoppingBag className="h-8 w-8 text-blue-600" />
            My Purchases
          </h1>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <ProfileSidebar />
          <div className="flex-1">
            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <Card className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">
                    Total Purchases
                  </CardTitle>
                  <Package className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-800">{stats.totalPurchases}</div>
                  <p className="text-xs text-gray-500">
                    Products purchased
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-white to-purple-50 border border-purple-100 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">
                    Total Spent
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-800">${stats.totalSpent.toFixed(2)}</div>
                  <p className="text-xs text-gray-500">
                    Lifetime spending
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">
                    Latest Purchase
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-800">
                    {purchases.length > 0 
                      ? format(new Date(purchases[0].createdAt), 'dd MMM yyyy') 
                      : 'No purchases'}
                  </div>
                  <p className="text-xs text-gray-500">
                    {purchases.length > 0 ? purchases[0].product.title : ''}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-8 bg-gradient-to-br from-white to-blue-50 border border-blue-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-800">Purchase History</CardTitle>
                <CardDescription className="text-gray-600">A list of all your purchases and downloads.</CardDescription>
                <div className="flex w-full max-w-sm items-center space-x-2 mt-2">
                  <Input
                    placeholder="Search purchases..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 border-blue-200 focus:border-blue-400"
                  />
                  <Button variant="ghost" type="submit" size="icon" className="text-blue-600 hover:text-blue-800 hover:bg-blue-100">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your purchases...</p>
                  </div>
                ) : filteredPurchases.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 border-b border-blue-100">
                          <TableHead className="text-gray-700">Product</TableHead>
                          <TableHead className="hidden md:table-cell text-gray-700">Date</TableHead>
                          <TableHead className="text-gray-700">Price</TableHead>
                          <TableHead className="hidden md:table-cell text-gray-700">Seller</TableHead>
                          <TableHead className="text-right text-gray-700">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPurchases.map((purchase) => (
                          <TableRow key={purchase.id} className="hover:bg-blue-50/50">
                            <TableCell className="min-w-[200px]">
                              <div className="flex items-center space-x-3">
                                <div className="relative h-12 w-12 overflow-hidden rounded-md border border-blue-100">
                                  {purchase.product.imageUrl && (
                                    <img
                                      src={purchase.product.imageUrl}
                                      alt={purchase.product.title}
                                      className="object-cover w-full h-full"
                                    />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800">{purchase.product.title}</p>
                                  <p className="text-xs text-gray-500 md:hidden">
                                    {format(new Date(purchase.createdAt), 'dd MMM yyyy')}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-gray-700">
                              {format(new Date(purchase.createdAt), 'dd MMM yyyy')}
                            </TableCell>
                            <TableCell className="text-gray-700">${purchase.amount.toFixed(2)}</TableCell>
                            <TableCell className="hidden md:table-cell text-gray-700">
                              {purchase.seller.name || 'Unknown Seller'}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button variant="ghost" size="icon" asChild className="text-blue-600 hover:text-blue-800 hover:bg-blue-100">
                                  <Link href={purchase.product.fileUrl} target="_blank">
                                    <Download className="h-4 w-4" />
                                    <span className="sr-only">Download</span>
                                  </Link>
                                </Button>
                                <Button variant="ghost" size="icon" asChild className="text-purple-600 hover:text-purple-800 hover:bg-purple-100">
                                  <Link 
                                    href={`/shop/${purchase.seller.shopSlug}/${purchase.product.id}`} 
                                    target="_blank"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                    <span className="sr-only">View Product</span>
                                  </Link>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ShoppingBag className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2 text-gray-800">No purchases found</h3>
                    <p className="text-gray-600 mb-6">
                      {searchTerm 
                        ? "We couldn't find any purchases matching your search." 
                        : "You haven't made any purchases yet."}
                    </p>
                    {searchTerm ? (
                      <Button variant="outline" onClick={() => setSearchTerm('')} className="border-blue-300 text-blue-700 hover:bg-blue-50">
                        Clear Search
                      </Button>
                    ) : (
                      <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700">
                        <Link href="/shop">Browse Products</Link>
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PurchasesPage; 