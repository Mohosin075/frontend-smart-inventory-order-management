"use client";

import { useState } from "react";
import { 
    useGetProductsQuery, 
    useCreateProductMutation, 
    useGetCategoriesQuery 
} from "@/redux/features/product/productApi";
import { Button } from "@/components/ui/button";
import { 
    Plus, 
    Search, 
    Filter, 
    MoreVertical, 
    Edit, 
    Trash2, 
    AlertCircle 
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import ProductFormModal from "@/components/products/ProductFormModal";

export default function ProductsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: productsData, isLoading } = useGetProductsQuery({ searchTerm });
    const { data: categoriesData } = useGetCategoriesQuery(undefined);

    const products = productsData?.data || [];

    return (
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-500 text-sm">Manage your inventory and stock levels.</p>
                </div>
                <Button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                </Button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button variant="outline" size="sm" className="w-full md:w-auto text-gray-600">
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Category</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Price</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Stock</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                [1, 2, 3, 4, 5].map((i) => (
                                    <tr key={i}>
                                        <td colSpan={6} className="px-6 py-4"><Skeleton className="h-6 w-full" /></td>
                                    </tr>
                                ))
                            ) : products.length > 0 ? (
                                products.map((product: any) => (
                                    <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900">{product.name}</div>
                                            {product.stock <= product.threshold && (
                                                <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-red-500 uppercase">
                                                    <AlertCircle className="w-3 h-3" /> Low Stock
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 text-center">{product.category?.name || "Uncategorized"}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 text-center">${product.price.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`text-sm font-bold ${product.stock <= product.threshold ? 'text-red-600' : 'text-gray-700'}`}>
                                                {product.stock}
                                            </span>
                                            <span className="text-gray-400 text-xs ml-1">/{product.threshold} min</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                product.status === 'Active' 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-red-100 text-red-700'
                                            }`}>
                                                {product.status || (product.stock > 0 ? 'Active' : 'Out of Stock')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">No products found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ProductFormModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                categories={categoriesData?.data || []}
            />
        </div>
    );
}
