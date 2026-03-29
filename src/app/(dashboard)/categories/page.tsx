"use client";

import { useState } from "react";
import { 
    useGetCategoriesQuery, 
    useCreateCategoryMutation 
} from "@/redux/features/product/productApi";
import { Button } from "@/components/ui/button";
import { 
    Plus, 
    Layers, 
    MoreVertical, 
    Edit, 
    Trash2, 
    Search
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import CategoryFormModal from "@/components/categories/CategoryFormModal";

export default function CategoriesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: categoriesData, isLoading } = useGetCategoriesQuery(undefined);

    const categories = categoriesData?.data || [];

    return (
        <div className="p-6 space-y-6 max-w-[1200px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                    <p className="text-gray-500 text-sm">Organize your products into meaningful groups.</p>
                </div>
                <Button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all rounded-xl"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New Category
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    [1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-40 w-full rounded-2xl" />
                    ))
                ) : categories.length > 0 ? (
                    categories.map((category: any) => (
                        <div 
                            key={category._id} 
                            className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600">
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                                    <Layers className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">{category.name}</h3>
                                    <p className="text-xs text-gray-400 font-medium">Created: {new Date(category.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-gray-50 mt-2">
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    {category.productCount || 0} Products
                                </div>
                                <div className="flex gap-2">
                                    <button className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-800">
                                        View All
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <Layers className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-gray-400 font-medium italic">No categories created yet.</h3>
                    </div>
                )}
            </div>

            <CategoryFormModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </div>
    );
}
